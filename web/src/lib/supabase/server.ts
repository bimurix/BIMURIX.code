import "server-only";
import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import { connection } from "next/server";

/**
 * Client Supabase de l'utilisateur connecté (clé publique + cookies de session) :
 * toutes ses requêtes passent par RLS. À utiliser dans le tableau de bord.
 */
export async function createUserClient() {
  // Session lue à chaque requête : jamais pré-rendue (Cache Components). Toujours en premier,
  // sinon une erreur de configuration au build figerait la page en statique.
  await connection();
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;
  if (!url || !key) throw new Error("Supabase non configuré : NEXT_PUBLIC_SUPABASE_URL et NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY requis.");
  const store = await cookies();
  return createServerClient(url, key, {
    cookies: {
      getAll: () => store.getAll(),
      setAll: (list) => {
        // Dans un composant serveur, l'écriture échoue : la session est rafraîchie par le proxy.
        try {
          for (const { name, value, options } of list) store.set(name, value, options);
        } catch {}
      },
    },
  });
}
