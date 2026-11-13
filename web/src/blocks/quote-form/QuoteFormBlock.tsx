import { Suspense } from "react";
import type { Locale } from "@/lib/i18n/locales";
import { pick, type Localized } from "@/lib/i18n/pick";
import type { QuoteFormContent } from "@/lib/quote/form-content";
import { fetchPublished } from "@/sanity/fetch";
import { QUOTE_FORM_QUERY } from "@/sanity/queries";
import { buildFormModel } from "@/ui/patterns/quote-form/form-model";
import { QuoteForm } from "@/ui/patterns/quote-form/QuoteForm";
import { Section, SectionHeading } from "../section";
import { QuoteAssurance, type AssuranceRow } from "./QuoteAssurance";
import { QuoteNeeds } from "./QuoteNeeds";

export type QuoteFormData = { heading?: Localized; intro?: Localized };

type Content = QuoteFormContent & { phone?: string | null };

/**
 * Bloc « Formulaire de soumission » : libellés et listes modifiables dans Studio (Formulaire de soumission).
 * À droite sur bureau, sous le formulaire sur téléphone : la réassurance (réponse, suite, téléphone, confidentialité),
 * puis l'encart « Utile, si vous l'avez sous la main » — jamais avant le formulaire, où il se lirait comme une condition (C-41).
 */
export async function QuoteFormBlock({ data, locale }: { data: QuoteFormData; locale: Locale }) {
  const content = await fetchPublished<Content>({ query: QUOTE_FORM_QUERY });
  const model = buildFormModel(content, locale);
  const form = content?.form;
  return (
    <Section>
      <SectionHeading intro={pick(data.intro, locale, "")}>{pick(data.heading, locale, "")}</SectionHeading>
      <div className="grid gap-12 lg:grid-cols-[minmax(0,3fr)_minmax(0,2fr)] lg:items-start">
        {/* Le service pré-choisi vient de l'adresse (?service=…), lue côté client. */}
        <Suspense fallback={<div className="h-[60rem] max-w-3xl" aria-hidden="true" />}>
          <QuoteForm model={model} locale={locale} siteKey={process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY} />
        </Suspense>
        <div className="space-y-10">
          <QuoteAssurance
            data={{ heading: form?.assuranceHeading as Localized, rows: form?.assuranceRows as AssuranceRow[] | undefined }}
            locale={locale}
            phone={content?.phone}
            privacyHref={model.privacyHref}
            privacyLabel={model.t.privacy}
          />
          <QuoteNeeds data={{ heading: form?.needsHeading, items: form?.needsItems, note: form?.needsNote }} locale={locale} />
        </div>
      </div>
    </Section>
  );
}
