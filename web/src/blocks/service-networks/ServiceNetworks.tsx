import Link from "next/link";
import type { Locale } from "@/lib/i18n/locales";
import { pick, type Localized } from "@/lib/i18n/pick";
import { v5Label, type UiLabels, type V5LabelKey } from "@/lib/i18n/v5-labels";
import { pathFor } from "@/lib/links";
import { groupByFamily, shortName, type Family } from "@/lib/services/families";
import type { ServiceSummary } from "@/sanity/types-content";
import { Arrow } from "@/ui/components/Arrow";
import { networkVar } from "@/ui/components/NetworkSwatch";
import { Section, SectionHeading } from "../section";

export type ServiceNetworksData = { heading?: Localized; intro?: Localized; services?: ServiceSummary[] };

const fallback = { fr: "En savoir plus", en: "Learn more" };
const familyKey: Record<Family, V5LabelKey> = { modeler: "familyModeler", prefabriquer: "familyPrefabriquer", livrer: "familyLivrer" };

/** Tronçon du tuyau qui relie les stations ; `from` et `to` coupent le trait à la première et à la dernière station. */
function Rail({ from = "top-0", to = "bottom-0" }: { from?: string; to?: string }) {
  return <span aria-hidden="true" className={`absolute start-[18px] w-1 bg-blue ${from} ${to}`} />;
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
          <div key={group.family ?? "autres"}>
            {group.family && (
              <div className="relative ps-14">
                {g > 0 && <Rail />}
                <h3 className="pt-6 pb-1 text-[14px] font-semibold text-ink-2">{v5Label(ui, familyKey[group.family], locale)}</h3>
              </div>
            )}
            <ol>
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

/** Une station du tuyau : code et couleur du réseau, nom court, promesse, texte et lien ; toute la rangée est cliquable. */
function ServiceRow({ service: s, locale, first, last }: RowProps) {
  return (
    <li className="relative">
      <Rail from={first ? "top-10" : "top-0"} to={last ? "h-10" : "bottom-0"} />
      <Link href={s.href} className="group relative flex gap-4">
        <span className="mt-5 flex size-10 shrink-0 items-center justify-center rounded-full border-2 bg-paper font-mono text-[11px] text-ink" style={{ borderColor: networkVar[s.network ?? "tqc"] }}>
          {s.code}
        </span>
        <span className="grid flex-1 gap-x-8 gap-y-1 border-b border-rule py-5 lg:grid-cols-[minmax(0,16rem)_minmax(0,1fr)_auto] lg:items-start">
          <span className="font-display pt-1.5 text-xl leading-snug font-bold text-ink group-hover:text-blue">{shortName(s, locale)}</span>
          <span className="max-w-[62ch] lg:pt-2">
            <span className="block text-[16px] font-semibold text-ink">{pick(s.cardTitle, locale, "")}</span>
            <span className="mt-1 block text-[15px] leading-relaxed text-ink-2">{pick(s.cardText, locale, "")}</span>
          </span>
          <span className="inline-flex min-h-(--bx-tap-min) items-center gap-2 justify-self-start text-[15px] font-semibold text-blue group-hover:text-blue-deep lg:justify-self-end">
            {pick(s.cardLinkLabel, locale, fallback[locale])}
            <Arrow className="transition-transform group-hover:translate-x-1" />
          </span>
        </span>
      </Link>
    </li>
  );
}
