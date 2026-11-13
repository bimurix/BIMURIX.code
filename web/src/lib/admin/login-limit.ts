// S-05 : limite d'envois du lien de connexion. Un seul facteur protège /admin (la boîte courriel) ;
// on évite au moins qu'on puisse inonder cette boîte ou épuiser le quota d'envoi du fournisseur.
export const LOGIN_MAX_PER_IP = 5; // par 10 minutes : la sixième demande est refusée
export const LOGIN_WINDOW_MS = 10 * 60 * 1000;
export const LOGIN_MAX_GLOBAL_PER_HOUR = 30; // filet quand l'IP n'est pas connue de façon fiable

export function loginAllowed(counts: { perIp: number | null; global: number }): boolean {
  if (counts.perIp !== null && counts.perIp >= LOGIN_MAX_PER_IP) return false;
  return counts.global < LOGIN_MAX_GLOBAL_PER_HOUR;
}
