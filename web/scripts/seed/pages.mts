import { block, internalCta, keyed, l, quoteLabel, titled } from "./helpers.mts";
import { home } from "./pages-home.mts";
import { allResponsibilityRows, engineerSentence, faqEntries } from "./v5-common.mts";
import { whyBimurix } from "./v5-why.mts";

// Plan de contenu v5 § 3.8 (ADR-008), puis cahier v6 T2 (ADR-009) : À propos en 7 sections (pourquoi Bimurix, l'entreprise, façon de travailler, services, qui fait quoi),
// Soumission avec son encart « Utile, si vous l'avez sous la main » et sa colonne de réassurance (réglages du formulaire).
// Aucun membre d'équipe, client, certification ni affiliation (CLAUDE.md §4, ADR-006 n° 12). Image de bande : session S3b.
const tb = (sheet: string) => ({ sheet, revision: "0", date: "2026-11" });

const about = {
  _id: "page-about",
  _type: "page",
  kind: "about",
  title: l("À propos", "About"),
  slug: l("a-propos", "about"),
  titleBlock: tb("A-100"),
  seo: {
    title: l("À propos de Bimurix | Services BIM au Québec", "About Bimurix | BIM services in Quebec"),
    description: l(
      "Bimurix modélise, coordonne et structure l'information du bâtiment, du modèle de conception à la remise : trois familles de services, préfabrication SysQue et AutoSPRINK, Grand Montréal.",
      "Bimurix models, coordinates and structures building information, from the design model to handover: three service families, SysQue and AutoSPRINK prefabrication, Greater Montreal.",
    ),
  },
  sections: [
    block("heroSheet", {
      heading: l(
        "Un spécialiste BIM de la mécanique du bâtiment et de la préfabrication, dans le Grand Montréal.",
        "A BIM specialist in building mechanical (MEP) systems and prefabrication, in Greater Montreal.",
      ),
      intro: l(
        "Bimurix modélise, coordonne et dessine pour les équipes de projet, du modèle de conception à la remise. Notre expérience en construction modulaire guide notre façon de travailler : ce qui est dessiné doit pouvoir se fabriquer.",
        "Bimurix models, coordinates and draws for project teams, from the design model to handover. Our modular construction experience shapes how we work: what is drawn must be buildable.",
      ),
    }),
    whyBimurix(false),
    block("companySheet", {
      heading: l("L'entreprise", "The company"),
      languages: l("Français, anglais", "French, English"),
      responsible: l("Fondateur", "Founder"),
    }),
    block("pointsList", {
      heading: l("Notre façon de travailler", "How we work"),
      layout: "columns",
      items: keyed([
        titled(l("La portée est écrite avant de commencer", "The scope is written before we start"), l("Ce qui est inclus, les formats et qui approuve quoi : tout est dans la soumission.", "What is included, the formats and who approves what: it is all in the quote.")),
        titled(l("Nous suivons vos conventions", "We follow your conventions"), l("Nommage, gabarits et codification : ceux du projet ou de votre atelier.", "Naming, templates and coding: the project's or your shop's.")),
        titled(l("Chaque livraison a sa liste de points à confirmer", "Each delivery comes with its list of points to confirm"), l("Rien n'est présenté comme vérifié sans la donnée qui le prouve.", "Nothing is presented as verified without the data that proves it.")),
        titled(l("Les décisions restent les vôtres", "The decisions stay yours"), l("Nous partons des documents approuvés ; l'ingénieur conçoit et signe.", "We start from approved documents; the engineer designs and signs.")),
      ]),
      intro: l(
        "Chaque mandat est défini selon vos besoins, les responsabilités des intervenants et les critères d'acceptation du projet.",
        "Each project is defined by your needs, the stakeholders' responsibilities and the project's acceptance criteria.",
      ),
    }),
    block("serviceNetworks", { heading: l("Ce que nous faisons", "What we do") }),
    block("responsibilityTable", { heading: l("Qui fait quoi", "Who does what"), rows: allResponsibilityRows(), note: engineerSentence }),
    block("quoteCta", { heading: l("Un projet à nous confier ?", "Have a project for us?"), button: internalCta(quoteLabel, "page-quote") }),
  ],
};

const quote = {
  _id: "page-quote",
  _type: "page",
  kind: "quote",
  title: l("Demande de soumission", "Request a quote"),
  slug: l("soumission", "quote"),
  titleBlock: tb("A-900"),
  seo: {
    title: l("Demander une soumission BIM | Bimurix", "Request a BIM quote | Bimurix"),
    description: l(
      "Demandez une soumission à Bimurix : modélisation et coordination BIM, dessins d'atelier de tuyauterie et de gicleurs, tel que construit, données d'actifs. Réponse d'ici un jour ouvrable.",
      "Request a quote from Bimurix: BIM modelling and coordination, piping and sprinkler shop drawings, as-built, asset data. Reply within one business day.",
    ),
  },
  sections: [
    block("heroSheet", {
      heading: l("Demandez votre soumission.", "Request your quote."),
      intro: l(
        "Décrivez le projet et le service voulu. Nous vous répondons d'ici un jour ouvrable.",
        "Describe the project and the service you need. We reply within one business day.",
      ),
    }),
    block("quoteForm", {}),
    block("faq", { heading: l("Questions fréquentes", "Frequently asked questions"), items: faqEntries("price", "documents", "region") }),
  ],
};

const notFound = {
  _id: "page-not-found",
  _type: "page",
  kind: "notFound",
  title: l("Page introuvable", "Page not found"),
  titleBlock: tb("X-404"),
  seo: { title: l("Page introuvable | Bimurix", "Page not found | Bimurix"), noIndex: true },
  sections: [
    block("heroSheet", {
      heading: l("Cette feuille n'existe pas.", "This sheet doesn't exist."),
      intro: l("La page demandée a peut-être été déplacée ou renommée.", "The page you requested may have been moved or renamed."),
      ctas: keyed([internalCta(l("Retour à l'accueil", "Back to home"), "page-home"), internalCta(quoteLabel, "page-quote", "secondary")]),
    }),
  ],
};

export const pages = [home, about, quote, notFound];
