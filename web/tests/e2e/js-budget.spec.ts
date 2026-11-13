import { gzipSync } from "node:zlib";
import { expect, test } from "@playwright/test";

// decision: ADR-010 — budget de JS initial 155 Ko (155 000 octets gzip, 1 Ko = 1000 octets), même méthode que scripts/measure-js.mjs.
// Valable sur le build de production seulement (le mode dev charge beaucoup plus de code).
const BUDGET = 155_000;
test.skip(!process.env.PLAYWRIGHT_PROD, "mesure sur le build de production (PLAYWRIGHT_PROD=1)");

for (const path of ["/", "/en", "/soumission"]) {
  test(`JS initial de ${path} ≤ 155 Ko`, async ({ request }) => {
    const html = await (await request.get(path)).text();
    const tags = [...html.matchAll(/<script\b[^>]*\bsrc="([^"]+)"[^>]*>/g)].filter((m) => !/\bnoModule\b/i.test(m[0]));
    const srcs = [...new Set(tags.map((m) => m[1]))];
    let total = 0;
    for (const src of srcs) total += gzipSync(await (await request.get(src)).body(), { level: 6 }).length;
    expect(srcs.length).toBeGreaterThan(3);
    expect(total).toBeLessThanOrEqual(BUDGET);
  });
}
