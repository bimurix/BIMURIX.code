import type { Locale } from "@/lib/i18n/locales";
import type { Localized } from "@/lib/i18n/pick";
import { breadcrumbsFor, faqLd, serviceLd, websiteLd, type FaqItem } from "@/lib/jsonld";
import type { RouteTarget } from "@/lib/links";
import type { Shell } from "@/sanity/types-content";
import { JsonLd } from "./JsonLd";

type FaqSection = { _type?: string; items?: FaqItem[] };
type Doc = RouteTarget & { title?: Localized; shortTitle?: Localized; heroIntro?: Localized; seo?: { description?: Localized } | null; faq?: FaqItem[] | null; sections?: FaqSection[] };

/** Questions affichées sur la page : champ `faq` d'un service, ou blocs « faq » d'une page (mêmes textes que le rendu). */
const faqItems = (doc: Doc): FaqItem[] => [...(doc.faq ?? []), ...(doc.sections ?? []).filter((s) => s._type === "faq").flatMap((s) => s.items ?? [])];

/** Fil d'Ariane, service et FAQ d'une page intérieure (R-02, R-03, R-04). */
export function PageJsonLd({ doc, shell, locale }: { doc: Doc; shell: Shell; locale: Locale }) {
  return (
    <>
      {doc._type === "service" && <JsonLd data={serviceLd(doc, shell, locale)} />}
      <JsonLd data={faqLd(faqItems(doc), locale)} />
      <JsonLd data={breadcrumbsFor(doc, shell, locale)} />
    </>
  );
}

/** Site et FAQ de l'accueil (R-03, R-05). */
export function HomeJsonLd({ doc, shell, locale }: { doc: Doc; shell: Shell; locale: Locale }) {
  return (
    <>
      <JsonLd data={websiteLd(shell, locale)} />
      <JsonLd data={faqLd(faqItems(doc), locale)} />
    </>
  );
}
