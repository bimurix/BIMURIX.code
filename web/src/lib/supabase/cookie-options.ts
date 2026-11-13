import type { CookieOptions } from "@supabase/ssr";

/**
 * Témoins de session du tableau de bord : HttpOnly (le navigateur n'a aucun client Supabase, donc aucun script
 * n'a besoin d'y toucher), SameSite=Lax, Secure en ligne. Valeurs par défaut de @supabase/ssr : HttpOnly faux.
 */
export function hardenCookieOptions(options: CookieOptions | undefined, env: NodeJS.ProcessEnv = process.env): CookieOptions {
  return { ...options, httpOnly: true, sameSite: "lax", secure: env.NODE_ENV === "production" ? true : options?.secure, path: options?.path ?? "/" };
}
