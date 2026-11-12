import { expect, test } from "@playwright/test";

// Contenu de départ (ADR-007 : 6 services) lu dans le dataset Sanity de développement : une adresse FR et son équivalent EN.
const pages = [
  { fr: "/a-propos", en: "/en/about" },
  { fr: "/soumission", en: "/en/quote" },
  { fr: "/services/modelisation-bim-coordination", en: "/en/services/bim-modeling-coordination" },
  { fr: "/services/prefabrication-tuyauterie", en: "/en/services/piping-prefabrication" },
  { fr: "/services/prefabrication-gicleurs", en: "/en/services/sprinkler-prefabrication" },
  { fr: "/services/tuyauterie-gicleurs-coordonnes", en: "/en/services/coordinated-piping-sprinklers" },
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
  await page.goto("/services/prefabrication-tuyauterie");
  await page.getByRole("link", { name: "English", exact: true }).click();
  await expect(page).toHaveURL("/en/services/piping-prefabrication");
});

test("sitemap et robots", async ({ request }) => {
  const sitemap = await request.get("/sitemap.xml");
  expect(sitemap.status()).toBe(200);
  const xml = await sitemap.text();
  expect(xml).toContain("/en/services/piping-prefabrication");
  for (const slug of ["modelisation-bim-coordination", "prefabrication-tuyauterie", "prefabrication-gicleurs", "tuyauterie-gicleurs-coordonnes", "bim-7d-donnees-actifs", "tqc-controle-qualite"]) {
    expect(xml, slug).toContain(slug);
  }
  const robots = await (await request.get("/robots.txt")).text();
  expect(robots).toContain("Disallow: /studio");
});

test("les six services répondent 200 en FR et en EN (adresses d'origine conservées)", async ({ request }) => {
  for (const path of ["/services/modelisation-bim-coordination", "/en/services/as-built-quality-control", "/services/tqc-controle-qualite", "/en/services/bim-modeling-coordination"]) {
    expect((await request.get(path)).status(), path).toBe(200);
  }
});

test("l'ancienne adresse « préfabrication MEP » redirige vers la nouvelle", async ({ request }) => {
  const fr = await request.get("/services/prefabrication-mep", { maxRedirects: 0 });
  expect([307, 308]).toContain(fr.status());
  expect(fr.headers().location).toContain("/services/prefabrication-tuyauterie");
  const en = await request.get("/en/services/mep-prefabrication", { maxRedirects: 0 });
  expect([307, 308]).toContain(en.status());
  expect(en.headers().location).toContain("/en/services/piping-prefabrication");
});

test("chaque page de service affiche pour qui, ses forfaits et qui fait quoi", async ({ page }) => {
  // Modélisation et TQC n'ont aucun forfait : la section des forfaits n'apparaît pas.
  const expected: Record<string, string[]> = {
    "/services/modelisation-bim-coordination": [],
    "/services/tqc-controle-qualite": [],
    "/services/prefabrication-tuyauterie": ["F-01", "F-02"],
    "/services/prefabrication-gicleurs": ["F-03"],
    "/services/tuyauterie-gicleurs-coordonnes": ["F-04"],
    "/services/bim-7d-donnees-actifs": ["F-05"],
  };
  for (const [path, codes] of Object.entries(expected)) {
    await page.goto(path);
    await expect(page.getByRole("heading", { name: "Pour qui", level: 2 })).toBeVisible();
    await expect(page.getByRole("heading", { name: "Qui fait quoi", level: 2 })).toBeVisible();
    if (codes.length === 0) await expect(page.locator("#forfaits")).toHaveCount(0);
    else await expect(page.locator("#forfaits")).toBeVisible();
    for (const code of codes) await expect(page.locator("#forfaits tbody tr").filter({ hasText: code })).toHaveCount(1);
    await expect(page.locator("#contenu")).toContainText(/ing[ée]nieur/);
  }
});
