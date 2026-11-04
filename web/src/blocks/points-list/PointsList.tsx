import type { Locale } from "@/lib/i18n/locales";
import { pick, type Localized } from "@/lib/i18n/pick";
import { Section, SectionHeading } from "../section";

export type PointsListData = {
  heading?: Localized;
  intro?: Localized;
  layout?: "columns" | "list";
  items?: Array<{ _key: string; title?: Localized; text?: Localized }>;
};

/** Points séparés par des traits fins (pas de cartes) : en colonnes, ou en liste titre / texte. */
export function PointsList({ data, locale }: { data: PointsListData; locale: Locale }) {
  const items = data.items ?? [];
  const intro = pick(data.intro, locale, "");

  if (data.layout === "list") {
    return (
      <Section>
        <SectionHeading intro={intro}>{pick(data.heading, locale, "")}</SectionHeading>
        <dl className="border-t-[1.5px] border-ink">
          {items.map((item) => (
            <div key={item._key} className="grid gap-2 border-b border-rule py-5 md:grid-cols-[minmax(0,1fr)_minmax(0,2fr)] md:gap-8">
              <dt className="font-display text-lg font-bold text-ink">{pick(item.title, locale, "")}</dt>
              <dd className="max-w-[62ch] text-[16px] leading-relaxed text-ink-2">{pick(item.text, locale, "")}</dd>
            </div>
          ))}
        </dl>
      </Section>
    );
  }

  return (
    <Section>
      <SectionHeading intro={intro}>{pick(data.heading, locale, "")}</SectionHeading>
      <ul className="grid gap-x-10 border-t-[1.5px] border-ink sm:grid-cols-2">
        {items.map((item) => (
          <li key={item._key} className="border-b border-rule py-6">
            <h3 className="font-display text-xl font-bold text-ink">{pick(item.title, locale, "")}</h3>
            <p className="mt-2 max-w-[52ch] text-[16px] leading-relaxed text-ink-2">{pick(item.text, locale, "")}</p>
          </li>
        ))}
      </ul>
    </Section>
  );
}
