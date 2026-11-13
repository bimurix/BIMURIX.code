import type { Locale } from "@/lib/i18n/locales";
import { pick, type Localized } from "@/lib/i18n/pick";
import { v5Label, type UiLabels } from "@/lib/i18n/v5-labels";
import { FigureImage, type FigureImageData } from "@/ui/components/FigureImage";
import { Section, SectionHeading } from "../section";
import { DeliverableTable } from "./DeliverableTable";

export type DeliverableRowData = { _key: string; icon?: string | null; title?: Localized; purpose?: Localized };

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
 * Ce que vous recevez, avec à quoi ça sert : une nomenclature à deux colonnes (livrable, usage), sans cartes.
 * L'image d'exemple se place à côté dès lg, sous le tableau sur mobile. Rien sans ligne.
 */
export function DeliverableRows({ heading, rows, figure, note, locale, ui, illustrativeLabel }: Props) {
  const lines = rows.flatMap((r) => {
    const title = pick(r.title, locale, "");
    return title ? [{ key: r._key, title, purpose: pick(r.purpose, locale, ""), icon: r.icon }] : [];
  });
  if (lines.length === 0) return null;
  const hasFigure = Boolean(figure?.asset?.url);
  const labels = { item: v5Label(ui, "deliverableLabel", locale), purpose: v5Label(ui, "purposeLabel", locale) };
  return (
    <Section id="livrables">
      <SectionHeading>{pick(heading, locale, "")}</SectionHeading>
      <div className={hasFigure ? "grid gap-10 lg:grid-cols-[minmax(0,7fr)_minmax(0,5fr)] lg:items-start" : "max-w-4xl"}>
        <DeliverableTable lines={lines} labels={labels} caption={pick(heading, locale, "") || undefined} />
        <FigureImage image={figure} locale={locale} ratio="4 / 3" sizes="(min-width: 1024px) 480px, 100vw" illustrativeLabel={illustrativeLabel} className="lg:sticky lg:top-24" />
      </div>
      {note && <p className="mt-8 max-w-[60ch] text-[15px] text-ink-2">{pick(note, locale, "")}</p>}
    </Section>
  );
}
