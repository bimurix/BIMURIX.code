import { defineArrayMember, defineField, defineType } from "sanity";
import { requireFr } from "../objects/locale";

const navItem = defineArrayMember({
  type: "object",
  name: "navItem",
  title: "Élément de menu",
  fields: [
    defineField({ name: "label", title: "Libellé", type: "localeString", validation: requireFr }),
    defineField({ name: "link", title: "Lien", type: "link" }),
    defineField({ name: "listServices", title: "Sous-menu : tous les services", type: "boolean", initialValue: false, description: "Affiche automatiquement la liste des services sous cet élément." }),
  ],
  preview: { select: { title: "label.fr" } },
});

export const navigation = defineType({
  name: "navigation",
  title: "Menu principal",
  type: "document",
  fields: [
    defineField({ name: "items", title: "Éléments", type: "array", of: [navItem], validation: (r) => r.max(6) }),
    defineField({ name: "cta", title: "Bouton d'action", type: "cta" }),
    defineField({ name: "languageLabel", title: "Libellé du sélecteur de langue", type: "localeString", description: "Ex. : « English » sur la version FR, « Français » sur la version EN." }),
  ],
  preview: { prepare: () => ({ title: "Menu principal" }) },
});

export const footer = defineType({
  name: "footer",
  title: "Pied de page",
  type: "document",
  fields: [
    defineField({ name: "blurb", title: "Présentation courte", type: "localeText" }),
    defineField({
      name: "columns",
      title: "Colonnes de liens",
      type: "array",
      validation: (r) => r.max(4),
      of: [
        defineArrayMember({
          type: "object",
          name: "footerColumn",
          fields: [
            defineField({ name: "title", title: "Titre", type: "localeString" }),
            defineField({ name: "links", title: "Liens", type: "array", of: [defineArrayMember({ type: "cta" })] }),
          ],
          preview: { select: { title: "title.fr" } },
        }),
      ],
    }),
    defineField({ name: "copyright", title: "Mention de droits", type: "localeString", description: "{year} est remplacé par l'année en cours." }),
  ],
  preview: { prepare: () => ({ title: "Pied de page" }) },
});
