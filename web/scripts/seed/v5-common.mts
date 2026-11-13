import { keyed, l } from "./helpers.mts";

// Plan de contenu v5 : éléments partagés par l'accueil, À propos et les six services (FR et EN).

/** § 3.9 — tableau « Qui fait quoi ». Sur chaque page de service, seules les lignes pertinentes sont posées. */
const rows = {
  design: { label: l("Conception et calculs (y compris parasismique)", "Design and calculations (including seismic)"), engineer: true },
  approval: {
    label: l("Approbation, signature et sceau des dessins", "Approval, signature and seal of the drawings"),
    engineer: true,
    contractor: true,
    contractorNote: l("l'approbation et la signature des dessins d'atelier", "approval and signature of the shop drawings"),
  },
  models: { label: l("Modèles, dessins d'atelier, listes de coupe et de matériel", "Models, shop drawings, cut and material lists"), bimurix: true },
  clashes: {
    label: l("Détection de conflits et suivi des corrections", "Clash detection and follow-up of corrections"),
    bimurix: true,
    contractor: true,
    contractorNote: l("décide des corrections", "decides on the corrections"),
  },
  supplied: {
    label: l("Dessins d'atelier approuvés, fabricants retenus, standards de l'atelier", "Approved shop drawings, selected manufacturers, shop standards"),
    contractor: true,
    contractorNote: l("les fournit", "provides them"),
  },
  survey: {
    label: l("Relevés de chantier et changements approuvés (tel que construit)", "Site surveys and approved changes (as-built)"),
    contractor: true,
    contractorNote: l("les fournit", "provides them"),
  },
  build: { label: l("Fabrication et installation", "Fabrication and installation"), contractor: true },
};
type RowKey = keyof typeof rows;

// T2 (C-18) : les lignes de Bimurix d'abord, quel que soit l'ordre demandé.
const ROW_ORDER: RowKey[] = ["models", "clashes", "design", "approval", "supplied", "survey", "build"];
export const responsibilityRows = (...keys: RowKey[]) =>
  keyed([...keys].sort((a, b) => ROW_ORDER.indexOf(a) - ROW_ORDER.indexOf(b)).map((k) => ({ bimurix: false, engineer: false, contractor: false, ...rows[k] })));

/** C-18 — version courte de l'accueil : une ligne par partie (Bimurix d'abord). La phrase sous le tableau reste celle d'origine. */
export const shortResponsibilityRows = () =>
  keyed([
    { title: l("Bimurix", "Bimurix"), text: l("Modèles, dessins d'atelier, listes de coupe et de matériel, détection de conflits.", "Models, shop drawings, cut and material lists, clash detection.") },
    { title: l("L'ingénieur", "The engineer"), text: l("Conception, calculs (y compris parasismique), signature et sceau.", "Design, calculations (including seismic), signature and seal.") },
    { title: l("L'entrepreneur", "The contractor"), text: l("Approbation des dessins d'atelier, fabricants retenus, fabrication et installation.", "Approval of the shop drawings, selected manufacturers, fabrication and installation.") },
  ]);
export const allResponsibilityRows = () => responsibilityRows("models", "clashes", "design", "approval", "supplied", "survey", "build");

/** Phrase sous le tableau, mot pour mot (plan § 3.9 ; mention de l'ingénieur, CLAUDE.md § 4). */
export const engineerSentence = l(
  "La conception, les calculs (y compris parasismique), l'approbation, la signature et le sceau des dessins restent à l'ingénieur ou à l'entrepreneur.",
  "Design, calculations (including seismic), approval, and the signature and seal of the drawings remain with the engineer or the contractor.",
);

/** § 6.4 — questions fréquentes, numérotées comme dans le plan. */
const q = (question: [string, string], answer: [string, string]) => ({ question: l(...question), answer: l(...answer) });
export const faqPool = {
  sysque: q(
    ["Faut-il avoir SysQue ?", "Do we need SysQue?"],
    ["Non. Vous recevez des PDF, des listes Excel et des étiquettes. Le modèle Revit est inclus si vous le voulez.", "No. You receive PDFs, Excel lists and labels. The Revit model is included if you want it."],
  ),
  seismic: q(
    ["Qui conçoit le parasismique ?", "Who designs the seismic bracing?"],
    ["Votre ingénieur. Bimurix modélise et coordonne les contreventements selon les dessins et les calculs approuvés.", "Your engineer. Bimurix models and coordinates the bracing from the approved drawings and calculations."],
  ),
  signs: q(
    ["Qui signe les dessins ?", "Who signs the drawings?"],
    ["Bimurix produit les dessins. L'approbation, la signature et le sceau restent à l'ingénieur ou à l'entrepreneur.", "Bimurix produces the drawings. Approval, signature and seal remain with the engineer or the contractor."],
  ),
  makers: q(
    ["Quels fabricants ?", "Which manufacturers?"],
    ["Ceux que vous utilisez déjà, pour les raccords, les vannes et les supports, grâce au contenu fabricant de SysQue.", "The ones you already use, for fittings, valves and hangers, thanks to SysQue's manufacturer content."],
  ),
  documents: q(
    ["Quels documents faut-il envoyer ?", "Which documents should we send?"],
    ["Les plans ou le modèle de l'ingénieur, les dessins d'atelier approuvés, les fabricants retenus, vos standards, les exigences de remise du propriétaire.", "The engineer's drawings or model, the approved shop drawings, the selected manufacturers, your standards, the owner's handover requirements."],
  ),
  price: q(
    ["Comment se calcule le prix ?", "How is the price calculated?"],
    ["Sur soumission, selon la portée : ce qu'il faut modéliser ou dessiner, la quantité d'éléments, les documents reçus et l'échéancier. Prix en dollars canadiens, avant TPS et TVQ.", "On quote, based on scope: what has to be modelled or drawn, the number of elements, the documents received and the schedule. Prices in Canadian dollars, before GST and QST."],
  ),
  soon: q(
    ["Mon projet démarre bientôt : pouvez-vous suivre ?", "My project starts soon: can you keep up?"],
    ["Délai confirmé dans la soumission, selon la portée et les documents reçus. Indiquez votre échéancier dans la demande.", "Lead time confirmed in the quote, based on scope and the documents received. Give us your schedule in the request."],
  ),
  region: q(
    ["Quelle région desservez-vous ?", "Which area do you serve?"],
    ["Le Grand Montréal. Nous travaillons en français et en anglais.", "Greater Montreal. We work in French and in English."],
  ),
  english: q(
    ["Travaillez-vous en anglais ?", "Do you work in English?"],
    ["Oui, en français et en anglais.", "Yes, in French and in English."],
  ),
  zone: q(
    ["Pouvez-vous prendre une seule zone ou un seul étage ?", "Can you take a single zone or a single floor?"],
    ["Oui ; la portée se précise à la soumission.", "Yes; the scope is set out in the quote."],
  ),
  transfer: q(
    ["Comment envoyer les plans et les modèles ?", "How do we send the drawings and models?"],
    ["Ajoutez un lien de partage dans votre demande ; nous vous indiquons ensuite le moyen de transfert adapté.", "Add a share link to your request; we then tell you the most suitable way to transfer them."],
  ),
  missing: q(
    ["Que faites-vous si une donnée manque ?", "What do you do if data is missing?"],
    ["Elle est signalée comme manquante ou à confirmer ; nous n'inventons rien.", "It is flagged as missing or to be confirmed; we do not invent anything."],
  ),
  verify: q(
    ["Pouvez-vous vérifier le chantier ?", "Can you verify the site?"],
    ["Non : nous travaillons à partir de vos relevés et changements approuvés. Un élément n'est jamais présenté comme vérifié sur chantier sans données.", "No: we work from your surveys and approved changes. Nothing is presented as site-verified without data."],
  ),
};
export const faqEntries = (...keys: Array<keyof typeof faqPool>) => keyed(keys.map((k) => faqPool[k]));

/** § 5 — livrables avec « à quoi ça sert ». */
export const deliverableRows = (items: Array<[[string, string], [string, string]]>) => keyed(items.map(([t, p]) => ({ title: l(...t), purpose: l(...p) })));

export const needs = (items: Array<[string, string]>) => keyed(items.map(([fr, en]) => l(fr, en)));

/** Les 20 clés « Petits textes du site » créées par S3a (CLAUDE.md § 4 : le texte public vit dans Sanity). */
export const uiStringsV5 = {
  familyModeler: l("Modéliser et coordonner", "Model and coordinate"),
  familyPrefabriquer: l("Préfabriquer", "Prefabricate"),
  familyLivrer: l("Livrer et exploiter", "Deliver and operate"),
  scenariosHeading: l("Situations types", "Typical situations"),
  scenariosNote: l(
    "Ces situations sont des exemples types. Elles ne décrivent pas un projet réel ni un client de Bimurix.",
    "These are typical examples. They do not describe a real project or a Bimurix client.",
  ),
  scenarioSituation: l("Situation", "Situation"),
  scenarioAction: l("Ce que fait Bimurix", "What Bimurix does"),
  scenarioReceive: l("Ce que vous recevez", "What you receive"),
  scenarioAvoid: l("Ce que ça évite", "What it avoids"),
  scenarioQuoteLink: l("Demander une soumission pour une situation comme celle-ci", "Request a quote for a situation like this"),
  scenarioServiceLink: l("Voir le service", "See the service"),
  deliverableLabel: l("Livrable", "Deliverable"),
  purposeLabel: l("À quoi ça sert", "What it is for"),
  serviceFaqHeading: l("Questions sur ce service", "Questions about this service"),
  needsHeadingDefault: l("Ce qu'il faut nous envoyer", "What to send us"),
  respColResponsibility: l("Responsabilité", "Responsibility"),
  respColBimurix: l("Bimurix", "Bimurix"),
  respColEngineer: l("Ingénieur", "Engineer"),
  respColContractor: l("Entrepreneur", "Contractor"),
  respYes: l("Oui", "Yes"),
  respNo: l("Non", "No"),
};
