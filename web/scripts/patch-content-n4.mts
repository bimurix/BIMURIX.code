/**
 * N4 — remplace le contenu du dataset `development` par le nouveau contenu (4 offres, forfaits, accueil, à propos,
 * coordonnées, lancement). Les documents existants sont remplacés (createOrReplace) ; le logo et l'icône déjà
 * téléversés dans `settings` sont conservés. Refuse tout autre dataset que `development`.
 *
 *   NEXT_PUBLIC_SANITY_DATASET=development pnpm exec sanity exec scripts/patch-content-n4.mts --with-user-token
 */
import { getCliClient } from "sanity/cli";
import { seedDocuments } from "./seed/documents.mts";

const client = getCliClient({ apiVersion: "2026-11-01", useCdn: false });
const { projectId, dataset } = client.config();
console.log(`Cible : ${projectId}/${dataset} (${seedDocuments.length} documents)`);
if (dataset !== "development") {
  console.error(`Refusé : ce script n'écrit que dans « development » (cible : « ${dataset} »).`);
  process.exit(1);
}

const brand = await client.fetch<Record<string, unknown> | null>(`*[_id == "settings"][0]{logo, logoInverse, favicon}`);
const tx = client.transaction();
for (const doc of seedDocuments) {
  const keep = doc._id === "settings" ? Object.fromEntries(Object.entries(brand ?? {}).filter(([, v]) => v)) : {};
  tx.createOrReplace({ ...doc, ...keep });
}
await tx.commit();
console.log(`${seedDocuments.length} documents remplacés dans ${projectId}/${dataset}.`);
