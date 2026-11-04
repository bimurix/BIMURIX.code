import { Fragment } from "react";
import type { Locale } from "@/lib/i18n/locales";
import { pick } from "@/lib/i18n/pick";
import { pathFor } from "@/lib/links";
import type { Shell, TitleBlockData } from "@/sanity/types-content";
import type { IsoRun } from "@/ui/patterns/IsoNetworks";
import { Deliverables, type DeliverablesData } from "./deliverables/Deliverables";
import { Faq, type FaqData } from "./faq/Faq";
import { HeroSheet, type HeroSheetData } from "./hero-sheet/HeroSheet";
import { ImageFigure, type ImageFigureData } from "./image-figure/ImageFigure";
import { Method, type MethodData } from "./method/Method";
import { PointsList, type PointsListData } from "./points-list/PointsList";
import { QuoteCta, type QuoteCtaData } from "./quote-cta/QuoteCta";
import { QuoteFormBlock, type QuoteFormData } from "./quote-form/QuoteFormBlock";
import { RichText, type RichTextData } from "./rich-text/RichText";
import { ServiceNetworks, type ServiceNetworksData } from "./service-networks/ServiceNetworks";

export type Section = { _key: string; _type: string } & Record<string, unknown>;
export type RenderContext = {
  locale: Locale;
  shell: Shell;
  titleBlock: TitleBlockData;
  /** L'isométrique des réseaux n'apparaît que sur l'accueil. */
  isHome?: boolean;
  /** Bande basse du premier écran (ex. : date de mise à jour d'une page légale). */
  heroAside?: React.ReactNode;
};

/** Réseaux de l'isométrique : un par service, lien vers la soumission avec ce service pré-choisi. */
export function buildRuns(shell: Shell, locale: Locale): IsoRun[] {
  const quotePath = pathFor(shell?.quotePage, locale);
  if (!quotePath) return [];
  return (shell?.services ?? []).map((s) => ({
    id: s._id,
    code: s.code ?? "",
    label: pick(s.title, locale, ""),
    network: s.network ?? "tqc",
    href: `${quotePath}?service=${encodeURIComponent(s._id)}`,
  }));
}

function renderSection(section: Section, ctx: RenderContext) {
  const { locale, shell } = ctx;
  switch (section._type) {
    case "heroSheet":
      return <HeroSheet data={section as HeroSheetData} locale={locale} shell={shell} titleBlock={ctx.titleBlock} runs={ctx.isHome ? buildRuns(shell, locale) : []} aside={ctx.heroAside} />;
    case "serviceNetworks":
      return <ServiceNetworks data={section as ServiceNetworksData} locale={locale} />;
    case "method":
      return <Method data={section as MethodData} locale={locale} />;
    case "pointsList":
      return <PointsList data={section as PointsListData} locale={locale} />;
    case "deliverables":
      return <Deliverables data={section as DeliverablesData} locale={locale} illustrativeLabel={pick(shell?.ui?.illustrativeExample, locale, "")} />;
    case "richText":
      return <RichText data={section as RichTextData} locale={locale} />;
    case "quoteCta":
      return <QuoteCta data={section as QuoteCtaData} locale={locale} />;
    case "faq":
      return <Faq data={section as FaqData} locale={locale} />;
    case "imageFigure":
      return <ImageFigure data={section as ImageFigureData} locale={locale} illustrativeLabel={pick(shell?.ui?.illustrativeExample, locale, "") || undefined} />;
    case "quoteForm":
      return <QuoteFormBlock data={section as QuoteFormData} locale={locale} email={shell?.settings?.email} />;
    default:
      return null;
  }
}

export function RenderSections({ sections, ctx }: { sections: Section[] | undefined; ctx: RenderContext }) {
  return <>{(sections ?? []).map((section) => <Fragment key={section._key}>{renderSection(section, ctx)}</Fragment>)}</>;
}
