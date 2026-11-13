import Link from "next/link";
import type { Locale } from "@/lib/i18n/locales";
import { pick, type Localized } from "@/lib/i18n/pick";
import { v5Label, type UiLabels } from "@/lib/i18n/v5-labels";
import { pathFor, type RouteTarget } from "@/lib/links";
import { shortName } from "@/lib/services/families";
import { FigureImage, type FigureImageData } from "@/ui/components/FigureImage";

export type ScenarioData = {
  _key: string;
  title?: Localized;
  situation?: Localized;
  action?: Localized;
  receive?: Localized;
  avoid?: Localized;
  image?: FigureImageData;
  service?: (RouteTarget & { _id?: string; title?: Localized; shortTitle?: Localized }) | null;
};

const CELLS = [
  ["situation", "scenarioSituation"],
  ["action", "scenarioAction"],
  ["receive", "scenarioReceive"],
  ["avoid", "scenarioAvoid"],
] as const;

type Props = {
  items: ScenarioData[];
  locale: Locale;
  ui: UiLabels;
  /** Adresse de la page de soumission : active, sous chaque situation liée à un service, le lien de demande. */
  quotePath?: string | null;
};

const linkClass = "inline-flex min-h-(--bx-tap-min) items-center text-[15px] text-ink underline underline-offset-4 hover:text-blue";

/**
 * Situations types en bandes de feuille de plan : une situation = quatre cellules séparées par des traits fins,
 * empilées avec leur étiquette sur mobile. Pas de cartes ni d'icônes. Une cellule vide n'est pas rendue.
 */
export function ScenarioList({ items, locale, ui, quotePath }: Props) {
  return (
    <ol className="border-t-[1.5px] border-ink">
      {items.map((item) => {
        const servicePath = pathFor(item.service, locale);
        const quoteHref = quotePath && item.service?._id ? `${quotePath}?service=${encodeURIComponent(item.service._id)}` : null;
        const cells = CELLS.flatMap(([field, labelKey]) => {
          const text = pick(item[field], locale, "");
          return text ? [{ field, label: v5Label(ui, labelKey, locale), text }] : [];
        });
        return (
          <li key={item._key} className="border-b border-rule py-7">
            <article>
              <h3 className="font-display max-w-[40ch] text-xl leading-snug font-bold text-ink">{pick(item.title, locale, "")}</h3>
              <FigureImage image={item.image} locale={locale} ratio="3 / 2" sizes="(min-width: 640px) 384px, 100vw" className="mt-4 max-w-sm" />
              {cells.length > 0 && (
                <dl className="mt-5 grid gap-y-4 sm:grid-cols-2 lg:grid-cols-4 lg:gap-y-0 lg:divide-x lg:divide-rule">
                  {cells.map((cell) => (
                    <div key={cell.field} className="lg:px-5 lg:first:ps-0 lg:last:pe-0">
                      <dt className="text-[13px] font-semibold text-ink-2">{cell.label}</dt>
                      <dd className="mt-1 max-w-[44ch] text-[16px] leading-relaxed text-ink">{cell.text}</dd>
                    </div>
                  ))}
                </dl>
              )}
              {(servicePath || quoteHref) && (
                <p className="mt-3 flex flex-wrap gap-x-6">
                  {servicePath && (
                    <Link href={servicePath} className={linkClass}>
                      {v5Label(ui, "scenarioServiceLink", locale)}
                      <span className="sr-only"> — {item.service ? shortName(item.service, locale) : ""}</span>
                    </Link>
                  )}
                  {quoteHref && (
                    <Link href={quoteHref} className={linkClass}>
                      {v5Label(ui, "scenarioQuoteLink", locale)}
                    </Link>
                  )}
                </p>
              )}
            </article>
          </li>
        );
      })}
    </ol>
  );
}
