import { siteUrl } from "@/lib/seo";

const LOCAL_HOST = /^(localhost|127\.0\.0\.1)(:\d{1,5})?$/;

/**
 * Adresse de retour du lien magique (S-04). Elle ne vient JAMAIS telle quelle des en-têtes de la requête
 * (Host et Origin sont contrôlés par l'appelant) : c'est l'adresse configurée du site, sauf en local
 * (hors Netlify) où localhost et 127.0.0.1 sont acceptés pour les essais. Supabase garde en plus sa propre
 * liste d'adresses de retour autorisées (à rendre exacte en ligne).
 */
export function adminCallbackUrl(
  request: { origin: string | null; host: string | null },
  env: NodeJS.ProcessEnv = process.env,
  site: string = siteUrl,
): string {
  const path = "/admin/auth/callback";
  if (!env.NETLIFY) {
    const candidates = [request.origin ? safeHost(request.origin) : null, request.host];
    const local = candidates.find((h) => h && LOCAL_HOST.test(h));
    if (local) return `http://${local}${path}`;
  }
  return `${new URL(site).origin}${path}`;
}

function safeHost(origin: string): string | null {
  try {
    return new URL(origin).host;
  } catch {
    return null;
  }
}
