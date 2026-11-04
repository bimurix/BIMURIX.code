import { defineField, defineType } from "sanity";
import { blockPreview, headingField } from "../shared";

export const richText = defineType({
  name: "richText",
  title: "Texte",
  type: "object",
  fields: [headingField, defineField({ name: "body", title: "Texte", type: "localeRichText" })],
  preview: blockPreview("Texte"),
});
