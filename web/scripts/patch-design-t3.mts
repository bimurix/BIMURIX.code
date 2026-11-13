/**
 * T3 (cahier v6, icônes et photos) — met le dataset `development` au diapason du nouveau rendu :
 *  1. Symboles au trait : remplit le champ `icon` des lignes (problèmes, raisons, livrables, étapes, « à envoyer »,
 *     réassurance) et `cardIcon` des six services, d'après la table de `seed/icons-t3.mts`.
 *  2. Photos (voir `patch-photos-t3.mts`, même garde, même esprit).
 * Ne remplace jamais un symbole déjà choisi dans Studio, ne retire aucune image ; relançable sans effet de plus.
 * Refuse tout autre dataset que `development` (jamais `production`).
 *
 *   NEXT_PUBLIC_SANITY_DATASET=development pnpm exec sanity exec scripts/patch-design-t3.mts --with-user-token
 */
import { getCliClient } from "sanity/cli";
import { iconSlots, SERVICE_ICONS } from "./seed/icons-t3.mts";

const client = getCliClient({ apiVersion: "2026-11-01", useCdn: false });
const { projectId, dataset } = client.config();
console.log(`Cible : ${projectId}/${dataset}`);
if (dataset !== "development") {
  console.error(`Refusé : ce script n'écrit que dans « development » (cible : « ${dataset} »).`);
  process.exit(1);
}

type Doc = { _id: string; _type: string } & Record<string, unknown>;
const docs = await client.fetch<Doc[]>(`*[_type in ["service", "page", "formSettings"] && !(_id in path("drafts.**"))]`);

let lines = 0;
for (const doc of docs) {
  const sets: Record<string, string> = {};
  for (const slot of iconSlots(doc)) sets[slot.path] = slot.icon;
  if (doc._type === "service" && !doc.cardIcon && SERVICE_ICONS[doc._id]) sets.cardIcon = SERVICE_ICONS[doc._id];
  const count = Object.keys(sets).length;
  if (count === 0) continue;
  await client.patch(doc._id).set(sets).commit();
  lines += count;
  console.log(`${doc._id} : ${count} symbole(s)`);
}
console.log(lines === 0 ? "Symboles : rien à faire (déjà en place)." : `Symboles posés : ${lines}.`);

const drafts = await client.fetch<string[]>(`*[_id in path("drafts.**")]._id`);
if (drafts.length) console.log(`Attention : ${drafts.length} brouillon(s) dans Studio peuvent masquer ces changements : ${drafts.join(", ")}`);
console.log("Terminé.");
