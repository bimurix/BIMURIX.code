import { internalCta, keyed, l, titled } from "./helpers.mts";

// ADR-007 : base = page d'origine « BIM 7D et données d'actifs » (production, mot pour mot) ; on y ADJOINT les éléments
// de offres-bim-v3-1.md §4 (6 prestations, 2 livrables de l'audit, pour qui, qui fait quoi). Le forfait Audit 7D (F-05) est dans packages.mts.
// La mise en conformité (3 900 $) et le tarif à l'élément restent non publiés (ADR-006 n° 3).
const quote = "page-quote";

export const service7d = {
  _id: "service-bim-7d",
  _type: "service",
  visible: true,
  order: 50,
  code: "D-05",
  network: "data",
  title: l("BIM 7D et données d'actifs", "BIM 7D and asset data"),
  slug: l("services/bim-7d-donnees-actifs", "services/bim-7d-asset-data"),
  cardTitle: l("Des données prêtes pour la livraison et l'exploitation", "Data ready for handover and operations"),
  cardText: l(
    "Structuration des paramètres, vérification de la complétude des informations et préparation des données d'équipements selon les exigences de remise du projet.",
    "Parameter structuring, information completeness checks and equipment data preparation to the project's handover requirements.",
  ),
  cardLinkLabel: l("Découvrir le BIM 7D", "Explore BIM 7D"),
  heroHeading: l("Des données BIM organisées pour faciliter la livraison du bâtiment.", "Organised BIM data for a smoother building handover."),
  heroIntro: l(
    "Bimurix aide à structurer, compléter et vérifier les informations associées aux équipements et aux actifs du bâtiment, en fonction des exigences de remise et des besoins d'exploitation définis par le client.",
    "Bimurix helps structure, complete and check the information attached to building equipment and assets, based on the handover requirements and operational needs defined by the client.",
  ),
  // Ajouts du document v3.1 §4 (pour qui) et des exclusions (qui fait quoi).
  audience: l(
    "Propriétaires institutionnels et gestionnaires d'actifs, entrepreneurs généraux et entrepreneurs mécaniques qui livrent un modèle tel que construit avec données, firmes d'ingénierie.",
    "Institutional owners and asset managers, general contractors and mechanical contractors who deliver an as-built model with data, engineering firms.",
  ),
  responsibilityNote: l(
    "Bimurix organise et vérifie les données du modèle, sans en inventer. Les champs non confirmés sont signalés comme manquants. La conception, les calculs et la validation professionnelle restent à l'ingénieur ou à l'entrepreneur.",
    "Bimurix organises and checks the model data without inventing any. Unconfirmed fields are flagged as missing. Design, calculations and professional validation remain with the engineer or the contractor.",
  ),
  heroCta: internalCta(l("Discuter de vos données BIM", "Discuss your BIM data"), quote, "primary", "service-bim-7d"),
  offeringsHeading: l("Services", "Services"),
  offerings: keyed([
    titled(l("Structuration des paramètres", "Parameter structuring"), l("Organisation des propriétés et paramètres selon les conventions, gabarits et exigences fournis.", "Organising properties and parameters to the conventions, templates and requirements provided.")),
    titled(l("Remplissage des données", "Data population"), l("Saisie ou intégration des informations d'actifs disponibles, dans les champs et formats convenus.", "Entering or importing available asset information into the agreed fields and formats.")),
    titled(l("Contrôle de complétude", "Completeness checks"), l("Identification des paramètres manquants, des valeurs incohérentes et des données nécessitant une confirmation.", "Identifying missing parameters, inconsistent values and data requiring confirmation.")),
    titled(l("Préparation des livrables", "Deliverable preparation"), l("Préparation des tableaux, nomenclatures, exports ou données associés à la remise BIM, selon les formats requis.", "Preparing tables, schedules, exports or data for the BIM handover, in the required formats.")),
    titled(l("Préparation à l'exploitation-maintenance", "Operations and maintenance readiness"), l("Organisation des informations nécessaires aux processus de gestion des actifs, selon les exigences du propriétaire ou du gestionnaire.", "Organising the information needed for asset management processes, to the owner's or manager's requirements.")),
    // Ajouts du document v3.1 §4.
    titled(l("Audit des données", "Data audit"), l("Votre modèle est comparé aux grilles de suivi du propriétaire ; les données manquantes ou erronées sont rapportées par élément.", "Your model is compared to the owner's tracking grids; missing or wrong data is reported per element.")),
    titled(l("Codification des équipements", "Equipment coding"), l("Un code unique selon la convention du projet : pompes, réservoirs, compteurs, chauffe-eau, panneaux radiants.", "A unique code per the project convention: pumps, tanks, meters, water heaters, radiant panels.")),
    titled(l("Numérotation des robinets", "Valve numbering"), l("Code d'équipement et code de système, selon l'abréviation du réseau.", "Equipment code and system code, per the network abbreviation.")),
    titled(l("Fonction et position des robinets", "Valve function and position"), l("Fonction et position normale selon le type : à bille, papillon, équilibrage, filtre, antirefoulement, réducteur de pression.", "Function and normal position by type: ball, butterfly, balancing, strainer, backflow preventer, pressure reducing.")),
    titled(l("Lien avec les dessins d'atelier", "Link to shop drawings"), l("Numéro de devis, description, code de système, quantité et nom du dessin révisé, tirés de vos livrables Procore.", "Spec number, description, system code, quantity and revised drawing name, taken from your Procore deliverables.")),
    titled(l("Local de chaque élément", "Room of each element"), l("Chaque élément est repéré dans sa pièce d'architecture, avec le numéro et le nom du local.", "Each element is located in its architectural room, with the room number and name.")),
  ]),
  deliverablesHeading: l("Exemples de données", "Example data"),
  deliverables: keyed([
    l("Identifiant ou code d'actif", "Asset ID or code"),
    l("Désignation et catégorie", "Description and category"),
    l("Fabricant et modèle, si connus", "Manufacturer and model, if known"),
    l("Numéro de série, lorsqu'il est disponible", "Serial number, when available"),
    l("Localisation dans le bâtiment", "Location in the building"),
    l("Informations de garantie, si fournies", "Warranty information, if provided"),
    l("Fréquences ou consignes de maintenance, si fournies et validées", "Maintenance frequencies or instructions, if provided and validated"),
    l("Références aux documents et manuels associés", "References to related documents and manuals"),
  ]),
  deliverablesNote: l(
    "Les données ne sont jamais inventées. Les champs non confirmés sont signalés comme manquants, à confirmer ou non applicables selon les règles du projet.",
    "Data is never invented. Unconfirmed fields are flagged as missing, to be confirmed or not applicable, following project rules.",
  ),
  methodHeading: l("Méthode de travail", "How we work"),
  methodSteps: keyed([
    l("Revoir les exigences d'information du client", "Review the client's information requirements"),
    l("Définir les paramètres et formats à utiliser", "Define the parameters and formats to use"),
    l("Intégrer les données fournies par les parties responsables", "Integrate data provided by the responsible parties"),
    l("Contrôler la complétude et la cohérence", "Check completeness and consistency"),
    l("Produire les exports et livrables convenus", "Produce the agreed exports and deliverables"),
  ]),
  // Ajout du document v3.1 §4 : ce que livre le forfait Audit 7D (délai et prix : bloc des forfaits).
  extraHeading: l("Ce que vous recevez avec l'audit 7D", "What you receive with the 7D audit"),
  extraItems: keyed([
    l("Rapport Excel des données manquantes ou erronées", "Excel report of missing or wrong data"),
    l("Détail par élément du modèle", "Detail per model element"),
  ]),
  ctaHeading: l("Vous devez compléter les paramètres de vos modèles BIM ?", "Need to complete your BIM model parameters?"),
  ctaText: l(
    "Indiquez les types d'actifs, le format du modèle, les exigences de remise et le volume approximatif de données.",
    "Tell us the asset types, model format, handover requirements and approximate data volume.",
  ),
  ctaButton: internalCta(l("Demander une soumission pour les données BIM", "Request a BIM data quote"), quote, "primary", "service-bim-7d"),
  titleBlock: { sheet: "S-05", revision: "0", date: "2026-11" },
  seo: {
    title: l("BIM 7D et données d'actifs du bâtiment | Bimurix", "BIM 7D and building asset data | Bimurix"),
    description: l(
      "Structuration des paramètres BIM, contrôle de la complétude des données d'équipements et préparation des informations pour la livraison et la gestion des actifs.",
      "BIM parameter structuring, equipment data completeness checks and information preparation for handover and asset management.",
    ),
  },
};
