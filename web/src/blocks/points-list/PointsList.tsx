import type { Locale } from "@/lib/i18n/locales";
import { pick, type Localized } from "@/lib/i18n/pick";
import { FigureImage, type FigureImageData } from "@/ui/components/FigureImage";
import { Section, SectionHeading } from "../section";

type Item = { _key: string; title?: Localized; text?: Localized; group?: Localized; icon?: string | null };

export type PointsListData = {
  heading?: Localized;
  intro?: Localized;
  layout?: "columns" | "list";
  /** Photo d'illustration à côté de la liste (« Pourquoi Bimurix »), facultative. */
  image?: FigureImageData;
  /** Bande teintée pleine largeur. */
  band?: boolean | null;
  items?: Item[];
};

/** Regroupe les lignes sous un sous-titre : celui d'une ligne vaut pour elle et pour les suivantes, jusqu'au prochain. Aucun sous-titre : un seul groupe. */
export function groupItems(items: Item[], locale: Locale): Array<{ key: string; title: string; items: Item[] }> {
  const groups: Array<{ key: string; title: string; items: Item[] }> = [];
  for (const item of items) {
    const title = pick(item.group, locale, "");
    if (title || groups.length === 0) groups.push({ key: item._key, title, items: [] });
    groups[groups.length - 1].items.push(item);
  }
  return groups;
}

/** Points séparés par des traits fins (pas de cartes) : en colonnes, ou en liste titre / texte. */
export function PointsList({ data, locale, illustrativeLabel }: { data: PointsListData; locale: Locale; illustrativeLabel?: string }) {
  const items = data.items ?? [];
  const intro = pick(data.intro, locale, "");
  const band = data.band === true;
  const heading = <SectionHeading intro={intro}>{pick(data.heading, locale, "")}</SectionHeading>;

  // Points sans texte (ex. : pièces à envoyer) : liste compacte, pas des titres empilés.
  if (items.every((item) => !pick(item.text, locale, ""))) {
    return (
      <Section band={band}>
        {heading}
        <ul className="grid gap-x-10 border-t-[1.5px] border-ink sm:grid-cols-2 lg:grid-cols-3">
          {items.map((item) => (
            <li key={item._key} className="flex min-h-14 items-center gap-4 border-b border-rule py-3 text-[16px] font-semibold text-ink">
              <span aria-hidden="true" className="size-2.5 shrink-0 rounded-full border-2 border-blue bg-paper" />
              {pick(item.title, locale, "")}
            </li>
          ))}
        </ul>
      </Section>
    );
  }

  if (data.layout === "list") {
    const hasImage = Boolean(data.image?.asset?.url);
    return (
      <Section band={band}>
        {heading}
        <div className={hasImage ? "grid gap-10 lg:grid-cols-[minmax(0,2fr)_minmax(0,1fr)] lg:items-start" : ""}>
          <dl className="border-t-[1.5px] border-ink">
            {items.map((item) => (
              <div key={item._key} className="grid gap-2 border-b border-rule py-5 md:grid-cols-[minmax(0,1fr)_minmax(0,2fr)] md:gap-8">
                <dt className="font-display text-lg font-bold text-ink">{pick(item.title, locale, "")}</dt>
                <dd className="max-w-[62ch] text-[16px] leading-relaxed text-ink-2">{pick(item.text, locale, "")}</dd>
              </div>
            ))}
          </dl>
          <FigureImage image={data.image} locale={locale} ratio="4 / 3" sizes="(min-width: 1024px) 400px, 100vw" illustrativeLabel={illustrativeLabel} />
        </div>
      </Section>
    );
  }

  const groups = groupItems(items, locale);
  const grouped = groups.some((g) => g.title);
  const hasImage = Boolean(data.image?.asset?.url);
  return (
    <Section band={band}>
      {heading}
      <div className={hasImage ? "grid gap-10 lg:grid-cols-[minmax(0,2fr)_minmax(0,1fr)] lg:items-start" : ""}>
      <div>
      {groups.map((group) => (
        <div key={group.key} className={grouped ? "mb-10 last:mb-0" : ""}>
          {group.title && <h3 className="font-display mb-3 text-lg font-bold text-ink">{group.title}</h3>}
          <ul className="grid gap-x-10 border-t-[1.5px] border-ink sm:grid-cols-2">
            {group.items.map((item) => {
              const Title = grouped ? "h4" : "h3";
              return (
                <li key={item._key} className="border-b border-rule py-4 sm:py-5">
                  <Title className="font-display text-lg font-bold text-ink sm:text-xl">{pick(item.title, locale, "")}</Title>
                  <p className="mt-1.5 max-w-[52ch] text-[16px] leading-relaxed text-ink-2">{pick(item.text, locale, "")}</p>
                </li>
              );
            })}
          </ul>
        </div>
      ))}
      </div>
      <FigureImage image={data.image} locale={locale} ratio="4 / 3" sizes="(min-width: 1024px) 400px, 100vw" illustrativeLabel={illustrativeLabel} />
      </div>
    </Section>
  );
}
