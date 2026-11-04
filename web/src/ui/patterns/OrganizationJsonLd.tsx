import type { Locale } from "@/lib/i18n/locales";
import { pick } from "@/lib/i18n/pick";
import { pathFor } from "@/lib/links";
import { siteUrl } from "@/lib/seo";
import type { Shell } from "@/sanity/types-content";

/** Données structurées de l'entreprise (schema.org ProfessionalService) pour les moteurs de recherche. */
export function OrganizationJsonLd({ shell, locale }: { shell: Shell; locale: Locale }) {
  const s = shell?.settings;
  const services = (shell?.services ?? []).flatMap((service) => {
    const path = pathFor(service, locale);
    return path ? [{ "@type": "Service", name: pick(service.title, locale, ""), url: `${siteUrl}${path}` }] : [];
  });
  const data = {
    "@context": "https://schema.org",
    "@type": "ProfessionalService",
    name: s?.siteName ?? "Bimurix",
    url: `${siteUrl}${locale === "fr" ? "/" : "/en"}`,
    description: pick(s?.descriptor, locale, "") || undefined,
    email: s?.email,
    telephone: s?.phone,
    logo: s?.logo?.asset?.url,
    areaServed: pick(s?.serviceArea, locale, "") || "Québec",
    inLanguage: locale === "fr" ? "fr-CA" : "en-CA",
    makesOffer: services.map((itemOffered) => ({ "@type": "Offer", itemOffered })),
  };
  // « < » échappé : le JSON ne peut pas fermer la balise <script>.
  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(data).replace(/</g, "\\u003c") }} />;
}
