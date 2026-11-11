import type { Locale } from "@/lib/i18n/locales";
import { pick, type Localized } from "@/lib/i18n/pick";
import { Section, SectionHeading } from "../section";

export type ConditionsData = {
  heading?: Localized;
  launch?: {
    professionalNote?: Localized;
    conditions?: Array<{ _key: string; title?: Localized; text?: Localized }> | null;
  } | null;
};

/**
 * Conditions en liste de définitions : deux colonnes dès md, une sur mobile.
 * La mention professionnelle (ADR-006 n° 11) est encadrée, comme un cartouche de feuille.
 * Rien ne s'affiche si le réglage « Lancement et conditions » est vide.
 */
export function Conditions({ data, locale }: { data: ConditionsData; locale: Locale }) {
  const launch = data.launch;
  const items = (launch?.conditions ?? []).filter((c) => pick(c.title, locale, ""));
  const note = pick(launch?.professionalNote, locale, "");
  if (items.length === 0 && !note) return null;

  return (
    <Section id="conditions">
      <SectionHeading>{pick(data.heading, locale, "")}</SectionHeading>
      {items.length > 0 && (
        <dl className="grid border-t-[1.5px] border-ink md:grid-cols-2 md:gap-x-12">
          {items.map((c) => (
            <div key={c._key} className="border-b border-rule py-5">
              <dt className="font-display text-lg font-bold">{pick(c.title, locale, "")}</dt>
              <dd className="mt-1 max-w-[52ch] text-ink-2">{pick(c.text, locale, "")}</dd>
            </div>
          ))}
        </dl>
      )}
      {note && (
        <p className="mt-10 max-w-[62ch] border-[1.5px] border-ink bg-paper-2 p-5 text-[16px] leading-relaxed font-medium text-ink">{note}</p>
      )}
    </Section>
  );
}
