import { defineField, defineType } from "sanity";
import { requireFr } from "./locale";

export const link = defineType({
  name: "link",
  title: "Lien",
  type: "object",
  fields: [
    defineField({
      name: "kind",
      title: "Type",
      type: "string",
      initialValue: "internal",
      options: { list: [{ title: "Page du site", value: "internal" }, { title: "Adresse externe", value: "external" }, { title: "Courriel", value: "email" }], layout: "radio", direction: "horizontal" },
    }),
    defineField({ name: "internal", title: "Page", type: "reference", to: [{ type: "page" }, { type: "service" }], hidden: ({ parent }) => parent?.kind !== "internal" }),
    defineField({ name: "external", title: "URL", type: "url", hidden: ({ parent }) => parent?.kind !== "external" }),
    defineField({ name: "email", title: "Courriel", type: "email", hidden: ({ parent }) => parent?.kind !== "email" }),
    defineField({ name: "service", title: "Pré-choisir ce service dans le formulaire", type: "reference", to: [{ type: "service" }], description: "Facultatif : pour un bouton « Demander une soumission ».", hidden: ({ parent }) => parent?.kind !== "internal" }),
  ],
});

export const cta = defineType({
  name: "cta",
  title: "Bouton",
  type: "object",
  fields: [
    defineField({ name: "label", title: "Libellé", type: "localeString", validation: requireFr }),
    defineField({ name: "link", title: "Lien", type: "link" }),
    defineField({ name: "style", title: "Style", type: "string", initialValue: "primary", options: { list: [{ title: "Principal (bleu)", value: "primary" }, { title: "Secondaire (contour)", value: "secondary" }], layout: "radio", direction: "horizontal" } }),
  ],
  preview: { select: { title: "label.fr", subtitle: "style" } },
});

export const imageWithAlt = defineType({
  name: "imageWithAlt",
  title: "Image",
  type: "image",
  options: { hotspot: true },
  fields: [
    defineField({ name: "alt", title: "Texte alternatif", type: "localeString", description: "Décris l'image pour les personnes qui ne la voient pas.", validation: requireFr }),
    defineField({ name: "illustrative", title: "Exemple illustratif", type: "boolean", initialValue: false, description: "Coche si l'image n'est pas un vrai projet : la mention « exemple illustratif » s'affichera." }),
  ],
});

export const seo = defineType({
  name: "seo",
  title: "Référencement (SEO)",
  type: "object",
  options: { collapsible: true, collapsed: true },
  fields: [
    defineField({ name: "title", title: "Titre SEO", type: "localeString", description: "≈ 50 à 60 caractères." }),
    defineField({ name: "description", title: "Méta-description", type: "localeText", description: "≈ 140 à 160 caractères." }),
    defineField({ name: "image", title: "Image de partage", type: "image", description: "1200 × 630 px." }),
    defineField({ name: "noIndex", title: "Masquer des moteurs de recherche", type: "boolean", initialValue: false }),
  ],
});

// Cartouche de la feuille de plan (direction A), en bas à droite de chaque page.
export const titleBlock = defineType({
  name: "titleBlock",
  title: "Cartouche",
  type: "object",
  options: { collapsible: true, collapsed: true },
  fields: [
    defineField({ name: "sheet", title: "Numéro de feuille", type: "string", description: "Ex. : A-000, S-01." }),
    defineField({ name: "revision", title: "Révision", type: "string", initialValue: "0" }),
    defineField({ name: "date", title: "Date", type: "string", description: "Ex. : 2026-11." }),
  ],
});

export const networkColor = defineType({
  name: "networkColor",
  title: "Couleur de réseau",
  type: "string",
  description: "Couleur d'identification du service, reprise dans tout le site et le tableau de bord.",
  options: {
    list: [
      { title: "Vert (plomberie)", value: "plumb" },
      { title: "Rouge (chauffage)", value: "heat" },
      { title: "Violet (données)", value: "data" },
      { title: "Ardoise (TQC)", value: "tqc" },
    ],
    layout: "radio",
  },
});
