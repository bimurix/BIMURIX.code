import { defineField, defineType } from "sanity";
import { blockPreview, headingField } from "../shared";

export const quoteCta = defineType({
  name: "quoteCta",
  title: "Appel à l'action",
  type: "object",
  fields: [
    headingField,
    defineField({ name: "text", title: "Texte", type: "localeText" }),
    defineField({ name: "button", title: "Bouton", type: "cta" }),
  ],
  preview: blockPreview("Appel à l'action"),
});
