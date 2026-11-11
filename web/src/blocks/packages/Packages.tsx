import type { Locale } from "@/lib/i18n/locales";
import { pick, type Localized } from "@/lib/i18n/pick";
import { formatPrice, visiblePackages, type PackageData } from "@/lib/packages/packages";
import { Section, SectionHeading } from "../section";

export type PackagesData = {
  heading?: Localized;
  intro?: Localized;
  showTaxNote?: boolean | null;
  taxNote?: Localized;
  packages?: PackageData[] | null;
};

// Valeurs de secours neutres : le texte public vient de Sanity (CLAUDE.md §4). Mise en page : étape N3.
const fallback = {
  fr: { from: "À partir de", quote: "Sur soumission", days: "jours ouvrables" },
  en: { from: "From", quote: "On quote", days: "business days" },
} as const;

export function Packages({ data, locale }: { data: PackagesData; locale: Locale }) {
  const items = visiblePackages(data.packages);
  if (items.length === 0) return null;
  const labels = fallback[locale];
  const taxNote = data.showTaxNote === false ? "" : pick(data.taxNote, locale, "");

  return (
    <Section id="forfaits">
      <SectionHeading intro={pick(data.intro, locale, "") || undefined}>{pick(data.heading, locale, "")}</SectionHeading>
      <ol className="border-t-[1.5px] border-ink">
        {items.map((p) => {
          const price = formatPrice(p.price, p.priceMode, locale);
          const scope = pick(p.scope, locale, "");
          const inclusions = (p.inclusions ?? []).map((i) => ({ key: i._key, text: pick(i, locale, "") })).filter((i) => i.text);
          return (
            <li key={p._id} data-highlighted={p.highlighted ? "true" : undefined} className="border-b border-rule py-6">
              <p className="font-mono text-[13px] text-ink-2">{p.code}</p>
              <h3 className="font-display text-xl font-bold">{pick(p.title, locale, "")}</h3>
              {scope && <p className="mt-1 text-ink-2">{scope}</p>}
              <p className="mt-2 font-mono text-[15px]">
                {price ? `${price.from ? `${labels.from} ` : ""}${price.amount}` : labels.quote}
                {p.leadTimeDays ? ` · ${p.leadTimeDays} ${labels.days}` : ""}
              </p>
              {inclusions.length > 0 && (
                <ul className="mt-3 list-disc ps-5 text-ink-2">
                  {inclusions.map((i, n) => <li key={i.key ?? n}>{i.text}</li>)}
                </ul>
              )}
            </li>
          );
        })}
      </ol>
      {taxNote && <p className="mt-4 text-[14px] text-ink-2">{taxNote}</p>}
    </Section>
  );
}
