"use server";

import { createHash } from "node:crypto";
import { headers } from "next/headers";
import { createMailer } from "@/lib/mail/mailer";
import { createAdminClient } from "@/lib/supabase/admin";
import { fetchPublished } from "@/sanity/fetch";
import { QUOTE_FORM_QUERY } from "@/sanity/queries";
import { sendQuoteEmails } from "./emails";
import { allowedOptions, type QuoteFormContent } from "./form-content";
import type { SubmitResult } from "./schema";
import { submitQuote } from "./submit-quote";
import { verifyTurnstile } from "./turnstile";

const RATE_WINDOW_MS = 10 * 60 * 1000;

/**
 * IP du visiteur pour la limite d'envois. Sur Netlify, seul l'en-tête posé par Netlify fait foi :
 * X-Forwarded-For peut être fourni par le client et servirait à contourner la limite.
 */
async function clientIp(): Promise<string | undefined> {
  const h = await headers();
  if (process.env.NETLIFY) return h.get("x-nf-client-connection-ip") ?? undefined;
  return h.get("x-forwarded-for")?.split(",")[0]?.trim() ?? h.get("x-real-ip") ?? undefined;
}

/** Action du formulaire de soumission : assemble les dépendances réelles autour de submitQuote. */
export async function submitQuoteAction(_prev: SubmitResult | null, form: FormData): Promise<SubmitResult> {
  try {
    const ip = await clientIp();
    const salt = process.env.IP_HASH_SALT;
    const ipHash = ip && salt ? createHash("sha256").update(`${salt}:${ip}`).digest("hex") : null;
    // Créé seulement au besoin : un formulaire invalide reçoit ses erreurs même si la base est indisponible.
    let client: ReturnType<typeof createAdminClient> | undefined;
    const db = () => (client ??= createAdminClient());
    const content = await fetchPublished<QuoteFormContent>({ query: QUOTE_FORM_QUERY });

    return await submitQuote(form, {
      verifyCaptcha: (token) => verifyTurnstile(token, ip),
      countRecentFromIp: async (hash) => {
        const since = new Date(Date.now() - RATE_WINDOW_MS).toISOString();
        const { count, error } = await db().from("quote_requests").select("id", { count: "exact", head: true }).eq("ip_hash", hash).gte("created_at", since);
        if (error) throw error;
        return count ?? 0;
      },
      insert: async (row) => {
        const { data, error } = await db().from("quote_requests").insert(row).select("id").single();
        if (error?.code === "23505") return { conflict: true };
        if (error) throw error;
        return { id: data.id as string };
      },
      afterInsert: (row, input) =>
        sendQuoteEmails(row, input, content, createMailer(), async (column) => {
          await db().from("quote_requests").update({ [column]: new Date().toISOString() }).eq("id", row.id);
        }),
      options: async () => allowedOptions(content),
      policyVersion: content?.form?.policyVersion ?? "inconnue",
      ipHash,
      now: () => new Date(),
    });
  } catch (error) {
    // Fail-closed : aucune demande n'est annoncée comme reçue si l'enregistrement n'a pas abouti.
    console.error(`[soumission] échec : ${(error as Error).message}`);
    return { ok: false, code: "SERVER_ERROR" };
  }
}
