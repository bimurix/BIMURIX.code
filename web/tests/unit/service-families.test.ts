import { describe, expect, it } from "vitest";
import { groupByFamily, shortName } from "@/lib/services/families";
import { v5Label } from "@/lib/i18n/v5-labels";

const s = (id: string, family?: string | null) => ({ id, family });

describe("groupByFamily", () => {
  it("ne renvoie rien pour une liste vide", () => {
    expect(groupByFamily([])).toEqual([]);
  });

  it("garde l'affichage d'avant (un seul groupe sans titre) quand aucune famille n'est renseignée", () => {
    const items = [s("a"), s("b", null)];
    expect(groupByFamily(items)).toEqual([{ family: null, items }]);
  });

  it("range par famille dans l'ordre des familles, puis dans l'ordre reçu", () => {
    const groups = groupByFamily([s("d", "livrer"), s("h", "prefabriquer"), s("p", "modeler"), s("g", "prefabriquer")]);
    expect(groups.map((g) => g.family)).toEqual(["modeler", "prefabriquer", "livrer"]);
    expect(groups[1].items.map((i) => i.id)).toEqual(["h", "g"]);
  });

  it("met les services sans famille ou de famille inconnue dans un dernier groupe sans titre", () => {
    const groups = groupByFamily([s("p", "modeler"), s("x"), s("y", "inconnue")]);
    expect(groups.map((g) => g.family)).toEqual(["modeler", null]);
    expect(groups[1].items.map((i) => i.id)).toEqual(["x", "y"]);
  });
});

describe("shortName", () => {
  const service = { title: { fr: "Nom complet", en: "Full name" }, shortTitle: { fr: "Nom court" } };
  it("préfère le nom court de la langue", () => expect(shortName(service, "fr")).toBe("Nom court"));
  it("retombe sur le nom complet sans nom court (pas de repli FR en EN)", () => expect(shortName(service, "en")).toBe("Full name"));
});

describe("v5Label", () => {
  it("lit Sanity d'abord", () => expect(v5Label({ purposeLabel: { fr: "Usage" } }, "purposeLabel", "fr")).toBe("Usage"));
  it("donne la valeur de secours de la langue si le champ est vide", () => {
    expect(v5Label(null, "purposeLabel", "fr")).toBe("À quoi ça sert");
    expect(v5Label({ purposeLabel: { fr: "Usage", en: "" } }, "purposeLabel", "en")).toBe("What it is for");
  });
});
