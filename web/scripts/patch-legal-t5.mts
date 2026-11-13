/**
 * T5 (sécurité et Loi 25) — remplace le texte des deux pages légales (politique de confidentialité, conditions)
 * dans le dataset `development` par le texte complet de `scripts/seed/legal.mts` (FR et EN). La date de mise à jour
 * « (exemple) » reste en place : elle bloque la mise en ligne tant que le client n'a pas fait valider le texte.
 * Idempotent. Refuse tout autre dataset que `development` (jamais `production`).
 *
 *   NEXT_PUBLIC_SANITY_DATASET=development pnpm exec sanity exec scripts/patch-legal-t5.mts --with-user-token
 */
import { getCliClient } from "sanity/cli";
import { legalBodies } from "./seed/legal.mts";

const client = getCliClient({ apiVersion: "2026-11-01", useCdn: false });
const { projectId, dataset } = client.config();
console.log(`Cible : ${projectId}/${dataset}`);
if (dataset !== "development") {
  console.error(`Refusé : ce script n'écrit que dans « development » (cible : « ${dataset} »).`);
  process.exit(1);
}

for (const [id, body] of Object.entries(legalBodies)) {
  const doc = await client.fetch<{ sections?: Array<{ _key: string; _type: string }> } | null>(`*[_id == $id][0]{ sections[]{ _key, _type } }`, { id });
  const section = doc?.sections?.find((s) => s._type === "richText");
  if (!section) {
    console.error(`${id} : bloc de texte introuvable (lancer « pnpm seed » d'abord)`);
    process.exitCode = 1;
    continue;
  }
  await client.patch(id).set({ [`sections[_key=="${section._key}"].body`]: body }).commit();
  console.log(`${id} : texte remplacé`);
}
