import type { Locale } from "@/lib/i18n/locales";
import { pick, type Localized } from "@/lib/i18n/pick";
import { v5Label, type UiLabels } from "@/lib/i18n/v5-labels";
import { Section, SectionHeading } from "../section";
import { ScenarioList, type ScenarioData } from "./ScenarioList";

export type ScenariosData = { heading?: Localized; intro?: Localized; note?: Localized; short?: boolean | null; items?: ScenarioData[] };

type Props = {
  data: ScenariosData;
  locale: Locale;
  ui: UiLabels;
  quotePath?: string | null;
  /** Lien de soumission unique sous la liste (page de service) : un lien souligné, jamais un second bouton. */
  quoteLink?: { href: string; label: string } | null;
};

/** Situations types : titre, note « exemples types, pas des projets réels » (éditable) et liste. Rien sans situation. */
export function Scenarios({ data, locale, ui, quotePath, quoteLink }: Props) {
  const items = data.items ?? [];
  if (items.length === 0) return null;
  const note = pick(data.note, locale, "") || v5Label(ui, "scenariosNote", locale);
  return (
    <Section id="situations" band>
      <SectionHeading intro={pick(data.intro, locale, "")}>{pick(data.heading, locale, "") || v5Label(ui, "scenariosHeading", locale)}</SectionHeading>
      <p className="-mt-4 mb-(--bx-space-head) max-w-[62ch] text-[15px] text-ink-2">{note}</p>
      <ScenarioList items={items} locale={locale} ui={ui} quotePath={quotePath} short={data.short === true} />
      {quoteLink && (
        <p className="mt-4">
          <a href={quoteLink.href} className="inline-flex min-h-(--bx-tap-min) items-center text-[16px] font-semibold text-blue underline underline-offset-4 hover:text-blue-deep">
            {quoteLink.label}
          </a>
        </p>
      )}
    </Section>
  );
}
