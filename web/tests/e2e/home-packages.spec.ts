import { expect, test } from "@playwright/test";

// N4, ADR-007 : l'accueil (contenu d'origine restauré + forfaits) affiche les 5 forfaits d'entrée avec leurs prix, en FR et en EN, et « Choisir ce forfait »
// mène au formulaire avec le forfait pré-sélectionné (contenu du dataset Sanity de développement).
const packages = [
  { code: "F-01", fr: "1 800 $", en: "$1,800" },
  { code: "F-02", fr: "2 200 $", en: "$2,200" },
  { code: "F-03", fr: "1 500 $", en: "$1,500" },
  { code: "F-04", fr: "2 800 $", en: "$2,800" },
  { code: "F-05", fr: "1 200 $", en: "$1,200" },
];

// Espaces insécables et fines : on compare sans tenir compte du type d'espace.
const flat = (text: string | null) => (text ?? "").replace(/[  \s]+/g, " ");

for (const lang of ["fr", "en"] as const) {
  test(`l'accueil ${lang.toUpperCase()} affiche les 5 forfaits avec leurs prix`, async ({ page }) => {
    await page.goto(lang === "fr" ? "/" : "/en");
    const rows = page.locator("#forfaits tbody tr");
    await expect(rows).toHaveCount(5);
    for (const p of packages) {
      const row = rows.filter({ hasText: p.code });
      await expect(row).toHaveCount(1);
      expect(flat(await row.textContent())).toContain(p[lang]);
    }
  });
}

test("« Choisir ce forfait » mène au formulaire avec le forfait pré-sélectionné", async ({ page }) => {
  await page.goto("/");
  const row = page.locator("#forfaits tbody tr").filter({ hasText: "F-03" });
  await row.getByRole("link", { name: /Choisir ce forfait/ }).click();
  await expect(page).toHaveURL(/\/soumission\?forfait=F-03$/);
  await expect(page.locator("#packageCode")).toHaveValue("F-03");
  await expect(page.locator("#service")).toHaveValue("service-gicleurs");
});

test("preuve : 2 chiffres attribués à J.M. Brennan, avec le lien de la source", async ({ page }) => {
  await page.goto("/");
  const proof = page.locator("#preuve");
  await expect(proof).toContainText("J.M. Brennan");
  await expect(proof).not.toContainText("718");
  await expect(proof.locator("dd")).toHaveCount(2);
  await expect(proof.getByRole("link", { name: "Étude de cas Trimble MEP" })).toHaveAttribute("href", /casestudies\.com\/company\/trimble-mep/);
});
