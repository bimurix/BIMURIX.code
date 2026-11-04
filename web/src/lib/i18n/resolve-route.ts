import { defaultLocale } from "./locales";

export type RouteDecision =
  | { action: "next" }
  | { action: "rewrite"; pathname: string }
  | { action: "redirect"; pathname: string };

// Routes hors site public : pas de préfixe de langue.
const UNLOCALIZED_PREFIXES = ["/studio", "/admin", "/api", "/_next"];

function startsWithSegment(pathname: string, prefix: string): boolean {
  return pathname === prefix || pathname.startsWith(`${prefix}/`);
}

/**
 * Décide comment servir une adresse publique.
 * decision: ADR-003 — `/…` est le FR (réécrit vers `/fr/…` en interne),
 * `/en/…` est servi tel quel, et `/fr/…` est redirigé vers l'adresse sans préfixe
 * pour qu'une page n'ait qu'une seule URL.
 */
export function resolveRoute(pathname: string): RouteDecision {
  if (UNLOCALIZED_PREFIXES.some((p) => startsWithSegment(pathname, p))) {
    return { action: "next" };
  }
  // Fichiers statiques (favicon.ico, robots.txt, images du dossier public…).
  if (/\.[a-z0-9]+$/i.test(pathname)) return { action: "next" };

  if (startsWithSegment(pathname, "/en")) return { action: "next" };

  const defaultPrefix = `/${defaultLocale}`;
  if (startsWithSegment(pathname, defaultPrefix)) {
    return { action: "redirect", pathname: pathname.slice(defaultPrefix.length) || "/" };
  }

  return { action: "rewrite", pathname: pathname === "/" ? defaultPrefix : `${defaultPrefix}${pathname}` };
}
