import { NextResponse, type NextRequest } from "next/server";
import { resolveRoute } from "@/lib/i18n/resolve-route";
import { refreshAdminSession } from "@/lib/supabase/proxy-session";

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  if (pathname === "/admin" || pathname.startsWith("/admin/")) return refreshAdminSession(request);

  const decision = resolveRoute(pathname);
  if (decision.action === "next") return NextResponse.next();

  const url = request.nextUrl.clone();
  url.pathname = decision.pathname;
  return decision.action === "rewrite" ? NextResponse.rewrite(url) : NextResponse.redirect(url, 308);
}

export const config = {
  // Exclut les fichiers internes de Next et les images optimisées ; le reste est trié par resolveRoute.
  matcher: ["/((?!_next/static|_next/image).*)"],
};
