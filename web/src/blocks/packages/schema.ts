import { defineField, defineType } from "sanity";
import { blockPreview, headingField } from "../shared";

// Nomenclature des forfaits visibles. Le contenu des forfaits vit dans les documents « Forfait ».
export const packages = defineType({
  name: "packages",
  title: "Forfaits (nomenclature)",
  type: "object",
  fields: [
    headingField,
    defineField({ name: "intro", title: "Introduction", type: "localeText" }),
    defineField({ name: "service", title: "Limiter à une offre", type: "reference", to: [{ type: "service" }], description: "Facultatif : laisser vide pour afficher tous les forfaits visibles." }),
    defineField({ name: "showTaxNote", title: "Afficher la note sur les taxes", type: "boolean", initialValue: true }),
  ],
  preview: blockPreview("Forfaits"),
});
