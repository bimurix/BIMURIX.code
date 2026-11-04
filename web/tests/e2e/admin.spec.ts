import { existsSync } from "node:fs";
import { resolve } from "node:path";
import { createClient } from "@supabase/supabase-js";
import { expect, test, type Page } from "@playwright/test";

// Tests du tableau de bord : pile locale requise (pnpm db:start, node scripts/db-env.mjs, pnpm admin:add).
const envFile = resolve(__dirname, "../../.env.development.local");
const ready = existsSync(envFile);
if (ready) process.loadEnvFile(envFile);
const MAILPIT = "http://127.0.0.1:54424";
const ADMIN = "contact@bimurix.com";

test.describe.configure({ mode: "serial" });
test.skip(!ready, "pile Supabase locale non configurée");

/** Connexion par lien magique : le lien est lu dans Mailpit (aucun courriel réel). */
async function magicLogin(page: Page, email: string) {
  const since = Date.now();
  await page.goto("/admin/connexion");
  await expect(async () => {
    await page.locator("#email").fill(email);
    await page.getByRole("button", { name: "Recevoir un lien de connexion" }).click();
    await expect(page.getByRole("status")).toContainText("Si cette adresse est autorisée", { timeout: 3000 });
  }).toPass({ timeout: 20_000 });

  let link = "";
  await expect(async () => {
    const res = await page.request.get(`${MAILPIT}/api/v1/search?query=${encodeURIComponent(`to:"${email}"`)}`);
    const { messages } = (await res.json()) as { messages: Array<{ ID: string; Created: string }> };
    const recent = messages.find((m) => new Date(m.Created).getTime() >= since - 2000);
    expect(recent).toBeTruthy();
    const msg = (await (await page.request.get(`${MAILPIT}/api/v1/message/${recent!.ID}`)).json()) as { Text: string };
    link = msg.Text.match(/https?:\/\/\S+verify\S+/)?.[0] ?? "";
    expect(link).not.toBe("");
  }).toPass({ timeout: 15_000 });
  await page.goto(link);
}

test("sans session : /admin renvoie vers la connexion", async ({ page }) => {
  await page.goto("/admin");
  await expect(page).toHaveURL(/\/admin\/connexion$/);
});

test("la clé publique ne lit aucune demande (RLS)", async () => {
  const anon = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!);
  const { data, error } = await anon.from("quote_requests").select("id").limit(1);
  expect(error ?? data?.length === 0).toBeTruthy();
});

test("un compte connecté mais non admin est refusé", async ({ page }, info) => {
  test.skip(info.project.name !== "desktop", "une fois par exécution");
  const email = `non-admin-${Date.now()}@example.com`;
  const admin = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SECRET_KEY!, { auth: { persistSession: false } });
  await admin.auth.admin.createUser({ email, email_confirm: true });
  await magicLogin(page, email);
  await expect(page).toHaveURL(/\/admin\/connexion$/);
});

test("admin : voit la demande, change le statut, ajoute une note et répond", async ({ page }, info) => {
  test.skip(info.project.name !== "desktop", "une fois par exécution");
  // Une demande récente à traiter (créée via le vrai formulaire par quote-form.spec.ts, sinon par la clé serveur).
  const server = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SECRET_KEY!, { auth: { persistSession: false } });
  const reference = `BX-T${Date.now().toString(36).slice(-5).toUpperCase()}`;
  await server.from("quote_requests").insert({
    reference, locale: "fr", full_name: "Client Essai", company: "Essai inc.", email: `client-${Date.now()}@example.com`,
    preferred_language: "fr", service: "service-tqc", description: "Demande créée par le test du tableau de bord.",
    consent_at: new Date().toISOString(), consent_policy_version: "2026-11",
  });

  await magicLogin(page, ADMIN);
  await expect(page.getByRole("heading", { name: "Demandes de soumission" })).toBeVisible();
  await page.getByRole("link", { name: reference }).click();
  await expect(page.getByRole("heading", { name: "Client Essai" })).toBeVisible({ timeout: 15_000 });

  await page.locator("#request-status").selectOption("in_review");
  await expect(page.getByText("Statut : En cours")).toBeVisible();

  await page.locator("#note").fill("Rappeler mardi.");
  await page.getByRole("button", { name: "Ajouter la note" }).click();
  await expect(page.getByText("Rappeler mardi.")).toBeVisible();

  await page.locator("#reply-subject").fill(`Votre demande ${reference}`);
  await page.locator("#reply-body").fill("Bonjour, merci pour votre demande.");
  await page.getByRole("button", { name: "Envoyer la réponse" }).click();
  await expect(page.getByText("Réponse envoyée.", { exact: true })).toBeVisible({ timeout: 15_000 });

  const { data } = await server.from("quote_requests").select("status, last_reply_at").eq("reference", reference).single();
  expect(data?.status).toBe("replied");
  expect(data?.last_reply_at).not.toBeNull();
});
