import { describe, expect, it } from "vitest";
import { pick } from "@/lib/i18n/pick";

describe("pick (ADR-003)", () => {
  it("renvoie la valeur de la langue demandée", () => {
    expect(pick({ fr: "Bonjour", en: "Hello" }, "en", "x")).toBe("Hello");
  });

  it("ne remplace jamais l'anglais manquant par le français", () => {
    expect(pick({ fr: "Bonjour" }, "en", "secours")).toBe("secours");
  });

  it("traite une chaîne vide comme absente", () => {
    expect(pick({ fr: "  " }, "fr", "secours")).toBe("secours");
  });

  it("accepte une valeur nulle", () => {
    expect(pick(null, "fr", "secours")).toBe("secours");
  });
});
