import type { Locale } from "./i18n/locales";
import type { Localized } from "./i18n/pick";

export type RouteTarget = { _type?: string; kind?: string | null; slug?: Localized } | null | undefined;

export type SanityLink = {
  kind?: "internal" | "external" | "email" | null;
  external?: string | null;
  email?: string | null;
  internal?: RouteTarget;
  serviceId?: string | null;
} | null | undefined;

const localePrefix = (locale: Locale) => (locale === "fr" ? "" : "/en");

/**
 * Adresse publique d'une page ou d'un service. decision: ADR-003.
 * Renvoie null si la page n'existe pas dans cette langue (pas de page EN sans adresse EN).
 */
export function pathFor(target: RouteTarget, locale: Locale): string | null {
  if (!target) return null;
  if (target.kind === "home") return locale === "fr" ? "/" : "/en";
  const slug = target.slug?.[locale];
  if (!slug) return null;
  return `${localePrefix(locale)}/${slug}`;
}

/** Adresse d'un lien Sanity ; null si la cible n'existe pas dans cette langue. */
export function resolveLink(link: SanityLink, locale: Locale): string | null {
  if (!link) return null;
  if (link.kind === "email") return link.email ? `mailto:${link.email}` : null;
  if (link.kind === "external") return localizeExternal(link.external, locale);
  const path = pathFor(link.internal, locale);
  if (!path) return null;
  return link.serviceId ? `${path}?service=${encodeURIComponent(link.serviceId)}` : path;
}

// Un lien « /#services » saisi dans Studio pointe vers la page de la langue courante.
function localizeExternal(url: string | null | undefined, locale: Locale): string | null {
  if (!url) return null;
  if (url.startsWith("#")) return url;
  if (url.startsWith("/") && !url.startsWith("/en") && locale === "en") return `/en${url === "/" ? "" : url}`.replace("/en/#", "/en#");
  return url;
}

export const isExternalHref = (href: string) => /^(https?:|mailto:)/.test(href);
