import { defineArrayMember, defineField, defineType } from "sanity";
import { blockPreview, headingField } from "../shared";

// decision: plan de contenu v5 § 3.9 — la conception, les calculs, l'approbation, la signature et le sceau
// restent à l'ingénieur ou à l'entrepreneur ; le tableau n'affirme rien que les textes d'origine ne disent déjà.
export const responsibilityTable = defineType({
  name: "responsibilityTable",
  title: "Qui fait quoi (tableau)",
  type: "object",
  fields: [
    headingField,
    defineField({ name: "intro", title: "Introduction", type: "localeText" }),
    defineField({ name: "rows", title: "Lignes du tableau", type: "array", of: [defineArrayMember({ type: "responsibilityRow" })], validation: (r) => r.max(12) }),
    defineField({ name: "note", title: "Phrase sous le tableau", type: "localeText", description: "Ex. : « La conception, les calculs (y compris parasismique), l'approbation, la signature et le sceau des dessins restent à l'ingénieur ou à l'entrepreneur. »" }),
  ],
  preview: blockPreview("Qui fait quoi"),
});
