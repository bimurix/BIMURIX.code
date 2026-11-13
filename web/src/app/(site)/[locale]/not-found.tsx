import { locale as rootLocale } from "next/root-params";
import { RenderSections } from "@/blocks/render";
import { hasLocale, type Locale } from "@/lib/i18n/locales";
import { getNotFoundPage } from "@/sanity/content";
import { fetchPublished } from "@/sanity/fetch";
import { SHELL_QUERY } from "@/sanity/queries";
import type { Shell } from "@/sanity/types-content";
import { Section, SectionHeading } from "@/blocks/section";
import { v5Label } from "@/lib/i18n/v5-labels";
import { navGroups } from "@/ui/patterns/nav-model";
import Link from "next/link";

// Page 404 bilingue, éditable dans Studio (page de type « Page introuvable »).
export default async function NotFound() {
  const value = await rootLocale();
  const locale: Locale = value && hasLocale(value) ? value : "fr";
  const [shell, page] = await Promise.all([fetchPublished<Shell>({ query: SHELL_QUERY }), getNotFoundPage()]);

  const groups = navGroups(shell, locale);

  return (
    <>
      <RenderSections sections={page?.sections} ctx={{ locale, shell, titleBlock: page?.titleBlock }} />
      {/* Les six services et la demande de soumission : un seul lien, c'était trop peu (C-44). Les noms viennent de Sanity. */}
      {groups.length > 0 && (
        <Section>
          <SectionHeading>{v5Label(shell?.ui, "notFoundServices", locale)}</SectionHeading>
          <ul className="grid gap-x-10 border-t-[1.5px] border-ink sm:grid-cols-2 lg:grid-cols-3">
            {groups.flatMap((group) => group.services).map((s) => (
              <li key={s.id} className="border-b border-rule">
                <Link href={s.href} className="flex min-h-14 items-center gap-4 py-3 text-[16px] font-semibold text-blue underline-offset-4 hover:text-blue-deep hover:underline">
                  <span className="shrink-0 font-mono text-[12px] font-normal text-ink-2">{s.code}</span>
                  {s.label}
                </Link>
              </li>
            ))}
          </ul>
        </Section>
      )}
    </>
  );
}
