/* eslint-disable @typescript-eslint/no-explicit-any -- documents Sanity non typés (M1) */
/**
 * M1 — prépare, sans rien écrire en ligne, le contenu à importer dans `production`.
 * Lit `development` en lecture seule (export Sanity), applique les transformations de mise en ligne en mémoire,
 * écrit dans `web/.golive/` (ignoré par Git) : `production-ready.tar.gz`, `transformations.md`, `verification.md`.
 * Aucune fonction d'écriture vers Sanity ici. Refuse tout autre dataset source que `development`.
 *
 *   node scripts/prepare-production.mts [--source development] [--backup .golive/backup-production-2026-11-13.tar.gz]
 * (exige une session Sanity CLI connectée : `sanity login`.)
 */
import { execFileSync } from "node:child_process";
import { cpSync, existsSync, mkdirSync, readdirSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { join, resolve } from "node:path";
import { findPlaceholders } from "../src/lib/placeholders.ts";
import { prepareProduction, type Doc } from "./lib/golive-transform.mts";

const args = process.argv.slice(2);
const opt = (n: string, d: string) => (args.includes(`--${n}`) ? args[args.indexOf(`--${n}`) + 1] : d);
const source = opt("source", "development");
if (source !== "development") {
  console.error(`Refusé : la source doit être « development » (reçu : « ${source} »).`);
  process.exit(1);
}
const root = resolve(import.meta.dirname, "..", ".golive");
const backup = resolve(opt("backup", join(root, "backup-production-2026-11-13.tar.gz")));
const work = join(root, "work");
rmSync(work, { recursive: true, force: true });
mkdirSync(work, { recursive: true });

function sh(cmd: string, a: string[], cwd?: string) {
  return execFileSync(cmd, a, { cwd, stdio: ["ignore", "pipe", "pipe"], shell: cmd === "pnpm" && process.platform === "win32" }).toString();
}
const fwd = (p: string) => p.split("\\").join("/");
function extract(archive: string, into: string) {
  mkdirSync(into, { recursive: true });
  sh("tar", ["--force-local", "-xzf", fwd(archive), "-C", fwd(into)]);
  const dir = join(into, readdirSync(into)[0]);
  const docs = readFileSync(join(dir, "data.ndjson"), "utf8").trim().split("\n").map((l) => JSON.parse(l) as Doc);
  const assets = Object.keys(JSON.parse(readFileSync(join(dir, "assets.json"), "utf8")));
  return { dir, docs, assets };
}

// 1. Export en lecture seule de development
const devArchive = join(root, "development-export.tar.gz");
sh("pnpm", ["exec", "sanity", "dataset", "export", "development", devArchive, "--overwrite"]);
const dev = extract(devArchive, join(work, "dev"));

// 2. Transformations
const { docs, changes } = prepareProduction(dev.docs);

// 3. Archive importable : même structure que l'export, data.ndjson transformé
const outDir = join(work, "out", "production-ready");
cpSync(dev.dir, outDir, { recursive: true });
writeFileSync(join(outDir, "data.ndjson"), docs.map((d) => JSON.stringify(d)).join("\n") + "\n");
const archive = join(root, "production-ready.tar.gz");
sh("tar", ["--force-local", "-czf", fwd(archive), "-C", fwd(join(work, "out")), "production-ready"]);

// 4. transformations.md
const cell = (v: unknown) => (v === null || v === undefined ? "*(vide)*" : "`" + String(v).replace(/`/g, "'").replace(/\|/g, "\\|") + "`");
let md = `# Transformations de mise en ligne (M1)\n\nSource : dataset \`development\` (lecture seule). ${changes.length} changement(s).\n`;
for (const kind of ["vidé", "coupé", "légal"] as const) {
  const rows = changes.filter((c) => c.kind === kind);
  md += `\n## ${kind === "vidé" ? "Valeurs d'exemple vidées" : kind === "coupé" ? "Section Projets coupée" : "Pages légales réécrites (à relire par le client et son conseiller)"} (${rows.length})\n\n`;
  for (const c of rows) md += `- **${c.id}** › \`${c.path}\`\n  - avant : ${cell(c.before)}\n  - après : ${cell(c.after)}\n`;
}
writeFileSync(join(root, "transformations.md"), md);

// 5. Contrôles
const out: string[] = [];
const problems: string[] = [];
const check = (ok: boolean, label: string, detail = "") => {
  out.push(`- ${ok ? "OK" : "ÉCHEC"} : ${label}${detail ? ` — ${detail}` : ""}`);
  if (!ok) problems.push(label);
};
const hits = docs.flatMap((d) => findPlaceholders(d).map((h) => `${d._id}.${h.path}`));
check(hits.length === 0, "aucune valeur d'exemple dans l'export", hits.join(", "));

const reread = extract(archive, join(work, "verify"));
check(reread.docs.length === dev.docs.length, `nombre de documents identique à development (${reread.docs.length}/${dev.docs.length})`);
check(reread.assets.length === dev.assets.length, `nombre d'assets identique à development (${reread.assets.length}/${dev.assets.length})`);
check(findPlaceholders(reread.docs).length === 0, "l'archive relue ne contient aucune valeur d'exemple");

const ids = new Set(docs.map((d) => d._id));
const assetRefs = new Set(dev.assets);
const badRefs: string[] = [];
const incomplete: string[] = [];
const walk = (v: any, id: string, path: string) => {
  if (Array.isArray(v)) return v.forEach((x, i) => walk(x, id, `${path}[${i}]`));
  if (!v || typeof v !== "object") return;
  if (typeof v._ref === "string" && !ids.has(v._ref) && !assetRefs.has(v._ref)) badRefs.push(`${id}${path} → ${v._ref}`);
  if ("fr" in v && "en" in v && typeof v.fr === "string" && v.fr.trim() && !(typeof v.en === "string" && v.en.trim())) incomplete.push(`${id}${path}`);
  for (const [k, x] of Object.entries(v)) if (!k.startsWith("_")) walk(x, id, `${path}.${k}`);
};
docs.forEach((d) => walk(d, d._id, ""));
check(badRefs.length === 0, "références entre documents intactes", badRefs.join(", "));
check(incomplete.length === 0, "aucun champ EN vide quand le FR est rempli (pages EN complètes)", incomplete.join(", "));
const unwanted = docs.filter((d) => d._id.startsWith("drafts.") || d._id.startsWith("_.") || d._type.startsWith("system.") || d._type.startsWith("sanity."));
check(unwanted.length === 0, "aucun brouillon ni document système exporté", unwanted.map((d) => d._id).join(", "));
out.push(`- Types exportés : ${[...new Set(docs.map((d) => d._type))].sort().join(", ")}`);

// 6. Comparaison avec la sauvegarde de production (lecture seule)
if (existsSync(backup)) {
  const prod = extract(backup, join(work, "prod"));
  const prodIds = prod.docs.map((d) => d._id);
  const only = prodIds.filter((i) => !ids.has(i));
  const replaced = prodIds.filter((i) => ids.has(i));
  const added = [...ids].filter((i) => !prodIds.includes(i));
  out.push(`\n## Comparaison avec production (sauvegarde ${backup.split(/[\\/]/).pop()})`);
  out.push(`- Présents dans production, absents de l'export : ${only.length ? only.join(", ") : "aucun"}`);
  out.push(`- Remplacés par l'import (${replaced.length}) : ${replaced.join(", ")}`);
  out.push(`- Créés par l'import (${added.length}) : ${added.join(", ")}`);
  out.push(`- Assets : production ${prod.assets.length}, export ${reread.assets.length}`);
}
writeFileSync(join(root, "verification.md"), `# Vérification de l'export (M1)\n\n${out.join("\n")}\n`);
rmSync(work, { recursive: true, force: true });
console.log(out.join("\n"));
console.log(`\nArchive : ${archive}\nRapport : ${join(root, "transformations.md")}`);
if (problems.length) {
  console.error(`\n${problems.length} contrôle(s) en échec.`);
  process.exit(1);
}
