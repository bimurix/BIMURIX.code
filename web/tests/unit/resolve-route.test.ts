import { describe, expect, it } from "vitest";
import { resolveRoute } from "@/lib/i18n/resolve-route";

describe("resolveRoute (ADR-003)", () => {
  it("réécrit l'accueil sans préfixe vers le français", () => {
    expect(resolveRoute("/")).toEqual({ action: "rewrite", pathname: "/fr" });
  });

  it("réécrit une page sans préfixe vers le français", () => {
    expect(resolveRoute("/a-propos")).toEqual({ action: "rewrite", pathname: "/fr/a-propos" });
  });

  it("sert l'anglais tel quel", () => {
    expect(resolveRoute("/en")).toEqual({ action: "next" });
    expect(resolveRoute("/en/about")).toEqual({ action: "next" });
  });

  it("redirige /fr vers l'adresse sans préfixe (une seule URL par page)", () => {
    expect(resolveRoute("/fr")).toEqual({ action: "redirect", pathname: "/" });
    expect(resolveRoute("/fr/a-propos")).toEqual({ action: "redirect", pathname: "/a-propos" });
  });

  it("ne confond pas un mot qui commence par en ou fr avec une langue", () => {
    expect(resolveRoute("/entreprise")).toEqual({ action: "rewrite", pathname: "/fr/entreprise" });
    expect(resolveRoute("/franchise")).toEqual({ action: "rewrite", pathname: "/fr/franchise" });
  });

  it("laisse passer Studio, admin, API et fichiers statiques", () => {
    for (const path of ["/studio", "/studio/structure", "/admin", "/admin/demandes", "/api/revalidate", "/favicon.ico", "/robots.txt"]) {
      expect(resolveRoute(path)).toEqual({ action: "next" });
    }
  });
});
