import { defineField, defineType } from "sanity";
import { blockTypeNames } from "@/blocks/schemas";
import { requireFr } from "../objects/locale";

export const pageKinds = [
  { title: "Accueil", value: "home" },
  { title: "À propos", value: "about" },
  { title: "Demande de soumission", value: "quote" },
  { title: "Politique de confidentialité", value: "privacy" },
  { title: "Conditions d'utilisation", value: "terms" },
  { title: "Page introuvable (404)", value: "notFound" },
  { title: "Page libre", value: "standard" },
];

export const page = defineType({
  name: "page",
  title: "Page",
  type: "document",
  groups: [
    { name: "content", title: "Contenu", default: true },
    { name: "settings", title: "Réglages" },
    { name: "seo", title: "SEO" },
  ],
  fields: [
    defineField({ name: "title", title: "Titre de la page", type: "localeString", group: "content", validation: requireFr }),
    defineField({
      name: "sections",
      title: "Sections",
      type: "array",
      group: "content",
      description: "Ajoute, retire ou réordonne les sections de la page.",
      of: blockTypeNames.map((type) => ({ type })),
    }),

    defineField({ name: "kind", title: "Type de page", type: "string", group: "settings", initialValue: "standard", options: { list: pageKinds }, validation: (r) => r.required() }),
    defineField({
      name: "slug",
      title: "Adresse",
      type: "localeSlug",
      group: "settings",
      hidden: ({ parent }) => parent?.kind === "home" || parent?.kind === "notFound",
      validation: (r) =>
        r.custom((value: { fr?: string } | undefined, ctx) => {
          const kind = (ctx.document as { kind?: string } | undefined)?.kind;
          if (kind === "home" || kind === "notFound") return true;
          return value?.fr ? true : "L'adresse FR est obligatoire.";
        }),
    }),
    defineField({ name: "titleBlock", title: "Cartouche", type: "titleBlock", group: "settings" }),
    defineField({ name: "updatedLabel", title: "Dernière mise à jour (pages légales)", type: "localeString", group: "settings" }),

    defineField({ name: "seo", title: "SEO", type: "seo", group: "seo" }),
  ],
  preview: {
    select: { title: "title.fr", kind: "kind", slug: "slug.fr" },
    prepare: ({ title, kind, slug }) => ({
      title,
      subtitle: kind === "home" ? "/" : kind === "notFound" ? "404" : `/${slug ?? ""}`,
    }),
  },
});

export const redirect = defineType({
  name: "redirect",
  title: "Redirection",
  type: "document",
  fields: [
    defineField({ name: "from", title: "Ancienne adresse", type: "string", description: "Ex. : /services/ancien-nom", validation: (r) => r.required().regex(/^\//) }),
    defineField({ name: "to", title: "Nouvelle adresse", type: "string", validation: (r) => r.required().regex(/^\/|^https:\/\//) }),
    defineField({ name: "permanent", title: "Permanente (308)", type: "boolean", initialValue: true }),
  ],
  preview: { select: { title: "from", subtitle: "to" } },
});
