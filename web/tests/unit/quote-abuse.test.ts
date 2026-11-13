import { describe, expect, it, vi } from "vitest";
import { adminCallbackUrl } from "@/lib/admin/callback-url";
import { clientIpFrom, hashIp } from "@/lib/quote/client-ip";
import { quoteSchema } from "@/lib/quote/schema";
import { MAX_REQUESTS_GLOBAL_PER_HOUR, MAX_REQUESTS_PER_IP, submitQuote, type SubmitDeps } from "@/lib/quote/submit-quote";
import { shouldSendAck, MAX_ACKS_PER_ADDRESS } from "@/lib/quote/ack-limit";

const h = (o: Record<string, string>) => ({ get: (k: string) => o[k.toLowerCase()] ?? null });

describe("S-02 : IP fiable pour la limite d'envois", () => {
  it("sur Netlify (variable lue à l'exécution), seul l'en-tête de Netlify fait foi", () => {
    const env = { NETLIFY: "true" } as unknown as NodeJS.ProcessEnv;
    expect(clientIpFrom(h({ "x-nf-client-connection-ip": "203.0.113.9", "x-forwarded-for": "1.2.3.4" }), env)).toBe("203.0.113.9");
    expect(clientIpFrom(h({ "x-forwarded-for": "1.2.3.4" }), env)).toBeUndefined();
  });
  it("en production hors Netlify : aucun en-tête de la requête n'est cru (le client peut les écrire)", () => {
    const env = { NODE_ENV: "production" } as unknown as NodeJS.ProcessEnv;
    expect(clientIpFrom(h({ "x-forwarded-for": "1.2.3.4", "x-real-ip": "5.6.7.8" }), env)).toBeUndefined();
  });
  it("en développement local : X-Forwarded-For sert (pas de mandataire)", () => {
    expect(clientIpFrom(h({ "x-forwarded-for": "1.2.3.4, 9.9.9.9" }), { NODE_ENV: "development" } as unknown as NodeJS.ProcessEnv)).toBe("1.2.3.4");
  });
  it("sans sel, pas d'empreinte ; avec sel, empreinte stable et salée", () => {
    expect(hashIp("1.2.3.4", undefined)).toBeNull();
    expect(hashIp(undefined, "sel")).toBeNull();
    expect(hashIp("1.2.3.4", "sel")).toBe(hashIp("1.2.3.4", "sel"));
    expect(hashIp("1.2.3.4", "sel")).not.toBe(hashIp("1.2.3.4", "autre"));
  });
});

const options = { services: ["autre"], projectTypes: [], regions: [], phases: [], timelines: [], budgets: [], software: [], packages: [], callEnabled: false };
function form(extra: Record<string, string> = {}) {
  const f = new FormData();
  const fields: Record<string, string> = { locale: "fr", fullName: "Marie Tremblay", company: "Construction ABC", email: "marie@abc.ca", preferredLanguage: "fr", requestType: "quote", service: "autre", description: "Mise à jour TQC d'un bâtiment.", consent: "on", "cf-turnstile-response": "t", ...extra };
  for (const [k, v] of Object.entries(fields)) f.append(k, v);
  return f;
}
function deps(over: Partial<SubmitDeps> = {}): SubmitDeps {
  return {
    verifyCaptcha: async () => true, countRecentFromIp: async () => 0, countRecentGlobal: async () => 0,
    insert: async () => ({ id: "u" }), afterInsert: async () => {}, options: async () => options,
    policyVersion: "2026-11", ipHash: "h", now: () => new Date("2026-11-13T12:00:00Z"), ...over,
  };
}

describe("S-02 : limites d'envois", () => {
  it("quatre envois de la même IP en dix minutes : le quatrième est refusé", async () => {
    let n = 0;
    const d = deps({ countRecentFromIp: async () => n, insert: async () => { n++; return { id: "u" }; } });
    const results = [];
    for (let i = 0; i < MAX_REQUESTS_PER_IP + 1; i++) results.push(await submitQuote(form(), d));
    expect(results.map((r) => r.ok)).toEqual([true, true, true, false]);
    expect(results[3]).toMatchObject({ code: "RATE_LIMITED" });
  });
  it("sans IP fiable (ipHash nul), le plafond global s'applique encore", async () => {
    const insert = vi.fn(async () => ({ id: "u" }));
    const d = deps({ ipHash: null, countRecentGlobal: async () => MAX_REQUESTS_GLOBAL_PER_HOUR, insert });
    expect(await submitQuote(form(), d)).toMatchObject({ ok: false, code: "RATE_LIMITED" });
    expect(insert).not.toHaveBeenCalled();
  });
  it("le plafond global s'applique aussi quand l'IP est connue", async () => {
    const d = deps({ countRecentGlobal: async () => MAX_REQUESTS_GLOBAL_PER_HOUR });
    expect(await submitQuote(form(), d)).toMatchObject({ ok: false, code: "RATE_LIMITED" });
  });
});

describe("S-03 : accusé de réception vers un tiers", () => {
  it("nom ou entreprise contenant une adresse web ou une barre oblique : refus de validation", () => {
    const base = { locale: "fr", fullName: "Marie Tremblay", company: "ABC", email: "a@b.ca", preferredLanguage: "fr", requestType: "quote", service: "x", description: "Description assez longue.", consent: true, software: [] };
    expect(quoteSchema.safeParse(base).success).toBe(true);
    for (const bad of ["Visitez https://evil.example/x", "evil.example.com", "www.evil.example", "a/b", "Cliquez <b>ici</b>", "Votre compte est bloqué : appelez le 555"]) {
      expect(quoteSchema.safeParse({ ...base, fullName: bad }).success, `nom « ${bad} »`).toBe(false);
    }
    for (const bad of ["https://evil.example", "evil.example.com/login", "ABC / DEF", "<script>"]) {
      expect(quoteSchema.safeParse({ ...base, company: bad }).success, `entreprise « ${bad} »`).toBe(false);
    }
  });
  it("noms et entreprises légitimes acceptés", () => {
    const base = { locale: "fr", email: "a@b.ca", preferredLanguage: "fr", requestType: "quote", service: "x", description: "Description assez longue.", consent: true, software: [] };
    for (const name of ["Marie-Ève Tremblay", "Jean O'Brien", "Zoë Müller", "Chen Wei, ing."]) expect(quoteSchema.safeParse({ ...base, fullName: name, company: "ABC" }).success, name).toBe(true);
    for (const company of ["Plomberie Tremblay & Fils inc.", "9876-5432 Québec inc.", "Gicleurs (Rive-Sud) S.E.C."]) expect(quoteSchema.safeParse({ ...base, fullName: "Jean Roy", company }).success, company).toBe(true);
  });
  it("le courriel est ramené en minuscules (la limite par adresse ne se contourne pas par la casse)", () => {
    const r = quoteSchema.safeParse({ locale: "fr", fullName: "Jean Roy", company: "ABC", email: "Victime@Exemple.CA", preferredLanguage: "fr", requestType: "quote", service: "x", description: "Description assez longue.", consent: true, software: [] });
    expect(r.success && r.data.email).toBe("victime@exemple.ca");
  });
  it("troisième demande vers la même adresse en 24 h : demande enregistrée, mais pas d'accusé", async () => {
    expect(MAX_ACKS_PER_ADDRESS).toBe(2);
    expect(shouldSendAck(0)).toBe(true);
    expect(shouldSendAck(1)).toBe(true);
    expect(shouldSendAck(2)).toBe(false);
  });
});

describe("S-04 : adresse de retour du lien magique", () => {
  const site = "https://bimurix.com";
  it("en-têtes Origin ou Host falsifiés : le lien garde le domaine du site", () => {
    const prod = { NETLIFY: "true" } as unknown as NodeJS.ProcessEnv;
    expect(adminCallbackUrl({ origin: "https://evil.example", host: "evil.example" }, prod, site)).toBe("https://bimurix.com/admin/auth/callback");
    expect(adminCallbackUrl({ origin: null, host: "evil.example:3000" }, prod, site)).toBe("https://bimurix.com/admin/auth/callback");
    // même un hôte local est refusé en ligne
    expect(adminCallbackUrl({ origin: "http://localhost:3100", host: "localhost:3100" }, prod, site)).toBe("https://bimurix.com/admin/auth/callback");
  });
  it("en local (hors Netlify), localhost et 127.0.0.1 servent ; un autre hôte retombe sur le site", () => {
    const local = {} as unknown as NodeJS.ProcessEnv;
    expect(adminCallbackUrl({ origin: "http://localhost:3100", host: "localhost:3100" }, local, site)).toBe("http://localhost:3100/admin/auth/callback");
    expect(adminCallbackUrl({ origin: null, host: "127.0.0.1:3200" }, local, site)).toBe("http://127.0.0.1:3200/admin/auth/callback");
    expect(adminCallbackUrl({ origin: "https://evil.example", host: "evil.example" }, local, site)).toBe("https://bimurix.com/admin/auth/callback");
    expect(adminCallbackUrl({ origin: null, host: "localhost.evil.example" }, local, site)).toBe("https://bimurix.com/admin/auth/callback");
  });
});

describe("S-08, S-11, S-12", () => {
  it("le journal ne contient jamais le message brut d'une erreur (S-08)", async () => {
    const { errorSummary } = await import("@/lib/safe-log");
    const e = Object.assign(new Error('duplicate key value violates unique constraint, Failing row contains (Marie Tremblay, marie@abc.ca)'), { code: "23505" });
    expect(errorSummary(e)).toBe("Error 23505");
    expect(errorSummary(e)).not.toMatch(/Marie|abc.ca|Failing/);
  });
  it("sourcePath : chemin interne seulement (S-11)", () => {
    const base = { locale: "fr", fullName: "Jean Roy", company: "ABC", email: "a@b.ca", preferredLanguage: "fr", requestType: "quote", service: "x", description: "Description assez longue.", consent: true, software: [] };
    expect(quoteSchema.safeParse({ ...base, sourcePath: "/services/tuyauterie" }).success).toBe(true);
    for (const bad of ["https://evil.example", "//evil.example", "javascript:alert(1)", "services"]) expect(quoteSchema.safeParse({ ...base, sourcePath: bad }).success, bad).toBe(false);
  });
  it("sans version de politique : aucune demande enregistrée (S-12)", async () => {
    const insert = vi.fn(async () => ({ id: "u" }));
    expect(await submitQuote(form(), deps({ policyVersion: "", insert }))).toMatchObject({ ok: false, code: "SERVER_ERROR" });
    expect(insert).not.toHaveBeenCalled();
  });
  it("sendAck faux : la notification part, l'accusé non (S-03)", async () => {
    const { vi: v } = await import("vitest");
    v.mock("server-only", () => ({}));
    const { sendQuoteEmails } = await import("@/lib/quote/emails");
    const to: string[] = [];
    const mailer = async (m: { to: { email: string } }) => { to.push(m.to.email); return { id: "m" }; };
    const row = { id: "1", reference: "BX-T" } as never;
    const input = { locale: "fr", fullName: "Jean Roy", company: "ABC", email: "victime@exemple.ca", preferredLanguage: "fr", requestType: "quote", service: "s", software: [], description: "Texte assez long ici.", consent: true } as never;
    await sendQuoteEmails(row, input, null as never, mailer as never, async () => {}, { sendAck: false });
    expect(to).toEqual(["contact@bimurix.com"]);
  });
});

describe("S-13 : clé Turnstile de test en ligne", () => {
  it("refusée sur Netlify, tolérée en local", async () => {
    const { vi: v } = await import("vitest");
    v.mock("server-only", () => ({}));
    const { verifyTurnstile, isTestTurnstileSecret } = await import("@/lib/quote/turnstile");
    expect(isTestTurnstileSecret("1x0000000000000000000000000000000AA")).toBe(true);
    expect(isTestTurnstileSecret("0x4AAAAAAAreelle")).toBe(false);
    const fetchSpy = v.spyOn(globalThis, "fetch");
    expect(await verifyTurnstile("jeton", undefined, "1x0000000000000000000000000000000AA", { NETLIFY: "true" } as unknown as NodeJS.ProcessEnv)).toBe(false);
    expect(fetchSpy).not.toHaveBeenCalled();
    fetchSpy.mockRestore();
  });
});
