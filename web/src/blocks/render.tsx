import type { Locale } from "@/lib/i18n/locales";
import { pick } from "@/lib/i18n/pick";
import { pathFor } from "@/lib/links";
import type { Shell, TitleBlockData } from "@/sanity/types-content";
import type { IsoRun } from "@/ui/patterns/IsoNetworks";
import { HeroSheet, type HeroSheetData } from "./hero-sheet/HeroSheet";
import { ServiceNetworks, type ServiceNetworksData } from "./service-networks/ServiceNetworks";

export type Section = { _key: string; _type: string } & Record<string, unknown>;
type Context = { locale: Locale; shell: Shell; titleBlock: TitleBlockData };

/** Réseaux de l'isométrique : un par service, lien vers la soumission avec ce service pré-choisi. */
export function buildRuns(shell: Shell, locale: Locale): IsoRun[] {
  const quotePath = pathFor(shell?.quotePage, locale);
  if (!quotePath) return [];
  return (shell?.services ?? []).map((s) => ({
    id: s._id,
    code: s.code ?? "",
    label: pick(s.title, locale, ""),
    network: s.network ?? "tqc",
    href: `${quotePath}?service=${encodeURIComponent(s._id)}`,
  }));
}

// Blocs rendus en L3 ; les autres (méthode, points, texte, appel, FAQ, image, formulaire) arrivent en L4.
export function RenderSections({ sections, ctx }: { sections: Section[] | undefined; ctx: Context }) {
  return (
    <>
      {(sections ?? []).map((section) => {
        switch (section._type) {
          case "heroSheet":
            return <HeroSheet key={section._key} data={section as HeroSheetData} locale={ctx.locale} shell={ctx.shell} titleBlock={ctx.titleBlock} runs={buildRuns(ctx.shell, ctx.locale)} />;
          case "serviceNetworks":
            return <ServiceNetworks key={section._key} data={section as ServiceNetworksData} locale={ctx.locale} />;
          default:
            return null;
        }
      })}
    </>
  );
}
