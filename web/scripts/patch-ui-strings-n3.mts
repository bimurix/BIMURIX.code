/**
 * Ajoute les petits textes de l'étape N3 au document `uiStrings` existant, sans rien écraser (setIfMissing).
 * Refuse d'écrire ailleurs que dans le dataset `development` (ADR-004 révisé).
 *
 *   NEXT_PUBLIC_SANITY_DATASET=development pnpm exec sanity exec scripts/patch-ui-strings-n3.mts --with-user-token
 */
import { getCliClient } from "sanity/cli";
import { uiStringsN3 } from "./seed/ui-strings-n3.mts";

const client = getCliClient({ apiVersion: "2026-11-01", useCdn: false });
const { projectId, dataset } = client.config();
console.log(`Cible : ${projectId}/${dataset}`);
if (dataset !== "development") {
  console.error(`Refusé : ce script n'écrit que dans « development » (cible : « ${dataset} »).`);
  process.exit(1);
}

await client.createIfNotExists({ _id: "uiStrings", _type: "uiStrings" });
await client.patch("uiStrings").setIfMissing(uiStringsN3).commit();
console.log(`${Object.keys(uiStringsN3).length} textes ajoutés s'ils étaient absents.`);
