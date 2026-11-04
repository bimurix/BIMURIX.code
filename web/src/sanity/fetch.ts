import { cachedSanity } from "./live";

type QueryOptions = { query: string; params?: Record<string, unknown> };

/**
 * Lecture du contenu publié, mise en cache et invalidée par <SanityLive />.
 * Si Sanity est injoignable (dataset absent, réseau), la page s'affiche avec
 * ses valeurs de secours plutôt que de planter ; l'erreur est journalisée côté serveur.
 */
export async function fetchPublished<T>({ query, params = {} }: QueryOptions): Promise<T | null> {
  try {
    const { data } = await cachedSanity({ query, params, perspective: "published", stega: false });
    return (data as T) ?? null;
  } catch (error) {
    console.error(`[sanity] lecture impossible : ${(error as Error).message}`);
    return null;
  }
}
