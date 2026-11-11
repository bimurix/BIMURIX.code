import type { Localized } from "@/lib/i18n/pick";
import type { RouteTarget } from "@/lib/links";
import { visiblePackages, type PackageData } from "@/lib/packages/packages";
import type { NetworkColor } from "@/sanity/types-content";
import type { AllowedOptions } from "./submit-quote";

/** Valeur du choix « Autre ou je ne sais pas » de la liste des forfaits (decision: ADR-006 n° 7). */
export const PACKAGE_OTHER = "other";

export type FormOption = { _key?: string; value: string; label?: Localized };

// Projection de QUOTE_FORM_QUERY (singletons formSettings et emailTemplates).
export type QuoteFormContent = {
  form?: (Record<string, unknown> & {
    includeServices?: boolean;
    extraServiceOptions?: FormOption[];
    projectTypes?: FormOption[];
    regions?: FormOption[];
    phases?: FormOption[];
    timelines?: FormOption[];
    budgets?: FormOption[];
    softwareOptions?: FormOption[];
    policyVersion?: string;
    notificationEmail?: string;
  }) | null;
  emails?: {
    fromName?: string;
    ackSubject?: Localized;
    ackBody?: Localized;
    ackSubjectCall?: Localized;
    ackBodyCall?: Localized;
    internalSubjectCall?: string;
    signature?: Localized;
    internalSubject?: string;
  } | null;
  services?: Array<{ _id: string; title?: Localized; code?: string; network?: NetworkColor }>;
  packages?: PackageData[] | null;
  privacyPage?: RouteTarget;
  fromEmail?: string;
} | null;

/** Choix de service proposés : services publiés (si activé) puis choix supplémentaires. */
export function serviceOptions(content: QuoteFormContent): FormOption[] {
  const services = content?.form?.includeServices === false ? [] : (content?.services ?? []).map((s) => ({ value: s._id, label: s.title }));
  return [...services, ...(content?.form?.extraServiceOptions ?? [])];
}

/** Forfaits proposés : visibles et rattachés à une offre visible (même filtre que le site). */
export const packageChoices = (content: QuoteFormContent) => visiblePackages(content?.packages).filter((p) => p.code);

/** Valeurs acceptées par le serveur : exactement celles affichées dans le formulaire. */
export function allowedOptions(content: QuoteFormContent): AllowedOptions | null {
  if (!content?.form) return null;
  const values = (list?: FormOption[]) => (list ?? []).map((o) => o.value);
  return {
    services: serviceOptions(content).map((o) => o.value),
    packages: [...packageChoices(content).map((p) => p.code as string), PACKAGE_OTHER],
    projectTypes: values(content.form.projectTypes),
    regions: values(content.form.regions),
    phases: values(content.form.phases),
    timelines: values(content.form.timelines),
    budgets: values(content.form.budgets),
    software: values(content.form.softwareOptions),
  };
}
