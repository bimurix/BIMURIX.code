import type { Locale } from "@/lib/i18n/locales";
import { pick, type Localized } from "@/lib/i18n/pick";
import { resolveLink } from "@/lib/links";
import type { Cta } from "@/sanity/types-content";
import { ButtonLink } from "@/ui/components/ButtonLink";

export type QuoteCtaData = { heading?: Localized; text?: Localized; button?: Cta };

/**
 * Appel à l'action. Bouton principal : bandeau bleu nuit pleine largeur (fin de page).
 * Bouton secondaire : bloc encadré plus discret (présentation en cours de page).
 */
export function QuoteCta({ data, locale }: { data: QuoteCtaData; locale: Locale }) {
  const href = resolveLink(data.button?.link, locale);
  const label = pick(data.button?.label, locale, "");
  const strong = data.button?.style !== "secondary";

  const content = (
    <div className="grid gap-6 md:grid-cols-[minmax(0,2fr)_auto] md:items-end md:gap-12">
      <div>
        <h2 className={`font-display text-3xl leading-tight font-bold tracking-[-0.015em] text-balance sm:text-4xl ${strong ? "text-paper" : "text-ink"}`}>
          {pick(data.heading, locale, "")}
        </h2>
        {data.text && <p className={`mt-4 max-w-[62ch] text-[17px] leading-relaxed ${strong ? "text-paper/80" : "text-ink-2"}`}>{pick(data.text, locale, "")}</p>}
      </div>
      {href && label && (
        <ButtonLink href={href} variant={strong ? "inverse" : "secondary"}>
          {label}
        </ButtonLink>
      )}
    </div>
  );

  if (strong) {
    return (
      <section className="bg-blue">
        <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:py-20">{content}</div>
      </section>
    );
  }
  return (
    <section className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:py-20">
      <div className="border-[1.5px] border-ink p-6 sm:p-10">{content}</div>
    </section>
  );
}
