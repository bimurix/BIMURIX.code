import Link from "next/link";
import type { Locale } from "@/lib/i18n/locales";
import { pick } from "@/lib/i18n/pick";
import type { Shell } from "@/sanity/types-content";
import { Logo } from "@/ui/components/Logo";
import { LanguageSwitch } from "./LanguageSwitch";
import { MobileMenu } from "./MobileMenu";
import type { NavModel } from "./nav-model";
import { ServicesMenu } from "./ServicesMenu";

type Props = { shell: Shell; locale: Locale; model: NavModel };

export function SiteHeader({ shell, locale, model }: Props) {
  const settings = shell?.settings;
  const skip = pick(shell?.ui?.skipToContent, locale, locale === "fr" ? "Aller au contenu" : "Skip to content");

  return (
    <header className="sticky top-0 z-20 border-b border-ink bg-paper">
      <a href="#contenu" className="sr-only focus:not-sr-only focus:absolute focus:start-4 focus:top-3 focus:bg-paper focus:px-3 focus:py-2">
        {skip}
      </a>
      <div className="mx-auto flex h-(--bx-header-h) max-w-7xl items-center gap-6 px-4 sm:px-6">
        <Link href={locale === "fr" ? "/" : "/en"} className="flex min-h-(--bx-tap-min) items-center" aria-label={settings?.siteName ?? "Bimurix"}>
          <Logo image={settings?.logo} alt={pick(settings?.logoAlt, locale, "Bimurix")} wordmark={settings?.wordmark ?? "bimurix"} />
        </Link>

        <nav aria-label={locale === "fr" ? "Navigation principale" : "Main navigation"} className="hidden flex-1 items-center gap-5 lg:flex">
          {model.items.map((item) =>
            item.services ? (
              <ServicesMenu key={item.key} label={item.label} services={item.services} />
            ) : (
              item.href && (
                <Link key={item.key} href={item.href} className="inline-flex min-h-(--bx-tap-min) items-center px-1 text-[15px] text-ink hover:text-blue">
                  {item.label}
                </Link>
              )
            ),
          )}
        </nav>

        <div className="ms-auto flex items-center gap-4">
          <LanguageSwitch locale={locale} label={model.languageLabel} pairs={model.languagePairs} className="hidden min-h-(--bx-tap-min) items-center text-[14px] text-ink-2 underline-offset-4 hover:underline lg:inline-flex" />
          {model.cta && (
            <Link href={model.cta.href} className="hidden min-h-(--bx-tap-min) items-center bg-blue px-5 text-[15px] font-semibold text-paper hover:bg-blue-deep lg:inline-flex">
              {model.cta.label}
            </Link>
          )}
          <MobileMenu model={model} locale={locale} />
        </div>
      </div>
    </header>
  );
}
