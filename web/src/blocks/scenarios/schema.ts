import { defineArrayMember, defineField, defineType } from "sanity";
import { blockPreview, headingField } from "../shared";

// decision: plan de contenu v5 § 4 — situations types, jamais des projets réalisés.
export const scenarios = defineType({
  name: "scenarios",
  title: "Situations types",
  type: "object",
  fields: [
    headingField,
    defineField({ name: "intro", title: "Introduction", type: "localeText" }),
    defineField({ name: "note", title: "Note fixe", type: "localeText", description: "Ex. : « Ces situations sont des exemples types. Elles ne décrivent pas un projet réel ni un client de Bimurix. » Vide : le texte des « Petits textes du site » est utilisé." }),
    defineField({ name: "items", title: "Situations", type: "array", of: [defineArrayMember({ type: "scenario" })], validation: (r) => r.max(6) }),
  ],
  preview: blockPreview("Situations types"),
});
