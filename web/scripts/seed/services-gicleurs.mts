import { keyed, l, titled } from "./helpers.mts";
import { deliverableRows, faqEntries, needs, responsibilityRows } from "./v5-common.mts";
import { serviceScenarios } from "./v5-scenarios.mts";

// Plan de contenu v5 § 3.4 (ADR-008). Aucun prix, forfait, superficie fixe ni délai fixe.
export const serviceGicleurs = {
  _id: "service-gicleurs",
  _type: "service",
  visible: true,
  order: 30,
  code: "G-03",
  network: "plumb",
  family: "prefabriquer",
  title: l("Dessins d'atelier : protection incendie (gicleurs)", "Shop drawings: fire protection (sprinklers)"),
  shortTitle: l("Gicleurs", "Sprinklers"),
  slug: l("services/prefabrication-gicleurs", "services/sprinkler-prefabrication"),
  cardTitle: l("Des dessins de gicleurs quand vos dessinateurs manquent", "Sprinkler drawings when your drafters are stretched"),
  cardText: l(
    "Dessins d'atelier, listes de coupe et supports, étage par étage, dans AutoSPRINK, avec export Revit et NWC.",
    "Shop drawings, cut lists and hangers, floor by floor, in AutoSPRINK, with Revit and NWC export.",
  ),
  cardLinkLabel: l("Voir les gicleurs", "See sprinklers"),
  heroHeading: l("Des dessins d'atelier de gicleurs quand vos dessinateurs manquent.", "Sprinkler shop drawings when your drafters are stretched."),
  heroIntro: l(
    "Bimurix dessine vos étages de gicleurs dans AutoSPRINK : dessins d'atelier, listes de coupe et supports, avec un export Revit et NWC pour la coordination. Un renfort de dessin quand la pointe arrive.",
    "Bimurix draws your sprinkler floors in AutoSPRINK: shop drawings, cut lists and hangers, with a Revit and NWC export for coordination. Extra drafting capacity when the peak hits.",
  ),
  quoteButtonLabel: l("Demander une soumission de gicleurs", "Request a sprinkler quote"),
  audience: l(
    "Entrepreneurs en gicleurs (protection incendie) qui manquent de dessinateurs en période de pointe.",
    "Sprinkler (fire protection) contractors who are short of drafters during peak periods.",
  ),
  scenarios: serviceScenarios("gic1", "gic2"),
  responsibilityNote: l(
    "Bimurix produit les dessins. L'approbation et la signature restent à l'entrepreneur ou à son ingénieur, de même que la conception, les calculs (y compris parasismique) et le sceau.",
    "Bimurix produces the drawings. Approval and signature remain with the contractor or its engineer, as do design, calculations (including seismic) and the seal.",
  ),
  responsibilityRows: responsibilityRows("design", "approval", "models", "supplied", "build"),
  offeringsHeading: l("Ce que nous faisons", "What we do"),
  offerings: keyed([
    titled(l("Dessins d'atelier", "Shop drawings"), l("Dessins d'atelier de gicleurs dans AutoSPRINK, étage par étage.", "Sprinkler shop drawings in AutoSPRINK, floor by floor.")),
    titled(l("Listes de coupe et de matériel", "Cut and material lists"), l("Prêtes pour la fabrication et l'approvisionnement.", "Ready for fabrication and purchasing.")),
    titled(l("Supports et parasismique", "Hangers and seismic bracing"), l("Supports et contreventements parasismiques coordonnés selon les dessins et les calculs approuvés.", "Hangers and seismic bracing coordinated from the approved drawings and calculations.")),
    titled(l("Étage par étage", "Floor by floor"), l("La portée se précise à la soumission : étages, superficie et nombre de têtes.", "The scope is set at quote time: floors, area and number of heads.")),
  ]),
  deliverablesHeading: l("Ce que vous recevez", "What you receive"),
  deliverableRows: deliverableRows([
    [["Fichier AutoSPRINK", "AutoSPRINK file"], ["à reprendre et à modifier les dessins dans votre propre outil", "to take over and edit the drawings in your own tool"]],
    [["Export Revit ou NWC", "Revit or NWC export"], ["à vérifier les croisements avec les autres corps de métier", "to check crossings with the other trades"]],
    [["Dessins d'atelier", "Shop drawings"], ["à fabriquer et à installer, après approbation par l'ingénieur ou l'entrepreneur", "to fabricate and install, once approved by the engineer or the contractor"]],
    [["Listes de coupe et de matériel", "Cut and material lists"], ["à fabriquer et à commander", "to fabricate and order"]],
    [["Supports et contreventements parasismiques coordonnés", "Coordinated hangers and seismic bracing"], ["à installer selon les calculs approuvés par l'ingénieur", "to install per the calculations approved by the engineer"]],
  ]),
  needsHeading: l("Ce qu'il faut nous envoyer", "What to send us"),
  needs: needs([
    ["Les plans ou le modèle de l'ingénieur", "The engineer's drawings or model"],
    ["Vos standards", "Your standards"],
    ["L'étage ou la zone à dessiner", "The floor or zone to draw"],
    ["Les fabricants retenus, s'ils sont imposés", "The selected manufacturers, if imposed"],
  ]),
  methodHeading: l("Comment ça se passe", "How it works"),
  methodSteps: keyed([
    l("Vous demandez une soumission : étage à dessiner et échéancier.", "You request a quote: the floor to draw and your schedule."),
    l("Vous envoyez les plans ou le modèle de l'ingénieur et vos standards.", "You send the drawings or the engineer's model and your standards."),
    l("Nous dessinons, nous vérifions, puis vous recevez les dessins d'atelier.", "We draw, we check, then you receive the shop drawings."),
  ]),
  faq: faqEntries("seismic", "signs", "documents", "price"),
  ctaHeading: l("Des gicleurs à dessiner ?", "Sprinklers to draw?"),
  ctaText: l("Dites-nous les étages à dessiner et l'échéancier.", "Tell us the floors to draw and your schedule."),
  titleBlock: { sheet: "S-03", revision: "0", date: "2026-11" },
  seo: {
    title: l("Dessins d'atelier de gicleurs AutoSPRINK | Bimurix", "AutoSPRINK sprinkler shop drawings | Bimurix"),
    description: l(
      "Dessins d'atelier, listes de coupe et supports de gicleurs, étage par étage, dans AutoSPRINK, avec export Revit et NWC. Grand Montréal.",
      "Sprinkler shop drawings, cut lists and hangers, floor by floor, in AutoSPRINK, with Revit and NWC export. Greater Montreal.",
    ),
  },
};
