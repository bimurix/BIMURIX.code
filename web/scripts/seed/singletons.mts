import { internalCta, keyed, l, ref } from "./helpers.mts";
import { uiStringsN3 } from "./ui-strings-n3.mts";

// N4 — coordonnées : ADR-006 n° 14 à 18 (courriel réel ; téléphone, NEQ et nom légal non saisis : le site n'affiche rien).
const settings = {
  _id: "settings",
  _type: "settings",
  siteName: "Bimurix",
  wordmark: "bimurix",
  logoAlt: l("Bimurix", "Bimurix"),
  tagline: l("Structure. Numérisez. Avancez.", "Structure. Digitalize. Advance."),
  descriptor: l("Préfabrication MEP et données BIM 7D pour les entrepreneurs du Grand Montréal.", "MEP prefabrication and BIM 7D data for contractors in Greater Montreal."),
  email: "contact@bimurix.com",
  serviceArea: l("Grand Montréal", "Greater Montreal"),
  privacyOfficer: "Fondateur de Bimurix",
  privacyEmail: "contact@bimurix.com",
  retentionMonths: 24,
  titleTemplate: l("%s | Bimurix", "%s | Bimurix"),
  defaultSeo: {
    title: l("Préfabrication de tuyauterie et de gicleurs, BIM 7D | Bimurix", "Piping and sprinkler prefabrication, BIM 7D | Bimurix"),
    description: l("Forfaits à prix fixe pour préfabriquer votre tuyauterie et vos gicleurs en atelier, et pour auditer les données de votre modèle BIM 7D. Grand Montréal.", "Fixed-price packages to prefabricate your piping and sprinklers in the shop and to audit your BIM 7D model data. Greater Montreal."),
  },
};

const navigation = {
  _id: "navigation",
  _type: "navigation",
  items: keyed([
    { label: l("Offres", "Offers"), listServices: true, link: { kind: "external", external: "/#services" } },
    { label: l("Forfaits", "Packages"), link: { kind: "external", external: "/#forfaits" } },
    { label: l("À propos", "About"), link: { kind: "internal", internal: ref("page-about") } },
    { label: l("Contact", "Contact"), link: { kind: "internal", internal: ref("page-quote") } },
  ]),
  cta: internalCta(l("Réserver un appel", "Book a call"), "page-quote"),
  languageLabel: l("English", "Français"),
};

const footer = {
  _id: "footer",
  _type: "footer",
  blurb: l(
    "Préfabrication de tuyauterie et de gicleurs, coordination et données BIM 7D pour les entrepreneurs du Grand Montréal.",
    "Piping and sprinkler prefabrication, coordination and BIM 7D data for contractors in Greater Montreal.",
  ),
  columns: keyed([
    {
      title: l("Navigation", "Navigation"),
      links: keyed([
        internalCta(l("Accueil", "Home"), "page-home", "secondary"),
        internalCta(l("À propos", "About"), "page-about", "secondary"),
        internalCta(l("Réserver un appel", "Book a call"), "page-quote", "secondary"),
      ]),
    },
    {
      title: l("Offres", "Offers"),
      links: keyed([
        internalCta(l("Tuyauterie mécanique", "Mechanical piping"), "service-prefabrication", "secondary"),
        internalCta(l("Gicleurs", "Sprinklers"), "service-gicleurs", "secondary"),
        internalCta(l("Tuyauterie et gicleurs", "Piping and sprinklers"), "service-combinee", "secondary"),
        internalCta(l("BIM 7D", "BIM 7D"), "service-bim-7d", "secondary"),
      ]),
    },
    {
      title: l("Légal", "Legal"),
      links: keyed([
        internalCta(l("Politique de confidentialité", "Privacy policy"), "page-privacy", "secondary"),
        internalCta(l("Conditions d'utilisation", "Terms of use"), "page-terms", "secondary"),
      ]),
    },
  ]),
  copyright: l("© {year} Bimurix. Tous droits réservés.", "© {year} Bimurix. All rights reserved."),
};

const uiStrings = {
  _id: "uiStrings",
  _type: "uiStrings",
  requestQuote: l("Demander une soumission", "Request a quote"),
  discoverServices: l("Voir les forfaits", "See the packages"),
  learnMore: l("En savoir plus", "Learn more"),
  menu: l("Menu", "Menu"),
  closeMenu: l("Fermer le menu", "Close menu"),
  services: l("Offres", "Offers"),
  skipToContent: l("Aller au contenu", "Skip to content"),
  networkHint: l("Choisissez une offre pour réserver un appel.", "Pick an offer to book a call."),
  illustrativeExample: l("Exemple illustratif", "Illustrative example"),
  sheet: l("Feuille", "Sheet"),
  revision: l("Révision", "Revision"),
  date: l("Date", "Date"),
  backHome: l("Retour à l'accueil", "Back to home"),
  ...uiStringsN3,
};

export const singletons = [settings, navigation, footer, uiStrings];
