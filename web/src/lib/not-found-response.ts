import { createHash, randomUUID } from "node:crypto";
import { NextResponse, type NextRequest } from "next/server";
import { NOT_FOUND_SLUG } from "./route-table";

type Locale = "fr" | "en";

/** En-tête de la lecture interne du gabarit : le proxy la laisse passer telle quelle (pas de boucle). */
export const INTERNAL_HEADER = "x-bimurix-404-template";

// S-09 : la simple présence de l'en-tête ne suffit plus (un visiteur pouvait l'envoyer pour sauter la décision 404 / 308).
// La valeur est dérivée d'un secret du serveur (même valeur sur toutes les instances, sans rien exposer) ;
// à défaut de secret, une valeur aléatoire par instance.
const instanceFallback = randomUUID();
export function internalHeaderValue(env: NodeJS.ProcessEnv = process.env): string {
  const secret = env.IP_HASH_SALT || env.SUPABASE_SECRET_KEY || instanceFallback;
  return createHash("sha256").update(`bimurix-404-template:${secret}`).digest("hex");
}

/** Vrai seulement pour la lecture interne faite par notFoundResponse (valeur secrète comparée). */
export function isInternalRequest(headers: { get(name: string): string | null }, env: NodeJS.ProcessEnv = process.env): boolean {
  return headers.get(INTERNAL_HEADER) === internalHeaderValue(env);
}

/**
 * Réponse 404 complète (page « introuvable » éditée dans Studio) dont le statut est connu avant l'envoi.
 * Pourquoi : une page rendue en streaming répond 200 avant de découvrir que l'adresse n'existe pas, et un
 * `rewrite` ne peut pas changer le statut. On lit donc la page « introuvable » pré-générée (`/_404` en FR, `/en/_404` en EN,
 * HTML complet servi depuis le cache) et on la renvoie avec le statut 404, sans rendu supplémentaire.
 * La copie reste en mémoire 5 min par instance : un 404 ne coûte alors aucune requête. decision: S4
 */
const TTL_MS = 5 * 60_000;
const copies = new Map<Locale, { at: number; html: string }>();

async function readCopy(origin: string, locale: Locale): Promise<string | null> {
  const hit = copies.get(locale);
  if (hit && Date.now() - hit.at < TTL_MS) return hit.html;
  try {
    const res = await fetch(`${origin}${locale === "en" ? "/en" : ""}/${NOT_FOUND_SLUG}`, { headers: { accept: "text/html", [INTERNAL_HEADER]: internalHeaderValue() }, signal: AbortSignal.timeout(5_000) });
    if (!res.ok && res.status !== 404) return hit?.html ?? null;
    const html = await res.text();
    copies.set(locale, { at: Date.now(), html });
    return html;
  } catch {
    return hit?.html ?? null;
  }
}

/** Réponse 404, ou null si on ne peut pas la fabriquer (le proxy se rabat alors sur la réécriture vers la page « introuvable »). */
export async function notFoundResponse(request: NextRequest, locale: Locale): Promise<NextResponse | null> {
  // Navigation interne de Next (RSC, `?_rsc=`) : on laisse la réécriture répondre en format RSC.
  if (request.nextUrl.searchParams.has("_rsc")) return null;
  const html = await readCopy(request.nextUrl.origin, locale);
  return html ? new NextResponse(html, { status: 404, headers: { "content-type": "text/html; charset=utf-8", "cache-control": "no-store" } }) : null;
}
