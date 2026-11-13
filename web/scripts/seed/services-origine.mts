import { keyed, l, titled } from "./helpers.mts";
import { deliverableRows, faqEntries, needs, responsibilityRows } from "./v5-common.mts";
import { serviceScenarios } from "./v5-scenarios.mts";

// Plan de contenu v5 (ADR-008) : modélisation et TQC. Faits d'origine gardés ; aucun prix, forfait ni délai fixe.
// Lexique : CLAUDE.md § 4. EN : anglais canadien de chantier. Images (heroImage, figureImage) : session S3b.
const sheet = (n: string) => ({ sheet: `S-0${n}`, revision: "0", date: "2026-11" });

export const servicesOrigine = [
  {
    _id: "service-modelisation",
    _type: "service",
    visible: true,
    order: 10,
    code: "P-01",
    network: "plumb",
    family: "modeler",
    title: l("Modélisation et coordination BIM : architecture, structure, mécanique du bâtiment", "BIM modelling and coordination: architecture, structure, building mechanical"),
    shortTitle: l("Modélisation et coordination BIM", "BIM modelling and coordination"),
    slug: l("services/modelisation-bim-coordination", "services/bim-modeling-coordination"),
    cardTitle: l("Des modèles à jour et des conflits réglés avant l'installation", "Up-to-date models and clashes resolved before installation"),
    cardText: l(
      "Architecture, structure et mécanique du bâtiment (MEP). Modèle fédéré, détection de conflits, contrôle des livrables.",
      "Architecture, structure and building mechanical (MEP). Federated model, clash detection, deliverable checks.",
    ),
    cardLinkLabel: l("Voir la modélisation et la coordination", "See modelling and coordination"),
    heroHeading: l("Des modèles BIM à jour et des conflits réglés avant l'installation.", "Up-to-date BIM models and clashes resolved before installation."),
    heroIntro: l(
      "Bimurix produit, met à jour et coordonne les modèles d'architecture, de structure et de mécanique du bâtiment (MEP), selon la portée de chaque mandat. Les conflits entre corps de métier sont détectés et listés avant d'arriver au chantier.",
      "Bimurix produces, updates and coordinates the architecture, structure and building mechanical (MEP) models, within the scope of each mandate. Clashes between trades are detected and listed before they reach the site.",
    ),
    quoteButtonLabel: l("Demander une soumission de modélisation", "Request a modelling quote"),
    audience: l(
      "Entrepreneurs généraux, entrepreneurs spécialisés en mécanique du bâtiment et firmes de génie-conseil qui ont besoin de modèles structurés, coordonnés et vérifiés.",
      "General contractors, building mechanical specialty contractors and engineering firms that need structured, coordinated and checked models.",
    ),
    scenarios: serviceScenarios("mod1", "mod2"),
    responsibilityNote: l(
      "Bimurix produit, coordonne et vérifie les modèles selon la portée convenue. La conception, les calculs, l'approbation, la signature et le sceau restent à l'ingénieur ou à l'entrepreneur.",
      "Bimurix produces, coordinates and checks the models within the agreed scope. Design, calculations, approval, and the signature and seal remain with the engineer or the contractor.",
    ),
    responsibilityRows: responsibilityRows("design", "approval", "models", "clashes"),
    offeringsHeading: l("Ce que nous faisons", "What we do"),
    offerings: keyed([
      titled(l("Modélisation d'architecture", "Architectural modelling"), l("Production ou mise à jour des éléments architecturaux selon les documents de référence et le niveau de développement convenu.", "Production or update of architectural elements based on the reference documents and the agreed level of development.")),
      titled(l("Modélisation de structure", "Structural modelling"), l("Modélisation ou mise à jour des éléments structuraux à partir des documents fournis par l'ingénieur ou le concepteur.", "Modelling or update of structural elements from the documents provided by the engineer or designer.")),
      titled(l("Modélisation de mécanique du bâtiment", "Building mechanical modelling"), l("Réseaux et équipements de plomberie, de chauffage et des autres disciplines du mandat : salle mécanique, colonnes montantes, distribution aux étages.", "Plumbing and heating systems and equipment, and the other disciplines of the mandate: mechanical room, risers, distribution to the floors.")),
      titled(l("Coordination et détection de conflits", "Coordination and clash detection"), l("Préparation du modèle fédéré, détection des conflits entre les corps de métier, liste des conflits pour la réunion de coordination et suivi jusqu'à leur résolution.", "Preparation of the federated model, detection of clashes between trades, clash list for the coordination meeting and follow-up until they are resolved.")),
      titled(l("Contrôle de la qualité", "Quality control"), l("Vérification de l'organisation du modèle, des propriétés, des paramètres, des nomenclatures et des exigences de livraison convenues.", "Checks on model organisation, properties, parameters, schedules and the agreed delivery requirements.")),
    ]),
    deliverablesHeading: l("Ce que vous recevez", "What you receive"),
    deliverableRows: deliverableRows([
      [["Modèles BIM natifs ou formats d'échange convenus", "Native BIM models or agreed exchange formats"], ["à ce que chaque corps de métier travaille sur la même base", "so every trade works from the same base"]],
      [["Modèles fédérés pour la coordination", "Federated models for coordination"], ["à voir tous les corps de métier ensemble avant l'installation", "to see all trades together before installation"]],
      [["Rapports ou listes de problèmes", "Issue reports or lists"], ["à décider en réunion de coordination qui déplace quoi", "to decide in the coordination meeting who moves what"]],
      [["Vues, nomenclatures et documents issus du modèle", "Views, schedules and documents from the model"], ["à sortir les plans et les quantités du même modèle", "to produce drawings and quantities from the same model"]],
      [["Listes de vérification qualité", "Quality checklists"], ["à savoir ce qui a été contrôlé", "to know what was checked"]],
      [["Registre des éléments à corriger ou à confirmer", "Log of items to correct or confirm"], ["à suivre chaque point jusqu'à sa résolution", "to track each point until it is resolved"]],
    ]),
    deliverablesNote: l("Les formats, le niveau de détail et les responsabilités sont précisés dans la soumission.", "Formats, level of detail and responsibilities are set out in the quote."),
    needsHeading: l("Ce qu'il faut nous envoyer", "What to send us"),
    needs: needs([
      ["Les plans et les modèles de référence", "The reference drawings and models"],
      ["Les exigences du projet (niveau de développement, formats)", "The project requirements (level of development, formats)"],
      ["La liste des corps de métier et de leurs modèles", "The list of trades and their models"],
      ["L'échéancier des réunions de coordination", "The schedule of coordination meetings"],
      ["Qui approuve quoi", "Who approves what"],
    ]),
    methodHeading: l("Comment ça se passe", "How it works"),
    methodSteps: keyed([
      l("Nous revoyons vos exigences et vos documents de référence", "We review your requirements and reference documents"),
      l("Nous confirmons la portée, les responsabilités et les formats", "We confirm the scope, responsibilities and formats"),
      l("Nous produisons ou mettons à jour les modèles", "We produce or update the models"),
      l("Nous vérifions selon les règles convenues", "We check against the agreed rules"),
      l("Nous livrons et signalons les éléments en attente", "We deliver and flag the pending items"),
    ]),
    faq: faqEntries("documents", "price", "seismic"),
    ctaHeading: l("Un modèle à produire ou à coordonner ?", "A model to produce or coordinate?"),
    ctaText: l("Indiquez les disciplines, l'avancement du projet et les livrables attendus.", "Tell us the disciplines, the project's progress and the expected deliverables."),
    titleBlock: sheet("1"),
    seo: {
      title: l("Modélisation et coordination BIM | Bimurix Québec", "BIM modelling and coordination | Bimurix Quebec"),
      description: l(
        "Modèles d'architecture, de structure et de mécanique du bâtiment à jour, détection de conflits et liste pour la réunion de coordination. Grand Montréal.",
        "Up-to-date architecture, structure and building mechanical models, clash detection and a clash list for the coordination meeting. Greater Montreal.",
      ),
    },
  },
  {
    _id: "service-tqc",
    _type: "service",
    visible: true,
    order: 60,
    code: "Q-06",
    network: "tqc",
    family: "livrer",
    title: l("Modèles et plans tel que construit (TQC)", "As-built models and drawings"),
    shortTitle: l("Tel que construit (TQC)", "As-built"),
    slug: l("services/tqc-controle-qualite", "services/as-built-quality-control"),
    cardTitle: l("Des plans et des modèles qui reflètent le chantier", "Drawings and models that reflect the site"),
    cardText: l(
      "Mise à jour des modèles et des plans à partir des relevés, des changements approuvés et des informations validées du chantier. Contrôles de cohérence et de complétude.",
      "Updating models and drawings from surveys, approved changes and validated site information. Consistency and completeness checks.",
    ),
    cardLinkLabel: l("Voir le tel que construit", "See as-built"),
    heroHeading: l("Des plans et des modèles tel que construit qui reflètent le chantier.", "As-built drawings and models that reflect the site."),
    heroIntro: l(
      "Bimurix prépare les modèles et les plans tel que construit à partir de vos relevés, de vos annotations et des changements approuvés. Un élément n'est jamais présenté comme vérifié sur chantier sans les données qui le prouvent.",
      "Bimurix prepares as-built models and drawings from your surveys, mark-ups and approved changes. Nothing is ever presented as site-verified without the data that proves it.",
    ),
    quoteButtonLabel: l("Demander une soumission tel que construit", "Request an as-built quote"),
    audience: l(
      "Entrepreneurs généraux et entrepreneurs mécaniques qui livrent un modèle tel que construit, firmes de génie-conseil et propriétaires qui préparent la remise finale d'un projet.",
      "General contractors and mechanical contractors who deliver an as-built model, engineering firms and owners preparing a project's final handover.",
    ),
    scenarios: serviceScenarios("q1", "q2"),
    responsibilityNote: l(
      "Bimurix prépare les documents et modèles tel que construit à partir des informations reçues. La conception, les calculs, l'approbation, la signature et le sceau restent à l'ingénieur ou à l'entrepreneur.",
      "Bimurix prepares the as-built documents and models from the information received. Design, calculations, approval, and the signature and seal remain with the engineer or the contractor.",
    ),
    responsibilityRows: responsibilityRows("design", "approval", "survey"),
    offeringsHeading: l("Ce que nous faisons", "What we do"),
    offerings: keyed([
      titled(l("Mise à jour des modèles", "Model updates"), l("Intégration des demandes de changement documentées et approuvées dans les modèles concernés.", "Integrating documented, approved change orders into the relevant models.")),
      titled(l("Mise à jour des plans", "Drawing updates"), l("Révision des plans et vues pour refléter les changements confirmés et les informations disponibles.", "Revising drawings and views to reflect confirmed changes and available information.")),
      titled(l("Intégration des informations de chantier", "Site information integration"), l("Organisation des relevés, des annotations et des photos référencées, quand leur utilisation est prévue au mandat.", "Organising surveys, mark-ups and referenced photos, when the mandate calls for them.")),
      titled(l("Vérification de cohérence", "Consistency checks"), l("Comparaison des modèles, plans, nomenclatures et documents dans les limites des informations reçues.", "Comparing models, drawings, schedules and documents within the limits of the information received.")),
      titled(l("Préparation du dossier de remise", "Handover package preparation"), l("Organisation des fichiers, des versions et des documents convenus pour la livraison finale, par exemple les manuels d'exploitation et d'entretien fournis.", "Organising the agreed files, versions and documents for final delivery, for example the O&M manuals provided.")),
    ]),
    deliverablesHeading: l("Ce que vous recevez", "What you receive"),
    deliverableRows: deliverableRows([
      [["Modèles et plans tel que construit mis à jour", "Updated as-built models and drawings"], ["à remettre au propriétaire ce qui est réellement installé", "to hand the owner what is actually installed"]],
      [["Dossier de remise (fichiers, versions, documents)", "Handover package (files, versions, documents)"], ["à retrouver chaque document sans fouiller", "to find each document without digging"]],
      [["Liste des réserves restantes", "List of remaining reservations"], ["à savoir ce qui reste à confirmer avant la fermeture du dossier", "to know what is left to confirm before the file is closed"]],
    ]),
    needsHeading: l("Ce qu'il faut nous envoyer", "What to send us"),
    needs: needs([
      ["Modèles et plans de référence", "Reference models and drawings"],
      ["Relevés et annotations de chantier", "Site surveys and mark-ups"],
      ["Liste des modifications approuvées", "List of approved changes"],
      ["Exigences de remise et conventions de nommage", "Handover requirements and naming conventions"],
      ["Formats de fichiers attendus", "Expected file formats"],
      ["Règles de validation et responsabilités d'approbation", "Validation rules and approval responsibilities"],
    ]),
    needsNote: l(
      "La qualité d'un dossier tel que construit dépend de la qualité et de l'exhaustivité des informations terrain fournies. Un élément n'est jamais présenté comme vérifié sur chantier sans données ou vérification appropriées.",
      "The quality of an as-built package depends on the quality and completeness of the site information provided. Nothing is presented as site-verified without appropriate data or verification.",
    ),
    methodHeading: l("Comment ça se passe", "How it works"),
    methodSteps: keyed([
      l("Nous inventorions les documents reçus", "We inventory the documents received"),
      l("Nous repérons les données manquantes ou ambiguës", "We spot missing or ambiguous data"),
      l("Nous intégrons les changements confirmés", "We integrate the confirmed changes"),
      l("Nous vérifions la cohérence selon les critères convenus", "We check consistency against the agreed criteria"),
      l("Nous remettons les fichiers et nous signalons les réserves restantes", "We hand over the files and flag the remaining reservations"),
    ]),
    faq: faqEntries("documents", "price", "verify"),
    ctaHeading: l("Une remise finale à préparer ?", "A final handover to prepare?"),
    ctaText: l(
      "Indiquez les exigences de remise, les disciplines et les documents disponibles : plans de référence, relevés, changements approuvés.",
      "Tell us the handover requirements, the disciplines and the documents available: reference drawings, surveys, approved changes.",
    ),
    titleBlock: sheet("6"),
    seo: {
      title: l("Plans et modèles tel que construit (TQC) | Bimurix", "As-built drawings and models | Bimurix"),
      description: l(
        "Mise à jour des modèles et des plans tel que construit à partir des relevés et des changements approuvés, avec un dossier de remise organisé.",
        "As-built model and drawing updates from surveys and approved changes, with an organised handover package.",
      ),
    },
  },
];
