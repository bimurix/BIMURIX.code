import { defineField, defineType, type Rule, type StringRule } from "sanity";

// decision: ADR-003 — un seul document par page, champs { fr, en }.
// Le FR est obligatoire ; l'EN est facultatif (une page EN incomplète n'est pas publiée).

type FrOnly = { fr?: unknown } | undefined;

/** Rend la valeur FR obligatoire sur un champ localisé. */
export function requireFr(rule: Rule) {
  return rule.custom((value: FrOnly) => {
    const fr = value?.fr;
    const empty = fr === undefined || fr === null || (typeof fr === "string" && fr.trim() === "") || (Array.isArray(fr) && fr.length === 0);
    return empty ? "Le français est obligatoire." : true;
  });
}

const fieldsets = [{ name: "langs", options: { columns: 2 } }];

export const localeString = defineType({
  name: "localeString",
  title: "Texte court FR / EN",
  type: "object",
  fieldsets,
  fields: [
    defineField({ name: "fr", title: "Français", type: "string", fieldset: "langs" }),
    defineField({ name: "en", title: "English", type: "string", fieldset: "langs" }),
  ],
});

export const localeText = defineType({
  name: "localeText",
  title: "Paragraphe FR / EN",
  type: "object",
  fields: [
    defineField({ name: "fr", title: "Français", type: "text", rows: 4 }),
    defineField({ name: "en", title: "English", type: "text", rows: 4 }),
  ],
});

const portableText = [
  {
    type: "block",
    styles: [
      { title: "Paragraphe", value: "normal" },
      { title: "Titre 2", value: "h2" },
      { title: "Titre 3", value: "h3" },
    ],
    lists: [
      { title: "Puces", value: "bullet" },
      { title: "Numéros", value: "number" },
    ],
    marks: {
      decorators: [
        { title: "Gras", value: "strong" },
        { title: "Italique", value: "em" },
      ],
      annotations: [{ name: "link", type: "link", title: "Lien" }],
    },
  },
];

export const localeRichText = defineType({
  name: "localeRichText",
  title: "Texte riche FR / EN",
  type: "object",
  fields: [
    defineField({ name: "fr", title: "Français", type: "array", of: portableText }),
    defineField({ name: "en", title: "English", type: "array", of: portableText }),
  ],
});

const slugRule = (rule: StringRule) =>
  rule.regex(/^[a-z0-9]+(?:-[a-z0-9]+)*(?:\/[a-z0-9]+(?:-[a-z0-9]+)*)*$/, { name: "adresse" }).error(
    "Minuscules, chiffres et tirets seulement (ex. : services/prefabrication-mep).",
  );

export const localeSlug = defineType({
  name: "localeSlug",
  title: "Adresse de la page FR / EN",
  type: "object",
  fieldsets,
  description: "Sans barre oblique au début. Le FR est servi à la racine, l'EN sous /en.",
  fields: [
    defineField({ name: "fr", title: "Adresse FR", type: "string", fieldset: "langs", validation: slugRule }),
    defineField({ name: "en", title: "Adresse EN", type: "string", fieldset: "langs", validation: slugRule }),
  ],
});
