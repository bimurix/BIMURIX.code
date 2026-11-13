import { client } from "@/sanity/client";
import { errorSummary } from "./safe-log";
import type { RouteTable } from "./route-table";

// Même filtre que DOCUMENT_BY_SLUG_QUERY (pages et services visibles), sans l'accueil ni la page introuvable.
const ROUTE_TABLE_QUERY = `{
  "pages": *[_type in ["page", "service"] && visible != false && !(_type == "page" && kind in ["home", "notFound"]) && defined(slug)]{ "fr": slug.fr, "en": slug.en },
  "redirects": *[_type == "redirect"]{ from, to, permanent }
}`;

// Une requête Sanity par instance et par minute au plus : une page créée ou une redirection ajoutée dans Studio
// est prise en compte en moins d'une minute, sans reconstruction du site. decision: S4.
const TTL_MS = 60_000;
let cached: { at: number; table: RouteTable } | null = null;
let inflight: Promise<RouteTable | null> | null = null;

async function load(): Promise<RouteTable | null> {
  try {
    const table = await client.withConfig({ stega: false }).fetch<RouteTable>(ROUTE_TABLE_QUERY, {}, { signal: AbortSignal.timeout(3_000) });
    cached = { at: Date.now(), table };
    return table;
  } catch (error) {
    console.error(`[proxy] table des adresses illisible : ${errorSummary(error)}`);
    return cached?.table ?? null; // à défaut : dernière table connue, sinon on ne tranche pas
  } finally {
    inflight = null;
  }
}

export function getRouteTable(): Promise<RouteTable | null> {
  if (cached && Date.now() - cached.at < TTL_MS) return Promise.resolve(cached.table);
  // Table périmée : on la sert pendant le rafraîchissement plutôt que de bloquer la requête.
  inflight ??= load();
  return cached ? Promise.resolve(cached.table) : inflight;
}
