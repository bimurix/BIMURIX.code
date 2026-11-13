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

const SHORT_FIELDS: readonly string[] = ["situation", "receive"];

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
  /** Version courte (accueil) : « Situation » et « Ce que vous recevez » seulement ; le détail reste sur la page du service. */
  short?: boolean;
};

const linkClass = "inline-flex min-h-(--bx-tap-min) items-center text-[15px] text-ink underline underline-offset-4 hover:text-blue";

/**
 * Situations types en bandes de feuille de plan : le titre à gauche, puis quatre temps repérables d'un coup d'œil
 * (situation, ce que fait Bimurix, ce que vous recevez, ce que ça évite), chacun sous son étiquette en gras et son
 * trait fin ; deux par rangée dès sm, empilés sur mobile. Pas de cartes ni d'icônes. Une cellule vide n'est pas rendue.
 */
export function ScenarioList({ items, locale, ui, quotePath, short }: Props) {
  return (
    <ol className="border-t-[1.5px] border-ink">
      {items.map((item) => (
        <ScenarioItem key={item._key} item={item} locale={locale} ui={ui} quotePath={quotePath} short={short} />
      ))}
    </ol>
  );
}

function ScenarioLinks({ item, locale, ui, quotePath, short }: Omit<Props, "items"> & { item: ScenarioData }) {
  const servicePath = pathFor(item.service, locale);
  const quoteHref = !short && quotePath && item.service?._id ? `${quotePath}?service=${encodeURIComponent(item.service._id)}` : null;
  if (!servicePath && !quoteHref) return null;
  return (
    <p className="-mt-1 flex flex-wrap gap-x-6 lg:col-start-2">
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
  );
}

function ScenarioItem({ item, locale, ui, quotePath, short }: Omit<Props, "items"> & { item: ScenarioData }) {
  const cells = CELLS.flatMap(([field, labelKey]) => {
    if (short && !SHORT_FIELDS.includes(field)) return [];
    const text = pick(item[field], locale, "");
    return text ? [{ field, label: v5Label(ui, labelKey, locale), text }] : [];
  });
  return (
    <li className={`border-b border-rule ${short ? "py-3 lg:py-3.5" : "py-6"}`}>
      <article className="grid gap-x-10 gap-y-2 lg:grid-cols-[minmax(0,4fr)_minmax(0,8fr)]">
        <div>
          <h3 className="font-display max-w-[28ch] text-lg leading-snug sm:text-xl font-bold text-balance text-ink">{pick(item.title, locale, "")}</h3>
          <FigureImage image={item.image} locale={locale} ratio="3 / 2" sizes="(min-width: 640px) 384px, 100vw" className="mt-4 max-w-sm" />
        </div>
        {cells.length > 0 && (
          <div className="grid gap-x-10 sm:grid-cols-2">
            {/* Accueil (short) : « Situation » reste lisible, « Ce que vous recevez » se replie sous 640 px (fold.css, T7). */}
            <dl className={short ? "" : "grid gap-x-10 sm:col-span-2 sm:grid-cols-2"}>
              {(short ? cells.slice(0, 1) : cells).map((cell) => (
                <div key={cell.field} className={`border-t border-rule lg:nth-[-n+2]:border-t-0 lg:nth-[-n+2]:pt-0 ${short ? "py-2.5" : "py-3.5"}`}>
                  <dt className="font-display text-[15px] font-bold text-ink">{cell.label}</dt>
                  <dd className="mt-1 max-w-[46ch] text-[15px] leading-relaxed text-ink-2">{cell.text}</dd>
                </div>
              ))}
            </dl>
            {short &&
              cells.slice(1).map((cell) => (
                <details key={cell.field} className="bx-fold border-t border-rule py-0.5 sm:py-2.5 lg:border-t-0 lg:pt-0">
                  <summary className="font-display text-[15px] font-bold text-ink">{cell.label}</summary>
                  <p className="mt-1 mb-2 max-w-[46ch] text-[15px] leading-relaxed text-ink-2 sm:mb-0">{cell.text}</p>
                </details>
              ))}
          </div>
        )}
        <ScenarioLinks item={item} locale={locale} ui={ui} quotePath={quotePath} short={short} />
      </article>
    </li>
  );
}
