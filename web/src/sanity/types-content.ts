import type { Localized } from "@/lib/i18n/pick";
import type { RouteTarget, SanityLink } from "@/lib/links";

// Types des données lues par SHELL_QUERY et HOME_QUERY (projection GROQ, pas les documents bruts).
export type NetworkColor = "plumb" | "heat" | "data" | "tqc";

export type ImageAsset = { asset?: { url?: string; width?: number; height?: number } | null } | null;

export type Cta = { _key?: string; label?: Localized; style?: "primary" | "secondary"; link?: SanityLink };

export type ServiceSummary = RouteTarget & {
  _id: string;
  code?: string;
  network?: NetworkColor;
  title?: Localized;
  cardTitle?: Localized;
  cardText?: Localized;
  cardLinkLabel?: Localized;
};

export type UiStrings = Partial<Record<
  "requestQuote" | "discoverServices" | "learnMore" | "menu" | "closeMenu" | "services" | "skipToContent"
  | "networkHint" | "illustrativeExample" | "sheet" | "revision" | "date" | "backHome",
  Localized
>>;

export type Shell = {
  settings?: {
    siteName?: string; wordmark?: string; tagline?: Localized; descriptor?: Localized; email?: string; phone?: string;
    serviceArea?: Localized; neq?: string; legalName?: string; logoAlt?: Localized; logo?: ImageAsset; logoInverse?: ImageAsset;
  } | null;
  navigation?: {
    items?: Array<{ _key: string; label?: Localized; listServices?: boolean; link?: SanityLink }>;
    cta?: Cta;
    languageLabel?: Localized;
  } | null;
  footer?: { blurb?: Localized; copyright?: Localized; columns?: Array<{ _key: string; title?: Localized; links?: Cta[] }> } | null;
  ui?: UiStrings | null;
  services?: ServiceSummary[];
  quotePage?: RouteTarget;
  routes?: RouteTarget[];
} | null;

export type TitleBlockData = { sheet?: string; revision?: string; date?: string } | null | undefined;
