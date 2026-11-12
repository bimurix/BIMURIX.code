import { quoteCta, keyed, l, titled } from "./helpers.mts";

// N4 — offre 3. Source : offres-bim-v3-1.md §3 (ADR-006). Le rack multi-métiers et le prix « séparément » sont non publiés (n° 3).
export const serviceCombinee = {
  _id: "service-combinee",
  _type: "service",
  visible: true,
  order: 40,
  code: "C-04",
  network: "tqc",
  title: l("Tuyauterie et gicleurs coordonnés", "Coordinated piping and sprinklers"),
  slug: l("services/tuyauterie-gicleurs-coordonnes", "services/coordinated-piping-sprinklers"),
  cardTitle: l("Un seul interlocuteur pour les deux disciplines", "One contact for both disciplines"),
  cardText: l(
    "Une zone modélisée en tuyauterie et en gicleurs, conflits réglés avant la fabrication, dessins d'atelier des deux.",
    "One zone modelled in piping and sprinklers, clashes resolved before fabrication, shop drawings for both.",
  ),
  cardLinkLabel: l("Voir l'offre combinée", "See the combined offer"),
  heroHeading: l("Tuyauterie et gicleurs coordonnés avant la fabrication.", "Piping and sprinklers coordinated before fabrication."),
  heroIntro: l(
    "Une zone modélisée dans les deux disciplines, avec SysQue et AutoSPRINK. Les conflits sont réglés avant la fabrication et vous recevez les dessins d'atelier des deux. Un seul interlocuteur, moins d'allers-retours.",
    "One zone modelled in both disciplines, with SysQue and AutoSPRINK. Clashes are resolved before fabrication and you receive the shop drawings for both. One contact, fewer back-and-forths.",
  ),
  audience: l(
    "Entrepreneurs mécaniques qui font les deux disciplines, entrepreneurs généraux et constructeurs modulaires.",
    "Mechanical contractors who do both disciplines, general contractors and modular builders.",
  ),
  responsibilityNote: l(
    "Bimurix modélise, coordonne et dessine. La conception, les calculs (y compris parasismique), l'approbation, la signature et le sceau restent à l'ingénieur ou à l'entrepreneur.",
    "Bimurix models, coordinates and draws. Design, calculations (including seismic), approval, and the signature and seal remain with the engineer or the contractor.",
  ),
  heroCta: quoteCta("service-combinee"),
  offeringsHeading: l("Ce que couvre l'offre", "What the offer covers"),
  offerings: keyed([
    titled(l("Une zone, deux disciplines", "One zone, two disciplines"), l("La tuyauterie dans SysQue et les gicleurs dans AutoSPRINK, dans le même modèle de coordination.", "Piping in SysQue and sprinklers in AutoSPRINK, in the same coordination model.")),
    titled(l("Conflits réglés avant la fabrication", "Clashes resolved before fabrication"), l("Les croisements entre tuyauterie, gicleurs et autres métiers sont réglés au modèle, pas sur le chantier.", "Crossings between piping, sprinklers and other trades are resolved in the model, not on site.")),
    titled(l("Dessins d'atelier des deux disciplines", "Shop drawings for both disciplines"), l("Spools de tuyauterie et dessins de gicleurs issus du même modèle coordonné.", "Piping spools and sprinkler drawings from the same coordinated model.")),
    titled(l("Un seul interlocuteur", "One contact"), l("Un seul interlocuteur maîtrise les deux outils : moins d'allers-retours.", "One contact masters both tools: fewer back-and-forths.")),
  ]),
  deliverablesHeading: l("Ce que vous recevez", "What you receive"),
  deliverables: keyed([
    l("Modèle coordonné de la zone", "Coordinated model of the zone"),
    l("Dessins de spool de tuyauterie", "Piping spool drawings"),
    l("Dessins d'atelier de gicleurs", "Sprinkler shop drawings"),
    l("Listes de coupe et de matériel des deux disciplines", "Cut and material lists for both disciplines"),
  ]),
  methodHeading: l("Comment ça marche", "How it works"),
  methodSteps: keyed([
    l("Vous demandez une soumission : zone à modéliser et fabricants retenus.", "You request a quote: the zone to model and the selected manufacturers."),
    l("Vous envoyez les dessins d'atelier approuvés, le modèle de l'ingénieur ou les plans.", "You send the approved shop drawings, the engineer's model or drawings."),
    l("Vous recevez les dessins des deux disciplines en 7 jours ouvrables à partir de documents complets.", "You receive the drawings for both disciplines in 7 business days from complete documents."),
  ]),
  ctaHeading: l("Deux disciplines, une seule zone à essayer.", "Two disciplines, one zone to try."),
  ctaText: l("Dites-nous la zone à modéliser dans les deux disciplines et vos fabricants.", "Tell us the zone to model in both disciplines and your manufacturers."),
  ctaButton: quoteCta("service-combinee"),
  titleBlock: { sheet: "S-04", revision: "0", date: "2026-11" },
  seo: {
    title: l("Tuyauterie et gicleurs coordonnés | Bimurix", "Coordinated piping and sprinklers | Bimurix"),
    description: l(
      "Une zone modélisée en tuyauterie (SysQue) et en gicleurs (AutoSPRINK), conflits réglés avant la fabrication, dessins d'atelier des deux. Prix fixe, 7 jours ouvrables. Grand Montréal.",
      "One zone modelled in piping (SysQue) and sprinklers (AutoSPRINK), clashes resolved before fabrication, shop drawings for both. Fixed price, 7 business days. Greater Montreal.",
    ),
  },
};
