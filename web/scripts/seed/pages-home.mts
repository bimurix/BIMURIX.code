import { block, internalCta, keyed, l, pt, titled } from "./helpers.mts";

// ADR-007 — accueil : contenu d'ORIGINE restauré (production, mot pour mot, même ordre), puis intégration des ajouts
// de la refonte N4 : forfaits, conditions, preuve (2 chiffres sourcés, ADR-006 n° 21), « Inclus pour l'atelier et le chantier », FAQ.
// La méthode « Comment ça marche » de N4 (avec l'appel de 20 minutes) fait double emploi avec la méthode d'origine : retirée.
const requestQuote = l("Demander une soumission", "Request a quote");

export const home = {
  _id: "page-home",
  _type: "page",
  kind: "home",
  title: l("Accueil", "Home"),
  titleBlock: { sheet: "A-000", revision: "0", date: "2026-11" },
  seo: {
    title: l("Services BIM au Québec | Bimurix", "BIM services in Quebec | Bimurix"),
    description: l(
      "Bimurix accompagne les équipes de construction en modélisation BIM, coordination architecture-structure-MEP, préfabrication mécanique, BIM 7D et documentation tel que construit.",
      "Bimurix supports construction teams with BIM modelling, architecture-structure-MEP coordination, mechanical prefabrication, BIM 7D and as-built documentation.",
    ),
  },
  sections: [
    block("heroSheet", {
      heading: l("Des modèles BIM fiables. Une construction mieux préparée.", "Reliable BIM models. Better-prepared construction."),
      intro: l(
        "Bimurix accompagne les professionnels de la construction dans la modélisation BIM, la coordination des systèmes du bâtiment, la préparation à la préfabrication et la structuration des données d'actifs.",
        "Bimurix supports construction professionals with BIM modelling, building systems coordination, prefabrication readiness and asset data structuring.",
      ),
      ctas: keyed([internalCta(requestQuote, "page-quote"), { label: l("Découvrir nos services", "Explore our services"), style: "secondary", link: { kind: "external", external: "#services" } }]),
      specialties: l("Architecture · Structure · MEP · Préfabrication · BIM 7D · TQC", "Architecture · Structure · MEP · Prefabrication · BIM 7D · As-built"),
    }),
    block("richText", {
      heading: l("Le BIM doit servir le chantier, pas seulement le modèle.", "BIM should serve the site, not just the model."),
      body: {
        fr: pt([
          ["normal", "Un modèle BIM apporte une réelle valeur lorsqu'il aide les équipes à mieux coordonner les disciplines, à anticiper les difficultés d'installation et à transmettre des informations fiables."],
          ["normal", "Bimurix intervient sur les modèles, les données et les livrables pour aider les équipes à travailler avec une information plus claire, mieux structurée et adaptée aux objectifs du projet."],
        ]),
        en: pt([
          ["normal", "A BIM model delivers real value when it helps teams coordinate disciplines, anticipate installation issues and pass on reliable information."],
          ["normal", "Bimurix works on models, data and deliverables so teams can rely on clearer, better-structured information suited to the project's goals."],
        ]),
      },
    }),
    block("serviceNetworks", { heading: l("Nos services", "Our services") }),
    // Ajouts de la refonte (document v3.1) : forfaits de lancement, conditions, preuve sourcée.
    block("packages", {
      heading: l("Commencez petit, à prix fixe.", "Start small, at a fixed price."),
      intro: l("Un livrable clair, un délai, un prix.", "A clear deliverable, a lead time, a price."),
      showTaxNote: true,
    }),
    block("conditions", { heading: l("Conditions des forfaits de lancement", "Launch package conditions") }),
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
    // Contenu d'origine (production).
    block("method", {
      heading: l("Une méthode claire, du besoin au livrable.", "A clear method, from need to deliverable."),
      steps: keyed([
        titled(l("Comprendre", "Understand"), l("Nous clarifions les exigences du projet, les disciplines concernées, les usages BIM, les formats attendus et les critères d'acceptation.", "We clarify project requirements, disciplines involved, BIM uses, expected formats and acceptance criteria.")),
        titled(l("Produire", "Produce"), l("Nous réalisons ou mettons à jour les modèles, les données et la documentation selon le périmètre convenu.", "We create or update models, data and documentation within the agreed scope.")),
        titled(l("Vérifier", "Check"), l("Nous contrôlons les éléments convenus : cohérence, paramètres, coordination, complétude et conformité aux exigences communiquées.", "We check the agreed items: consistency, parameters, coordination, completeness and compliance with the stated requirements.")),
        titled(l("Livrer", "Deliver"), l("Nous préparons les fichiers et documents convenus pour faciliter leur revue, leur utilisation par les équipes et leur intégration au processus du projet.", "We prepare the agreed files and documents for easy review, use by the teams and integration into the project process.")),
      ]),
    }),
    block("pointsList", {
      heading: l("Une approche axée sur la qualité des livrables.", "An approach focused on deliverable quality."),
      layout: "columns",
      items: keyed([
        titled(l("Coordination plus claire", "Clearer coordination"), l("Faciliter l'identification et le suivi des problèmes entre disciplines.", "Make it easier to identify and track issues between disciplines.")),
        titled(l("Préparation à l'installation", "Installation readiness"), l("Structurer les informations et les documents nécessaires à la préparation des réseaux mécaniques.", "Structure the information and documents needed to prepare mechanical networks.")),
        titled(l("Données mieux organisées", "Better-organised data"), l("Améliorer la cohérence et la complétude des paramètres selon les exigences définies.", "Improve parameter consistency and completeness against defined requirements.")),
        titled(l("Livrables traçables", "Traceable deliverables"), l("Clarifier les éléments vérifiés, les informations reçues et les livrables remis.", "Make clear what was checked, what was received and what was delivered.")),
      ]),
    }),
    block("pointsList", {
      heading: l("Un soutien BIM adapté aux équipes de construction.", "BIM support built for construction teams."),
      layout: "list",
      items: keyed([
        titled(l("Entrepreneurs généraux", "General contractors"), l("Soutien BIM pour la coordination, le suivi des livrables et la cohérence de l'information entre disciplines.", "BIM support for coordination, deliverable tracking and information consistency across disciplines.")),
        titled(l("Entrepreneurs MEP", "MEP contractors"), l("Soutien spécialisé pour les réseaux mécaniques, la plomberie, le chauffage, la préfabrication et la préparation des documents d'installation.", "Specialised support for mechanical networks, plumbing, heating, prefabrication and installation documents.")),
        titled(l("Firmes de génie-conseil", "Engineering firms"), l("Soutien à la production, à la coordination et à la vérification des modèles et informations BIM selon le mandat.", "Support producing, coordinating and checking BIM models and information within the mandate.")),
        titled(l("Fabricants et équipes de préfabrication", "Fabricators and prefab teams"), l("Préparation des informations et des documents nécessaires aux flux de fabrication convenus.", "Preparing the information and documents required by the agreed fabrication workflows.")),
        titled(l("Propriétaires et gestionnaires d'actifs", "Owners and asset managers"), l("Structuration des données et préparation des informations utiles à la livraison et à l'exploitation du bâtiment.", "Structuring data and preparing information for building handover and operations.")),
      ]),
    }),
    // Ajout de la refonte : questions fréquentes (aucune ne promet un appel).
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
    // Contenu d'origine (production) : les deux appels finaux.
    block("quoteCta", {
      heading: l("Une expertise BIM orientée vers les besoins réels du projet.", "BIM expertise focused on the project's real needs."),
      text: l(
        "Bimurix associe compréhension technique, rigueur documentaire et attention portée à la qualité des données. Chaque mandat commence par la clarification des besoins, des responsabilités, des informations disponibles et des critères de livraison.",
        "Bimurix combines technical understanding, documentation rigour and attention to data quality. Every mandate starts by clarifying needs, responsibilities, available information and delivery criteria.",
      ),
      button: internalCta(l("En savoir plus sur Bimurix", "More about Bimurix"), "page-about", "secondary"),
    }),
    block("quoteCta", {
      heading: l("Parlons de votre prochain projet.", "Let's talk about your next project."),
      text: l(
        "Vous avez besoin de soutien en modélisation BIM, coordination MEP, préfabrication, données d'actifs ou documentation TQC ? Présentez-nous votre projet et les livrables attendus.",
        "Need support with BIM modelling, MEP coordination, prefabrication, asset data or as-built documentation? Tell us about your project and the expected deliverables.",
      ),
      button: internalCta(requestQuote, "page-quote"),
    }),
  ],
};
