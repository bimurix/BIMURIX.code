import { internalCta, keyed, l, ref } from "./helpers.mts";
import { uiStringsN3 } from "./ui-strings-n3.mts";

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
    description: l("Modélisation, coordination, préfabrication MEP, BIM 7D et TQC pour les équipes de construction au Québec.", "Modelling, coordination, MEP prefabrication, BIM 7D and as-built for construction teams in Quebec."),
  },
};

const navigation = {
  _id: "navigation",
  _type: "navigation",
  items: keyed([
    { label: l("Services", "Services"), listServices: true, link: { kind: "external", external: "/#services" } },
    { label: l("Forfaits", "Packages"), link: { kind: "external", external: "/#forfaits" } },
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
    "Services BIM et construction numérique pour la modélisation, la coordination, la préfabrication MEP, les données d'actifs et la documentation TQC.",
    "BIM and digital construction services for modelling, coordination, MEP prefabrication, asset data and as-built documentation.",
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
    {
      title: l("Services", "Services"),
      links: keyed([
        internalCta(l("Modélisation BIM et coordination", "BIM modelling and coordination"), "service-modelisation", "secondary"),
        internalCta(l("Tuyauterie mécanique", "Mechanical piping"), "service-prefabrication", "secondary"),
        internalCta(l("Gicleurs", "Sprinklers"), "service-gicleurs", "secondary"),
        internalCta(l("Tuyauterie et gicleurs", "Piping and sprinklers"), "service-combinee", "secondary"),
        internalCta(l("BIM 7D", "BIM 7D"), "service-bim-7d", "secondary"),
        internalCta(l("TQC et contrôle qualité", "As-built and quality control"), "service-tqc", "secondary"),
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
  discoverServices: l("Découvrir nos services", "Explore our services"),
  learnMore: l("En savoir plus", "Learn more"),
  menu: l("Menu", "Menu"),
  closeMenu: l("Fermer le menu", "Close menu"),
  services: l("Services", "Services"),
  skipToContent: l("Aller au contenu", "Skip to content"),
  networkHint: l("Choisissez un réseau pour demander une soumission sur ce service.", "Pick a network to request a quote for that service."),
  illustrativeExample: l("Exemple illustratif", "Illustrative example"),
  sheet: l("Feuille", "Sheet"),
  revision: l("Révision", "Revision"),
  date: l("Date", "Date"),
  backHome: l("Retour à l'accueil", "Back to home"),
  ...uiStringsN3,
};

export const singletons = [settings, navigation, footer, uiStrings];
