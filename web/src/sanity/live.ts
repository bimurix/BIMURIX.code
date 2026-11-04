import { defineLive, type StrictDefinedFetchType } from "next-sanity/live";
import { client } from "./client";

// Jeton de lecture facultatif : nécessaire seulement pour les brouillons (édition visuelle, L4).
const token = process.env.SANITY_API_READ_TOKEN;

export const { sanityFetch, SanityLive } = defineLive({
  client,
  serverToken: token,
  browserToken: token,
  strict: true,
});

// Seule frontière 'use cache' pour le contenu Sanity : la publication dans Studio
// invalide les tags et <SanityLive /> rafraîchit la page ouverte.
export const cachedSanity: StrictDefinedFetchType = async (options) => {
  "use cache";
  return sanityFetch(options);
};
