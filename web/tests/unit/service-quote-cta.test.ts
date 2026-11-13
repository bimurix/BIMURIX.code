import { describe, expect, it } from "vitest";
import { resolveLink } from "@/lib/links";
import { overrideLabel, serviceQuoteCta } from "@/lib/services/quote-cta";

const quotePage = { _type: "page", kind: "quote", slug: { fr: "soumission", en: "quote" } };
const cta = { label: { fr: "Demander une soumission", en: "Request a quote" }, style: "primary" as const, link: { kind: "internal" as const, internal: quotePage, serviceId: "svc" } };

describe("overrideLabel", () => {
  it("remplace seulement les langues renseignées", () => {
    expect(overrideLabel({ fr: "A", en: "B" }, { fr: "Nouveau" })).toEqual({ fr: "Nouveau", en: "B" });
  });
  it("ignore un libellé vide", () => {
    expect(overrideLabel({ fr: "A", en: "B" }, { fr: "  ", en: "" })).toEqual({ fr: "A", en: "B" });
  });
});

describe("serviceQuoteCta", () => {
  it("garde le bouton de Studio sans libellé propre", () => {
    expect(serviceQuoteCta(cta, { serviceId: "svc" })).toBe(cta);
    expect(serviceQuoteCta(undefined, { serviceId: "svc", quotePage })).toBeUndefined();
  });
  it("remplace le libellé et garde le lien", () => {
    const out = serviceQuoteCta(cta, { label: { fr: "Demander une soumission de gicleurs" }, serviceId: "svc" });
    expect(out?.label?.fr).toBe("Demander une soumission de gicleurs");
    expect(out?.label?.en).toBe("Request a quote");
    expect(out?.link).toBe(cta.link);
  });
  it("bâtit un lien vers la soumission avec le service pré-choisi quand il n'y a pas de bouton", () => {
    const out = serviceQuoteCta(undefined, { label: { fr: "Demander une soumission de gicleurs", en: "Request a sprinkler quote" }, quotePage, serviceId: "svc id" });
    expect(resolveLink(out?.link, "fr")).toBe("/soumission?service=svc%20id");
    expect(resolveLink(out?.link, "en")).toBe("/en/quote?service=svc%20id");
  });
  it("ne bâtit rien sans page de soumission", () => {
    expect(serviceQuoteCta(undefined, { label: { fr: "X" }, serviceId: "svc" })).toBeUndefined();
  });
});
