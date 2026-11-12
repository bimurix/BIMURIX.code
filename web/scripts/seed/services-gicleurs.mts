import { quoteCta, keyed, l, titled } from "./helpers.mts";

// N4 — offre 2. Source : offres-bim-v3-1.md §2 (ADR-006). EN : traduction à relire. Aucun tarif « à la tête » (ADR-006 n° 3).
export const serviceGicleurs = {
  _id: "service-gicleurs",
  _type: "service",
  visible: true,
  order: 30,
  code: "G-03",
  network: "plumb",
  title: l("Préfabrication de gicleurs", "Sprinkler prefabrication"),
  slug: l("services/prefabrication-gicleurs", "services/sprinkler-prefabrication"),
  cardTitle: l("Des dessins de gicleurs quand vos dessinateurs manquent", "Sprinkler drawings when your drafters are stretched"),
  cardText: l(
    "Dessins d'atelier, listes de coupe et supports d'un étage dans AutoSPRINK, avec export Revit et NWC.",
    "Shop drawings, cut lists and hangers for a floor in AutoSPRINK, with Revit and NWC export.",
  ),
  cardLinkLabel: l("Voir l'offre gicleurs", "See the sprinkler offer"),
  heroHeading: l("Des dessins d'atelier de gicleurs, livrés en 5 jours ouvrables.", "Sprinkler shop drawings, delivered in 5 business days."),
  heroIntro: l(
    "Bimurix dessine vos étages de gicleurs dans AutoSPRINK : dessins d'atelier, listes de coupe et supports, avec un export Revit et NWC pour la coordination. Un renfort de dessin quand la pointe arrive.",
    "Bimurix draws your sprinkler floors in AutoSPRINK: shop drawings, cut lists and hangers, with a Revit and NWC export for coordination. Extra drafting capacity when the peak hits.",
  ),
  audience: l(
    "Entrepreneurs en gicleurs (protection incendie) qui manquent de dessinateurs en période de pointe.",
    "Sprinkler (fire protection) contractors who are short of drafters during peak periods.",
  ),
  responsibilityNote: l(
    "Bimurix produit les dessins. L'approbation et la signature restent à l'entrepreneur ou à son ingénieur, de même que la conception, les calculs (y compris parasismique) et le sceau.",
    "Bimurix produces the drawings. Approval and signature remain with the contractor or its engineer, as do design, calculations (including seismic) and the seal.",
  ),
  heroCta: quoteCta("service-gicleurs"),
  offeringsHeading: l("Ce que couvre l'offre", "What the offer covers"),
  offerings: keyed([
    titled(l("Dessins d'atelier", "Shop drawings"), l("Dessins d'atelier de gicleurs dans AutoSPRINK, étage par étage.", "Sprinkler shop drawings in AutoSPRINK, floor by floor.")),
    titled(l("Listes de coupe et de matériel", "Cut and material lists"), l("Prêtes pour la fabrication et l'approvisionnement.", "Ready for fabrication and purchasing.")),
    titled(l("Supports et parasismique", "Hangers and seismic bracing"), l("Supports et contreventements parasismiques coordonnés selon les dessins et les calculs approuvés.", "Hangers and seismic bracing coordinated from the approved drawings and calculations.")),
    titled(l("Un étage à la fois", "One floor at a time"), l("Le forfait d'entrée couvre un étage jusqu'à 10 000 pi². Au-delà : au nombre de têtes, sur soumission.", "The entry package covers one floor up to 10,000 sq. ft. Beyond that: by head count, on quote.")),
  ]),
  deliverablesHeading: l("Ce que vous recevez", "What you receive"),
  deliverables: keyed([
    l("Fichier AutoSPRINK", "AutoSPRINK file"),
    l("Export Revit ou NWC", "Revit or NWC export"),
    l("Dessins d'atelier", "Shop drawings"),
    l("Listes de coupe et de matériel", "Cut and material lists"),
    l("Supports et contreventements parasismiques coordonnés", "Coordinated hangers and seismic bracing"),
  ]),
  methodHeading: l("Comment ça marche", "How it works"),
  methodSteps: keyed([
    l("Vous demandez une soumission : étage à dessiner et délai souhaité.", "You request a quote: the floor to draw and the lead time you need."),
    l("Vous envoyez les plans ou le modèle de l'ingénieur et vos standards.", "You send the drawings or the engineer's model and your standards."),
    l("Vous recevez les dessins d'atelier en 5 jours ouvrables à partir de documents complets.", "You receive the shop drawings in 5 business days from complete documents."),
  ]),
  ctaHeading: l("Un étage à dessiner cette semaine ?", "A floor to draw this week?"),
  ctaText: l("Dites-nous l'étage à dessiner et le délai souhaité.", "Tell us the floor to draw and the lead time you need."),
  ctaButton: quoteCta("service-gicleurs"),
  titleBlock: { sheet: "S-03", revision: "0", date: "2026-11" },
  seo: {
    title: l("Dessins d'atelier de gicleurs AutoSPRINK | Bimurix", "AutoSPRINK sprinkler shop drawings | Bimurix"),
    description: l(
      "Dessins d'atelier, listes de coupe et supports d'un étage de gicleurs dans AutoSPRINK, livrés en 5 jours ouvrables à prix fixe. Grand Montréal.",
      "Shop drawings, cut lists and hangers for a sprinkler floor in AutoSPRINK, delivered in 5 business days at a fixed price. Greater Montreal.",
    ),
  },
};
