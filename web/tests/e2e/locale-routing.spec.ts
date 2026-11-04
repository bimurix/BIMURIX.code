import { expect, test } from "@playwright/test";

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
  await page.getByRole("link", { name: "English" }).click();
  await expect(page).toHaveURL("/en");
  await expect(page.locator("html")).toHaveAttribute("lang", "en-CA");
});
