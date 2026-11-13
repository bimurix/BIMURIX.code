import type { Locale } from "@/lib/i18n/locales";
import { pick, type Localized } from "@/lib/i18n/pick";
import { v5Label, type UiLabels } from "@/lib/i18n/v5-labels";
import { resolveLink } from "@/lib/links";
import { isPlaceholder } from "@/lib/placeholders";
import type { Cta } from "@/sanity/types-content";
import { ButtonLink } from "@/ui/components/ButtonLink";

export type QuoteCtaData = { heading?: Localized; text?: Localized; button?: Cta; note?: Localized; showPhone?: boolean | null };

type Props = { data: QuoteCtaData; locale: Locale; ui?: UiLabels; phone?: string | null };

/** « Ou appelez le [téléphone]. » : une valeur d'exemple reste du texte simple, jamais un lien `tel:` (ADR-009 n° 4). */
function CallLine({ template, phone }: { template: string; phone: string }) {
  const [before, after = ""] = template.split("{phone}");
  const number = isPlaceholder(phone) ? <span className="font-mono text-[15px]">{phone}</span> : <a href={`tel:${phone.replace(/[^\d+]/g, "")}`} className="font-mono text-[15px] underline underline-offset-4">{phone}</a>;
  return (
    <>
      {before}
      {number}
      {after}
    </>
  );
}

/**
 * Appel à l'action. Bouton principal : bandeau bleu nuit pleine largeur (fin de page).
 * Bouton secondaire : bloc encadré plus discret (présentation en cours de page).
 * Sous le bouton : la promesse de réponse (champ `note`, sinon petit texte du site) et, si un téléphone existe, « Ou appelez… ».
 * decision: cahier v6 C-21 — jamais « gratuit » ni « sans engagement » (faits non confirmés).
 */
export function QuoteCta({ data, locale, ui, phone }: Props) {
  const href = resolveLink(data.button?.link, locale);
  const label = pick(data.button?.label, locale, "");
  const strong = data.button?.style !== "secondary";
  const note = pick(data.note, locale, "") || v5Label(ui, "quoteCtaNote", locale);
  const phoneValue = phone?.trim() ?? "";
  const callTemplate = data.showPhone !== false && phoneValue ? v5Label(ui, "quoteCtaPhone", locale) : "";

  const content = (
    <div className="grid gap-6 md:grid-cols-[minmax(0,2fr)_auto] md:items-end md:gap-12">
      <div>
        <h2 className={`font-display text-3xl leading-tight font-bold tracking-[-0.015em] text-balance sm:text-4xl ${strong ? "text-paper" : "text-ink"}`}>
          {pick(data.heading, locale, "")}
        </h2>
        {data.text && <p className={`mt-4 max-w-[62ch] text-[17px] leading-relaxed ${strong ? "text-paper/80" : "text-ink-2"}`}>{pick(data.text, locale, "")}</p>}
      </div>
      {href && label && (
        <div className="md:max-w-xs">
          <ButtonLink href={href} variant={strong ? "inverse" : "secondary"}>
            {label}
          </ButtonLink>
          <p className={`mt-3 text-[15px] leading-relaxed ${strong ? "text-paper/80" : "text-ink-2"}`}>
            {note}
            {callTemplate && (
              <>
                {" "}
                <CallLine template={callTemplate} phone={phoneValue} />
              </>
            )}
          </p>
        </div>
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
