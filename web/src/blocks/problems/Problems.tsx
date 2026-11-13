import Link from "next/link";
import type { Locale } from "@/lib/i18n/locales";
import { pick, type Localized } from "@/lib/i18n/pick";
import { pathFor, type RouteTarget } from "@/lib/links";
import { shortName } from "@/lib/services/families";
import { Arrow } from "@/ui/components/Arrow";
import { FigureImage, type FigureImageData } from "@/ui/components/FigureImage";
import { Section, SectionHeading } from "../section";

type ProblemService = RouteTarget & { _id: string; title?: Localized; shortTitle?: Localized };

export type ProblemsData = {
  heading?: Localized;
  intro?: Localized;
  image?: FigureImageData;
  items?: Array<{ _key: string; title?: Localized; text?: Localized; services?: ProblemService[] | null }>;
};

/**
 * Problèmes de chantier : chaque problème (une phrase) répond par ce que fait Bimurix et renvoie vers le ou les services.
 * Lignes séparées par des traits fins, pas de cartes. Un service sans adresse dans la langue n'a pas de lien.
 */
export function Problems({ data, locale, illustrativeLabel }: { data: ProblemsData; locale: Locale; illustrativeLabel?: string }) {
  const items = (data.items ?? []).filter((item) => pick(item.title, locale, ""));
  if (items.length === 0) return null;
  return (
    <Section id="problemes">
      <SectionHeading intro={pick(data.intro, locale, "")}>{pick(data.heading, locale, "")}</SectionHeading>
      <FigureImage image={data.image} locale={locale} ratio="21 / 9" sizes="(min-width: 1280px) 1232px, 100vw" illustrativeLabel={illustrativeLabel} className="mb-10" />
      <ol className="border-t-[1.5px] border-ink">
        {items.map((item) => {
          const links = (item.services ?? []).flatMap((s) => {
            const href = pathFor(s, locale);
            return href ? [{ id: s._id, href, label: shortName(s, locale) }] : [];
          });
          return (
            <li key={item._key} className="grid gap-x-10 gap-y-2 border-b border-rule py-6 md:grid-cols-[minmax(0,5fr)_minmax(0,6fr)]">
              <h3 className="font-display max-w-[34ch] text-xl leading-snug font-bold text-ink">{pick(item.title, locale, "")}</h3>
              <div>
                <p className="max-w-[56ch] text-[16px] leading-relaxed text-ink-2">{pick(item.text, locale, "")}</p>
                {links.length > 0 && (
                  <ul className="mt-1 flex flex-wrap gap-x-6">
                    {links.map((l) => (
                      <li key={l.id}>
                        <Link href={l.href} className="group inline-flex min-h-(--bx-tap-min) items-center gap-2 text-[15px] font-semibold text-blue underline underline-offset-4 hover:text-blue-deep">
                          {l.label}
                          <Arrow className="transition-transform group-hover:translate-x-1" />
                        </Link>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </li>
          );
        })}
      </ol>
    </Section>
  );
}
