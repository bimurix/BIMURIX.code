import { keyed, l, titled } from "./helpers.mts";
import { deliverableRows, faqEntries, needs, responsibilityRows } from "./v5-common.mts";
import { brennanProof } from "./v5-proof.mts";
import { serviceScenarios } from "./v5-scenarios.mts";

// Plan de contenu v5 § 3.5 (ADR-008). Le rack multi-métiers reste non publié (ADR-006 n° 3). Aucun prix, forfait ni délai fixe.
export const serviceCombinee = {
  _id: "service-combinee",
  _type: "service",
  visible: true,
  order: 40,
  code: "C-04",
  network: "tqc",
  family: "prefabriquer",
  title: l("Coordination tuyauterie et gicleurs", "Piping and sprinkler coordination"),
  shortTitle: l("Tuyauterie + gicleurs", "Piping + sprinklers"),
  slug: l("services/tuyauterie-gicleurs-coordonnes", "services/coordinated-piping-sprinklers"),
  cardTitle: l("Un seul interlocuteur pour les deux disciplines", "One contact for both disciplines"),
  cardText: l(
    "Une zone modélisée en tuyauterie et en gicleurs, conflits réglés avant la fabrication, dessins d'atelier des deux.",
    "One zone modelled in piping and sprinklers, clashes resolved before fabrication, shop drawings for both.",
  ),
  cardLinkLabel: l("Voir la coordination tuyauterie et gicleurs", "See piping and sprinkler coordination"),
  heroHeading: l("Tuyauterie et gicleurs coordonnés avant la fabrication.", "Piping and sprinklers coordinated before fabrication."),
  heroIntro: l(
    "Une zone modélisée dans les deux disciplines, avec SysQue et AutoSPRINK. Les conflits sont réglés avant la fabrication et vous recevez les dessins d'atelier des deux. Un seul interlocuteur, moins d'allers-retours.",
    "One zone modelled in both disciplines, with SysQue and AutoSPRINK. Clashes are resolved before fabrication and you receive the shop drawings for both. One contact, fewer back-and-forths.",
  ),
  quoteButtonLabel: l("Demander une soumission tuyauterie + gicleurs", "Request a piping + sprinklers quote"),
  audience: l(
    "Entrepreneurs mécaniques qui font les deux disciplines, entrepreneurs généraux et constructeurs modulaires.",
    "Mechanical contractors who do both disciplines, general contractors and modular builders.",
  ),
  scenarios: serviceScenarios("com1", "com2"),
  responsibilityNote: l(
    "Bimurix modélise, coordonne et dessine. La conception, les calculs (y compris parasismique), l'approbation, la signature et le sceau restent à l'ingénieur ou à l'entrepreneur.",
    "Bimurix models, coordinates and draws. Design, calculations (including seismic), approval, and the signature and seal remain with the engineer or the contractor.",
  ),
  responsibilityRows: responsibilityRows("design", "approval", "models", "clashes", "supplied", "build"),
  offeringsHeading: l("Ce que nous faisons", "What we do"),
  offerings: keyed([
    titled(l("Une zone, deux disciplines", "One zone, two disciplines"), l("La tuyauterie dans SysQue et les gicleurs dans AutoSPRINK, dans le même modèle de coordination.", "Piping in SysQue and sprinklers in AutoSPRINK, in the same coordination model.")),
    titled(l("Détection de conflits avant la fabrication", "Clash detection before fabrication"), l("Les croisements entre tuyauterie, gicleurs et autres corps de métier sont détectés et réglés au modèle, pas sur le chantier.", "Crossings between piping, sprinklers and other trades are detected and resolved in the model, not on site.")),
    titled(l("Dessins d'atelier des deux disciplines", "Shop drawings for both disciplines"), l("Spools de tuyauterie et dessins de gicleurs issus du même modèle coordonné.", "Piping spools and sprinkler drawings from the same coordinated model.")),
    titled(l("Un seul interlocuteur", "One contact"), l("Un seul interlocuteur maîtrise les deux outils : moins d'allers-retours.", "One contact works in both tools: fewer back-and-forths.")),
  ]),
  deliverablesHeading: l("Ce que vous recevez", "What you receive"),
  deliverableRows: deliverableRows([
    [["Modèle coordonné de la zone", "Coordinated model of the zone"], ["à voir tuyauterie, gicleurs et autres corps de métier dans un seul modèle", "to see piping, sprinklers and the other trades in a single model"]],
    [["Dessins de spool de tuyauterie", "Piping spool drawings"], ["à fabriquer la tuyauterie en atelier", "to fabricate the piping in the shop"]],
    [["Dessins d'atelier de gicleurs", "Sprinkler shop drawings"], ["à fabriquer et à installer les gicleurs", "to fabricate and install the sprinklers"]],
    [["Listes de coupe et de matériel des deux disciplines", "Cut and material lists for both disciplines"], ["à commander et à fabriquer les deux réseaux d'un seul coup", "to order and fabricate both systems in one go"]],
  ]),
  needsHeading: l("Ce qu'il faut nous envoyer", "What to send us"),
  needs: needs([
    ["Les dessins d'atelier approuvés, le modèle de l'ingénieur ou les plans", "The approved shop drawings, the engineer's model or drawings"],
    ["Les fabricants retenus", "The selected manufacturers"],
    ["La zone à modéliser", "The zone to model"],
    ["Les modèles des autres corps de métier, s'ils existent", "The models of the other trades, if they exist"],
  ]),
  methodHeading: l("Comment ça se passe", "How it works"),
  methodSteps: keyed([
    l("Vous demandez une soumission : zone à modéliser et fabricants retenus.", "You request a quote: zone to model and selected manufacturers."),
    l("Vous envoyez les documents.", "You send the documents."),
    l("Nous coordonnons, nous vérifions, puis vous recevez les dessins des deux disciplines.", "We coordinate, we check, then you receive the drawings for both disciplines."),
  ]),
  proof: brennanProof(),
  faq: faqEntries("signs", "makers", "documents", "price"),
  ctaHeading: l("Deux disciplines à coordonner ?", "Two disciplines to coordinate?"),
  ctaText: l("Dites-nous la zone, les deux disciplines et vos fabricants.", "Tell us the zone, the two disciplines and your manufacturers."),
  titleBlock: { sheet: "S-04", revision: "0", date: "2026-11" },
  seo: {
    title: l("Coordination tuyauterie et gicleurs | Bimurix", "Piping and sprinkler coordination | Bimurix"),
    description: l(
      "Une zone modélisée en tuyauterie (SysQue) et en gicleurs (AutoSPRINK), conflits réglés avant la fabrication, dessins d'atelier des deux. Grand Montréal.",
      "One zone modelled in piping (SysQue) and sprinklers (AutoSPRINK), clashes resolved before fabrication, shop drawings for both. Greater Montreal.",
    ),
  },
};
