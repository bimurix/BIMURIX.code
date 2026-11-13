import type { Locale } from "@/lib/i18n/locales";
import { pick, type Localized } from "@/lib/i18n/pick";
import { canShowProof, proofSourceName } from "@/lib/packages/proof";
import { Icon } from "@/ui/components/Icon";
import { Section, SectionHeading } from "../section";

export type ProofData = {
  enabled?: boolean | null;
  heading?: Localized;
  /** Phrase qui dit pourquoi on montre le chiffre d'un tiers. */
  intro?: Localized;
  attribution?: Localized;
  sourceName?: string | null;
  sourceNameEn?: string | null;
  sourceUrl?: string | null;
  figures?: Array<{ _key: string; value?: string; label?: Localized }> | null;
  ui?: { sourceLabel?: Localized } | null;
};

/**
 * Chiffres d'un tiers : attribution et lien de source collés aux chiffres, dans le même cadre (ADR-006 n° 5 et 21).
 * Ne rend rien si le bloc est désactivé ou sans source.
 */
export function Proof({ data, locale }: { data: ProofData; locale: Locale }) {
  if (!canShowProof(data)) return null;
  const attribution = pick(data.attribution, locale, "");
  const figures = (data.figures ?? []).filter((f) => f.value);
  const sourceLabel = pick(data.ui?.sourceLabel, locale, "");
  return (
    <Section id="preuve">
      <SectionHeading intro={pick(data.intro, locale, "")}>{pick(data.heading, locale, "")}</SectionHeading>
      <figure className="border-[1.5px] border-ink bg-paper">
        <dl className="grid divide-y divide-rule sm:grid-cols-[repeat(auto-fit,minmax(0,1fr))] sm:divide-x sm:divide-y-0">
          {figures.map((f) => (
            <div key={f._key} className="flex flex-col-reverse justify-end gap-1 p-4 sm:p-5">
              <dt className="max-w-[28ch] text-ink-2">{pick(f.label, locale, "")}</dt>
              <dd className="font-mono text-4xl font-bold tabular-nums">{f.value}</dd>
            </div>
          ))}
        </dl>
        <figcaption className="border-t border-ink bg-paper-2 px-5 py-3 text-[15px] text-ink-2">
          {attribution && <span className="block max-w-[62ch]">{attribution}</span>}
          <span className="mt-1 block text-[14px]">
            {sourceLabel && `${sourceLabel}${locale === "fr" ? " : " : ": "}`}
            <a href={data.sourceUrl ?? undefined} rel="noopener noreferrer" className="inline-flex min-h-(--bx-tap-min) items-center text-ink underline underline-offset-4 hover:text-blue">
              {proofSourceName(data, locale)}
              <Icon name="lien-externe" size="sm" className="ms-1.5" />
            </a>
          </span>
        </figcaption>
      </figure>
    </Section>
  );
}
