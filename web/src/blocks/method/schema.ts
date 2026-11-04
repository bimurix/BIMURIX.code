import { defineField, defineType } from "sanity";
import { blockPreview, headingField, titledTextMember } from "../shared";

export const method = defineType({
  name: "method",
  title: "Méthode (étapes)",
  type: "object",
  fields: [
    headingField,
    defineField({ name: "steps", title: "Étapes", type: "array", of: [titledTextMember], validation: (r) => r.max(8) }),
  ],
  preview: blockPreview("Méthode"),
});
