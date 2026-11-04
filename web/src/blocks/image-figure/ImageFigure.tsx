import Image from "next/image";
import type { Locale } from "@/lib/i18n/locales";
import { pick, type Localized } from "@/lib/i18n/pick";
import { urlForImage } from "@/sanity/image";
import type { ImageAsset } from "@/sanity/types-content";
import { Section } from "../section";

export type ImageFigureData = {
  caption?: Localized;
  image?: (ImageAsset & { alt?: Localized; illustrative?: boolean }) | null;
};

const illustrativeFallback = { fr: "Exemple illustratif", en: "Illustrative example" };

export function ImageFigure({ data, locale, illustrativeLabel }: { data: ImageFigureData; locale: Locale; illustrativeLabel?: string }) {
  const image = data.image;
  const asset = image?.asset;
  if (!image || !asset?.url || !asset.width || !asset.height) return null;
  const width = Math.min(asset.width, 1600);
  return (
    <Section>
      <figure className="border-[1.5px] border-ink bg-paper">
        <Image
          src={urlForImage(image).width(width).url()}
          alt={pick(image.alt, locale, "")}
          width={width}
          height={Math.round((width * asset.height) / asset.width)}
          sizes="(min-width: 1280px) 1232px, 100vw"
          loading="lazy"
          className="h-auto w-full"
        />
        <figcaption className="flex flex-wrap items-center justify-between gap-2 border-t border-ink px-4 py-3 text-[14px] text-ink-2">
          <span>{pick(data.caption, locale, "")}</span>
          {image.illustrative && <span className="font-mono text-[12px] text-ink-3">{illustrativeLabel ?? illustrativeFallback[locale]}</span>}
        </figcaption>
      </figure>
    </Section>
  );
}
