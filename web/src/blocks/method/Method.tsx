import type { Locale } from "@/lib/i18n/locales";
import { pick, type Localized } from "@/lib/i18n/pick";
import { Section, SectionHeading } from "../section";

export type MethodData = { heading?: Localized; steps?: Array<{ _key: string; title?: Localized; text?: Localized }> };

/**
 * Étapes reliées par un même tuyau : les raccords portent le numéro d'étape (la séquence est l'information).
 * Vertical sur mobile, horizontal sur grand écran.
 */
export function Method({ data, locale }: { data: MethodData; locale: Locale }) {
  const steps = data.steps ?? [];
  const columns = { "--bx-steps": `repeat(${Math.max(steps.length, 1)}, minmax(0, 1fr))` } as React.CSSProperties;
  return (
    <Section>
      <SectionHeading>{pick(data.heading, locale, "")}</SectionHeading>
      <div className="relative">
        <span aria-hidden="true" className="absolute start-[18px] top-5 bottom-5 w-[5px] bg-blue lg:start-5 lg:end-5 lg:top-[18px] lg:bottom-auto lg:h-[5px] lg:w-auto" />
        <ol className="relative grid gap-10 lg:grid-cols-(--bx-steps) lg:gap-6" style={columns}>
          {steps.map((step, i) => (
            <li key={step._key} className="flex gap-5 lg:flex-col lg:gap-4">
              <span className="flex size-10 shrink-0 items-center justify-center rounded-full border-2 border-blue bg-paper font-mono text-[13px] text-blue">
                {String(i + 1).padStart(2, "0")}
              </span>
              <span>
                <span className="font-display block text-xl font-bold text-ink">{pick(step.title, locale, "")}</span>
                <span className="mt-2 block max-w-[52ch] text-[16px] leading-relaxed text-ink-2">{pick(step.text, locale, "")}</span>
              </span>
            </li>
          ))}
        </ol>
      </div>
    </Section>
  );
}
