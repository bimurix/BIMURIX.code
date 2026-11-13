import Link from "next/link";
import type { Locale } from "@/lib/i18n/locales";
import { pick, type Localized } from "@/lib/i18n/pick";
import { v5Label, type UiLabels } from "@/lib/i18n/v5-labels";
import { pathFor, type RouteTarget } from "@/lib/links";
import { shortName } from "@/lib/services/families";
import type { NetworkColor } from "@/sanity/types-content";
import { FigureImage, type FigureImageData } from "@/ui/components/FigureImage";
import { NetworkSwatch } from "@/ui/components/NetworkSwatch";
import { Section, SectionHeading } from "../section";

type Discipline = RouteTarget & { _id?: string; code?: string; network?: NetworkColor; title?: Localized; shortTitle?: Localized };

export type ProjectsData = {
  enabled?: boolean | null;
  heading?: Localized;
  note?: Localized;
  items?: Array<{
    _key: string;
    title?: Localized;
    badge?: Localized;
    discipline?: Discipline | null;
    delivered?: Array<Localized & { _key?: string }> | null;
    tools?: Localized;
    year?: string | null;
    image?: FigureImageData;
  }>;
};

// Colonnes du registre dès lg : projet, discipline, livré, outils. Sous lg, chaque fiche est une liste empilée.
const COLUMNS = "lg:grid-cols-[minmax(0,7fr)_minmax(0,3fr)_minmax(0,4fr)_minmax(0,3fr)]";
const cellLabel = "block text-[13px] font-semibold text-ink-2 lg:sr-only";

/**
 * Registre de projets en tableau de feuille de plan (traits fins, pas de cartes). Chaque fiche porte sa pastille
 * (« Exemple — à remplacer » tant que ce n'est pas un vrai projet). Interrupteur `enabled` : coupé = section absente.
 * Aucun client, lieu, chiffre ni témoignage : ces champs n'existent pas. decision: cahier v6 C-16, ADR-009 n° 2.
 */
export function Projects({ data, locale, ui }: { data: ProjectsData; locale: Locale; ui: UiLabels }) {
  const items = (data.items ?? []).filter((item) => pick(item.title, locale, ""));
  if (data.enabled === false || items.length === 0) return null;
  const note = pick(data.note, locale, "");
  return (
    <Section id="projets">
      <SectionHeading>{pick(data.heading, locale, "")}</SectionHeading>
      {note && <p className="-mt-4 mb-(--bx-space-head) max-w-[62ch] text-[15px] text-ink-2">{note}</p>}
      <div aria-hidden="true" className={`hidden gap-x-8 border-t-[1.5px] border-ink pt-2 pb-2 text-[13px] font-semibold text-ink-2 lg:grid ${COLUMNS}`}>
        <span />
        <span>{v5Label(ui, "projectColDiscipline", locale)}</span>
        <span>{v5Label(ui, "projectColDelivered", locale)}</span>
        <span>{v5Label(ui, "projectColTools", locale)}</span>
      </div>
      <ol className="border-t-[1.5px] border-ink lg:border-t lg:border-rule">
        {items.map((item) => {
          const href = item.discipline ? pathFor(item.discipline, locale) : null;
          const badge = pick(item.badge, locale, "");
          const delivered = (item.delivered ?? []).map((d) => ({ key: d._key ?? pick(d, locale, ""), text: pick(d, locale, "") })).filter((d) => d.text);
          const tools = pick(item.tools, locale, "");
          return (
            <li key={item._key} className={`grid grid-cols-2 gap-x-6 gap-y-1 border-b border-rule py-3.5 lg:gap-x-8 lg:gap-y-3 lg:py-5 ${COLUMNS}`}>
              <div className={`col-span-2 lg:col-span-1 ${item.image?.asset?.url ? "grid grid-cols-[7rem_minmax(0,1fr)] items-start gap-x-3 lg:grid-cols-[9rem_minmax(0,1fr)] lg:gap-x-4" : ""}`}>
                <div>
                <h3 className="font-display max-w-[30ch] text-lg leading-snug font-bold text-ink sm:text-xl">{pick(item.title, locale, "")}</h3>
                {(badge || item.year) && (
                  <p className="mt-1.5 flex flex-wrap items-center gap-2 font-mono text-[12px] text-ink-2">
                    {badge && <span className="border border-ink px-2 py-0.5 text-ink">{badge}</span>}
                    {item.year && <span>{item.year}</span>}
                  </p>
                )}
                </div>
                <FigureImage image={item.image} locale={locale} ratio="3 / 2" sizes="(min-width: 1024px) 176px, 112px" className="order-first" />
              </div>
              {href && item.discipline && (
                <div className="col-span-1">
                  <span className={cellLabel}>{v5Label(ui, "projectColDiscipline", locale)}</span>
                  <Link href={href} className="group flex min-h-(--bx-tap-min) items-center gap-2.5 py-0 text-[15px] font-semibold text-blue hover:text-blue-deep">
                    <NetworkSwatch network={item.discipline.network ?? "tqc"} />
                    <span className="underline underline-offset-4">{shortName(item.discipline, locale)}</span>
                  </Link>
                </div>
              )}
              {delivered.length > 0 && (
                <div className="order-last col-span-2 lg:order-none lg:col-span-1">
                  <span className={cellLabel}>{v5Label(ui, "projectColDelivered", locale)}</span>
                  <ul className="mt-1 flex flex-wrap gap-x-4 text-[15px] leading-relaxed text-ink-2 lg:mt-0 lg:block">
                    {delivered.map((d) => (
                      <li key={d.key}>{d.text}</li>
                    ))}
                  </ul>
                </div>
              )}
              {tools && (
                <div className="col-span-1">
                  <span className={cellLabel}>{v5Label(ui, "projectColTools", locale)}</span>
                  <p className="mt-1 text-[15px] text-ink-2 lg:mt-0">{tools}</p>
                </div>
              )}
            </li>
          );
        })}
      </ol>
    </Section>
  );
}
