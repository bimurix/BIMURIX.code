import type { Localized } from "@/lib/i18n/pick";
import type { RouteTarget, SanityLink } from "@/lib/links";
import type { PackageData } from "@/lib/packages/packages";
import type { V5LabelKey } from "@/lib/i18n/v5-labels";

export type { PackageData, PriceMode } from "@/lib/packages/packages";

// Types des données lues par SHELL_QUERY et HOME_QUERY (projection GROQ, pas les documents bruts).
export type NetworkColor = "plumb" | "heat" | "data" | "tqc";

export type ImageAsset = { asset?: { url?: string; width?: number; height?: number } | null } | null;

export type Cta = { _key?: string; label?: Localized; style?: "primary" | "secondary"; link?: SanityLink };

export type ServiceSummary = RouteTarget & {
  _id: string;
  /** Faux = offre masquée ; absent = visible (ADR-006 n° 4). */
  visible?: boolean | null;
  code?: string;
  network?: NetworkColor;
  title?: Localized;
  /** Nom court (menu, carte, formulaire) ; absent = nom complet. */
  shortTitle?: Localized;
  /** Famille du service (modeler | prefabriquer | livrer) ; absente = affichage sans groupes. */
  family?: string | null;
  cardTitle?: Localized;
  cardText?: Localized;
  cardLinkLabel?: Localized;
  /** Symbole au trait de la ligne de service (liste fermée de `icon-names.ts`). */
  cardIcon?: string | null;
};

export type UiStrings = Partial<Record<
  "requestQuote" | "discoverServices" | "learnMore" | "menu" | "closeMenu" | "services" | "skipToContent"
  | "networkHint" | "illustrativeExample" | "sheet" | "revision" | "date" | "backHome"
  | "priceFrom" | "priceQuote" | "businessDays" | "colCode" | "colPackage" | "colScope" | "colLeadTime" | "colPrice" | "colAction"
  | "forWhom" | "responsibilities" | "offerPackages" | "inclusionsLabel" | "choosePackage" | "highlightedLabel" | "sourceLabel" | "bannerUntil"
  | V5LabelKey,
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
  footer?: { blurb?: Localized; copyright?: Localized; columns?: Array<{ _key: string; title?: Localized; listServices?: boolean | null; links?: Cta[] }> } | null;
  ui?: UiStrings | null;
  /** Bandeau de lancement (réglage `launchSettings`), ADR-006 n° 13. */
  launch?: { bannerEnabled?: boolean | null; bannerText?: Localized; deadline?: string | null } | null;
  services?: ServiceSummary[];
  quotePage?: RouteTarget;
  /** Titre de l’accueil (premier maillon du fil d’Ariane en données structurées). */
  home?: { title?: Localized } | null;
  routes?: RouteTarget[];
} | null;

export type TitleBlockData = { sheet?: string; revision?: string; date?: string } | null | undefined;

/** Réglage « Lancement et conditions » (document unique `launchSettings`). */
export type LaunchSettings = {
  bannerEnabled?: boolean | null;
  bannerText?: Localized;
  deadline?: string | null;
  taxNote?: Localized;
  creditText?: Localized;
  conditions?: Array<{ _key: string; title?: Localized; text?: Localized }> | null;
  professionalNote?: Localized;
} | null;

export type PackageList = PackageData[];
