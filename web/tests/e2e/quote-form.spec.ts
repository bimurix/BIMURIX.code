import { existsSync } from "node:fs";
import { resolve } from "node:path";
import { expect, test } from "@playwright/test";

// Le parcours complet exige la pile locale (pnpm db:start) et ses clés (pnpm db:env).
const localStackReady = existsSync(resolve(__dirname, "../../.env.development.local"));
const MAILPIT = "http://127.0.0.1:54424";

test("formulaire vide : erreurs sous les champs, rien n'est envoyé", async ({ page }) => {
  await page.goto("/soumission");
  // Le clic peut précéder l'hydratation : on réessaie jusqu'à la réponse de l'action serveur.
  await expect(async () => {
    await page.getByRole("button", { name: "Envoyer ma demande" }).click();
    await expect(page.locator("form").getByRole("alert")).toContainText("L'envoi n'a pas abouti.", { timeout: 3000 });
  }).toPass({ timeout: 20_000 });
  await expect(page.locator("#fullName")).toHaveAttribute("aria-invalid", "true");
  await expect(page.locator("#fullName-error")).toHaveText("Ce champ est obligatoire.");
});

test("le service choisi sur l'accueil est pré-sélectionné", async ({ page }) => {
  await page.goto("/soumission?service=service-prefabrication");
  await expect(page.locator("#service")).toHaveValue("service-prefabrication");
});

test("demande complète : enregistrée, référence affichée, 2 courriels dans Mailpit", async ({ page, request }, info) => {
  test.skip(!localStackReady, "pile Supabase locale non configurée (pnpm db:start puis pnpm db:env)");
  test.skip(info.project.name !== "desktop", "une seule demande réelle par exécution");
  const email = `e2e-${Date.now()}@example.com`;
  // IP fictive propre à ce test (prise en compte en local seulement) : la limite d'envois par IP
  // ne bloque pas les exécutions répétées. Sur Netlify, seul l'en-tête de Netlify compte.
  await page.setExtraHTTPHeaders({ "x-forwarded-for": `10.0.${Date.now() % 250}.${Math.floor(Math.random() * 250)}` });

  await page.goto("/soumission?service=service-tqc");
  await page.locator("#fullName").fill("Essai Automatique");
  await page.locator("#company").fill("Tests Bimurix");
  await page.locator("#email").fill(email);
  await page.locator("#region").selectOption("montreal");
  await page.getByLabel("Revit").check();
  await page.locator("#description").fill("Demande de test automatisée : mise à jour TQC.");
  await page.locator('input[name="consent"]').check();
  // Clé de test Turnstile : le jeton factice arrive en quelques instants.
  await expect(page.locator('input[name="cf-turnstile-response"]')).not.toHaveValue("", { timeout: 15_000 });
  await page.getByRole("button", { name: "Envoyer ma demande" }).click();

  const status = page.getByRole("status");
  await expect(status).toContainText("Merci pour votre demande.", { timeout: 15_000 });
  const reference = (await status.locator("strong").textContent())?.trim();
  expect(reference).toMatch(/^BX-[A-Z0-9]{6}$/);

  await expect(async () => {
    const res = await request.get(`${MAILPIT}/api/v1/search?query=${encodeURIComponent(reference ?? "")}`);
    const { messages } = (await res.json()) as { messages: Array<{ To: Array<{ Address: string }> }> };
    expect(messages.length).toBe(2);
    expect(messages.some((m) => m.To.some((t) => t.Address === email))).toBe(true);
  }).toPass({ timeout: 15_000 });
});
