import { PortableText, type PortableTextComponents, type PortableTextProps } from "next-sanity";
import type { Locale } from "@/lib/i18n/locales";
import { pick, type Localized } from "@/lib/i18n/pick";
import { resolveLink, type SanityLink } from "@/lib/links";
import { Section, SectionHeading } from "../section";

type PortableTextValue = PortableTextProps["value"];

export type RichTextData = { heading?: Localized; body?: Localized<PortableTextValue> };

function components(locale: Locale): PortableTextComponents {
  return {
    block: {
      normal: ({ children }) => <p className="mt-4 text-[17px] leading-relaxed text-ink-2 first:mt-0">{children}</p>,
      h2: ({ children }) => <h2 className="font-display mt-10 text-2xl font-bold text-ink first:mt-0">{children}</h2>,
      h3: ({ children }) => <h3 className="font-display mt-8 text-xl font-bold text-ink first:mt-0">{children}</h3>,
    },
    list: {
      bullet: ({ children }) => <ul className="mt-4 list-disc space-y-1 ps-6 text-[17px] text-ink-2 marker:text-blue">{children}</ul>,
      number: ({ children }) => <ol className="mt-4 list-decimal space-y-1 ps-6 text-[17px] text-ink-2">{children}</ol>,
    },
    marks: {
      link: ({ value, children }) => {
        const href = resolveLink(value as SanityLink, locale);
        return href ? <a href={href} className="text-blue underline underline-offset-4">{children}</a> : <>{children}</>;
      },
    },
  };
}

/** Texte long (À propos, pages légales) : colonne de lecture de 68 caractères environ. */
export function RichText({ data, locale }: { data: RichTextData; locale: Locale }) {
  const body = pick<PortableTextValue>(data.body, locale, []);
  if (!Array.isArray(body) || body.length === 0) return null;
  return (
    <Section>
      <SectionHeading>{pick(data.heading, locale, "")}</SectionHeading>
      <div className="max-w-[60ch]">
        <PortableText value={body} components={components(locale)} />
      </div>
    </Section>
  );
}
