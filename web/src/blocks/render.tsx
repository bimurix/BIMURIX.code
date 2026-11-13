import { Fragment } from "react";
import type { Locale } from "@/lib/i18n/locales";
import { pick } from "@/lib/i18n/pick";
import { v5Label } from "@/lib/i18n/v5-labels";
import { pathFor } from "@/lib/links";
import { shortName } from "@/lib/services/families";
import type { Shell, TitleBlockData } from "@/sanity/types-content";
import type { IsoRun } from "@/ui/patterns/IsoNetworks";
import { Conditions, type ConditionsData } from "./conditions/Conditions";
import { Deliverables, type DeliverablesData } from "./deliverables/Deliverables";
import { Faq, type FaqData } from "./faq/Faq";
import { HeroSheet, type HeroSheetData } from "./hero-sheet/HeroSheet";
import { ImageFigure, type ImageFigureData } from "./image-figure/ImageFigure";
import { Method, type MethodData } from "./method/Method";
import { Packages, type PackagesData } from "./packages/Packages";
import { PointsList, type PointsListData } from "./points-list/PointsList";
import { Problems, type ProblemsData } from "./problems/Problems";
import { ProjectCycle, type ProjectCycleData } from "./project-cycle/ProjectCycle";
import { Proof, type ProofData } from "./proof/Proof";
import { QuoteCta, type QuoteCtaData } from "./quote-cta/QuoteCta";
import { QuoteFormBlock, type QuoteFormData } from "./quote-form/QuoteFormBlock";
import { ResponsibilityTable, type ResponsibilityTableData } from "./responsibility-table/ResponsibilityTable";
import { RichText, type RichTextData } from "./rich-text/RichText";
import { Scenarios, type ScenariosData } from "./scenarios/Scenarios";
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
    label: shortName(s, locale),
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
      return <ServiceNetworks data={section as ServiceNetworksData} locale={locale} ui={shell?.ui} />;
    case "method":
      return <Method data={section as MethodData} locale={locale} />;
    case "pointsList":
      return <PointsList data={section as PointsListData} locale={locale} />;
    case "deliverables":
      return <Deliverables data={section as DeliverablesData} locale={locale} illustrativeLabel={pick(shell?.ui?.illustrativeExample, locale, "")} labels={{ item: v5Label(shell?.ui, "deliverableLabel", locale), purpose: v5Label(shell?.ui, "purposeLabel", locale) }} />;
    case "richText":
      return <RichText data={section as RichTextData} locale={locale} />;
    case "quoteCta":
      return <QuoteCta data={section as QuoteCtaData} locale={locale} />;
    case "faq":
      return <Faq data={section as FaqData} locale={locale} />;
    case "imageFigure":
      return <ImageFigure data={section as ImageFigureData} locale={locale} illustrativeLabel={pick(shell?.ui?.illustrativeExample, locale, "") || undefined} />;
    case "quoteForm":
      return <QuoteFormBlock data={section as QuoteFormData} locale={locale} />;
    case "packages":
      return <Packages data={section as PackagesData} locale={locale} />;
    case "conditions":
      return <Conditions data={section as ConditionsData} locale={locale} />;
    case "proof":
      return <Proof data={section as ProofData} locale={locale} />;
    case "problems":
      return <Problems data={section as ProblemsData} locale={locale} illustrativeLabel={pick(shell?.ui?.illustrativeExample, locale, "") || undefined} />;
    case "projectCycle":
      return <ProjectCycle data={section as ProjectCycleData} locale={locale} ui={shell?.ui} />;
    case "scenarios":
      return <Scenarios data={section as ScenariosData} locale={locale} ui={shell?.ui} quotePath={pathFor(shell?.quotePage, locale)} />;
    case "responsibilityTable":
      return <ResponsibilityTable data={section as ResponsibilityTableData} locale={locale} ui={shell?.ui} />;
    default:
      return null;
  }
}

export function RenderSections({ sections, ctx }: { sections: Section[] | undefined; ctx: RenderContext }) {
  return <>{(sections ?? []).map((section) => <Fragment key={section._key}>{renderSection(section, ctx)}</Fragment>)}</>;
}
