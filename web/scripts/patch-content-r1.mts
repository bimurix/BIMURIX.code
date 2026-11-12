/**
 * R1 (ADR-007) — remet le contenu d'origine du site dans le dataset `development` et y intègre les prestations du
 * document v3.1 : 6 services, accueil, À propos, soumission, menu, pied de page, textes de l'interface.
 * Les documents du seed sont remplacés (createOrReplace) ; le logo et l'icône déjà téléversés dans `settings` sont conservés.
 * `formSettings` et `emailTemplates` appartiennent à la révision du formulaire (R2) : ils ne sont jamais touchés ici.
 * Refuse tout autre dataset que `development` (jamais `production`).
 *
 *   NEXT_PUBLIC_SANITY_DATASET=development pnpm exec sanity exec scripts/patch-content-r1.mts --with-user-token
 */
import { getCliClient } from "sanity/cli";
import { seedDocuments } from "./seed/documents.mts";

const RESERVED_TO_R2 = ["formSettings", "emailTemplates"];

const client = getCliClient({ apiVersion: "2026-11-01", useCdn: false });
const { projectId, dataset } = client.config();
const documents = seedDocuments.filter((d) => !RESERVED_TO_R2.includes(d._id));
console.log(`Cible : ${projectId}/${dataset} (${documents.length} documents)`);
if (dataset !== "development") {
  console.error(`Refusé : ce script n'écrit que dans « development » (cible : « ${dataset} »).`);
  process.exit(1);
}

const brand = await client.fetch<Record<string, unknown> | null>(`*[_id == "settings"][0]{logo, logoInverse, favicon}`);
const tx = client.transaction();
for (const doc of documents) {
  const keep = doc._id === "settings" ? Object.fromEntries(Object.entries(brand ?? {}).filter(([, v]) => v)) : {};
  tx.createOrReplace({ ...doc, ...keep });
}
await tx.commit();
console.log(`${documents.length} documents remplacés dans ${projectId}/${dataset}.`);
