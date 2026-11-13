/**
 * S5 (audit indépendant) — corrections de texte et de bilinguisme dans le dataset `development` :
 *  - nom de la source de la preuve J.M. Brennan en anglais (`sourceNameEn`, facultatif) sur l'accueil, la tuyauterie et tuyauterie + gicleurs ;
 *  - quelques traductions maladroites (EN) et « paquet d'atelier » (FR). Les mêmes textes sont corrigés dans le seed.
 * Remplacement de texte exact, partout où il se trouve : on peut relancer le script sans effet (idempotent).
 * Refuse tout autre dataset que `development` (jamais `production`).
 *
 *   NEXT_PUBLIC_SANITY_DATASET=development pnpm exec sanity exec scripts/patch-content-s5.mts --with-user-token
 */
import { getCliClient } from "sanity/cli";

const client = getCliClient({ apiVersion: "2026-11-01", useCdn: false });
const { projectId, dataset } = client.config();
console.log(`Cible : ${projectId}/${dataset}`);
if (dataset !== "development") {
  console.error(`Refusé : ce script n'écrit que dans « development » (cible : « ${dataset} »).`);
  process.exit(1);
}

const REPLACEMENTS: Array<[string, string]> = [
  ["Handover and operations and maintenance readiness", "Readiness for handover and for operations and maintenance"],
  ["A project to entrust to us?", "Have a project for us?"],
  ["One contact masters both tools: fewer back-and-forths.", "One contact works in both tools: fewer back-and-forths."],
  ["Nous modélisons, nous vérifions, puis vous recevez le paquet d'atelier.", "Nous modélisons, nous vérifions, puis vous recevez le dossier d'atelier."],
  ["We model, we check, then you receive the shop package.", "We model, we check, then you receive the shop drawing set."],
];
const SOURCE_FR = "Étude de cas Trimble MEP";
const SOURCE_EN = "Trimble MEP case study";

type Edit = [path: string, value: unknown];
function walk(node: unknown, path: string, edits: Edit[]): void {
  if (typeof node === "string") {
    const hit = REPLACEMENTS.find(([from]) => node === from);
    if (hit) edits.push([path, hit[1]]);
    return;
  }
  if (Array.isArray(node)) {
    node.forEach((item, i) => {
      const key = item && typeof item === "object" ? (item as { _key?: string })._key : undefined;
      walk(item, `${path}[${key ? `_key=="${key}"` : i}]`, edits);
    });
    return;
  }
  if (node && typeof node === "object") {
    const obj = node as Record<string, unknown>;
    if (obj.sourceName === SOURCE_FR && obj.sourceNameEn !== SOURCE_EN) edits.push([`${path}.sourceNameEn`, SOURCE_EN]);
    for (const [k, v] of Object.entries(obj)) if (!k.startsWith("_")) walk(v, path ? `${path}.${k}` : k, edits);
  }
}

const docs = await client.fetch<Array<Record<string, unknown> & { _id: string }>>(`*[_type in ["page","service"] && !(_id in path("drafts.**"))]`);
let total = 0;
for (const doc of docs) {
  const edits: Edit[] = [];
  walk(doc, "", edits);
  if (!edits.length) continue;
  await edits.reduce((p, [path, value]) => p.set({ [path]: value }), client.patch(doc._id)).commit();
  console.log(`${doc._id} : ${edits.length} champ(s)`);
  total += edits.length;
}
console.log(`${total} champ(s) mis à jour dans ${projectId}/${dataset}.`);
