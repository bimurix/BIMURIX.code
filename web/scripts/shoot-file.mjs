/** Capture pleine page d'un fichier HTML local : node scripts/shoot-file.mjs entree.html sortie.png [largeur] */
import { chromium } from "@playwright/test";
import { pathToFileURL } from "node:url";
import { resolve } from "node:path";
const [input, output, width = "1100"] = process.argv.slice(2);
const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: Number(width), height: 800 }, deviceScaleFactor: 2 });
await page.goto(pathToFileURL(resolve(input)).href);
await page.screenshot({ path: output, fullPage: true });
await browser.close();
