import type { Locale } from "@/lib/i18n/locales";
import { pick } from "@/lib/i18n/pick";
import { pathFor, resolveLink } from "@/lib/links";
import type { NetworkColor, Shell } from "@/sanity/types-content";

export type NavService = { id: string; code: string; network: NetworkColor; label: string; href: string };
export type NavItem = { key: string; label: string; href: string | null; services?: NavService[] };
export type LanguagePair = { fr: string | null; en: string | null };

export type NavModel = {
  items: NavItem[];
  cta: { label: string; href: string } | null;
  languageLabel: string;
  languagePairs: LanguagePair[];
  servicesLabel: string;
  menuLabel: string;
  closeLabel: string;
};

const fallback = {
  fr: { cta: "Demander une soumission", lang: "English", services: "Services", menu: "Menu", close: "Fermer le menu" },
  en: { cta: "Request a quote", lang: "Français", services: "Services", menu: "Menu", close: "Close menu" },
};

export function navServices(shell: Shell, locale: Locale): NavService[] {
  return (shell?.services ?? []).flatMap((s) => {
    const href = pathFor(s, locale);
    return href ? [{ id: s._id, code: s.code ?? "", network: s.network ?? "tqc", label: pick(s.title, locale, ""), href }] : [];
  });
}

/** Prépare le menu côté serveur : libellés de la bonne langue et adresses résolues. */
export function buildNavModel(shell: Shell, locale: Locale): NavModel {
  const t = fallback[locale];
  const nav = shell?.navigation;
  const services = navServices(shell, locale);
  const items = (nav?.items ?? []).map((item) => ({
    key: item._key,
    label: pick(item.label, locale, ""),
    href: resolveLink(item.link, locale),
    services: item.listServices ? services : undefined,
  }));
  const ctaHref = resolveLink(nav?.cta?.link, locale);
  return {
    items: items.filter((i) => i.label && (i.href || i.services?.length)),
    cta: ctaHref ? { label: pick(nav?.cta?.label, locale, t.cta), href: ctaHref } : null,
    languageLabel: pick(nav?.languageLabel, locale, t.lang),
    languagePairs: (shell?.routes ?? []).map((r) => ({ fr: pathFor(r, "fr"), en: pathFor(r, "en") })),
    servicesLabel: pick(shell?.ui?.services, locale, t.services),
    menuLabel: pick(shell?.ui?.menu, locale, t.menu),
    closeLabel: pick(shell?.ui?.closeMenu, locale, t.close),
  };
}
