import { describe, expect, it } from "vitest";
import { findPlaceholders, isPlaceholder, PLACEHOLDER_MARKERS } from "@/lib/placeholders";
import { PLACEHOLDER_MARKERS as seedMarkers } from "../../scripts/seed/helpers.mts";
import { seedDocuments } from "../../scripts/seed/documents.mts";

describe("valeurs d'exemple (ADR-009 n° 1 à 5)", () => {
  it("reconnaît les trois valeurs génériques et les deux pastilles de projet", () => {
    for (const v of ["514 555-0199 (exemple)", "Bimurix inc. (exemple)", "1234567890 (exemple)", "Exemple — à remplacer", "Example — to be replaced", "Example (example)"]) {
      expect(isPlaceholder(v), v).toBe(true);
    }
  });
  it("T7 : reconnaît aussi les formes « — exemple » et les mentions de validation juridique des pages légales", () => {
    for (const v of ["(lieux exacts à confirmer — exemple)", "(30 jours — example, to be confirmed)", "à compléter — exemple)", "Il doit être validé par un conseiller juridique avant la mise en ligne.", "It must be validated by a legal adviser before launch.", "(à faire valider par un conseiller juridique)", "(to be validated by a legal adviser)"]) {
      expect(isPlaceholder(v), v).toBe(true);
    }
  });
  it("ne marque ni une valeur réelle ni une valeur vide", () => {
    for (const v of ["514 555-1234", "Bimurix inc.", "contact@bimurix.com", "", null, undefined]) expect(isPlaceholder(v), String(v)).toBe(false);
  });
  it("le seed et le code lisent la même liste de marqueurs", () => {
    expect(seedMarkers).toBe(PLACEHOLDER_MARKERS);
  });
  it("findPlaceholders parcourt le contenu et donne le chemin de chaque valeur", () => {
    const hits = findPlaceholders({ _id: "a", phone: "514 555-0199 (exemple)", items: [{ badge: { fr: "Exemple — à remplacer", en: "Example — to be replaced" } }], ok: "rien" });
    expect(hits.map((h) => h.path)).toEqual(["phone", "items[0].badge.fr", "items[0].badge.en"]);
  });
  it("le contenu de départ contient les trois coordonnées d'exemple et les trois fiches de projet (la liste de mise en ligne les bloque)", () => {
    const hits = seedDocuments.flatMap((d) => findPlaceholders(d).map((h) => `${d._id} › ${h.path}`));
    for (const p of ["settings › phone", "settings › legalName", "settings › neq"]) expect(hits, p).toContain(p);
    expect(hits.filter((h) => /items\[\d\]\.badge\.fr$/.test(h))).toHaveLength(3);
  });
});
