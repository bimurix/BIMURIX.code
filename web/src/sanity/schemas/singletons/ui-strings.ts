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
  ["priceFrom", "Forfaits : « À partir de » (devant un prix minimal)"],
  ["priceQuote", "Forfaits : « Sur soumission » (aucun montant affiché)"],
  ["businessDays", "Forfaits : « jours ouvrables »"],
  ["colCode", "Nomenclature : en-tête « Code »"],
  ["colPackage", "Nomenclature : en-tête « Forfait »"],
  ["colScope", "Nomenclature : en-tête « Portée »"],
  ["colLeadTime", "Nomenclature : en-tête « Délai »"],
  ["colPrice", "Nomenclature : en-tête « Prix »"],
  ["colAction", "Nomenclature : en-tête de la colonne du bouton (lu par les lecteurs d'écran)"],
  ["inclusionsLabel", "Forfaits : « Ce qui est inclus »"],
  ["choosePackage", "Forfaits : bouton « Choisir ce forfait »"],
  ["highlightedLabel", "Forfaits : repère du forfait mis en avant"],
  ["sourceLabel", "Preuve : « Source »"],
  ["bannerUntil", "Bandeau de lancement : « jusqu'au » (devant la date limite)"],
] as const;

export const uiStrings = defineType({
  name: "uiStrings",
  title: "Petits textes du site",
  type: "document",
  fields: uiStringKeys.map(([name, title]) => defineField({ name, title, type: "localeString" })),
  preview: { prepare: () => ({ title: "Petits textes du site" }) },
});
