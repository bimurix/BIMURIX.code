/**
 * Contenu de départ Bimurix → Sanity (dataset `production`, voir ADR-004 révisé).
 *
 *   pnpm seed                                          crée les documents absents, ne touche pas aux autres
 *   pnpm seed --force --i-know-this-overwrites         remplace tous les documents de départ
 *
 * Le jeton SANITY_API_WRITE_TOKEN est lu depuis l'environnement (web/.env.local).
 */
import { createClient, type IdentifiedSanityDocumentStub } from "@sanity/client";
import { formAndEmails } from "./seed/form-and-emails.mts";
import { legalPages } from "./seed/legal.mts";
import { pages } from "./seed/pages.mts";
import { services1 } from "./seed/services-1.mts";
import { services2 } from "./seed/services-2.mts";
import { singletons } from "./seed/singletons.mts";

const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID ?? "49ul0nhr";
const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET ?? "production";
const token = process.env.SANITY_API_WRITE_TOKEN;
const force = process.argv.includes("--force");

if (!token) {
  console.error("SANITY_API_WRITE_TOKEN manquant : ajoute-le dans web/.env.local (jeton Editor).");
  process.exit(1);
}
// decision: ADR-004 (révisé) — le contenu vit dans `production` : écraser ce que le client a modifié
// dans Studio exige une double confirmation.
if (force && !process.argv.includes("--i-know-this-overwrites")) {
  console.error("Refusé : --force écrase le contenu modifié dans Studio. Ajoute --i-know-this-overwrites pour confirmer.");
  process.exit(1);
}

const client = createClient({ projectId, dataset, token, apiVersion: "2026-11-01", useCdn: false });
const documents: IdentifiedSanityDocumentStub[] = [...singletons, ...formAndEmails, ...services1, ...services2, ...pages, ...legalPages];

const tx = client.transaction();
for (const doc of documents) {
  if (force) tx.createOrReplace(doc);
  else tx.createIfNotExists(doc);
}

await tx.commit({ visibility: "async" });
console.log(`${documents.length} documents ${force ? "remplacés" : "créés s'ils étaient absents"} dans ${projectId}/${dataset}.`);
