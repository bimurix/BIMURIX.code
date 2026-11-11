import { defineArrayMember, defineField, defineType } from "sanity";
import { requireFr } from "../objects/locale";

type PackageDoc = { priceMode?: string } | undefined;

// decision: ADR-006 n° 2 et 4 — prix fixe ou « sur soumission », forfait affiché ou masqué, sans développeur.
export const packageDoc = defineType({
  name: "package",
  title: "Forfait",
  type: "document",
  orderings: [{ title: "Ordre d'affichage", name: "order", by: [{ field: "order", direction: "asc" }] }],
  fields: [
    defineField({ name: "visible", title: "Affiché sur le site", type: "boolean", initialValue: true, description: "Décoché : le forfait disparaît du site et du formulaire." }),
    defineField({ name: "title", title: "Nom du forfait", type: "localeString", validation: requireFr }),
    defineField({ name: "code", title: "Code", type: "string", description: "Ex. : F-01. Affiché en caractères de données.", validation: (r) => r.required().max(8) }),
    defineField({ name: "service", title: "Offre", type: "reference", to: [{ type: "service" }], validation: (r) => r.required() }),
    defineField({
      name: "priceMode",
      title: "Affichage du prix",
      type: "string",
      initialValue: "fixed",
      options: { layout: "radio", list: [{ title: "Prix fixe", value: "fixed" }, { title: "À partir de", value: "from" }, { title: "Sur soumission (aucun montant affiché)", value: "quote" }] },
      validation: (r) => r.required(),
    }),
    defineField({
      name: "price",
      title: "Prix ($ CA, avant taxes)",
      type: "number",
      description: "Nombre entier. Non affiché en mode « sur soumission ».",
      hidden: ({ document }) => (document as PackageDoc)?.priceMode === "quote",
      validation: (r) =>
        r.integer().min(0).custom((value, context) => {
          const mode = (context.document as PackageDoc)?.priceMode;
          return mode !== "quote" && (value === undefined || value === null) ? "Le prix est obligatoire, sauf en mode « sur soumission »." : true;
        }),
    }),
    defineField({ name: "scope", title: "Portée", type: "localeString", description: "Ex. : zone pilote, jusqu'à 30 spools." }),
    defineField({ name: "leadTimeDays", title: "Délai (jours ouvrables)", type: "number", validation: (r) => r.integer().min(1) }),
    defineField({ name: "inclusions", title: "Inclus", type: "array", of: [defineArrayMember({ type: "localeString" })] }),
    defineField({ name: "highlighted", title: "Mis en avant", type: "boolean", initialValue: false, description: "Un seul forfait à la fois." }),
    defineField({ name: "order", title: "Ordre", type: "number", initialValue: 10 }),
  ],
  preview: {
    select: { title: "title.fr", code: "code", price: "price", mode: "priceMode", visible: "visible" },
    prepare: ({ title, code, price, mode, visible }: { title?: string; code?: string; price?: number; mode?: string; visible?: boolean }) => ({
      title,
      subtitle: [code, mode === "quote" ? "sur soumission" : price != null ? `${price} $` : null, visible === false ? "masqué" : null].filter(Boolean).join(" · "),
    }),
  },
});
