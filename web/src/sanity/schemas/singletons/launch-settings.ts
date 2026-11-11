import { defineArrayMember, defineField, defineType } from "sanity";
import { requireFr } from "../objects/locale";

// decision: ADR-006 n° 3 et 11 — conditions des forfaits de lancement et mention professionnelle, modifiables sans développeur.
export const launchSettings = defineType({
  name: "launchSettings",
  title: "Lancement et conditions",
  type: "document",
  fields: [
    defineField({ name: "bannerEnabled", title: "Afficher le bandeau de lancement", type: "boolean", initialValue: false }),
    defineField({ name: "bannerText", title: "Texte du bandeau", type: "localeString" }),
    defineField({ name: "deadline", title: "Date limite des forfaits de lancement", type: "date" }),
    defineField({ name: "taxNote", title: "Note sur les taxes", type: "localeString", description: "Ex. : prix avant TPS et TVQ." }),
    defineField({ name: "creditText", title: "Crédit sur le projet complet", type: "localeText" }),
    defineField({
      name: "conditions",
      title: "Conditions",
      type: "array",
      of: [
        defineArrayMember({
          type: "object",
          name: "condition",
          fields: [
            defineField({ name: "title", title: "Titre", type: "localeString", validation: requireFr }),
            defineField({ name: "text", title: "Texte", type: "localeText", validation: requireFr }),
          ],
          preview: { select: { title: "title.fr", subtitle: "text.fr" } },
        }),
      ],
    }),
    defineField({ name: "professionalNote", title: "Mention professionnelle", type: "localeText", description: "Conception, calculs, approbation, signature et sceau : à l'ingénieur ou à l'entrepreneur." }),
  ],
  preview: { prepare: () => ({ title: "Lancement et conditions" }) },
});
