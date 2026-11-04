// decision: ADR-003 — FR par défaut sans préfixe, EN sous /en.
export const locales = ["fr", "en"] as const;
export type Locale = (typeof locales)[number];
export const defaultLocale: Locale = "fr";

export const htmlLang: Record<Locale, string> = { fr: "fr-CA", en: "en-CA" };

export function hasLocale(value: string): value is Locale {
  return (locales as readonly string[]).includes(value);
}
