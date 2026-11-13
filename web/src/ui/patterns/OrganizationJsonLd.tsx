import type { Locale } from "@/lib/i18n/locales";
import { organizationLd } from "@/lib/jsonld";
import type { Shell } from "@/sanity/types-content";
import { JsonLd } from "./jsonld/JsonLd";

/** Organisation (schema.org ProfessionalService), sur toutes les pages (R-01). Aucune valeur d'exemple : voir `cleanJsonLd`. */
export function OrganizationJsonLd({ shell, locale }: { shell: Shell; locale: Locale }) {
  return <JsonLd data={organizationLd(shell, locale)} />;
}
