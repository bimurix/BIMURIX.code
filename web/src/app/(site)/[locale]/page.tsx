import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { RenderSections } from "@/blocks/render";
import { hasLocale } from "@/lib/i18n/locales";
import { buildMetadata } from "@/lib/seo";
import { getHome } from "@/sanity/content";
import { fetchPublished } from "@/sanity/fetch";
import { SHELL_QUERY } from "@/sanity/queries";
import type { Shell } from "@/sanity/types-content";
import { OrganizationJsonLd } from "@/ui/patterns/OrganizationJsonLd";

export async function generateMetadata({ params }: PageProps<"/[locale]">): Promise<Metadata> {
  const { locale } = await params;
  if (!hasLocale(locale)) notFound();
  const [shell, home] = await Promise.all([fetchPublished<Shell>({ query: SHELL_QUERY }), getHome()]);
  return buildMetadata({ doc: home ?? { kind: "home" }, shell, locale });
}

export default async function HomePage({ params }: PageProps<"/[locale]">) {
  const { locale } = await params;
  if (!hasLocale(locale)) notFound();
  const [shell, home] = await Promise.all([fetchPublished<Shell>({ query: SHELL_QUERY }), getHome()]);

  return (
    <>
      <OrganizationJsonLd shell={shell} locale={locale} />
      <RenderSections sections={home?.sections} ctx={{ locale, shell, titleBlock: home?.titleBlock, isHome: true }} />
    </>
  );
}
