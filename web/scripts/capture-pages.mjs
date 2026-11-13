/**
 * Captures d'écran pleine page du site local, pour montrer le rendu au client.
 * Usage : node scripts/capture-pages.mjs <dossier de sortie> [adresse de base]
 * Adresse de base : 2e argument, sinon CAPTURE_BASE_URL, sinon http://localhost:3100 (serveur de dev).
 * Build de production : node scripts/capture-pages.mjs <dossier> http://localhost:3200 (S5).
 */
import { chromium } from "@playwright/test";
import { mkdirSync } from "node:fs";
import { join } from "node:path";

const out = process.argv[2];
if (!out) throw new Error("Dossier de sortie manquant.");
mkdirSync(out, { recursive: true });

const base = (process.argv[3] ?? process.env.CAPTURE_BASE_URL ?? "http://localhost:3100").replace(/\/$/, "");
const pages = [
  ["01-accueil", "/"],
  ["02-modelisation", "/services/modelisation-bim-coordination"],
  ["03-tuyauterie", "/services/prefabrication-tuyauterie"],
  ["04-gicleurs", "/services/prefabrication-gicleurs"],
  ["05-tuyauterie-gicleurs", "/services/tuyauterie-gicleurs-coordonnes"],
  ["06-bim-7d", "/services/bim-7d-donnees-actifs"],
  ["07-tqc", "/services/tqc-controle-qualite"],
  ["08-a-propos", "/a-propos"],
  ["09-soumission", "/soumission"],
  ["10-accueil-en", "/en"],
  ["11-tuyauterie-en", "/en/services/piping-prefabrication"],
  ["12-a-propos-en", "/en/about"],
  ["13-soumission-en", "/en/quote"],
  ["14-erreur-404", "/page-inexistante"],
];
const shots = pages.flatMap(([name, path]) => [[`${name}-bureau`, path, 1440], [`${name}-mobile`, path, 360]]);

const browser = await chromium.launch();
for (const [name, path, width] of shots) {
  const page = await browser.newPage({ viewport: { width, height: 900 } });
  // « load » et non « networkidle » : la mise à jour en direct de Sanity garde une connexion ouverte.
  await page.goto(base + path, { waitUntil: "load", timeout: 90_000 });
  await page.waitForTimeout(1500);
  // Les images sous la ligne de flottaison se chargent à l'approche : on parcourt la page avant la capture.
  const height = await page.evaluate(() => document.documentElement.scrollHeight);
  for (let y = 0; y < height; y += 700) {
    await page.evaluate((top) => window.scrollTo(0, top), y);
    await page.waitForTimeout(120);
  }
  await page.evaluate(() => window.scrollTo(0, 0));
  await page.waitForTimeout(600);
  console.log(name, "hauteur", height);
  await page.screenshot({ path: join(out, `${name}.png`), fullPage: true });
  await page.close();
  console.log("ok", name);
}
await browser.close();
