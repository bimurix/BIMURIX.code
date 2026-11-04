"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import type { Locale } from "@/lib/i18n/locales";
import type { LanguagePair } from "./nav-model";

type Props = { locale: Locale; label: string; pairs: LanguagePair[]; className?: string; onNavigate?: () => void };

// Mène à la même page dans l'autre langue ; à défaut, à l'accueil de l'autre langue (ADR-003).
export function LanguageSwitch({ locale, label, pairs, className = "", onNavigate }: Props) {
  const pathname = usePathname();
  const other: Locale = locale === "fr" ? "en" : "fr";
  const match = pairs.find((p) => p[locale] === pathname);
  const href = match?.[other] ?? (other === "fr" ? "/" : "/en");

  return (
    <Link href={href} hrefLang={other === "fr" ? "fr-CA" : "en-CA"} lang={other === "fr" ? "fr-CA" : "en-CA"} onClick={onNavigate} className={className}>
      {label}
    </Link>
  );
}
