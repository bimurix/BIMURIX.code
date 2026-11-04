import { defineArrayMember, defineField, defineType } from "sanity";
import { requireFr } from "../objects/locale";

const variablesHelp = "Variables : {name}, {company}, {service}, {reference}.";

export const emailTemplates = defineType({
  name: "emailTemplates",
  title: "Courriels",
  type: "document",
  groups: [
    { name: "ack", title: "Accusé de réception", default: true },
    { name: "internal", title: "Notification interne" },
    { name: "replies", title: "Modèles de réponse" },
  ],
  fields: [
    defineField({ name: "fromName", title: "Nom de l'expéditeur", type: "string", initialValue: "Bimurix", group: "ack" }),
    defineField({ name: "ackSubject", title: "Objet", type: "localeString", group: "ack", validation: requireFr, description: variablesHelp }),
    defineField({ name: "ackBody", title: "Message", type: "localeText", group: "ack", validation: requireFr, description: variablesHelp }),
    defineField({ name: "signature", title: "Signature", type: "localeText", group: "ack" }),

    defineField({ name: "internalSubject", title: "Objet de la notification", type: "string", group: "internal", description: variablesHelp }),

    defineField({
      name: "replyTemplates",
      title: "Modèles de réponse (tableau de bord)",
      type: "array",
      group: "replies",
      of: [
        defineArrayMember({
          type: "object",
          name: "replyTemplate",
          fields: [
            defineField({ name: "name", title: "Nom du modèle", type: "string", validation: (r) => r.required() }),
            defineField({ name: "subject", title: "Objet", type: "localeString", validation: requireFr }),
            defineField({ name: "body", title: "Message", type: "localeText", validation: requireFr, description: variablesHelp }),
          ],
          preview: { select: { title: "name", subtitle: "subject.fr" } },
        }),
      ],
    }),
  ],
  preview: { prepare: () => ({ title: "Courriels" }) },
});
