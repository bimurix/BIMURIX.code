import type { Locale } from "@/lib/i18n/locales";
import type { Localized } from "@/lib/i18n/pick";
import type { Section } from "@/blocks/render";
import type { ImageAsset, TitleBlockData } from "./types-content";
import type { ServiceDoc } from "@/ui/patterns/ServicePage";
import { fetchPublished } from "./fetch";
import { DOCUMENT_BY_SLUG_QUERY, HOME_QUERY, NOT_FOUND_QUERY, SLUGS_QUERY } from "./queries";

export type Seo = { title?: Localized; description?: Localized; noIndex?: boolean; image?: ImageAsset } | null;

export type PageDoc = {
  _id: string;
  _type: "page";
  kind?: string;
  title?: Localized;
  slug?: Localized;
  titleBlock?: TitleBlockData;
  updatedLabel?: Localized;
  seo?: Seo;
  sections?: Section[];
};

export type RoutedDoc = PageDoc | (ServiceDoc & { _type: "service"; slug?: Localized; seo?: Seo });

export const getHome = () => fetchPublished<PageDoc>({ query: HOME_QUERY });
export const getNotFoundPage = () => fetchPublished<PageDoc>({ query: NOT_FOUND_QUERY });

export function getDocumentBySlug(locale: Locale, slug: string) {
  return fetchPublished<RoutedDoc>({ query: DOCUMENT_BY_SLUG_QUERY, params: { locale, slug } });
}

/** Paramètres à pré-générer pour [locale]/[...slug] (une adresse par langue disponible). */
export async function getAllSlugParams(): Promise<Array<{ locale: Locale; slug: string[] }>> {
  const rows = (await fetchPublished<Array<{ fr?: string; en?: string }>>({ query: SLUGS_QUERY })) ?? [];
  return rows.flatMap((row) => (["fr", "en"] as const).flatMap((locale) => (row[locale] ? [{ locale, slug: row[locale].split("/") }] : [])));
}
