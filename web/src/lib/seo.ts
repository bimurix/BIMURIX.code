import type { Metadata } from "next";
import { urlForImage } from "@/sanity/image";
import type { Seo } from "@/sanity/content";
import type { Shell } from "@/sanity/types-content";
import { htmlLang, locales, type Locale } from "./i18n/locales";
import { pick, type Localized } from "./i18n/pick";
import { pathFor, type RouteTarget } from "./links";

// Adresse publique du site (domaine définitif par défaut ; NEXT_PUBLIC_SITE_URL pour une préproduction).
export const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://bimurix.com";

type Input = { doc: RouteTarget & { title?: Localized; seo?: Seo }; shell: Shell; locale: Locale };

/**
 * Métadonnées d'une page : titre et description SEO de Sanity, sinon titre de la page + modèle,
 * adresse canonique et équivalents FR/EN (hreflang fr-CA / en-CA).
 */
export function buildMetadata({ doc, shell, locale }: Input): Metadata {
  const settings = shell?.settings as (NonNullable<Shell>["settings"] & { titleTemplate?: Localized; defaultSeo?: Seo }) | undefined;
  const seo = doc.seo;
  const template = pick(settings?.titleTemplate, locale, "%s | Bimurix");
  const pageTitle = pick(doc.title, locale, settings?.siteName ?? "Bimurix");
  const title = pick(seo?.title, locale, "") || template.replace("%s", pageTitle);
  const description = pick(seo?.description, locale, "") || pick(settings?.defaultSeo?.description, locale, "") || undefined;

  const fr = pathFor(doc, "fr");
  const en = pathFor(doc, "en");
  const languages: Record<string, string> = {};
  if (fr) languages[htmlLang.fr] = fr;
  if (en) languages[htmlLang.en] = en;
  if (fr) languages["x-default"] = fr;

  const shareImage = seo?.image?.asset?.url ? seo.image : settings?.defaultSeo?.image;
  // Image de la page : celle téléversée dans Studio, sinon l'image « feuille de plan » générée par /og (R-12).
  const ogImage = shareImage?.asset?.url ? urlForImage(shareImage).width(1200).height(630).fit("crop").url() : shareImagePath(doc, locale);

  return {
    metadataBase: new URL(siteUrl),
    title: { absolute: title },
    description,
    alternates: { canonical: pathFor(doc, locale) ?? undefined, languages },
    openGraph: {
      type: "website",
      siteName: settings?.siteName ?? "Bimurix",
      locale: htmlLang[locale].replace("-", "_"),
      alternateLocale: locales.filter((l) => l !== locale && pathFor(doc, l)).map((l) => htmlLang[l].replace("-", "_")),
      title,
      description,
      images: [{ url: ogImage, width: 1200, height: 630, alt: title }],
    },
    twitter: { card: "summary_large_image", title, description, images: [ogImage] },
    robots: seo?.noIndex ? { index: false, follow: true } : undefined,
  };
}

/** Adresse de l'image de partage générée : /og/fr (accueil) ou /og/en/services/... (même adresse que la page, sans préfixe de langue). */
export function shareImagePath(doc: RouteTarget, locale: Locale): string {
  const slug = doc?.kind === "home" ? "" : (doc?.slug?.[locale] ?? "");
  return `/og/${locale}${slug ? `/${slug}` : ""}`;
}
