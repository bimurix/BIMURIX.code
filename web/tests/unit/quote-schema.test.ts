import { describe, expect, it } from "vitest";
import { formDataToInput, quoteSchema } from "@/lib/quote/schema";

// decision: plan de contenu v5 § 10 n° 10 — le budget approximatif est facultatif (un budget n'est pas un prix publié).
const base = {
  locale: "fr", fullName: "Marie Tremblay", company: "Construction ABC", email: "marie@abc.ca", preferredLanguage: "fr",
  requestType: "quote", service: "service-tqc", description: "Mise à jour TQC d'un bâtiment de 4 étages.", consent: true,
};

describe("quoteSchema : budget facultatif", () => {
  it("accepte une demande sans budget", () => {
    const parsed = quoteSchema.safeParse(base);
    expect(parsed.success).toBe(true);
    expect(parsed.success && parsed.data.budget).toBeUndefined();
  });

  it("traite un budget vide (liste non choisie) comme absent", () => {
    const parsed = quoteSchema.safeParse({ ...base, budget: "" });
    expect(parsed.success).toBe(true);
    expect(parsed.success && parsed.data.budget).toBeUndefined();
  });

  it("garde un budget choisi", () => {
    const parsed = quoteSchema.safeParse({ ...base, budget: "tbd" });
    expect(parsed.success && parsed.data.budget).toBe("tbd");
  });

  it("accepte le formulaire sans champ budget ni forfait", () => {
    const form = new FormData();
    for (const [k, v] of Object.entries({ ...base, consent: "on" })) form.append(k, String(v));
    expect(quoteSchema.safeParse(formDataToInput(form)).success).toBe(true);
  });
});
