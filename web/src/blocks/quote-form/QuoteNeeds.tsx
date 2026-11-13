import type { Locale } from "@/lib/i18n/locales";
import { pick, type Localized } from "@/lib/i18n/pick";
import { Icon } from "@/ui/components/Icon";

export type QuoteNeedsData = { heading?: Localized; items?: Array<Localized & { _key?: string; icon?: string | null }>; note?: Localized };

/** Encart « Utile, si vous l'avez sous la main » (ex-« Ce qu'il faut nous envoyer »), dans la colonne à côté du formulaire. Texte de Studio (Formulaire de soumission) ; sans ligne, rien. */
export function QuoteNeeds({ data, locale }: { data: QuoteNeedsData; locale: Locale }) {
  const items = (data.items ?? []).flatMap((item, i) => {
    const text = pick(item, locale, "");
    return text ? [{ key: item._key ?? String(i), text, icon: item.icon }] : [];
  });
  if (items.length === 0) return null;
  const heading = pick(data.heading, locale, "");
  const note = pick(data.note, locale, "");
  return (
    <aside aria-label={heading || undefined} className="border-[1.5px] border-ink bg-paper-2 p-5 sm:p-6">
      {heading && <h2 className="font-display text-xl font-bold text-ink">{heading}</h2>}
      <ul className={heading ? "mt-3" : ""}>
        {items.map((item) => (
          <li key={item.key} className="flex gap-3 border-b border-rule py-2.5 text-[16px] text-ink">
            {item.icon ? <Icon name={item.icon} size="sm" className="mt-0.5 text-blue" /> : <span aria-hidden="true" className="mt-2 size-2 shrink-0 rounded-full border-2 border-blue bg-paper" />}
            {item.text}
          </li>
        ))}
      </ul>
      {note && <p className="mt-4 max-w-[62ch] text-[15px] text-ink-2">{note}</p>}
    </aside>
  );
}
