import Image from "next/image";
import type { ImageAsset } from "@/sanity/types-content";

type Props = { image?: ImageAsset; alt: string; wordmark: string; height?: number; inverse?: boolean };

// Logo téléversé dans Sanity (Identité) ; logotype texte tant qu'aucun fichier n'est fourni.
export function Logo({ image, alt, wordmark, height = 22, inverse = false }: Props) {
  const asset = image?.asset;
  if (asset?.url && asset.width && asset.height) {
    const width = Math.round((asset.width / asset.height) * height);
    // SVG servi tel quel par le CDN Sanity : pas d'optimisation à faire.
    return <Image src={asset.url} alt={alt} width={width} height={height} unoptimized priority className="block" style={{ height, width }} />;
  }
  return (
    <span className={`font-display text-[22px] leading-none font-extrabold tracking-tight ${inverse ? "text-paper" : "text-blue"}`} style={{ fontVariationSettings: '"wdth" 125' }}>
      {wordmark}
    </span>
  );
}
