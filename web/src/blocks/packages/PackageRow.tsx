import type { Locale } from "@/lib/i18n/locales";
import { pick } from "@/lib/i18n/pick";
import { formatPrice, type PackageData } from "@/lib/packages/packages";
import type { UiStrings } from "@/sanity/types-content";
import { ButtonLink } from "@/ui/components/ButtonLink";

type Props = { pkg: PackageData; locale: Locale; ui: UiStrings | null | undefined; href: string | null };

// Sous md : fiche en grille (code et prix sur la première ligne). Dès md : cellules d'un vrai tableau.
const cell = "md:table-cell md:border-b md:border-rule md:py-5 md:pe-4 md:align-top";

/** Une ligne de la nomenclature. Le forfait mis en avant porte un trait supérieur bleu et un repère écrit. */
export function PackageRow({ pkg, locale, ui, href }: Props) {
  const price = formatPrice(pkg.price, pkg.priceMode, locale);
  const scope = pick(pkg.scope, locale, "");
  const title = pick(pkg.title, locale, "");
  const inclusions = (pkg.inclusions ?? []).map((i, n) => ({ key: i._key ?? String(n), text: pick(i, locale, "") })).filter((i) => i.text);
  const label = (key: keyof NonNullable<UiStrings>) => pick(ui?.[key], locale, "");
  const highlighted = pkg.highlighted === true;

  return (
    <tr
      role="row"
      data-highlighted={highlighted ? "true" : undefined}
      className={`grid grid-cols-[1fr_auto] gap-x-4 gap-y-1 border-b border-rule py-5 md:table-row md:py-0 ${highlighted ? "border-t-[3px] border-t-blue bg-paper-2" : ""}`}
    >
      <td role="cell" className={`order-1 font-mono text-[13px] text-ink-2 md:whitespace-nowrap ${cell}`}>
        {pkg.code}
        {highlighted && label("highlightedLabel") && <span className="block text-blue md:mt-1">{label("highlightedLabel")}</span>}
      </td>
      <th scope="row" role="rowheader" className={`order-3 col-span-2 text-start font-display text-xl font-bold md:text-lg ${cell}`}>
        {title}
        {inclusions.length > 0 && (
          <details className="mt-2 text-[15px] font-normal">
            <summary className="inline-flex min-h-(--bx-tap-min) cursor-pointer items-center text-ink-2 underline underline-offset-4">{label("inclusionsLabel")}</summary>
            <ul className="mb-2 list-disc ps-5 text-ink-2">
              {inclusions.map((i) => <li key={i.key}>{i.text}</li>)}
            </ul>
          </details>
        )}
      </th>
      <td role="cell" className={`order-4 col-span-2 max-w-[44ch] text-ink-2 ${cell}`}>{scope}</td>
      <td role="cell" className={`order-5 col-span-2 font-mono text-[14px] md:whitespace-nowrap ${cell}`}>
        {pkg.leadTimeDays ? `${pkg.leadTimeDays} ${label("businessDays")}` : ""}
      </td>
      <td role="cell" className={`order-2 text-end font-mono text-[17px] font-bold tabular-nums md:text-[16px] ${cell}`}>
        {price ? (
          <>
            {price.from && <span className="block text-[12px] font-normal text-ink-2">{label("priceFrom")}</span>}
            {price.amount}
          </>
        ) : (
          <span className="text-[14px] font-normal">{label("priceQuote")}</span>
        )}
      </td>
      <td role="cell" className={`order-6 col-span-2 mt-3 md:mt-0 ${cell}`}>
        {href && (
          <ButtonLink href={href} variant={highlighted ? "primary" : "secondary"} className="md:whitespace-nowrap">
            {label("choosePackage")}<span className="sr-only"> — {title}</span>
          </ButtonLink>
        )}
      </td>
    </tr>
  );
}
