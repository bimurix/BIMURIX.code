import Link from "next/link";
import type { Locale } from "@/lib/i18n/locales";
import { pick, type Localized } from "@/lib/i18n/pick";
import { v5Label, type UiLabels, type V5LabelKey } from "@/lib/i18n/v5-labels";
import { pathFor } from "@/lib/links";
import { groupByFamily, shortName, type Family } from "@/lib/services/families";
import type { ServiceSummary } from "@/sanity/types-content";
import { Arrow } from "@/ui/components/Arrow";
import { Icon } from "@/ui/components/Icon";
import { networkVar } from "@/ui/components/NetworkSwatch";
import { Section, SectionHeading } from "../section";

export type ServiceNetworksData = { heading?: Localized; intro?: Localized; services?: ServiceSummary[] };

const fallback = { fr: "En savoir plus", en: "Learn more" };
const familyKey: Record<Family, V5LabelKey> = { modeler: "familyModeler", prefabriquer: "familyPrefabriquer", livrer: "familyLivrer" };

/** Tronçon du tuyau qui relie les stations ; `from` et `to` coupent le trait à la première et à la dernière station. */
function Rail({ from = "top-0", to = "bottom-0", mobileOnly = false }: { from?: string; to?: string; mobileOnly?: boolean }) {
  return <span aria-hidden="true" className={`absolute start-[14px] w-1 sm:start-[18px] bg-blue ${mobileOnly ? "lg:hidden" : ""} ${from} ${to}`} />;
}

/**
 * Les services, présentés en détail une seule fois, dans l'ordre d'un projet (S3b : fusion avec le schéma du cycle).
 * Un même tuyau relie les stations, une par service (code en mono, couleur du réseau) ; les familles sont des
 * titres de tronçon. Rangées de nomenclature séparées par des traits fins, pas de cartes.
 */
export function ServiceNetworks({ data, locale, ui }: { data: ServiceNetworksData; locale: Locale; ui?: UiLabels }) {
  const services = (data.services ?? []).flatMap((s) => {
    const href = pathFor(s, locale);
    return href ? [{ ...s, href }] : [];
  });
  if (services.length === 0) return null;
  const groups = groupByFamily(services);
  const firstId = services[0]._id;
  const lastId = groups[groups.length - 1].items.at(-1)?._id;

  return (
    <Section id="services">
      <SectionHeading intro={pick(data.intro, locale, "")}>{pick(data.heading, locale, "")}</SectionHeading>
      <div className="border-t-[1.5px] border-ink">
        {groups.map((group, g) => (
          <div key={group.family ?? "autres"} className="lg:grid lg:grid-cols-[11rem_minmax(0,1fr)]">
            {group.family && (
              <div className="relative ps-11 sm:ps-14 lg:ps-0">
                {g > 0 && <Rail mobileOnly />}
                <h3 className="pt-5 pb-0.5 text-[14px] font-semibold text-ink-2 lg:pt-6">{v5Label(ui, familyKey[group.family], locale)}</h3>
              </div>
            )}
            <ol className="lg:col-start-2">
              {group.items.map((s) => (
                <ServiceRow key={s._id} service={s} locale={locale} first={s._id === firstId} last={s._id === lastId} />
              ))}
            </ol>
          </div>
        ))}
      </div>
    </Section>
  );
}

type RowProps = { service: ServiceSummary & { href: string }; locale: Locale; first: boolean; last: boolean };

/**
 * Une station du tuyau, en ligne compacte (T3) : code et couleur du réseau, symbole et nom court, promesse et texte ;
 * toute la rangée est cliquable. Sur téléphone la flèche remplace le libellé du lien (lu par les lecteurs d'écran).
 */
function ServiceRow({ service: s, locale, first, last }: RowProps) {
  return (
    <li className="relative">
      <Rail from={first ? "top-8 sm:top-9" : "top-0"} to={last ? "h-8 sm:h-9" : "bottom-0"} />
      <Link href={s.href} className="group relative flex gap-3 sm:gap-4">
        <span className="mt-4 flex size-8 shrink-0 items-center justify-center rounded-full border-2 bg-paper font-mono text-[10px] text-ink sm:size-10 sm:text-[11px]" style={{ borderColor: networkVar[s.network ?? "tqc"] }}>
          {s.code}
        </span>
        <span className="bx-hover-bg relative grid flex-1 gap-x-8 gap-y-0.5 border-b border-rule py-3 pe-7 sm:pe-0 lg:grid-cols-[minmax(0,15rem)_minmax(0,1fr)_auto] lg:items-center">
          <span className="font-display flex items-center gap-2.5 text-lg leading-snug sm:text-xl font-bold text-ink group-hover:text-blue">
            <Icon name={s.cardIcon} className="text-blue" />
            {shortName(s, locale)}
          </span>
          <span className="max-w-[62ch]">
            <span className="block text-[16px] font-semibold text-ink">{pick(s.cardTitle, locale, "")}</span>
            <span className="mt-0.5 block text-[15px] leading-normal text-ink-2 lg:leading-relaxed">{pick(s.cardText, locale, "")}</span>
          </span>
          <span className="absolute end-0 top-3.5 inline-flex min-h-(--bx-tap-min) items-center gap-2 text-[15px] font-semibold text-blue group-hover:text-blue-deep max-sm:top-1 sm:static sm:justify-self-end">
            <span className="max-sm:sr-only">{pick(s.cardLinkLabel, locale, fallback[locale])}</span>
            <Arrow className="transition-transform group-hover:translate-x-1" />
          </span>
        </span>
      </Link>
    </li>
  );
}
