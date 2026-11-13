/**
 * Mesure du LCP, du CLS, du TTFB, du poids transféré et des images du premier écran (T6-C, R-20), sur le build de production.
 * Complète `measure-js.mjs` (JS initial). Téléphone moyen simulé : Pixel 7, réseau 4G lent (1,6 Mb/s, 150 ms), processeur ralenti ×4.
 *
 *   node scripts/measure-vitals.mjs [adresseDeBase] [chemin...]
 *
 * Poids = octets réellement transférés (encodedDataLength de Chrome : compressés). L'INP n'est pas mesuré ici (il exige de vraies
 * interactions) : voir le rapport. Les valeurs varient d'une exécution à l'autre : on affiche la médiane de 3 passes.
 */
import { chromium, devices } from "@playwright/test";

const [base = "http://localhost:3200", ...rest] = process.argv.slice(2);
const paths = rest.length ? rest : ["/", "/services/prefabrication-tuyauterie", "/soumission"];
const RUNS = 3;
const median = (xs) => [...xs].sort((a, b) => a - b)[Math.floor(xs.length / 2)];

async function once(browser, path) {
  const context = await browser.newContext({ ...devices["Pixel 7"] });
  const page = await context.newPage();
  const cdp = await context.newCDPSession(page);
  await cdp.send("Network.enable");
  await cdp.send("Network.emulateNetworkConditions", { offline: false, latency: 150, downloadThroughput: (1.6 * 1024 * 1024) / 8, uploadThroughput: (750 * 1024) / 8 });
  await cdp.send("Emulation.setCPUThrottlingRate", { rate: 4 });
  const types = new Map();
  const sizes = new Map();
  cdp.on("Network.responseReceived", (e) => types.set(e.requestId, { type: e.type, url: e.response.url }));
  cdp.on("Network.loadingFinished", (e) => sizes.set(e.requestId, e.encodedDataLength));
  await page.addInitScript(() => {
    window.__vitals = { lcp: 0, lcpEl: "", cls: 0 };
    new PerformanceObserver((l) => {
      for (const e of l.getEntries()) { window.__vitals.lcp = e.startTime; window.__vitals.lcpEl = e.element ? e.element.tagName + (e.url ? " " + e.url.split("/").pop().slice(0, 40) : "") : ""; }
    }).observe({ type: "largest-contentful-paint", buffered: true });
    new PerformanceObserver((l) => { for (const e of l.getEntries()) if (!e.hadRecentInput) window.__vitals.cls += e.value; }).observe({ type: "layout-shift", buffered: true });
  });
  await page.goto(base + path, { waitUntil: "load" });
  await page.waitForTimeout(2500);
  const v = await page.evaluate(() => ({ ...window.__vitals, ttfb: performance.getEntriesByType("navigation")[0].responseStart }));
  const byType = {};
  let biggestImage = 0;
  for (const [id, size] of sizes) {
    const t = types.get(id);
    if (!t) continue;
    byType[t.type] = (byType[t.type] ?? 0) + size;
    if (t.type === "Image") biggestImage = Math.max(biggestImage, size);
  }
  const total = [...sizes.values()].reduce((a, b) => a + b, 0);
  await context.close();
  return { ...v, total, byType, biggestImage };
}

const browser = await chromium.launch();
for (const path of paths) {
  const runs = [];
  for (let i = 0; i < RUNS; i++) runs.push(await once(browser, path));
  const m = (k) => median(runs.map((r) => r[k]));
  const kb = (n) => `${(n / 1000).toFixed(1).replace(".", ",")} Ko`;
  const t = runs[0].byType;
  console.log(
    `${path.padEnd(36)} LCP ${(m("lcp") / 1000).toFixed(2)} s (${runs[0].lcpEl || "?"}) · CLS ${m("cls").toFixed(3)} · TTFB ${m("ttfb").toFixed(0)} ms · total ${kb(m("total"))}` +
      ` (document ${kb(t.Document ?? 0)}, script ${kb(t.Script ?? 0)}, police ${kb(t.Font ?? 0)}, image ${kb(t.Image ?? 0)}, css ${kb(t.Stylesheet ?? 0)}) · plus grosse image ${kb(m("biggestImage"))}`,
  );
}
await browser.close();
