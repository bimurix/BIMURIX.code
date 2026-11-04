import { internalCta, keyed, l, ref } from "./helpers.mts";

// Valeurs génériques marquées « (exemple) » ou 555 : à remplacer dans Studio (decision: D12).
const settings = {
  _id: "settings",
  _type: "settings",
  siteName: "Bimurix",
  wordmark: "bimurix",
  logoAlt: l("Bimurix", "Bimurix"),
  tagline: l("Structure. Numérisez. Avancez.", "Structure. Digitalize. Advance."),
  descriptor: l("Services BIM et construction numérique pour l'industrie de la construction.", "BIM and digital construction services for the construction industry."),
  email: "contact@bimurix.com",
  phone: "514 555-0100",
  serviceArea: l("Québec (exemple)", "Quebec (example)"),
  neq: "1234567890",
  legalName: "Bimurix inc. (exemple)",
  privacyOfficer: "Direction générale (exemple)",
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
};

export const singletons = [settings, navigation, footer, uiStrings];
