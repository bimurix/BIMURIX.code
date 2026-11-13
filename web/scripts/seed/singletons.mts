import { internalCta, keyed, l, ref } from "./helpers.mts";
import { uiStringsN3 } from "./ui-strings-n3.mts";
import { uiStringsV5 } from "./v5-common.mts";

// ADR-007 : descriptif, SEO par défaut, menu, pied de page et textes de l'interface d'origine restaurés (production), adaptés aux 6 services.
// Coordonnées : ADR-006 n° 14 à 18 (courriel réel ; téléphone, NEQ et nom légal non saisis : le site n'affiche rien).
const settings = {
  _id: "settings",
  _type: "settings",
  siteName: "Bimurix",
  wordmark: "bimurix",
  logoAlt: l("Bimurix", "Bimurix"),
  tagline: l("Structure. Numérisez. Avancez.", "Structure. Digitalize. Advance."),
  descriptor: l("Services BIM et construction numérique pour l'industrie de la construction.", "BIM and digital construction services for the construction industry."),
  email: "contact@bimurix.com",
  serviceArea: l("Grand Montréal", "Greater Montreal"),
  privacyOfficer: "Fondateur de Bimurix",
  privacyEmail: "contact@bimurix.com",
  retentionMonths: 24,
  titleTemplate: l("%s | Bimurix", "%s | Bimurix"),
  defaultSeo: {
    title: l("Services BIM au Québec | Bimurix", "BIM services in Quebec | Bimurix"),
    description: l("Modélisation et coordination BIM, dessins d'atelier de tuyauterie et de gicleurs, tel que construit et données d'actifs pour les équipes de construction au Québec.", "BIM modelling and coordination, piping and sprinkler shop drawings, as-built and asset data for construction teams in Quebec."),
  },
};

const navigation = {
  _id: "navigation",
  _type: "navigation",
  items: keyed([
    { label: l("Services", "Services"), listServices: true, link: { kind: "external", external: "/#services" } },
    { label: l("À propos", "About"), link: { kind: "internal", internal: ref("page-about") } },
    { label: l("Contact", "Contact"), link: { kind: "internal", internal: ref("page-quote") } },
  ]),
  cta: internalCta(l("Demander une soumission", "Request a quote"), "page-quote"),
  languageLabel: l("English", "Français"),
};

const footer = {
  _id: "footer",
  _type: "footer",
  blurb: l(
    "Services BIM et construction numérique : modélisation et coordination, dessins d'atelier de tuyauterie et de gicleurs, données d'actifs et tel que construit.",
    "BIM and digital construction services: modelling and coordination, piping and sprinkler shop drawings, asset data and as-built.",
  ),
  columns: keyed([
    {
      title: l("Navigation", "Navigation"),
      links: keyed([
        internalCta(l("Accueil", "Home"), "page-home", "secondary"),
        internalCta(l("À propos", "About"), "page-about", "secondary"),
        internalCta(l("Demander une soumission", "Request a quote"), "page-quote", "secondary"),
      ]),
    },
    // Services par famille (S3a : listServices) ; la liste vient des documents « service », jamais écrite ici.
    { title: l("Services", "Services"), listServices: true },
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
  discoverServices: l("Voir les six services", "See the six services"),
  learnMore: l("En savoir plus", "Learn more"),
  menu: l("Menu", "Menu"),
  closeMenu: l("Fermer le menu", "Close menu"),
  services: l("Services", "Services"),
  skipToContent: l("Aller au contenu", "Skip to content"),
  networkHint: l("Choisissez un service pour demander une soumission.", "Pick a service to request a quote."),
  illustrativeExample: l("Exemple illustratif", "Illustrative example"),
  sheet: l("Feuille", "Sheet"),
  revision: l("Révision", "Revision"),
  date: l("Date", "Date"),
  backHome: l("Retour à l'accueil", "Back to home"),
  ...uiStringsN3,
  ...uiStringsV5,
};

export const singletons = [settings, navigation, footer, uiStrings];
