import { expect, test } from "@playwright/test";

// Contenu de départ publié dans Sanity (dataset production) : une adresse FR et son équivalent EN.
const pages = [
  { fr: "/a-propos", en: "/en/about" },
  { fr: "/soumission", en: "/en/quote" },
  { fr: "/services/modelisation-bim-coordination", en: "/en/services/bim-modeling-coordination" },
  { fr: "/services/prefabrication-mep", en: "/en/services/mep-prefabrication" },
  { fr: "/services/bim-7d-donnees-actifs", en: "/en/services/bim-7d-asset-data" },
  { fr: "/services/tqc-controle-qualite", en: "/en/services/as-built-quality-control" },
  { fr: "/confidentialite", en: "/en/privacy" },
  { fr: "/conditions", en: "/en/terms" },
];

for (const { fr, en } of pages) {
  test(`${fr} ↔ ${en} : un H1, hreflang croisés`, async ({ page }) => {
    for (const path of [fr, en]) {
      const res = await page.goto(path);
      expect(res?.status()).toBe(200);
      await expect(page.locator("h1")).toHaveCount(1);
      await expect(page.locator('link[rel="alternate"][hreflang="fr-CA"]')).toHaveAttribute("href", new RegExp(`${fr}$`));
      await expect(page.locator('link[rel="alternate"][hreflang="en-CA"]')).toHaveAttribute("href", new RegExp(`${en}$`));
    }
  });
}

test("une adresse inconnue répond 404 avec la page introuvable", async ({ page }) => {
  const res = await page.goto("/cette-page-n-existe-pas");
  expect(res?.status()).toBe(404);
  await expect(page.locator("h1")).toHaveCount(1);
});

test("le sélecteur de langue garde la page courante", async ({ page, isMobile }) => {
  test.skip(isMobile, "couvert sur bureau");
  await page.goto("/services/prefabrication-mep");
  await page.getByRole("link", { name: "English", exact: true }).click();
  await expect(page).toHaveURL("/en/services/mep-prefabrication");
});

test("sitemap et robots", async ({ request }) => {
  const sitemap = await request.get("/sitemap.xml");
  expect(sitemap.status()).toBe(200);
  expect(await sitemap.text()).toContain("/en/services/mep-prefabrication");
  const robots = await (await request.get("/robots.txt")).text();
  expect(robots).toContain("Disallow: /studio");
});
