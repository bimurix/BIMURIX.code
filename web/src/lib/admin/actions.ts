"use server";

import { revalidatePath } from "next/cache";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { z } from "zod";
import { createMailer } from "@/lib/mail/mailer";
import { textToHtml } from "@/lib/quote/templates";
import { createUserClient } from "@/lib/supabase/server";
import { requireAdmin } from "./auth";
import { getAdminContent } from "./data";
import { STATUSES, statusLabel, type QuoteStatus } from "./labels";

export type ActionResult = { ok: true; message?: string } | { ok: false; error: string } | null;

const uuid = z.uuid();

/** Envoie un lien de connexion. Même réponse que l'adresse soit autorisée ou non (pas d'énumération). */
export async function sendMagicLink(_prev: ActionResult, form: FormData): Promise<ActionResult> {
  const email = z.email().safeParse(String(form.get("email") ?? "").trim().toLowerCase());
  if (!email.success) return { ok: false, error: "Adresse courriel invalide." };
  const h = await headers();
  const origin = h.get("origin") ?? `http://${h.get("host")}`;
  try {
    const supabase = await createUserClient();
    // shouldCreateUser: false — seuls les comptes créés par « pnpm admin:add » reçoivent un lien.
    await supabase.auth.signInWithOtp({ email: email.data, options: { shouldCreateUser: false, emailRedirectTo: `${origin}/admin/auth/callback` } });
  } catch (error) {
    console.error(`[admin] lien magique : ${(error as Error).message}`);
  }
  return { ok: true, message: "Si cette adresse est autorisée, un lien de connexion vient d'être envoyé." };
}

export async function signOut() {
  const supabase = await createUserClient();
  await supabase.auth.signOut();
  redirect("/admin/connexion");
}

async function logEvent(ctx: Awaited<ReturnType<typeof requireAdmin>>, requestId: string, body: string) {
  await ctx.supabase.from("quote_messages").insert({ request_id: requestId, kind: "event", body, author_id: ctx.userId });
}

export async function updateStatus(requestId: string, status: QuoteStatus): Promise<ActionResult> {
  const ctx = await requireAdmin();
  if (!uuid.safeParse(requestId).success || !STATUSES.includes(status)) return { ok: false, error: "Requête invalide." };
  const { error } = await ctx.supabase.from("quote_requests").update({ status }).eq("id", requestId);
  if (error) return { ok: false, error: "Le statut n'a pas pu être modifié." };
  await logEvent(ctx, requestId, `Statut : ${statusLabel[status]} (${ctx.email})`);
  revalidatePath("/admin", "layout");
  return { ok: true };
}

const noteSchema = z.object({ requestId: z.uuid(), body: z.string().trim().min(1).max(5000) });

export async function addNote(_prev: ActionResult, form: FormData): Promise<ActionResult> {
  const ctx = await requireAdmin();
  const parsed = noteSchema.safeParse({ requestId: form.get("requestId"), body: form.get("body") });
  if (!parsed.success) return { ok: false, error: "La note est vide ou trop longue." };
  const { error } = await ctx.supabase.from("quote_messages").insert({ request_id: parsed.data.requestId, kind: "note", body: parsed.data.body, author_id: ctx.userId });
  if (error) return { ok: false, error: "La note n'a pas pu être enregistrée." };
  revalidatePath("/admin", "layout");
  return { ok: true, message: "Note ajoutée." };
}

const replySchema = z.object({ requestId: z.uuid(), subject: z.string().trim().min(1).max(300), body: z.string().trim().min(1).max(20000) });

/** Répond au client par courriel, enregistre l'échange et passe la demande à « Répondue ». */
export async function sendReply(_prev: ActionResult, form: FormData): Promise<ActionResult> {
  const ctx = await requireAdmin();
  const parsed = replySchema.safeParse({ requestId: form.get("requestId"), subject: form.get("subject"), body: form.get("body") });
  if (!parsed.success) return { ok: false, error: "Objet et message sont obligatoires." };
  const { requestId, subject, body } = parsed.data;

  const { data: request, error } = await ctx.supabase.from("quote_requests").select("email, full_name, status, anonymized_at").eq("id", requestId).maybeSingle();
  if (error || !request) return { ok: false, error: "Demande introuvable." };
  if (request.anonymized_at) return { ok: false, error: "Demande anonymisée : réponse impossible." };

  const content = await getAdminContent();
  const from = { email: content.fromEmail ?? "contact@bimurix.com", name: content.fromName ?? "Bimurix" };
  let providerId: string;
  try {
    ({ id: providerId } = await createMailer()({ from, to: { email: request.email, name: request.full_name }, replyTo: from.email, subject, text: body, html: textToHtml(body) }));
  } catch (e) {
    console.error(`[admin] envoi de réponse : ${(e as Error).message}`);
    return { ok: false, error: "Le courriel n'a pas pu être envoyé. Rien n'a été enregistré." };
  }

  const now = new Date().toISOString();
  await ctx.supabase.from("quote_messages").insert({ request_id: requestId, kind: "outbound", subject, body, author_id: ctx.userId, provider_message_id: providerId });
  const nextStatus: QuoteStatus = ["new", "in_review"].includes(request.status) ? "replied" : request.status;
  await ctx.supabase.from("quote_requests").update({ status: nextStatus, last_reply_at: now }).eq("id", requestId);
  revalidatePath("/admin", "layout");
  return { ok: true, message: "Réponse envoyée." };
}

/** Anonymisation (Loi 25) : irréversible, confirmée dans l'interface. */
export async function anonymizeRequest(requestId: string): Promise<ActionResult> {
  const ctx = await requireAdmin();
  if (!uuid.safeParse(requestId).success) return { ok: false, error: "Requête invalide." };
  const { error } = await ctx.supabase.rpc("anonymize_quote", { target: requestId });
  if (error) return { ok: false, error: "L'anonymisation a échoué." };
  revalidatePath("/admin", "layout");
  return { ok: true, message: "Demande anonymisée." };
}
