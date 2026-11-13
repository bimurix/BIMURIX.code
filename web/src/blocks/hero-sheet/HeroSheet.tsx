import type { Locale } from "@/lib/i18n/locales";
import { pick, type Localized } from "@/lib/i18n/pick";
import { resolveLink } from "@/lib/links";
import type { Cta, Shell, TitleBlockData } from "@/sanity/types-content";
import { ButtonLink } from "@/ui/components/ButtonLink";
import { FigureImage, type FigureImageData } from "@/ui/components/FigureImage";
import { Logo } from "@/ui/components/Logo";
import { IsoNetworks, type IsoRun } from "@/ui/patterns/IsoNetworks";
import { Sheet, TitleBlock } from "@/ui/patterns/Sheet";

export type HeroSheetData = {
  heading?: Localized;
  intro?: Localized;
  ctas?: Cta[];
  specialties?: Localized;
  illustration?: FigureImageData;
};

type Props = {
  data: HeroSheetData;
  locale: Locale;
  shell: Shell;
  titleBlock: TitleBlockData;
  /** Réseaux de l'isométrique ; absent ou vide = premier écran compact (pages intérieures). */
  runs?: IsoRun[];
  /** Contenu de la bande basse à gauche du cartouche (ex. : code et réseau d'un service). */
  aside?: React.ReactNode;
  /** Petite ligne au-dessus du H1 portant une donnée (ex. : code du service), jamais un slogan. */
  meta?: React.ReactNode;
};

const fallback = {
  fr: { hint: "Choisissez un réseau pour demander une soumission sur ce service.", sheet: "Feuille", revision: "Révision", date: "Date", figure: "Réseaux des services Bimurix" },
  en: { hint: "Pick a network to request a quote for that service.", sheet: "Sheet", revision: "Revision", date: "Date", figure: "Bimurix service networks" },
};

/** Premier écran « feuille de plan » : titre, action, dessin (accueil), bande basse et cartouche. */
export function HeroSheet({ data, locale, shell, titleBlock, runs = [], aside, meta }: Props) {
  const t = fallback[locale];
  const ui = shell?.ui;
  const settings = shell?.settings;
  const ctas = (data.ctas ?? []).flatMap((c) => {
    const href = resolveLink(c.link, locale);
    return href ? [{ key: c._key ?? href, href, label: pick(c.label, locale, ""), style: c.style ?? "primary" }] : [];
  });
  const illustration = data.illustration?.asset?.url ? data.illustration : null;
  const withDrawing = runs.length > 0 || illustration;
  const compact = runs.length === 0;

  // S3b : l'isométrique ne redit plus la liste des services (présentés une fois, plus bas). Chaque tracé reste un lien
  // nommé (code et service) pour le clavier et les lecteurs d'écran ; la phrase d'aide n'apparaît que là où les codes se lisent.
  const hint = runs.length > 0 && <p className="text-[14px] text-ink-2 max-sm:hidden">{pick(ui?.networkHint, locale, t.hint)}</p>;
  const bottomLeft = hint || aside;

  return (
    <section className={`mx-auto max-w-7xl px-4 pt-6 sm:px-6 sm:pt-10 ${compact ? "pb-4" : "pb-10"}`}>
      <Sheet>
        <div className="bx-iso">
          <div className={`grid gap-8 p-5 sm:p-8 lg:gap-6 lg:p-10 ${withDrawing ? "lg:grid-cols-12" : ""}`}>
            <div className={withDrawing ? "lg:col-span-6 lg:pt-4" : "max-w-4xl"}>
              {meta && <div className="mb-4">{meta}</div>}
              <h1 className={`font-display leading-[1.04] font-bold tracking-[-0.02em] text-balance text-ink ${compact ? "text-[2rem] sm:text-[2.6rem] lg:text-[3rem]" : "text-[1.75rem] sm:text-5xl lg:text-[3.2rem] xl:text-[3.5rem]"}`}>
                {pick(data.heading, locale, "")}
              </h1>
              {data.intro && <p className="mt-5 max-w-[60ch] text-[17px] leading-relaxed text-ink-2">{pick(data.intro, locale, "")}</p>}
              {ctas.length > 0 && (
                <div className="mt-7 flex flex-col gap-3 sm:flex-row">
                  {ctas.map((c) => (
                    <ButtonLink key={c.key} href={c.href} variant={c.style === "secondary" ? "secondary" : "primary"}>
                      {c.label}
                    </ButtonLink>
                  ))}
                </div>
              )}
              {data.specialties && <p className="mt-6 text-[14px] text-ink-2">{pick(data.specialties, locale, "")}</p>}
            </div>
            {withDrawing && (
              <div className="lg:col-span-6 lg:self-center">
                {illustration ? (
                  // Seule image prioritaire de la page ; le titre (texte) ne dépend pas d'elle pour s'afficher.
                  <FigureImage image={illustration} locale={locale} ratio="4 / 3" sizes="(min-width: 1280px) 560px, (min-width: 1024px) 45vw, 100vw" priority illustrativeLabel={pick(ui?.illustrativeExample, locale, "") || undefined} />
                ) : (
                  <figure><IsoNetworks runs={runs} title={t.figure} /></figure>
                )}
              </div>
            )}
          </div>

          <div className="grid border-t-[1.5px] border-ink lg:grid-cols-12">
            <div className={`p-5 sm:p-6 lg:col-span-8 ${aside ? "" : hint ? "max-sm:hidden" : "max-lg:hidden"}`}>{bottomLeft}</div>
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
