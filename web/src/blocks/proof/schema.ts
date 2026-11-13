import { defineArrayMember, defineField, defineType } from "sanity";
import { requireFr } from "@/sanity/schemas/objects/locale";
import { blockPreview, headingField } from "../shared";

// decision: ADR-006 n° 5 — chiffres d'un tiers : nom et lien de la source obligatoires, bloc désactivable.
export const proof = defineType({
  name: "proof",
  title: "Preuve chiffrée (source d'un tiers)",
  type: "object",
  fields: [
    defineField({ name: "enabled", title: "Afficher ce bloc", type: "boolean", initialValue: false, description: "Le bloc ne s'affiche jamais sans le nom et le lien de la source." }),
    headingField,
    defineField({ name: "intro", title: "Phrase d'introduction", type: "localeString", description: "Dit pourquoi on montre le chiffre d'un tiers. Ex. : « Un exemple publié par un tiers, pour situer ce que la préfabrication permet. »" }),
    defineField({
      name: "figures",
      title: "Chiffres",
      type: "array",
      of: [
        defineArrayMember({
          type: "object",
          name: "figure",
          fields: [
            defineField({ name: "value", title: "Valeur", type: "string", description: "Ex. : 90 %", validation: (r) => r.required() }),
            defineField({ name: "label", title: "Libellé", type: "localeString", validation: requireFr }),
          ],
          preview: { select: { title: "value", subtitle: "label.fr" } },
        }),
      ],
    }),
    defineField({ name: "attribution", title: "Attribution", type: "localeText", description: "À qui appartiennent ces résultats (un tiers, jamais Bimurix)." }),
    defineField({ name: "sourceName", title: "Nom de la source", type: "string", validation: (r) => r.required() }),
    defineField({ name: "sourceNameEn", title: "Nom de la source (version anglaise)", type: "string", description: "Facultatif : affiché sur les pages en anglais à la place du nom ci-dessus." }),
    defineField({ name: "sourceUrl", title: "Lien de la source", type: "url", validation: (r) => r.required().uri({ scheme: ["https", "http"] }) }),
  ],
  preview: blockPreview("Preuve chiffrée"),
});
