import { defineType } from "sanity";
import { blockPreview, headingField } from "../shared";

// Les conditions viennent du réglage « Lancement et conditions » : ce bloc choisit seulement où les afficher.
export const conditions = defineType({
  name: "conditions",
  title: "Conditions des forfaits",
  type: "object",
  fields: [headingField],
  preview: blockPreview("Conditions"),
});
