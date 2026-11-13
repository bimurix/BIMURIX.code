import Link from "next/link";
import type { Locale } from "@/lib/i18n/locales";
import { pick, type Localized } from "@/lib/i18n/pick";
import { v5Label, type UiLabels, type V5LabelKey } from "@/lib/i18n/v5-labels";
import { pathFor } from "@/lib/links";
import { groupByFamily, shortName, type Family } from "@/lib/services/families";
import type { ServiceSummary } from "@/sanity/types-content";
import { networkVar } from "@/ui/components/NetworkSwatch";
import { Section, SectionHeading } from "../section";

export type ProjectCycleData = { heading?: Localized; intro?: Localized; summary?: Localized; services?: ServiceSummary[] };

const familyKey: Record<Family, V5LabelKey> = { modeler: "familyModeler", prefabriquer: "familyPrefabriquer", livrer: "familyLivrer" };

/**
 * Schéma du cycle du projet : les services dans l'ordre d'un projet, une station par service (code en mono,
 * couleur du réseau, lien vers sa page), regroupés par famille. HTML rendu côté serveur, sans script.
 * Vertical sur mobile, horizontal dès lg. L'équivalent texte est la liste elle-même (+ description facultative lue par les lecteurs d'écran).
 */
export function ProjectCycle({ data, locale, ui }: { data: ProjectCycleData; locale: Locale; ui: UiLabels }) {
  const stations = (data.services ?? []).flatMap((s) => {
    const href = pathFor(s, locale);
    return href ? [{ ...s, href }] : [];
  });
  if (stations.length === 0) return null;
  const groups = groupByFamily(stations);
  const summary = pick(data.summary, locale, "");
  const lastId = stations[stations.length - 1]._id;

  return (
    <Section id="cycle">
      <SectionHeading intro={pick(data.intro, locale, "")}>{pick(data.heading, locale, "")}</SectionHeading>
      <figure aria-label={pick(data.heading, locale, "") || undefined}>
        {summary && <figcaption className="sr-only">{summary}</figcaption>}
        <ol className="flex flex-col gap-8 lg:flex-row lg:gap-0">
          {groups.map((group) => (
            <li key={group.family ?? "autres"} className="lg:min-w-0" style={{ flexGrow: group.items.length, flexBasis: 0 }}>
              {group.family && <h3 className="mb-4 border-t-[1.5px] border-ink pt-2 text-[15px] font-semibold text-ink lg:pe-4">{v5Label(ui, familyKey[group.family], locale)}</h3>}
              <ol className="flex flex-col lg:flex-row">
                {group.items.map((s) => (
                  <li key={s._id} className="relative flex-1 pb-8 last:pb-0 lg:pb-0">
                    {s._id !== lastId && (
                      <span aria-hidden="true" className="absolute start-[19px] top-10 -bottom-0 w-[5px] bg-blue lg:start-10 lg:end-0 lg:top-[18px] lg:bottom-auto lg:h-[5px] lg:w-auto" />
                    )}
                    <Link href={s.href} className="group relative flex min-h-(--bx-tap-min) gap-4 lg:flex-col lg:gap-3 lg:pe-4">
                      <span
                        className="flex size-10 shrink-0 items-center justify-center rounded-full border-2 bg-paper font-mono text-[11px] text-ink"
                        style={{ borderColor: networkVar[s.network ?? "tqc"] }}
                      >
                        {s.code}
                      </span>
                      <span className="font-display max-w-[22ch] pt-1.5 text-[17px] leading-snug font-bold text-ink group-hover:text-blue lg:pt-0">{shortName(s, locale)}</span>
                    </Link>
                  </li>
                ))}
              </ol>
            </li>
          ))}
        </ol>
      </figure>
    </Section>
  );
}
