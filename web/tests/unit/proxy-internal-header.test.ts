import { describe, expect, it } from "vitest";
import { INTERNAL_HEADER, internalHeaderValue, isInternalRequest } from "@/lib/not-found-response";

const h = (o: Record<string, string>) => ({ get: (k: string) => o[k.toLowerCase()] ?? null });

describe("S-09 : en-tête de lecture interne du gabarit 404", () => {
  const env = { IP_HASH_SALT: "sel-de-test" } as unknown as NodeJS.ProcessEnv;
  it("la simple présence de l'en-tête (valeur devinable) ne suffit plus", () => {
    for (const guess of ["1", "true", "x-bimurix-404-template", ""]) expect(isInternalRequest(h({ [INTERNAL_HEADER]: guess }), env)).toBe(false);
    expect(isInternalRequest(h({}), env)).toBe(false);
  });
  it("la valeur dérivée du secret passe, et change avec le secret", () => {
    expect(isInternalRequest(h({ [INTERNAL_HEADER]: internalHeaderValue(env) }), env)).toBe(true);
    const other = { IP_HASH_SALT: "autre" } as unknown as NodeJS.ProcessEnv;
    expect(isInternalRequest(h({ [INTERNAL_HEADER]: internalHeaderValue(other) }), env)).toBe(false);
  });
});

describe("témoins de session /admin", () => {
  it("HttpOnly, SameSite=Lax et Secure en production", async () => {
    const { hardenCookieOptions } = await import("@/lib/supabase/cookie-options");
    const prod = hardenCookieOptions({ httpOnly: false, maxAge: 400 }, { NODE_ENV: "production" } as unknown as NodeJS.ProcessEnv);
    expect(prod).toMatchObject({ httpOnly: true, sameSite: "lax", secure: true, path: "/", maxAge: 400 });
    expect(hardenCookieOptions(undefined, { NODE_ENV: "development" } as unknown as NodeJS.ProcessEnv).httpOnly).toBe(true);
  });
});
