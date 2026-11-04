import { describe, expect, it, vi } from "vitest";
import { MAX_REQUESTS_PER_IP, submitQuote, type SubmitDeps } from "@/lib/quote/submit-quote";
import { escapeHtml, fillTemplate, newReference, oneLine } from "@/lib/quote/templates";

const options = {
  services: ["service-tqc", "other"],
  projectTypes: ["commercial"],
  regions: ["montreal"],
  phases: ["construction"],
  timelines: ["tbd"],
  budgets: ["tbd"],
  software: ["revit", "ifc"],
};

function validForm(extra: Record<string, string | string[]> = {}) {
  const f = new FormData();
  const fields: Record<string, string | string[]> = {
    locale: "fr",
    fullName: "Marie Tremblay",
    company: "Construction ABC",
    email: "marie@abc.ca",
    preferredLanguage: "fr",
    service: "service-tqc",
    region: "montreal",
    software: ["revit", "ifc"],
    description: "Mise à jour TQC d'un bâtiment de 4 étages.",
    consent: "on",
    "cf-turnstile-response": "jeton",
    ...extra,
  };
  for (const [k, v] of Object.entries(fields)) for (const item of [v].flat()) f.append(k, item);
  return f;
}

function deps(over: Partial<SubmitDeps> = {}): SubmitDeps {
  return {
    verifyCaptcha: vi.fn(async () => true),
    countRecentFromIp: vi.fn(async () => 0),
    insert: vi.fn(async () => ({ id: "uuid-1" })),
    afterInsert: vi.fn(async () => {}),
    options: async () => options,
    policyVersion: "2026-11",
    ipHash: "hash",
    now: () => new Date("2026-11-04T12:00:00Z"),
    ...over,
  };
}

describe("submitQuote", () => {
  it("enregistre une demande valide puis envoie les courriels", async () => {
    const d = deps();
    const res = await submitQuote(validForm(), d);
    expect(res).toMatchObject({ ok: true });
    expect(d.insert).toHaveBeenCalledWith(expect.objectContaining({ email: "marie@abc.ca", software_formats: ["revit", "ifc"], consent_policy_version: "2026-11", consent_at: "2026-11-04T12:00:00.000Z" }));
    expect(d.afterInsert).toHaveBeenCalledOnce();
  });

  it("signale les champs requis vides", async () => {
    const res = await submitQuote(validForm({ fullName: "", email: "pas-un-courriel" }), deps());
    expect(res).toEqual({ ok: false, code: "VALIDATION_FAILED", fields: { fullName: "required", email: "invalid" } });
  });

  it("refuse sans consentement", async () => {
    const f = validForm();
    f.delete("consent");
    expect(await submitQuote(f, deps())).toMatchObject({ ok: false, fields: { consent: "required" } });
  });

  it("refuse une valeur absente des listes de Studio", async () => {
    expect(await submitQuote(validForm({ service: "inventé" }), deps())).toMatchObject({ ok: false, fields: { service: "invalid" } });
  });

  it("refuse si le champ piège est rempli, sans rien enregistrer", async () => {
    const d = deps();
    expect(await submitQuote(validForm({ website: "http://spam" }), d)).toEqual({ ok: false, code: "SPAM_SUSPECTED" });
    expect(d.insert).not.toHaveBeenCalled();
  });

  it("refuse si l'antispam échoue", async () => {
    const d = deps({ verifyCaptcha: async () => false });
    expect(await submitQuote(validForm(), d)).toEqual({ ok: false, code: "CAPTCHA_FAILED" });
    expect(d.insert).not.toHaveBeenCalled();
  });

  it("limite les envois répétés depuis la même adresse", async () => {
    const d = deps({ countRecentFromIp: async () => MAX_REQUESTS_PER_IP });
    expect(await submitQuote(validForm(), d)).toEqual({ ok: false, code: "RATE_LIMITED" });
  });

  it("refuse (fail-closed) si les listes de Studio sont illisibles", async () => {
    expect(await submitQuote(validForm(), deps({ options: async () => null }))).toEqual({ ok: false, code: "SERVER_ERROR" });
  });

  it("reste un succès si l'envoi du courriel échoue après l'enregistrement", async () => {
    const d = deps({ afterInsert: async () => { throw new Error("Mailpit hors service"); } });
    vi.spyOn(console, "error").mockImplementation(() => {});
    expect(await submitQuote(validForm(), d)).toMatchObject({ ok: true });
  });

  it("réessaie avec une autre référence en cas de doublon", async () => {
    const insert = vi.fn().mockResolvedValueOnce({ conflict: true }).mockResolvedValueOnce({ id: "uuid-2" });
    expect(await submitQuote(validForm(), deps({ insert }))).toMatchObject({ ok: true });
    expect(insert).toHaveBeenCalledTimes(2);
  });
});

describe("modèles de courriel", () => {
  it("remplace les variables", () => {
    expect(fillTemplate("Bonjour {name} ({reference})", { name: "Marie", company: "", service: "", reference: "BX-ABC234" })).toBe("Bonjour Marie (BX-ABC234)");
  });

  it("échappe le HTML saisi par le visiteur", () => {
    expect(escapeHtml(`<script>"x"</script>`)).toBe("&lt;script&gt;&quot;x&quot;&lt;/script&gt;");
  });

  it("garde l'objet du courriel sur une seule ligne", () => {
    expect(oneLine("Nouvelle demande : ACME\r\nBcc: pirate@example.com")).toBe("Nouvelle demande : ACME Bcc: pirate@example.com");
  });

  it("produit une référence lisible", () => {
    expect(newReference()).toMatch(/^BX-[A-HJ-NP-Z2-9]{6}$/);
  });
});
