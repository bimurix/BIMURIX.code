import Link from "next/link";
import { hasLocale } from "@/lib/i18n/locales";
import { notFound } from "next/navigation";

// Page provisoire de l'étape L1 : vérifie le routage FR/EN.
// Le contenu réel (textes, logo, sections) viendra entièrement de Sanity en L2-L4.
const fallback = {
  fr: { status: "Squelette en place : étape L1", other: "English", otherHref: "/en" },
  en: { status: "Skeleton ready: step L1", other: "Français", otherHref: "/" },
} as const;

export default async function HomePage({ params }: PageProps<"/[locale]">) {
  const { locale } = await params;
  if (!hasLocale(locale)) notFound();
  const t = fallback[locale];

  return (
    <main className="mx-auto flex min-h-dvh max-w-5xl flex-col justify-center gap-6 px-4">
      <p className="font-display text-5xl font-extrabold tracking-tight text-blue">bimurix</p>
      <p className="font-mono text-sm text-ink-2">{t.status}</p>
      <Link href={t.otherHref} className="w-fit text-blue underline underline-offset-4">
        {t.other}
      </Link>
    </main>
  );
}
