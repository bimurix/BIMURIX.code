/** Capture d'une page (ou d'une section) : node scripts/shoot-url.mjs <chemin> <sortie.png> [largeur] [sélecteur CSS] */
import { chromium } from "@playwright/test";
const [path, out, width = "1440", selector] = process.argv.slice(2);
const base = (process.env.CAPTURE_BASE_URL ?? "http://localhost:3100").replace(/\/$/, "");
const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: Number(width), height: 900 } });
await page.goto(base + path, { waitUntil: "load", timeout: 90_000 });
await page.waitForTimeout(2500);
const height = await page.evaluate(() => document.documentElement.scrollHeight);
for (let y = 0; y < height; y += 700) { await page.evaluate((t) => window.scrollTo(0, t), y); await page.waitForTimeout(100); }
await page.evaluate(() => window.scrollTo(0, 0));
await page.waitForTimeout(500);
if (selector) await page.locator(selector).first().screenshot({ path: out });
else await page.screenshot({ path: out, fullPage: true });
await browser.close();
