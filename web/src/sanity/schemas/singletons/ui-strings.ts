import { defineField, defineType } from "sanity";

// Petits textes de l'interface publique. Chaque clé a une valeur de secours dans le code.
export const uiStringKeys = [
  ["requestQuote", "Bouton « Demander une soumission »"],
  ["discoverServices", "Bouton « Découvrir nos services »"],
  ["learnMore", "Lien « En savoir plus »"],
  ["menu", "Bouton du menu mobile"],
  ["closeMenu", "Fermer le menu"],
  ["services", "Libellé « Services »"],
  ["skipToContent", "Lien d'évitement « Aller au contenu »"],
  ["networkHint", "Indication sous l'isométrique"],
  ["illustrativeExample", "Mention « exemple illustratif »"],
  ["sheet", "Cartouche : « Feuille »"],
  ["revision", "Cartouche : « Révision »"],
  ["date", "Cartouche : « Date »"],
  ["backHome", "Lien « Retour à l'accueil »"],
] as const;

export const uiStrings = defineType({
  name: "uiStrings",
  title: "Petits textes du site",
  type: "document",
  fields: uiStringKeys.map(([name, title]) => defineField({ name, title, type: "localeString" })),
  preview: { prepare: () => ({ title: "Petits textes du site" }) },
});
