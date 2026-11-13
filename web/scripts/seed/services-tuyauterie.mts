import { keyed, l, titled } from "./helpers.mts";
import { deliverableRows, faqEntries, needs, responsibilityRows } from "./v5-common.mts";
import { brennanProof } from "./v5-proof.mts";
import { serviceScenarios } from "./v5-scenarios.mts";

// Plan de contenu v5 § 3.3 (ADR-008). Aucun prix, forfait ni délai fixe ; le bilan « zone pilote » est retiré (choix par défaut n° 8).
// Faits ajoutés depuis l'ancien texte « Préfabrication MEP » : coordination des parcours, contrôle des informations, isométriques, listes de points (n° 13).
export const serviceTuyauterie = {
  _id: "service-prefabrication",
  _type: "service",
  visible: true,
  order: 20,
  code: "H-02",
  network: "heat",
  family: "prefabriquer",
  title: l("Dessins d'atelier et préfabrication : tuyauterie et plomberie", "Shop drawings and prefabrication: piping and plumbing"),
  shortTitle: l("Tuyauterie et plomberie", "Piping and plumbing"),
  slug: l("services/prefabrication-tuyauterie", "services/piping-prefabrication"),
  cardTitle: l("Votre tuyauterie, prête à fabriquer en atelier", "Your piping, ready to build in the shop"),
  cardText: l(
    "Dessins d'atelier dans SysQue avec les pièces réelles du fabricant : spools, listes de coupe et de matériel, supports et contreventements parasismiques coordonnés.",
    "Shop drawings in SysQue with the manufacturer's real parts: spools, cut and material lists, coordinated hangers and seismic bracing.",
  ),
  cardLinkLabel: l("Voir la tuyauterie et la plomberie", "See piping and plumbing"),
  heroHeading: l("Fabriquez votre tuyauterie en atelier, pas sur le chantier.", "Build your piping in the shop, not on the job site."),
  heroIntro: l(
    "À partir de vos dessins d'atelier approuvés, Bimurix modélise votre tuyauterie dans SysQue (Revit) avec les pièces réelles du fabricant. Vous recevez des spools, des listes de coupe et de matériel prêts pour l'atelier. Les réseaux mécaniques sont préparés avant leur installation.",
    "From your approved shop drawings, Bimurix models your piping in SysQue (Revit) with the manufacturer's real parts. You get spools and cut and material lists ready for the shop. The mechanical systems are prepared before they are installed.",
  ),
  quoteButtonLabel: l("Demander une soumission de tuyauterie", "Request a piping quote"),
  audience: l(
    "Entrepreneurs en mécanique du bâtiment et en plomberie (dont les membres de la CMMTQ) qui ont un atelier de préfabrication, fabricants de skids et constructeurs modulaires.",
    "Mechanical and plumbing contractors (including CMMTQ members) with a prefabrication shop, skid fabricators and modular builders.",
  ),
  scenarios: serviceScenarios("tuy1", "tuy2"),
  responsibilityNote: l(
    "Bimurix modélise et coordonne selon les dessins et les calculs approuvés. La conception, les calculs (y compris parasismique), l'approbation, la signature et le sceau restent à l'ingénieur ou à l'entrepreneur.",
    "Bimurix models and coordinates from the approved drawings and calculations. Design, calculations (including seismic), approval, and the signature and seal remain with the engineer or the contractor.",
  ),
  responsibilityRows: responsibilityRows("design", "approval", "models", "supplied", "build"),
  offeringsHeading: l("Ce que nous faisons", "What we do"),
  offerings: keyed([
    titled(l("Skids d'alimentation en eau", "Water supply skids"), l("Pompes, collecteurs d'aspiration et de refoulement, avec un cadre selon le dessin du fabricant ou de l'ingénieur : le skid s'assemble en atelier.", "Pumps, suction and discharge headers, with a frame per the manufacturer's or engineer's drawing: the skid is assembled in the shop.")),
    titled(l("Chauffage et refroidissement", "Heating and cooling"), l("Eau chaude, eau refroidie et glycol.", "Hot water, chilled water and glycol.")),
    titled(l("Plomberie de tout type", "Plumbing of any type"), l("Toute canalisation de plomberie, modélisée à partir des dessins d'atelier approuvés.", "Any plumbing line, modelled from the approved shop drawings.")),
    titled(l("Pièces réelles du fabricant", "The manufacturer's real parts"), l("Raccords, vannes, accouplements et supports tirés du contenu fabricant de SysQue : les longueurs de coupe et les listes de matériel correspondent à ce que vous commandez.", "Fittings, valves, couplings and hangers from SysQue's manufacturer content: cut lengths and material lists match what you order.")),
    titled(l("Supports coordonnés", "Coordinated hangers"), l("Suspensions à tige, trapèzes, supports muraux et au sol, glissières, guides et ancrages, selon la canalisation et son diamètre, coordonnés avec la structure et les autres métiers.", "Rod hangers, trapezes, wall and floor supports, slides, guides and anchors, by pipe and diameter, coordinated with the structure and other trades.")),
    titled(l("Parasismique", "Seismic bracing"), l("Contreventements rigides modélisés et coordonnés selon les dessins et les calculs approuvés.", "Rigid bracing modelled and coordinated from the approved drawings and calculations.")),
    titled(l("Coordination des parcours", "Route coordination"), l("Vérification des parcours des réseaux avec les modèles et les contraintes des autres corps de métier, avant la fabrication.", "Checking system routes against the models and constraints of the other trades, before fabrication.")),
    titled(l("Contrôle des informations", "Information checks"), l("Vérification des dimensions, des raccords, des assemblages, des annotations et des propriétés.", "Checking dimensions, fittings, assemblies, annotations and properties.")),
  ]),
  deliverablesHeading: l("Ce que vous recevez", "What you receive"),
  deliverableRows: deliverableRows([
    [["Modèle Revit SysQue", "SysQue Revit model"], ["à garder la source des dessins et à la modifier au besoin", "to keep the source of the drawings and edit it when needed"]],
    [["Dessins de spool et d'assemblage numérotés", "Numbered spool and assembly drawings"], ["à ce que l'atelier fabrique chaque pièce sans ambiguïté", "so the shop builds each piece without ambiguity"]],
    [["Listes de coupe et de matériel avec références du fabricant", "Cut and material lists with manufacturer references"], ["à couper et à commander les bonnes pièces", "to cut and order the right parts"]],
    [["Export pour l'atelier", "Shop export"], ["à transmettre les données à l'atelier de fabrication", "to pass the data to the fabrication shop"]],
    [["Plans d'installation étiquetés", "Labelled installation drawings"], ["à ce que les installateurs sachent où va chaque spool", "so installers know where each spool goes"]],
    [["Étiquettes imprimables pour chaque spool et support", "Printable labels for each spool and hanger"], ["à repérer chaque pièce à la réception et à l'installation", "to identify each piece on receiving and at installation"]],
    [["Plans couleur par système et par spool, lisibles sur tablette", "Colour drawings by system and spool, readable on a tablet"], ["à lire l'installation au chantier", "to read the installation on site"]],
    [["Hauteurs de tiges calculées", "Calculated rod heights"], ["à couper les tiges d'après les listes de matériel", "to cut the rods from the material lists"]],
    [["Vues isométriques ou détails", "Isometric views or details"], ["à comprendre un assemblage d'un coup d'œil", "to understand an assembly at a glance"]],
    [["Listes de points à vérifier ou à résoudre", "Lists of points to check or resolve"], ["à régler les questions avant la fabrication", "to settle questions before fabrication"]],
  ]),
  deliverablesNote: l(
    "Les livrables dépendent des outils utilisés, des informations reçues et du processus de fabrication du client.",
    "Deliverables depend on the tools used, the information received and the client's fabrication process.",
  ),
  needsHeading: l("Ce qu'il faut nous envoyer", "What to send us"),
  needs: needs([
    ["Les dessins d'atelier approuvés", "The approved shop drawings"],
    ["Le modèle de l'ingénieur ou les plans", "The engineer's model or drawings"],
    ["Les fabricants retenus (raccords, vannes, supports)", "The selected manufacturers (fittings, valves, hangers)"],
    ["Les standards de votre atelier", "Your shop standards"],
    ["La zone ou les systèmes à préfabriquer", "The zone or systems to prefabricate"],
  ]),
  methodHeading: l("Comment ça se passe", "How it works"),
  methodSteps: keyed([
    l("Vous demandez une soumission : zone ou systèmes à préfabriquer, fabricants retenus, échéancier.", "You request a quote: zone or systems to prefabricate, selected manufacturers, schedule."),
    l("Vous envoyez les dessins d'atelier approuvés ou le modèle de l'ingénieur.", "You send the approved shop drawings or the engineer's model."),
    l("Nous modélisons, nous vérifions, puis vous recevez le dossier d'atelier.", "We model, we check, then you receive the shop drawing set."),
  ]),
  proof: brennanProof(),
  faq: faqEntries("sysque", "seismic", "signs", "makers"),
  ctaHeading: l("Une tuyauterie à préfabriquer ?", "Piping to prefabricate?"),
  ctaText: l("Dites-nous les systèmes, vos fabricants et l'échéancier.", "Tell us the systems, your manufacturers and your schedule."),
  titleBlock: { sheet: "S-02", revision: "0", date: "2026-11" },
  seo: {
    title: l("Dessins d'atelier de tuyauterie SysQue | Bimurix", "SysQue piping shop drawings | Bimurix"),
    description: l(
      "Dessins de spool, listes de coupe et de matériel, supports et contreventements parasismiques coordonnés, avec les pièces réelles du fabricant. Grand Montréal.",
      "Spool drawings, cut and material lists, coordinated hangers and seismic bracing, with the manufacturer's real parts. Greater Montreal.",
    ),
  },
};
