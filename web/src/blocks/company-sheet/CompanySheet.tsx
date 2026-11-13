import type { ReactNode } from "react";
import type { Locale } from "@/lib/i18n/locales";
import { pick, type Localized } from "@/lib/i18n/pick";
import { v5Label, type UiLabels } from "@/lib/i18n/v5-labels";
import { isPlaceholder } from "@/lib/placeholders";
import type { Shell } from "@/sanity/types-content";
import { FigureImage, type FigureImageData } from "@/ui/components/FigureImage";
import { Section, SectionHeading } from "../section";

export type CompanySheetData = {
  heading?: Localized;
  languages?: Localized;
  responsible?: Localized;
  founderName?: string | null;
  founderPhoto?: FigureImageData;
  founderNote?: Localized;
};

type Props = { data: CompanySheetData; locale: Locale; ui: UiLabels; settings: NonNullable<Shell>["settings"] };

/**
 * Fiche de l'entreprise en nomenclature (libellé, valeur). Un champ vide n'affiche rien. Un téléphone marqué « (exemple) »
 * reste du texte simple : jamais de lien `tel:` (ADR-009 n° 4). Le courriel est réel : lien `mailto:`.
 */
export function CompanySheet({ data, locale, ui, settings }: Props) {
  const founder = data.founderName?.trim() ?? "";
  const responsible = pick(data.responsible, locale, "");
  const phone = settings?.phone?.trim() ?? "";
  const rows: Array<{ key: string; label: string; value: ReactNode }> = [
    { key: "legal", label: v5Label(ui, "companyLegalName", locale), value: settings?.legalName },
    { key: "neq", label: v5Label(ui, "companyNeq", locale), value: settings?.neq },
    { key: "phone", label: v5Label(ui, "companyPhone", locale), value: phone && (isPlaceholder(phone) ? phone : <a href={`tel:${phone.replace(/[^\d+]/g, "")}`} className="underline underline-offset-4">{phone}</a>) },
    { key: "email", label: v5Label(ui, "companyEmail", locale), value: settings?.email && <a href={`mailto:${settings.email}`} className="inline-flex min-h-(--bx-tap-min) items-center underline underline-offset-4">{settings.email}</a> },
    { key: "area", label: v5Label(ui, "companyArea", locale), value: pick(settings?.serviceArea, locale, "") },
    { key: "languages", label: v5Label(ui, "companyLanguages", locale), value: pick(data.languages, locale, "") },
    { key: "responsible", label: v5Label(ui, "companyResponsible", locale), value: [responsible, founder].filter(Boolean).join(locale === "fr" ? " : " : ": ") },
  ].filter((row) => Boolean(row.value));
  const note = pick(data.founderNote, locale, "");
  if (rows.length === 0 && !note) return null;
  return (
    <Section id="entreprise">
      <SectionHeading>{pick(data.heading, locale, "")}</SectionHeading>
      <div className={data.founderPhoto?.asset?.url ? "grid gap-10 lg:grid-cols-[minmax(0,2fr)_minmax(0,1fr)]" : ""}>
        <div>
          <dl className="border-t-[1.5px] border-ink">
            {rows.map((row) => (
              <div key={row.key} className="grid gap-1 border-b border-rule py-3.5 md:grid-cols-[minmax(0,1fr)_minmax(0,2fr)] md:gap-8">
                <dt className="font-display text-[15px] font-bold text-ink">{row.label}</dt>
                <dd className="text-[16px] text-ink">{row.value}</dd>
              </div>
            ))}
          </dl>
          {note && <p className="mt-6 max-w-[62ch] text-[17px] leading-relaxed text-ink">{note}</p>}
        </div>
        <FigureImage image={data.founderPhoto} locale={locale} ratio="4 / 3" sizes="(min-width: 1024px) 400px, 100vw" />
      </div>
    </Section>
  );
}
