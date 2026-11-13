import { describe, expect, it, vi } from "vitest";
import type { Mailer } from "@/lib/mail/mailer";
import type { QuoteFormContent } from "@/lib/quote/form-content";
import type { QuoteInput } from "@/lib/quote/schema";
import { fillTemplate } from "@/lib/quote/templates";

vi.mock("server-only", () => ({}));
const { sendQuoteEmails } = await import("@/lib/quote/emails");

// R3 : sans forfait choisi, la phrase « Forfait visé » est omise de l'accusé, jamais un tiret seul.
const content = {
  fromEmail: "contact@bimurix.com",
  emails: {
    fromName: "Bimurix",
    ackSubject: { fr: "Reçu ({reference})", en: "Received ({reference})" },
    ackBody: {
      fr: "Bonjour {name},\n\nMerci d'avoir communiqué avec Bimurix au sujet de « {service} ». Forfait visé : {package}. Nous examinons votre demande de soumission et vous répondrons dans les meilleurs délais.\n\nVotre référence : {reference}.",
      en: "Hello {name},\n\nThank you for contacting Bimurix about \"{service}\". Package of interest: {package}. We are reviewing your quote request and will get back to you shortly.\n\nYour reference: {reference}.",
    },
    internalSubject: "Nouvelle demande : {company} — {service} · {package} ({reference})",
    signature: { fr: "Bimurix", en: "Bimurix" },
  },
  form: { notificationEmail: "contact@bimurix.com" },
} as unknown as QuoteFormContent;

function input(over: Partial<QuoteInput>): QuoteInput {
  return {
    locale: "fr", fullName: "Marie Tremblay", company: "ABC", email: "marie@abc.ca", preferredLanguage: "fr",
    requestType: "quote", service: "svc", software: [], description: "Description suffisante.", consent: true, ...over,
  } as QuoteInput;
}

async function sent(over: Partial<QuoteInput>) {
  const mails: Array<{ subject: string; text: string }> = [];
  const mailer: Mailer = async (m) => { mails.push({ subject: m.subject, text: m.text ?? "" }); return { id: "m" }; };
  await sendQuoteEmails({ id: "1", reference: "BX-TEST" } as never, input(over), content, mailer, async () => {});
  return { internal: mails[0], ack: mails[1] };
}

describe("accusé de réception sans forfait choisi", () => {
  it("FR : la phrase « Forfait visé » est omise", async () => {
    const { ack } = await sent({ preferredLanguage: "fr" });
    expect(ack.text).not.toContain("Forfait visé");
    expect(ack.text).not.toContain("—");
    expect(ack.text).toContain("». Nous examinons votre demande de soumission");
  });
  it("EN : la phrase « Package of interest » est omise", async () => {
    const { ack } = await sent({ preferredLanguage: "en" });
    expect(ack.text).not.toContain("Package of interest");
    expect(ack.text).not.toContain("—");
    expect(ack.text).toContain("\"svc\". We are reviewing your quote request");
  });
  it("la notification interne n'a pas de séparateur orphelin dans l'objet", async () => {
    const { internal } = await sent({});
    expect(internal.subject).not.toMatch(/·\s*[—(]/);
    expect(internal.subject).toContain("(BX-TEST)");
  });
});

describe("accusé avec forfait choisi", () => {
  it("garde la phrase avec le code", async () => {
    const { ack } = await sent({ packageCode: "F-01" });
    expect(ack.text).toContain("Forfait visé : F-01");
  });
});

describe("fillTemplate", () => {
  it("remplace {package} quand il est présent", () => {
    expect(fillTemplate("A. Forfait : {package}. B.", { name: "", company: "", service: "", reference: "", package: "F-01" })).toBe("A. Forfait : F-01. B.");
  });
});
