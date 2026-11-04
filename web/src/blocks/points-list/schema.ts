import { defineField, defineType } from "sanity";
import { blockPreview, headingField, titledTextMember } from "../shared";

// Liste de points : clientèles, avantages, approche…
export const pointsList = defineType({
  name: "pointsList",
  title: "Liste de points",
  type: "object",
  fields: [
    headingField,
    defineField({ name: "intro", title: "Introduction", type: "localeText" }),
    defineField({ name: "items", title: "Points", type: "array", of: [titledTextMember] }),
    defineField({
      name: "layout",
      title: "Disposition",
      type: "string",
      initialValue: "columns",
      options: { list: [{ title: "Colonnes", value: "columns" }, { title: "Liste", value: "list" }], layout: "radio", direction: "horizontal" },
    }),
  ],
  preview: blockPreview("Liste de points"),
});
