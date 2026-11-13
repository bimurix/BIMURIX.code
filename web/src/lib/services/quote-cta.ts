import type { Localized } from "@/lib/i18n/pick";
import type { RouteTarget, SanityLink } from "@/lib/links";

export type CtaLike = { _key?: string; label?: Localized; style?: "primary" | "secondary"; link?: SanityLink };

const nonEmpty = (value: string | null | undefined) => (typeof value === "string" && value.trim() !== "" ? value : undefined);

/** Libellé propre au service : chaque langue renseignée remplace l'ancienne, l'autre garde la sienne (pas de page mélangée). */
export function overrideLabel(label: Localized, override: Localized): Localized {
  return { fr: nonEmpty(override?.fr) ?? label?.fr ?? null, en: nonEmpty(override?.en) ?? label?.en ?? null };
}

/**
 * Bouton « Demander une soumission » d'un service (haut de page et appel final).
 * Sans libellé propre : le bouton de Studio tel quel. Avec un libellé : il le remplace ; sans bouton ni lien,
 * le libellé sert à bâtir un lien vers la soumission avec ce service pré-choisi (plan de contenu v5 § 6.2).
 */
export function serviceQuoteCta(cta: CtaLike | undefined, opts: { label?: Localized; quotePage?: RouteTarget; serviceId: string }): CtaLike | undefined {
  const hasOverride = Boolean(nonEmpty(opts.label?.fr) || nonEmpty(opts.label?.en));
  if (!hasOverride) return cta;
  if (cta?.link) return { ...cta, label: overrideLabel(cta.label, opts.label) };
  if (!opts.quotePage) return cta;
  return { style: "primary", label: opts.label, link: { kind: "internal", internal: opts.quotePage, serviceId: opts.serviceId } };
}
