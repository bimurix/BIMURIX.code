/**
 * Hauteur de l'accueil et de chacune de ses sections (cible T3 : < 7 500 px à 1440, < 11 500 px à 360).
 * Usage : node scripts/measure-home.mjs [adresse de base] [chemin]
 */
import { chromium } from "@playwright/test";

const base = (process.argv[2] ?? "http://localhost:3100").replace(/\/$/, "");
const path = process.argv[3] ?? "/";
const browser = await chromium.launch();
for (const width of [1440, 360]) {
  const page = await browser.newPage({ viewport: { width, height: 900 } });
  await page.goto(base + path, { waitUntil: "load", timeout: 90_000 });
  await page.waitForTimeout(3000);
  const h = await page.evaluate(() => document.documentElement.scrollHeight);
  const parts = await page.evaluate(() =>
    [...document.querySelectorAll("main > section, main > div > section, main section")]
      .filter((s) => s.parentElement?.tagName === "MAIN" || s.parentElement?.parentElement?.tagName === "MAIN")
      .map((s) => `${s.id || s.querySelector("h1,h2")?.textContent?.slice(0, 30) || "?"}: ${Math.round(s.getBoundingClientRect().height)}`),
  );
  const h1 = await page.evaluate(() => { const e = document.querySelector("h1"); return e ? Math.round(e.getBoundingClientRect().height / parseFloat(getComputedStyle(e).lineHeight)) : 0; });
  console.log(`${width}px : hauteur ${h} ; lignes du h1 ≈ ${h1}\n  ${parts.join("\n  ")}`);
  await page.close();
}
await browser.close();
