import { keyed, l } from "./helpers.mts";

// T2 (cahier v6 C-41 à C-43) : encart « Utile, si vous l'avez sous la main », budget masqué, colonne de réassurance.
// Partagé par le seed et par scripts/patch-content-t2.mts. Les lignes « à envoyer » (needsItems) ne sont pas touchées.
export const formSettingsT2 = {
  needsHeading: l("Utile, si vous l'avez sous la main", "Useful, if you have them at hand"),
  needsNote: l(
    "Aucun document n'est exigé pour demander une soumission. Ajoutez un lien de partage dans la description, ou attendez notre réponse.",
    "No document is required to request a quote. Add a share link in the description, or wait for our reply.",
  ),
  showBudget: false,
  assuranceRows: keyed([
    { label: l("Réponse", "Reply"), text: l("d'ici un jour ouvrable", "within one business day"), source: "text" },
    { label: l("Ensuite", "Next"), text: l("nous clarifions la portée, puis vous recevez la soumission", "we clarify the scope, then you receive the quote"), source: "text" },
    { label: l("Téléphone", "Phone"), source: "phone" },
    { label: l("Confidentialité", "Privacy"), text: l("vos renseignements servent seulement à traiter votre demande", "your information is used only to handle your request"), source: "privacy" },
  ]),
};
