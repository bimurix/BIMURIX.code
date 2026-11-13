import { describe, expect, it } from "vitest";
import { homeScenarios, renumberScenarioTitle } from "../../scripts/seed/v5-scenarios.mts";

// S5 : l'expression régulière de S3b avait perdu son antislash (« d+ » au lieu de « \d+ ») ; l'accueil affichait 1, 1, 2.
describe("numérotation des situations types de l'accueil", () => {
  it("renumérote le titre FR et EN sans toucher au reste", () => {
    const t = renumberScenarioTitle({ fr: "Situation type 2 — Un cas", en: "Typical situation 2 — A case" }, 3);
    expect(t).toEqual({ fr: "Situation type 3 — Un cas", en: "Typical situation 3 — A case" });
  });
  it("l'accueil numérote 1, 2, 3 en FR et en EN", () => {
    const items = homeScenarios();
    expect(items.map((i) => i.title.fr.slice(0, 16))).toEqual(["Situation type 1", "Situation type 2", "Situation type 3"]);
    expect(items.map((i) => i.title.en.slice(0, 19))).toEqual(["Typical situation 1", "Typical situation 2", "Typical situation 3"]);
  });
});
