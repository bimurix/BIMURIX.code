import { defineArrayMember, defineField, defineType } from "sanity";
import { requireFr } from "../objects/locale";

const titledText = (name: string) =>
  defineArrayMember({
    type: "object",
    name,
    fields: [
      defineField({ name: "title", title: "Titre", type: "localeString", validation: requireFr }),
      defineField({ name: "text", title: "Texte", type: "localeText" }),
    ],
    preview: { select: { title: "title.fr" } },
  });

export const service = defineType({
  name: "service",
  title: "Offre",
  type: "document",
  groups: [
    { name: "card", title: "Carte et réseau", default: true },
    { name: "page", title: "Page du service" },
    { name: "seo", title: "SEO" },
  ],
  orderings: [{ title: "Ordre d'affichage", name: "order", by: [{ field: "order", direction: "asc" }] }],
  fields: [
    // decision: ADR-006 n° 4 — masquer une offre sans la supprimer (menu, accueil, plan du site, adresse en 404).
    defineField({ name: "visible", title: "Affichée sur le site", type: "boolean", group: "card", initialValue: true, description: "Décochée : l'offre disparaît du menu, de l'accueil et du plan du site, et son adresse n'existe plus. Le contenu est conservé." }),
    defineField({ name: "title", title: "Nom du service", type: "localeString", group: "card", validation: requireFr }),
    defineField({ name: "slug", title: "Adresse", type: "localeSlug", group: "card", validation: requireFr }),
    defineField({ name: "code", title: "Code de réseau", type: "string", group: "card", description: "Ex. : P-01. Affiché sur l'isométrique.", validation: (r) => r.required().max(6) }),
    defineField({ name: "network", title: "Couleur de réseau", type: "networkColor", group: "card", validation: (r) => r.required() }),
    defineField({ name: "order", title: "Ordre", type: "number", group: "card", initialValue: 10 }),
    defineField({ name: "cardTitle", title: "Titre de la carte", type: "localeString", group: "card", validation: requireFr }),
    defineField({ name: "cardText", title: "Texte de la carte", type: "localeText", group: "card", validation: requireFr }),
    defineField({ name: "cardLinkLabel", title: "Libellé du lien", type: "localeString", group: "card" }),

    defineField({ name: "heroHeading", title: "Titre principal (H1)", type: "localeString", group: "page", validation: requireFr }),
    defineField({ name: "audience", title: "Pour qui", type: "localeText", group: "page", description: "À qui s'adresse cette offre." }),
    defineField({ name: "responsibilityNote", title: "Qui signe", type: "localeText", group: "page", description: "Conception, calculs, approbation, signature et sceau restent à l'ingénieur ou à l'entrepreneur." }),
    defineField({ name: "heroIntro", title: "Introduction", type: "localeText", group: "page" }),
    defineField({ name: "heroCta", title: "Bouton du haut", type: "cta", group: "page" }),
    defineField({ name: "heroImage", title: "Image ou extrait de modèle", type: "imageWithAlt", group: "page" }),
    defineField({ name: "offeringsHeading", title: "Titre des prestations", type: "localeString", group: "page" }),
    defineField({ name: "offerings", title: "Prestations", type: "array", group: "page", of: [titledText("offering")] }),
    defineField({ name: "deliverablesHeading", title: "Titre des livrables", type: "localeString", group: "page" }),
    defineField({ name: "deliverables", title: "Livrables possibles", type: "array", group: "page", of: [defineArrayMember({ type: "localeString" })] }),
    defineField({ name: "deliverablesNote", title: "Note sous les livrables", type: "localeText", group: "page" }),
    defineField({ name: "methodHeading", title: "Titre de la démarche", type: "localeString", group: "page" }),
    defineField({ name: "methodSteps", title: "Étapes de la démarche", type: "array", group: "page", of: [defineArrayMember({ type: "localeString" })] }),
    defineField({ name: "extraHeading", title: "Section libre : titre", type: "localeString", group: "page" }),
    defineField({ name: "extraItems", title: "Section libre : points", type: "array", group: "page", of: [defineArrayMember({ type: "localeString" })] }),
    defineField({ name: "extraNote", title: "Section libre : note", type: "localeText", group: "page" }),
    defineField({ name: "moreHeading", title: "2e section libre : titre", type: "localeString", group: "page" }),
    defineField({ name: "moreItems", title: "2e section libre : points", type: "array", group: "page", of: [defineArrayMember({ type: "localeString" })] }),
    defineField({ name: "moreNote", title: "2e section libre : note", type: "localeText", group: "page" }),
    defineField({ name: "ctaHeading", title: "Appel final : titre", type: "localeString", group: "page" }),
    defineField({ name: "ctaText", title: "Appel final : texte", type: "localeText", group: "page" }),
    defineField({ name: "ctaButton", title: "Appel final : bouton", type: "cta", group: "page" }),
    defineField({ name: "titleBlock", title: "Cartouche", type: "titleBlock", group: "page" }),

    defineField({ name: "seo", title: "SEO", type: "seo", group: "seo" }),
  ],
  preview: {
    select: { title: "title.fr", code: "code", visible: "visible" },
    prepare: ({ title, code, visible }: { title?: string; code?: string; visible?: boolean }) => ({ title, subtitle: [code, visible === false ? "masquée" : null].filter(Boolean).join(" · ") }),
  },
});
