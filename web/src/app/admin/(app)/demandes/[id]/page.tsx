import Link from "next/link";
import { notFound } from "next/navigation";
import { z } from "zod";
import { requireAdmin } from "@/lib/admin/auth";
import { getAdminContent, getMessages, getRequest } from "@/lib/admin/data";
import { formatDate } from "@/lib/admin/labels";
import { pick } from "@/lib/i18n/pick";
import { fillTemplate } from "@/lib/quote/templates";
import { NetworkSwatch } from "@/ui/components/NetworkSwatch";
import { AnonymizeButton } from "@/ui/admin/AnonymizeButton";
import { NoteForm } from "@/ui/admin/NoteForm";
import { ReplyComposer } from "@/ui/admin/ReplyComposer";
import { StatusSelect } from "@/ui/admin/StatusSelect";
import { Timeline } from "@/ui/admin/Timeline";

// Session admin lue à chaque requête : rendu bloquant assumé (Cache Components).
export const instant = false;

/** Fiche d'une demande : détails, historique, statut, notes internes, réponse par courriel. */
export default async function RequestPage({ params }: PageProps<"/admin/demandes/[id]">) {
  const { id } = await params;
  if (!z.uuid().safeParse(id).success) notFound();
  const ctx = await requireAdmin();
  const [request, messages, content] = await Promise.all([getRequest(ctx, id), getMessages(ctx, id), getAdminContent()]);
  if (!request) notFound();

  const svc = content.services.find((s) => s.value === request.service);
  const lang = request.preferred_language;
  const vars = { name: request.full_name, company: request.company, service: svc?.label ?? request.service, reference: request.reference };
  const signature = pick(content.signature, lang, "");
  const templates = content.templates.map((t) => ({
    name: t.name,
    subject: fillTemplate(pick(t.subject, lang, ""), vars),
    body: `${fillTemplate(pick(t.body, lang, ""), vars)}${signature ? `\n\n${signature}` : ""}`,
  }));

  const facts: Array<[string, React.ReactNode]> = [
    ["Courriel", request.anonymized_at ? "—" : <a href={`mailto:${request.email}`} className="text-blue underline underline-offset-4">{request.email}</a>],
    ["Téléphone", request.phone ? <a href={`tel:${request.phone.replace(/[^\d+]/g, "")}`} className="font-mono">{request.phone}</a> : "—"],
    ["Langue", lang === "fr" ? "Français" : "English"],
    ["Service", <span key="s" className="inline-flex items-center gap-2">{svc?.network && <NetworkSwatch network={svc.network} />}{svc?.label ?? request.service}</span>],
    ["Type de projet", content.labelFor("projectTypes", request.project_type)],
    ["Région", content.labelFor("regions", request.region)],
    ["Phase", content.labelFor("phases", request.phase)],
    ["Échéancier", content.labelFor("timelines", request.timeline)],
    ["Budget", content.labelFor("budgets", request.budget_range)],
    ["Logiciels", request.software_formats.map((s) => content.labelFor("softwareOptions", s)).join(", ") || "—"],
    ["Reçue le", formatDate(request.created_at)],
    ["Consentement", `${formatDate(request.consent_at)} · politique ${request.consent_policy_version}`],
    ["Courriels automatiques", `notification ${request.notification_sent_at ? "✔" : "✘"} · accusé ${request.ack_email_sent_at ? "✔" : "✘"}`],
  ];

  return (
    <div className="space-y-6">
      <Link href="/admin" className="text-[14px] text-blue underline-offset-4 hover:underline">Toutes les demandes</Link>
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="font-mono text-[14px] text-ink-2">{request.reference}</p>
          <h1 className="font-display text-3xl font-bold text-ink">{request.full_name}</h1>
          <p className="text-[16px] text-ink-2">{request.company}</p>
        </div>
        <StatusSelect requestId={request.id} status={request.status} />
      </div>

      <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.2fr)]">
        <section aria-labelledby="details" className="space-y-6">
          <div className="border-[1.5px] border-ink bg-paper">
            <h2 id="details" className="border-b border-ink px-4 py-2 text-[13px] font-semibold text-ink-2">Détails</h2>
            <dl className="divide-y divide-rule text-[14px]">
              {facts.map(([k, v]) => (
                <div key={k} className="grid grid-cols-[9rem_1fr] gap-3 px-4 py-2"><dt className="text-ink-2">{k}</dt><dd className="text-ink">{v}</dd></div>
              ))}
            </dl>
          </div>
          <div className="border-[1.5px] border-ink bg-paper p-4">
            <h2 className="mb-2 text-[13px] font-semibold text-ink-2">Description du besoin</h2>
            <p className="text-[15px] leading-relaxed whitespace-pre-line text-ink">{request.description}</p>
          </div>
          {!request.anonymized_at && <AnonymizeButton requestId={request.id} />}
          {request.anonymized_at && <p className="text-[14px] text-ink-2">Anonymisée le {formatDate(request.anonymized_at)}.</p>}
        </section>

        <section aria-labelledby="exchanges" className="space-y-6">
          <h2 id="exchanges" className="font-display text-xl font-bold text-ink">Échanges</h2>
          <Timeline messages={messages} />
          {!request.anonymized_at && <ReplyComposer requestId={request.id} templates={templates} to={request.email} />}
          <NoteForm requestId={request.id} />
        </section>
      </div>
    </div>
  );
}
