import { defineArrayMember, defineField, defineType } from "sanity";
import { requireFr } from "@/sanity/schemas/objects/locale";
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
    defineField({ name: "short", title: "Version courte", type: "boolean", initialValue: false, description: "Coché : trois lignes (Bimurix, l'ingénieur, l'entrepreneur) au lieu du tableau complet, avec le lien « Voir le détail »." }),
    defineField({
      name: "shortRows",
      title: "Version courte : lignes",
      type: "array",
      hidden: ({ parent }) => !parent?.short,
      validation: (r) => r.max(4),
      of: [defineArrayMember({ type: "object", name: "shortRow", fields: [defineField({ name: "title", title: "Qui", type: "localeString", validation: requireFr }), defineField({ name: "text", title: "Ce qu'il porte", type: "localeText" })], preview: { select: { title: "title.fr", subtitle: "text.fr" } } })],
    }),
    defineField({ name: "detailLink", title: "Version courte : lien « Voir le détail »", type: "cta", hidden: ({ parent }) => !parent?.short }),
    defineField({ name: "rows", title: "Lignes du tableau", type: "array", of: [defineArrayMember({ type: "responsibilityRow" })], validation: (r) => r.max(12) }),
    defineField({ name: "note", title: "Phrase sous le tableau", type: "localeText", description: "Ex. : « La conception, les calculs (y compris parasismique), l'approbation, la signature et le sceau des dessins restent à l'ingénieur ou à l'entrepreneur. »" }),
  ],
  preview: blockPreview("Qui fait quoi"),
});
