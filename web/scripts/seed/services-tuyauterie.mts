import { callCta, keyed, l, titled } from "./helpers.mts";

// N4 — offre 1. Source : docs/source/2026-11-04_offres-v3-1/offres-bim-v3-1.md §1 (ADR-006). EN : traduction à relire.
// Aucun élément « hypothèse à valider » (60 $/spool, implantation, tarif régulier) : ADR-006 n° 3.
export const serviceTuyauterie = {
  _id: "service-prefabrication",
  _type: "service",
  visible: true,
  order: 10,
  code: "P-01",
  network: "plumb",
  title: l("Préfabrication de tuyauterie mécanique", "Mechanical piping prefabrication"),
  slug: l("services/prefabrication-tuyauterie", "services/piping-prefabrication"),
  cardTitle: l("Votre tuyauterie, prête à fabriquer en atelier", "Your piping, ready to build in the shop"),
  cardText: l(
    "Modélisation SysQue avec les pièces réelles du fabricant : dessins de spool, listes de coupe et de matériel, supports et parasismique coordonnés.",
    "SysQue modelling with the manufacturer's real parts: spool drawings, cut and material lists, coordinated hangers and seismic bracing.",
  ),
  cardLinkLabel: l("Voir l'offre tuyauterie", "See the piping offer"),
  heroHeading: l("Fabriquez votre tuyauterie en atelier, pas sur le chantier.", "Build your piping in the shop, not on the job site."),
  heroIntro: l(
    "À partir de vos dessins d'atelier approuvés, Bimurix modélise votre tuyauterie dans SysQue (Revit) avec les pièces réelles du fabricant. Vous recevez des spools, des listes de coupe et de matériel prêts pour l'atelier, en 5 jours ouvrables.",
    "From your approved shop drawings, Bimurix models your piping in SysQue (Revit) with the manufacturer's real parts. You get spools and cut and material lists ready for the shop, in 5 business days.",
  ),
  audience: l(
    "Entrepreneurs en mécanique du bâtiment et en plomberie (dont les membres de la CMMTQ) qui ont un atelier de préfabrication, fabricants de skids et constructeurs modulaires.",
    "Mechanical and plumbing contractors (including CMMTQ members) with a prefabrication shop, skid fabricators and modular builders.",
  ),
  responsibilityNote: l(
    "Bimurix modélise et coordonne selon les dessins et les calculs approuvés. La conception, les calculs (y compris parasismique), l'approbation, la signature et le sceau restent à l'ingénieur ou à l'entrepreneur.",
    "Bimurix models and coordinates from the approved drawings and calculations. Design, calculations (including seismic), approval, and the signature and seal remain with the engineer or the contractor.",
  ),
  heroCta: callCta("service-prefabrication"),
  offeringsHeading: l("Ce que couvre l'offre", "What the offer covers"),
  offerings: keyed([
    titled(l("Skids d'alimentation en eau", "Water supply skids"), l("Pompes, collecteurs d'aspiration et de refoulement, avec un cadre selon le dessin du fabricant ou de l'ingénieur.", "Pumps, suction and discharge headers, with a frame per the manufacturer's or engineer's drawing.")),
    titled(l("Chauffage et refroidissement", "Heating and cooling"), l("Eau chaude, eau refroidie et glycol.", "Hot water, chilled water and glycol.")),
    titled(l("Plomberie de tout type", "Plumbing of any type"), l("Toute canalisation de plomberie, modélisée à partir des dessins d'atelier approuvés.", "Any plumbing line, modelled from the approved shop drawings.")),
    titled(l("Pièces réelles du fabricant", "The manufacturer's real parts"), l("Raccords, vannes, accouplements et supports tirés du contenu fabricant de SysQue : les longueurs de coupe et les listes de matériel correspondent à ce que vous commandez.", "Fittings, valves, couplings and hangers from SysQue's manufacturer content: cut lengths and material lists match what you order.")),
    titled(l("Supports coordonnés", "Coordinated hangers"), l("Suspensions à tige, trapèzes, supports muraux et au sol, glissières, guides et ancrages, selon la canalisation et son diamètre, coordonnés avec la structure et les autres métiers.", "Rod hangers, trapezes, wall and floor supports, slides, guides and anchors, by pipe and diameter, coordinated with the structure and other trades.")),
    titled(l("Parasismique", "Seismic bracing"), l("Contreventements rigides modélisés et coordonnés selon les dessins et les calculs approuvés.", "Rigid bracing modelled and coordinated from the approved drawings and calculations.")),
  ]),
  deliverablesHeading: l("Ce que vous recevez", "What you receive"),
  deliverables: keyed([
    l("Modèle Revit SysQue", "SysQue Revit model"),
    l("Dessins de spool et d'assemblage numérotés", "Numbered spool and assembly drawings"),
    l("Listes de coupe et de matériel avec références du fabricant", "Cut and material lists with manufacturer references"),
    l("Export pour l'atelier", "Shop export"),
    l("Plans d'installation étiquetés", "Labelled installation drawings"),
    l("Étiquettes imprimables pour chaque spool et support", "Printable labels for each spool and hanger"),
    l("Plans couleur par système et par spool, lisibles sur tablette", "Colour drawings by system and spool, readable on a tablet"),
    l("Hauteurs de tiges calculées", "Calculated rod heights"),
  ]),
  deliverablesNote: l(
    "À la fin d'une zone pilote, vous recevez un bilan d'une page : pourcentage préfabriqué, nombre de spools et heures de modélisation.",
    "At the end of a pilot zone, you receive a one-page summary: prefabricated percentage, number of spools and modelling hours.",
  ),
  methodHeading: l("Comment ça marche", "How it works"),
  methodSteps: keyed([
    l("Appel de 20 minutes : on choisit la zone pilote, vos fabricants et le délai.", "20-minute call: we pick the pilot zone, your manufacturers and the lead time."),
    l("Vous envoyez les dessins d'atelier approuvés ou le modèle de l'ingénieur.", "You send the approved shop drawings or the engineer's model."),
    l("Vous recevez le paquet d'atelier en 5 jours ouvrables à partir de documents complets.", "You receive the shop package in 5 business days from complete documents."),
  ]),
  extraHeading: l("Ce dont nous avons besoin pour démarrer", "What we need to start"),
  extraItems: keyed([
    l("Les dessins d'atelier approuvés", "The approved shop drawings"),
    l("Le modèle de l'ingénieur ou les plans", "The engineer's model or drawings"),
    l("Les fabricants retenus (raccords, vannes, supports)", "The selected manufacturers (fittings, valves, hangers)"),
    l("Les standards de votre atelier", "Your shop standards"),
  ]),
  ctaHeading: l("Prêt à essayer sur une zone ?", "Ready to try it on one zone?"),
  ctaText: l("Réservez un appel de 20 minutes : on choisit la zone, vos fabricants et le délai.", "Book a 20-minute call: we pick the zone, your manufacturers and the lead time."),
  ctaButton: callCta("service-prefabrication"),
  titleBlock: { sheet: "S-01", revision: "0", date: "2026-11" },
  seo: {
    title: l("Préfabrication de tuyauterie SysQue | Bimurix", "SysQue piping prefabrication | Bimurix"),
    description: l(
      "Dessins de spool, listes de coupe et de matériel, supports et parasismique coordonnés, avec les pièces réelles du fabricant. Forfaits à prix fixe, livrés en 5 jours ouvrables. Grand Montréal.",
      "Spool drawings, cut and material lists, coordinated hangers and seismic bracing, with the manufacturer's real parts. Fixed-price packages delivered in 5 business days. Greater Montreal.",
    ),
  },
};
