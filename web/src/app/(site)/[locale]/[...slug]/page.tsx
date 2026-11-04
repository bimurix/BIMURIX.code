import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { RenderSections } from "@/blocks/render";
import { hasLocale } from "@/lib/i18n/locales";
import { pick } from "@/lib/i18n/pick";
import { buildMetadata } from "@/lib/seo";
import { getAllSlugParams, getDocumentBySlug } from "@/sanity/content";
import { fetchPublished } from "@/sanity/fetch";
import { SHELL_QUERY } from "@/sanity/queries";
import type { Shell } from "@/sanity/types-content";
import { ServicePage } from "@/ui/patterns/ServicePage";

// Pages et services : l'adresse vient de Sanity (ex. « a-propos », « services/prefabrication-mep »).
export async function generateStaticParams() {
  return getAllSlugParams();
}

async function load(params: PageProps<"/[locale]/[...slug]">["params"]) {
  const { locale, slug } = await params;
  if (!hasLocale(locale)) notFound();
  const [shell, doc] = await Promise.all([
    fetchPublished<Shell>({ query: SHELL_QUERY }),
    getDocumentBySlug(locale, slug.map(decodeURIComponent).join("/")),
  ]);
  // L'accueil et la page 404 n'ont pas d'adresse propre.
  if (!doc || (doc._type === "page" && (doc.kind === "home" || doc.kind === "notFound"))) notFound();
  return { locale, shell, doc };
}

export async function generateMetadata({ params }: PageProps<"/[locale]/[...slug]">): Promise<Metadata> {
  const { locale, shell, doc } = await load(params);
  return buildMetadata({ doc, shell, locale });
}

// Route bloquante assumée : les adresses connues sont pré-générées (generateStaticParams) et une adresse
// inconnue doit répondre un vrai 404 (un <Suspense> enverrait 200 avant de savoir que la page n'existe pas).
export const instant = false;

export default async function SlugPage({ params }: PageProps<"/[locale]/[...slug]">) {
  const { locale, shell, doc } = await load(params);

  if (doc._type === "service") return <ServicePage doc={doc} locale={locale} shell={shell} />;

  const updated = pick(doc.updatedLabel, locale, "");
  return (
    <RenderSections
      sections={doc.sections}
      ctx={{ locale, shell, titleBlock: doc.titleBlock, heroAside: updated ? <p className="font-mono text-[13px] text-ink-2">{updated}</p> : undefined }}
    />
  );
}
