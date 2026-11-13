import type { Locale } from "@/lib/i18n/locales";
import { pick } from "@/lib/i18n/pick";
import { v5Label, type V5LabelKey } from "@/lib/i18n/v5-labels";
import { pathFor, resolveLink } from "@/lib/links";
import { groupByFamily, shortName, type Family } from "@/lib/services/families";
import type { NetworkColor, Shell } from "@/sanity/types-content";

export type NavService = { id: string; code: string; network: NetworkColor; label: string; href: string; family: string | null };
/** Services d'une famille (titre null = sans groupe : affichage d'avant). */
export type NavGroup = { key: string; label: string | null; services: NavService[] };
export type NavItem = { key: string; label: string; href: string | null; groups?: NavGroup[] };
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
    return href ? [{ id: s._id, code: s.code ?? "", network: s.network ?? "tqc", label: shortName(s, locale), href, family: s.family ?? null }] : [];
  });
}

const familyKey: Record<Family, V5LabelKey> = { modeler: "familyModeler", prefabriquer: "familyPrefabriquer", livrer: "familyLivrer" };

/** Services rangés par famille ; sans aucune famille renseignée, un seul groupe sans titre. */
export function navGroups(shell: Shell, locale: Locale): NavGroup[] {
  return groupByFamily(navServices(shell, locale)).map((g) => ({
    key: g.family ?? "autres",
    label: g.family ? v5Label(shell?.ui, familyKey[g.family], locale) : null,
    services: g.items,
  }));
}

/** Prépare le menu côté serveur : libellés de la bonne langue et adresses résolues. */
export function buildNavModel(shell: Shell, locale: Locale): NavModel {
  const t = fallback[locale];
  const nav = shell?.navigation;
  const groups = navGroups(shell, locale);
  const items = (nav?.items ?? []).map((item) => ({
    key: item._key,
    label: pick(item.label, locale, ""),
    href: resolveLink(item.link, locale),
    groups: item.listServices ? groups : undefined,
  }));
  const ctaHref = resolveLink(nav?.cta?.link, locale);
  return {
    items: items.filter((i) => i.label && (i.href || i.groups?.length)),
    cta: ctaHref ? { label: pick(nav?.cta?.label, locale, t.cta), href: ctaHref } : null,
    languageLabel: pick(nav?.languageLabel, locale, t.lang),
    languagePairs: (shell?.routes ?? []).map((r) => ({ fr: pathFor(r, "fr"), en: pathFor(r, "en") })),
    servicesLabel: pick(shell?.ui?.services, locale, t.services),
    menuLabel: pick(shell?.ui?.menu, locale, t.menu),
    closeLabel: pick(shell?.ui?.closeMenu, locale, t.close),
  };
}
