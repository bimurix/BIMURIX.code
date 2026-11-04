/**
 * Contenu de départ Bimurix → Sanity (dataset de développement).
 *
 *   pnpm seed            crée les documents absents, ne touche pas à ceux qui existent
 *   pnpm seed --force    remplace tous les documents de départ (écrase les modifications !)
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
const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET ?? "development";
const token = process.env.SANITY_API_WRITE_TOKEN;
const force = process.argv.includes("--force");

if (!token) {
  console.error("SANITY_API_WRITE_TOKEN manquant : ajoute-le dans web/.env.local (jeton Editor).");
  process.exit(1);
}
if (dataset === "production" && !process.argv.includes("--allow-production")) {
  console.error("Refusé : le seed ne s'exécute pas sur le dataset production sans --allow-production.");
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
