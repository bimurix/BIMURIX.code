import type { Locale } from "@/lib/i18n/locales";

// decision: ADR-006 n° 13 — date limite saisie dans Studio ; champ vide = aucune date affichée.

/** Date écrite en toutes lettres (« 9 janvier 2027 » / « January 9, 2027 ») ; null si vide ou invalide. */
export function formatDeadline(iso: string | null | undefined, locale: Locale): string | null {
  const m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(iso?.trim() ?? "");
  if (!m) return null;
  const date = new Date(Date.UTC(Number(m[1]), Number(m[2]) - 1, Number(m[3])));
  if (Number.isNaN(date.getTime()) || date.getUTCMonth() !== Number(m[2]) - 1) return null;
  return new Intl.DateTimeFormat(locale === "fr" ? "fr-CA" : "en-CA", { dateStyle: "long", timeZone: "UTC" }).format(date);
}

/** Lien d'un forfait vers le formulaire : `?forfait=<code>` (lu par la page de soumission). */
export function packageHref(quotePath: string | null | undefined, code: string | undefined): string | null {
  if (!quotePath || !code) return null;
  return `${quotePath}?forfait=${encodeURIComponent(code)}`;
}
