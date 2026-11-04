import type { Locale } from "@/lib/i18n/locales";
import { pick, type Localized } from "@/lib/i18n/pick";
import { pathFor } from "@/lib/links";
import { serviceOptions, type FormOption, type QuoteFormContent } from "@/lib/quote/form-content";
import type { Choice } from "./fields";

const fallback = {
  fr: {
    fullName: "Nom complet", company: "Entreprise", email: "Courriel professionnel", phone: "Téléphone", preferredLanguage: "Langue de communication",
    service: "Service recherché", projectType: "Type de projet", region: "Région du projet", phase: "Phase du projet", timeline: "Échéancier souhaité",
    budget: "Budget approximatif", software: "Logiciels et formats", description: "Description du besoin", optional: "facultatif",
    submit: "Envoyer ma demande", sending: "Envoi de votre demande…", choose: "Sélectionner", required: "Ce champ est obligatoire.",
    invalidEmail: "Veuillez saisir une adresse courriel valide.", invalid: "Valeur invalide.", successTitle: "Merci pour votre demande.",
    successBody: "Votre message a été transmis.", failureTitle: "L'envoi n'a pas abouti.", failureBody: "Veuillez réessayer.",
    rateLimited: "Trop de demandes envoyées en peu de temps. Réessayez dans quelques minutes.", captcha: "La vérification antispam a échoué. Réessayez.",
    reference: "Votre référence", privacy: "Politique de confidentialité", contactInfo: "Coordonnées", project: "Votre projet", langFr: "Français", langEn: "English",
    consent: "J'accepte que Bimurix utilise ces renseignements pour traiter ma demande.",
  },
  en: {
    fullName: "Full name", company: "Company", email: "Business email", phone: "Phone", preferredLanguage: "Preferred language",
    service: "Service needed", projectType: "Project type", region: "Project region", phase: "Project phase", timeline: "Desired timeline",
    budget: "Approximate budget", software: "Software and formats", description: "Describe your needs", optional: "optional",
    submit: "Send my request", sending: "Sending your request…", choose: "Select", required: "This field is required.",
    invalidEmail: "Please enter a valid email address.", invalid: "Invalid value.", successTitle: "Thank you for your request.",
    successBody: "Your message has been sent.", failureTitle: "Your request could not be sent.", failureBody: "Please try again.",
    rateLimited: "Too many requests in a short time. Please try again in a few minutes.", captcha: "The anti-spam check failed. Please try again.",
    reference: "Your reference", privacy: "Privacy policy", contactInfo: "Contact details", project: "Your project", langFr: "Français", langEn: "English",
    consent: "I agree that Bimurix may use this information to handle my request.",
  },
};

export type FormModel = {
  t: Record<keyof (typeof fallback)["fr"], string>;
  help: { description: string; files: string };
  options: Record<"service" | "projectType" | "region" | "phase" | "timeline" | "budget" | "software", Choice[]>;
  privacyHref: string | null;
};

/** Libellés et listes du formulaire dans la langue de la page (Sanity, sinon valeurs de secours). */
export function buildFormModel(content: QuoteFormContent, locale: Locale): FormModel {
  const f = content?.form ?? {};
  const fb = fallback[locale];
  const label = (key: string, def: string) => pick(f[`label_${key}`] as Localized, locale, def);
  const text = (key: string, def: string) => pick(f[key] as Localized, locale, def);
  const choices = (list?: FormOption[]) => (list ?? []).map((o) => ({ value: o.value, label: pick(o.label, locale, o.value) }));

  return {
    t: {
      ...fb,
      fullName: label("fullName", fb.fullName), company: label("company", fb.company), email: label("email", fb.email), phone: label("phone", fb.phone),
      preferredLanguage: label("preferredLanguage", fb.preferredLanguage), service: label("service", fb.service), projectType: label("projectType", fb.projectType),
      region: label("region", fb.region), phase: label("phase", fb.phase), timeline: label("timeline", fb.timeline), budget: label("budget", fb.budget),
      software: label("software", fb.software), description: label("description", fb.description), optional: label("optional", fb.optional),
      submit: label("submit", fb.submit), sending: label("sending", fb.sending), required: text("errorRequired", fb.required),
      invalidEmail: text("errorEmail", fb.invalidEmail), successTitle: text("successTitle", fb.successTitle), successBody: text("successBody", fb.successBody),
      failureTitle: text("failureTitle", fb.failureTitle), failureBody: text("failureBody", fb.failureBody), consent: text("consentText", fb.consent),
    },
    help: { description: text("descriptionHelp", ""), files: text("filesHelp", "") },
    options: {
      service: choices(serviceOptions(content)),
      projectType: choices(f.projectTypes),
      region: choices(f.regions),
      phase: choices(f.phases),
      timeline: choices(f.timelines),
      budget: choices(f.budgets),
      software: choices(f.softwareOptions),
    },
    privacyHref: pathFor(content?.privacyPage, locale),
  };
}
