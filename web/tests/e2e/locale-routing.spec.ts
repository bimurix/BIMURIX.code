import { expect, test, type Page } from "@playwright/test";

// Sur mobile, le sélecteur de langue est dans le menu ; sur bureau, dans l'en-tête.
async function clickLanguage(page: Page, name: string) {
  const menu = page.getByRole("button", { name: "Menu" });
  if (await menu.isVisible()) {
    // Le clic peut précéder l'hydratation : on réessaie jusqu'à ce que le panneau s'ouvre.
    await expect(async () => {
      await menu.click();
      await expect(page.getByRole("dialog")).toBeVisible({ timeout: 1000 });
    }).toPass();
  }
  await page.getByRole("link", { name, exact: true }).filter({ visible: true }).click();
}

test("l'accueil sans préfixe est en français", async ({ page }) => {
  await page.goto("/");
  await expect(page.locator("html")).toHaveAttribute("lang", "fr-CA");
  await expect(page).toHaveURL("/");
});

test("/en est en anglais", async ({ page }) => {
  await page.goto("/en");
  await expect(page.locator("html")).toHaveAttribute("lang", "en-CA");
});

test("/fr redirige vers /", async ({ page }) => {
  await page.goto("/fr");
  await expect(page).toHaveURL("/");
});

test("le lien de langue mène à l'autre version", async ({ page }) => {
  await page.goto("/");
  await clickLanguage(page, "English");
  // Délai large : en dev, /en peut être compilée à la demande au premier passage.
  await expect(page).toHaveURL("/en", { timeout: 15_000 });
  await expect(page.locator("html")).toHaveAttribute("lang", "en-CA");
});
