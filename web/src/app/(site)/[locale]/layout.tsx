import type { Metadata } from "next";
import { Archivo, JetBrains_Mono } from "next/font/google";
import { notFound } from "next/navigation";
import { hasLocale, htmlLang, locales } from "@/lib/i18n/locales";
import { SanityLive } from "@/sanity/live";
import "../../globals.css";

const archivo = Archivo({ subsets: ["latin", "latin-ext"], axes: ["wdth"], variable: "--font-archivo" });
const jetbrains = JetBrains_Mono({ subsets: ["latin"], variable: "--font-jetbrains" });

// Valeurs de secours : le titre réel viendra de Sanity (settings) en L2.
export const metadata: Metadata = {
  title: "Bimurix",
};

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

export default async function SiteLayout({ children, params }: LayoutProps<"/[locale]">) {
  const { locale } = await params;
  if (!hasLocale(locale)) notFound();

  return (
    <html lang={htmlLang[locale]} className={`${archivo.variable} ${jetbrains.variable} antialiased`}>
      <body className="min-h-dvh">
        {children}
        {/* Rafraîchit la page dès qu'un contenu est publié dans Studio. Brouillons : L4 (édition visuelle). */}
        <SanityLive includeDrafts={false} />
      </body>
    </html>
  );
}
