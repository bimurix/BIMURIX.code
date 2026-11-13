import type { Locale } from "@/lib/i18n/locales";
import { pick, type Localized } from "@/lib/i18n/pick";
import { v5Label, type UiLabels } from "@/lib/i18n/v5-labels";
import { Section, SectionHeading } from "../section";

export type ResponsibilityRowData = {
  _key: string;
  label?: Localized;
  bimurix?: boolean | null;
  bimurixNote?: Localized;
  engineer?: boolean | null;
  engineerNote?: Localized;
  contractor?: boolean | null;
  contractorNote?: Localized;
};

export type ResponsibilityTableData = { heading?: Localized; intro?: Localized; note?: Localized; rows?: ResponsibilityRowData[] };

const PARTIES = [
  ["bimurix", "respColBimurix"],
  ["engineer", "respColEngineer"],
  ["contractor", "respColContractor"],
] as const;

type Props = { data: ResponsibilityTableData; locale: Locale; ui: UiLabels };

/**
 * Qui fait quoi : un vrai tableau (en-têtes de colonne et de ligne). Une case est marquée par un texte (« Oui »),
 * jamais par la seule couleur. Sous md, chaque ligne devient une fiche ; les rôles ARIA gardent la sémantique.
 * La phrase sous le tableau (conception, calculs, signature, sceau) est un champ de Studio.
 */
export function ResponsibilityTable({ data, locale, ui }: Props) {
  const rows = (data.rows ?? []).filter((r) => pick(r.label, locale, ""));
  const note = pick(data.note, locale, "");
  if (rows.length === 0) {
    return note ? <NoteOnly heading={pick(data.heading, locale, "")} note={note} /> : null;
  }
  const heading = pick(data.heading, locale, "");
  const yes = v5Label(ui, "respYes", locale);
  const no = v5Label(ui, "respNo", locale);

  return (
    <Section id="qui-fait-quoi">
      <SectionHeading intro={pick(data.intro, locale, "")}>{heading}</SectionHeading>
      <table className="block w-full border-t-[1.5px] border-ink text-start md:table" role="table">
        {heading && <caption className="sr-only">{heading}</caption>}
        <thead className="sr-only md:not-sr-only md:table-header-group" role="rowgroup">
          <tr className="md:table-row" role="row">
            <th scope="col" role="columnheader" className="border-b border-ink py-2 pe-4 text-start text-[13px] font-semibold text-ink-2">
              {v5Label(ui, "respColResponsibility", locale)}
            </th>
            {PARTIES.map(([, labelKey]) => (
              <th key={labelKey} scope="col" role="columnheader" className="w-44 border-b border-ink px-3 py-2 text-start text-[13px] font-semibold text-ink-2">
                {v5Label(ui, labelKey, locale)}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="block md:table-row-group" role="rowgroup">
          {rows.map((row) => (
            <tr key={row._key} role="row" className="block border-b border-rule py-4 md:table-row md:py-0">
              <th scope="row" role="rowheader" className="block pb-1 text-start text-[16px] font-semibold text-ink md:table-cell md:border-b md:border-rule md:py-3 md:pe-4 md:align-top md:pb-3">
                {pick(row.label, locale, "")}
              </th>
              {PARTIES.map(([field, labelKey]) => {
                const marked = row[field] === true;
                const detail = pick(row[`${field}Note`], locale, "");
                return (
                  <td key={field} role="cell" className={`${marked ? "block" : "hidden"} text-[15px] text-ink md:table-cell md:border-b md:border-rule md:px-3 md:py-3 md:align-top`}>
                    <span className="text-ink-2 md:sr-only">{v5Label(ui, labelKey, locale)}{locale === "fr" ? " : " : ": "}</span>
                    {marked ? (
                      <>
                        <span className="font-semibold">{yes}</span>
                        {detail && <span className="block text-[14px] text-ink-2">{detail}</span>}
                      </>
                    ) : (
                      <>
                        <span aria-hidden="true" className="text-ink-3">—</span>
                        <span className="sr-only">{no}</span>
                      </>
                    )}
                  </td>
                );
              })}
            </tr>
          ))}
        </tbody>
      </table>
      {note && <p className="mt-6 max-w-[62ch] text-[16px] leading-relaxed text-ink">{note}</p>}
    </Section>
  );
}

/** Sans ligne de tableau, la phrase seule garde l'affichage d'avant (paragraphe sous un titre). */
function NoteOnly({ heading, note }: { heading: string; note: string }) {
  return (
    <Section>
      <SectionHeading>{heading}</SectionHeading>
      <p className="max-w-[62ch] border-t-[1.5px] border-ink pt-5 text-[17px] leading-relaxed text-ink">{note}</p>
    </Section>
  );
}
