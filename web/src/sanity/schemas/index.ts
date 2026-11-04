import { blockSchemas } from "@/blocks/schemas";
import { page, redirect } from "./documents/page";
import { service } from "./documents/service";
import { localeRichText, localeSlug, localeString, localeText } from "./objects/locale";
import { cta, imageWithAlt, link, networkColor, seo, titleBlock } from "./objects/shared";
import { emailTemplates } from "./singletons/email-templates";
import { formSettings } from "./singletons/form-settings";
import { footer, navigation } from "./singletons/navigation";
import { settings } from "./singletons/settings";
import { uiStrings } from "./singletons/ui-strings";

export const singletonTypes = ["settings", "navigation", "footer", "uiStrings", "formSettings", "emailTemplates"] as const;

export const schemaTypes = [
  localeString,
  localeText,
  localeRichText,
  localeSlug,
  link,
  cta,
  imageWithAlt,
  seo,
  titleBlock,
  networkColor,
  ...blockSchemas,
  settings,
  navigation,
  footer,
  uiStrings,
  formSettings,
  emailTemplates,
  page,
  service,
  redirect,
];
