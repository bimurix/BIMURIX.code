import type { Locale } from "@/lib/i18n/locales";
import type { Localized } from "@/lib/i18n/pick";

// decision: ADR-006 n° 4 — un forfait ou une offre se masque dans Studio, sans développeur.

export type PriceMode = "fixed" | "from" | "quote";

export type PackageData = {
  _id: string;
  title?: Localized;
  code?: string;
  priceMode?: PriceMode | null;
  price?: number | null;
  scope?: Localized;
  leadTimeDays?: number | null;
  inclusions?: Array<{ _key?: string; fr?: string | null; en?: string | null }> | null;
  highlighted?: boolean | null;
  visible?: boolean | null;
  order?: number | null;
  /** Offre rattachée, résolue par GROQ ; `null` si la référence est cassée. */
  service?: { _id?: string; visible?: boolean | null; title?: Localized; slug?: Localized; _type?: string } | null;
};

/** Un document sans champ `visible` (contenu antérieur à l'ajout du champ) compte comme visible. */
export const isVisible = (doc: { visible?: boolean | null }) => doc.visible !== false;

const tag = (locale: Locale) => (locale === "fr" ? "fr-CA" : "en-CA");

/**
 * Montant à afficher, ou null (mode « sur soumission », prix manquant) : aucun chiffre ne s'affiche alors.
 * FR « 1 800 $ », EN « $1,800 ». Le texte « à partir de » vient de l'interface, pas d'ici.
 */
export function formatPrice(price: number | null | undefined, mode: PriceMode | null | undefined, locale: Locale): { amount: string; from: boolean } | null {
  if (mode === "quote") return null;
  if (typeof price !== "number" || !Number.isFinite(price)) return null;
  const amount = new Intl.NumberFormat(tag(locale), { style: "currency", currency: "CAD", currencyDisplay: "narrowSymbol", maximumFractionDigits: 0 }).format(price);
  return { amount, from: mode === "from" };
}

/** Forfaits à afficher : visibles, rattachés à une offre visible, triés par ordre puis par code. */
export function visiblePackages<T extends PackageData>(packages: readonly T[] | null | undefined): T[] {
  return (packages ?? [])
    .filter((p) => isVisible(p) && p.service != null && isVisible(p.service))
    .sort((a, b) => (a.order ?? 0) - (b.order ?? 0) || (a.code ?? "").localeCompare(b.code ?? ""));
}
