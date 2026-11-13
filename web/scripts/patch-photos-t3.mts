/**
 * T3-B — photos d'illustration (Unsplash, licence Unsplash) importées dans le dataset `development` seulement :
 *  « Pourquoi Bimurix » (accueil et À propos), trois fiches de projets d'exemple, premier écran de À propos (remplacée par une meilleure).
 * Texte alternatif et légende en français et en anglais ; la photo d'une fiche d'exemple reste sous la pastille « Exemple — à remplacer ».
 * Relançable : Sanity reconnaît un fichier déjà importé à son empreinte. Aucune image existante n'est retirée, sauf celle de À propos, remplacée.
 * Refuse tout autre dataset que `development`. Sources et crédits : docs/source/2026-11-12_images-s3b.md.
 *
 *   NEXT_PUBLIC_SANITY_DATASET=development pnpm exec sanity exec scripts/patch-photos-t3.mts --with-user-token
 */
import { createReadStream } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { getCliClient } from "sanity/cli";

const assets = join(dirname(fileURLToPath(import.meta.url)), "assets", "t3");
const l = (fr: string, en: string) => ({ fr, en });
const client = getCliClient({ apiVersion: "2026-11-01", useCdn: false });
const { projectId, dataset } = client.config();
console.log(`Cible : ${projectId}/${dataset}`);
if (dataset !== "development") {
  console.error(`Refusé : ce script n'écrit que dans « development » (cible : « ${dataset} »).`);
  process.exit(1);
}

type Picture = { file: string; alt: { fr: string; en: string }; caption: { fr: string; en: string }; author: string; id: string; slug: string };
const ILLUSTRATIVE = l("Photo d'illustration", "Illustrative photo");
const NOT_THIS_PROJECT = l("Photo d'illustration", "Illustrative photo");

const PHOTOS: Record<string, Picture> = {
  why: { file: "p-pourquoi-plafond.jpg", alt: l("Conduites de gicleurs rouges et chemins de câbles sous une dalle de béton.", "Red sprinkler pipes and cable trays under a concrete slab."), caption: ILLUSTRATIVE, author: "Valentin Lacoste", id: "YkPY2Awkra8", slug: "exposed-industrial-ceiling-with-concrete-beams-red-pipes-and-wiring" },
  residential: { file: "p-projet-residentiel.jpg", alt: l("Plafond technique avec chemins de câbles et conduites.", "Technical ceiling with cable trays and pipes."), caption: NOT_THIS_PROJECT, author: "Valentin Lacoste", id: "8dxZfuDeQf8", slug: "cables-pipes-and-a-white-box-on-a-utility-ceiling" },
  mechanical: { file: "p-projet-salle-mecanique.jpg", alt: l("Tuyauterie en acier inoxydable, brides et vannes d'une salle mécanique.", "Stainless steel piping, flanges and valves in a mechanical room."), caption: NOT_THIS_PROJECT, author: "non relevé (voir le lien)", id: "41X6FwTwPh4", slug: "industrial-metal-pipes-and-valves" },
  modular: { file: "p-projet-modulaire.jpg", alt: l("Ossature d'acier d'un bâtiment modulaire, sous un ciel dégagé.", "Steel frame of a modular building under a clear sky."), caption: NOT_THIS_PROJECT, author: "Laura Cleffmann", id: "MMQwPNWZbUM", slug: "steel-skeleton-of-a-building-under-construction" },
  about: { file: "p-a-propos-structure.jpg", alt: l("Structure d'acier et de verre vue d'en dessous.", "Steel and glass structure seen from below."), caption: ILLUSTRATIVE, author: "Roman Serdyuk", id: "wFFw_xUTXOY", slug: "photo-of-gray-metal-structure-during-daytime" },
};

async function imageField(p: Picture) {
  const asset = await client.assets.upload("image", createReadStream(join(assets, p.file)), {
    filename: p.file,
    contentType: "image/jpeg",
    creditLine: `${p.author} / Unsplash`,
    source: { name: "unsplash", id: p.id, url: `https://unsplash.com/photos/${p.slug}-${p.id}` },
  });
  return { _type: "imageWithAlt", asset: { _type: "reference", _ref: asset._id }, alt: p.alt, caption: p.caption, illustrative: false };
}

type Section = { _key: string; _type: string; heading?: { fr?: string }; items?: Array<{ _key: string }> };
const pages = await client.fetch<Array<{ _id: string; kind: string; sections: Section[] }>>(`*[_type == "page" && kind in ["home", "about"] && !(_id in path("drafts.**"))]{_id, kind, sections[]{_key, _type, heading, "items": items[]{_key}}}`);
for (const page of pages) {
  const sets: Record<string, unknown> = {};
  const why = page.sections.find((s) => s._type === "pointsList" && /pourquoi/i.test(s.heading?.fr ?? ""));
  if (why) sets[`sections[_key=="${why._key}"].image`] = await imageField(PHOTOS.why);
  if (page.kind === "home") {
    const projects = page.sections.find((s) => s._type === "projects");
    const order = [PHOTOS.residential, PHOTOS.mechanical, PHOTOS.modular];
    for (const [i, item] of (projects?.items ?? []).entries()) if (order[i]) sets[`sections[_key=="${projects?._key}"].items[_key=="${item._key}"].image`] = await imageField(order[i]);
  } else {
    const hero = page.sections.find((s) => s._type === "heroSheet");
    if (hero) sets[`sections[_key=="${hero._key}"].illustration`] = await imageField(PHOTOS.about);
  }
  if (Object.keys(sets).length === 0) continue;
  await client.patch(page._id).set(sets).commit();
  console.log(`${page._id} : ${Object.keys(sets).length} photo(s)`);
}
console.log("Terminé.");
