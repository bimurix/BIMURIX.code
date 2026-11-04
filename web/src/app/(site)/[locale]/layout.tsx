import type { Metadata } from "next";
import { Archivo, JetBrains_Mono } from "next/font/google";
import { notFound } from "next/navigation";
import { hasLocale, htmlLang, locales } from "@/lib/i18n/locales";
import { fetchPublished } from "@/sanity/fetch";
import { SanityLive } from "@/sanity/live";
import { SHELL_QUERY } from "@/sanity/queries";
import type { Shell } from "@/sanity/types-content";
import { buildNavModel } from "@/ui/patterns/nav-model";
import { SiteFooter } from "@/ui/patterns/SiteFooter";
import { SiteHeader } from "@/ui/patterns/SiteHeader";
import "../../globals.css";

const archivo = Archivo({ subsets: ["latin", "latin-ext"], axes: ["wdth"], variable: "--font-archivo" });
const jetbrains = JetBrains_Mono({ subsets: ["latin"], variable: "--font-jetbrains" });

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
        <SiteHeader shell={shell} locale={locale} model={model} />
        <main id="contenu" className="flex-1">
          {children}
        </main>
        <SiteFooter shell={shell} locale={locale} />
        {/* Rafraîchit la page dès qu'un contenu est publié dans Studio. Brouillons : L4 (édition visuelle). */}
        <SanityLive includeDrafts={false} />
      </body>
    </html>
  );
}
