import Link from "next/link";
import type { Locale } from "@/lib/i18n/locales";
import { pick } from "@/lib/i18n/pick";
import { isExternalHref, resolveLink } from "@/lib/links";
import { isPlaceholder } from "@/lib/placeholders";
import type { Shell } from "@/sanity/types-content";
import { Icon } from "@/ui/components/Icon";
import { Logo } from "@/ui/components/Logo";
import { navGroups } from "./nav-model";

// Année du build : évite une date dynamique dans un rendu mis en cache.
const YEAR = String(new Date().getFullYear());

const labels = {
  fr: { contact: "Coordonnées", neq: "NEQ" },
  en: { contact: "Contact", neq: "NEQ" },
};

export function SiteFooter({ shell, locale }: { shell: Shell; locale: Locale }) {
  const { settings, footer } = shell ?? {};
  const t = labels[locale];
  const columns = footer?.columns ?? [];
  const groups = navGroups(shell, locale);

  return (
    <footer className="bg-ink text-paper">
      <div className="mx-auto grid max-w-7xl grid-cols-2 gap-x-6 gap-y-8 px-4 py-10 sm:px-6 md:gap-10 md:py-10 lg:grid-cols-[1.5fr_repeat(4,1fr)]">
        <div className="col-span-2 max-w-sm space-y-4 lg:col-span-1">
          <Logo image={settings?.logoInverse} alt={pick(settings?.logoAlt, locale, "Bimurix")} wordmark={settings?.wordmark ?? "bimurix"} inverse />
          <p className="text-[15px] leading-relaxed text-paper/75">{pick(footer?.blurb, locale, "")}</p>
        </div>

        {columns.map((col) => (
          <nav key={col._key} aria-label={pick(col.title, locale, "")}>
            <h2 className="mb-3 text-[13px] font-semibold text-paper/60">{pick(col.title, locale, "")}</h2>
            {col.listServices && groups.map((group) => (
              <div key={group.key} className="mb-2">
                {group.label && <p className="mt-2 text-[13px] text-paper/60">{group.label}</p>}
                <ul>
                  {group.services.map((s) => (
                    <li key={s.id}>
                      <Link href={s.href} className="inline-flex min-h-11 min-w-11 items-center text-[15px] hover:underline">{s.label}</Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
            <ul className="space-y-1">
              {(col.links ?? []).map((cta) => {
                const href = resolveLink(cta.link, locale);
                if (!href) return null;
                const label = pick(cta.label, locale, "");
                return (
                  <li key={cta._key}>
                    {isExternalHref(href) ? (
                      <a href={href} className="inline-flex min-h-11 min-w-11 items-center text-[15px] hover:underline">{label}</a>
                    ) : (
                      <Link href={href} className="inline-flex min-h-11 min-w-11 items-center text-[15px] hover:underline">{label}</Link>
                    )}
                  </li>
                );
              })}
            </ul>
          </nav>
        ))}

        <div className="col-span-2 md:col-span-1">
          <h2 className="mb-3 text-[13px] font-semibold text-paper/60">{t.contact}</h2>
          <ul className="space-y-2 text-[15px]">
            {settings?.email && (
              <li><a href={`mailto:${settings.email}`} className="inline-flex min-h-(--bx-tap-min) items-center gap-2.5 hover:underline"><Icon name="courriel" size="sm" className="text-paper/75" />{settings.email}</a></li>
            )}
            {settings?.phone && (
              <li>
                {/* Valeur d'exemple : texte simple, jamais un lien tel: (ADR-009 n° 4). */}
                {isPlaceholder(settings.phone) ? (
                  <span className="inline-flex min-h-(--bx-tap-min) items-center gap-2.5 font-mono text-[14px] text-paper/75"><Icon name="telephone" size="sm" />{settings.phone}</span>
                ) : (
                  <a href={`tel:${settings.phone.replace(/[^\d+]/g, "")}`} className="inline-flex min-h-(--bx-tap-min) items-center gap-2.5 font-mono text-[14px] hover:underline"><Icon name="telephone" size="sm" className="text-paper/75" />{settings.phone}</a>
                )}
              </li>
            )}
            {settings?.serviceArea && <li className="flex items-center gap-2.5 text-paper/75"><Icon name="region" size="sm" />{pick(settings.serviceArea, locale, "")}</li>}
          </ul>
        </div>
      </div>
      <div className="border-t border-paper/15">
        <div className="mx-auto flex max-w-7xl flex-col gap-1 px-4 py-5 text-[13px] text-paper/60 sm:px-6 md:flex-row md:justify-between">
          <p>{pick(footer?.copyright, locale, "© {year} Bimurix").replace("{year}", YEAR)}</p>
          {(settings?.legalName || settings?.neq) && (
            <p className="font-mono text-[12px]">{[settings?.legalName, settings?.neq && `${t.neq} ${settings.neq}`].filter(Boolean).join(" · ")}</p>
          )}
        </div>
      </div>
    </footer>
  );
}
