// Valeurs génériques à remplacer avant la mise en ligne (ADR-009 n° 1 à 5, CLAUDE.md § 4).
// Source unique : le seed (scripts/seed/helpers.mts), le contrôle `pnpm check:placeholders` et le site la lisent.
// Fichier sans import, avec des annotations seulement : Node 24 l'exécute tel quel (seed, scripts).
export const PLACEHOLDER_MARKERS = ["555-01", "1234567890", "(exemple)", "(example)", "Exemple — à remplacer", "Example — to be replaced"];

/** Vrai si le texte porte un marqueur d'exemple : il ne doit alors jamais devenir un lien (`tel:`) ni une donnée structurée. */
export function isPlaceholder(value: unknown): boolean {
  return typeof value === "string" && PLACEHOLDER_MARKERS.some((m) => value.includes(m));
}

/** Chaque valeur d'exemple d'un document, avec son chemin (ex. `items[0].badge.fr`). Les clés commençant par `_` sont ignorées. */
export type PlaceholderHit = { path: string; value: string };
export function findPlaceholders(value: unknown, path = "", out: PlaceholderHit[] = []): PlaceholderHit[] {
  if (typeof value === "string") {
    if (isPlaceholder(value)) out.push({ path, value });
  } else if (Array.isArray(value)) {
    value.forEach((item, i) => findPlaceholders(item, `${path}[${i}]`, out));
  } else if (value && typeof value === "object") {
    for (const [k, v] of Object.entries(value)) if (!k.startsWith("_")) findPlaceholders(v, path ? `${path}.${k}` : k, out);
  }
  return out;
}
