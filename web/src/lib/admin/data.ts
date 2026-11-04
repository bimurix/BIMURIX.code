import "server-only";
import { pick, type Localized } from "@/lib/i18n/pick";
import { fetchPublished } from "@/sanity/fetch";
import { QUOTE_FORM_QUERY } from "@/sanity/queries";
import type { QuoteFormContent } from "@/lib/quote/form-content";
import type { NetworkColor } from "@/sanity/types-content";
import type { AdminContext } from "./auth";
import { isStatus, type QuoteStatus } from "./labels";

export const PAGE_SIZE = 25;

export type RequestRow = {
  id: string;
  reference: string;
  created_at: string;
  full_name: string;
  company: string;
  email: string;
  phone: string | null;
  locale: "fr" | "en";
  preferred_language: "fr" | "en";
  service: string;
  project_type: string | null;
  region: string | null;
  phase: string | null;
  timeline: string | null;
  budget_range: string | null;
  software_formats: string[];
  description: string;
  status: QuoteStatus;
  consent_at: string;
  consent_policy_version: string;
  source_path: string | null;
  notification_sent_at: string | null;
  ack_email_sent_at: string | null;
  last_reply_at: string | null;
  anonymized_at: string | null;
};

export type MessageRow = { id: string; kind: "outbound" | "inbound" | "note" | "event"; subject: string | null; body: string; created_at: string; author_id: string | null };

export type Filters = { status?: QuoteStatus; service?: string; q?: string; days?: number; page: number };

export function parseFilters(sp: Record<string, string | string[] | undefined>): Filters {
  const one = (k: string) => (typeof sp[k] === "string" ? (sp[k] as string) : undefined);
  const days = Number(one("jours"));
  const page = Math.max(1, Number(one("page")) || 1);
  const q = one("q")?.trim().slice(0, 80);
  return { status: isStatus(one("statut")) ? (one("statut") as QuoteStatus) : undefined, service: one("service")?.slice(0, 80), q: q || undefined, days: [7, 30, 90, 365].includes(days) ? days : undefined, page };
}

/** Liste paginée (RLS : seules les données visibles par un admin reviennent). */
export async function listRequests({ supabase }: AdminContext, f: Filters) {
  let query = supabase
    .from("quote_requests")
    .select("id, reference, created_at, full_name, company, service, region, status, last_reply_at, anonymized_at", { count: "exact" })
    .order("created_at", { ascending: false })
    .range((f.page - 1) * PAGE_SIZE, f.page * PAGE_SIZE - 1);
  if (f.status) query = query.eq("status", f.status);
  else query = query.neq("status", "spam");
  if (f.service) query = query.eq("service", f.service);
  if (f.days) query = query.gte("created_at", new Date(Date.now() - f.days * 86_400_000).toISOString());
  if (f.q) {
    // Recherche simple ; les caractères spéciaux de PostgREST sont retirés de la saisie.
    const term = f.q.replace(/[%,()*\\]/g, " ");
    query = query.or(`full_name.ilike.%${term}%,company.ilike.%${term}%,email.ilike.%${term}%,reference.ilike.%${term}%`);
  }
  const { data, count, error } = await query;
  if (error) throw error;
  return { rows: (data ?? []) as Array<Pick<RequestRow, "id" | "reference" | "created_at" | "full_name" | "company" | "service" | "region" | "status" | "last_reply_at" | "anonymized_at">>, total: count ?? 0 };
}

export async function getRequest({ supabase }: AdminContext, id: string) {
  const { data, error } = await supabase.from("quote_requests").select("*").eq("id", id).maybeSingle();
  if (error) throw error;
  return data as RequestRow | null;
}

export async function getMessages({ supabase }: AdminContext, id: string) {
  const { data, error } = await supabase.from("quote_messages").select("id, kind, subject, body, created_at, author_id").eq("request_id", id).order("created_at");
  if (error) throw error;
  return (data ?? []) as MessageRow[];
}

export type Stats = { new_7d: number; new_30d: number; awaiting: number; avg_first_reply_hours: number | null; by_service: Record<string, number> };

export async function getStats({ supabase }: AdminContext): Promise<Stats> {
  const { data, error } = await supabase.rpc("admin_stats");
  if (error) throw error;
  return data as Stats;
}

export type ServiceInfo = { value: string; label: string; network?: NetworkColor; code?: string };
export type ReplyTemplate = { name: string; subject?: Localized; body?: Localized };

/** Contenu Sanity utile au tableau de bord : noms des services/listes et modèles de réponse. */
export async function getAdminContent() {
  const content = await fetchPublished<QuoteFormContent & { emails?: { replyTemplates?: ReplyTemplate[]; signature?: Localized } }>({ query: QUOTE_FORM_QUERY });
  const services: ServiceInfo[] = [
    ...(content?.services ?? []).map((s) => ({ value: s._id, label: pick(s.title, "fr", s._id), network: s.network, code: s.code })),
    ...(content?.form?.extraServiceOptions ?? []).map((o) => ({ value: o.value, label: pick(o.label, "fr", o.value) })),
  ];
  const labelFor = (list: keyof NonNullable<NonNullable<QuoteFormContent>["form"]>, value: string | null) => {
    if (!value) return "—";
    const options = (content?.form?.[list] as Array<{ value: string; label?: Localized }> | undefined) ?? [];
    return pick(options.find((o) => o.value === value)?.label, "fr", value);
  };
  return { services, labelFor, templates: content?.emails?.replyTemplates ?? [], signature: content?.emails?.signature, fromEmail: content?.fromEmail, fromName: content?.emails?.fromName };
}
