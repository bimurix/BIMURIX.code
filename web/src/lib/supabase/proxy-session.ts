import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

// Pages du tableau de bord accessibles sans session.
const PUBLIC_ADMIN = ["/admin/connexion", "/admin/auth/callback"];

/**
 * Rafraîchit la session Supabase du tableau de bord (cookies) avant le rendu, et renvoie tout de suite
 * vers la connexion (307) quand il n'y a aucune session. Vérification « optimiste » seulement :
 * le vrai contrôle d'accès (liste blanche admins) est fait côté serveur par requireAdmin().
 */
export async function refreshAdminSession(request: NextRequest): Promise<NextResponse> {
  let response = NextResponse.next({ request });
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;
  const isPublic = PUBLIC_ADMIN.some((p) => request.nextUrl.pathname.startsWith(p));
  const toLogin = () => NextResponse.redirect(new URL("/admin/connexion", request.url));
  // Sans configuration Supabase : aucune session possible (fail-closed).
  if (!url || !key) return isPublic ? response : toLogin();

  const supabase = createServerClient(url, key, {
    cookies: {
      getAll: () => request.cookies.getAll(),
      setAll: (list) => {
        for (const { name, value } of list) request.cookies.set(name, value);
        response = NextResponse.next({ request });
        for (const { name, value, options } of list) response.cookies.set(name, value, options);
      },
    },
  });
  const { data } = await supabase.auth.getUser().catch(() => ({ data: { user: null } }));
  if (!data.user && !isPublic) return toLogin();
  return response;
}
