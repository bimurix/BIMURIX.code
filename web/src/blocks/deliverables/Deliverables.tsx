import Image from "next/image";
import type { Locale } from "@/lib/i18n/locales";
import { pick, type Localized } from "@/lib/i18n/pick";
import { urlForImage } from "@/sanity/image";
import type { ImageAsset } from "@/sanity/types-content";
import { Section, SectionHeading } from "../section";
import { DeliverableTable } from "./DeliverableTable";

type Item = { _key: string; title?: Localized; text?: Localized; purpose?: Localized; image?: (ImageAsset & { alt?: Localized; illustrative?: boolean }) | null };
export type DeliverablesData = { heading?: Localized; intro?: Localized; note?: Localized; items?: Item[] };

type Props = { data: DeliverablesData; locale: Locale; illustrativeLabel: string; labels: { item: string; purpose: string } };

/**
 * Livrables. Sans vignette : nomenclature « livrable → à quoi ça sert » (les en-têtes sont dits une fois).
 * Avec vignettes : grille d'exemples, l'usage en texte courant ; un visuel synthétique porte sa mention.
 */
export function Deliverables({ data, locale, illustrativeLabel, labels }: Props) {
  const items = data.items ?? [];
  if (items.length === 0) return null;
  const heading = pick(data.heading, locale, "");
  const withImages = items.some((item) => item.image?.asset?.url);
  return (
    <Section id="livrables">
      <SectionHeading intro={pick(data.intro, locale, "")}>{heading}</SectionHeading>
      {withImages ? (
        <ul className="grid gap-x-8 gap-y-10 sm:grid-cols-2 lg:grid-cols-3">
          {items.map((item) => (
            <Example key={item._key} item={item} locale={locale} illustrativeLabel={illustrativeLabel} />
          ))}
        </ul>
      ) : (
        <DeliverableTable
          className="max-w-5xl"
          caption={heading || undefined}
          labels={labels}
          lines={items.map((item) => ({ key: item._key, title: pick(item.title, locale, ""), text: pick(item.text, locale, ""), purpose: pick(item.purpose, locale, "") }))}
        />
      )}
      {data.note && <p className="mt-8 max-w-[60ch] text-[15px] text-ink-2">{pick(data.note, locale, "")}</p>}
    </Section>
  );
}

function Example({ item, locale, illustrativeLabel }: { item: Item; locale: Locale; illustrativeLabel: string }) {
  const asset = item.image?.asset;
  const purpose = pick(item.purpose, locale, "");
  return (
    <li>
      {item.image && asset?.url && asset.width && asset.height && (
        <figure className="mb-4 border border-ink">
          <Image src={urlForImage(item.image).width(800).url()} alt={pick(item.image.alt, locale, "")} width={800} height={Math.round((800 * asset.height) / asset.width)} sizes="(min-width: 1024px) 400px, (min-width: 640px) 50vw, 100vw" loading="lazy" className="h-auto w-full" />
          {item.image.illustrative && <figcaption className="border-t border-ink px-3 py-1.5 font-mono text-[11px] text-ink-2">{illustrativeLabel}</figcaption>}
        </figure>
      )}
      <h3 className="font-display text-lg font-bold text-ink">{pick(item.title, locale, "")}</h3>
      <p className="mt-2 text-[16px] leading-relaxed text-ink-2">{pick(item.text, locale, "")}</p>
      {purpose && <p className="mt-2 text-[15px] leading-relaxed text-ink-2">{purpose}</p>}
    </li>
  );
}
