import { defineField, defineType } from "sanity";
import { blockPreview, headingField } from "../shared";

// Place le formulaire de soumission ; ses libellés se modifient dans « Formulaire de soumission ».
export const quoteForm = defineType({
  name: "quoteForm",
  title: "Formulaire de soumission",
  type: "object",
  fields: [headingField, defineField({ name: "intro", title: "Introduction", type: "localeText" })],
  preview: blockPreview("Formulaire"),
});
