import { defineField, defineType } from "sanity";
import { requireFr } from "../objects/locale";

export const settings = defineType({
  name: "settings",
  title: "Identité et coordonnées",
  type: "document",
  groups: [
    { name: "brand", title: "Identité", default: true },
    { name: "contact", title: "Coordonnées" },
    { name: "privacy", title: "Loi 25" },
    { name: "seo", title: "SEO par défaut" },
  ],
  fields: [
    defineField({ name: "siteName", title: "Nom du site", type: "string", group: "brand", initialValue: "Bimurix", validation: (r) => r.required() }),
    defineField({ name: "wordmark", title: "Logotype texte", type: "string", group: "brand", initialValue: "bimurix", description: "Affiché tant qu'aucun logo n'est téléversé." }),
    defineField({ name: "logo", title: "Logo (fond clair)", type: "image", group: "brand", description: "SVG de préférence, sinon PNG transparent." }),
    defineField({ name: "logoInverse", title: "Logo (fond foncé)", type: "image", group: "brand" }),
    defineField({ name: "logoAlt", title: "Texte alternatif du logo", type: "localeString", group: "brand" }),
    defineField({ name: "favicon", title: "Icône d'onglet (favicon)", type: "image", group: "brand", description: "Carré, 512 × 512 px." }),
    defineField({ name: "tagline", title: "Signature", type: "localeString", group: "brand" }),
    defineField({ name: "descriptor", title: "Descripteur", type: "localeString", group: "brand" }),

    defineField({ name: "email", title: "Courriel public", type: "email", group: "contact", validation: (r) => r.required() }),
    defineField({ name: "phone", title: "Téléphone", type: "string", group: "contact" }),
    defineField({ name: "serviceArea", title: "Région desservie", type: "localeString", group: "contact" }),
    defineField({ name: "neq", title: "NEQ", type: "string", group: "contact", description: "Numéro d'entreprise du Québec (10 chiffres).", validation: (r) => r.regex(/^\d{10}$/).warning("Le NEQ compte 10 chiffres.") }),
    defineField({ name: "legalName", title: "Nom légal", type: "string", group: "contact" }),
    defineField({
      name: "socialLinks",
      title: "Liens professionnels",
      type: "array",
      group: "contact",
      of: [{ type: "object", fields: [defineField({ name: "label", title: "Nom", type: "string" }), defineField({ name: "url", title: "URL", type: "url" })] }],
    }),

    defineField({ name: "privacyOfficer", title: "Responsable de la protection des renseignements personnels", type: "string", group: "privacy" }),
    defineField({ name: "privacyEmail", title: "Courriel du responsable", type: "email", group: "privacy" }),
    defineField({ name: "retentionMonths", title: "Conservation des demandes (mois)", type: "number", group: "privacy", initialValue: 24, validation: (r) => r.min(1).max(120) }),

    defineField({ name: "defaultSeo", title: "SEO par défaut", type: "seo", group: "seo" }),
    defineField({ name: "titleTemplate", title: "Modèle de titre", type: "localeString", group: "seo", description: "%s est remplacé par le titre de la page. Ex. : %s | Bimurix", validation: requireFr }),
  ],
  preview: { prepare: () => ({ title: "Identité et coordonnées" }) },
});
