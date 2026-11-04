import { defineArrayMember, defineField } from "sanity";
import { requireFr } from "@/sanity/schemas/objects/locale";

/** Titre de section, commun à tous les blocs. */
export const headingField = defineField({ name: "heading", title: "Titre de la section", type: "localeString" });

/** Élément « titre + texte » réutilisé par plusieurs blocs. */
export const titledTextMember = defineArrayMember({
  type: "object",
  name: "titledText",
  fields: [
    defineField({ name: "title", title: "Titre", type: "localeString", validation: requireFr }),
    defineField({ name: "text", title: "Texte", type: "localeText" }),
  ],
  preview: { select: { title: "title.fr", subtitle: "text.fr" } },
});

export function blockPreview(label: string) {
  return {
    select: { heading: "heading.fr" },
    prepare: ({ heading }: { heading?: string }) => ({ title: heading || label, subtitle: label }),
  };
}
