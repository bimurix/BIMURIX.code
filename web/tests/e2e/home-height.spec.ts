import { expect, test } from "@playwright/test";

// decision: ADR-009 n° 10 (cibles de hauteur) et ADR-011 (replis natifs sous 640 px). Mouvement réduit : les lignes liées au défilement sont visibles.
test.use({ reducedMotion: "reduce" });

for (const [width, max] of [[1440, 7500], [360, 11500]] as const) {
  test(`accueil à ${width} px : hauteur sous ${max} px`, async ({ browser }) => {
    const context = await browser.newContext({ viewport: { width, height: 900 }, reducedMotion: "reduce" });
    const page = await context.newPage();
    await page.goto("/", { waitUntil: "load" });
    expect(await page.evaluate(() => document.documentElement.scrollHeight)).toBeLessThan(max);
    await context.close();
  });
}

test("repli natif : fermé à 360 px, contenu dans la page ; déployé à 1440 px", async ({ browser }) => {
  const small = await browser.newContext({ viewport: { width: 360, height: 800 } });
  const m = await small.newPage();
  await m.goto("/");
  const folds = m.locator("#problemes details.bx-fold");
  await expect(folds).toHaveCount(6);
  await expect(folds.first()).not.toHaveAttribute("open", /.*/);
  await expect(folds.first().locator("p")).toBeHidden();
  await folds.first().locator("summary").click(); // un geste suffit pour déplier
  await expect(folds.first().locator("p")).toBeVisible();
  await small.close();

  const wide = await browser.newContext({ viewport: { width: 1440, height: 900 } });
  const d = await wide.newPage();
  await d.goto("/");
  await expect(d.locator("#problemes details.bx-fold").first().locator("p")).toBeVisible();
  await wide.close();
});
