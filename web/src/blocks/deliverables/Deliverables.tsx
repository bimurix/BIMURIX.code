import Image from "next/image";
import type { Locale } from "@/lib/i18n/locales";
import { pick, type Localized } from "@/lib/i18n/pick";
import { urlForImage } from "@/sanity/image";
import type { ImageAsset } from "@/sanity/types-content";
import { Section, SectionHeading } from "../section";

type Item = { _key: string; title?: Localized; text?: Localized; image?: (ImageAsset & { alt?: Localized; illustrative?: boolean }) | null };
export type DeliverablesData = { heading?: Localized; intro?: Localized; note?: Localized; items?: Item[] };

/** Exemples de livrables : vignette (si fournie) et texte ; un visuel synthétique porte sa mention. */
export function Deliverables({ data, locale, illustrativeLabel }: { data: DeliverablesData; locale: Locale; illustrativeLabel: string }) {
  const items = data.items ?? [];
  if (items.length === 0) return null;
  return (
    <Section>
      <SectionHeading intro={pick(data.intro, locale, "")}>{pick(data.heading, locale, "")}</SectionHeading>
      <ul className="grid gap-x-8 gap-y-10 sm:grid-cols-2 lg:grid-cols-3">
        {items.map((item) => {
          const asset = item.image?.asset;
          return (
            <li key={item._key}>
              {item.image && asset?.url && asset.width && asset.height && (
                <figure className="mb-4 border border-ink">
                  <Image src={urlForImage(item.image).width(800).url()} alt={pick(item.image.alt, locale, "")} width={800} height={Math.round((800 * asset.height) / asset.width)} sizes="(min-width: 1024px) 400px, (min-width: 640px) 50vw, 100vw" loading="lazy" className="h-auto w-full" />
                  {item.image.illustrative && <figcaption className="border-t border-ink px-3 py-1.5 font-mono text-[11px] text-ink-3">{illustrativeLabel}</figcaption>}
                </figure>
              )}
              <h3 className="font-display text-lg font-bold text-ink">{pick(item.title, locale, "")}</h3>
              <p className="mt-2 text-[16px] leading-relaxed text-ink-2">{pick(item.text, locale, "")}</p>
            </li>
          );
        })}
      </ul>
      {data.note && <p className="mt-10 max-w-[68ch] text-[15px] text-ink-3">{pick(data.note, locale, "")}</p>}
    </Section>
  );
}
