import { defineArrayMember, defineField, defineType } from "sanity";
import { blockPreview, headingField } from "../shared";

// decision: plan de contenu v5 § 2b (H4) — où Bimurix intervient dans le cycle d'un projet.
export const projectCycle = defineType({
  name: "projectCycle",
  title: "Cycle du projet (schéma)",
  type: "object",
  fields: [
    headingField,
    defineField({ name: "intro", title: "Introduction", type: "localeText", description: "Ex. : « Un mandat peut couvrir une étape ou plusieurs. »" }),
    defineField({ name: "summary", title: "Description pour les lecteurs d'écran (facultatif)", type: "localeText", description: "Une ou deux phrases qui décrivent le schéma pour une personne qui ne le voit pas." }),
    defineField({
      name: "services",
      title: "Services affichés",
      type: "array",
      description: "Laisser vide pour afficher tous les services, dans leur ordre. Les familles viennent de chaque service.",
      of: [defineArrayMember({ type: "reference", to: [{ type: "service" }] })],
    }),
  ],
  preview: blockPreview("Cycle du projet"),
});
