import { describe, expect, it } from "vitest";
import { safeRedirectTarget } from "@/lib/redirect-target";

// N6 : le champ « Nouvelle adresse » de Studio ne doit jamais renvoyer le visiteur vers un autre domaine ni en boucle.
describe("safeRedirectTarget", () => {
  it("accepte une adresse interne", () => {
    expect(safeRedirectTarget("/services/prefabrication-tuyauterie", "/services/prefabrication-mep")).toBe("/services/prefabrication-tuyauterie");
  });
  it("refuse une adresse sans barre initiale, https:// ou protocole relatif", () => {
    expect(safeRedirectTarget("https://example.com/x", "/a")).toBeNull();
    expect(safeRedirectTarget("//example.com/x", "/a")).toBeNull();
    expect(safeRedirectTarget(String.raw`/\example.com`, "/a")).toBeNull();
    expect(safeRedirectTarget("javascript:alert(1)", "/a")).toBeNull();
  });
  it("refuse une redirection vers elle-même", () => {
    expect(safeRedirectTarget("/a", "/a")).toBeNull();
    expect(safeRedirectTarget("/a/", "/a")).toBeNull();
  });
  it("refuse une valeur vide ou absente", () => {
    expect(safeRedirectTarget("", "/a")).toBeNull();
    expect(safeRedirectTarget(undefined, "/a")).toBeNull();
  });
});
