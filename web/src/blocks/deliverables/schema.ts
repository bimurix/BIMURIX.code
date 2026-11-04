import { defineArrayMember, defineField, defineType } from "sanity";
import { requireFr } from "@/sanity/schemas/objects/locale";
import { blockPreview, headingField } from "../shared";

export const deliverables = defineType({
  name: "deliverables",
  title: "Exemples de livrables",
  type: "object",
  fields: [
    headingField,
    defineField({ name: "intro", title: "Introduction", type: "localeText" }),
    defineField({
      name: "items",
      title: "Livrables",
      type: "array",
      of: [
        defineArrayMember({
          type: "object",
          name: "deliverableItem",
          fields: [
            defineField({ name: "title", title: "Titre", type: "localeString", validation: requireFr }),
            defineField({ name: "text", title: "Texte", type: "localeText" }),
            defineField({ name: "image", title: "Image", type: "imageWithAlt" }),
          ],
          preview: { select: { title: "title.fr", media: "image" } },
        }),
      ],
    }),
    defineField({ name: "note", title: "Note", type: "localeText" }),
  ],
  preview: blockPreview("Livrables"),
});
