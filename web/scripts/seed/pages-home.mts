import { block, internalCta, keyed, l, ref, titled } from "./helpers.mts";
import { allResponsibilityRows, deliverableRows, engineerSentence, faqEntries } from "./v5-common.mts";
import { brennanProof } from "./v5-proof.mts";
import { homeScenarios } from "./v5-scenarios.mts";

// Plan de contenu v5 § 2b et § 3.1 (ADR-008) : accueil en 11 sections, de la question du lecteur à l'action.
// Les blocs « forfaits » et « conditions » ne sont plus posés (ils restent codés). Aucun prix ni délai fixe. Images : session S3b.
const requestQuote = l("Demander une soumission", "Request a quote");

export const needsList = [
  titled(l("Les plans ou le modèle de l'ingénieur", "The engineer's drawings or model")),
  titled(l("Les dessins d'atelier approuvés", "The approved shop drawings")),
  titled(l("Les fabricants retenus (raccords, vannes, supports)", "The selected manufacturers (fittings, valves, hangers)")),
  titled(l("Les standards de votre atelier", "Your shop standards")),
  titled(l("Les exigences de remise du propriétaire", "The owner's handover requirements")),
];

const problem = (title: [string, string], text: [string, string], services: string[]) => ({ title: l(...title), text: l(...text), services: keyed(services.map((s) => ref(s))) });

export const home = {
  _id: "page-home",
  _type: "page",
  kind: "home",
  title: l("Accueil", "Home"),
  titleBlock: { sheet: "A-000", revision: "0", date: "2026-11" },
  seo: {
    title: l("Services BIM au Québec | Bimurix", "BIM services in Quebec | Bimurix"),
    description: l(
      "Bimurix modélise, coordonne et dessine : modèles BIM, détection de conflits, dessins d'atelier de tuyauterie et de gicleurs, plans tel que construit et données d'actifs. Grand Montréal.",
      "Bimurix models, coordinates and draws: BIM models, clash detection, piping and sprinkler shop drawings, as-built drawings and asset data. Greater Montreal.",
    ),
  },
  sections: [
    block("heroSheet", {
      heading: l("Des modèles BIM fiables. Moins de surprises au chantier.", "Reliable BIM models. Fewer surprises on site."),
      intro: l(
        "Bimurix modélise, coordonne et dessine pour les entrepreneurs, les firmes de génie-conseil et les propriétaires. Les conflits se règlent au modèle. La tuyauterie et les gicleurs arrivent prêts à fabriquer. Les plans tel que construit et les données sont prêts à remettre.",
        "Bimurix models, coordinates and draws for contractors, engineering firms and owners. Clashes are resolved in the model. Piping and sprinklers arrive ready to fabricate. As-built drawings and data are ready to hand over.",
      ),
      ctas: keyed([internalCta(requestQuote, "page-quote"), { label: l("Voir les six services", "See the six services"), style: "secondary", link: { kind: "external", external: "#services" } }]),
      specialties: l("Modéliser et coordonner · Préfabriquer · Livrer et exploiter", "Model and coordinate · Prefabricate · Deliver and operate"),
    }),
    block("problems", {
      heading: l("Les problèmes qu'on règle avant le chantier.", "The problems we solve before the site."),
      intro: l(
        "Un modèle BIM vaut ce qu'il apporte au chantier : moins de conflits entre les corps de métier, moins d'imprévus à l'installation, des informations fiables à la remise. Pour les directeurs de construction, les chargés de projet, les estimateurs, les entrepreneurs généraux et spécialisés, les firmes de génie-conseil et les propriétaires.",
        "A BIM model is worth what it brings to the site: fewer clashes between trades, fewer surprises at installation, reliable information at handover. For construction directors, project managers, estimators, general and specialty contractors, engineering firms and owners.",
      ),
      items: keyed([
        problem(["Les tuyaux, les gicleurs et les conduits se croisent au même endroit.", "Pipes, sprinklers and ducts cross in the same place."], ["On détecte les conflits au modèle et on les règle en réunion de coordination, avant l'installation.", "We detect the clashes in the model and resolve them in the coordination meeting, before installation."], ["service-modelisation", "service-combinee"]),
        problem(["Le chantier perd du temps à mesurer et à couper sur place.", "The site loses time measuring and cutting on the spot."], ["La tuyauterie se fabrique en atelier, avec des spools numérotés et des listes de coupe.", "Piping is built in the shop, with numbered spools and cut lists."], ["service-prefabrication"]),
        problem(["Vos dessinateurs de gicleurs sont débordés.", "Your sprinkler drafters are swamped."], ["Nous dessinons étage par étage, dans AutoSPRINK.", "We draw floor by floor, in AutoSPRINK."], ["service-gicleurs"]),
        problem(["Deux fournisseurs, deux modèles, des allers-retours.", "Two suppliers, two models, back-and-forth."], ["Un seul interlocuteur pour la tuyauterie et les gicleurs.", "One contact for piping and sprinklers."], ["service-combinee"]),
        problem(["Les plans de remise montrent la conception, pas ce qui a été construit.", "The handover drawings show the design, not what was built."], ["Nous intégrons les demandes de changement et les relevés de chantier.", "We integrate the change orders and the site surveys."], ["service-tqc"]),
        problem(["Le propriétaire exige des données d'équipements à la remise.", "The owner requires equipment data at handover."], ["Nous structurons, vérifions et signalons ce qui manque.", "We structure, check and flag what is missing."], ["service-bim-7d"]),
      ]),
    }),
    block("serviceNetworks", { heading: l("Six services, du modèle à l'exploitation.", "Six services, from the model to operations.") }),
    block("projectCycle", {
      heading: l("Où Bimurix intervient dans votre projet.", "Where Bimurix steps into your project."),
      intro: l(
        "Du modèle de conception à la remise du bâtiment, chaque service prend la suite du précédent. Un mandat peut couvrir une étape ou plusieurs.",
        "From the design model to building handover, each service picks up where the previous one ends. A mandate can cover one stage or several.",
      ),
      summary: l(
        "Les six services de Bimurix dans l'ordre d'un projet : modélisation et coordination BIM, puis tuyauterie et plomberie, gicleurs et coordination tuyauterie et gicleurs, puis données d'actifs et tel que construit.",
        "Bimurix's six services in project order: BIM modelling and coordination, then piping and plumbing, sprinklers and piping and sprinkler coordination, then asset data and as-built.",
      ),
    }),
    block("deliverables", {
      heading: l("Ce que vous recevez, et à quoi ça sert.", "What you receive, and what it is for."),
      items: deliverableRows([
        [["Rapports ou listes de conflits", "Clash reports and lists"], ["à décider en réunion de coordination qui déplace quoi", "to decide in the coordination meeting who moves what"]],
        [["Dessins de spool et d'assemblage numérotés", "Numbered spool and assembly drawings"], ["à ce que l'atelier fabrique chaque pièce sans ambiguïté", "so the shop builds each piece without ambiguity"]],
        [["Listes de coupe et de matériel avec références du fabricant", "Cut and material lists with manufacturer references"], ["à couper et à commander les bonnes pièces", "to cut and order the right parts"]],
        [["Étiquettes imprimables pour chaque spool et support", "Printable labels for each spool and hanger"], ["à repérer chaque pièce à la réception et à l'installation", "to identify each piece on receiving and at installation"]],
        [["Dessins d'atelier de gicleurs", "Sprinkler shop drawings"], ["à fabriquer et à installer, après approbation par l'ingénieur ou l'entrepreneur", "to fabricate and install, once approved by the engineer or the contractor"]],
        [["Modèles et plans tel que construit mis à jour", "Updated as-built models and drawings"], ["à remettre au propriétaire ce qui est réellement installé", "to hand the owner what is actually installed"]],
        [["Rapport Excel des données manquantes ou erronées", "Excel report of missing or wrong data"], ["à savoir quoi compléter avant la remise", "to know what to complete before handover"]],
        [["Dossier de remise (fichiers, versions, documents)", "Handover package (files, versions, documents)"], ["à retrouver chaque document sans fouiller", "to find each document without digging"]],
      ]),
    }),
    block("scenarios", {
      heading: l("Trois situations types de chantier.", "Three typical site situations."),
      note: l("Ce sont des situations types, pas des projets réalisés.", "These are typical situations, not completed projects."),
      items: homeScenarios(),
    }),
    block("proof", brennanProof()),
    block("responsibilityTable", { heading: l("Qui fait quoi.", "Who does what."), rows: allResponsibilityRows(), note: engineerSentence }),
    block("method", {
      heading: l("Comment se déroule un mandat.", "How a mandate unfolds."),
      steps: keyed([
        titled(l("Vous demandez une soumission", "You request a quote"), l("Dites-nous le projet, la discipline et ce que vous voulez recevoir. Nous vous répondons d'ici un jour ouvrable.", "Tell us the project, the discipline and what you want to receive. We reply within one business day.")),
        titled(l("Nous clarifions la portée", "We clarify the scope"), l("Exigences du projet, disciplines, formats attendus et critères d'acceptation.", "Project requirements, disciplines, expected formats and acceptance criteria.")),
        titled(l("Nous produisons et nous vérifions", "We produce and we check"), l("Modèles, dessins et données ; cohérence, paramètres, coordination et complétude.", "Models, drawings and data; consistency, parameters, coordination and completeness.")),
        titled(l("Nous livrons", "We deliver"), l("Les fichiers et documents convenus, avec la liste des points à confirmer.", "The agreed files and documents, with the list of points to confirm.")),
      ]),
    }),
    block("pointsList", { heading: l("Ce qu'il faut nous envoyer", "What to send us"), layout: "list", items: keyed(needsList) }),
    block("faq", {
      heading: l("Questions fréquentes", "Frequently asked questions"),
      items: faqEntries("sysque", "seismic", "signs", "makers", "documents", "price", "soon", "region"),
    }),
    block("quoteCta", {
      heading: l("Envoyez-nous votre projet.", "Send us your project."),
      text: l(
        "Dites-nous la discipline, les plans disponibles et ce que vous voulez recevoir : modèle, dessins d'atelier, plans tel que construit ou données d'actifs.",
        "Tell us the discipline, the drawings available and what you want to receive: model, shop drawings, as-built drawings or asset data.",
      ),
      button: internalCta(requestQuote, "page-quote"),
    }),
  ],
};
