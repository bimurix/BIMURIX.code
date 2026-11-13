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
    defineField({ name: "note", title: "Promesse sous le bouton", type: "localeString", description: "Ex. : « Nous vous répondons d'ici un jour ouvrable. » Vide : le texte des « Petits textes du site » est utilisé. N'écrire « gratuit » ou « sans engagement » que si le client le confirme." }),
    defineField({ name: "showPhone", title: "Afficher « Ou appelez le… »", type: "boolean", initialValue: true, description: "Seulement si un téléphone est saisi dans Identité et coordonnées." }),
  ],
  preview: blockPreview("Appel à l'action"),
});
