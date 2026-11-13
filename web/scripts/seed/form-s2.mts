import { keyed, l } from "./helpers.mts";

// S2 (plan de contenu v5 § 3.8 et § 10) : message de succès avec le délai de réponse, encart « Ce qu'il faut nous envoyer »,
// accusé de réception sans « forfait visé ». Partagé par le seed (documents neufs) et par scripts/patch-content-s2.mts
// (documents déjà dans Studio : seuls ces champs sont écrits). Choix par défaut n° 1 et n° 9 : modifiables dans Studio.
export const formSettingsS2 = {
  successBody: l(
    "Votre message a été transmis. Nous vous répondons d'ici un jour ouvrable.",
    "Your message has been sent. We will reply within one business day.",
  ),
  needsHeading: l("Ce qu'il faut nous envoyer", "What to send us"),
  needsItems: keyed([
    l("Les plans ou le modèle de l'ingénieur", "The engineer's drawings or model"),
    l("Les dessins d'atelier approuvés", "The approved shop drawings"),
    l("Les fabricants retenus", "The selected manufacturers"),
    l("Les exigences de remise du propriétaire", "The owner's handover requirements"),
    l("Vos standards", "Your standards"),
  ]),
  needsNote: l(
    "Nous vous indiquons comment les transmettre dans notre réponse.",
    "We will tell you how to send them in our reply.",
  ),
};

export const emailTemplatesS2 = {
  ackBody: l(
    "Bonjour {name},\n\nMerci d'avoir communiqué avec Bimurix au sujet de « {service} ». Nous vous répondons d'ici un jour ouvrable.\n\nVotre référence : {reference}.",
    "Hello {name},\n\nThank you for contacting Bimurix about \"{service}\". We will reply within one business day.\n\nYour reference: {reference}.",
  ),
};
