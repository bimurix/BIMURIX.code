import { internalCta, keyed, l, titled } from "./helpers.mts";

// ADR-007 : modélisation et TQC reviennent en vitrine, contenu d'origine (production) intact ; seuls le code, l'ordre, la feuille, `audience` et `responsibilityNote` sont ajoutés.
const quote = "page-quote";

export const servicesOrigine = [
  {
    _id: "service-modelisation",
    _type: "service",
    visible: true,
    order: 10,
    code: "P-01",
    network: "plumb",
    title: l("Modélisation BIM et coordination", "BIM modelling and coordination"),
    slug: l("services/modelisation-bim-coordination", "services/bim-modeling-coordination"),
    cardTitle: l("Des modèles structurés et coordonnés", "Structured, coordinated models"),
    cardText: l(
      "Modélisation en architecture, structure et MEP, coordination interdisciplinaire et vérification des livrables selon les exigences du projet.",
      "Architectural, structural and MEP modelling, interdisciplinary coordination and deliverable checks against project requirements.",
    ),
    cardLinkLabel: l("Découvrir la modélisation BIM", "Explore BIM modelling"),
    heroHeading: l("Des modèles BIM structurés pour mieux coordonner le projet.", "Structured BIM models for better project coordination."),
    heroIntro: l(
      "Bimurix soutient les équipes de construction dans la production, la coordination et la vérification des modèles BIM en architecture, structure et mécanique, selon le périmètre et les exigences définis pour chaque mandat.",
      "Bimurix supports construction teams in producing, coordinating and checking BIM models in architecture, structure and mechanical, within the scope and requirements set for each mandate.",
    ),
    // Pour qui : les clientèles de la section « Un soutien BIM adapté aux équipes de construction » de l'accueil d'origine.
    audience: l(
      "Entrepreneurs généraux, entrepreneurs MEP et firmes de génie-conseil qui ont besoin de modèles BIM structurés, coordonnés et vérifiés selon le périmètre du mandat.",
      "General contractors, MEP contractors and engineering firms that need structured, coordinated and checked BIM models within the mandate's scope.",
    ),
    responsibilityNote: l(
      "Bimurix produit, coordonne et vérifie les modèles selon le périmètre convenu. La conception, les calculs, l'approbation, la signature et le sceau restent à l'ingénieur ou à l'entrepreneur.",
      "Bimurix produces, coordinates and checks the models within the agreed scope. Design, calculations, approval, and the signature and seal remain with the engineer or the contractor.",
    ),
    heroCta: internalCta(l("Discuter de votre projet BIM", "Discuss your BIM project"), quote, "primary", "service-modelisation"),
    offeringsHeading: l("Nos services", "Our services"),
    offerings: keyed([
      titled(l("Modélisation architecture", "Architectural modelling"), l("Production ou mise à jour des éléments architecturaux du modèle selon les documents de référence, le niveau de développement et les exigences convenus.", "Production or update of architectural model elements based on reference documents, the agreed level of development and requirements.")),
      titled(l("Modélisation structure", "Structural modelling"), l("Modélisation ou mise à jour des éléments structuraux à partir des informations et documents fournis par les responsables concernés.", "Modelling or update of structural elements from the information and documents provided by the responsible parties.")),
      titled(l("Modélisation MEP", "MEP modelling"), l("Développement des modèles de mécanique du bâtiment, notamment les réseaux et équipements de plomberie, chauffage et autres disciplines incluses dans le mandat.", "Development of building mechanical models, including plumbing and heating networks and equipment, and other disciplines included in the mandate.")),
      titled(l("Coordination interdisciplinaire", "Interdisciplinary coordination"), l("Préparation et revue des modèles fédérés, identification des conflits et soutien au suivi des problèmes selon le processus de coordination du projet.", "Preparation and review of federated models, clash identification and issue tracking support following the project's coordination process.")),
      titled(l("Assurance et contrôle qualité", "Quality assurance and control"), l("Vérification des éléments convenus : organisation du modèle, propriétés, paramètres, nomenclatures, cohérence des informations et exigences de livraison.", "Checks on agreed items: model organisation, properties, parameters, schedules, information consistency and delivery requirements.")),
    ]),
    deliverablesHeading: l("Livrables possibles", "Possible deliverables"),
    deliverables: keyed([
      l("Modèles BIM natifs ou formats d'échange convenus", "Native BIM models or agreed exchange formats"),
      l("Modèles fédérés pour la coordination", "Federated models for coordination"),
      l("Rapports ou listes de problèmes", "Issue reports or lists"),
      l("Vues, nomenclatures et documents issus du modèle", "Views, schedules and documents from the model"),
      l("Listes de vérification qualité", "Quality checklists"),
      l("Registre des éléments à corriger ou à confirmer", "Log of items to correct or confirm"),
    ]),
    deliverablesNote: l("Les formats, le niveau de détail et les responsabilités sont précisés dans l'offre de service.", "Formats, level of detail and responsibilities are set out in the service proposal."),
    methodHeading: l("Notre approche qualité", "Our quality approach"),
    methodSteps: keyed([
      l("Revue des exigences et des documents de référence", "Review of requirements and reference documents"),
      l("Confirmation du périmètre, des responsabilités et des formats", "Confirmation of scope, responsibilities and formats"),
      l("Production ou mise à jour des modèles", "Model production or update"),
      l("Vérifications selon les règles et critères convenus", "Checks against agreed rules and criteria"),
      l("Remise des livrables et signalement des éléments en attente", "Delivery and flagging of pending items"),
    ]),
    ctaHeading: l("Votre équipe a besoin de soutien BIM ?", "Does your team need BIM support?"),
    ctaText: l("Présentez-nous les disciplines concernées, l'état d'avancement du projet et les livrables attendus.", "Tell us the disciplines involved, the project's progress and the expected deliverables."),
    ctaButton: internalCta(l("Demander une soumission BIM", "Request a BIM quote"), quote, "primary", "service-modelisation"),
    titleBlock: { sheet: "S-01", revision: "0", date: "2026-11" },
    seo: {
      title: l("Modélisation BIM et coordination | Bimurix Québec", "BIM modelling and coordination | Bimurix Quebec"),
      description: l("Services de modélisation BIM en architecture, structure et MEP, coordination interdisciplinaire et contrôle qualité des modèles selon les exigences du projet.", "BIM modelling services in architecture, structure and MEP, interdisciplinary coordination and model quality control to project requirements."),
    },
  },
  {
    _id: "service-tqc",
    _type: "service",
    visible: true,
    order: 60,
    code: "Q-06",
    network: "tqc",
    title: l("TQC et contrôle qualité", "As-built and quality control"),
    slug: l("services/tqc-controle-qualite", "services/as-built-quality-control"),
    cardTitle: l("Des livrables finaux cohérents et documentés", "Consistent, documented final deliverables"),
    cardText: l(
      "Mise à jour des modèles et documents à partir des informations validées du chantier, avec des contrôles de cohérence et de complétude.",
      "Updating models and documents from validated site information, with consistency and completeness checks.",
    ),
    cardLinkLabel: l("Découvrir les TQC et le contrôle qualité", "Explore as-built and QC"),
    heroHeading: l("Des livrables finaux cohérents avec les informations du chantier.", "Final deliverables consistent with site information."),
    heroIntro: l(
      "Bimurix soutient la préparation des documents et modèles tel que construit à partir des relevés, annotations, changements approuvés et informations transmis par les équipes responsables du projet.",
      "Bimurix supports the preparation of as-built documents and models from surveys, mark-ups, approved changes and information provided by the project's responsible teams.",
    ),
    // Pour qui : document v3.1 §4 (entrepreneurs qui livrent un modèle tel que construit) et clientèles de l'accueil d'origine.
    audience: l(
      "Entrepreneurs généraux et entrepreneurs mécaniques qui livrent un modèle tel que construit, firmes de génie-conseil et propriétaires qui préparent la remise finale d'un projet.",
      "General contractors and mechanical contractors who deliver an as-built model, engineering firms and owners preparing a project's final handover.",
    ),
    responsibilityNote: l(
      "Bimurix prépare les documents et modèles tel que construit à partir des informations reçues. La conception, les calculs, l'approbation, la signature et le sceau restent à l'ingénieur ou à l'entrepreneur.",
      "Bimurix prepares the as-built documents and models from the information received. Design, calculations, approval, and the signature and seal remain with the engineer or the contractor.",
    ),
    heroCta: internalCta(l("Discuter de vos livrables TQC", "Discuss your as-built deliverables"), quote, "primary", "service-tqc"),
    offeringsHeading: l("Services", "Services"),
    offerings: keyed([
      titled(l("Mise à jour des modèles", "Model updates"), l("Intégration des modifications documentées et validées dans les modèles concernés, selon le périmètre du mandat.", "Integrating documented, validated changes into the relevant models, within the mandate's scope.")),
      titled(l("Mise à jour des plans", "Drawing updates"), l("Révision des plans et vues pour refléter les changements confirmés et les informations disponibles.", "Revising drawings and views to reflect confirmed changes and available information.")),
      titled(l("Intégration des informations terrain", "Site information integration"), l("Organisation et intégration des relevés, annotations, photos référencées et autres données fournies lorsque leur utilisation est prévue au mandat.", "Organising and integrating surveys, mark-ups, referenced photos and other data provided, when the mandate calls for them.")),
      titled(l("Vérification de cohérence", "Consistency checks"), l("Comparaison des modèles, plans, nomenclatures et documents dans les limites des informations reçues.", "Comparing models, drawings, schedules and documents within the limits of the information received.")),
      titled(l("Préparation du dossier de remise", "Handover package preparation"), l("Organisation des fichiers, versions et documents convenus pour la livraison finale.", "Organising the agreed files, versions and documents for final delivery.")),
    ]),
    deliverablesHeading: l("Informations nécessaires", "Information we need"),
    deliverables: keyed([
      l("Modèles et plans de référence", "Reference models and drawings"),
      l("Relevés et annotations de chantier", "Site surveys and mark-ups"),
      l("Liste des modifications approuvées", "List of approved changes"),
      l("Exigences de remise et conventions de nommage", "Handover requirements and naming conventions"),
      l("Formats de fichiers attendus", "Expected file formats"),
      l("Règles de validation et responsabilités d'approbation", "Validation rules and approval responsibilities"),
    ]),
    deliverablesNote: l("La qualité d'un dossier tel que construit dépend de la qualité et de l'exhaustivité des informations terrain fournies. Un élément n'est jamais présenté comme vérifié sur chantier sans données ou vérification appropriées.", "The quality of an as-built package depends on the quality and completeness of the site information provided. Nothing is presented as site-verified without appropriate data or verification."),
    methodHeading: l("Notre démarche", "Our process"),
    methodSteps: keyed([
      l("Inventorier les documents et informations reçus", "Inventory the documents and information received"),
      l("Identifier les données manquantes ou ambiguës", "Identify missing or ambiguous data"),
      l("Intégrer les changements confirmés", "Integrate confirmed changes"),
      l("Vérifier la cohérence des livrables selon les critères convenus", "Check deliverable consistency against agreed criteria"),
      l("Remettre les fichiers et signaler les réserves restantes", "Deliver the files and flag remaining reservations"),
    ]),
    ctaHeading: l("Vous préparez la remise finale d'un projet ?", "Preparing a project's final handover?"),
    ctaText: l("Présentez-nous vos exigences TQC, les disciplines concernées et les documents disponibles.", "Tell us your as-built requirements, the disciplines involved and the documents available."),
    ctaButton: internalCta(l("Demander une soumission TQC", "Request an as-built quote"), quote, "primary", "service-tqc"),
    titleBlock: { sheet: "S-06", revision: "0", date: "2026-11" },
    seo: {
      title: l("Documentation TQC et plans tel que construit | Bimurix", "As-built documentation and drawings | Bimurix"),
      description: l("Mise à jour de modèles et documents BIM tel que construit, intégration des informations de chantier et vérification des livrables finaux.", "As-built BIM model and document updates, site information integration and final deliverable checks."),
    },
  },
];
