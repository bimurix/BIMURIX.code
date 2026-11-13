import type { Locale } from "@/lib/i18n/locales";
import { pick, type Localized } from "@/lib/i18n/pick";
import { Icon } from "@/ui/components/Icon";
import { Section, SectionHeading } from "../section";

export type FaqData = { heading?: Localized; items?: Array<{ _key: string; question?: Localized; answer?: Localized }> };

// <details> natif : clavier et lecteurs d'écran pris en charge sans JavaScript.
export function Faq({ data, locale }: { data: FaqData; locale: Locale }) {
  return (
    <Section>
      <SectionHeading>{pick(data.heading, locale, "")}</SectionHeading>
      <div className="grid items-start border-t-[1.5px] border-ink lg:max-w-none lg:grid-cols-2 lg:gap-x-12">
        {(data.items ?? []).map((item) => (
          <details key={item._key} className="group border-b border-rule">
            <summary className="flex min-h-14 cursor-pointer list-none items-center justify-between gap-4 py-2.5 text-[16px] leading-snug sm:py-3 sm:text-[17px] font-semibold text-ink">
              {pick(item.question, locale, "")}
              <Icon name="plus" size="sm" className="transition-transform group-open:rotate-45" />
            </summary>
            <p className="max-w-[62ch] pb-4 text-[16px] leading-relaxed text-ink-2">{pick(item.answer, locale, "")}</p>
          </details>
        ))}
      </div>
    </Section>
  );
}
