import type { Locale } from "@/lib/i18n/locales";
import { pick, type Localized } from "@/lib/i18n/pick";
import { Section, SectionHeading } from "../section";

export type FaqData = { heading?: Localized; items?: Array<{ _key: string; question?: Localized; answer?: Localized }> };

// <details> natif : clavier et lecteurs d'écran pris en charge sans JavaScript.
export function Faq({ data, locale }: { data: FaqData; locale: Locale }) {
  return (
    <Section>
      <SectionHeading>{pick(data.heading, locale, "")}</SectionHeading>
      <div className="max-w-3xl border-t-[1.5px] border-ink">
        {(data.items ?? []).map((item) => (
          <details key={item._key} className="group border-b border-rule">
            <summary className="flex min-h-14 cursor-pointer list-none items-center justify-between gap-4 py-4 text-[17px] font-semibold text-ink">
              {pick(item.question, locale, "")}
              <svg aria-hidden="true" viewBox="0 0 12 12" width="12" height="12" className="shrink-0 transition-transform group-open:rotate-45">
                <path d="M6 0v12M0 6h12" stroke="currentColor" strokeWidth="1.5" />
              </svg>
            </summary>
            <p className="max-w-[62ch] pb-5 text-[16px] leading-relaxed text-ink-2">{pick(item.answer, locale, "")}</p>
          </details>
        ))}
      </div>
    </Section>
  );
}
