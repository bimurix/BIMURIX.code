import { l } from "./helpers.mts";

// T2 (cahier v6) : petits textes ajoutés (promesse sous le bouton, registre « Projets », fiche « L'entreprise », page introuvable).
// Partagé par le seed (documents neufs) et par scripts/patch-content-t2.mts (documents déjà dans Studio, via `set`).
export const uiStringsT2 = {
  quoteCtaNote: l("Nous vous répondons d'ici un jour ouvrable.", "We reply within one business day."),
  quoteCtaPhone: l("Ou appelez le {phone}.", "Or call {phone}."),
  projectColDiscipline: l("Discipline", "Discipline"),
  projectColDelivered: l("Livré", "Delivered"),
  projectColTools: l("Outils", "Tools"),
  companyLegalName: l("Nom légal", "Legal name"),
  companyNeq: l("NEQ", "NEQ"),
  companyPhone: l("Téléphone", "Phone"),
  companyEmail: l("Courriel", "Email"),
  companyArea: l("Région desservie", "Area served"),
  companyLanguages: l("Langues de travail", "Working languages"),
  companyResponsible: l("Responsable", "Lead"),
  notFoundServices: l("Ou choisissez un service", "Or pick a service"),
  shortDetailLink: l("Voir le détail", "See the detail"),
};
