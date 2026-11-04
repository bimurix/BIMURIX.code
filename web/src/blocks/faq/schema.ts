import { defineArrayMember, defineField, defineType } from "sanity";
import { requireFr } from "@/sanity/schemas/objects/locale";
import { blockPreview, headingField } from "../shared";

export const faq = defineType({
  name: "faq",
  title: "Questions fréquentes",
  type: "object",
  fields: [
    headingField,
    defineField({
      name: "items",
      title: "Questions",
      type: "array",
      of: [
        defineArrayMember({
          type: "object",
          name: "faqItem",
          fields: [
            defineField({ name: "question", title: "Question", type: "localeString", validation: requireFr }),
            defineField({ name: "answer", title: "Réponse", type: "localeText", validation: requireFr }),
          ],
          preview: { select: { title: "question.fr" } },
        }),
      ],
    }),
  ],
  preview: blockPreview("FAQ"),
});
