import { block, internalCta, keyed, l, pt, titled } from "./helpers.mts";
import { home } from "./pages-home.mts";

// ADR-007 — À propos : contenu d'ORIGINE restauré (production, mot pour mot) ; on y ajoute seulement le positionnement
// en préfabrication du document v3.1 (SysQue, AutoSPRINK, Dynamo et pyRevit, bilingue). La page Soumission reprend ses textes d'origine.
// Aucun membre d'équipe, client, certification ni affiliation (CLAUDE.md §4, ADR-006 n° 12).
const tb = (sheet: string) => ({ sheet, revision: "0", date: "2026-11" });

const about = {
  _id: "page-about",
  _type: "page",
  kind: "about",
  title: l("À propos", "About"),
  slug: l("a-propos", "about"),
  titleBlock: tb("A-100"),
  seo: {
    title: l("À propos de Bimurix | Expertise BIM au Québec", "About Bimurix | BIM expertise in Quebec"),
    description: l("Découvrez l'approche de Bimurix en modélisation BIM, coordination, préfabrication MEP, données d'actifs et qualité des livrables.", "Learn about Bimurix's approach to BIM modelling, coordination, MEP prefabrication, asset data and deliverable quality."),
  },
  sections: [
    block("heroSheet", {
      heading: l("Le BIM au service de la qualité et de la coordination.", "BIM in the service of quality and coordination."),
      intro: l(
        "Bimurix est une entreprise de services BIM et de construction numérique qui accompagne les équipes de projet dans la production, la coordination et la structuration des informations du bâtiment.",
        "Bimurix is a BIM and digital construction services company supporting project teams in producing, coordinating and structuring building information.",
      ),
    }),
    block("richText", {
      heading: l("Rendre l'information BIM plus utile aux équipes de construction.", "Making BIM information more useful to construction teams."),
      body: {
        fr: pt([
          ["normal", "Nous cherchons à fournir des livrables structurés, compréhensibles et adaptés au périmètre convenu, afin de faciliter la coordination entre les intervenants et de soutenir les étapes de construction et de livraison."],
          ["h3", "Nos domaines d'intervention"],
          ["bullet", "Modélisation BIM en architecture, structure et MEP"],
          ["bullet", "Coordination multidisciplinaire"],
          ["bullet", "Préparation à la préfabrication des réseaux mécaniques"],
          ["bullet", "Structuration et contrôle des données d'actifs"],
          ["bullet", "Documentation tel que construit"],
          ["bullet", "Contrôle qualité des modèles et livrables"],
          // Ajout (document v3.1) : positionnement en préfabrication.
          ["h3", "Notre positionnement en préfabrication"],
          ["normal", "Bimurix est un spécialiste BIM MEP et préfabrication. Notre expérience en construction modulaire guide notre façon de coordonner : ce qui est dessiné doit pouvoir se fabriquer."],
          ["bullet", "Préfabrication de tuyauterie avec SysQue et de gicleurs avec AutoSPRINK"],
          ["bullet", "Une automatisation maison avec Dynamo et pyRevit, pour livrer plus vite"],
          ["bullet", "Un service bilingue, en français et en anglais"],
          ["bullet", "Un interlocuteur local, dans le Grand Montréal"],
          ["normal", "La conception, les calculs d'ingénierie (y compris parasismique), l'approbation, la signature et le sceau des dessins restent à l'ingénieur ou à l'entrepreneur."],
          ["h3", "Engagement"],
          ["normal", "Nous privilégions la clarté du périmètre, la transparence sur les informations disponibles et la traçabilité des livrables convenus. Chaque mandat est défini selon les besoins du client, les responsabilités des intervenants et les critères d'acceptation du projet."],
        ]),
        en: pt([
          ["normal", "We aim to provide structured, understandable deliverables suited to the agreed scope, to ease coordination between stakeholders and support construction and handover."],
          ["h3", "What we work on"],
          ["bullet", "BIM modelling in architecture, structure and MEP"],
          ["bullet", "Multidisciplinary coordination"],
          ["bullet", "Prefabrication readiness for mechanical networks"],
          ["bullet", "Asset data structuring and checks"],
          ["bullet", "As-built documentation"],
          ["bullet", "Quality control of models and deliverables"],
          ["h3", "Our prefabrication positioning"],
          ["normal", "Bimurix is a BIM MEP and prefabrication specialist. Our modular construction experience shapes how we coordinate: what is drawn must be buildable."],
          ["bullet", "Piping prefabrication with SysQue and sprinkler prefabrication with AutoSPRINK"],
          ["bullet", "In-house automation with Dynamo and pyRevit, to deliver faster"],
          ["bullet", "Bilingual service, in French and in English"],
          ["bullet", "A local contact in Greater Montreal"],
          ["normal", "Design, engineering calculations (including seismic), approval, and the signature and seal of the drawings remain with the engineer or the contractor."],
          ["h3", "Commitment"],
          ["normal", "We favour a clear scope, transparency about available information and traceable agreed deliverables. Each mandate is defined by the client's needs, stakeholder responsibilities and the project's acceptance criteria."],
        ]),
      },
    }),
    block("pointsList", {
      heading: l("Notre approche", "Our approach"),
      layout: "columns",
      items: keyed([
        titled(l("Comprendre avant de produire", "Understand before producing"), l("Clarifier les objectifs, les exigences, les responsabilités et les formats attendus.", "Clarify objectives, requirements, responsibilities and expected formats.")),
        titled(l("Structurer l'information", "Structure information"), l("Organiser les modèles, les paramètres et les documents selon les conventions du projet.", "Organise models, parameters and documents to project conventions.")),
        titled(l("Contrôler les livrables", "Check deliverables"), l("Vérifier les éléments définis dans le périmètre de qualité et signaler les points à confirmer.", "Check the items defined in the quality scope and flag points to confirm.")),
        titled(l("Collaborer avec les équipes", "Work with the teams"), l("Travailler à partir des informations et des décisions communiquées par les responsables du projet.", "Work from the information and decisions shared by project leads.")),
      ]),
    }),
    block("quoteCta", { heading: l("Parlons de vos besoins BIM.", "Let's talk about your BIM needs."), button: internalCta(l("Nous contacter", "Contact us"), "page-quote") }),
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
    title: l("Contact et soumission BIM | Bimurix", "Contact and BIM quote | Bimurix"),
    description: l("Contactez Bimurix pour un mandat de modélisation BIM, coordination MEP, préfabrication, données d'actifs ou documentation TQC au Québec.", "Contact Bimurix for BIM modelling, MEP coordination, prefabrication, asset data or as-built documentation in Quebec."),
  },
  sections: [
    block("heroSheet", {
      heading: l("Parlez-nous de votre projet.", "Tell us about your project."),
      intro: l(
        "Décrivez votre besoin dans le formulaire ci-dessous. Les informations transmises nous aideront à comprendre votre demande et à déterminer les prochaines étapes.",
        "Describe your needs in the form below. The information you share helps us understand your request and plan the next steps.",
      ),
    }),
    block("quoteForm", {}),
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
