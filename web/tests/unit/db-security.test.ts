import { execFileSync } from "node:child_process";
import { existsSync } from "node:fs";
import { resolve } from "node:path";
import { createClient, type SupabaseClient } from "@supabase/supabase-js";
import { afterAll, beforeAll, describe, expect, it } from "vitest";

/**
 * T5 — sécurité de la base, contre la pile Supabase LOCALE seulement (pnpm db:start + node scripts/db-env.mjs).
 * Sans pile locale, la suite est ignorée (même règle que les tests e2e du tableau de bord).
 * Les lignes de test sont anonymisées et classées « spam » à la fin : on ne supprime jamais une demande.
 */
const envFile = resolve(__dirname, "../../.env.development.local");
if (existsSync(envFile)) process.loadEnvFile(envFile);
const URL_ = process.env.NEXT_PUBLIC_SUPABASE_URL ?? "";
const reachable = URL_.startsWith("http://127.0.0.1") && (await fetch(`${URL_}/auth/v1/health`).then((r) => r.status < 500, () => false));

function psql(sql: string): string {
  return execFileSync("docker", ["exec", "supabase_db_bimurix", "psql", "-U", "postgres", "-tA", "-c", sql], { encoding: "utf8" }).trim();
}

describe.skipIf(!reachable)("base de données : droits, RLS et anonymisation (T5)", () => {
  const stamp = Date.now();
  const password = `T5-${stamp}-pw!x`;
  let service: SupabaseClient;
  const created: { users: string[]; requests: string[] } = { users: [], requests: [] };
  let nonAdmin: SupabaseClient;
  let admin: SupabaseClient;

  const userClient = () => createClient(URL_, process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!, { auth: { persistSession: false, autoRefreshToken: false } });

  async function makeUser(label: string, isAdmin: boolean) {
    const email = `t5-${label}-${stamp}@example.test`;
    const { data, error } = await service.auth.admin.createUser({ email, password, email_confirm: true });
    if (error) throw error;
    created.users.push(data.user.id);
    if (isAdmin) await service.from("admins").insert({ user_id: data.user.id, email });
    const client = userClient();
    const { error: signInError } = await client.auth.signInWithPassword({ email, password });
    if (signInError) throw signInError;
    return client;
  }

  async function makeRequest(over: Record<string, unknown> = {}) {
    const row = {
      reference: `T5-${Math.random().toString(36).slice(2, 8).toUpperCase()}`,
      locale: "fr", full_name: "Test Cinq", company: "Société Test", email: `t5-${stamp}@example.test`, phone: "514 555 0100",
      preferred_language: "fr", service: "autre", description: "Description de test de la tâche T5.",
      consent_at: new Date().toISOString(), consent_policy_version: "t5", source_path: "/soumission", ip_hash: "t5-hash", ...over,
    };
    const { data, error } = await service.from("quote_requests").insert(row).select("id").single();
    if (error) throw error;
    created.requests.push(data.id);
    return data.id as string;
  }

  beforeAll(async () => {
    service = createClient(URL_, process.env.SUPABASE_SECRET_KEY!, { auth: { persistSession: false, autoRefreshToken: false } });
    nonAdmin = await makeUser("non-admin", false);
    admin = await makeUser("admin", true);
  });

  afterAll(async () => {
    if (!service) return;
    for (const id of created.requests) {
      await admin.rpc("anonymize_quote", { target: id }); // anonymisation de nos lignes de test (jamais de DELETE)
      await service.from("quote_requests").update({ status: "spam" }).eq("id", id);
    }
    for (const id of created.users) await service.auth.admin.deleteUser(id);
  });

  // S-01
  it("un compte connecté non administrateur ne peut pas anonymiser une demande", async () => {
    const id = await makeRequest();
    const { error } = await nonAdmin.rpc("anonymize_quote", { target: id });
    expect(error?.code).toBe("42501");
    const { data } = await service.from("quote_requests").select("anonymized_at, full_name").eq("id", id).single();
    expect(data).toMatchObject({ anonymized_at: null, full_name: "Test Cinq" });
  });

  // S-24 : l'anonymisation vide tout ce qui identifie, garde la ligne, ne supprime rien
  it("un administrateur anonymise : nom, courriel, téléphone, description, échanges vidés ; la ligne reste", async () => {
    const id = await makeRequest();
    await service.from("quote_messages").insert([
      { request_id: id, kind: "note", body: "note confidentielle", subject: "objet" },
      { request_id: id, kind: "outbound", body: "réponse au client", subject: "Re : demande" },
    ]);
    const { error } = await admin.rpc("anonymize_quote", { target: id });
    expect(error).toBeNull();
    const { data: row } = await service.from("quote_requests").select("*").eq("id", id).single();
    expect(row).toMatchObject({ full_name: "Anonymisé", company: "—", phone: null, description: "[contenu anonymisé]", source_path: null, ip_hash: null });
    expect(row.email).toMatch(/@invalid\.local$/);
    expect(row.anonymized_at).not.toBeNull();
    const { data: messages } = await service.from("quote_messages").select("kind, body, subject").eq("request_id", id);
    expect(messages?.some((m) => m.body.includes("confidentielle") || m.body.includes("réponse au client"))).toBe(false);
    expect(messages?.every((m) => m.subject === null)).toBe(true);
  });

  // S-01 (suite) : la conservation automatique continue de fonctionner sans garde « admin »
  it("la tâche de conservation anonymise les demandes de plus de 24 mois, sans administrateur connecté", async () => {
    const old = new Date(Date.now() - 30 * 30 * 86400_000).toISOString();
    const id = await makeRequest({ created_at: old });
    const { data: n, error } = await service.rpc("anonymize_expired_quotes", { months: 24 });
    expect(error).toBeNull();
    expect(n).toBeGreaterThanOrEqual(1);
    const { data } = await service.from("quote_requests").select("anonymized_at, email").eq("id", id).single();
    expect(data?.anonymized_at).not.toBeNull();
    expect(data?.email).toMatch(/@invalid\.local$/);
  });

  it("la fonction interne d'anonymisation n'est appelable ni par un visiteur ni par un compte connecté", async () => {
    const id = await makeRequest();
    for (const client of [userClient(), nonAdmin, admin]) {
      const { error } = await client.rpc("anonymize_quote_internal", { target: id });
      expect(error).not.toBeNull();
    }
  });

  // S-10
  it("un administrateur ne peut modifier que le statut et la date de réponse", async () => {
    const id = await makeRequest();
    const bad = await admin.from("quote_requests").update({ consent_at: "2000-01-01T00:00:00Z" }).eq("id", id);
    expect(bad.error?.code).toBe("42501");
    const bad2 = await admin.from("quote_requests").update({ email: "autre@example.test" }).eq("id", id);
    expect(bad2.error?.code).toBe("42501");
    const ok = await admin.from("quote_requests").update({ status: "in_review", last_reply_at: new Date().toISOString() }).eq("id", id);
    expect(ok.error).toBeNull();
  });

  // S-21
  it("l'empreinte d'IP est purgée après 30 jours", async () => {
    const oldId = await makeRequest({ created_at: new Date(Date.now() - 31 * 86400_000).toISOString() });
    const freshId = await makeRequest();
    const { error } = await service.rpc("purge_old_ip_hashes");
    expect(error).toBeNull();
    const { data: oldRow } = await service.from("quote_requests").select("ip_hash").eq("id", oldId).single();
    const { data: freshRow } = await service.from("quote_requests").select("ip_hash").eq("id", freshId).single();
    expect(oldRow?.ip_hash).toBeNull();
    expect(freshRow?.ip_hash).toBe("t5-hash");
    for (const client of [userClient(), nonAdmin, admin]) expect((await client.rpc("purge_old_ip_hashes")).error).not.toBeNull();
  });

  // RLS sur toutes les tables du schéma public (structure lue dans la base locale)
  it("RLS activé sur chaque table de « public », et aucun droit pour anon", () => {
    let docker = true;
    try { psql("select 1"); } catch { docker = false; }
    if (!docker) return;
    expect(psql("select string_agg(tablename, ',') from pg_tables where schemaname = 'public' and not rowsecurity")).toBe("");
    expect(psql("select count(*) from information_schema.role_table_grants where table_schema = 'public' and grantee = 'anon'")).toBe("0");
    expect(psql("select count(*) from information_schema.routine_privileges where routine_schema = 'public' and grantee = 'anon' and privilege_type = 'EXECUTE'")).toBe("0");
  });
});
