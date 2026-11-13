import { defineQuery } from "next-sanity";

// Fragments réutilisés : un lien résout sa cible (type, kind, adresse FR/EN) pour construire l'URL.
const link = `{kind, external, email, "internal": select(internal->visible == false => null, internal->{_type, kind, slug}), "serviceId": service->_id}`;
const cta = `{label, style, "link": link${link}}`;
const asset = `asset->{url, "width": metadata.dimensions.width, "height": metadata.dimensions.height}`;
const image = `{alt, caption, illustrative, ${asset}}`;
// Cible d'un lien vers un service (adresse FR/EN) ; un service masqué ne donne aucun lien.
const serviceRef = `{_id, _type, slug, title, shortTitle}`;

// Petits textes et page de soumission joints aux blocs de l'offre (forfaits : lien `?forfait=`).
const uiRef = `*[_id == "uiStrings"][0]`;
const quotePageRef = `*[_type == "page" && kind == "quote"][0]{_type, kind, slug}`;

// Sections du constructeur de pages, avec leurs liens et images résolus.
const sections = `sections[]{
  ...,
  _type == "heroSheet" => { ..., ctas[]{_key, ...${cta}}, "illustration": illustration${image} },
  _type == "serviceNetworks" => {
    ...,
    "services": coalesce(services[]->, *[_type == "service"] | order(order asc))[visible != false]{
      _id, _type, code, network, title, shortTitle, family, slug, cardTitle, cardText, cardLinkLabel
    }
  },
  _type == "projectCycle" => {
    ...,
    "services": coalesce(services[]->, *[_type == "service"] | order(order asc))[visible != false]{
      _id, _type, code, network, title, shortTitle, family, slug
    }
  },
  _type == "problems" => { ..., "image": image${image}, items[]{..., "services": services[]->[visible != false]${serviceRef}} },
  _type == "scenarios" => { ..., items[]{..., "image": image${image}, "service": select(service->visible == false => null, service->${serviceRef})} },
  _type == "packages" => {
    ...,
    "taxNote": *[_id == "launchSettings"][0].taxNote,
    "creditText": *[_id == "launchSettings"][0].creditText,
    "ui": ${uiRef}, "quotePage": ${quotePageRef},
    "packages": *[_type == "package" && visible != false && defined(service) && service->visible != false && (!defined(^.service) || service._ref == ^.service._ref)] | order(order asc){
      _id, code, title, priceMode, price, scope, leadTimeDays, inclusions, highlighted, visible, order, "service": service->{_id, visible}
    }
  },
  _type == "proof" => { ..., "ui": ${uiRef} },
  _type == "conditions" => { ..., "launch": *[_id == "launchSettings"][0]{conditions, professionalNote} },
  _type == "deliverables" => { ..., items[]{..., "image": image${image}} },
  _type == "imageFigure" => { ..., "image": image${image} },
  _type == "quoteCta" => { ..., "button": button${cta} },
  _type == "richText" => { ..., body{ fr[]{..., markDefs[]{..., _type == "link" => ${link}}}, en[]{..., markDefs[]{..., _type == "link" => ${link}}} } }
}`;

const seo = `seo{title, description, noIndex, "image": image{${asset}}}`;

// Tout ce que partagent les pages : identité, menu, pied de page, petits textes, services, adresses.
export const SHELL_QUERY = defineQuery(`{
  "settings": *[_id == "settings"][0]{
    siteName, wordmark, tagline, descriptor, email, phone, serviceArea, neq, legalName, logoAlt, titleTemplate,
    "logo": logo{${asset}}, "logoInverse": logoInverse{${asset}}, "defaultSeo": defaultSeo{title, description, "image": image{${asset}}}
  },
  "navigation": *[_id == "navigation"][0]{
    items[]{_key, label, listServices, "link": link${link}}, "cta": cta${cta}, languageLabel
  },
  "footer": *[_id == "footer"][0]{ blurb, copyright, columns[]{_key, title, listServices, links[]{_key, ...${cta}}} },
  "ui": *[_id == "uiStrings"][0],
  "launch": *[_id == "launchSettings"][0]{bannerEnabled, bannerText, deadline},
  "services": *[_type == "service" && visible != false] | order(order asc){_id, _type, code, network, title, shortTitle, family, slug, cardTitle},
  "quotePage": *[_type == "page" && kind == "quote"][0]{_type, kind, slug},
  "routes": *[_type in ["page", "service"] && visible != false && (defined(slug.fr) || kind == "home")]{_type, kind, slug, "noIndex": seo.noIndex, _updatedAt}
}`);

export const HOME_QUERY = defineQuery(`*[_type == "page" && kind == "home"][0]{
  _id, _type, kind, title, slug, titleBlock, ${seo}, ${sections}
}`);

export const NOT_FOUND_QUERY = defineQuery(`*[_type == "page" && kind == "notFound"][0]{
  _id, _type, kind, title, titleBlock, ${sections}
}`);

// Une page ou un service selon son adresse dans la langue demandée (ex. « services/prefabrication-mep »).
export const DOCUMENT_BY_SLUG_QUERY = defineQuery(`*[_type in ["page", "service"] && visible != false && slug[$locale] == $slug][0]{
  _id, _type, kind, title, slug, titleBlock, updatedLabel, ${seo},
  _type == "page" => { ${sections} },
  _type == "service" => {
    code, network, heroHeading, heroIntro, "heroCta": heroCta${cta}, "heroImage": heroImage${image},
    offeringsHeading, offerings, deliverablesHeading, deliverables, deliverablesNote,
    methodHeading, methodSteps, extraHeading, extraItems, extraNote, moreHeading, moreItems, moreNote,
    audience, responsibilityNote, quoteButtonLabel,
    scenarios[]{..., "image": image${image}},
    deliverableRows, "figureImage": figureImage${image}, needsHeading, needs, needsNote,
    responsibilityRows, "proof": proof{..., "ui": ${uiRef}}, faq,
    ctaHeading, ctaText, "ctaButton": ctaButton${cta},
    "taxNote": *[_id == "launchSettings"][0].taxNote,
    "creditText": *[_id == "launchSettings"][0].creditText,
    "packages": *[_type == "package" && visible != false && service._ref == ^._id] | order(order asc){
      _id, code, title, priceMode, price, scope, leadTimeDays, inclusions, highlighted, visible, order, "service": service->{_id, visible}
    }
  }
}`);

// Ancienne adresse d'une page ou d'une offre dont l'adresse a changé (document « Redirection »).
export const REDIRECT_QUERY = defineQuery(`*[_type == "redirect" && from == $from][0]{to, permanent}`);

// Formulaire de soumission : libellés, listes, consentement, courriels et services proposés.
export const QUOTE_FORM_QUERY = defineQuery(`{
  "form": *[_id == "formSettings"][0],
  "emails": *[_id == "emailTemplates"][0],
  "services": *[_type == "service" && visible != false] | order(order asc){_id, title, shortTitle, code, network},
  "packages": *[_type == "package"]{_id, code, title, visible, order, "service": service->{_id, visible}},
  "privacyPage": *[_type == "page" && kind == "privacy"][0]{_type, kind, slug},
  "fromEmail": *[_id == "settings"][0].email
}`);

// Adresses à pré-générer : une entrée par document et par langue disponible.
export const SLUGS_QUERY = defineQuery(`*[_type in ["page", "service"] && visible != false && defined(slug.fr)]{ "fr": slug.fr, "en": slug.en }`);
