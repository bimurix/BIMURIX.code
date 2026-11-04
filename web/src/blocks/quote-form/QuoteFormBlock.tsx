import { Suspense } from "react";
import type { Locale } from "@/lib/i18n/locales";
import { pick, type Localized } from "@/lib/i18n/pick";
import type { QuoteFormContent } from "@/lib/quote/form-content";
import { fetchPublished } from "@/sanity/fetch";
import { QUOTE_FORM_QUERY } from "@/sanity/queries";
import { buildFormModel } from "@/ui/patterns/quote-form/form-model";
import { QuoteForm } from "@/ui/patterns/quote-form/QuoteForm";
import { Section, SectionHeading } from "../section";

export type QuoteFormData = { heading?: Localized; intro?: Localized };

/** Bloc « Formulaire de soumission » : libellés et listes modifiables dans Studio (Formulaire de soumission). */
export async function QuoteFormBlock({ data, locale }: { data: QuoteFormData; locale: Locale }) {
  const content = await fetchPublished<QuoteFormContent>({ query: QUOTE_FORM_QUERY });
  const model = buildFormModel(content, locale);
  return (
    <Section>
      <SectionHeading intro={pick(data.intro, locale, "")}>{pick(data.heading, locale, "")}</SectionHeading>
      {/* Le service pré-choisi vient de l'adresse (?service=…), lue côté client. */}
      <Suspense fallback={<div className="h-[60rem] max-w-3xl" aria-hidden="true" />}>
        <QuoteForm model={model} locale={locale} siteKey={process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY} />
      </Suspense>
    </Section>
  );
}
