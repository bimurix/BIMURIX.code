import { defineArrayMember, defineField, defineType } from "sanity";
import { requireFr } from "@/sanity/schemas/objects/locale";
import { blockPreview } from "../shared";

// Premier écran « feuille de plan » : titre, texte, boutons, isométrique des réseaux.
export const heroSheet = defineType({
  name: "heroSheet",
  title: "Premier écran (feuille de plan)",
  type: "object",
  fields: [
    defineField({ name: "heading", title: "Titre principal (H1)", type: "localeString", validation: requireFr }),
    defineField({ name: "intro", title: "Texte", type: "localeText" }),
    defineField({ name: "ctas", title: "Boutons", type: "array", of: [defineArrayMember({ type: "cta" })], validation: (r) => r.max(2) }),
    defineField({ name: "specialties", title: "Ligne de spécialités", type: "localeString", description: "Ex. : Architecture · Structure · MEP · Préfabrication · BIM 7D · TQC" }),
    defineField({ name: "illustration", title: "Illustration (facultatif)", type: "imageWithAlt", description: "Laisser vide pour afficher l'isométrique des services." }),
  ],
  preview: blockPreview("Premier écran"),
});
