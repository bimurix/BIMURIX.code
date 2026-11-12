import { describe, expect, it, vi } from "vitest";
import { showRequestType } from "@/lib/admin/request-type";
import { allowedOptions, type QuoteFormContent } from "@/lib/quote/form-content";
import { submitQuote, type AllowedOptions, type SubmitDeps } from "@/lib/quote/submit-quote";
import { buildFormModel } from "@/ui/patterns/quote-form/form-model";

vi.mock("server-only", () => ({}));

// R2 : l'appel de 20 minutes est un réglage Studio (formSettings.callEnabled), faux par défaut.
const base: AllowedOptions = {
  services: ["service-tqc"], projectTypes: [], regions: [], phases: [], timelines: [], budgets: [], software: [],
  packages: ["F-01", "other"], callEnabled: false,
};

function form(extra: Record<string, string> = {}) {
  const f = new FormData();
  const fields: Record<string, string> = {
    locale: "fr", fullName: "Marie Tremblay", company: "ABC", email: "marie@abc.ca", preferredLanguage: "fr",
    requestType: "quote", service: "service-tqc", description: "Description suffisante du besoin.", consent: "on", ...extra,
  };
  for (const [k, v] of Object.entries(fields)) f.append(k, v);
  return f;
}

const deps = (options: AllowedOptions | null): SubmitDeps => ({
  verifyCaptcha: async () => true, countRecentFromIp: async () => 0, insert: vi.fn(async () => ({ id: "id-1" })),
  afterInsert: async () => {}, options: async () => options, policyVersion: "2026-11", ipHash: null, now: () => new Date(),
});

describe("appel désactivé (cas normal)", () => {
  it("refuse une demande d'appel envoyée à la main, sans rien enregistrer", async () => {
    const d = deps(base);
    expect(await submitQuote(form({ requestType: "call" }), d)).toMatchObject({ ok: false, code: "VALIDATION_FAILED", fields: { requestType: "invalid" } });
    expect(d.insert).not.toHaveBeenCalled();
  });

  it("accepte une soumission avec forfait", async () => {
    const d = deps(base);
    expect(await submitQuote(form({ packageCode: "F-01" }), d)).toMatchObject({ ok: true });
    expect(d.insert).toHaveBeenCalledWith(expect.objectContaining({ request_type: "quote", package_code: "F-01" }));
  });

  it("refuse un forfait masqué ou inconnu", async () => {
    expect(await submitQuote(form({ packageCode: "F-09" }), deps(base))).toMatchObject({ ok: false, fields: { packageCode: "invalid" } });
    expect(await submitQuote(form({ packageCode: "x" }), deps(base))).toMatchObject({ ok: false, fields: { packageCode: "invalid" } });
  });
});

describe("appel activé dans Studio", () => {
  it("accepte une demande d'appel", async () => {
    const d = deps({ ...base, callEnabled: true });
    expect(await submitQuote(form({ requestType: "call", packageCode: "F-01" }), d)).toMatchObject({ ok: true });
    expect(d.insert).toHaveBeenCalledWith(expect.objectContaining({ request_type: "call" }));
  });

  it("refuse toujours un forfait masqué", async () => {
    expect(await submitQuote(form({ requestType: "call", packageCode: "F-09" }), deps({ ...base, callEnabled: true }))).toMatchObject({ ok: false, fields: { packageCode: "invalid" } });
  });
});

describe("lecture du réglage côté serveur", () => {
  const content = (callEnabled?: boolean): QuoteFormContent => ({ form: { callEnabled }, services: [] });
  it("valeur absente ou fausse = désactivé ; seule la valeur vraie active", () => {
    expect(allowedOptions(content())?.callEnabled).toBe(false);
    expect(allowedOptions(content(false))?.callEnabled).toBe(false);
    expect(allowedOptions(content(true))?.callEnabled).toBe(true);
    expect(allowedOptions({ form: { callEnabled: "true" } } as unknown as QuoteFormContent)?.callEnabled).toBe(false);
  });

  it("le modèle du formulaire suit le réglage", () => {
    expect(buildFormModel(content(), "fr").callEnabled).toBe(false);
    expect(buildFormModel(content(true), "fr").callEnabled).toBe(true);
  });
});

describe("tableau de bord : colonne et filtre « Type »", () => {
  it("visibles si l'appel est activé ou s'il existe des demandes d'appel", () => {
    expect(showRequestType(false, 0)).toBe(false);
    expect(showRequestType(false, 2)).toBe(true);
    expect(showRequestType(true, 0)).toBe(true);
  });
});
