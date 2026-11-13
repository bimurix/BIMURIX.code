/**
 * S3b (finition visuelle, plan de contenu v5 § 7 et § 8) — met le dataset `development` au diapason du nouveau rendu :
 *  1. Accueil : le bloc « schéma du cycle » est fondu dans la section des services (son introduction y passe) ;
 *     les trois situations types sont numérotées 1, 2, 3. Le sens des textes de S2 ne change pas.
 *  2. Petits textes : en-tête de colonne « Livrable » (FR et EN).
 *  3. Images, avec texte alternatif et légende FR et EN : un schéma au trait par service (« Exemple de livrable »),
 *     une photo d'illustration Unsplash en haut de trois services et de la page À propos.
 * Le script peut être relancé : il ne remplace que ces champs. Sources et crédits : docs/source/2026-11-12_images-s3b.md.
 * Refuse tout autre dataset que `development` (jamais `production`).
 *
 *   NEXT_PUBLIC_SANITY_DATASET=development pnpm exec sanity exec scripts/patch-design-s3b.mts --with-user-token
 */
import { createReadStream } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { getCliClient } from "sanity/cli";
import { renumberScenarioTitle } from "./seed/v5-scenarios.mts";

const assets = join(dirname(fileURLToPath(import.meta.url)), "assets", "s3b");
const l = (fr: string, en: string) => ({ fr, en });

const client = getCliClient({ apiVersion: "2026-11-01", useCdn: false });
const { projectId, dataset } = client.config();
console.log(`Cible : ${projectId}/${dataset}`);
if (dataset !== "development") {
  console.error(`Refusé : ce script n'écrit que dans « development » (cible : « ${dataset} »).`);
  process.exit(1);
}

const SCHEMA_CAPTION = l("Schéma d'exemple", "Example diagram");
const PHOTO_CAPTION = l("Photo d'illustration", "Illustrative photo");

type Picture = { file: string; alt: { fr: string; en: string }; credit?: { author: string; url: string; id: string } };

// Un schéma au trait par service, à l'emplacement « exemple de livrable » (à côté de « Ce que vous recevez »).
const SCHEMATICS: Record<string, Picture> = {
  "service-modelisation": { file: "p-01-modele-federe.svg", alt: l("Schéma d'exemple : structure, conduit et tuyauterie superposés, un conflit entre le conduit et une poutre entouré d'un nuage de révision.", "Example diagram: structure, duct and piping overlaid, with a clash between the duct and a beam circled by a revision cloud.") },
  "service-prefabrication": { file: "h-02-spool-isometrique.svg", alt: l("Schéma d'exemple : spool de tuyauterie en isométrique, avec repères, lignes de cote et liste de coupe.", "Example diagram: isometric pipe spool with item balloons, dimension lines and a cut list.") },
  "service-gicleurs": { file: "g-03-etage-gicleurs.svg", alt: l("Schéma d'exemple : plan d'un étage de gicleurs, avec la colonne montante, la conduite principale, les antennes et les têtes.", "Example diagram: sprinkler layout of one floor, with the riser, the main, the branch lines and the heads.") },
  "service-combinee": { file: "c-04-coupe-corridor.svg", alt: l("Schéma d'exemple : coupe d'un corridor où le conduit, la tuyauterie et les gicleurs passent sans se croiser.", "Example diagram: corridor section where the duct, the piping and the sprinklers run without clashing.") },
  "service-bim-7d": { file: "d-05-fiche-equipement.svg", alt: l("Schéma d'exemple : équipement repéré et sa fiche de données, une donnée manquante signalée.", "Example diagram: a tagged piece of equipment and its data sheet, with one missing value flagged.") },
  "service-tqc": { file: "q-06-plan-tel-que-construit.svg", alt: l("Schéma d'exemple : plan tel que construit, le parcours conçu en tirets, le parcours construit en trait plein et l'écart entouré.", "Example diagram: as-built drawing, with the designed route dashed, the built route solid and the difference circled.") },
};

// Photos d'illustration Unsplash (licence Unsplash) : haut de trois pages de service et de la page À propos.
const unsplash = (id: string, slug: string, author: string) => ({ id, author, url: `https://unsplash.com/photos/${slug}-${id}` });
const HERO_PHOTOS: Record<string, Picture> = {
  "service-prefabrication": { file: "photo-h-02-tuyauterie.jpg", alt: l("Tuyauterie à brides installée le long d'un mur.", "Flanged piping installed along a wall."), credit: unsplash("scUBcasSvbE", "grayscale-photography-of-metal-pipes", "Samuel Sianipar") },
  "service-gicleurs": { file: "photo-g-03-gicleurs.jpg", alt: l("Réseau de gicleurs apparent sous une dalle de béton.", "Exposed sprinkler piping under a concrete slab."), credit: unsplash("KsLbHArxEuU", "concrete-ceiling-with-red-pipes-and-cable-trays", "Valentin Lacoste") },
  "service-bim-7d": { file: "photo-d-05-salle-mecanique.jpg", alt: l("Robinets, régulateur et compteur sur une tuyauterie murale.", "Valves, a regulator and a meter on wall-mounted piping."), credit: unsplash("4CNNH2KEjhc", "black-and-gray-metal-pipe", "Compagnons") },
};
const ABOUT_PHOTO: Picture = { file: "photo-a-propos-charpente.jpg", alt: l("Charpente d'acier d'un bâtiment en construction.", "Steel frame of a building under construction."), credit: unsplash("dSRhwPe6v9c", "steel-beams-of-building-roof-structure", "D R") };

/** Téléverse le fichier (Sanity reconnaît un fichier déjà présent à son empreinte) et renvoie le champ image complet. */
async function imageField(picture: Picture, caption: { fr: string; en: string }) {
  const svg = picture.file.endsWith(".svg");
  const asset = await client.assets.upload("image", createReadStream(join(assets, picture.file)), {
    filename: picture.file,
    contentType: svg ? "image/svg+xml" : "image/jpeg",
    ...(picture.credit ? { creditLine: `${picture.credit.author} / Unsplash`, source: { name: "unsplash", id: picture.credit.id, url: picture.credit.url } } : {}),
  });
  return { _type: "imageWithAlt", asset: { _type: "reference", _ref: asset._id }, alt: picture.alt, caption, illustrative: false };
}

type HomeSection = { _key: string; _type: string; intro?: { fr?: string; en?: string }; items?: Array<{ _key: string; title: { fr: string; en: string } }> };

// 1. Accueil : cycle fondu dans les services, situations numérotées 1 à 3.
const home = await client.fetch<{ _id: string; sections: HomeSection[] } | null>(`*[_type == "page" && kind == "home"][0]{_id, sections[]{_key, _type, intro, items[]{_key, title}}}`);
if (home) {
  const patch = client.patch(home._id);
  const cycle = home.sections.find((s) => s._type === "projectCycle");
  const services = home.sections.find((s) => s._type === "serviceNetworks");
  if (cycle && services && !services.intro?.fr && cycle.intro) patch.set({ [`sections[_key=="${services._key}"].intro`]: cycle.intro });
  if (cycle) patch.unset([`sections[_key=="${cycle._key}"]`]);
  const scenarios = home.sections.find((s) => s._type === "scenarios");
  (scenarios?.items ?? []).forEach((item, i) => patch.set({ [`sections[_key=="${scenarios?._key}"].items[_key=="${item._key}"].title`]: renumberScenarioTitle(item.title, i + 1) }));
  await patch.commit();
  console.log(`Accueil : ${cycle ? "schéma du cycle fondu dans les services" : "cycle déjà fondu"}, ${scenarios?.items?.length ?? 0} situations numérotées.`);
}

// 2. Petits textes.
await client.createIfNotExists({ _id: "uiStrings", _type: "uiStrings" });
await client.patch("uiStrings").set({ deliverableLabel: l("Livrable", "Deliverable") }).commit();

// 3. Images des services.
for (const [id, picture] of Object.entries(SCHEMATICS)) {
  await client.patch(id).set({ figureImage: await imageField(picture, SCHEMA_CAPTION) }).commit();
  console.log(`${id} : schéma ${picture.file}`);
}
for (const [id, picture] of Object.entries(HERO_PHOTOS)) {
  await client.patch(id).set({ heroImage: await imageField(picture, PHOTO_CAPTION) }).commit();
  console.log(`${id} : photo ${picture.file}`);
}

// 4. À propos : photo dans le premier écran.
const about = await client.fetch<{ _id: string; hero?: string } | null>(`*[_type == "page" && kind == "about"][0]{_id, "hero": sections[_type == "heroSheet"][0]._key}`);
if (about?.hero) {
  await client.patch(about._id).set({ [`sections[_key=="${about.hero}"].illustration`]: await imageField(ABOUT_PHOTO, PHOTO_CAPTION) }).commit();
  console.log(`${about._id} : photo ${ABOUT_PHOTO.file}`);
}

const drafts = await client.fetch<string[]>(`*[_id in path("drafts.**")]._id`);
if (drafts.length) console.log(`Attention : ${drafts.length} brouillon(s) dans Studio peuvent masquer ces changements : ${drafts.join(", ")}`);
console.log("Terminé.");
