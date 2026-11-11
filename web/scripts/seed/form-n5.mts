import { l } from "./helpers.mts";

// N5 (ADR-006 n° 7) : type de demande et forfait visé. Partagé par le seed (documents neufs)
// et par scripts/patch-form-n5.mts (documents déjà présents dans Studio, via setIfMissing).
// Textes EN à relire par le client.
export const formSettingsN5 = {
  label_requestType: l("Type de demande", "Type of request"),
  label_package: l("Forfait visé", "Package of interest"),
  label_moreDetails: l("Plus de détails", "More details"),
  requestTypeCall: l("Réserver un appel de 20 minutes", "Book a 20-minute call"),
  requestTypeQuote: l("Demander une soumission", "Request a quote"),
  requestTypeCallShort: l("Appel de 20 minutes", "20-minute call"),
  requestTypeQuoteShort: l("Soumission", "Quote"),
  packageOther: l("Autre ou je ne sais pas", "Other or not sure"),
  successBodyCall: l(
    "Votre demande d'appel a été transmise. Nous communiquerons avec vous par courriel pour confirmer un moment.",
    "Your call request has been sent. We will contact you by email to confirm a time.",
  ),
};

export const emailTemplatesN5 = {
  ackSubjectCall: l("Nous avons bien reçu votre demande d'appel ({reference})", "We received your call request ({reference})"),
  ackBodyCall: l(
    "Bonjour {name},\n\nMerci d'avoir demandé un appel de 20 minutes avec Bimurix. Forfait visé : {package}. Nous vous écrirons pour confirmer un moment.\n\nVotre référence : {reference}.",
    "Hello {name},\n\nThank you for requesting a 20-minute call with Bimurix. Package of interest: {package}. We will email you to confirm a time.\n\nYour reference: {reference}.",
  ),
  internalSubjectCall: "Demande d'appel : {company} — {service} · {package} ({reference})",
};
