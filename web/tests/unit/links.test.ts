import { describe, expect, it } from "vitest";
import { pathFor, resolveLink } from "@/lib/links";

const about = { _type: "page", kind: "about", slug: { fr: "a-propos", en: "about" } };

describe("pathFor", () => {
  it("place l'accueil à / et /en", () => {
    expect(pathFor({ kind: "home" }, "fr")).toBe("/");
    expect(pathFor({ kind: "home" }, "en")).toBe("/en");
  });

  it("préfixe l'anglais par /en", () => {
    expect(pathFor(about, "fr")).toBe("/a-propos");
    expect(pathFor(about, "en")).toBe("/en/about");
  });

  it("renvoie null sans adresse dans la langue", () => {
    expect(pathFor({ kind: "standard", slug: { fr: "page" } }, "en")).toBeNull();
  });
});

describe("resolveLink", () => {
  it("ajoute le service pré-choisi au lien de soumission", () => {
    const quote = { kind: "quote", slug: { fr: "soumission", en: "quote" } };
    expect(resolveLink({ kind: "internal", internal: quote, serviceId: "service-tqc" }, "en")).toBe("/en/quote?service=service-tqc");
  });

  it("localise une ancre de l'accueil saisie comme /#services", () => {
    expect(resolveLink({ kind: "external", external: "/#services" }, "fr")).toBe("/#services");
    expect(resolveLink({ kind: "external", external: "/#services" }, "en")).toBe("/en#services");
  });

  it("garde les adresses externes et courriels", () => {
    expect(resolveLink({ kind: "external", external: "https://example.com" }, "en")).toBe("https://example.com");
    expect(resolveLink({ kind: "email", email: "contact@bimurix.com" }, "fr")).toBe("mailto:contact@bimurix.com");
  });
});
