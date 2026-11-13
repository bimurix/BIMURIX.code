import { block, internalCta, keyed, l, pt, titled } from "./helpers.mts";
import { home } from "./pages-home.mts";
import { allResponsibilityRows, engineerSentence, faqEntries } from "./v5-common.mts";

// Plan de contenu v5 § 3.8 (ADR-008) : À propos en 6 sections, Soumission avec son encart « Ce qu'il faut nous envoyer » (réglages du formulaire).
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
      heading: l("Le BIM au service du chantier : qualité et coordination.", "BIM in the service of the site: quality and coordination."),
      intro: l(
        "Bimurix est une entreprise de services BIM et de construction numérique. Nous aidons les équipes de projet à produire, coordonner et structurer l'information du bâtiment, du modèle de conception à la remise.",
        "Bimurix is a BIM and digital construction services company. We help project teams produce, coordinate and structure building information, from the design model to handover.",
      ),
    }),
    block("serviceNetworks", { heading: l("Ce que nous faisons", "What we do") }),
    block("richText", {
      heading: l("Notre positionnement en préfabrication", "Our prefabrication positioning"),
      body: {
        fr: pt([
          ["normal", "Bimurix est un spécialiste BIM MEP et préfabrication. Notre expérience en construction modulaire guide notre façon de coordonner : ce qui est dessiné doit pouvoir se fabriquer."],
          ["bullet", "Préfabrication de tuyauterie avec SysQue et de gicleurs avec AutoSPRINK"],
          ["bullet", "Une automatisation maison avec Dynamo et pyRevit, pour livrer plus vite"],
          ["bullet", "Un service bilingue, en français et en anglais"],
          ["bullet", "Un interlocuteur local, dans le Grand Montréal"],
        ]),
        en: pt([
          ["normal", "Bimurix is a BIM MEP and prefabrication specialist. Our modular construction experience shapes how we coordinate: what is drawn must be buildable."],
          ["bullet", "Piping prefabrication with SysQue and sprinkler prefabrication with AutoSPRINK"],
          ["bullet", "In-house automation with Dynamo and pyRevit, to deliver faster"],
          ["bullet", "Bilingual service, in French and in English"],
          ["bullet", "A local contact in Greater Montreal"],
        ]),
      },
    }),
    block("pointsList", {
      heading: l("Notre façon de travailler", "How we work"),
      layout: "columns",
      items: keyed([
        titled(l("Nous comprenons avant de produire", "We understand before we produce"), l("Objectifs, exigences, responsabilités, formats attendus.", "Objectives, requirements, responsibilities, expected formats.")),
        titled(l("Nous structurons l'information", "We structure the information"), l("Selon les conventions du projet.", "To the project's conventions.")),
        titled(l("Nous contrôlons les livrables", "We check the deliverables"), l("Et nous signalons les points à confirmer.", "And we flag the points to confirm.")),
        titled(l("Nous travaillons avec vos décisions", "We work from your decisions"), l("Nous partons des informations que les responsables du projet nous transmettent.", "We start from the information the project's leads give us.")),
      ]),
      intro: l(
        "Chaque mandat est défini selon vos besoins, les responsabilités des intervenants et les critères d'acceptation du projet.",
        "Each mandate is defined by your needs, the stakeholders' responsibilities and the project's acceptance criteria.",
      ),
    }),
    block("responsibilityTable", { heading: l("Qui fait quoi", "Who does what"), rows: allResponsibilityRows(), note: engineerSentence }),
    block("quoteCta", { heading: l("Un projet à nous confier ?", "A project to entrust to us?"), button: internalCta(l("Demander une soumission", "Request a quote"), "page-quote") }),
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
      heading: l("Parlez-nous de votre projet.", "Tell us about your project."),
      intro: l(
        "Décrivez votre projet et le service qui vous intéresse. Plus nous avons de détails (plans, disciplines, échéancier), plus la soumission est juste.",
        "Describe your project and the service you are interested in. The more detail we have (drawings, disciplines, schedule), the more accurate the quote.",
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
  seo: { noIndex: true },
  sections: [
    block("heroSheet", {
      heading: l("Cette feuille n'existe pas.", "This sheet doesn't exist."),
      intro: l("La page demandée a peut-être été déplacée ou renommée.", "The page you requested may have been moved or renamed."),
      ctas: keyed([internalCta(l("Retour à l'accueil", "Back to home"), "page-home")]),
    }),
  ],
};

export const pages = [home, about, quote, notFound];
