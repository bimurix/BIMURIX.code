import Link from "next/link";
import type { ReactNode } from "react";
import type { Locale } from "@/lib/i18n/locales";
import { pick, type Localized } from "@/lib/i18n/pick";
import { isPlaceholder } from "@/lib/placeholders";

export type AssuranceRow = { _key?: string; label?: Localized; text?: Localized; source?: "text" | "phone" | "privacy" | null };
export type QuoteAssuranceData = { heading?: Localized; rows?: AssuranceRow[] | null };

type Props = { data: QuoteAssuranceData; locale: Locale; phone?: string | null; privacyHref?: string | null; privacyLabel: string };

/**
 * Colonne de réassurance de la page Soumission (à droite du formulaire sur bureau, sous lui sur téléphone), en nomenclature :
 * libellé, valeur. Le téléphone vient des coordonnées du site : vide = la ligne disparaît ; marqué « (exemple) » = texte simple,
 * jamais un lien `tel:` (ADR-009 n° 4). decision: cahier v6 C-42.
 */
export function QuoteAssurance({ data, locale, phone, privacyHref, privacyLabel }: Props) {
  const number = phone?.trim() ?? "";
  const rows = (data.rows ?? []).flatMap((row, i): Array<{ key: string; label: string; value: ReactNode }> => {
    const label = pick(row.label, locale, "");
    const text = pick(row.text, locale, "");
    const key = row._key ?? String(i);
    if (!label) return [];
    if (row.source === "phone") {
      if (!number) return [];
      const value = isPlaceholder(number) ? <span className="font-mono text-[15px]">{number}</span> : <a href={`tel:${number.replace(/[^\d+]/g, "")}`} className="font-mono text-[15px] underline underline-offset-4">{number}</a>;
      return [{ key, label, value }];
    }
    if (row.source === "privacy") {
      const value = (
        <>
          {text}
          {privacyHref && (
            <>
              {text ? " " : ""}
              <Link href={privacyHref} className="inline-flex min-h-(--bx-tap-min) items-center underline underline-offset-4 hover:text-blue">{privacyLabel}</Link>
            </>
          )}
        </>
      );
      return text || privacyHref ? [{ key, label, value }] : [];
    }
    return text ? [{ key, label, value: text }] : [];
  });
  if (rows.length === 0) return null;
  const heading = pick(data.heading, locale, "");
  return (
    <aside aria-label={heading || undefined}>
      {heading && <h2 className="font-display mb-3 text-xl font-bold text-ink">{heading}</h2>}
      <dl className="border-t-[1.5px] border-ink">
        {rows.map((row) => (
          <div key={row.key} className="border-b border-rule py-3.5">
            <dt className="font-display text-[15px] font-bold text-ink">{row.label}</dt>
            <dd className="mt-1 max-w-[46ch] text-[15px] leading-relaxed text-ink-2">{row.value}</dd>
          </div>
        ))}
      </dl>
    </aside>
  );
}
