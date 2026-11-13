import { expect, test } from "@playwright/test";

// T2 (cahier v6, ADR-009) : valeurs d'exemple, accueil, Projets, À propos, Soumission, 404 (contenu du dataset de développement).
const PHONE_EXAMPLE = "514 555-0199 (exemple)";

for (const lang of ["fr", "en"] as const) {
  const prefix = lang === "fr" ? "" : "/en";

  test(`aucun lien tel: nulle part, et le téléphone d'exemple reste du texte simple (${lang.toUpperCase()})`, async ({ page }) => {
    for (const path of [`${prefix}/`, lang === "fr" ? "/a-propos" : "/en/about", lang === "fr" ? "/soumission" : "/en/quote"]) {
      await page.goto(path);
      await expect(page.locator("a[href^='tel:']"), path).toHaveCount(0);
      expect(await page.locator("script[type='application/ld+json']").allInnerTexts().then((t) => t.join(""))).not.toMatch(/555-01|\(exemple\)/);
    }
    await page.goto(`${prefix}/`);
    await expect(page.locator("footer")).toContainText(PHONE_EXAMPLE);
    await expect(page.locator("footer")).toContainText(/Bimurix inc\. \(exemple\) · NEQ 1234567890 \(exemple\)/);
  });

  test(`accueil ${lang.toUpperCase()} : douze sections, « Pourquoi Bimurix », Projets en registre avec trois fiches d'exemple`, async ({ page }) => {
    await page.goto(`${prefix}/`);
    await expect(page.locator("#contenu h1")).toHaveCount(1);
    await expect(page.locator("#contenu > section, #contenu > div")).toHaveCount(12);
    await expect(page.getByRole("heading", { level: 2, name: lang === "fr" ? "Pourquoi confier ce travail à Bimurix" : "Why entrust this work to Bimurix" })).toBeVisible();
    const projects = page.locator("#projets");
    await expect(projects.locator("ol > li")).toHaveCount(3);
    await expect(projects.getByText(lang === "fr" ? "Exemple — à remplacer" : "Example — to be replaced")).toHaveCount(3);
    // T3 / T7 : une fiche avec photo porte un texte alternatif et la légende « Photo d'illustration » ; les fiches 1 et 2 n'ont plus de photo (T7 : sans source ou trompeuse).
    const photos = await projects.locator("img").count();
    expect(photos).toBeLessThanOrEqual(3);
    for (const img of await projects.locator("img").all()) await expect(img).toHaveAttribute("alt", /.{5,}/);
    await expect(projects.getByText(lang === "fr" ? "Photo d'illustration" : "Illustrative photo")).toHaveCount(photos);
    // « Ce qu'il faut nous envoyer » ne figure plus sur l'accueil.
    await expect(page.getByRole("heading", { level: 2, name: lang === "fr" ? "Ce qu'il faut nous envoyer" : "What to send us" })).toHaveCount(0);
    // Réassurance sous le bouton final, sans « gratuit » ni « sans engagement ».
    const text = await page.locator("#contenu").innerText();
    expect(text).toContain(lang === "fr" ? "Nous vous répondons d'ici un jour ouvrable." : "We reply within one business day.");
    expect(text).not.toMatch(/gratuit|sans engagement|free of charge|no obligation/i);
    expect(text).not.toMatch(/\d\s?\$|\$\s?\d/);
  });

  test(`À propos ${lang.toUpperCase()} : fiche « L'entreprise » avec les valeurs d'exemple, sans fondateur`, async ({ page }) => {
    await page.goto(lang === "fr" ? "/a-propos" : "/en/about");
    const company = page.locator("#entreprise");
    await expect(company).toContainText("Bimurix inc. (exemple)");
    await expect(company).toContainText("1234567890 (exemple)");
    await expect(company).toContainText(PHONE_EXAMPLE);
    await expect(company.locator("img")).toHaveCount(0);
    await expect(page.getByRole("heading", { level: 2 }).first()).toBeVisible();
  });

  test(`Soumission ${lang.toUpperCase()} : réassurance à côté du formulaire, budget masqué`, async ({ page }) => {
    await page.goto(lang === "fr" ? "/soumission" : "/en/quote");
    await expect(page.locator("#budget")).toHaveCount(0);
    const aside = page.locator("aside").first();
    await expect(aside).toContainText(lang === "fr" ? "d'ici un jour ouvrable" : "within one business day");
    await expect(aside).toContainText(PHONE_EXAMPLE);
    await expect(aside.getByRole("link", { name: lang === "fr" ? "Politique de confidentialité" : "Privacy policy" })).toBeVisible();
  });

  test(`404 ${lang.toUpperCase()} : titre d'onglet, six services et soumission`, async ({ page }) => {
    const res = await page.goto(`${prefix}/page-inexistante-t2`);
    expect(res?.status()).toBe(404);
    await expect(page).toHaveTitle(lang === "fr" ? "Page introuvable | Bimurix" : "Page not found | Bimurix");
    await expect(page.locator("#contenu a[href*='services/']")).toHaveCount(6);
    await expect(page.locator("#contenu").getByRole("link", { name: lang === "fr" ? "Demander une soumission" : "Request a quote" })).toBeVisible();
  });
}

test("services : phrases de confiance, groupes de prestations, « vanne » (robinets une seule fois)", async ({ page }) => {
  await page.goto("/services/bim-7d-donnees-actifs");
  await expect(page.getByText("Les données manquantes sont signalées, jamais inventées.")).toHaveCount(1);
  for (const group of ["Vérifier", "Structurer", "Préparer la remise"]) await expect(page.getByRole("heading", { level: 3, name: group })).toBeVisible();
  expect(((await page.locator("#contenu").innerText()).match(/robinet/gi) ?? []).length).toBe(1);
  await page.goto("/services/prefabrication-tuyauterie");
  for (const group of ["Réseaux", "Pièces et supports", "Vérifications"]) await expect(page.getByRole("heading", { level: 3, name: group })).toBeVisible();
  await page.goto("/services/tqc-controle-qualite");
  await expect(page.getByText("Un élément n'est jamais présenté comme vérifié sur chantier sans les données qui le prouvent.")).toHaveCount(1);
});
