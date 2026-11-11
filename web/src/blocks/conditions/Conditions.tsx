import type { Locale } from "@/lib/i18n/locales";
import { pick, type Localized } from "@/lib/i18n/pick";
import { Section, SectionHeading } from "../section";

export type ConditionsData = {
  heading?: Localized;
  launch?: {
    deadline?: string | null;
    creditText?: Localized;
    professionalNote?: Localized;
    conditions?: Array<{ _key: string; title?: Localized; text?: Localized }> | null;
  } | null;
};

// Mise en page : étape N3. Rien ne s'affiche si le réglage « Lancement et conditions » est vide.
export function Conditions({ data, locale }: { data: ConditionsData; locale: Locale }) {
  const launch = data.launch;
  const items = (launch?.conditions ?? []).filter((c) => pick(c.title, locale, ""));
  const credit = pick(launch?.creditText, locale, "");
  const note = pick(launch?.professionalNote, locale, "");
  if (items.length === 0 && !credit && !note) return null;

  return (
    <Section id="conditions">
      <SectionHeading>{pick(data.heading, locale, "")}</SectionHeading>
      {launch?.deadline && <p className="mb-4 font-mono text-[14px] text-ink-2"><time dateTime={launch.deadline}>{launch.deadline}</time></p>}
      {credit && <p className="mb-6 max-w-[62ch] text-[17px] leading-relaxed">{credit}</p>}
      {items.length > 0 && (
        <dl className="max-w-3xl border-t-[1.5px] border-ink">
          {items.map((c) => (
            <div key={c._key} className="border-b border-rule py-4 sm:grid sm:grid-cols-[12rem_1fr] sm:gap-6">
              <dt className="font-semibold">{pick(c.title, locale, "")}</dt>
              <dd className="mt-1 text-ink-2 sm:mt-0">{pick(c.text, locale, "")}</dd>
            </div>
          ))}
        </dl>
      )}
      {note && <p className="mt-6 max-w-[62ch] text-[15px] text-ink-2">{note}</p>}
    </Section>
  );
}
