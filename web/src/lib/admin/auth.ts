import "server-only";
import { redirect } from "next/navigation";
import { connection } from "next/server";
import { createUserClient } from "@/lib/supabase/server";

export type AdminContext = { supabase: Awaited<ReturnType<typeof createUserClient>>; userId: string; email: string };

/**
 * Exige un administrateur : utilisateur connecté ET présent dans la liste blanche « admins ».
 * Fail-closed : toute erreur (session, réseau, base) renvoie à la page de connexion.
 * Le contrôle est refait à chaque requête et dans chaque action (jamais seulement dans l'interface).
 */
export async function requireAdmin(): Promise<AdminContext> {
  // Hors du try : l'interruption du pré-rendu par Next ne doit pas être prise pour un refus d'accès.
  await connection();
  let ctx: AdminContext | null = null;
  try {
    const supabase = await createUserClient();
    const { data: userData } = await supabase.auth.getUser();
    const user = userData.user;
    if (user) {
      const { data: admin, error } = await supabase.from("admins").select("user_id").eq("user_id", user.id).maybeSingle();
      if (!error && admin) ctx = { supabase, userId: user.id, email: user.email ?? "" };
    }
  } catch (error) {
    console.error(`[admin] contrôle d'accès : ${(error as Error).message}`);
  }
  if (!ctx) redirect("/admin/connexion");
  return ctx;
}
