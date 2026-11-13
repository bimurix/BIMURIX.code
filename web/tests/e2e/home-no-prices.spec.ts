import { expect, test } from "@playwright/test";

// ADR-008 : l'accueil ne publie plus aucun prix, forfait ni délai fixe (les forfaits restent dans Studio, masqués) ;
// il montre à la place les problèmes de chantier, les situations types et le tableau « Qui fait quoi » (contenu du dataset de développement).
const PRICE = /\d\s?\$|\$\s?\d/;
const PACKAGE = /forfait|F-0\d|Choisir ce|fixed[- ]price|launch package|choose this package/i;
const FIXED_DELAY = /jours? ouvrables?|business days?|60 jours|60 days|net 15/i;
const RESPONSE_PROMISE = /un jour ouvrable|one business day/gi;

for (const lang of ["fr", "en"] as const) {
  test(`l'accueil ${lang.toUpperCase()} n'affiche ni prix, ni forfait, ni délai fixe`, async ({ page }) => {
    await page.goto(lang === "fr" ? "/" : "/en");
    await expect(page.locator("#forfaits")).toHaveCount(0);
    const text = ((await page.locator("#contenu").innerText()) ?? "").replace(RESPONSE_PROMISE, "");
    expect(text).not.toMatch(PRICE);
    expect(text).not.toMatch(PACKAGE);
    expect(text).not.toMatch(FIXED_DELAY);
    await expect(page.locator("a[href*='forfait=']")).toHaveCount(0);
  });

  test(`l'accueil ${lang.toUpperCase()} montre les situations types, avec leur mention, et « Qui fait quoi »`, async ({ page }) => {
    await page.goto(lang === "fr" ? "/" : "/en");
    const situations = page.locator("#situations");
    await expect(situations).toContainText(lang === "fr" ? /situations types, pas des projets réalisés/i : /typical situations, not completed projects/i);
    await expect(situations).toContainText(lang === "fr" ? "Situation type" : "Typical situation");
    await expect(page.locator("#qui-fait-quoi")).toContainText(lang === "fr" ? /ing[ée]nieur/ : /engineer/);
  });
}

test("le bouton principal de l'accueil mène à la soumission, sans paramètre de forfait", async ({ page }) => {
  await page.goto("/");
  const link = page.getByRole("link", { name: "Demander une soumission" }).filter({ visible: true }).first();
  await expect(link).toHaveAttribute("href", /^\/soumission$/);
});

test("preuve : 2 chiffres attribués à J.M. Brennan, avec le lien de la source", async ({ page }) => {
  await page.goto("/");
  const proof = page.locator("#preuve");
  await expect(proof).toContainText("J.M. Brennan");
  await expect(proof).not.toContainText("718");
  await expect(proof.locator("dd")).toHaveCount(2);
  await expect(proof.getByRole("link", { name: "Étude de cas Trimble MEP" })).toHaveAttribute("href", /casestudies\.com\/company\/trimble-mep/);
});
