import { defineArrayMember, defineField, defineType } from "sanity";
import { blockPreview, headingField } from "../shared";

// Les services présentés comme les réseaux d'un même dessin (direction A).
export const serviceNetworks = defineType({
  name: "serviceNetworks",
  title: "Services (réseaux)",
  type: "object",
  fields: [
    headingField,
    defineField({ name: "intro", title: "Introduction", type: "localeText" }),
    defineField({
      name: "services",
      title: "Services affichés",
      type: "array",
      description: "Laisser vide pour afficher tous les services, dans leur ordre.",
      of: [defineArrayMember({ type: "reference", to: [{ type: "service" }] })],
    }),
  ],
  preview: blockPreview("Services"),
});
