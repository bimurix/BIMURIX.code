import Link from "next/link";
import type { Locale } from "@/lib/i18n/locales";
import { pick, type Localized } from "@/lib/i18n/pick";
import { pathFor } from "@/lib/links";
import type { ServiceSummary } from "@/sanity/types-content";
import { Arrow } from "@/ui/components/Arrow";
import { networkVar } from "@/ui/components/NetworkSwatch";

export type ServiceNetworksData = { heading?: Localized; intro?: Localized; services?: ServiceSummary[] };

const fallback = { fr: "En savoir plus", en: "Learn more" };

/**
 * Les services comme une nomenclature de réseaux : une rangée par réseau, code et couleur à gauche,
 * texte au centre, lien vers la page du service. Pas de grille de cartes identiques.
 */
export function ServiceNetworks({ data, locale }: { data: ServiceNetworksData; locale: Locale }) {
  const services = (data.services ?? []).flatMap((s) => {
    const href = pathFor(s, locale);
    return href ? [{ ...s, href }] : [];
  });

  return (
    <section id="services" className="mx-auto max-w-7xl scroll-mt-(--bx-header-h) px-4 py-16 sm:px-6 lg:py-24">
      <div className="max-w-3xl">
        <h2 className="font-display text-3xl leading-tight font-bold tracking-[-0.015em] text-balance sm:text-4xl">{pick(data.heading, locale, "")}</h2>
        {data.intro && <p className="mt-4 text-[17px] leading-relaxed text-ink-2">{pick(data.intro, locale, "")}</p>}
      </div>
      <ol className="mt-10 border-t-[1.5px] border-ink">
        {services.map((s) => (
          <li key={s._id} className="border-b border-rule">
            <Link href={s.href} className="group grid gap-x-8 gap-y-3 py-7 sm:grid-cols-[9rem_1fr_auto] sm:items-start">
              <span className="flex items-center gap-3">
                <svg aria-hidden="true" viewBox="0 0 64 12" width="64" height="12">
                  <line x1="2" y1="6" x2="54" y2="6" stroke={networkVar[s.network ?? "tqc"]} strokeWidth="6" strokeLinecap="round" />
                  <circle cx="57" cy="6" r="4.5" fill="var(--bx-paper)" stroke={networkVar[s.network ?? "tqc"]} strokeWidth="2" />
                </svg>
                <span className="font-mono text-[13px] text-ink-2">{s.code}</span>
              </span>
              <span className="max-w-[62ch]">
                <span className="block text-[13px] font-semibold text-ink-2">{pick(s.title, locale, "")}</span>
                <span className="font-display mt-1 block text-xl leading-snug font-bold text-ink group-hover:text-blue sm:text-2xl">{pick(s.cardTitle, locale, "")}</span>
                <span className="mt-2 block text-[16px] leading-relaxed text-ink-2">{pick(s.cardText, locale, "")}</span>
              </span>
              <span className="inline-flex min-h-(--bx-tap-min) items-center gap-2 text-[15px] font-semibold text-blue sm:pt-1">
                {pick(s.cardLinkLabel, locale, fallback[locale])}
                <Arrow className="transition-transform group-hover:translate-x-1" />
              </span>
            </Link>
          </li>
        ))}
      </ol>
    </section>
  );
}
