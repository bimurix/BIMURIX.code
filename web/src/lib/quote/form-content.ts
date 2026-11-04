import type { Localized } from "@/lib/i18n/pick";
import type { RouteTarget } from "@/lib/links";
import type { NetworkColor } from "@/sanity/types-content";
import type { AllowedOptions } from "./submit-quote";

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
    signature?: Localized;
    internalSubject?: string;
  } | null;
  services?: Array<{ _id: string; title?: Localized; code?: string; network?: NetworkColor }>;
  privacyPage?: RouteTarget;
  fromEmail?: string;
} | null;

/** Choix de service proposés : services publiés (si activé) puis choix supplémentaires. */
export function serviceOptions(content: QuoteFormContent): FormOption[] {
  const services = content?.form?.includeServices === false ? [] : (content?.services ?? []).map((s) => ({ value: s._id, label: s.title }));
  return [...services, ...(content?.form?.extraServiceOptions ?? [])];
}

/** Valeurs acceptées par le serveur : exactement celles affichées dans le formulaire. */
export function allowedOptions(content: QuoteFormContent): AllowedOptions | null {
  if (!content?.form) return null;
  const values = (list?: FormOption[]) => (list ?? []).map((o) => o.value);
  return {
    services: serviceOptions(content).map((o) => o.value),
    projectTypes: values(content.form.projectTypes),
    regions: values(content.form.regions),
    phases: values(content.form.phases),
    timelines: values(content.form.timelines),
    budgets: values(content.form.budgets),
    software: values(content.form.softwareOptions),
  };
}
