// Le Project ID et le dataset ne sont pas secrets : valeurs par défaut pour le développement local.
// decision: ADR-004 (révisé le 2026-11-10) — `development` en local (posé par scripts/db-env.mjs),
// `production` par défaut partout ailleurs (site en ligne).
export const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID ?? "49ul0nhr";
export const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET ?? "production";
export const apiVersion = "2026-11-01";
export const studioBasePath = "/studio";
