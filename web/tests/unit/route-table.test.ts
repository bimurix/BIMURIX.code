import { describe, expect, it } from "vitest";
import { decideContentRoute, type RouteTable } from "@/lib/route-table";

const table: RouteTable = {
  pages: [
    { fr: "a-propos", en: "about" },
    { fr: "services/prefabrication-tuyauterie", en: "services/piping-prefabrication" },
    { fr: "seulement-fr" },
  ],
  redirects: [
    { from: "/services/prefabrication-mep", to: "/services/prefabrication-tuyauterie", permanent: true },
    { from: "/en/services/mep-prefabrication", to: "/en/services/piping-prefabrication" },
    { from: "/externe", to: "https://exemple.com/x", permanent: true },
    { from: "/boucle", to: "/boucle/", permanent: true },
    { from: "/temporaire", to: "/a-propos", permanent: false },
    { from: "/a-propos", to: "/soumission", permanent: true }, // une page existante l'emporte
  ],
};

describe("decideContentRoute (S4 : statut tranché avant le rendu)", () => {
  it("laisse passer l'accueil et les adresses connues, en FR et en EN", () => {
    for (const path of ["/", "/en", "/a-propos", "/en/about", "/services/prefabrication-tuyauterie", "/en/services/piping-prefabrication"]) {
      expect(decideContentRoute(table, path), path).toEqual({ action: "next" });
    }
  });

  it("ignore un slash final", () => {
    expect(decideContentRoute(table, "/a-propos/")).toEqual({ action: "next" });
  });

  it("une page sans version anglaise n'existe pas en EN", () => {
    expect(decideContentRoute(table, "/seulement-fr")).toEqual({ action: "next" });
    expect(decideContentRoute(table, "/en/seulement-fr")).toEqual({ action: "notFound" });
  });

  it("répond introuvable pour une adresse inconnue", () => {
    expect(decideContentRoute(table, "/cette-page-n-existe-pas")).toEqual({ action: "notFound" });
    expect(decideContentRoute(table, "/en/zzz")).toEqual({ action: "notFound" });
    expect(decideContentRoute(table, "/en/a-propos")).toEqual({ action: "notFound" });
  });

  it("redirige une ancienne adresse : 308 par défaut (permanent), 307 si temporaire", () => {
    expect(decideContentRoute(table, "/services/prefabrication-mep")).toEqual({ action: "redirect", to: "/services/prefabrication-tuyauterie", status: 308 });
    expect(decideContentRoute(table, "/en/services/mep-prefabrication")).toEqual({ action: "redirect", to: "/en/services/piping-prefabrication", status: 308 });
    expect(decideContentRoute(table, "/temporaire")).toEqual({ action: "redirect", to: "/a-propos", status: 307 });
  });

  it("refuse une redirection vers un autre domaine ou en boucle (introuvable)", () => {
    expect(decideContentRoute(table, "/externe")).toEqual({ action: "notFound" });
    expect(decideContentRoute(table, "/boucle")).toEqual({ action: "notFound" });
  });

  it("une page existante l'emporte sur une redirection de même adresse", () => {
    expect(decideContentRoute(table, "/a-propos")).toEqual({ action: "next" });
  });

  it("décode les adresses encodées", () => {
    expect(decideContentRoute({ pages: [{ fr: "étude" }], redirects: [] }, "/%C3%A9tude")).toEqual({ action: "next" });
  });

  it("sans table (Sanity injoignable), ne tranche pas", () => {
    expect(decideContentRoute(null, "/cette-page-n-existe-pas")).toEqual({ action: "next" });
  });
});
