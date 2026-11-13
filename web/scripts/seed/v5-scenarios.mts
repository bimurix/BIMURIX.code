import { keyed, l, ref } from "./helpers.mts";

// Plan de contenu v5 § 4 : deux situations types par service. Ce ne sont PAS des projets réalisés : aucun nom, aucun chiffre de gain.
// Les faits sur ce que fait Bimurix viennent des prestations d'origine. Images : champs laissés vides (session S3b).
const sc = (title: [string, string], situation: [string, string], action: [string, string], receive: [string, string], avoid: [string, string], service?: string) => ({
  title: l(...title),
  situation: l(...situation),
  action: l(...action),
  receive: l(...receive),
  avoid: l(...avoid),
  ...(service ? { service: ref(service) } : {}),
});

export const scenarioByKey = {
  mod1: sc(
    ["Situation type 1 — Trois modèles qui ne se sont jamais vus ensemble", "Typical situation 1 — Three models that have never been seen together"],
    ["La mécanique, la structure et l'architecture sont modélisées par des équipes différentes. La veille de la réunion de coordination, personne n'a regardé les modèles ensemble.", "Mechanical, structure and architecture are modelled by different teams. The day before the coordination meeting, nobody has looked at the models together."],
    ["Prépare le modèle fédéré, détecte les conflits entre les corps de métier (un conduit contre une poutre, une tuyauterie contre un gicleur) et les classe par étage et par discipline.", "Prepares the federated model, detects clashes between trades (a duct against a beam, a pipe against a sprinkler) and sorts them by floor and discipline."],
    ["Le modèle fédéré, la liste des conflits pour la réunion de coordination, le registre des éléments à corriger ou à confirmer.", "The federated model, the clash list for the coordination meeting, the log of items to correct or confirm."],
    ["Découvrir au chantier qu'une poutre bloque le passage d'une colonne montante.", "Finding out on site that a beam blocks the path of a riser."],
    "service-modelisation",
  ),
  mod2: sc(
    ["Situation type 2 — Un modèle de conception incomplet", "Typical situation 2 — An incomplete design model"],
    ["Le modèle reçu a des niveaux de détail inégaux, des paramètres vides et des nomenclatures qui ne concordent pas. L'entrepreneur général doit pourtant s'en servir pour planifier.", "The model received has uneven levels of detail, empty parameters and schedules that do not match. The general contractor still has to plan from it."],
    ["Revoit le modèle selon vos exigences, met à jour l'architecture, la structure ou la mécanique du bâtiment selon le mandat, vérifie les paramètres et les nomenclatures.", "Reviews the model against your requirements, updates architecture, structure or building mechanical as per the mandate, and checks parameters and schedules."],
    ["Le modèle mis à jour, la liste de vérification de la qualité, la liste des points à confirmer auprès du concepteur.", "The updated model, the quality checklist, the list of points to confirm with the designer."],
    ["Bâtir une planification et des quantités sur des données qui ne concordent pas.", "Building a schedule and quantities on data that do not match."],
    "service-modelisation",
  ),
  tuy1: sc(
    ["Situation type 1 — Des dessins approuvés qui ne se fabriquent pas", "Typical situation 1 — Approved drawings that cannot be fabricated"],
    ["Les dessins d'atelier sont approuvés, mais l'atelier n'a ni longueurs de coupe ni numéros de pièces du fabricant. Le chantier avance.", "The shop drawings are approved, but the shop has neither cut lengths nor manufacturer part numbers. The site keeps moving."],
    ["Modélise les réseaux approuvés dans SysQue avec les pièces réelles du fabricant retenu, les découpe en spools et les numérote.", "Models the approved systems in SysQue with the selected manufacturer's real parts, breaks them into spools and numbers them."],
    ["Des dessins de spool et d'assemblage numérotés, des listes de coupe et de matériel avec les références du fabricant, des étiquettes imprimables.", "Numbered spool and assembly drawings, cut and material lists with manufacturer references, printable labels."],
    ["Couper et ajuster la tuyauterie sur place, avec des pièces qui ne correspondent pas à la commande.", "Cutting and fitting piping on site, with parts that do not match the order."],
    "service-prefabrication",
  ),
  tuy2: sc(
    ["Situation type 2 — Un skid à préparer pour une salle mécanique serrée", "Typical situation 2 — A skid to prepare for a tight mechanical room"],
    ["Une salle mécanique doit recevoir des pompes, des collecteurs et un cadre. L'espace est limité et le dessin du fabricant est approuvé par l'ingénieur.", "A mechanical room must receive pumps, headers and a frame. Space is limited and the manufacturer's drawing is approved by the engineer."],
    ["Modélise le skid (pompes, collecteurs d'aspiration et de refoulement, cadre selon le dessin du fabricant ou de l'ingénieur) et coordonne les supports et les contreventements.", "Models the skid (pumps, suction and discharge headers, frame per the manufacturer's or engineer's drawing) and coordinates the hangers and bracing."],
    ["Les dessins d'assemblage et de spool, la liste de matériel.", "The assembly and spool drawings, the material list."],
    ["Assembler le skid dans la salle mécanique, sans dessin d'assemblage, avec des parcours vérifiés trop tard. (La conception structurale du cadre reste à l'ingénieur.)", "Assembling the skid in the mechanical room, without an assembly drawing, with routes checked too late. (The structural design of the frame remains with the engineer.)"],
    "service-prefabrication",
  ),
  gic1: sc(
    ["Situation type 1 — La pointe de travail", "Typical situation 1 — The peak workload"],
    ["Plusieurs soumissions de dessins d'atelier arrivent en même temps et vos dessinateurs de gicleurs sont déjà au maximum.", "Several shop drawing submissions arrive at the same time and your sprinkler drafters are already at capacity."],
    ["Dessine les étages dans AutoSPRINK, à partir des plans ou du modèle de l'ingénieur et de vos standards, étage par étage.", "Draws the floors in AutoSPRINK, from the engineer's drawings or model and your standards, floor by floor."],
    ["Le fichier AutoSPRINK, les dessins d'atelier, les listes de coupe et de matériel.", "The AutoSPRINK file, the shop drawings, the cut and material lists."],
    ["Refuser un contrat ou retarder l'envoi des dessins d'atelier à l'ingénieur.", "Turning down a contract or delaying the shop drawings sent to the engineer."],
    "service-gicleurs",
  ),
  gic2: sc(
    ["Situation type 2 — Les gicleurs doivent apparaître au modèle de coordination", "Typical situation 2 — Sprinklers must appear in the coordination model"],
    ["Le modèle de coordination est dans Revit et Navisworks. Le réseau de gicleurs doit y figurer pour la réunion de coordination.", "The coordination model is in Revit and Navisworks. The sprinkler system must appear in it for the coordination meeting."],
    ["Exporte le réseau vers Revit ou NWC et coordonne les supports et les contreventements parasismiques selon les calculs approuvés.", "Exports the system to Revit or NWC and coordinates the hangers and seismic bracing per the approved calculations."],
    ["L'export Revit ou NWC, les supports et contreventements coordonnés.", "The Revit or NWC export, the coordinated hangers and bracing."],
    ["Découvrir un croisement avec une conduite ou un chemin de câbles au moment d'installer.", "Discovering a crossing with a duct or a cable tray at installation time."],
    "service-gicleurs",
  ),
  com1: sc(
    ["Situation type 1 — Un corridor technique, deux fournisseurs de dessins", "Typical situation 1 — A service corridor, two drawing suppliers"],
    ["Un corridor reçoit de la tuyauterie, des gicleurs et d'autres réseaux. Deux fournisseurs dessinent chacun de leur côté.", "A corridor receives piping, sprinklers and other systems. Two suppliers each draw on their own."],
    ["Modélise la tuyauterie dans SysQue et les gicleurs dans AutoSPRINK, dans le même modèle de coordination, et règle les croisements au modèle.", "Models the piping in SysQue and the sprinklers in AutoSPRINK, in the same coordination model, and resolves the crossings in the model."],
    ["Le modèle coordonné de la zone, les dessins de spool de tuyauterie, les dessins d'atelier de gicleurs.", "The coordinated model of the zone, the piping spool drawings, the sprinkler shop drawings."],
    ["Les allers-retours entre deux fournisseurs et les reprises à l'installation.", "Back-and-forth between two suppliers and rework at installation."],
    "service-combinee",
  ),
  com2: sc(
    ["Situation type 2 — Les gicleurs d'abord, la tuyauterie ensuite", "Typical situation 2 — Sprinklers first, piping second"],
    ["Les gicleurs ont été dessinés en premier. La tuyauterie arrive plus tard et passe au même endroit.", "The sprinklers were drawn first. The piping arrives later and runs through the same place."],
    ["Met les deux disciplines dans un seul modèle, détecte les conflits et propose les déplacements à valider avec vous et avec l'ingénieur.", "Puts both disciplines in a single model, detects the clashes and proposes moves for you and the engineer to validate."],
    ["La liste des conflits réglés, les listes de coupe et de matériel des deux disciplines, les dessins d'atelier des deux.", "The list of resolved clashes, the cut and material lists for both disciplines, the shop drawings for both."],
    ["Refaire des dessins déjà envoyés à l'atelier.", "Redrawing drawings already sent to the shop."],
    "service-combinee",
  ),
  d1: sc(
    ["Situation type 1 — Une remise qui approche, des champs vides", "Typical situation 1 — A handover approaching, empty fields"],
    ["Le propriétaire a une grille de suivi des équipements. À l'approche de la remise, le modèle de mécanique du bâtiment a des champs vides et des codes qui ne suivent pas la convention.", "The owner has an equipment tracking grid. As handover approaches, the building mechanical model has empty fields and codes that do not follow the convention."],
    ["Compare le modèle aux grilles du propriétaire et rapporte, élément par élément, les données manquantes ou erronées. Rien n'est inventé.", "Compares the model to the owner's grids and reports, element by element, the missing or wrong data. Nothing is invented."],
    ["Un rapport Excel des données manquantes ou erronées, avec le détail par élément.", "An Excel report of missing or wrong data, with detail per element."],
    ["Repousser la remise finale pour des champs à compléter.", "Postponing final handover because of fields still to complete."],
    "service-bim-7d",
  ),
  d2: sc(
    ["Situation type 2 — Retrouver une vanne dans le plafond", "Typical situation 2 — Finding a valve in the ceiling"],
    ["L'équipe d'entretien du propriétaire cherche une vanne : où est-elle, de quel type, quelle est sa position normale ?", "The owner's maintenance team is looking for a valve: where is it, what type is it, what is its normal position?"],
    ["Numérote les robinets (code d'équipement et code de système), renseigne leur fonction et leur position normale, repère chaque élément dans son local.", "Numbers the valves (equipment code and system code), fills in their function and normal position, and locates each element in its room."],
    ["Un modèle renseigné, avec les données prêtes pour les manuels d'exploitation et d'entretien et la maintenance.", "A populated model, with data ready for the operation and maintenance (O&M) manuals and for maintenance."],
    ["Chercher les équipements avec des plans qui ne les identifient pas.", "Hunting for equipment with drawings that do not identify it."],
    "service-bim-7d",
  ),
  q1: sc(
    ["Situation type 1 — Des demandes de changement pendant les travaux", "Typical situation 1 — Change orders during construction"],
    ["Des demandes de changement ont déplacé des conduites et des équipements. Les plans de remise montrent encore la conception.", "Change orders have moved pipes and equipment. The handover drawings still show the design."],
    ["Intègre les changements approuvés dans les modèles et les plans, et compare les documents entre eux.", "Integrates the approved changes into the models and drawings, and compares the documents against each other."],
    ["Les modèles et les plans tel que construit mis à jour, la liste des réserves restantes.", "The updated as-built models and drawings, the list of remaining reservations."],
    ["Remettre au propriétaire des plans qui ne correspondent pas à ce qui est dans le plafond.", "Handing the owner drawings that do not match what is in the ceiling."],
    "service-tqc",
  ),
  q2: sc(
    ["Situation type 2 — Des annotations et des photos éparpillées", "Typical situation 2 — Scattered mark-ups and photos"],
    ["Le contremaître a annoté des plans et pris des photos. Le dossier de remise exige des fichiers organisés et nommés selon la convention du projet.", "The foreman has marked up drawings and taken photos. The handover package requires files organized and named to the project convention."],
    ["Inventorie les relevés, les annotations et les photos référencées, repère les données manquantes, organise les documents convenus.", "Inventories the surveys, mark-ups and referenced photos, spots missing data and organizes the agreed documents."],
    ["Un dossier de remise (fichiers, versions, documents) et la liste des informations manquantes.", "A handover package (files, versions, documents) and the list of missing information."],
    ["Fouiller les courriels et les photos au moment de la mise en service et de la remise.", "Digging through emails and photos at commissioning and handover."],
    "service-tqc",
  ),
};

type K = keyof typeof scenarioByKey;
const withoutService = (k: K) => {
  const { service, ...rest } = scenarioByKey[k];
  void service; // une page de service ne se renvoie pas à elle-même
  return rest;
};
/** Situations d'une page de service : sans lien vers elle-même. */
export const serviceScenarios = (...keys: K[]) => keyed(keys.map(withoutService));
/** Situations de l'accueil (§ 4.7) : une par famille, chacune renvoie à son service. */
/** Sur l'accueil, les trois situations se suivent : leur numéro repart de 1 (S3b), le reste du titre est inchangé. */
export const renumberScenarioTitle = (title: { fr: string; en: string }, n: number) => ({
  fr: title.fr.replace(/^Situation type d+/, `Situation type ${n}`),
  en: title.en.replace(/^Typical situation d+/, `Typical situation ${n}`),
});
export const homeScenarios = () => keyed([scenarioByKey.mod1, scenarioByKey.tuy1, scenarioByKey.d2].map((s, i) => ({ ...s, title: renumberScenarioTitle(s.title, i + 1) })));
