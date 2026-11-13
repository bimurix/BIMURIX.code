import type { Shell } from "@/sanity/types-content";
import { htmlLang, type Locale } from "./i18n/locales";
import { pick, type Localized } from "./i18n/pick";
import { pathFor, type RouteTarget } from "./links";
import { isPlaceholder } from "./placeholders";
import { siteUrl } from "./seo";

// Données structurées schema.org (T6-A). Tout le texte vient de Sanity ; rien n'est inventé :
// ni prix (`offers` absent), ni note, ni avis, ni adresse postale, ni champ nul (R-01 à R-05).

type Json = string | number | boolean | null | undefined | Json[] | { [k: string]: Json };

/**
 * Retire tout ce qui ne doit pas sortir : valeurs nulles ou vides, et toute chaîne portant un marqueur d'exemple
 * (garde `isPlaceholder`, ADR-009 n° 4). Un objet qui ne garde que son `@type` disparaît aussi.
 */
export function cleanJsonLd<T extends Json>(value: T): Json {
  if (typeof value === "string") return value.trim() === "" || isPlaceholder(value) ? undefined : value;
  if (Array.isArray(value)) {
    const items = value.map(cleanJsonLd).filter((v) => v !== undefined);
    return items.length ? items : undefined;
  }
  if (value && typeof value === "object") {
    const entries = Object.entries(value).flatMap(([k, v]) => {
      const cleaned = cleanJsonLd(v);
      return cleaned === undefined ? [] : [[k, cleaned] as const];
    });
    const keys = entries.map(([k]) => k).filter((k) => !k.startsWith("@") || k === "@id");
    return keys.length ? Object.fromEntries(entries) : undefined;
  }
  return value === null ? undefined : value;
}

const homePath = (locale: Locale) => (locale === "fr" ? "/" : "/en");
export const orgId = () => `${siteUrl}/#organization`;
const abs = (path: string) => `${siteUrl}${path === "/" ? "" : path}`;

type Settings = NonNullable<NonNullable<Shell>["settings"]>;

/** Organisation (`ProfessionalService`) : sur toutes les pages. Téléphone, nom légal et NEQ seulement s'ils ne sont pas des exemples. */
export function organizationLd(shell: Shell, locale: Locale): Json {
  const s: Partial<Settings> = shell?.settings ?? {};
  return cleanJsonLd({
    "@context": "https://schema.org",
    "@type": "ProfessionalService",
    "@id": orgId(),
    name: s.siteName,
    legalName: s.legalName,
    url: abs(homePath(locale)),
    description: pick(s.descriptor, locale, ""),
    email: s.email,
    telephone: s.phone,
    logo: s.logo?.asset?.url,
    image: s.logo?.asset?.url,
    identifier: s.neq && !isPlaceholder(s.neq) ? { "@type": "PropertyValue", propertyID: "NEQ", value: s.neq } : undefined,
    areaServed: pick(s.serviceArea, locale, ""),
    knowsLanguage: [htmlLang.fr, htmlLang.en],
    inLanguage: htmlLang[locale],
  });
}

/** Site (`WebSite`) : accueil seulement ; pas de champ de recherche (le site n'en a pas). */
export function websiteLd(shell: Shell, locale: Locale): Json {
  return cleanJsonLd({
    "@context": "https://schema.org",
    "@type": "WebSite",
    "@id": `${siteUrl}/#website`,
    name: shell?.settings?.siteName,
    url: abs(homePath(locale)),
    inLanguage: htmlLang[locale],
    publisher: { "@id": orgId() },
  });
}

type ServiceInput = { title?: Localized; shortTitle?: Localized; heroIntro?: Localized; seo?: { description?: Localized } | null } & RouteTarget;

/** Service : nom complet, description, fournisseur, région desservie, type. Jamais de prix. */
export function serviceLd(doc: ServiceInput, shell: Shell, locale: Locale): Json {
  const path = pathFor(doc, locale);
  if (!path) return undefined;
  const name = pick(doc?.title, locale, "");
  return cleanJsonLd({
    "@context": "https://schema.org",
    "@type": "Service",
    name,
    serviceType: pick(doc?.shortTitle, locale, name),
    description: pick(doc?.seo?.description, locale, "") || pick(doc?.heroIntro, locale, ""),
    url: abs(path),
    inLanguage: htmlLang[locale],
    provider: { "@id": orgId() },
    areaServed: pick(shell?.settings?.serviceArea, locale, ""),
  });
}

export type FaqItem = { question?: Localized; answer?: Localized };

/** FAQ : reprend mot pour mot les questions et réponses affichées (aucune reformulation). */
export function faqLd(items: FaqItem[] | null | undefined, locale: Locale): Json {
  const entities = (items ?? []).flatMap((item) => {
    const question = pick(item.question, locale, "");
    const answer = pick(item.answer, locale, "");
    return question && answer ? [{ "@type": "Question", name: question, acceptedAnswer: { "@type": "Answer", text: answer } }] : [];
  });
  return cleanJsonLd({ "@context": "https://schema.org", "@type": "FAQPage", mainEntity: entities });
}

type Crumb = { name: string; path?: string };

/** Fil d'Ariane : données seulement (rien de visible en plus). Le dernier maillon n'a pas d'adresse, comme l'exige schema.org. */
export function breadcrumbLd(crumbs: Crumb[]): Json {
  if (crumbs.length < 2 || crumbs.some((c) => !c.name)) return undefined;
  return cleanJsonLd({
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: crumbs.map((c, i) => ({ "@type": "ListItem", position: i + 1, name: c.name, item: i < crumbs.length - 1 && c.path ? abs(c.path) : undefined })),
  });
}

/** Accueil › Services › [service] ou Accueil › [page] ; les libellés « Accueil » et « Services » viennent de Sanity. */
export function breadcrumbsFor(doc: RouteTarget & { title?: Localized }, shell: Shell, locale: Locale): Json {
  const home = pick(shell?.home?.title, locale, "");
  const title = pick(doc?.title, locale, "");
  const path = pathFor(doc, locale);
  if (!home || !title || !path || doc?.kind === "home") return undefined;
  if (doc?._type === "service") {
    const services = pick(shell?.ui?.services, locale, "");
    return breadcrumbLd([{ name: home, path: homePath(locale) }, { name: services, path: `${homePath(locale) === "/" ? "" : homePath(locale)}/#services` }, { name: title, path }]);
  }
  return breadcrumbLd([{ name: home, path: homePath(locale) }, { name: title, path }]);
}
