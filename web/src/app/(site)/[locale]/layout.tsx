import type { Metadata } from "next";
import { Archivo, JetBrains_Mono } from "next/font/google";
import { notFound } from "next/navigation";
import Link from "next/link";
import { hasLocale, htmlLang, locales } from "@/lib/i18n/locales";
import { fetchPublished } from "@/sanity/fetch";
import { SanityLive } from "@/sanity/live";
import { SHELL_QUERY } from "@/sanity/queries";
import type { Shell } from "@/sanity/types-content";
import { buildNavModel } from "@/ui/patterns/nav-model";
import { OrganizationJsonLd } from "@/ui/patterns/OrganizationJsonLd";
import { LaunchBanner } from "@/ui/patterns/LaunchBanner";
import { SiteFooter } from "@/ui/patterns/SiteFooter";
import { SiteHeader } from "@/ui/patterns/SiteHeader";
import "../../globals.css";

// decision: T6-C (R-22) — voir docs/audits/2026-11-13_seo-perf-t6.md.
const liveUpdates = process.env.NODE_ENV !== "production" || process.env.NEXT_PUBLIC_SANITY_LIVE === "1";

// R-23 : « latin » couvre le français (é, à, ç, œ) ; « latin-ext » (86 Ko, préchargé) n'est jamais utilisé. JetBrains Mono ne sert qu'aux données : pas de préchargement.
const archivo = Archivo({ subsets: ["latin"], axes: ["wdth"], variable: "--font-archivo" });
const jetbrains = JetBrains_Mono({ subsets: ["latin"], variable: "--font-jetbrains", preload: false });

// Valeurs de secours : titres et descriptions réels par page (SEO Sanity) en L4.
export const metadata: Metadata = {
  title: "Bimurix",
  icons: { icon: [{ url: "/favicon.ico", sizes: "48x48" }, { url: "/favicon.svg", type: "image/svg+xml" }], apple: "/apple-touch-icon.png" },
  manifest: "/site.webmanifest",
};

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

export default async function SiteLayout({ children, params }: LayoutProps<"/[locale]">) {
  const { locale } = await params;
  if (!hasLocale(locale)) notFound();
  const shell = await fetchPublished<Shell>({ query: SHELL_QUERY });
  const model = buildNavModel(shell, locale);

  return (
    <html lang={htmlLang[locale]} className={`${archivo.variable} ${jetbrains.variable} antialiased`}>
      <body className="flex min-h-dvh flex-col">
        <OrganizationJsonLd shell={shell} locale={locale} />
        <SiteHeader shell={shell} locale={locale} model={model} />
        <LaunchBanner shell={shell} locale={locale} />
        <main id="contenu" className="flex-1">
          {children}
        </main>
        <SiteFooter shell={shell} locale={locale} />
        {/* Barre d'action du mobile (plan v5 § 6.1) : CSS seulement, voir .bx-actionbar dans globals.css. */}
        {model.cta && (
          <div className="bx-actionbar border-t-[1.5px] border-ink bg-paper px-4 py-2">
            <Link href={model.cta.href} className="flex min-h-(--bx-tap-min) items-center justify-center bg-blue px-5 text-[15px] font-semibold text-paper hover:bg-blue-deep">
              {model.cta.label}
            </Link>
          </div>
        )}
        {/* R-22 / S-07 : mises à jour en direct réservées au développement (ou à NEXT_PUBLIC_SANITY_LIVE=1). Pour les visiteurs,
            elles coûtent du script et gardent une connexion ouverte vers Sanity ; le contenu se renouvelle seul (cache de 15 min). */}
        {liveUpdates && <SanityLive includeDrafts={false} />}
      </body>
    </html>
  );
}
