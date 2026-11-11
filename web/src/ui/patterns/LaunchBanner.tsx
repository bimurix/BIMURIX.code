import type { Locale } from "@/lib/i18n/locales";
import { pick } from "@/lib/i18n/pick";
import { formatDeadline } from "@/lib/packages/launch";
import type { Shell } from "@/sanity/types-content";

/**
 * Bandeau de lancement sous l'en-tête (réglage « Lancement et conditions »).
 * ADR-006 n° 13 : la date n'apparaît que si le champ est rempli. Rien sans texte dans la langue.
 */
export function LaunchBanner({ shell, locale }: { shell: Shell; locale: Locale }) {
  const launch = shell?.launch;
  const text = pick(launch?.bannerText, locale, "");
  if (!launch?.bannerEnabled || !text) return null;
  const deadline = formatDeadline(launch.deadline, locale);
  const until = pick(shell?.ui?.bannerUntil, locale, "");
  return (
    <aside className="border-b-[1.5px] border-ink bg-paper-2 px-4 py-2 text-center text-[14px] text-ink sm:px-6">
      <p className="mx-auto max-w-7xl">
        {text}
        {deadline && <> <span className="font-mono text-[13px]">{until} <time dateTime={launch.deadline ?? undefined}>{deadline}</time></span></>}
      </p>
    </aside>
  );
}
