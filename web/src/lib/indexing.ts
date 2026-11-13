// R-13 : seul le domaine de production s'indexe. Fichier sans import d'alias : next.config.ts le lit aussi.
export const PRODUCTION_SITE = "https://www.bimurix.com";

/**
 * Le déploiement peut-il être indexé ? Faux pour un aperçu de déploiement Netlify (variable CONTEXT autre que « production »)
 * et pour tout domaine différent du domaine final (NEXT_PUBLIC_SITE_URL). Le développement local n'est pas concerné (jamais en ligne).
 */
export function isIndexable(env: Record<string, string | undefined> = process.env): boolean {
  if (env.CONTEXT && env.CONTEXT !== "production") return false;
  return (env.NEXT_PUBLIC_SITE_URL ?? PRODUCTION_SITE).replace(/\/+$/, "") === PRODUCTION_SITE;
}
