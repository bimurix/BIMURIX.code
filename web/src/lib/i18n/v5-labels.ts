import type { Locale } from "./locales";
import { pick, type Localized } from "./pick";

// Valeurs de secours des petits textes du plan de contenu v5. Le texte public vit dans Sanity
// (« Petits textes du site ») ; ces valeurs ne servent que si le champ est vide. decision: CLAUDE.md § 4.
const fr = {
  familyModeler: "Modéliser et coordonner",
  familyPrefabriquer: "Préfabriquer",
  familyLivrer: "Livrer et exploiter",
  scenariosHeading: "Situations types",
  scenariosNote: "Ces situations sont des exemples types. Elles ne décrivent pas un projet réel ni un client de Bimurix.",
  scenarioSituation: "Situation",
  scenarioAction: "Ce que fait Bimurix",
  scenarioReceive: "Ce que vous recevez",
  scenarioAvoid: "Ce que ça évite",
  scenarioQuoteLink: "Demander une soumission pour une situation comme celle-ci",
  scenarioServiceLink: "Voir le service",
  deliverableLabel: "Livrable",
  purposeLabel: "À quoi ça sert",
  serviceFaqHeading: "Questions sur ce service",
  needsHeadingDefault: "Ce qu'il faut nous envoyer",
  respColResponsibility: "Responsabilité",
  respColBimurix: "Bimurix",
  respColEngineer: "Ingénieur",
  respColContractor: "Entrepreneur",
  respYes: "Oui",
  respNo: "Non",
  requestQuote: "Demander une soumission",
  quoteCtaNote: "Nous vous répondons d'ici un jour ouvrable.",
  quoteCtaPhone: "Ou appelez le {phone}.",
  projectColDiscipline: "Discipline",
  projectColDelivered: "Livré",
  projectColTools: "Outils",
  companyLegalName: "Nom légal",
  companyNeq: "NEQ",
  companyPhone: "Téléphone",
  companyEmail: "Courriel",
  companyArea: "Région desservie",
  companyLanguages: "Langues de travail",
  companyResponsible: "Responsable",
  notFoundServices: "Ou choisissez un service",
  shortDetailLink: "Voir le détail",
};
const en: typeof fr = {
  familyModeler: "Model and coordinate",
  familyPrefabriquer: "Prefabricate",
  familyLivrer: "Deliver and operate",
  scenariosHeading: "Typical situations",
  scenariosNote: "These are typical examples. They do not describe a real project or a Bimurix client.",
  scenarioSituation: "Situation",
  scenarioAction: "What Bimurix does",
  scenarioReceive: "What you receive",
  scenarioAvoid: "What it avoids",
  scenarioQuoteLink: "Request a quote for a situation like this",
  scenarioServiceLink: "See the service",
  deliverableLabel: "Deliverable",
  purposeLabel: "What it is for",
  serviceFaqHeading: "Questions about this service",
  needsHeadingDefault: "What to send us",
  respColResponsibility: "Responsibility",
  respColBimurix: "Bimurix",
  respColEngineer: "Engineer",
  respColContractor: "Contractor",
  respYes: "Yes",
  respNo: "No",
  requestQuote: "Request a quote",
  quoteCtaNote: "We reply within one business day.",
  quoteCtaPhone: "Or call {phone}.",
  projectColDiscipline: "Discipline",
  projectColDelivered: "Delivered",
  projectColTools: "Tools",
  companyLegalName: "Legal name",
  companyNeq: "NEQ",
  companyPhone: "Phone",
  companyEmail: "Email",
  companyArea: "Area served",
  companyLanguages: "Working languages",
  companyResponsible: "Lead",
  notFoundServices: "Or pick a service",
  shortDetailLink: "See the detail",
};

export const v5Fallback = { fr, en };
export type V5LabelKey = keyof typeof fr;
export type UiLabels = Partial<Record<string, Localized>> | null | undefined;

/** Petit texte de l'interface : Sanity d'abord, puis la valeur de secours de la langue. */
export function v5Label(ui: UiLabels, key: V5LabelKey, locale: Locale): string {
  return pick(ui?.[key], locale, v5Fallback[locale][key]);
}
