// Le Project ID et le dataset ne sont pas secrets : valeurs par défaut pour le développement local.
// decision: ADR-004 — dataset `development` en local, `production` à la mise en ligne.
export const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID ?? "49ul0nhr";
export const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET ?? "development";
export const apiVersion = "2026-11-01";
export const studioBasePath = "/studio";
