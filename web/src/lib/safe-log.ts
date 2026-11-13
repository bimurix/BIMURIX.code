/**
 * Journaux sans renseignement personnel (S-08). Le message brut d'une erreur de base ou de courriel peut contenir
 * la ligne refusée (nom, courriel, description) : on ne journalise que le type, le code et le statut.
 */
export function errorSummary(error: unknown): string {
  if (!error || typeof error !== "object") return "erreur inconnue";
  const e = error as { name?: unknown; code?: unknown; status?: unknown };
  const parts = [e.name, e.code, e.status].filter((v): v is string | number => typeof v === "string" || typeof v === "number");
  return parts.length ? parts.join(" ") : "erreur";
}
