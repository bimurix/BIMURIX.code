import { callCta, keyed, l, titled } from "./helpers.mts";

// N4 — offre 4. Source : offres-bim-v3-1.md §4 (ADR-006). La mise en conformité (3 900 $) et le tarif à l'élément sont non publiés (n° 3).
export const service7d = {
  _id: "service-bim-7d",
  _type: "service",
  visible: true,
  order: 40,
  code: "D-04",
  network: "data",
  title: l("BIM 7D : données d'exploitation et de maintenance", "BIM 7D: operations and maintenance data"),
  slug: l("services/bim-7d-donnees-actifs", "services/bim-7d-asset-data"),
  cardTitle: l("Des données de modèle prêtes pour l'exploitation", "Model data ready for operations"),
  cardText: l(
    "Audit de votre modèle MEP et rapport des données manquantes ou erronées, élément par élément.",
    "Audit of your MEP model and a report of missing or wrong data, element by element.",
  ),
  cardLinkLabel: l("Voir l'offre BIM 7D", "See the BIM 7D offer"),
  heroHeading: l("Des données de modèle prêtes pour l'exploitation et la maintenance.", "Model data ready for operations and maintenance."),
  heroIntro: l(
    "Bimurix compare votre modèle MEP aux grilles de suivi du propriétaire et livre un rapport des données manquantes ou erronées, élément par élément. Audit en 3 jours ouvrables.",
    "Bimurix compares your MEP model to the owner's tracking grids and delivers a report of missing or wrong data, element by element. Audit in 3 business days.",
  ),
  audience: l(
    "Propriétaires institutionnels et gestionnaires d'actifs, entrepreneurs généraux et entrepreneurs mécaniques qui livrent un modèle tel que construit avec données, firmes d'ingénierie.",
    "Institutional owners and asset managers, general contractors and mechanical contractors who deliver an as-built model with data, engineering firms.",
  ),
  responsibilityNote: l(
    "Bimurix organise et vérifie les données du modèle, sans en inventer. Les champs non confirmés sont signalés comme manquants. La conception, les calculs et la validation professionnelle restent à l'ingénieur ou à l'entrepreneur.",
    "Bimurix organises and checks the model data without inventing any. Unconfirmed fields are flagged as missing. Design, calculations and professional validation remain with the engineer or the contractor.",
  ),
  heroCta: callCta("service-bim-7d"),
  offeringsHeading: l("Ce que couvre l'offre", "What the offer covers"),
  offerings: keyed([
    titled(l("Audit des données", "Data audit"), l("Votre modèle est comparé aux grilles de suivi du propriétaire ; les données manquantes ou erronées sont rapportées par élément.", "Your model is compared to the owner's tracking grids; missing or wrong data is reported per element.")),
    titled(l("Codification des équipements", "Equipment coding"), l("Un code unique selon la convention du projet : pompes, réservoirs, compteurs, chauffe-eau, panneaux radiants.", "A unique code per the project convention: pumps, tanks, meters, water heaters, radiant panels.")),
    titled(l("Numérotation des robinets", "Valve numbering"), l("Code d'équipement et code de système, selon l'abréviation du réseau.", "Equipment code and system code, per the network abbreviation.")),
    titled(l("Fonction et position des robinets", "Valve function and position"), l("Fonction et position normale selon le type : à bille, papillon, équilibrage, filtre, antirefoulement, réducteur de pression.", "Function and normal position by type: ball, butterfly, balancing, strainer, backflow preventer, pressure reducing.")),
    titled(l("Lien avec les dessins d'atelier", "Link to shop drawings"), l("Numéro de devis, description, code de système, quantité et nom du dessin révisé, tirés de vos livrables Procore.", "Spec number, description, system code, quantity and revised drawing name, taken from your Procore deliverables.")),
    titled(l("Local de chaque élément", "Room of each element"), l("Chaque élément est repéré dans sa pièce d'architecture, avec le numéro et le nom du local.", "Each element is located in its architectural room, with the room number and name.")),
  ]),
  deliverablesHeading: l("Ce que vous recevez", "What you receive"),
  deliverables: keyed([
    l("Rapport Excel des données manquantes ou erronées", "Excel report of missing or wrong data"),
    l("Détail par élément du modèle", "Detail per model element"),
  ]),
  deliverablesNote: l(
    "Aucune donnée n'est inventée : un champ non confirmé est signalé comme manquant.",
    "No data is ever invented: an unconfirmed field is flagged as missing.",
  ),
  methodHeading: l("Comment ça marche", "How it works"),
  methodSteps: keyed([
    l("Appel de 20 minutes : on confirme le modèle, la convention de codification et les grilles du propriétaire.", "20-minute call: we confirm the model, the coding convention and the owner's grids."),
    l("Vous envoyez le modèle, la convention de codification et les livrables de dessins d'atelier.", "You send the model, the coding convention and the shop drawing deliverables."),
    l("Vous recevez le rapport Excel en 3 jours ouvrables à partir de documents complets.", "You receive the Excel report in 3 business days from complete documents."),
  ]),
  ctaHeading: l("Un modèle à vérifier avant la remise ?", "A model to check before handover?"),
  ctaText: l("Réservez un appel de 20 minutes : on confirme le modèle et les grilles à comparer.", "Book a 20-minute call: we confirm the model and the grids to compare."),
  ctaButton: callCta("service-bim-7d"),
  titleBlock: { sheet: "S-04", revision: "0", date: "2026-11" },
  seo: {
    title: l("BIM 7D : audit des données de modèle | Bimurix", "BIM 7D: model data audit | Bimurix"),
    description: l(
      "Audit d'un modèle MEP et rapport Excel des données manquantes, livré en 3 jours ouvrables à prix fixe. Données d'exploitation et de maintenance. Grand Montréal.",
      "Audit of an MEP model and an Excel report of missing data, delivered in 3 business days at a fixed price. Operations and maintenance data. Greater Montreal.",
    ),
  },
};
