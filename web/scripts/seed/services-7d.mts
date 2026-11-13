import { keyed, l, titled } from "./helpers.mts";
import { deliverableRows, faqEntries, needs, responsibilityRows } from "./v5-common.mts";
import { serviceScenarios } from "./v5-scenarios.mts";

// Plan de contenu v5 § 3.6 (ADR-008) : les 11 blocs deviennent 9, mêmes faits. Les rapports d'audit sont des livrables possibles (choix par défaut n° 16).
// La mise en conformité et le tarif à l'élément restent non publiés (ADR-006 n° 3). Aucun prix, forfait ni délai fixe.
export const service7d = {
  _id: "service-bim-7d",
  _type: "service",
  visible: true,
  order: 50,
  code: "D-05",
  network: "data",
  family: "livrer",
  title: l("Données d'actifs pour l'exploitation (BIM 7D)", "Asset data for operations (BIM 7D)"),
  shortTitle: l("Données d'actifs (BIM 7D)", "Asset data (BIM 7D)"),
  slug: l("services/bim-7d-donnees-actifs", "services/bim-7d-asset-data"),
  cardTitle: l("Des données prêtes pour la remise et l'exploitation", "Data ready for handover and operations"),
  cardText: l(
    "Paramètres structurés, complétude vérifiée, équipements codifiés, données prêtes pour les manuels d'exploitation et d'entretien et la maintenance.",
    "Structured parameters, completeness checked, equipment coded, data ready for the O&M manuals and maintenance.",
  ),
  cardLinkLabel: l("Voir les données d'actifs", "See asset data"),
  heroHeading: l("Des données d'équipements complètes à la remise du bâtiment.", "Complete equipment data at building handover."),
  heroIntro: l(
    "Bimurix structure, complète et vérifie les informations des équipements et des actifs du bâtiment, selon les exigences de remise et les besoins d'exploitation du client. Les données manquantes sont signalées, jamais inventées.",
    "Bimurix structures, completes and checks the information on the building's equipment and assets, based on the client's handover requirements and operational needs. Missing data is flagged, never invented.",
  ),
  quoteButtonLabel: l("Demander une soumission de données 7D", "Request a 7D data quote"),
  audience: l(
    "Propriétaires institutionnels et gestionnaires d'actifs, entrepreneurs généraux et entrepreneurs mécaniques qui livrent un modèle tel que construit avec données, firmes d'ingénierie.",
    "Institutional owners and asset managers, general contractors and mechanical contractors who deliver an as-built model with data, engineering firms.",
  ),
  scenarios: serviceScenarios("d1", "d2"),
  responsibilityNote: l(
    "Bimurix organise et vérifie les données du modèle, sans en inventer. Les champs non confirmés sont signalés comme manquants. La conception, les calculs et la validation professionnelle restent à l'ingénieur ou à l'entrepreneur.",
    "Bimurix organises and checks the model data without inventing any. Unconfirmed fields are flagged as missing. Design, calculations and professional validation remain with the engineer or the contractor.",
  ),
  responsibilityRows: responsibilityRows("design", "approval"),
  offeringsHeading: l("Ce que nous faisons", "What we do"),
  offerings: keyed([
    titled(l("Audit des données", "Data audit"), l("Votre modèle est comparé aux grilles de suivi du propriétaire ; les données manquantes ou erronées sont rapportées par élément.", "Your model is compared to the owner's tracking grids; missing or wrong data is reported per element.")),
    titled(l("Structuration des paramètres", "Parameter structuring"), l("Organisation des propriétés et paramètres selon les conventions, gabarits et exigences fournis.", "Organising properties and parameters to the conventions, templates and requirements provided.")),
    titled(l("Remplissage des données", "Data population"), l("Saisie ou intégration des informations d'actifs disponibles, dans les champs et formats convenus.", "Entering or importing available asset information into the agreed fields and formats.")),
    titled(l("Contrôle de complétude", "Completeness checks"), l("Identification des paramètres manquants, des valeurs incohérentes et des données nécessitant une confirmation.", "Identifying missing parameters, inconsistent values and data requiring confirmation.")),
    titled(l("Codification des équipements", "Equipment coding"), l("Un code unique selon la convention du projet : pompes, réservoirs, compteurs, chauffe-eau, panneaux radiants.", "A unique code per the project convention: pumps, tanks, meters, water heaters, radiant panels.")),
    titled(l("Robinets", "Valves"), l("Numéro, fonction et position normale selon le type : à bille, papillon, équilibrage, filtre, antirefoulement, réducteur de pression.", "Number, function and normal position by type: ball, butterfly, balancing, strainer, backflow preventer, pressure reducing.")),
    titled(l("Lien avec les dessins d'atelier", "Link to shop drawings"), l("Numéro de devis, description, code de système, quantité et nom du dessin révisé, tirés de vos livrables Procore.", "Spec number, description, system code, quantity and revised drawing name, taken from your Procore deliverables.")),
    titled(l("Local de chaque élément", "Room of each element"), l("Chaque élément est repéré dans sa pièce d'architecture, avec le numéro et le nom du local.", "Each element is located in its architectural room, with the room number and name.")),
    titled(l("Préparation à la remise et à l'exploitation-maintenance", "Handover and operations and maintenance readiness"), l("Tableaux, nomenclatures et exports selon les formats requis, et information organisée pour les processus de gestion des actifs du propriétaire ou du gestionnaire.", "Tables, schedules and exports in the required formats, and information organised for the owner's or manager's asset management processes.")),
  ]),
  deliverablesHeading: l("Ce que vous recevez", "What you receive"),
  deliverableRows: deliverableRows([
    [["Rapport Excel des données manquantes ou erronées, avec détail par élément", "Excel report of missing or wrong data, with detail per element"], ["à savoir quoi compléter avant la remise", "to know what to complete before handover"]],
    [["Données d'actifs : identifiant, désignation, fabricant et modèle, numéro de série, localisation, garantie, consignes d'entretien, références aux manuels d'exploitation et d'entretien", "Asset data: ID, description, manufacturer and model, serial number, location, warranty, maintenance instructions, references to the O&M manuals"], ["à ce que l'équipe d'exploitation retrouve chaque équipement et son entretien", "so the operations team can find each piece of equipment and its maintenance"]],
  ]),
  deliverablesNote: l(
    "Les données ne sont jamais inventées. Les champs non confirmés sont signalés comme manquants, à confirmer ou non applicables selon les règles du projet.",
    "Data is never invented. Unconfirmed fields are flagged as missing, to be confirmed or not applicable, following project rules.",
  ),
  needsHeading: l("Ce qu'il faut nous envoyer", "What to send us"),
  needs: needs([
    ["Le modèle (format)", "The model (format)"],
    ["La convention de codification du propriétaire", "The owner's coding convention"],
    ["Les grilles de suivi", "The tracking grids"],
    ["Les livrables de dessins d'atelier", "The shop drawing deliverables"],
    ["Le type et le nombre approximatif d'actifs", "The type and approximate number of assets"],
  ]),
  methodHeading: l("Comment ça se passe", "How it works"),
  methodSteps: keyed([
    l("Nous revoyons vos exigences d'information", "We review your information requirements"),
    l("Nous définissons les paramètres et les formats", "We define the parameters and formats"),
    l("Nous intégrons les données fournies par les parties responsables", "We integrate the data provided by the responsible parties"),
    l("Nous contrôlons la complétude et la cohérence", "We check completeness and consistency"),
    l("Nous produisons les exports et les livrables convenus", "We produce the agreed exports and deliverables"),
  ]),
  faq: faqEntries("documents", "price", "missing"),
  ctaHeading: l("Des données d'équipements à fournir à la remise ?", "Equipment data to provide at handover?"),
  ctaText: l(
    "Indiquez les types d'actifs, le format du modèle, les exigences de remise et le volume approximatif de données.",
    "Tell us the asset types, model format, handover requirements and approximate data volume.",
  ),
  titleBlock: { sheet: "S-05", revision: "0", date: "2026-11" },
  seo: {
    title: l("Données d'actifs du bâtiment (BIM 7D) | Bimurix", "Building asset data (BIM 7D) | Bimurix"),
    description: l(
      "Structuration des paramètres BIM, contrôle de la complétude des données d'équipements et préparation des informations pour la remise et la gestion des actifs.",
      "BIM parameter structuring, equipment data completeness checks and information preparation for handover and asset management.",
    ),
  },
};
