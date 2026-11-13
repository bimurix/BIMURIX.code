import { defineField, defineType } from "sanity";
import { blockPreview, headingField } from "../shared";

// decision: cahier v6 C-32 — fiche « L'entreprise » en nomenclature. Nom légal, NEQ, téléphone, courriel et région viennent
// de « Identité et coordonnées » ; ce bloc ajoute les langues, le responsable et les champs du fondateur, vides au départ
// (aucune personne inventée : rien ne s'affiche tant qu'ils sont vides).
export const companySheet = defineType({
  name: "companySheet",
  title: "L'entreprise (fiche)",
  type: "object",
  fields: [
    headingField,
    defineField({ name: "languages", title: "Langues de travail", type: "localeString", description: "Ex. : Français, anglais." }),
    defineField({ name: "responsible", title: "Responsable", type: "localeString", description: "Ex. : Fondateur." }),
    defineField({ name: "founderName", title: "Nom du fondateur (facultatif)", type: "string", description: "Vide : rien ne s'affiche." }),
    defineField({ name: "founderPhoto", title: "Photo du fondateur (facultatif)", type: "imageWithAlt", description: "Vide : rien ne s'affiche." }),
    defineField({ name: "founderNote", title: "Mot du fondateur (facultatif)", type: "localeText", description: "Vide : rien ne s'affiche." }),
  ],
  preview: blockPreview("L'entreprise"),
});
