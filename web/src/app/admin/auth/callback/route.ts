import { NextResponse, type NextRequest } from "next/server";
import { createUserClient } from "@/lib/supabase/server";

// Retour du lien magique : échange le code contre une session, puis ouvre le tableau de bord.
// Le contrôle « est-ce un admin ? » est fait ensuite par requireAdmin() sur chaque page.
export async function GET(request: NextRequest) {
  const code = request.nextUrl.searchParams.get("code");
  const target = new URL("/admin", request.nextUrl.origin);
  if (!code) return NextResponse.redirect(new URL("/admin/connexion?erreur=lien", request.nextUrl.origin));
  try {
    const supabase = await createUserClient();
    const { error } = await supabase.auth.exchangeCodeForSession(code);
    if (error) throw error;
  } catch (error) {
    console.error(`[admin] connexion : ${(error as Error).message}`);
    return NextResponse.redirect(new URL("/admin/connexion?erreur=lien", request.nextUrl.origin));
  }
  return NextResponse.redirect(target);
}
