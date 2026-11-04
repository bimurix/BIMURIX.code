import "server-only";
import { pick } from "@/lib/i18n/pick";
import type { Mailer } from "@/lib/mail/mailer";
import { serviceOptions, type QuoteFormContent } from "./form-content";
import type { QuoteInput } from "./schema";
import type { QuoteRow } from "./submit-quote";
import { escapeHtml, fillTemplate, oneLine, textToHtml } from "./templates";

const FALLBACK_FROM = "contact@bimurix.com";

const fallbackAck = {
  fr: { subject: "Nous avons bien reçu votre demande ({reference})", body: "Bonjour {name},\n\nMerci pour votre demande. Votre référence : {reference}." },
  en: { subject: "We received your request ({reference})", body: "Hello {name},\n\nThank you for your request. Your reference: {reference}." },
};

/** Libellé lisible d'une valeur de liste (ex. « montreal » → « Montréal »). */
function labelOf(content: QuoteFormContent, list: "regions" | "projectTypes" | "phases" | "timelines" | "budgets" | "softwareOptions", value?: string) {
  if (!value) return "—";
  const option = (content?.form?.[list] ?? []).find((o) => o.value === value);
  return pick(option?.label, "fr", value);
}

/**
 * Notification interne (en français, pour Bimurix) puis accusé de réception au client dans sa langue.
 * Chaque envoi réussi est horodaté en base par l'appelant (markSent).
 */
export async function sendQuoteEmails(
  row: QuoteRow & { id: string },
  input: QuoteInput,
  content: QuoteFormContent,
  mailer: Mailer,
  markSent: (column: "notification_sent_at" | "ack_email_sent_at") => Promise<void>,
) {
  const from = { email: content?.fromEmail ?? FALLBACK_FROM, name: content?.emails?.fromName ?? "Bimurix" };
  const service = serviceOptions(content).find((o) => o.value === input.service);
  const vars = { name: input.fullName, company: input.company, service: pick(service?.label, input.preferredLanguage, input.service), reference: row.reference };
  const notifyTo = content?.form?.notificationEmail ?? FALLBACK_FROM;

  const lines: Array<[string, string]> = [
    ["Référence", row.reference],
    ["Nom", input.fullName],
    ["Entreprise", input.company],
    ["Courriel", input.email],
    ["Téléphone", input.phone ?? "—"],
    ["Langue", input.preferredLanguage === "fr" ? "Français" : "English"],
    ["Service", pick(service?.label, "fr", input.service)],
    ["Type de projet", labelOf(content, "projectTypes", input.projectType)],
    ["Région", labelOf(content, "regions", input.region)],
    ["Phase", labelOf(content, "phases", input.phase)],
    ["Échéancier", labelOf(content, "timelines", input.timeline)],
    ["Budget", labelOf(content, "budgets", input.budget)],
    ["Logiciels", input.software.map((s) => labelOf(content, "softwareOptions", s)).join(", ") || "—"],
  ];
  const table = lines.map(([k, v]) => `<tr><td style="padding:4px 12px 4px 0;color:#475569">${k}</td><td style="padding:4px 0;color:#0F172A">${escapeHtml(v)}</td></tr>`).join("");

  await mailer({
    from,
    to: { email: notifyTo },
    replyTo: input.email,
    subject: oneLine(fillTemplate(content?.emails?.internalSubject ?? "Nouvelle demande : {company} — {service} ({reference})", vars)),
    text: `${lines.map(([k, v]) => `${k} : ${v}`).join("\n")}\n\nDescription :\n${input.description}`,
    html: `<table style="font:14px Arial,sans-serif">${table}</table><h3 style="font:600 15px Arial,sans-serif">Description</h3>${textToHtml(input.description)}`,
  });
  await markSent("notification_sent_at");

  const lang = input.preferredLanguage;
  const subject = oneLine(fillTemplate(pick(content?.emails?.ackSubject, lang, fallbackAck[lang].subject), vars));
  const body = `${fillTemplate(pick(content?.emails?.ackBody, lang, fallbackAck[lang].body), vars)}\n\n${pick(content?.emails?.signature, lang, "Bimurix")}`;
  await mailer({ from, to: { email: input.email, name: input.fullName }, replyTo: notifyTo, subject, text: body, html: textToHtml(body) });
  await markSent("ack_email_sent_at");
}
