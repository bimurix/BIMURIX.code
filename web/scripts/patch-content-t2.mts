/**
 * T2 (cahier v6, ADR-009) — applique le contenu de la révision T2 au dataset `development`, en français et en anglais :
 * accueil (nouveau titre, « Pourquoi Bimurix », registre « Projets », versions courtes), À propos, Soumission, 404,
 * six pages de service (groupes de prestations, phrases de confiance, titres, lexique), valeurs d'exemple de `settings`
 * (téléphone, nom légal, NEQ : saisies seulement si le champ est vide), petits textes ajoutés, champs T2 du formulaire.
 * Les documents du seed sont remplacés (createOrReplace, donc idempotent) ; toute image déjà posée (`image`, `illustration`,
 * `heroImage`, `figureImage`, `founderPhoto`, logos) est reportée sur le nouveau document : on peut relancer ce script avant
 * ou après `patch-design-s3b.mts`, sans perdre de photo. `formSettings` ne reçoit que les champs T2 ; `uiStrings` que les clés ajoutées.
 * Refuse tout autre dataset que `development` (jamais `production`).
 *
 *   NEXT_PUBLIC_SANITY_DATASET=development pnpm exec sanity exec scripts/patch-content-t2.mts --with-user-token
 */
import { getCliClient } from "sanity/cli";
import { seedDocuments } from "./seed/documents.mts";
import { keepImages } from "./seed/keep-images.mts";
import { formSettingsT2 } from "./seed/form-t2.mts";
import { uiStringsT2 } from "./seed/ui-strings-t2.mts";

const REPLACED_TYPES = ["service", "page"];
const SKIPPED_PAGES = ["page-privacy", "page-terms"]; // pages légales : T5

const client = getCliClient({ apiVersion: "2026-11-01", useCdn: false });
const { projectId, dataset } = client.config();
const documents = seedDocuments.filter((d) => REPLACED_TYPES.includes(d._type) && !SKIPPED_PAGES.includes(d._id));
console.log(`Cible : ${projectId}/${dataset} (${documents.length} documents)`);
if (dataset !== "development") {
  console.error(`Refusé : ce script n'écrit que dans « development » (cible : « ${dataset} »).`);
  process.exit(1);
}

const existing = await client.fetch<Array<Record<string, unknown> & { _id: string }>>(`*[_id in $ids]`, { ids: documents.map((d) => d._id) });
const byId = new Map(existing.map((d) => [d._id, d]));
const tx = client.transaction();
for (const doc of documents) tx.createOrReplace(keepImages(doc, byId.get(doc._id)) as typeof doc);
await tx.commit();
console.log(`${documents.length} documents remplacés (pages et services), images conservées.`);

// Valeurs d'exemple (ADR-009 n° 1 à 3) : seulement si le champ est vide, pour ne jamais écraser une vraie valeur saisie par le client.
const settings = seedDocuments.find((d) => d._id === "settings") as Record<string, string>;
await client.createIfNotExists({ _id: "settings", _type: "settings", siteName: "Bimurix", email: settings.email });
await client.patch("settings").setIfMissing({ phone: settings.phone, legalName: settings.legalName, neq: settings.neq }).commit();

// Petits textes ajoutés : clé par clé, sans toucher aux textes déjà modifiés dans Studio.
await client.createIfNotExists({ _id: "uiStrings", _type: "uiStrings" });
await client.patch("uiStrings").setIfMissing(uiStringsT2).commit();

// Formulaire : encart renommé, budget masqué, colonne de réassurance. Le reste appartient à R2 et au client.
await client.createIfNotExists({ _id: "formSettings", _type: "formSettings" });
await client.patch("formSettings").set(formSettingsT2).commit();

// Lexique (C-29) : le texte alternatif de la photo de D-05 (posée par S3b) disait « Robinets ».
const bim7d = await client.fetch<{ heroImage?: { alt?: { fr?: string } } } | null>(`*[_id == "service-bim-7d"][0]{heroImage}`);
if (bim7d?.heroImage?.alt?.fr?.startsWith("Robinets")) {
  await client.patch("service-bim-7d").set({ "heroImage.alt.fr": bim7d.heroImage.alt.fr.replace("Robinets", "Vannes") }).commit();
  console.log("service-bim-7d : texte alternatif de la photo corrigé (vannes).");
}

const drafts = await client.fetch<string[]>(`*[_id in path("drafts.**")]._id`);
console.log(`Terminé : ${Object.keys(uiStringsT2).length} petits textes et ${Object.keys(formSettingsT2).length} champs de formulaire vérifiés dans ${projectId}/${dataset}.`);
if (drafts.length) console.log(`Attention : ${drafts.length} brouillon(s) dans Studio peuvent masquer ces changements : ${drafts.join(", ")}`);
