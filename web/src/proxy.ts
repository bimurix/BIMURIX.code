import { NextResponse, type NextRequest } from "next/server";
import { resolveRoute } from "@/lib/i18n/resolve-route";
import { INTERNAL_HEADER, notFoundResponse } from "@/lib/not-found-response";
import { decideContentRoute, NOT_FOUND_SLUG } from "@/lib/route-table";
import { getRouteTable } from "@/lib/route-table-source";
import { refreshAdminSession } from "@/lib/supabase/proxy-session";

// Page publique anglaise (les fichiers statiques, même sous /en, ne passent pas par la table des adresses).
const isEnglishPage = (pathname: string) => /^\/en(\/|$)/.test(pathname) && !/\.[a-z0-9]+$/i.test(pathname);

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  if (pathname === "/admin" || pathname.startsWith("/admin/")) return refreshAdminSession(request);

  const decision = resolveRoute(pathname);
  const url = request.nextUrl.clone();
  if (decision.action === "redirect") {
    url.pathname = decision.pathname;
    return NextResponse.redirect(url, 308);
  }
  const english = isEnglishPage(pathname);
  const serve = () => {
    if (decision.action !== "rewrite") return NextResponse.next();
    url.pathname = decision.pathname;
    return NextResponse.rewrite(url);
  };
  if (decision.action === "next" && !english) return NextResponse.next();
  // Lecture interne du gabarit 404 par notFoundResponse : servi tel quel, sans retrier l'adresse.
  if (request.headers.has(INTERNAL_HEADER)) return serve();

  // decision: S4 — le statut (404, 308 + Location) est décidé ici, avant le rendu en streaming (qui répondrait 200).
  const content = decideContentRoute(await getRouteTable(), pathname);
  if (content.action === "redirect") return NextResponse.redirect(new URL(content.to, request.url), content.status);
  if (content.action === "notFound") {
    const locale = english ? "en" : "fr";
    const response = await notFoundResponse(request, locale);
    if (response) return response;
    url.pathname = `/${locale}/${NOT_FOUND_SLUG}`; // repli : même page, mais le statut dépend alors du rendu
    return NextResponse.rewrite(url);
  }
  return serve();
}

export const config = {
  // Exclut les fichiers internes de Next et les images optimisées ; le reste est trié par resolveRoute.
  matcher: ["/((?!_next/static|_next/image).*)"],
};
