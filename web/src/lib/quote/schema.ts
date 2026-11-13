import { z } from "zod";

// Limites alignées sur la base (supabase/migrations/…_quote_requests.sql).
const optionalText = (max: number) =>
  z.string().trim().max(max).optional().transform((v) => (v ? v : undefined));

// S-03 : le nom et l'entreprise sont recopiés dans l'accusé de réception envoyé à l'adresse saisie.
// Ni adresse web, ni lien, ni balise, ni ponctuation de phrase : le texte ne peut pas servir d'hameçon.
const LOOKS_LIKE_WEB = /[\p{L}\d-]\.\p{L}{2,}|:\/\/|www\./iu;
const PERSON_NAME = /^[\p{L}\p{M}][\p{L}\p{M} .,'’-]*$/u;
const noWeb = (v: string) => !LOOKS_LIKE_WEB.test(v) && !/[/\\<>:@]/.test(v);

export const quoteSchema = z.object({
  locale: z.enum(["fr", "en"]),
  fullName: z.string().trim().min(2).max(120).regex(PERSON_NAME).refine(noWeb),
  company: z.string().trim().min(1).max(160).refine(noWeb),
  // Minuscules : la limite d'accusés par adresse ne se contourne pas par la casse.
  email: z.email().trim().toLowerCase().max(254),
  phone: optionalText(40).refine((v) => !v || /^[\d\s()+.-]{7,40}$/.test(v), { message: "phone" }),
  preferredLanguage: z.enum(["fr", "en"]),
  requestType: z.enum(["call", "quote"]),
  packageCode: optionalText(20),
  service: z.string().trim().min(1).max(80),
  projectType: optionalText(80),
  region: optionalText(80),
  phase: optionalText(80),
  timeline: optionalText(80),
  budget: optionalText(80),
  software: z.array(z.string().trim().min(1).max(40)).max(12).default([]),
  description: z.string().trim().min(10).max(5000),
  consent: z.literal(true),
  // S-11 : chemin interne seulement (pas d'adresse externe affichée dans le tableau de bord).
  sourcePath: optionalText(300).refine((v) => !v || /^\/(?!\/)\S*$/.test(v), { message: "sourcePath" }),
});

export type QuoteInput = z.infer<typeof quoteSchema>;

export type QuoteErrorCode = "VALIDATION_FAILED" | "SPAM_SUSPECTED" | "CAPTCHA_FAILED" | "RATE_LIMITED" | "SERVER_ERROR";

export type SubmitResult =
  | { ok: true; reference: string }
  | { ok: false; code: QuoteErrorCode; fields?: Partial<Record<keyof QuoteInput, "required" | "invalid">> };

/** Lit le FormData du formulaire (cases à cocher multiples, consentement) en objet à valider. */
export function formDataToInput(form: FormData) {
  const text = (name: string) => {
    const v = form.get(name);
    return typeof v === "string" ? v : undefined;
  };
  return {
    locale: text("locale"),
    fullName: text("fullName"),
    company: text("company"),
    email: text("email"),
    phone: text("phone"),
    preferredLanguage: text("preferredLanguage"),
    requestType: text("requestType"),
    packageCode: text("packageCode"),
    service: text("service"),
    projectType: text("projectType"),
    region: text("region"),
    phase: text("phase"),
    timeline: text("timeline"),
    budget: text("budget"),
    software: form.getAll("software").filter((v): v is string => typeof v === "string"),
    description: text("description"),
    consent: form.get("consent") === "on",
    sourcePath: text("sourcePath"),
  };
}

/** Erreurs de champ simplifiées : « requis » si vide, sinon « invalide ». */
export function fieldErrors(error: z.ZodError, raw: Record<string, unknown>): NonNullable<Extract<SubmitResult, { ok: false }>["fields"]> {
  const out: Record<string, "required" | "invalid"> = {};
  for (const issue of error.issues) {
    const key = String(issue.path[0]);
    const value = raw[key];
    const empty = value === undefined || value === false || (typeof value === "string" && value.trim() === "");
    out[key] = empty ? "required" : "invalid";
  }
  return out;
}
