"use server";

import { headers } from "next/headers";
import { createMailer } from "@/lib/mail/mailer";
import { errorSummary } from "@/lib/safe-log";
import { createAdminClient } from "@/lib/supabase/admin";
import { fetchPublished } from "@/sanity/fetch";
import { QUOTE_FORM_QUERY } from "@/sanity/queries";
import { ACK_WINDOW_MS, shouldSendAck } from "./ack-limit";
import { clientIpFrom, hashIp } from "./client-ip";
import { sendQuoteEmails } from "./emails";
import { allowedOptions, type QuoteFormContent } from "./form-content";
import type { SubmitResult } from "./schema";
import { submitQuote } from "./submit-quote";
import { verifyTurnstile } from "./turnstile";

const RATE_WINDOW_MS = 10 * 60 * 1000;
const HOUR_MS = 60 * 60 * 1000;

/** Action du formulaire de soumission : assemble les dépendances réelles autour de submitQuote. */
export async function submitQuoteAction(_prev: SubmitResult | null, form: FormData): Promise<SubmitResult> {
  try {
    const ip = clientIpFrom(await headers());
    const salt = process.env.IP_HASH_SALT;
    const ipHash = hashIp(ip, salt);
    // S-02 : en production, une limite par IP inopérante doit se voir dans les journaux (le plafond global prend le relais).
    if (process.env.NODE_ENV === "production" && !ipHash) {
      console.error(`[soumission] ALERTE : limite par IP inopérante (${salt ? "IP du visiteur inconnue" : "IP_HASH_SALT manquant"}).`);
    }
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
      countRecentGlobal: async () => {
        const since = new Date(Date.now() - HOUR_MS).toISOString();
        const { count, error } = await db().from("quote_requests").select("id", { count: "exact", head: true }).gte("created_at", since);
        if (error) throw error;
        return count ?? 0;
      },
      insert: async (row) => {
        const { data, error } = await db().from("quote_requests").insert(row).select("id").single();
        if (error?.code === "23505") return { conflict: true };
        if (error) throw error;
        return { id: data.id as string };
      },
      afterInsert: async (row, input) => {
        // S-03 : fail-closed — si le décompte échoue, l'accusé n'est pas envoyé (la demande, elle, est déjà enregistrée).
        const since = new Date(Date.now() - ACK_WINDOW_MS).toISOString();
        const { count, error } = await db().from("quote_requests").select("id", { count: "exact", head: true }).eq("email", row.email).not("ack_email_sent_at", "is", null).gte("ack_email_sent_at", since);
        const sendAck = !error && shouldSendAck(count ?? 0);
        if (!sendAck) console.error("[soumission] accusé de réception non envoyé : limite par adresse atteinte ou décompte impossible.");
        return sendQuoteEmails(row, input, content, createMailer(), async (column) => {
          await db().from("quote_requests").update({ [column]: new Date().toISOString() }).eq("id", row.id);
        }, { sendAck });
      },
      options: async () => allowedOptions(content),
      policyVersion: content?.form?.policyVersion ?? "",
      ipHash,
      now: () => new Date(),
    });
  } catch (error) {
    // Fail-closed : aucune demande n'est annoncée comme reçue si l'enregistrement n'a pas abouti.
    // S-08 : jamais le message brut (il peut contenir la ligne refusée) ; type et code seulement.
    console.error(`[soumission] échec : ${errorSummary(error)}`);
    return { ok: false, code: "SERVER_ERROR" };
  }
}
