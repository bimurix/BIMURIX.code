import Link from "next/link";
import type { Locale } from "@/lib/i18n/locales";
import { pick, type Localized } from "@/lib/i18n/pick";
import { pathFor, type RouteTarget } from "@/lib/links";
import { shortName } from "@/lib/services/families";
import type { NetworkColor } from "@/sanity/types-content";
import { Arrow } from "@/ui/components/Arrow";
import { FigureImage, type FigureImageData } from "@/ui/components/FigureImage";
import { NetworkSwatch } from "@/ui/components/NetworkSwatch";
import { Section, SectionHeading } from "../section";

type ProblemService = RouteTarget & { _id: string; visible?: boolean | null; code?: string; network?: NetworkColor; title?: Localized; shortTitle?: Localized };

export type ProblemsData = {
  heading?: Localized;
  intro?: Localized;
  image?: FigureImageData;
  items?: Array<{ _key: string; title?: Localized; text?: Localized; services?: Array<ProblemService | null> | null }>;
};

/**
 * Problèmes de chantier : une rangée par problème, en trois temps lus de gauche à droite : le problème, ce que fait
 * Bimurix, le service qui s'en charge (couleur du réseau, code en mono, lien). Traits fins, pas de cartes.
 * Un service sans adresse dans la langue n'a pas de lien.
 */
export function Problems({ data, locale, illustrativeLabel }: { data: ProblemsData; locale: Locale; illustrativeLabel?: string }) {
  const items = (data.items ?? []).filter((item) => pick(item.title, locale, ""));
  if (items.length === 0) return null;
  return (
    <Section id="problemes">
      <SectionHeading intro={pick(data.intro, locale, "")}>{pick(data.heading, locale, "")}</SectionHeading>
      <FigureImage image={data.image} locale={locale} ratio="21 / 9" sizes="(min-width: 1280px) 1232px, 100vw" illustrativeLabel={illustrativeLabel} className="mb-(--bx-space-head)" />
      <ol className="border-t-[1.5px] border-ink">
        {items.map((item) => {
          const links = (item.services ?? []).flatMap((s) => {
            // Un service masqué (ou supprimé) ne donne aucun lien.
            if (!s || s.visible === false) return [];
            const href = pathFor(s, locale);
            return href ? [{ id: s._id, href, label: shortName(s, locale), code: s.code, network: s.network ?? "tqc" }] : [];
          });
          return (
            <li key={item._key} className="grid gap-x-8 gap-y-2 border-b border-rule py-5 md:grid-cols-2 lg:grid-cols-[minmax(0,5fr)_minmax(0,5fr)_minmax(0,4fr)]">
              <h3 className="font-display max-w-[30ch] text-lg leading-snug font-bold text-ink sm:text-xl">{pick(item.title, locale, "")}</h3>
              <p className="max-w-[52ch] text-[16px] leading-relaxed text-ink-2">{pick(item.text, locale, "")}</p>
              {links.length > 0 && (
                <ul className="md:col-span-2 lg:col-span-1 lg:-mt-2.5">
                  {links.map((l) => (
                    <li key={l.id}>
                      <Link href={l.href} className="group flex min-h-(--bx-tap-min) items-center gap-3 text-[15px] font-semibold text-blue hover:text-blue-deep">
                        <NetworkSwatch network={l.network} />
                        {l.code && <span className="shrink-0 font-mono text-[12px] font-normal text-ink-2">{l.code}</span>}
                        <span className="underline underline-offset-4">{l.label}</span>
                        <Arrow className="transition-transform group-hover:translate-x-1" />
                      </Link>
                    </li>
                  ))}
                </ul>
              )}
            </li>
          );
        })}
      </ol>
    </Section>
  );
}
