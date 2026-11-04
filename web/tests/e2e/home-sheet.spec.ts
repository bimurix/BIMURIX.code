import { expect, test } from "@playwright/test";

// Ces tests lisent le contenu publié dans Sanity (dataset production, contenu de départ).

test("un seul H1 et les 4 services listés", async ({ page }) => {
  await page.goto("/");
  await expect(page.locator("h1")).toHaveCount(1);
  await expect(page.locator("#services ol > li")).toHaveCount(4);
});

test("un réseau de la légende ouvre la soumission avec le service choisi", async ({ page }) => {
  await page.goto("/");
  const link = page.locator('a[data-net-i="1"]').filter({ visible: true }).first();
  await expect(link).toHaveAttribute("href", "/soumission?service=service-prefabrication");
});

test("version anglaise : adresses anglaises", async ({ page }) => {
  await page.goto("/en");
  await expect(page.locator('a[data-net-i="0"]').filter({ visible: true }).first()).toHaveAttribute("href", "/en/quote?service=service-modelisation");
  await expect(page.locator("#services a").first()).toHaveAttribute("href", "/en/services/bim-modeling-coordination");
});

test("menu mobile : s'ouvre et se ferme avec Échap", async ({ page, isMobile }) => {
  test.skip(!isMobile, "menu mobile uniquement");
  await page.goto("/");
  const dialog = page.getByRole("dialog");
  // Le clic peut précéder l'hydratation : on réessaie jusqu'à ce que le panneau s'ouvre.
  await expect(async () => {
    await page.getByRole("button", { name: "Menu" }).click();
    await expect(dialog).toBeVisible({ timeout: 1000 });
  }).toPass();
  await page.keyboard.press("Escape");
  await expect(dialog).toBeHidden();
});
