import type { Locale } from "@/lib/i18n/locales";
import { pick, type Localized } from "@/lib/i18n/pick";
import { pathFor, type RouteTarget } from "@/lib/links";
import { packageHref } from "@/lib/packages/launch";
import { visiblePackages, type PackageData } from "@/lib/packages/packages";
import type { UiStrings } from "@/sanity/types-content";
import { Section, SectionHeading } from "../section";
import { PackageRow } from "./PackageRow";

export type PackagesData = {
  heading?: Localized;
  intro?: Localized;
  showTaxNote?: boolean | null;
  taxNote?: Localized;
  creditText?: Localized;
  packages?: PackageData[] | null;
  ui?: UiStrings | null;
  quotePage?: RouteTarget;
};

const COLUMNS = ["colCode", "colPackage", "colScope", "colLeadTime", "colPrice", "colAction"] as const;

/**
 * Nomenclature de feuille de plan (ADR-006 n° 6) : un tableau, pas une grille de cartes.
 * Sous 768 px, chaque ligne devient une fiche empilée ; les rôles ARIA gardent la sémantique de tableau.
 * Tous les textes viennent de Sanity (CLAUDE.md §4) ; rien ne s'affiche sans forfait visible.
 */
export function Packages({ data, locale }: { data: PackagesData; locale: Locale }) {
  const items = visiblePackages(data.packages);
  if (items.length === 0) return null;
  const ui = data.ui;
  const quotePath = pathFor(data.quotePage, locale);
  const taxNote = data.showTaxNote === false ? "" : pick(data.taxNote, locale, "");
  const credit = pick(data.creditText, locale, "");
  const heading = pick(data.heading, locale, "");

  return (
    <Section id="forfaits">
      <SectionHeading intro={pick(data.intro, locale, "") || undefined}>{heading}</SectionHeading>
      <table className="block w-full border-t-[1.5px] border-ink text-start md:table" role="table">
        {heading && <caption className="sr-only">{heading}</caption>}
        <thead className="sr-only md:not-sr-only md:table-header-group" role="rowgroup">
          <tr className="md:table-row" role="row">
            {COLUMNS.map((key) => (
              <th key={key} scope="col" role="columnheader" className={`border-b border-ink py-2 pe-4 text-start font-mono text-[12px] font-medium text-ink-2 ${key === "colPrice" ? "text-end" : ""}`}>
                <span className={key === "colAction" ? "sr-only" : undefined}>{pick(ui?.[key], locale, "")}</span>
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="block md:table-row-group" role="rowgroup">
          {items.map((p) => (
            <PackageRow key={p._id} pkg={p} locale={locale} ui={ui} href={packageHref(quotePath, p.code)} />
          ))}
        </tbody>
      </table>
      {(taxNote || credit) && (
        <div className="mt-6 max-w-[62ch] space-y-2 text-[15px] text-ink-2">
          {taxNote && <p>{taxNote}</p>}
          {credit && <p>{credit}</p>}
        </div>
      )}
    </Section>
  );
}
