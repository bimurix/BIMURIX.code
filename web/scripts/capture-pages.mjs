/**
 * Captures d'écran pleine page du site local, pour montrer le rendu au client.
 * Usage : node scripts/capture-pages.mjs <dossier de sortie>
 */
import { chromium } from "@playwright/test";
import { mkdirSync } from "node:fs";
import { join } from "node:path";

const out = process.argv[2];
if (!out) throw new Error("Dossier de sortie manquant.");
mkdirSync(out, { recursive: true });

const base = "http://localhost:3100";
const shots = [
  ["01-accueil-fr-bureau", "/", 1440],
  ["02-accueil-fr-mobile", "/", 360],
  ["03-modelisation-fr-bureau", "/services/modelisation-bim-coordination", 1440],
  ["04-tuyauterie-fr-bureau", "/services/prefabrication-tuyauterie", 1440],
  ["05-gicleurs-fr-bureau", "/services/prefabrication-gicleurs", 1440],
  ["06-tuyauterie-gicleurs-fr-bureau", "/services/tuyauterie-gicleurs-coordonnes", 1440],
  ["07-bim-7d-fr-bureau", "/services/bim-7d-donnees-actifs", 1440],
  ["08-tqc-fr-bureau", "/services/tqc-controle-qualite", 1440],
  ["09-soumission-fr-bureau", "/soumission?forfait=F-01", 1440],
  ["10-accueil-en-bureau", "/en", 1440],
];

const browser = await chromium.launch();
for (const [name, path, width] of shots) {
  const page = await browser.newPage({ viewport: { width, height: 900 } });
  // « load » et non « networkidle » : la mise à jour en direct de Sanity garde une connexion ouverte.
  await page.goto(base + path, { waitUntil: "load", timeout: 90_000 });
  await page.waitForTimeout(2000);
  await page.screenshot({ path: join(out, `${name}.png`), fullPage: true });
  await page.close();
  console.log("ok", name);
}
await browser.close();
