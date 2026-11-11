import { block, callCta, keyed, l, titled } from "./helpers.mts";

// N4 — accueil (PLAN.md §3). Source : offres-bim-v3-1.md et maquette-page-atterrissage.png (contenu seulement).
// EN : traduction à relire. Aucun chiffre hors des prix de forfaits, des délais et des 2 chiffres sourcés (ADR-006 n° 21).
export const home = {
  _id: "page-home",
  _type: "page",
  kind: "home",
  title: l("Accueil", "Home"),
  titleBlock: { sheet: "A-000", revision: "0", date: "2026-11" },
  seo: {
    title: l("Préfabrication de tuyauterie et de gicleurs à prix fixe | Bimurix", "Fixed-price piping and sprinkler prefabrication | Bimurix"),
    description: l(
      "Dessins de spool, listes de coupe et dessins de gicleurs livrés en 5 jours ouvrables, à prix fixe. SysQue, AutoSPRINK et BIM 7D pour les entrepreneurs du Grand Montréal.",
      "Spool drawings, cut lists and sprinkler drawings delivered in 5 business days, at a fixed price. SysQue, AutoSPRINK and BIM 7D for contractors in Greater Montreal.",
    ),
  },
  sections: [
    block("heroSheet", {
      heading: l("Fabriquez votre tuyauterie en atelier, pas sur le chantier.", "Build your piping in the shop, not on the job site."),
      intro: l(
        "À partir de vos dessins d'atelier approuvés, Bimurix modélise votre tuyauterie dans SysQue avec les pièces réelles du fabricant, supports et parasismique compris, et produit vos dessins de gicleurs dans AutoSPRINK. Spools, listes de coupe et étiquettes livrés en 5 jours ouvrables.",
        "From your approved shop drawings, Bimurix models your piping in SysQue with the manufacturer's real parts, hangers and seismic bracing included, and produces your sprinkler drawings in AutoSPRINK. Spools, cut lists and labels delivered in 5 business days.",
      ),
      ctas: keyed([callCta(), { label: l("Voir les forfaits", "See the packages"), style: "secondary", link: { kind: "external", external: "#forfaits" } }]),
      specialties: l("Grand Montréal · Français et anglais", "Greater Montreal · French and English"),
    }),
    block("proof", {
      enabled: true,
      heading: l("Ce que donne la préfabrication, selon un entrepreneur", "What prefabrication delivers, according to one contractor"),
      figures: keyed([
        { value: "≈ 90 %", label: l("de préfabrication", "prefabricated") },
        { value: "≈ 15 %", label: l("d'économies globales", "in overall savings") },
      ]),
      attribution: l(
        "Résultats publiés par l'entrepreneur J.M. Brennan, avec SysQue. Ce ne sont pas des résultats de Bimurix.",
        "Results published by contractor J.M. Brennan, using SysQue. These are not Bimurix results.",
      ),
      sourceName: "Étude de cas Trimble MEP",
      sourceUrl: "https://www.casestudies.com/company/trimble-mep/case-study/15-cost-savings-with-streamlined-bim-workflow",
    }),
    block("packages", {
      heading: l("Commencez petit, à prix fixe.", "Start small, at a fixed price."),
      intro: l("Un livrable clair, un délai, un prix.", "A clear deliverable, a lead time, a price."),
      showTaxNote: true,
    }),
    block("conditions", { heading: l("Conditions des forfaits de lancement", "Launch package conditions") }),
    block("serviceNetworks", { heading: l("Les 4 offres", "The four offers") }),
    block("pointsList", {
      heading: l("Inclus pour l'atelier et le chantier", "Included for the shop and the site"),
      layout: "list",
      items: keyed([
        titled(l("Spools numérotés et dessins de spool", "Numbered spools and spool drawings"), l("Chaque spool a son numéro et son dessin.", "Each spool has its number and its drawing.")),
        titled(l("Listes de matériel exactes", "Exact material lists"), l("Longueurs exactes et numéros de pièces du fabricant, pour l'approvisionnement.", "Exact lengths and manufacturer part numbers, for purchasing.")),
        titled(l("Étiquettes imprimables", "Printable labels"), l("Pour chaque spool et chaque support.", "For each spool and each hanger.")),
        titled(l("Plans couleur sur tablette", "Colour drawings on a tablet"), l("Par système et par spool, lisibles au chantier.", "By system and by spool, readable on site.")),
        titled(l("Hauteurs de tiges calculées", "Calculated rod heights"), l("Les longueurs de tiges figurent dans les listes de matériel.", "Rod lengths appear in the material lists.")),
      ]),
    }),
    block("method", {
      heading: l("Comment ça marche", "How it works"),
      steps: keyed([
        titled(l("Appel de 20 minutes", "20-minute call"), l("On choisit la zone pilote, vos fabricants et le délai.", "We pick the pilot zone, your manufacturers and the lead time.")),
        titled(l("Vous envoyez vos documents", "You send your documents"), l("Les dessins d'atelier approuvés ou le modèle de l'ingénieur.", "The approved shop drawings or the engineer's model.")),
        titled(l("Vous recevez le paquet d'atelier", "You receive the shop package"), l("En 5 jours ouvrables à partir de documents complets, puis un bilan d'une page pour votre direction.", "In 5 business days from complete documents, then a one-page summary for your management.")),
      ]),
    }),
    block("faq", {
      heading: l("Questions fréquentes", "Frequently asked questions"),
      items: keyed([
        { question: l("Faut-il avoir SysQue ?", "Do we need SysQue?"), answer: l("Non. Vous recevez des PDF, des listes Excel et des étiquettes. Le modèle Revit est inclus si vous le voulez.", "No. You receive PDFs, Excel lists and labels. The Revit model is included if you want it.") },
        { question: l("Qui conçoit le parasismique ?", "Who designs the seismic bracing?"), answer: l("Votre ingénieur. Bimurix modélise et coordonne les contreventements selon les dessins et les calculs approuvés.", "Your engineer. Bimurix models and coordinates the bracing from the approved drawings and calculations.") },
        { question: l("Qui signe les dessins ?", "Who signs the drawings?"), answer: l("Bimurix produit les dessins. L'approbation, la signature et le sceau restent à l'ingénieur ou à l'entrepreneur.", "Bimurix produces the drawings. Approval, signature and seal remain with the engineer or the contractor.") },
        { question: l("Quels fabricants ?", "Which manufacturers?"), answer: l("Ceux que vous utilisez déjà, pour les raccords, les vannes et les supports, grâce au contenu fabricant de SysQue.", "The ones you already use, for fittings, valves and hangers, thanks to SysQue's manufacturer content.") },
        { question: l("Et si un projet démarre vite ?", "What if a project starts fast?"), answer: l("Le délai standard est de 5 jours ouvrables après la réception de documents complets.", "The standard lead time is 5 business days after we receive complete documents.") },
        { question: l("Le prix inclut-il les taxes ?", "Do prices include taxes?"), answer: l("Non. Les prix sont en dollars canadiens, avant TPS et TVQ.", "No. Prices are in Canadian dollars, before GST and QST.") },
        { question: l("Le montant du forfait est-il perdu ?", "Is the package price lost?"), answer: l("Non. Il est déduit si vous commandez le reste du projet dans les 60 jours. Les conditions sont détaillées plus haut.", "No. It is deducted if you order the rest of the project within 60 days. The conditions are detailed above.") },
        { question: l("Quelle région desservez-vous ?", "Which area do you serve?"), answer: l("Le Grand Montréal. Nous travaillons en français et en anglais.", "Greater Montreal. We work in French and in English.") },
      ]),
    }),
    block("quoteCta", {
      heading: l("Prêt à essayer sur une zone ?", "Ready to try it on one zone?"),
      text: l("Réservez un appel de 20 minutes : on choisit la zone, vos fabricants et le délai.", "Book a 20-minute call: we pick the zone, your manufacturers and the lead time."),
      button: callCta(),
    }),
  ],
};
