import { HeroSheet } from "@/blocks/hero-sheet/HeroSheet";
import { Method } from "@/blocks/method/Method";
import { PointsList } from "@/blocks/points-list/PointsList";
import { QuoteCta } from "@/blocks/quote-cta/QuoteCta";
import { Section, SectionHeading } from "@/blocks/section";
import type { Locale } from "@/lib/i18n/locales";
import { pick, type Localized } from "@/lib/i18n/pick";
import type { Cta, ImageAsset, NetworkColor, Shell, TitleBlockData } from "@/sanity/types-content";
import { networkVar, NetworkSwatch } from "@/ui/components/NetworkSwatch";

type Keyed<T> = T & { _key: string };

export type ServiceDoc = {
  _id: string;
  code?: string;
  network?: NetworkColor;
  title?: Localized;
  titleBlock?: TitleBlockData;
  heroHeading?: Localized;
  heroIntro?: Localized;
  heroCta?: Cta;
  heroImage?: (ImageAsset & { alt?: Localized }) | null;
  offeringsHeading?: Localized;
  offerings?: Array<Keyed<{ title?: Localized; text?: Localized }>>;
  deliverablesHeading?: Localized;
  deliverables?: Array<Keyed<Localized & object>>;
  deliverablesNote?: Localized;
  methodHeading?: Localized;
  methodSteps?: Array<Keyed<Localized & object>>;
  extraHeading?: Localized;
  extraItems?: Array<Keyed<Localized & object>>;
  extraNote?: Localized;
  ctaHeading?: Localized;
  ctaText?: Localized;
  ctaButton?: Cta;
};

/** Liste à puces « raccords » dans la couleur du réseau du service. */
function NetworkList({ heading, items, note, network, locale }: { heading?: Localized; items?: Array<Keyed<Localized & object>>; note?: Localized; network: NetworkColor; locale: Locale }) {
  if (!items?.length) return null;
  return (
    <Section>
      <SectionHeading>{pick(heading, locale, "")}</SectionHeading>
      <ul className="grid max-w-5xl gap-x-10 border-t-[1.5px] border-ink sm:grid-cols-2">
        {items.map((item) => (
          <li key={item._key} className="flex min-h-14 items-center gap-4 border-b border-rule py-3 text-[16px] text-ink">
            <span aria-hidden="true" className="size-2.5 shrink-0 rounded-full border-2 bg-paper" style={{ borderColor: networkVar[network] }} />
            {pick(item, locale, "")}
          </li>
        ))}
      </ul>
      {note && <p className="mt-8 max-w-[60ch] text-[15px] text-ink-3">{pick(note, locale, "")}</p>}
    </Section>
  );
}

/** Gabarit commun des 4 pages de service : même feuille, couleur et code du réseau du service. */
export function ServicePage({ doc, locale, shell }: { doc: ServiceDoc; locale: Locale; shell: Shell }) {
  const network = doc.network ?? "tqc";
  const meta = (
    <p className="flex items-center gap-3 text-[14px] text-ink-2">
      <NetworkSwatch network={network} />
      <span className="font-mono text-[13px]">{doc.code}</span>
      <span>{pick(doc.title, locale, "")}</span>
    </p>
  );

  return (
    <>
      <HeroSheet
        data={{ heading: doc.heroHeading, intro: doc.heroIntro, ctas: doc.heroCta ? [doc.heroCta] : [], illustration: doc.heroImage }}
        locale={locale}
        shell={shell}
        titleBlock={doc.titleBlock}
        meta={meta}
      />
      {doc.offerings?.length ? (
        <PointsList data={{ heading: doc.offeringsHeading, items: doc.offerings, layout: "columns" }} locale={locale} />
      ) : null}
      <NetworkList heading={doc.deliverablesHeading} items={doc.deliverables} note={doc.deliverablesNote} network={network} locale={locale} />
      {doc.methodSteps?.length ? (
        <Method data={{ heading: doc.methodHeading, steps: doc.methodSteps.map((s) => ({ _key: s._key, title: s })) }} locale={locale} />
      ) : null}
      <NetworkList heading={doc.extraHeading} items={doc.extraItems} note={doc.extraNote} network={network} locale={locale} />
      <QuoteCta data={{ heading: doc.ctaHeading, text: doc.ctaText, button: doc.ctaButton }} locale={locale} />
    </>
  );
}
