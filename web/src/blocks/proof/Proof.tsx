import type { Locale } from "@/lib/i18n/locales";
import { pick, type Localized } from "@/lib/i18n/pick";
import { canShowProof } from "@/lib/packages/proof";
import { Section, SectionHeading } from "../section";

export type ProofData = {
  enabled?: boolean | null;
  heading?: Localized;
  attribution?: Localized;
  sourceName?: string | null;
  sourceUrl?: string | null;
  figures?: Array<{ _key: string; value?: string; label?: Localized }> | null;
};

// Ne rend rien sans nom et lien de source, ou si le bloc est désactivé (ADR-006 n° 5). Mise en page : étape N3.
export function Proof({ data, locale }: { data: ProofData; locale: Locale }) {
  if (!canShowProof(data)) return null;
  const attribution = pick(data.attribution, locale, "");
  return (
    <Section id="preuve">
      <SectionHeading>{pick(data.heading, locale, "")}</SectionHeading>
      <dl className="grid gap-6 border-t-[1.5px] border-ink pt-6 sm:grid-cols-3">
        {(data.figures ?? []).map((f) => (
          <div key={f._key}>
            <dd className="font-mono text-3xl font-bold">{f.value}</dd>
            <dt className="mt-1 text-ink-2">{pick(f.label, locale, "")}</dt>
          </div>
        ))}
      </dl>
      {attribution && <p className="mt-6 max-w-[62ch] text-[15px] text-ink-2">{attribution}</p>}
      <p className="mt-2 text-[14px] text-ink-2">
        {locale === "fr" ? "Source : " : "Source: "}<a href={data.sourceUrl ?? undefined} rel="noopener noreferrer" className="underline underline-offset-2">{data.sourceName}</a>
      </p>
    </Section>
  );
}
