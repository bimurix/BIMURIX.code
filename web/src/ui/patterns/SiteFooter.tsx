import Link from "next/link";
import type { Locale } from "@/lib/i18n/locales";
import { pick } from "@/lib/i18n/pick";
import { isExternalHref, resolveLink } from "@/lib/links";
import type { Shell } from "@/sanity/types-content";
import { Logo } from "@/ui/components/Logo";

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

  return (
    <footer className="bg-ink text-paper">
      <div className="mx-auto grid max-w-7xl gap-10 px-4 py-14 sm:px-6 md:grid-cols-[1.4fr_repeat(3,1fr)]">
        <div className="max-w-sm space-y-4">
          <Logo image={settings?.logoInverse} alt={pick(settings?.logoAlt, locale, "Bimurix")} wordmark={settings?.wordmark ?? "bimurix"} inverse />
          <p className="text-[15px] leading-relaxed text-paper/75">{pick(footer?.blurb, locale, "")}</p>
        </div>

        {columns.map((col) => (
          <nav key={col._key} aria-label={pick(col.title, locale, "")}>
            <h2 className="mb-3 text-[13px] font-semibold text-paper/60">{pick(col.title, locale, "")}</h2>
            <ul className="space-y-1">
              {(col.links ?? []).map((cta) => {
                const href = resolveLink(cta.link, locale);
                if (!href) return null;
                const label = pick(cta.label, locale, "");
                return (
                  <li key={cta._key}>
                    {isExternalHref(href) ? (
                      <a href={href} className="inline-flex min-h-10 items-center text-[15px] hover:underline">{label}</a>
                    ) : (
                      <Link href={href} className="inline-flex min-h-10 items-center text-[15px] hover:underline">{label}</Link>
                    )}
                  </li>
                );
              })}
            </ul>
          </nav>
        ))}

        <div>
          <h2 className="mb-3 text-[13px] font-semibold text-paper/60">{t.contact}</h2>
          <ul className="space-y-2 text-[15px]">
            {settings?.email && (
              <li><a href={`mailto:${settings.email}`} className="hover:underline">{settings.email}</a></li>
            )}
            {settings?.phone && (
              <li><a href={`tel:${settings.phone.replace(/[^\d+]/g, "")}`} className="font-mono text-[14px] hover:underline">{settings.phone}</a></li>
            )}
            {settings?.serviceArea && <li className="text-paper/75">{pick(settings.serviceArea, locale, "")}</li>}
            {settings?.neq && <li className="font-mono text-[13px] text-paper/60">{t.neq} {settings.neq}</li>}
          </ul>
        </div>
      </div>
      <div className="border-t border-paper/15">
        <p className="mx-auto max-w-7xl px-4 py-5 text-[13px] text-paper/60 sm:px-6">
          {pick(footer?.copyright, locale, "© {year} Bimurix").replace("{year}", YEAR)}
        </p>
      </div>
    </footer>
  );
}
