import { describe, expect, it } from "vitest";
import { formatDeadline, packageHref } from "@/lib/packages/launch";

describe("formatDeadline (ADR-006 n° 13)", () => {
  it("écrit la date en toutes lettres selon la langue", () => {
    expect(formatDeadline("2027-01-09", "fr")).toBe("9 janvier 2027");
    expect(formatDeadline("2027-01-09", "en")).toBe("January 9, 2027");
  });
  it("ne montre aucune date si le champ est vide ou invalide", () => {
    expect(formatDeadline("", "fr")).toBeNull();
    expect(formatDeadline(null, "en")).toBeNull();
    expect(formatDeadline("2027-02-31", "fr")).toBeNull();
    expect(formatDeadline("n'importe quoi", "fr")).toBeNull();
  });
});

describe("packageHref", () => {
  it("ajoute le code du forfait en paramètre d'adresse", () => {
    expect(packageHref("/soumission", "F-01")).toBe("/soumission?forfait=F-01");
    expect(packageHref("/en/quote", "F 02")).toBe("/en/quote?forfait=F%2002");
  });
  it("renvoie null sans page de soumission ou sans code", () => {
    expect(packageHref(null, "F-01")).toBeNull();
    expect(packageHref("/soumission", undefined)).toBeNull();
  });
});
