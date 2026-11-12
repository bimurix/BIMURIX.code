import { existsSync } from "node:fs";
import { resolve } from "node:path";
import { createClient } from "@supabase/supabase-js";
import { expect, test } from "@playwright/test";

// Le parcours complet exige la pile locale (pnpm db:start) et ses clés (pnpm db:env).
const localStackReady = existsSync(resolve(__dirname, "../../.env.development.local"));
const MAILPIT = "http://127.0.0.1:54424";
if (localStackReady) process.loadEnvFile(resolve(__dirname, "../../.env.development.local"));

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

test("?forfait=F-01 pré-sélectionne le forfait et son offre ; aucun choix ni mention d'appel (R2)", async ({ page }) => {
  await page.goto("/soumission?forfait=F-01");
  await expect(page.locator("#packageCode")).toHaveValue("F-01");
  await expect(page.locator("#service")).not.toHaveValue("");
  // Appel désactivé dans Studio : aucun choix de type, tous les champs de la soumission sont visibles.
  await expect(page.getByRole("radio", { name: /appel/i })).toHaveCount(0);
  await expect(page.locator("form").getByText(/appel de 20|réserver un appel/i)).toHaveCount(0);
  await expect(page.locator("#budget")).toBeVisible();
  await expect(page.locator("#region")).toBeVisible();
  await expect(page.getByRole("button", { name: "Envoyer ma demande" })).toBeVisible();
});

test("soumission avec ?forfait=F-01 : ligne en base (quote + forfait), référence, 2 courriels sans mention d'appel", async ({ page, request }, info) => {
  test.skip(!localStackReady, "pile Supabase locale non configurée (pnpm db:start puis pnpm db:env)");
  test.skip(info.project.name !== "desktop", "une seule demande réelle par exécution");
  const email = `e2e-forfait-${Date.now()}@example.com`;
  await page.setExtraHTTPHeaders({ "x-forwarded-for": `10.1.${Date.now() % 250}.${Math.floor(Math.random() * 250)}` });

  await page.goto("/soumission?forfait=F-01");
  await page.locator("#fullName").fill("Essai Forfait");
  await page.locator("#company").fill("Tests Bimurix");
  await page.locator("#email").fill(email);
  await page.locator("#description").fill("Demande de soumission de test automatisée.");
  await page.locator('input[name="consent"]').check();
  await expect(page.locator('input[name="cf-turnstile-response"]')).not.toHaveValue("", { timeout: 15_000 });
  await page.getByRole("button", { name: "Envoyer ma demande" }).click();

  const status = page.getByRole("status");
  await expect(status).toContainText("Merci pour votre demande.", { timeout: 15_000 });
  await expect(status).not.toContainText(/appel/i);
  const reference = (await status.locator("strong").textContent())?.trim() ?? "";
  expect(reference).toMatch(/^BX-[A-Z0-9]{6}$/);

  const server = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SECRET_KEY!, { auth: { persistSession: false } });
  const { data } = await server.from("quote_requests").select("request_type, package_code").eq("reference", reference).single();
  expect(data).toEqual({ request_type: "quote", package_code: "F-01" });

  await expect(async () => {
    const res = await request.get(`${MAILPIT}/api/v1/search?query=${encodeURIComponent(reference)}`);
    const { messages } = (await res.json()) as { messages: Array<{ ID: string; Subject: string; To: Array<{ Address: string }> }> };
    expect(messages.length).toBe(2);
    expect(messages.some((m) => m.To.some((t) => t.Address === email))).toBe(true);
    expect(messages.every((m) => !/[\r\n]/.test(m.Subject) && !/appel/i.test(m.Subject))).toBe(true);
    for (const m of messages) {
      const full = (await (await request.get(`${MAILPIT}/api/v1/message/${m.ID}`)).json()) as { Text: string };
      expect(full.Text).not.toMatch(/appel|call/i);
      expect(full.Text).toContain("F-01");
    }
  }).toPass({ timeout: 15_000 });
});

test("demande complète : enregistrée, référence affichée, 2 courriels dans Mailpit", async ({ page, request }, info) => {
  test.skip(!localStackReady, "pile Supabase locale non configurée (pnpm db:start puis pnpm db:env)");
  test.skip(info.project.name !== "desktop", "une seule demande réelle par exécution");
  const email = `e2e-${Date.now()}@example.com`;
  // IP fictive propre à ce test (prise en compte en local seulement) : la limite d'envois par IP
  // ne bloque pas les exécutions répétées. Sur Netlify, seul l'en-tête de Netlify compte.
  await page.setExtraHTTPHeaders({ "x-forwarded-for": `10.0.${Date.now() % 250}.${Math.floor(Math.random() * 250)}` });

  await page.goto("/soumission?service=service-gicleurs");
  await expect(page.locator("#region")).toBeVisible();
  await page.locator("#fullName").fill("Essai Automatique");
  await page.locator("#company").fill("Tests Bimurix");
  await page.locator("#email").fill(email);
  await page.locator("#region").selectOption("montreal");
  await page.getByLabel("Revit").check();
  await page.locator("#description").fill("Demande de test automatisée : dessins de gicleurs.");
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

// N6 : sur une connexion lente, le formulaire est affiché avant que son script soit chargé. Un clic sur « Envoyer » ne faisait
// alors rien, et la touche Entrée envoyait les renseignements du visiteur dans l'adresse de la page (formulaire GET).
// Le bouton reste inactif tant que le formulaire n'est pas prêt, puis s'active.
test("connexion lente : le bouton d'envoi est inactif jusqu'au chargement du script, puis actif", async ({ page }) => {
  let release!: () => void;
  const gate = new Promise<void>((resolve) => (release = resolve));
  await page.route("**/_next/static/**/*.js", async (route) => {
    await gate;
    await route.continue();
  });
  await page.goto("/soumission", { waitUntil: "domcontentloaded" });
  const button = page.getByRole("button", { name: "Envoyer ma demande" });
  await expect(button).toBeDisabled();
  release();
  await expect(button).toBeEnabled({ timeout: 20_000 });
});

// N6 : choisir un forfait dans la liste (sans passer par ?forfait=) doit aussi choisir son offre.
test("choisir un forfait dans la liste choisit l'offre correspondante", async ({ page }) => {
  await page.goto("/soumission");
  await expect(async () => {
    await page.locator("#packageCode").selectOption("F-04");
    await expect(page.locator("#service")).not.toHaveValue("", { timeout: 1000 });
  }).toPass({ timeout: 15_000 });
  await expect(page.locator("#service")).toHaveValue("service-combinee");
});
