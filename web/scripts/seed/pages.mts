import { block, internalCta, keyed, l, pt, titled } from "./helpers.mts";

// Textes : docs/source/Bimurix_Contenu_Complet_Site_Vitrine.md §3, §8, §9 (EN : traduction à relire).
const tb = (sheet: string) => ({ sheet, revision: "0", date: "2026-11" });
const requestQuote = l("Demander une soumission", "Request a quote");

const home = {
  _id: "page-home",
  _type: "page",
  kind: "home",
  title: l("Accueil", "Home"),
  titleBlock: tb("A-000"),
  seo: {
    title: l("Services BIM au Québec | Bimurix", "BIM services in Quebec | Bimurix"),
    description: l(
      "Bimurix accompagne les équipes de construction en modélisation BIM, coordination architecture-structure-MEP, préfabrication mécanique, BIM 7D et documentation tel que construit.",
      "Bimurix supports construction teams with BIM modelling, architecture-structure-MEP coordination, mechanical prefabrication, BIM 7D and as-built documentation.",
    ),
  },
  sections: [
    block("heroSheet", {
      heading: l("Des modèles BIM fiables. Une construction mieux préparée.", "Reliable BIM models. Better-prepared construction."),
      intro: l(
        "Bimurix accompagne les professionnels de la construction dans la modélisation BIM, la coordination des systèmes du bâtiment, la préparation à la préfabrication et la structuration des données d'actifs.",
        "Bimurix supports construction professionals with BIM modelling, building systems coordination, prefabrication readiness and asset data structuring.",
      ),
      ctas: keyed([internalCta(requestQuote, "page-quote"), { label: l("Découvrir nos services", "Explore our services"), style: "secondary", link: { kind: "external", external: "#services" } }]),
      specialties: l("Architecture · Structure · MEP · Préfabrication · BIM 7D · TQC", "Architecture · Structure · MEP · Prefabrication · BIM 7D · As-built"),
    }),
    block("richText", {
      heading: l("Le BIM doit servir le chantier, pas seulement le modèle.", "BIM should serve the site, not just the model."),
      body: {
        fr: pt([
          ["normal", "Un modèle BIM apporte une réelle valeur lorsqu'il aide les équipes à mieux coordonner les disciplines, à anticiper les difficultés d'installation et à transmettre des informations fiables."],
          ["normal", "Bimurix intervient sur les modèles, les données et les livrables pour aider les équipes à travailler avec une information plus claire, mieux structurée et adaptée aux objectifs du projet."],
        ]),
        en: pt([
          ["normal", "A BIM model delivers real value when it helps teams coordinate disciplines, anticipate installation issues and pass on reliable information."],
          ["normal", "Bimurix works on models, data and deliverables so teams can rely on clearer, better-structured information suited to the project's goals."],
        ]),
      },
    }),
    block("serviceNetworks", { heading: l("Nos services", "Our services") }),
    block("method", {
      heading: l("Une méthode claire, du besoin au livrable.", "A clear method, from need to deliverable."),
      steps: keyed([
        titled(l("Comprendre", "Understand"), l("Nous clarifions les exigences du projet, les disciplines concernées, les usages BIM, les formats attendus et les critères d'acceptation.", "We clarify project requirements, disciplines involved, BIM uses, expected formats and acceptance criteria.")),
        titled(l("Produire", "Produce"), l("Nous réalisons ou mettons à jour les modèles, les données et la documentation selon le périmètre convenu.", "We create or update models, data and documentation within the agreed scope.")),
        titled(l("Vérifier", "Check"), l("Nous contrôlons les éléments convenus : cohérence, paramètres, coordination, complétude et conformité aux exigences communiquées.", "We check the agreed items: consistency, parameters, coordination, completeness and compliance with the stated requirements.")),
        titled(l("Livrer", "Deliver"), l("Nous préparons les fichiers et documents convenus pour faciliter leur revue, leur utilisation par les équipes et leur intégration au processus du projet.", "We prepare the agreed files and documents for easy review, use by the teams and integration into the project process.")),
      ]),
    }),
    block("pointsList", {
      heading: l("Une approche axée sur la qualité des livrables.", "An approach focused on deliverable quality."),
      layout: "columns",
      items: keyed([
        titled(l("Coordination plus claire", "Clearer coordination"), l("Faciliter l'identification et le suivi des problèmes entre disciplines.", "Make it easier to identify and track issues between disciplines.")),
        titled(l("Préparation à l'installation", "Installation readiness"), l("Structurer les informations et les documents nécessaires à la préparation des réseaux mécaniques.", "Structure the information and documents needed to prepare mechanical networks.")),
        titled(l("Données mieux organisées", "Better-organised data"), l("Améliorer la cohérence et la complétude des paramètres selon les exigences définies.", "Improve parameter consistency and completeness against defined requirements.")),
        titled(l("Livrables traçables", "Traceable deliverables"), l("Clarifier les éléments vérifiés, les informations reçues et les livrables remis.", "Make clear what was checked, what was received and what was delivered.")),
      ]),
    }),
    block("pointsList", {
      heading: l("Un soutien BIM adapté aux équipes de construction.", "BIM support built for construction teams."),
      layout: "list",
      items: keyed([
        titled(l("Entrepreneurs généraux", "General contractors"), l("Soutien BIM pour la coordination, le suivi des livrables et la cohérence de l'information entre disciplines.", "BIM support for coordination, deliverable tracking and information consistency across disciplines.")),
        titled(l("Entrepreneurs MEP", "MEP contractors"), l("Soutien spécialisé pour les réseaux mécaniques, la plomberie, le chauffage, la préfabrication et la préparation des documents d'installation.", "Specialised support for mechanical networks, plumbing, heating, prefabrication and installation documents.")),
        titled(l("Firmes de génie-conseil", "Engineering firms"), l("Soutien à la production, à la coordination et à la vérification des modèles et informations BIM selon le mandat.", "Support producing, coordinating and checking BIM models and information within the mandate.")),
        titled(l("Fabricants et équipes de préfabrication", "Fabricators and prefab teams"), l("Préparation des informations et des documents nécessaires aux flux de fabrication convenus.", "Preparing the information and documents required by the agreed fabrication workflows.")),
        titled(l("Propriétaires et gestionnaires d'actifs", "Owners and asset managers"), l("Structuration des données et préparation des informations utiles à la livraison et à l'exploitation du bâtiment.", "Structuring data and preparing information for building handover and operations.")),
      ]),
    }),
    block("quoteCta", {
      heading: l("Une expertise BIM orientée vers les besoins réels du projet.", "BIM expertise focused on the project's real needs."),
      text: l(
        "Bimurix associe compréhension technique, rigueur documentaire et attention portée à la qualité des données. Chaque mandat commence par la clarification des besoins, des responsabilités, des informations disponibles et des critères de livraison.",
        "Bimurix combines technical understanding, documentation rigour and attention to data quality. Every mandate starts by clarifying needs, responsibilities, available information and delivery criteria.",
      ),
      button: internalCta(l("En savoir plus sur Bimurix", "More about Bimurix"), "page-about", "secondary"),
    }),
    block("quoteCta", {
      heading: l("Parlons de votre prochain projet.", "Let's talk about your next project."),
      text: l(
        "Vous avez besoin de soutien en modélisation BIM, coordination MEP, préfabrication, données d'actifs ou documentation TQC ? Présentez-nous votre projet et les livrables attendus.",
        "Need support with BIM modelling, MEP coordination, prefabrication, asset data or as-built documentation? Tell us about your project and the expected deliverables.",
      ),
      button: internalCta(requestQuote, "page-quote"),
    }),
  ],
};

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
