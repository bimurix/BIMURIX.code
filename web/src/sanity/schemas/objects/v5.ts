import { defineField, defineType } from "sanity";
import { iconField } from "./icon";
import { requireFr } from "./locale";

// Objets du plan de contenu v5 (valeur sans prix, ADR-008), partagés par les offres et les blocs de page.
// Tous les champs sont facultatifs : une offre qui ne les remplit pas s'affiche comme avant.

/** Situation type : un cas de chantier, pas un projet réalisé (aucun nom, aucun chiffre). */
export const scenario = defineType({
  name: "scenario",
  title: "Situation type",
  type: "object",
  fields: [
    defineField({ name: "title", title: "Titre de la situation", type: "localeString", validation: requireFr }),
    defineField({ name: "situation", title: "Situation", type: "localeText", description: "Ce qui se passe sur le chantier." }),
    defineField({ name: "action", title: "Ce que fait Bimurix", type: "localeText" }),
    defineField({ name: "receive", title: "Ce que vous recevez", type: "localeText" }),
    defineField({ name: "avoid", title: "Ce que ça évite", type: "localeText", description: "La conséquence connue sur un chantier, sans la chiffrer." }),
    defineField({ name: "image", title: "Schéma ou image (facultatif)", type: "imageWithAlt" }),
    defineField({ name: "service", title: "Service concerné", type: "reference", to: [{ type: "service" }], description: "Sert aux liens « Voir le service » et « Demander une soumission » (utile sur l'accueil)." }),
  ],
  preview: { select: { title: "title.fr", subtitle: "situation.fr" } },
});

const party = (name: "bimurix" | "engineer" | "contractor", title: string) => [
  defineField({ name, title, type: "boolean", initialValue: false }),
  defineField({ name: `${name}Note`, title: `${title} : précision (facultatif)`, type: "localeString", description: "Ex. : « décide des corrections », « les fournit »." }),
];

/** Ligne du tableau « Qui fait quoi » : une responsabilité et ceux qui la portent. */
export const responsibilityRow = defineType({
  name: "responsibilityRow",
  title: "Ligne « Qui fait quoi »",
  type: "object",
  fields: [
    defineField({ name: "label", title: "Responsabilité", type: "localeString", validation: requireFr }),
    ...party("bimurix", "Bimurix"),
    ...party("engineer", "Ingénieur"),
    ...party("contractor", "Entrepreneur"),
  ],
  preview: {
    select: { title: "label.fr", b: "bimurix", e: "engineer", c: "contractor" },
    prepare: ({ title, b, e, c }: { title?: string; b?: boolean; e?: boolean; c?: boolean }) => ({
      title,
      subtitle: [b && "Bimurix", e && "Ingénieur", c && "Entrepreneur"].filter(Boolean).join(" · "),
    }),
  },
});

/** Livrable d'une offre, avec à quoi il sert. */
export const deliverableRow = defineType({
  name: "deliverableRow",
  title: "Livrable avec son usage",
  type: "object",
  fields: [
    defineField({ name: "title", title: "Livrable", type: "localeString", validation: requireFr }),
    defineField({ name: "purpose", title: "À quoi ça sert", type: "localeText", description: "Une demi-phrase qui commence par un verbe. Ex. : « à couper et à commander les bonnes pièces »." }),
    iconField,
  ],
  preview: { select: { title: "title.fr", subtitle: "purpose.fr" } },
});

/** Question et réponse d'une offre. */
export const faqEntry = defineType({
  name: "faqEntry",
  title: "Question et réponse",
  type: "object",
  fields: [
    defineField({ name: "question", title: "Question", type: "localeString", validation: requireFr }),
    defineField({ name: "answer", title: "Réponse", type: "localeText", validation: requireFr }),
  ],
  preview: { select: { title: "question.fr", subtitle: "answer.fr" } },
});
