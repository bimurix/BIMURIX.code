import { locale as rootLocale } from "next/root-params";
import { RenderSections } from "@/blocks/render";
import { hasLocale, type Locale } from "@/lib/i18n/locales";
import { getNotFoundPage } from "@/sanity/content";
import { fetchPublished } from "@/sanity/fetch";
import { SHELL_QUERY } from "@/sanity/queries";
import type { Shell } from "@/sanity/types-content";

// Page 404 bilingue, éditable dans Studio (page de type « Page introuvable »).
export default async function NotFound() {
  const value = await rootLocale();
  const locale: Locale = value && hasLocale(value) ? value : "fr";
  const [shell, page] = await Promise.all([fetchPublished<Shell>({ query: SHELL_QUERY }), getNotFoundPage()]);

  return <RenderSections sections={page?.sections} ctx={{ locale, shell, titleBlock: page?.titleBlock }} />;
}
