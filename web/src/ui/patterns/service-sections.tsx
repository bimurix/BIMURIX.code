import { Section, SectionHeading } from "@/blocks/section";
import type { Locale } from "@/lib/i18n/locales";
import { pick, type Localized } from "@/lib/i18n/pick";
import type { NetworkColor } from "@/sanity/types-content";
import { networkVar } from "@/ui/components/NetworkSwatch";

export type Keyed<T> = T & { _key: string };

/** Petit texte sous un titre de section (pour qui). */
export function Note({ heading, text, locale }: { heading?: Localized; text?: Localized; locale: Locale }) {
  const body = pick(text, locale, "");
  if (!body) return null;
  return (
    <Section>
      <SectionHeading>{pick(heading, locale, "")}</SectionHeading>
      <p className="max-w-[62ch] border-t-[1.5px] border-ink pt-5 text-[17px] leading-relaxed text-ink">{body}</p>
    </Section>
  );
}

/** Liste à puces « raccords » dans la couleur du réseau du service. */
export function NetworkList({ heading, items, note, network, locale, id }: { heading?: Localized; items?: Array<Keyed<Localized & object>>; note?: Localized; network: NetworkColor; locale: Locale; id?: string }) {
  if (!items?.length) return null;
  return (
    <Section id={id}>
      <SectionHeading>{pick(heading, locale, "")}</SectionHeading>
      <ul className="grid max-w-5xl gap-x-10 border-t-[1.5px] border-ink sm:grid-cols-2">
        {items.map((item) => (
          <li key={item._key} className="flex min-h-14 items-center gap-4 border-b border-rule py-3 text-[16px] text-ink">
            <span aria-hidden="true" className="size-2.5 shrink-0 rounded-full border-2 bg-paper" style={{ borderColor: networkVar[network] }} />
            {pick(item, locale, "")}
          </li>
        ))}
      </ul>
      {note && <p className="mt-8 max-w-[60ch] text-[15px] text-ink-3">{pick(note, locale, "")}</p>}
    </Section>
  );
}
