import { createHash } from "node:crypto";

type HeaderReader = { get(name: string): string | null };

/**
 * Adresse IP du visiteur pour la limite d'envois (S-02).
 * - Sur Netlify (variable lue à l'EXÉCUTION) : seul l'en-tête posé par Netlify fait foi ; X-Forwarded-For
 *   peut être écrit par le client et servirait à contourner la limite.
 * - En production hors Netlify : aucun en-tête n'est cru (on ne sait pas quel mandataire l'a posé) ; la
 *   limite globale prend le relais (submit-quote.ts).
 * - En développement : pas de mandataire, X-Forwarded-For sert aux essais.
 */
export function clientIpFrom(headers: HeaderReader, env: NodeJS.ProcessEnv = process.env): string | undefined {
  if (env.NETLIFY) return headers.get("x-nf-client-connection-ip")?.trim() || undefined;
  if (env.NODE_ENV === "production") return undefined;
  return headers.get("x-forwarded-for")?.split(",")[0]?.trim() || headers.get("x-real-ip")?.trim() || undefined;
}

/** Empreinte salée de l'IP (jamais l'adresse en clair en base). Nulle sans sel ou sans IP. */
export function hashIp(ip: string | undefined, salt: string | undefined): string | null {
  if (!ip || !salt) return null;
  return createHash("sha256").update(`${salt}:${ip}`).digest("hex");
}
