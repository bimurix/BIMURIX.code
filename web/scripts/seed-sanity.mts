/**
 * Contenu de départ Bimurix → Sanity (dataset `production`, voir ADR-004 révisé).
 *
 *   pnpm seed                                          crée les documents absents, ne touche pas aux autres
 *   pnpm seed --force --i-know-this-overwrites         remplace tous les documents de départ
 *
 * Le jeton SANITY_API_WRITE_TOKEN est lu depuis l'environnement (web/.env.local).
 */
import { readFileSync } from "node:fs";
import { resolve } from "node:path";
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

// decision: ADR-004 (révisé) — le contenu vit dans `production` : écraser ce que le client a modifié
// dans Studio exige une double confirmation.
if (force && !process.argv.includes("--i-know-this-overwrites")) {
  console.error("Refusé : --force écrase le contenu modifié dans Studio. Ajoute --i-know-this-overwrites pour confirmer.");
  process.exit(1);
}

/** Jeton du fichier .env.local, sinon session `sanity login` (via `pnpm seed:login`), sans jeton à copier. */
async function getClient() {
  const apiVersion = "2026-11-01";
  if (token) return createClient({ projectId, dataset, token, apiVersion, useCdn: false });
  // `sanity/cli` ne se charge que sous `sanity exec` : hors de ce contexte, Node plante au lieu de lever une erreur.
  if (process.argv.includes("--cli-session")) {
    const { getCliClient } = await import("sanity/cli");
    return getCliClient({ apiVersion, useCdn: false });
  }
  console.error("Aucun accès en écriture : lance « pnpm exec sanity login » puis « pnpm seed:login », ou ajoute SANITY_API_WRITE_TOKEN dans web/.env.local.");
  process.exit(1);
}

const client = await getClient();
const documents: IdentifiedSanityDocumentStub[] = [...singletons, ...formAndEmails, ...services1, ...services2, ...pages, ...legalPages];

const tx = client.transaction();
for (const doc of documents) {
  if (force) tx.createOrReplace(doc);
  else tx.createIfNotExists(doc);
}

await tx.commit({ visibility: "async" });
console.log(`${documents.length} documents ${force ? "remplacés" : "créés s'ils étaient absents"} dans ${projectId}/${dataset}.`);

// Logo L-01 et icône (ADR-005) : téléversés seulement si le champ est vide dans Studio.
const brandDir = resolve(process.cwd(), "../identite-visuelle");
const brandAssets = [
  { field: "logo", file: "01-logo/svg/bimurix-logo-couleur.svg" },
  { field: "logoInverse", file: "01-logo/svg/bimurix-logo-blanc.svg" },
  { field: "favicon", file: "02-site-web/icon-512.png" },
] as const;

const current = await client.fetch<Record<string, unknown> | null>(`*[_id == "settings"][0]{logo, logoInverse, favicon}`);
for (const { field, file } of brandAssets) {
  if (current?.[field]) continue;
  const asset = await client.assets.upload("image", readFileSync(resolve(brandDir, file)), { filename: file.split("/").pop() });
  await client.patch("settings").setIfMissing({ [field]: { _type: "image", asset: { _type: "reference", _ref: asset._id } } }).commit();
  console.log(`Identité : ${field} ← ${file}`);
}
