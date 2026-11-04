import type { Locale } from "@/lib/i18n/locales";
import { pick, type Localized } from "@/lib/i18n/pick";
import { Section, SectionHeading } from "../section";

export type QuoteFormData = { heading?: Localized; intro?: Localized };

// Emplacement du formulaire : le formulaire réel (validation, antispam, Supabase, courriels) arrive à l'étape L5.
const pending = {
  fr: "Le formulaire de soumission sera branché à l'étape L5. En attendant, écrivez-nous :",
  en: "The quote form will be connected in step L5. In the meantime, email us:",
};

export function QuoteFormBlock({ data, locale, email }: { data: QuoteFormData; locale: Locale; email?: string }) {
  return (
    <Section>
      <SectionHeading intro={pick(data.intro, locale, "")}>{pick(data.heading, locale, "")}</SectionHeading>
      <div className="max-w-3xl border-[1.5px] border-dashed border-ink-3 p-6 text-[16px] text-ink-2">
        {pending[locale]}{" "}
        {email && <a href={`mailto:${email}`} className="font-semibold text-blue underline underline-offset-4">{email}</a>}
      </div>
    </Section>
  );
}
