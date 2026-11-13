import { defineArrayMember, defineField, defineType } from "sanity";
import { requireFr } from "@/sanity/schemas/objects/locale";
import { blockPreview, headingField } from "../shared";

// decision: cahier v6 C-16, ADR-009 n° 2 — registre de projets. Les trois fiches de départ sont des gabarits marqués
// « Exemple — à remplacer » : `pnpm check:placeholders` les bloque. Aucun champ « client », « lieu », « économie » ni « témoignage ».
export const projects = defineType({
  name: "projects",
  title: "Projets (registre)",
  type: "object",
  fields: [
    defineField({ name: "enabled", title: "Afficher cette section", type: "boolean", initialValue: true, description: "Décoché : la section disparaît du site, les fiches sont conservées. À décocher à la mise en ligne s'il n'y a aucun projet réel." }),
    headingField,
    defineField({ name: "note", title: "Note sous le titre", type: "localeText", description: "Ex. : « Fiches d'exemple — elles seront remplacées par des projets réels. » À retirer quand les fiches sont réelles." }),
    defineField({
      name: "items",
      title: "Fiches de projet",
      type: "array",
      validation: (r) => r.max(8),
      of: [
        defineArrayMember({
          type: "object",
          name: "projectEntry",
          fields: [
            defineField({ name: "title", title: "Type de bâtiment", type: "localeString", validation: requireFr, description: "Pas de nom de client ni de lieu. Un exemple se termine par « (exemple) »." }),
            defineField({ name: "badge", title: "Pastille", type: "localeString", description: "« Exemple — à remplacer » tant que la fiche n'est pas un vrai projet. Vide : aucune pastille." }),
            defineField({ name: "discipline", title: "Discipline (service)", type: "reference", to: [{ type: "service" }] }),
            defineField({ name: "delivered", title: "Ce qui a été livré", type: "array", of: [defineArrayMember({ type: "localeString" })] }),
            defineField({ name: "tools", title: "Outils", type: "localeString", description: "Ex. : AutoSPRINK." }),
            defineField({ name: "year", title: "Année (facultatif)", type: "string" }),
            defineField({ name: "image", title: "Image (facultatif)", type: "imageWithAlt", description: "Laisser vide pour une fiche d'exemple : une photo de banque ferait croire à un projet réel." }),
          ],
          preview: { select: { title: "title.fr", subtitle: "badge.fr" } },
        }),
      ],
    }),
  ],
  preview: blockPreview("Projets"),
});
