/**
 * Contrôle de mise en ligne (PLAN.md, M1) : liste les valeurs d'exemple encore présentes dans Sanity
 * (téléphone 555, NEQ fictif, mentions « (exemple) »). Code de sortie 1 s'il en reste.
 *   node scripts/check-placeholders.mjs
 */
const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID ?? "49ul0nhr";
const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET ?? "production";
// Même liste que scripts/seed/helpers.mts (PLACEHOLDER_MARKERS).
const MARKERS = ["555-01", "1234567890", "(exemple)", "(example)"];

const query = `*[!(_id in path("drafts.**"))]{_id, _type, "title": coalesce(title.fr, siteName, _id)}`;
const url = `https://${projectId}.apicdn.sanity.io/v2026-11-01/data/query/${dataset}?query=${encodeURIComponent(query)}`;
const ids = (await (await fetch(url)).json()).result ?? [];

const hits = [];
for (const doc of ids) {
  const full = await (await fetch(`https://${projectId}.apicdn.sanity.io/v2026-11-01/data/doc/${dataset}/${doc._id}`)).json();
  const walk = (value, path) => {
    if (typeof value === "string") {
      for (const m of MARKERS) if (value.includes(m)) hits.push(`${doc._id} › ${path} : « ${value.slice(0, 80)} »`);
    } else if (value && typeof value === "object") {
      for (const [k, v] of Object.entries(value)) if (!k.startsWith("_")) walk(v, path ? `${path}.${k}` : k);
    }
  };
  walk(full.documents?.[0], "");
}

if (hits.length) {
  console.log(`${hits.length} valeur(s) d'exemple à remplacer dans Studio avant la mise en ligne :`);
  for (const h of hits) console.log(`  - ${h}`);
  process.exit(1);
}
console.log("Aucune valeur d'exemple : prêt pour la mise en ligne.");
