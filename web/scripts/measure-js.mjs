/**
 * Méthode UNIQUE de mesure du JS initial (T6-C, R-20). Remplace les mesures ad hoc de N6, R3, S5 et T2.
 *
 *   node scripts/measure-js.mjs [adresseDeBase] [chemin...]
 *   node scripts/measure-js.mjs http://localhost:3200 / /services/tuyauterie-plomberie /soumission
 *
 * Définition (à ne pas changer sans mettre à jour docs/audits et ce commentaire) :
 *  - build de production servi par `next start` (jamais le mode dev) ;
 *  - « JS initial » = les fichiers `<script src>` du HTML de la page, SANS ceux marqués `noModule`
 *    (polyfills des vieux navigateurs, jamais chargés par un navigateur moderne), dédoublonnés ;
 *    les scripts chargés plus tard par import dynamique ne comptent pas ;
 *  - taille = octets réellement transférés avec `Accept-Encoding: gzip` (corps compressé reçu du serveur) ;
 *  - 1 Ko = 1000 octets (unité SI ; le budget est de 155 Ko = 155 000 octets, ADR-010). L'écart 149,6 / 153,2 de l'audit S5 et de la
 *    session T2 vient de cette seule unité : mêmes octets, divisés par 1024 (S5) ou par 1000 (T2). Les deux sont affichés.
 * Sortie : une ligne par page, le détail des fichiers les plus lourds, et un code de sortie 1 si une page dépasse le budget.
 */
import http from "node:http";
import https from "node:https";
import { gzipSync } from "node:zlib";

// decision: ADR-010 — 155 Ko (mesuré 154,3 Ko au 2026-11-13 ; le plancher de Next 16 + React 19 est ≈ 126 Ko). Même valeur dans tests/e2e/js-budget.spec.ts.
const BUDGET = 155_000;
const [base = "http://localhost:3200", ...rest] = process.argv.slice(2);
const paths = rest.length ? rest : ["/", "/en", "/services/tuyauterie-plomberie", "/soumission"];

function get(url) {
  return new Promise((resolve, reject) => {
    const lib = url.startsWith("https") ? https : http;
    lib.get(url, { headers: { "accept-encoding": "gzip" } }, (res) => {
      const chunks = [];
      res.on("data", (c) => chunks.push(c));
      res.on("end", () => resolve({ status: res.statusCode ?? 0, encoding: res.headers["content-encoding"], body: Buffer.concat(chunks) }));
    }).on("error", reject);
  });
}

const gunzipIfNeeded = async (r) => (r.encoding === "gzip" ? (await import("node:zlib")).gunzipSync(r.body) : r.body);

/** Taille transférée : corps gzip reçu ; si le serveur ne compresse pas, gzip niveau 6 (celui de `next start`). */
function transferred(r) {
  return r.encoding === "gzip" ? r.body.length : gzipSync(r.body, { level: 6 }).length;
}

const fmt = (n, unit) => `${(n / unit).toFixed(1).replace(".", ",")} Ko`;
let over = false;

for (const path of paths) {
  const page = await get(new URL(path, base).href);
  const html = (await gunzipIfNeeded(page)).toString("utf8");
  const tags = [...html.matchAll(/<script\b[^>]*\bsrc="([^"]+)"[^>]*>/g)];
  const srcs = [...new Set(tags.filter((m) => !/\bnoModule\b/i.test(m[0])).map((m) => m[1]))];
  const sizes = [];
  for (const src of srcs) sizes.push({ src, bytes: transferred(await get(new URL(src, base).href)) });
  const total = sizes.reduce((a, s) => a + s.bytes, 0);
  const legacy = tags.length - srcs.length;
  if (total > BUDGET) over = true;
  console.log(`${path.padEnd(36)} ${String(total).padStart(7)} o = ${fmt(total, 1000)} (${fmt(total, 1024)} en Kio) — ${srcs.length} fichiers, ${legacy} noModule ignoré(s) — HTTP ${page.status}`);
  if (process.env.DETAIL) for (const s of sizes.sort((a, b) => b.bytes - a.bytes).slice(0, 8)) console.log(`    ${String(s.bytes).padStart(7)}  ${s.src}`);
}
console.log(`Budget : ${BUDGET / 1000} Ko (${BUDGET} octets) — ${over ? "DÉPASSÉ" : "respecté"}`);
process.exit(over ? 1 : 0);
