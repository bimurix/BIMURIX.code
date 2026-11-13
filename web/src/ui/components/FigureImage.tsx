import Image from "next/image";
import type { Locale } from "@/lib/i18n/locales";
import { pick, type Localized } from "@/lib/i18n/pick";
import { urlForImage } from "@/sanity/image";
import type { ImageAsset } from "@/sanity/types-content";

export type FigureImageData = (ImageAsset & { alt?: Localized; caption?: Localized; illustrative?: boolean }) | null | undefined;

const illustrativeFallback = { fr: "Exemple illustratif", en: "Illustrative example" };

type Props = {
  image: FigureImageData;
  locale: Locale;
  /** Rapport largeur / hauteur réservé avant le chargement (ex. « 4 / 3 », « 21 / 9 »). */
  ratio?: string;
  /** Rapport plus bas sur téléphone (hauteur de page, T3) ; absent = le même partout. */
  ratioSm?: string;
  sizes: string;
  /** Seulement pour l'image du haut de page (plan de contenu v5 § 7 n° 5). */
  priority?: boolean;
  illustrativeLabel?: string;
  className?: string;
};

/**
 * Image de page dans un cadre de feuille de plan : le rapport est fixé par le gabarit (pas de saut de mise en page),
 * la légende reste visible. Sans image, ne rend rien. Photo d'illustration : légende et mention saisies dans Studio.
 */
export function FigureImage({ image, locale, ratio = "4 / 3", ratioSm, sizes, priority = false, illustrativeLabel, className = "" }: Props) {
  if (!image?.asset?.url) return null;
  const caption = pick(image.caption, locale, "");
  const mention = image.illustrative ? illustrativeLabel || illustrativeFallback[locale] : "";
  // Schéma au trait (SVG) : servi tel quel, entier dans son cadre ; une photo est recadrée au rapport du gabarit.
  const vector = image.asset.url.split("?")[0].endsWith(".svg");
  return (
    <figure className={`${vector ? "bx-figure-draw " : ""}border-[1.5px] border-ink bg-paper ${className}`}>
      <div className="relative aspect-(--bx-r-sm) w-full sm:aspect-(--bx-r)" style={{ "--bx-r": ratio, "--bx-r-sm": ratioSm ?? ratio } as React.CSSProperties}>
        <Image src={vector ? image.asset.url : urlForImage(image).width(1400).url()} alt={pick(image.alt, locale, "")} fill sizes={sizes} priority={priority} unoptimized={vector} className={vector ? "object-contain" : "object-cover"} />
      </div>
      {(caption || mention) && (
        <figcaption className="flex flex-wrap items-center justify-between gap-x-4 gap-y-1 border-t border-ink px-3 py-2 font-mono text-[12px] text-ink-2">
          <span>{caption}</span>
          {mention && caption !== mention && <span>{mention}</span>}
        </figcaption>
      )}
    </figure>
  );
}
