import type { Metadata } from "next";
import { Archivo, JetBrains_Mono } from "next/font/google";
import { Suspense } from "react";
import "../globals.css";

const archivo = Archivo({ subsets: ["latin", "latin-ext"], axes: ["wdth"], variable: "--font-archivo" });
const jetbrains = JetBrains_Mono({ subsets: ["latin"], variable: "--font-jetbrains" });

export const metadata: Metadata = {
  title: "Tableau de bord | Bimurix",
  robots: { index: false, follow: false },
};

// Le tableau de bord lit la session à chaque requête : rendu bloquant assumé (Cache Components).
export const instant = false;

/** Racine du tableau de bord (FR seulement, mode « Operate » : dense et sobre). */
export default function AdminRootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fr-CA" className={`${archivo.variable} ${jetbrains.variable} antialiased`}>
      <body className="min-h-dvh bg-paper-2">
        <Suspense fallback={<div className="p-8 text-[15px] text-ink-2">Chargement…</div>}>{children}</Suspense>
      </body>
    </html>
  );
}
