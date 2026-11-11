/**
 * Cible d'une redirection saisie dans Studio, ou null si elle est refusée.
 * Seules les adresses internes sont suivies (pas de redirection ouverte vers un autre domaine) et une adresse
 * qui renvoie vers elle-même est ignorée (boucle).
 */
export function safeRedirectTarget(to: string | null | undefined, from: string): string | null {
  const target = to?.trim();
  if (!target || !target.startsWith("/") || target.startsWith("//") || target.includes("\\")) return null;
  const strip = (path: string) => path.replace(/\/+$/, "");
  return strip(target) === strip(from) ? null : target;
}
