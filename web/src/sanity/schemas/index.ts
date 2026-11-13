import { blockSchemas } from "@/blocks/schemas";
import { page, redirect } from "./documents/page";
import { packageDoc } from "./documents/package";
import { service } from "./documents/service";
import { localeRichText, localeSlug, localeString, localeStringIcon, localeText } from "./objects/locale";
import { cta, imageWithAlt, link, networkColor, seo, titleBlock } from "./objects/shared";
import { deliverableRow, faqEntry, responsibilityRow, scenario } from "./objects/v5";
import { emailTemplates } from "./singletons/email-templates";
import { formSettings } from "./singletons/form-settings";
import { launchSettings } from "./singletons/launch-settings";
import { footer, navigation } from "./singletons/navigation";
import { settings } from "./singletons/settings";
import { uiStrings } from "./singletons/ui-strings";

export const singletonTypes = ["settings", "navigation", "footer", "uiStrings", "formSettings", "emailTemplates", "launchSettings"] as const;

export const schemaTypes = [
  localeString,
  localeStringIcon,
  localeText,
  localeRichText,
  localeSlug,
  link,
  cta,
  imageWithAlt,
  seo,
  titleBlock,
  networkColor,
  scenario,
  responsibilityRow,
  deliverableRow,
  faqEntry,
  ...blockSchemas,
  settings,
  navigation,
  footer,
  uiStrings,
  formSettings,
  emailTemplates,
  launchSettings,
  page,
  service,
  packageDoc,
  redirect,
];
