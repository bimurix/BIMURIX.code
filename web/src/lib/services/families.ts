import type { Locale } from "@/lib/i18n/locales";
import { pick, type Localized } from "@/lib/i18n/pick";

// decision: ADR-008 n° 2 — six services rangés en trois familles ; le champ `family` est facultatif.
export const FAMILIES = ["modeler", "prefabriquer", "livrer"] as const;
export type Family = (typeof FAMILIES)[number];

export type FamilyGroup<T> = { family: Family | null; items: T[] };

const isFamily = (value: unknown): value is Family => FAMILIES.includes(value as Family);

/**
 * Range les services par famille, dans l'ordre des familles puis dans l'ordre reçu.
 * Aucune famille renseignée : un seul groupe sans titre (affichage d'avant). Les services sans
 * famille, mêlés à d'autres qui en ont une, vont dans un dernier groupe sans titre.
 */
export function groupByFamily<T extends { family?: string | null }>(items: T[]): FamilyGroup<T>[] {
  if (items.length === 0) return [];
  if (!items.some((item) => isFamily(item.family))) return [{ family: null, items }];
  const groups: FamilyGroup<T>[] = FAMILIES.map((family) => ({ family, items: items.filter((i) => i.family === family) }));
  groups.push({ family: null, items: items.filter((i) => !isFamily(i.family)) });
  return groups.filter((g) => g.items.length > 0);
}

/** Nom court (menu, carte, formulaire) s'il existe, sinon le nom complet. */
export function shortName(service: { shortTitle?: Localized; title?: Localized }, locale: Locale): string {
  return pick(service.shortTitle, locale, "") || pick(service.title, locale, "");
}
