import { defineArrayMember, defineField, defineType } from "sanity";
import { requireFr } from "@/sanity/schemas/objects/locale";
import { blockPreview, headingField, iconField } from "../shared";

// decision: plan de contenu v5 § 2b (H2) — les problèmes de chantier avant les services.
export const problems = defineType({
  name: "problems",
  title: "Problèmes de chantier",
  type: "object",
  fields: [
    headingField,
    defineField({ name: "intro", title: "Introduction", type: "localeText" }),
    defineField({ name: "image", title: "Image (facultatif)", type: "imageWithAlt", description: "Bande 21:9 sous le titre. Photo d'illustration : légende « Photo d'illustration », jamais un projet de Bimurix." }),
    defineField({
      name: "items",
      title: "Problèmes",
      type: "array",
      validation: (r) => r.max(8),
      of: [
        defineArrayMember({
          type: "object",
          name: "problemItem",
          fields: [
            defineField({ name: "title", title: "Le problème (une phrase)", type: "localeString", validation: requireFr }),
            defineField({ name: "text", title: "Ce que fait Bimurix", type: "localeText" }),
            iconField,
            defineField({ name: "services", title: "Services qui répondent", type: "array", of: [defineArrayMember({ type: "reference", to: [{ type: "service" }] })] }),
          ],
          preview: { select: { title: "title.fr", subtitle: "text.fr" } },
        }),
      ],
    }),
  ],
  preview: blockPreview("Problèmes de chantier"),
});
