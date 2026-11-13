// Reporte les images d'un document sur son remplacement (patch-content-t2.mts). Séparé du script pour être testé sans client Sanity.
const IMAGE_KEYS = ["image", "illustration", "heroImage", "figureImage", "photo", "founderPhoto"];

type Json = unknown;
const isObject = (v: Json): v is Record<string, Json> => !!v && typeof v === "object" && !Array.isArray(v);

/** Reporte sur le nouveau contenu les images de l'ancien : sections appariées par type et rang, autres tableaux par position. */
export function keepImages(next: Json, old: Json, key = ""): Json {
  if (Array.isArray(next)) {
    const before = Array.isArray(old) ? old : [];
    if (key === "sections") {
      const rank: Record<string, number> = {};
      return next.map((section) => {
        const type = isObject(section) ? String(section._type) : "";
        const n = (rank[type] = (rank[type] ?? -1) + 1);
        return keepImages(section, before.filter((o) => isObject(o) && o._type === type)[n]);
      });
    }
    return next.map((item, i) => keepImages(item, before[i]));
  }
  if (isObject(next)) {
    const before = isObject(old) ? old : {};
    const out: Record<string, Json> = {};
    for (const [k, v] of Object.entries(next)) out[k] = IMAGE_KEYS.includes(k) ? v : keepImages(v, before[k], k);
    for (const k of IMAGE_KEYS) if (before[k] && !out[k]) out[k] = before[k];
    return out;
  }
  return next;
}
