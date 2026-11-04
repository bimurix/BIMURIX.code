import Image from "next/image";
import type { Locale } from "@/lib/i18n/locales";
import { pick, type Localized } from "@/lib/i18n/pick";
import { resolveLink } from "@/lib/links";
import { urlForImage } from "@/sanity/image";
import type { Cta, ImageAsset, Shell, TitleBlockData } from "@/sanity/types-content";
import { Arrow } from "@/ui/components/Arrow";
import { ButtonLink } from "@/ui/components/ButtonLink";
import { Logo } from "@/ui/components/Logo";
import { NetworkSwatch } from "@/ui/components/NetworkSwatch";
import { IsoNetworks, type IsoRun } from "@/ui/patterns/IsoNetworks";
import { Sheet, TitleBlock } from "@/ui/patterns/Sheet";

export type HeroSheetData = {
  heading?: Localized;
  intro?: Localized;
  ctas?: Cta[];
  specialties?: Localized;
  illustration?: (ImageAsset & { alt?: Localized }) | null;
};

type Props = { data: HeroSheetData; locale: Locale; shell: Shell; titleBlock: TitleBlockData; runs: IsoRun[] };

const fallback = {
  fr: { hint: "Choisissez un réseau pour demander une soumission sur ce service.", sheet: "Feuille", revision: "Révision", date: "Date", figure: "Réseaux des services Bimurix" },
  en: { hint: "Pick a network to request a quote for that service.", sheet: "Sheet", revision: "Revision", date: "Date", figure: "Bimurix service networks" },
};

/** Premier écran « feuille de plan » : titre, action, isométrique, légende cliquable et cartouche. */
export function HeroSheet({ data, locale, shell, titleBlock, runs }: Props) {
  const t = fallback[locale];
  const ui = shell?.ui;
  const ctas = (data.ctas ?? []).flatMap((c) => {
    const href = resolveLink(c.link, locale);
    return href ? [{ key: c._key ?? href, href, label: pick(c.label, locale, ""), style: c.style ?? "primary" }] : [];
  });
  const illustration = data.illustration?.asset?.url ? data.illustration : null;
  const settings = shell?.settings;

  return (
    <section className="mx-auto max-w-7xl px-4 pt-6 pb-10 sm:px-6 sm:pt-10">
      <Sheet>
        <div className="bx-iso">
          <div className="grid gap-8 p-5 sm:p-8 lg:grid-cols-12 lg:gap-6 lg:p-10">
            <div className="lg:col-span-6 lg:pt-4">
              <h1 className="font-display text-[2.1rem] leading-[1.04] font-bold tracking-[-0.02em] text-balance text-ink sm:text-5xl lg:text-[3.2rem] xl:text-[3.5rem]">
                {pick(data.heading, locale, "")}
              </h1>
              <p className="mt-5 max-w-[46ch] text-[17px] leading-relaxed text-ink-2">{pick(data.intro, locale, "")}</p>
              <div className="mt-7 flex flex-col gap-3 sm:flex-row">
                {ctas.map((c) => (
                  <ButtonLink key={c.key} href={c.href} variant={c.style === "secondary" ? "secondary" : "primary"}>
                    {c.label}
                  </ButtonLink>
                ))}
              </div>
              <p className="mt-6 text-[14px] text-ink-3">{pick(data.specialties, locale, "")}</p>
            </div>
            <figure className="lg:col-span-6 lg:self-center">
              {illustration ? (
                <Image src={urlForImage(illustration).width(1200).url()} alt={pick(illustration.alt, locale, "")} width={1200} height={Math.round(1200 * ((illustration.asset?.height ?? 3) / (illustration.asset?.width ?? 4)))} sizes="(min-width: 1024px) 56vw, 100vw" priority className="h-auto w-full" />
              ) : (
                <IsoNetworks runs={runs} title={t.figure} />
              )}
            </figure>
          </div>

          <div className="grid border-t-[1.5px] border-ink lg:grid-cols-12">
            <div className="p-5 sm:p-6 lg:col-span-8">
              <p className="mb-3 text-[14px] text-ink-2">{pick(ui?.networkHint, locale, t.hint)}</p>
              <ol className="grid gap-x-6 sm:grid-cols-2">
                {runs.map((run, i) => (
                  <li key={run.id}>
                    <a href={run.href} data-net-i={i} className="group flex min-h-12 items-center gap-3 border-b border-rule text-[15px] text-ink hover:text-blue">
                      <NetworkSwatch network={run.network} />
                      <span className="w-11 font-mono text-[12px] text-ink-2">{run.code}</span>
                      <span className="flex-1">{run.label}</span>
                      <Arrow className="transition-transform group-hover:translate-x-1" />
                    </a>
                  </li>
                ))}
              </ol>
            </div>
            <div className="lg:col-span-4 lg:self-end">
              <TitleBlock
                data={titleBlock}
                labels={{ sheet: pick(ui?.sheet, locale, t.sheet), revision: pick(ui?.revision, locale, t.revision), date: pick(ui?.date, locale, t.date) }}
                brand={<Logo image={settings?.logo} alt={pick(settings?.logoAlt, locale, "Bimurix")} wordmark={settings?.wordmark ?? "bimurix"} height={18} />}
              />
            </div>
          </div>
        </div>
      </Sheet>
    </section>
  );
}
