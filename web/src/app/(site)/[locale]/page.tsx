import { notFound } from "next/navigation";
import { RenderSections, type Section } from "@/blocks/render";
import { hasLocale } from "@/lib/i18n/locales";
import { fetchPublished } from "@/sanity/fetch";
import { HOME_QUERY, SHELL_QUERY } from "@/sanity/queries";
import type { Shell, TitleBlockData } from "@/sanity/types-content";

type Home = { sections?: Section[]; titleBlock?: TitleBlockData } | null;

export default async function HomePage({ params }: PageProps<"/[locale]">) {
  const { locale } = await params;
  if (!hasLocale(locale)) notFound();

  const [shell, home] = await Promise.all([
    fetchPublished<Shell>({ query: SHELL_QUERY }),
    fetchPublished<Home>({ query: HOME_QUERY }),
  ]);

  return <RenderSections sections={home?.sections} ctx={{ locale, shell, titleBlock: home?.titleBlock }} />;
}
