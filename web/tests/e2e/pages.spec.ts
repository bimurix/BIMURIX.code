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

test("une adresse inconnue répond 404 avec la page introuvable, en FR et en EN, dès la première visite", async ({ page, request }) => {
  const res = await page.goto("/cette-page-n-existe-pas");
  expect(res?.status()).toBe(404);
  await expect(page.locator("h1")).toHaveCount(1);
  const en = await page.goto("/en/this-page-does-not-exist");
  expect(en?.status()).toBe(404);
  await expect(page.locator("h1")).toHaveCount(1);
  await expect(page.locator("html")).toHaveAttribute("lang", "en-CA");
  // S4 : la page « gabarit » du 404 n'est jamais servie avec un 200.
  expect((await request.get("/_404")).status()).toBe(404);
});

test("le sélecteur de langue garde la page courante", async ({ page, isMobile }) => {
  test.skip(isMobile, "couvert sur bureau");
  await page.goto("/services/prefabrication-tuyauterie");
  await page.getByRole("link", { name: "English", exact: true }).click();
  // R3 : en mode dev, la route EN se compile au premier passage ; 5 s ne suffisent pas sous charge.
  await expect(page).toHaveURL("/en/services/piping-prefabrication", { timeout: 30_000 });
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

test("chaque page de service affiche pour qui, situations types, ce qu'il faut nous envoyer, qui fait quoi et questions ; aucun forfait ni prix", async ({ page }) => {
  // ADR-008 : les forfaits sont masqués dans Studio ; le gabarit v5 (P1 à P11) remplace la section des forfaits.
  const paths = [
    "/services/modelisation-bim-coordination",
    "/services/prefabrication-tuyauterie",
    "/services/prefabrication-gicleurs",
    "/services/tuyauterie-gicleurs-coordonnes",
    "/services/bim-7d-donnees-actifs",
    "/services/tqc-controle-qualite",
  ];
  for (const path of paths) {
    await page.goto(path);
    await expect(page.getByRole("heading", { name: "Pour qui", level: 2 })).toBeVisible();
    await expect(page.getByRole("heading", { name: "Qui fait quoi", level: 2 })).toBeVisible();
    await expect(page.getByRole("heading", { name: "Ce qu'il faut nous envoyer", level: 2 })).toBeVisible();
    await expect(page.getByRole("heading", { name: "Questions sur ce service", level: 2 })).toBeVisible();
    await expect(page.locator("#situations")).toContainText("Situation type");
    await expect(page.locator("#forfaits")).toHaveCount(0);
    const text = (await page.locator("#contenu").innerText()).replace(/un jour ouvrable/g, "");
    expect(text, path).not.toMatch(/\d\s?\$|\$\s?\d|forfait|F-0\d|jours? ouvrables?|60 jours|net 15/i);
    await expect(page.locator("#contenu")).toContainText(/ing[ée]nieur/);
    // Le bouton du haut porte le libellé propre au service et mène à la soumission avec ce service.
    const cta = page.locator("#contenu").getByRole("link", { name: /^Demander une soumission/ }).filter({ visible: true }).first();
    await expect(cta).toHaveAttribute("href", /^\/soumission\?service=service-/);
  }
});
