import type { Locale } from "./locales";

export type Localized<T = string> = { fr?: T | null; en?: T | null } | null | undefined;

/**
 * Valeur d'un champ { fr, en } pour la langue demandée.
 * decision: ADR-003 — pas de repli FR sur la version EN (pas de page mélangée) :
 * une valeur absente donne la valeur de secours fournie par le code.
 */
export function pick<T = string>(value: Localized<T>, locale: Locale, fallback: T): T {
  const v = value?.[locale];
  if (v === null || v === undefined) return fallback;
  if (typeof v === "string" && v.trim() === "") return fallback;
  return v;
}
