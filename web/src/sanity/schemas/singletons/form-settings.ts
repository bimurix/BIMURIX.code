import { defineArrayMember, defineField, defineType } from "sanity";
import { requireFr } from "../objects/locale";

const option = defineArrayMember({
  type: "object",
  name: "formOption",
  fields: [
    defineField({ name: "value", title: "Code interne", type: "string", description: "Ne pas modifier après la mise en ligne (sert aux statistiques).", validation: (r) => r.required().regex(/^[a-z0-9-]+$/) }),
    defineField({ name: "label", title: "Libellé", type: "localeString", validation: requireFr }),
  ],
  preview: { select: { title: "label.fr", subtitle: "value" } },
});

const optionList = (name: string, title: string) =>
  defineField({ name, title, type: "array", of: [option], group: "lists" });

// Libellés des champs du formulaire de soumission.
export const formFieldKeys = [
  ["fullName", "Nom complet"],
  ["company", "Entreprise"],
  ["email", "Courriel professionnel"],
  ["phone", "Téléphone"],
  ["preferredLanguage", "Langue de communication"],
  ["requestType", "Type de demande (titre du choix)"],
  ["package", "Forfait visé"],
  ["moreDetails", "Volet « Plus de détails » (seulement si l’appel est activé)"],
  ["service", "Service recherché"],
  ["projectType", "Type de projet"],
  ["region", "Région du projet"],
  ["phase", "Phase du projet"],
  ["timeline", "Échéancier souhaité"],
  ["budget", "Budget approximatif"],
  ["software", "Logiciels et formats"],
  ["description", "Description du besoin"],
  ["optional", "Mention « facultatif »"],
  ["submit", "Bouton d'envoi"],
  ["sending", "Pendant l'envoi"],
] as const;

export const formSettings = defineType({
  name: "formSettings",
  title: "Formulaire de soumission",
  type: "document",
  groups: [
    { name: "texts", title: "Libellés", default: true },
    { name: "lists", title: "Listes de choix" },
    { name: "messages", title: "Messages" },
    { name: "consent", title: "Consentement" },
  ],
  fields: [
    // decision: R2 — l'appel de 20 minutes n'est plus proposé par défaut ; ce réglage le réactive sans développeur.
    defineField({
      name: "callEnabled",
      title: "Proposer aussi un appel de 20 minutes",
      type: "boolean",
      initialValue: false,
      group: "texts",
      description: "Désactivé (cas normal) : le formulaire est une simple demande de soumission, sans mention d'appel. Activé : le visiteur choisit entre « Réserver un appel » et « Demander une soumission », et les textes et courriels « appel » ci-dessous servent. Pense aussi à publier ce document.",
    }),
    ...formFieldKeys.map(([name, title]) => defineField({ name: `label_${name}`, title, type: "localeString", group: "texts" })),
    // decision: ADR-006 n° 7 — type de demande et forfait visé.
    defineField({ name: "requestTypeCall", title: "Choix : appel", type: "localeString", group: "texts", description: "Utilisé seulement si l’appel est activé. Ex. : Réserver un appel de 20 minutes." }),
    defineField({ name: "requestTypeQuote", title: "Choix : soumission", type: "localeString", group: "texts", description: "Ex. : Demander une soumission." }),
    defineField({ name: "requestTypeCallShort", title: "Nom court : appel (courriels)", type: "localeString", group: "texts", description: "Variable {type} des courriels. Ex. : Appel de 20 minutes." }),
    defineField({ name: "requestTypeQuoteShort", title: "Nom court : soumission (courriels)", type: "localeString", group: "texts", description: "Variable {type} des courriels. Ex. : Soumission." }),
    defineField({ name: "packageOther", title: "Forfait : « autre »", type: "localeString", group: "texts", description: "Ex. : Autre ou je ne sais pas." }),
    defineField({ name: "descriptionHelp", title: "Aide sous « Description »", type: "localeText", group: "texts" }),
    // decision: plan de contenu v5 § 3.8 et § 10 n° 9 — encart au-dessus du formulaire, vide = rien d'affiché.
    defineField({ name: "needsHeading", title: "Encart « Ce qu'il faut nous envoyer » : titre", type: "localeString", group: "texts" }),
    defineField({ name: "needsItems", title: "Encart « Ce qu'il faut nous envoyer » : lignes", type: "array", group: "texts", of: [defineArrayMember({ type: "localeString" })], description: "Les documents et informations utiles à une soumission juste. Vide : l'encart n'apparaît pas." }),
    defineField({ name: "needsNote", title: "Encart « Ce qu'il faut nous envoyer » : note", type: "localeText", group: "texts", description: "Ex. : comment transmettre les documents." }),
    defineField({ name: "filesHelp", title: "Aide pour les fichiers", type: "localeText", group: "texts", description: "Ex. : partagez un lien (ACC, Drive, WeTransfer) dans la description." }),

    defineField({ name: "includeServices", title: "Proposer les services publiés", type: "boolean", initialValue: true, group: "lists" }),
    optionList("extraServiceOptions", "Choix de service supplémentaires"),
    optionList("projectTypes", "Types de projet"),
    optionList("regions", "Régions"),
    optionList("phases", "Phases"),
    optionList("timelines", "Échéanciers"),
    optionList("budgets", "Budgets"),
    optionList("softwareOptions", "Logiciels et formats"),

    defineField({ name: "errorRequired", title: "Champ requis", type: "localeString", group: "messages" }),
    defineField({ name: "errorEmail", title: "Courriel invalide", type: "localeString", group: "messages" }),
    defineField({ name: "successTitle", title: "Succès : titre", type: "localeString", group: "messages" }),
    defineField({ name: "successBody", title: "Succès : texte", type: "localeText", group: "messages" }),
    defineField({ name: "successBodyCall", title: "Succès : texte (demande d’appel)", type: "localeText", group: "messages", description: "Utilisé seulement si l’appel est activé. Facultatif ; sinon le texte de succès ci-dessus est utilisé." }),
    defineField({ name: "failureTitle", title: "Échec : titre", type: "localeString", group: "messages" }),
    defineField({ name: "failureBody", title: "Échec : texte", type: "localeText", group: "messages" }),

    defineField({ name: "consentText", title: "Texte de consentement", type: "localeText", group: "consent", validation: requireFr }),
    defineField({ name: "policyVersion", title: "Version de la politique", type: "string", group: "consent", initialValue: "2026-11", description: "Enregistrée avec chaque demande. Change-la quand la politique change." }),
    defineField({ name: "notificationEmail", title: "Courriel qui reçoit les notifications", type: "email", group: "consent", validation: (r) => r.required() }),
  ],
  preview: { prepare: () => ({ title: "Formulaire de soumission" }) },
});
