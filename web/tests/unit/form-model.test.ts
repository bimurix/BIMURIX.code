import { describe, expect, it } from "vitest";
import { buildFormModel } from "@/ui/patterns/quote-form/form-model";
import type { PackageData } from "@/lib/packages/packages";
import { packageDocs } from "../../scripts/seed/packages.mts";

// ADR-008 : « Forfait visé » n'existe dans le formulaire que si un forfait est visible (le code des forfaits reste).
const fromSeed = (visible: boolean): PackageData[] =>
  (packageDocs as unknown as Array<Record<string, unknown>>).map((d) => ({
    _id: d._id as string,
    code: d.code as string,
    title: d.title as PackageData["title"],
    order: d.order as number,
    visible,
    service: { _id: (d.service as { _ref: string })._ref, visible: true },
  }));
const content = (packages: PackageData[]) => ({ form: {}, packages }) as unknown as Parameters<typeof buildFormModel>[0];

describe("choix des forfaits du formulaire", () => {
  it("les forfaits du seed sont masqués : seul « autre » reste, donc aucun champ n'est affiché", () => {
    expect(buildFormModel(content(fromSeed(false)), "fr").packages.map((p) => p.value)).toEqual(["other"]);
  });

  it("un forfait remis à visible: true réapparaît dans la liste, avec son offre", () => {
    const model = buildFormModel(content(fromSeed(true)), "fr");
    expect(model.packages.map((p) => p.value)).toEqual(["F-01", "F-02", "F-03", "F-04", "F-05", "other"]);
    expect(model.packages.find((p) => p.value === "F-04")?.serviceId).toBe("service-combinee");
  });
});
