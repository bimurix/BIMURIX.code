import { describe, expect, it } from "vitest";
import { ICON_NAMES } from "@/lib/icon-names";
import { seedDocuments } from "../../scripts/seed/documents.mts";
import { iconFor, iconSlots, SERVICE_ICONS } from "../../scripts/seed/icons-t3.mts";

type Doc = { _id: string; _type: string } & Record<string, unknown>;
const docs = seedDocuments as unknown as Doc[];
const names = new Set<string>(ICON_NAMES);

describe("symboles des lignes (T3-A)", () => {
  it("la table n'emploie que des noms de la liste fermée", () => {
    for (const icon of Object.values(SERVICE_ICONS)) expect(names.has(icon), icon).toBe(true);
    for (const kind of ["problems", "why", "deliverables", "needs", "steps", "assurance"] as const) {
      for (const sample of ["conflit", "spool", "etiquette", "demandez", "reponse", "fabricants"]) {
        const icon = iconFor(kind, sample);
        if (icon) expect(names.has(icon), `${kind}:${icon}`).toBe(true);
      }
    }
  });

  it("le contenu de départ porte les symboles : aucune ligne n'en attend encore un, tous sont valides", () => {
    for (const doc of docs) expect(iconSlots(doc), doc._id).toEqual([]);
    const home = docs.find((d) => d._id === "page-home") as Doc;
    const sections = home.sections as Array<{ _type: string; items?: Array<{ icon?: string }> }>;
    const problems = sections.find((s) => s._type === "problems")?.items ?? [];
    expect(problems).toHaveLength(6);
    expect(problems.every((p) => p.icon && names.has(p.icon))).toBe(true);
    for (const service of docs.filter((d) => d._type === "service")) expect(names.has(service.cardIcon as string), service._id).toBe(true);
  });

  it("un symbole déjà choisi n'est jamais remplacé", () => {
    const doc = { _id: "x", _type: "service", needs: [{ _key: "a", fr: "Les fabricants retenus", icon: "plus" }, { _key: "b", fr: "Les fabricants retenus" }] };
    const slots = iconSlots(doc);
    expect(slots).toHaveLength(1);
    expect(slots[0].path).toBe('needs[_key=="b"].icon');
  });
});
