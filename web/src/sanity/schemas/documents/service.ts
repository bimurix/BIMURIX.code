import { defineArrayMember, defineField, defineType } from "sanity";
import { requireFr } from "../objects/locale";

const titledText = (name: string) =>
  defineArrayMember({
    type: "object",
    name,
    fields: [
      defineField({ name: "title", title: "Titre", type: "localeString", validation: requireFr }),
      defineField({ name: "text", title: "Texte", type: "localeText" }),
      defineField({ name: "group", title: "Sous-titre de groupe (facultatif)", type: "localeString", description: "Range les prestations sous un sous-titre (ex. : « Réseaux »). À poser sur la première prestation de chaque groupe ; les suivantes restent dans le même groupe. Vide partout : aucun sous-titre." }),
    ],
    preview: { select: { title: "title.fr", subtitle: "group.fr" } },
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
    defineField({ name: "shortTitle", title: "Nom court", type: "localeString", group: "card", description: "Facultatif. Utilisé au menu, sur les cartes et dans le formulaire quand il existe. Ex. : « Gicleurs »." }),
    defineField({ name: "family", title: "Famille", type: "string", group: "card", description: "Facultatif. Range le service dans le menu, sur l'accueil et au pied de page. Vide : affichage sans groupes.", options: { list: [{ title: "Modéliser et coordonner", value: "modeler" }, { title: "Préfabriquer", value: "prefabriquer" }, { title: "Livrer et exploiter", value: "livrer" }], layout: "radio" } }),
    defineField({ name: "code", title: "Code de réseau", type: "string", group: "card", description: "Ex. : P-01. Affiché sur l'isométrique.", validation: (r) => r.required().max(6) }),
    defineField({ name: "network", title: "Couleur de réseau", type: "networkColor", group: "card", validation: (r) => r.required() }),
    defineField({ name: "order", title: "Ordre", type: "number", group: "card", initialValue: 10 }),
    defineField({ name: "cardTitle", title: "Titre de la carte", type: "localeString", group: "card", validation: requireFr }),
    defineField({ name: "cardText", title: "Texte de la carte", type: "localeText", group: "card", validation: requireFr }),
    defineField({ name: "cardLinkLabel", title: "Libellé du lien", type: "localeString", group: "card" }),

    // Ordre de la page : même ordre que le gabarit (plan de contenu v5 § 2b). Tous les nouveaux champs sont facultatifs.
    defineField({ name: "heroHeading", title: "Titre principal (H1)", type: "localeString", group: "page", validation: requireFr }),
    defineField({ name: "heroIntro", title: "Introduction", type: "localeText", group: "page" }),
    defineField({ name: "heroCta", title: "Bouton du haut", type: "cta", group: "page" }),
    defineField({ name: "quoteButtonLabel", title: "Libellé du bouton « Demander une soumission » de ce service", type: "localeString", group: "page", description: "Facultatif. Remplace le libellé du bouton du haut et du bouton final. Ex. : « Demander une soumission de gicleurs »." }),
    defineField({ name: "heroImage", title: "Image du haut", type: "imageWithAlt", group: "page", description: "Facultatif. Ratio 4:3. Photo d'illustration (légende « Photo d'illustration ») ou schéma ; jamais un projet de Bimurix. Sans image, rien ne s'affiche." }),
    defineField({ name: "pledge", title: "Phrase de confiance", type: "localeString", group: "page", description: "Facultatif. Une phrase mise en évidence sous l'introduction (ex. : « Les données manquantes sont signalées, jamais inventées. »). Une fois par page." }),
    defineField({ name: "audience", title: "Pour qui", type: "localeText", group: "page", description: "À qui s'adresse cette offre." }),
    defineField({ name: "scenarios", title: "Situations types", type: "array", group: "page", of: [defineArrayMember({ type: "scenario" })], description: "Une ou deux situations de chantier. Vide : la section n'apparaît pas." }),
    defineField({ name: "offeringsHeading", title: "Titre des prestations", type: "localeString", group: "page" }),
    defineField({ name: "offerings", title: "Prestations (ce que nous faisons)", type: "array", group: "page", of: [titledText("offering")] }),
    defineField({ name: "deliverablesHeading", title: "Titre des livrables", type: "localeString", group: "page" }),
    defineField({ name: "deliverableRows", title: "Livrables avec leur usage", type: "array", group: "page", of: [defineArrayMember({ type: "deliverableRow" })], description: "Un livrable et « à quoi ça sert ». S'il y en a, ils remplacent la liste « Livrables possibles » ci-dessous." }),
    defineField({ name: "deliverables", title: "Livrables possibles (liste simple)", type: "array", group: "page", of: [defineArrayMember({ type: "localeString" })], description: "Ancienne liste, sans usage. Affichée seulement si « Livrables avec leur usage » est vide." }),
    defineField({ name: "figureImage", title: "Image de livrable (exemple)", type: "imageWithAlt", group: "page", description: "Facultatif. Schéma marqué « exemple » ou capture anonymisée d'un vrai livrable (nom du projet, du client, de l'entrepreneur retirés)." }),
    defineField({ name: "deliverablesNote", title: "Note sous les livrables", type: "localeText", group: "page" }),
    defineField({ name: "needsHeading", title: "Ce qu'il faut nous envoyer : titre", type: "localeString", group: "page" }),
    defineField({ name: "needs", title: "Ce qu'il faut nous envoyer : lignes", type: "array", group: "page", of: [defineArrayMember({ type: "localeStringIcon" })], description: "Les documents et informations à joindre à la demande. Vide : la section n'apparaît pas." }),
    defineField({ name: "needsNote", title: "Ce qu'il faut nous envoyer : note", type: "localeText", group: "page" }),
    defineField({ name: "methodHeading", title: "Titre de la démarche", type: "localeString", group: "page" }),
    defineField({ name: "methodSteps", title: "Étapes de la démarche", type: "array", group: "page", of: [defineArrayMember({ type: "localeStringIcon" })] }),
    defineField({ name: "extraHeading", title: "Section libre : titre", type: "localeString", group: "page" }),
    defineField({ name: "extraItems", title: "Section libre : points", type: "array", group: "page", of: [defineArrayMember({ type: "localeString" })] }),
    defineField({ name: "extraNote", title: "Section libre : note", type: "localeText", group: "page" }),
    defineField({ name: "moreHeading", title: "2e section libre : titre", type: "localeString", group: "page" }),
    defineField({ name: "moreItems", title: "2e section libre : points", type: "array", group: "page", of: [defineArrayMember({ type: "localeString" })] }),
    defineField({ name: "moreNote", title: "2e section libre : note", type: "localeText", group: "page" }),
    defineField({ name: "responsibilityRows", title: "Qui fait quoi : lignes du tableau", type: "array", group: "page", of: [defineArrayMember({ type: "responsibilityRow" })], description: "Seulement les lignes qui concernent ce service. Vide : seule la phrase « Qui signe » s'affiche." }),
    defineField({ name: "responsibilityNote", title: "Qui signe", type: "localeText", group: "page", description: "Conception, calculs, approbation, signature et sceau restent à l'ingénieur ou à l'entrepreneur. Affichée sous le tableau." }),
    defineField({ name: "proof", title: "Preuve chiffrée (source d'un tiers)", type: "proof", group: "page", description: "Facultatif, seulement avec le nom et le lien de la source." }),
    defineField({ name: "faq", title: "Questions sur ce service", type: "array", group: "page", of: [defineArrayMember({ type: "faqEntry" })], description: "Trois ou quatre questions. Vide : la section n'apparaît pas." }),
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
