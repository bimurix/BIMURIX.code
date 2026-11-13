/**
 * T6-B (R-10, R-14) — titre et description SEO de chaque page et de chaque service, en FR et en EN, dans le dataset `development`.
 * Chaque page vise deux ou trois expressions de recherche du cahier v6 (R-14) dans son titre et sa description, dit le livrable,
 * le logiciel et « Grand Montréal ». Titres ≤ 60 caractères, descriptions ≤ 155 ; aucun titre en double (le script le vérifie avant d'écrire).
 * Idempotent : ne touche que les champs qui diffèrent ; on peut le relancer sans effet.
 * Refuse tout autre dataset que `development` (jamais `production`).
 *
 *   node scripts/patch-seo-t6.mts --check        (longueurs et unicité seulement, aucun accès réseau)
 *   NEXT_PUBLIC_SANITY_DATASET=development pnpm exec sanity exec scripts/patch-seo-t6.mts --with-user-token
 */
import { getCliClient } from "sanity/cli";

type Loc = { fr: string; en: string };
type Entry = { title: Loc; description?: Loc };

// Clé = _id du document (accueil, pages, puis les six services).
const SEO: Record<string, Entry> = {
  "page-home": {
    title: { fr: "Services BIM et préfabrication MEP au Québec | Bimurix", en: "BIM services and MEP prefabrication in Quebec | Bimurix" },
    description: {
      fr: "Modélisation BIM, coordination, dessins d'atelier de tuyauterie (SysQue) et de gicleurs (AutoSPRINK), tel que construit. Grand Montréal.",
      en: "BIM modeling, MEP coordination, SysQue pipe and AutoSPRINK sprinkler shop drawings, as-built models. BIM outsourcing in Quebec, Greater Montreal.",
    },
  },
  "service-modelisation": {
    title: { fr: "Modélisation et coordination BIM à Montréal | Bimurix", en: "MEP BIM modeling and coordination, Montreal | Bimurix" },
    description: {
      fr: "Modèles BIM d'architecture, de structure et de mécanique du bâtiment, détection de conflits Navisworks et liste pour la coordination MEP. Grand Montréal.",
      en: "Revit MEP models and clash detection services, with a clash list for the coordination meeting. MEP BIM coordination, Greater Montreal.",
    },
  },
  "service-prefabrication": {
    title: { fr: "Dessins d'atelier de tuyauterie (SysQue) | Bimurix", en: "Pipe shop drawings and spools (SysQue) | Bimurix" },
    description: {
      fr: "Dessins d'atelier et de spool de tuyauterie, listes de coupe, supports et contreventements parasismiques dans SysQue. Grand Montréal.",
      en: "Pipe spool drawings, cut lists, hangers and seismic bracing with the manufacturer's real parts, modeled in SysQue. Greater Montreal.",
    },
  },
  "service-gicleurs": {
    title: { fr: "Dessins d'atelier de gicleurs (AutoSPRINK) | Bimurix", en: "Sprinkler shop drawings (AutoSPRINK) | Bimurix" },
    description: {
      fr: "Dessins d'atelier de gicleurs, listes de coupe et supports dans AutoSPRINK, étage par étage, avec export Revit et NWC. Grand Montréal.",
      en: "Fire protection shop drawings: sprinkler drafting in AutoSPRINK, cut lists and hangers, Revit and NWC export. Greater Montreal.",
    },
  },
  "service-combinee": {
    title: { fr: "Coordination tuyauterie et gicleurs | Bimurix", en: "Piping and sprinkler coordination | Bimurix" },
    description: {
      fr: "Tuyauterie (SysQue) et gicleurs (AutoSPRINK) coordonnés sur une zone : conflits réglés avant la fabrication, dessins d'atelier des deux. Grand Montréal.",
      en: "One zone in SysQue piping and AutoSPRINK sprinklers: clashes resolved before fabrication, shop drawings for both. Greater Montreal.",
    },
  },
  "service-bim-7d": {
    title: { fr: "Données d'actifs BIM 7D pour la remise | Bimurix", en: "BIM 7D asset data for handover | Bimurix" },
    description: {
      fr: "Paramètres BIM structurés et complétude des données d'équipements vérifiée, pour la remise au donneur d'ouvrage et la gestion des actifs. Grand Montréal.",
      en: "BIM 7D asset data: structured parameters and equipment data checks for handover to the owner and asset management. Greater Montreal.",
    },
  },
  "service-tqc": {
    title: { fr: "Modèles et plans tel que construit (TQC) | Bimurix", en: "As-built models and drawings (TQC) | Bimurix" },
    description: {
      fr: "Modèle tel que construit Revit et plans mis à jour d'après les relevés et les changements approuvés, avec un dossier de remise organisé. Grand Montréal.",
      en: "Revit as-built models and as-built drawings updated from surveys and approved changes, with an organized handover package. Greater Montreal.",
    },
  },
  "page-about": {
    title: { fr: "À propos : spécialiste BIM MEP, Grand Montréal | Bimurix", en: "About: MEP BIM specialist, Greater Montreal | Bimurix" },
    description: {
      fr: "Bimurix modélise, coordonne et structure l'information du bâtiment, du modèle de conception à la remise. SysQue, AutoSPRINK, Grand Montréal.",
      en: "Bimurix models, coordinates and structures building information, from the design model to handover. SysQue and AutoSPRINK prefabrication, Greater Montreal.",
    },
  },
  "page-quote": {
    title: { fr: "Demander une soumission BIM | Bimurix", en: "Request a BIM quote | Bimurix" },
    description: {
      fr: "Demandez une soumission : modélisation BIM, dessins d'atelier de tuyauterie et de gicleurs, tel que construit. Réponse d'ici un jour ouvrable.",
      en: "Request a quote from Bimurix: BIM modeling, piping and sprinkler shop drawings, as-built, asset data. Reply within one business day.",
    },
  },
  "page-terms": {
    title: { fr: "Conditions d'utilisation | Bimurix", en: "Terms of use | Bimurix" },
    description: {
      fr: "Conditions d'utilisation du site de Bimurix, services BIM et préfabrication MEP au Québec.",
      en: "Terms of use of the Bimurix website, BIM services and MEP prefabrication in Quebec.",
    },
  },
  "page-privacy": {
    title: { fr: "Politique de confidentialité | Bimurix", en: "Privacy policy | Bimurix" },
    description: {
      fr: "Politique de confidentialité de Bimurix : renseignements recueillis, conservation, droits d'accès et recours (Loi 25).",
      en: "Bimurix privacy policy: information collected, retention, access rights and recourse (Quebec Law 25).",
    },
  },
  "page-not-found": { title: { fr: "Page introuvable | Bimurix", en: "Page not found | Bimurix" } },
};

// Contrôles avant toute écriture : longueurs et aucun doublon par langue.
function validate(): string[] {
  const problems: string[] = [];
  for (const lang of ["fr", "en"] as const) {
    const seen = new Map<string, string>();
    for (const [id, e] of Object.entries(SEO)) {
      const t = e.title[lang];
      const d = e.description?.[lang];
      if (t.length > 60) problems.push(`${id} ${lang} : titre de ${t.length} caractères (max 60)`);
      if (d && d.length > 155) problems.push(`${id} ${lang} : description de ${d.length} caractères (max 155)`);
      if (seen.has(t)) problems.push(`${id} ${lang} : titre identique à ${seen.get(t)}`);
      seen.set(t, id);
    }
  }
  return problems;
}

const problems = validate();
if (problems.length) {
  console.error(problems.join("\n"));
  process.exit(1);
}
if (process.argv.includes("--check")) {
  console.log("Longueurs et unicité : OK");
  process.exit(0);
}

const client = getCliClient({ apiVersion: "2026-11-01", useCdn: false });
const { projectId, dataset } = client.config();
console.log(`Cible : ${projectId}/${dataset}`);
if (dataset !== "development") {
  console.error(`Refusé : ce script n'écrit que dans « development » (cible : « ${dataset} »).`);
  process.exit(1);
}

const docs = await client.fetch<Array<{ _id: string; seo?: { title?: Partial<Loc>; description?: Partial<Loc> } | null }>>(
  `*[_id in $ids]{_id, seo{title, description}}`,
  { ids: Object.keys(SEO) },
);
let changed = 0;
for (const [id, entry] of Object.entries(SEO)) {
  const doc = docs.find((d) => d._id === id);
  if (!doc) { console.warn(`Absent : ${id} (ignoré)`); continue; }
  const set: Record<string, string> = {};
  for (const lang of ["fr", "en"] as const) {
    if (doc.seo?.title?.[lang] !== entry.title[lang]) set[`seo.title.${lang}`] = entry.title[lang];
    const d = entry.description?.[lang];
    if (d && doc.seo?.description?.[lang] !== d) set[`seo.description.${lang}`] = d;
  }
  if (!Object.keys(set).length) continue;
  await client.patch(id).set(set).commit();
  console.log(`${id} : ${Object.keys(set).length} champ(s)`);
  changed += Object.keys(set).length;
}
console.log(changed ? `${changed} champ(s) mis à jour.` : "Rien à changer (déjà à jour).");
