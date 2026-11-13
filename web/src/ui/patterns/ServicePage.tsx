import { DeliverableRows, type DeliverableRowData } from "@/blocks/deliverables/DeliverableRows";
import { Faq } from "@/blocks/faq/Faq";
import { HeroSheet } from "@/blocks/hero-sheet/HeroSheet";
import { Method } from "@/blocks/method/Method";
import { Packages } from "@/blocks/packages/Packages";
import { PointsList } from "@/blocks/points-list/PointsList";
import { Proof, type ProofData } from "@/blocks/proof/Proof";
import { QuoteCta } from "@/blocks/quote-cta/QuoteCta";
import { ResponsibilityTable, type ResponsibilityRowData } from "@/blocks/responsibility-table/ResponsibilityTable";
import type { ScenarioData } from "@/blocks/scenarios/ScenarioList";
import { Scenarios } from "@/blocks/scenarios/Scenarios";
import type { Locale } from "@/lib/i18n/locales";
import { pick, type Localized } from "@/lib/i18n/pick";
import { v5Label } from "@/lib/i18n/v5-labels";
import { pathFor } from "@/lib/links";
import type { PackageData } from "@/lib/packages/packages";
import { serviceQuoteCta } from "@/lib/services/quote-cta";
import type { Cta, NetworkColor, Shell, TitleBlockData } from "@/sanity/types-content";
import type { FigureImageData } from "@/ui/components/FigureImage";
import { NetworkSwatch } from "@/ui/components/NetworkSwatch";
import { NetworkList, Pledge, type Keyed } from "./service-sections";

export type ServiceDoc = {
  _id: string;
  code?: string;
  network?: NetworkColor;
  title?: Localized;
  titleBlock?: TitleBlockData;
  heroHeading?: Localized;
  heroIntro?: Localized;
  heroCta?: Cta;
  /** Libellé du bouton « Demander une soumission » propre au service (haut de page et appel final). */
  quoteButtonLabel?: Localized;
  heroImage?: FigureImageData;
  scenarios?: ScenarioData[] | null;
  offeringsHeading?: Localized;
  offerings?: Array<Keyed<{ title?: Localized; text?: Localized }>>;
  deliverablesHeading?: Localized;
  deliverables?: Array<Keyed<Localized & object>>;
  /** Livrables avec « à quoi ça sert » : remplacent la liste simple `deliverables` quand ils existent. */
  deliverableRows?: DeliverableRowData[] | null;
  figureImage?: FigureImageData;
  deliverablesNote?: Localized;
  needsHeading?: Localized;
  needs?: Array<Keyed<Localized & object>> | null;
  needsNote?: Localized;
  methodHeading?: Localized;
  methodSteps?: Array<Keyed<Localized & object>>;
  extraHeading?: Localized;
  extraItems?: Array<Keyed<Localized & object>>;
  extraNote?: Localized;
  moreHeading?: Localized;
  moreItems?: Array<Keyed<Localized & object>>;
  moreNote?: Localized;
  responsibilityRows?: ResponsibilityRowData[] | null;
  proof?: ProofData | null;
  faq?: Array<{ _key: string; question?: Localized; answer?: Localized }> | null;
  ctaHeading?: Localized;
  ctaText?: Localized;
  ctaButton?: Cta;
  audience?: Localized;
  /** Phrase de confiance mise en évidence sous l'introduction (facultative). */
  pledge?: Localized;
  responsibilityNote?: Localized;
  taxNote?: Localized;
  creditText?: Localized;
  packages?: PackageData[];
};

/**
 * Gabarit commun des 6 pages de service, dans l'ordre du plan de contenu v5 § 2b :
 * en-tête, pour qui, situations types, ce que nous faisons, ce que vous recevez, ce qu'il faut nous envoyer,
 * (forfaits, s'il y en a), comment ça se passe, qui fait quoi, preuve, questions, appel final.
 * Une section sans contenu ne s'affiche pas : un service sans les nouveaux champs garde son ancien rendu.
 */
export function ServicePage({ doc, locale, shell }: { doc: ServiceDoc; locale: Locale; shell: Shell }) {
  const network = doc.network ?? "tqc";
  const ui = shell?.ui;
  const quotePath = pathFor(shell?.quotePage, locale);
  const cta = { label: doc.quoteButtonLabel, quotePage: shell?.quotePage, serviceId: doc._id };
  const heroCta = serviceQuoteCta(doc.heroCta, cta);
  const meta = (
    <p className="flex items-center gap-3 text-[14px] text-ink-2">
      <NetworkSwatch network={network} />
      <span className="shrink-0 font-mono text-[13px] whitespace-nowrap">{doc.code}</span>
      <span>{pick(doc.title, locale, "")}</span>
    </p>
  );
  const rows = doc.deliverableRows ?? [];
  // « Pour qui » tient dans la bande basse de la feuille, à gauche du cartouche : une réponse courte n'a pas besoin d'une section (S3b).
  const audience = pick(doc.audience, locale, "");
  const forWhom = audience ? (
    <div className="max-w-[62ch]">
      <h2 className="text-[13px] font-semibold text-ink-2">{pick(ui?.forWhom, locale, "")}</h2>
      <p className="mt-1 text-[16px] leading-relaxed text-ink">{audience}</p>
    </div>
  ) : undefined;

  return (
    <>
      <HeroSheet
        data={{ heading: doc.heroHeading, intro: doc.heroIntro, ctas: heroCta ? [heroCta] : [], illustration: doc.heroImage }}
        locale={locale}
        shell={shell}
        titleBlock={doc.titleBlock}
        meta={meta}
        aside={forWhom}
      />
      <Pledge text={doc.pledge} locale={locale} />
      <Scenarios
        data={{ items: doc.scenarios ?? [] }}
        locale={locale}
        ui={ui}
        quoteLink={quotePath ? { href: `${quotePath}?service=${encodeURIComponent(doc._id)}`, label: v5Label(ui, "scenarioQuoteLink", locale) } : null}
      />
      {doc.offerings?.length ? <PointsList data={{ heading: doc.offeringsHeading, items: doc.offerings, layout: "columns" }} locale={locale} /> : null}
      {rows.length > 0 ? (
        <DeliverableRows heading={doc.deliverablesHeading} rows={rows} figure={doc.figureImage} note={doc.deliverablesNote} locale={locale} ui={ui} illustrativeLabel={pick(ui?.illustrativeExample, locale, "") || undefined} />
      ) : (
        <NetworkList heading={doc.deliverablesHeading} items={doc.deliverables} note={doc.deliverablesNote} network={network} locale={locale} />
      )}
      <NetworkList id="a-envoyer" heading={{ [locale]: pick(doc.needsHeading, locale, v5Label(ui, "needsHeadingDefault", locale)) }} items={doc.needs ?? undefined} note={doc.needsNote} network={network} locale={locale} />
      <Packages data={{ heading: ui?.offerPackages, taxNote: doc.taxNote, creditText: doc.creditText, packages: doc.packages, ui, quotePage: shell?.quotePage }} locale={locale} />
      {doc.methodSteps?.length ? <Method data={{ heading: doc.methodHeading, steps: doc.methodSteps.map((s) => ({ _key: s._key, title: s })) }} locale={locale} /> : null}
      <NetworkList heading={doc.extraHeading} items={doc.extraItems} note={doc.extraNote} network={network} locale={locale} />
      <NetworkList heading={doc.moreHeading} items={doc.moreItems} note={doc.moreNote} network={network} locale={locale} />
      <ResponsibilityTable data={{ heading: ui?.responsibilities, rows: doc.responsibilityRows ?? [], note: doc.responsibilityNote }} locale={locale} ui={ui} />
      {doc.proof && <Proof data={doc.proof} locale={locale} />}
      {doc.faq?.length ? <Faq data={{ heading: { [locale]: v5Label(ui, "serviceFaqHeading", locale) }, items: doc.faq }} locale={locale} /> : null}
      <QuoteCta data={{ heading: doc.ctaHeading, text: doc.ctaText, button: serviceQuoteCta(doc.ctaButton, cta) }} locale={locale} ui={ui} phone={shell?.settings?.phone} />
    </>
  );
}
