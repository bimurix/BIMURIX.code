import { describe, expect, it } from "vitest";
import type { Shell } from "@/sanity/types-content";
import { buildNavModel } from "@/ui/patterns/nav-model";

const svc = (id: string, code: string, extra: Record<string, unknown> = {}) => ({
  _id: id,
  _type: "service",
  code,
  network: "plumb" as const,
  title: { fr: `Titre ${code}`, en: `Title ${code}` },
  slug: { fr: `services/${id}`, en: `services/${id}-en` },
  ...extra,
});

const nav = { items: [{ _key: "s", label: { fr: "Services", en: "Services" }, listServices: true }] };

describe("buildNavModel : services par famille", () => {
  it("garde un seul groupe sans titre quand aucune famille n'est renseignée", () => {
    const shell: Shell = { navigation: nav, services: [svc("a", "P-01"), svc("b", "H-02")] };
    const groups = buildNavModel(shell, "fr").items[0].groups ?? [];
    expect(groups).toHaveLength(1);
    expect(groups[0].label).toBeNull();
    expect(groups[0].services.map((s) => s.label)).toEqual(["Titre P-01", "Titre H-02"]);
  });

  it("range par famille avec les titres de secours et utilise le nom court", () => {
    const shell: Shell = {
      navigation: nav,
      services: [
        svc("a", "P-01", { family: "modeler" }),
        svc("b", "H-02", { family: "prefabriquer", shortTitle: { fr: "Tuyauterie et plomberie", en: "Piping and plumbing" } }),
        svc("d", "D-05", { family: "livrer" }),
      ],
    };
    const groups = buildNavModel(shell, "fr").items[0].groups ?? [];
    expect(groups.map((g) => g.label)).toEqual(["Modéliser et coordonner", "Préfabriquer", "Livrer et exploiter"]);
    expect(groups[1].services[0].label).toBe("Tuyauterie et plomberie");
    expect(buildNavModel(shell, "en").items[0].groups?.[1].services[0].label).toBe("Piping and plumbing");
  });

  it("prend les titres de famille de Studio (petits textes) avant les valeurs de secours", () => {
    const shell: Shell = { navigation: nav, ui: { familyModeler: { fr: "Modèles" } }, services: [svc("a", "P-01", { family: "modeler" })] };
    expect(buildNavModel(shell, "fr").items[0].groups?.[0].label).toBe("Modèles");
  });

  it("n'affiche pas un élément « services » sans service", () => {
    expect(buildNavModel({ navigation: nav, services: [] }, "fr").items).toEqual([]);
  });
});
