import type { Locale } from "@/lib/i18n/locales";
import { pick, type Localized } from "@/lib/i18n/pick";
import { v5Label, type UiLabels } from "@/lib/i18n/v5-labels";
import { FigureImage, type FigureImageData } from "@/ui/components/FigureImage";
import { Section, SectionHeading } from "../section";

export type DeliverableRowData = { _key: string; title?: Localized; purpose?: Localized };

type Props = {
  heading?: Localized;
  rows: DeliverableRowData[];
  /** Exemple de livrable (schéma marqué « exemple » ou capture anonymisée) ; rien sans image. */
  figure?: FigureImageData;
  note?: Localized;
  locale: Locale;
  ui: UiLabels;
  illustrativeLabel?: string;
};

/**
 * Ce que vous recevez, avec à quoi ça sert : une nomenclature de lignes (cote, livrable, usage), sans cartes.
 * L'image d'exemple se place à côté dès lg, au-dessus sur mobile. Rien sans ligne.
 */
export function DeliverableRows({ heading, rows, figure, note, locale, ui, illustrativeLabel }: Props) {
  const lines = rows.filter((r) => pick(r.title, locale, ""));
  if (lines.length === 0) return null;
  const hasFigure = Boolean(figure?.asset?.url);
  const purposeLabel = v5Label(ui, "purposeLabel", locale);
  return (
    <Section id="livrables">
      <SectionHeading>{pick(heading, locale, "")}</SectionHeading>
      <div className={hasFigure ? "grid gap-10 lg:grid-cols-[minmax(0,5fr)_minmax(0,7fr)] lg:items-start" : ""}>
        <FigureImage image={figure} locale={locale} ratio="4 / 3" sizes="(min-width: 1024px) 480px, 100vw" illustrativeLabel={illustrativeLabel} />
        <ol className="max-w-4xl border-t-[1.5px] border-ink">
          {lines.map((row, i) => {
            const purpose = pick(row.purpose, locale, "");
            return (
              <li key={row._key} className="grid grid-cols-[2.5rem_minmax(0,1fr)] gap-x-3 border-b border-rule py-4 md:grid-cols-[2.5rem_minmax(0,1fr)_minmax(0,1.1fr)] md:gap-x-6">
                <span className="pt-0.5 font-mono text-[13px] text-ink-3">{String(i + 1).padStart(2, "0")}</span>
                <span className="text-[16px] font-semibold text-ink">{pick(row.title, locale, "")}</span>
                {purpose && (
                  <span className="col-start-2 mt-1 text-[15px] leading-relaxed text-ink-2 md:col-start-3 md:mt-0">
                    <span className="block text-[12px] text-ink-3">{purposeLabel}</span>
                    {purpose}
                  </span>
                )}
              </li>
            );
          })}
        </ol>
      </div>
      {note && <p className="mt-8 max-w-[60ch] text-[15px] text-ink-3">{pick(note, locale, "")}</p>}
    </Section>
  );
}
