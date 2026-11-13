import { describe, expect, it } from "vitest";
import { isIndexable, PRODUCTION_SITE } from "@/lib/indexing";
import { buildMetadata, shareImagePath } from "@/lib/seo";
import type { Shell } from "@/sanity/types-content";

const shell = { settings: { siteName: "Bimurix" } } as unknown as Shell;
const service = { _type: "service", slug: { fr: "services/prefabrication-tuyauterie", en: "services/pipe-prefabrication" }, title: { fr: "Tuyauterie", en: "Piping" } };

describe("R-13 : indexation seulement sur le domaine de production", () => {
  it("indexable par défaut et sur le domaine final", () => {
    expect(isIndexable({})).toBe(true);
    expect(isIndexable({ NEXT_PUBLIC_SITE_URL: PRODUCTION_SITE, CONTEXT: "production" })).toBe(true);
  });
  it("aperçu Netlify ou autre domaine : non indexable", () => {
    expect(isIndexable({ CONTEXT: "deploy-preview" })).toBe(false);
    expect(isIndexable({ CONTEXT: "branch-deploy" })).toBe(false);
    expect(isIndexable({ NEXT_PUBLIC_SITE_URL: "https://bimurix.netlify.app" })).toBe(false);
  });
});

describe("R-11, R-12 : langues et partage", () => {
  it("hreflang fr-CA, en-CA et x-default, canonique de la langue, langue alternative Open Graph", () => {
    const en = buildMetadata({ doc: service, shell, locale: "en" });
    expect(en.alternates?.canonical).toBe("/en/services/pipe-prefabrication");
    expect(en.alternates?.languages).toEqual({ "fr-CA": "/services/prefabrication-tuyauterie", "en-CA": "/en/services/pipe-prefabrication", "x-default": "/services/prefabrication-tuyauterie" });
    expect((en.openGraph as { alternateLocale?: string[] }).alternateLocale).toEqual(["fr_CA"]);
  });
  it("une page sans équivalent EN n'annonce pas de langue alternative", () => {
    const fr = buildMetadata({ doc: { _type: "page", slug: { fr: "x" }, title: { fr: "X" } }, shell, locale: "fr" });
    expect(fr.alternates?.languages).toEqual({ "fr-CA": "/x", "x-default": "/x" });
    expect((fr.openGraph as { alternateLocale?: string[] }).alternateLocale).toEqual([]);
  });
  it("image de partage générée par page et par langue, carte large", () => {
    expect(shareImagePath({ kind: "home", slug: {} }, "fr")).toBe("/og/fr");
    expect(shareImagePath(service, "en")).toBe("/og/en/services/pipe-prefabrication");
    const meta = buildMetadata({ doc: service, shell, locale: "fr" });
    expect(meta.twitter).toMatchObject({ card: "summary_large_image", images: ["/og/fr/services/prefabrication-tuyauterie"] });
  });
});
