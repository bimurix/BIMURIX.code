import { safeRedirectTarget } from "./redirect-target";

/**
 * Table des adresses publiques lue dans Sanity : pages et services publiés, et redirections.
 * decision: S4 — le statut HTTP (404, 308) doit être connu AVANT le rendu : avec les composants en cache,
 * la page est envoyée en streaming et répond déjà 200 (ou un 308 sans en-tête Location) quand elle découvre
 * que l'adresse est inconnue ou déplacée. Le proxy tranche donc à partir de cette table, sans reconstruction du site.
 */
export type RouteTable = {
  pages: Array<{ fr?: string; en?: string }>;
  redirects: Array<{ from?: string; to?: string; permanent?: boolean }>;
};

// Adresse réservée, pré-générée dans chaque langue : sa page appelle notFound() à la construction, donc la réponse est un
// vrai 404 servi tel quel (aucun rendu en streaming). Le proxy y envoie toute adresse inconnue. decision: S4
export const NOT_FOUND_SLUG = "_404";

export type ContentRouteDecision =
  | { action: "next" }
  | { action: "notFound" }
  | { action: "redirect"; to: string; status: 307 | 308 };

function normalize(pathname: string): string {
  const decoded = pathname.split("/").map((part) => { try { return decodeURIComponent(part); } catch { return part; } }).join("/");
  return decoded.length > 1 ? decoded.replace(/\/+$/, "") : decoded;
}

/**
 * Sert-on cette adresse ? Accueil (`/`, `/en`) et adresses de pages : `next` ; ancienne adresse : redirection ;
 * le reste : `notFound`. Sans table (Sanity injoignable) on ne tranche pas : le rendu garde son comportement habituel.
 */
export function decideContentRoute(table: RouteTable | null, pathname: string): ContentRouteDecision {
  if (!table) return { action: "next" };
  const path = normalize(pathname);
  if (path === "/" || path === "/en") return { action: "next" };

  const isEn = path === "/en" || path.startsWith("/en/");
  const slug = (isEn ? path.slice("/en/".length) : path.slice(1)).replace(/\/+$/, "");
  if (table.pages.some((page) => (isEn ? page.en : page.fr) === slug)) return { action: "next" };

  const moved = table.redirects.find((redirect) => redirect.from && normalize(redirect.from) === path);
  const to = safeRedirectTarget(moved?.to, path); // decision: N6 — jamais vers un autre domaine ni en boucle
  if (to) return { action: "redirect", to, status: moved?.permanent === false ? 307 : 308 };
  return { action: "notFound" };
}
