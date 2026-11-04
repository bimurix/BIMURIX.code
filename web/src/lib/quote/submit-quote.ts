import { fieldErrors, formDataToInput, quoteSchema, type QuoteInput, type SubmitResult } from "./schema";
import { newReference } from "./templates";

export type QuoteRow = {
  reference: string;
  locale: "fr" | "en";
  full_name: string;
  company: string;
  email: string;
  phone: string | null;
  preferred_language: "fr" | "en";
  service: string;
  project_type: string | null;
  region: string | null;
  phase: string | null;
  timeline: string | null;
  budget_range: string | null;
  software_formats: string[];
  description: string;
  consent_at: string;
  consent_policy_version: string;
  source_path: string | null;
  ip_hash: string | null;
};

export type AllowedOptions = {
  services: string[];
  projectTypes: string[];
  regions: string[];
  phases: string[];
  timelines: string[];
  budgets: string[];
  software: string[];
};

/** Dépendances injectées : le cas d'usage se teste sans base, sans réseau, sans Sanity. */
export type SubmitDeps = {
  verifyCaptcha: (token: string | undefined) => Promise<boolean>;
  countRecentFromIp: (ipHash: string) => Promise<number>;
  insert: (row: QuoteRow) => Promise<{ id: string } | { conflict: true }>;
  afterInsert: (row: QuoteRow & { id: string }, input: QuoteInput) => Promise<void>;
  options: () => Promise<AllowedOptions | null>;
  policyVersion: string;
  ipHash: string | null;
  now: () => Date;
};

export const MAX_REQUESTS_PER_IP = 3; // par fenêtre de 10 minutes (voir countRecentFromIp)

// Une valeur de liste doit exister dans les choix publiés dans Studio (fail-closed si la liste manque).
function outsideOptions(input: QuoteInput, opts: AllowedOptions): (keyof QuoteInput)[] {
  const bad: (keyof QuoteInput)[] = [];
  const check = (key: keyof QuoteInput, value: string | undefined, list: string[]) => value && !list.includes(value) && bad.push(key);
  if (!opts.services.includes(input.service)) bad.push("service");
  check("projectType", input.projectType, opts.projectTypes);
  check("region", input.region, opts.regions);
  check("phase", input.phase, opts.phases);
  check("timeline", input.timeline, opts.timelines);
  check("budget", input.budget, opts.budgets);
  if (input.software.some((s) => !opts.software.includes(s))) bad.push("software");
  return bad;
}

/**
 * Enregistre une demande de soumission. Le succès n'est renvoyé qu'après l'insertion réelle en base ;
 * un courriel qui échoue ensuite n'annule pas la demande (elle est visible dans le tableau de bord).
 */
export async function submitQuote(form: FormData, deps: SubmitDeps): Promise<SubmitResult> {
  // Champ piège invisible : un humain ne le remplit jamais.
  if (typeof form.get("website") === "string" && String(form.get("website")).trim() !== "") return { ok: false, code: "SPAM_SUSPECTED" };

  const raw = formDataToInput(form);
  const parsed = quoteSchema.safeParse(raw);
  if (!parsed.success) return { ok: false, code: "VALIDATION_FAILED", fields: fieldErrors(parsed.error, raw) };
  const input = parsed.data;

  const options = await deps.options();
  if (!options) return { ok: false, code: "SERVER_ERROR" };
  const bad = outsideOptions(input, options);
  if (bad.length) return { ok: false, code: "VALIDATION_FAILED", fields: Object.fromEntries(bad.map((k) => [k, "invalid"])) };

  const token = form.get("cf-turnstile-response");
  if (!(await deps.verifyCaptcha(typeof token === "string" ? token : undefined))) return { ok: false, code: "CAPTCHA_FAILED" };
  if (deps.ipHash && (await deps.countRecentFromIp(deps.ipHash)) >= MAX_REQUESTS_PER_IP) return { ok: false, code: "RATE_LIMITED" };

  const base = toRow(input, deps);
  for (let attempt = 0; attempt < 3; attempt++) {
    const row = { ...base, reference: newReference() };
    const result = await deps.insert(row);
    if ("id" in result) {
      await deps.afterInsert({ ...row, id: result.id }, input).catch((e: Error) => console.error(`[soumission] courriels : ${e.message}`));
      return { ok: true, reference: row.reference };
    }
  }
  return { ok: false, code: "SERVER_ERROR" };
}

function toRow(input: QuoteInput, deps: SubmitDeps): Omit<QuoteRow, "reference"> {
  return {
    locale: input.locale,
    full_name: input.fullName,
    company: input.company,
    email: input.email,
    phone: input.phone ?? null,
    preferred_language: input.preferredLanguage,
    service: input.service,
    project_type: input.projectType ?? null,
    region: input.region ?? null,
    phase: input.phase ?? null,
    timeline: input.timeline ?? null,
    budget_range: input.budget ?? null,
    software_formats: input.software,
    description: input.description,
    consent_at: deps.now().toISOString(),
    consent_policy_version: deps.policyVersion,
    source_path: input.sourcePath ?? null,
    ip_hash: deps.ipHash,
  };
}
