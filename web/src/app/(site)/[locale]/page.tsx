import Link from "next/link";
import { notFound } from "next/navigation";
import { hasLocale } from "@/lib/i18n/locales";
import { pick, type Localized } from "@/lib/i18n/pick";
import { fetchPublished } from "@/sanity/fetch";
import { HOME_QUERY, SETTINGS_QUERY } from "@/sanity/queries";

type Settings = { wordmark?: string; tagline?: Localized } | null;
type Home = { hero?: { heading?: Localized; intro?: Localized; specialties?: Localized } } | null;

// Étape L2 : l'accueil lit Sanity pour prouver la chaîne Studio → site.
// La vraie mise en page (direction A, blocs) arrive en L3-L4.
const fallback = {
  fr: { heading: "Contenu Sanity introuvable", other: "English", otherHref: "/en" },
  en: { heading: "Sanity content not found", other: "Français", otherHref: "/" },
} as const;

export default async function HomePage({ params }: PageProps<"/[locale]">) {
  const { locale } = await params;
  if (!hasLocale(locale)) notFound();
  const t = fallback[locale];

  const [settings, home] = await Promise.all([
    fetchPublished<Settings>({ query: SETTINGS_QUERY }),
    fetchPublished<Home>({ query: HOME_QUERY }),
  ]);

  return (
    <main className="mx-auto flex min-h-dvh max-w-5xl flex-col justify-center gap-6 px-4">
      <p className="font-display text-3xl font-extrabold tracking-tight text-blue">{settings?.wordmark ?? "bimurix"}</p>
      <h1 className="font-display max-w-3xl text-4xl font-bold leading-tight tracking-tight sm:text-5xl">
        {pick(home?.hero?.heading, locale, t.heading)}
      </h1>
      <p className="max-w-[60ch] text-ink-2">{pick(home?.hero?.intro, locale, "")}</p>
      <p className="font-mono text-xs text-ink-2">{pick(home?.hero?.specialties, locale, "")}</p>
      <Link href={t.otherHref} className="w-fit text-blue underline underline-offset-4">
        {t.other}
      </Link>
    </main>
  );
}
