import "server-only";
import { createClient, type SupabaseClient } from "@supabase/supabase-js";

/**
 * Client Supabase avec la clé secrète : contourne RLS, donc réservé au serveur
 * (insertion des demandes). Jamais importé dans un composant client.
 */
export function createAdminClient(): SupabaseClient {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SECRET_KEY;
  if (!url || !key) throw new Error("Supabase non configuré : NEXT_PUBLIC_SUPABASE_URL et SUPABASE_SECRET_KEY requis.");
  return createClient(url, key, { auth: { persistSession: false, autoRefreshToken: false } });
}
