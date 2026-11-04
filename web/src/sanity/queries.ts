import { defineQuery } from "next-sanity";

// Fragments réutilisés : un lien résout sa cible (type, kind, adresse FR/EN) pour construire l'URL.
const link = `{kind, external, email, "internal": internal->{_type, kind, slug}, "serviceId": service->_id}`;
const cta = `{label, style, "link": link${link}}`;
const asset = `asset->{url, "width": metadata.dimensions.width, "height": metadata.dimensions.height}`;
const image = `{alt, illustrative, ${asset}}`;

// Sections du constructeur de pages, avec leurs liens et images résolus.
const sections = `sections[]{
  ...,
  _type == "heroSheet" => { ..., ctas[]{_key, ...${cta}}, "illustration": illustration${image} },
  _type == "serviceNetworks" => {
    ...,
    "services": coalesce(services[]->, *[_type == "service"] | order(order asc))[]{
      _id, _type, code, network, title, slug, cardTitle, cardText, cardLinkLabel
    }
  },
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
  "footer": *[_id == "footer"][0]{ blurb, copyright, columns[]{_key, title, links[]{_key, ...${cta}}} },
  "ui": *[_id == "uiStrings"][0],
  "services": *[_type == "service"] | order(order asc){_id, _type, code, network, title, slug, cardTitle},
  "quotePage": *[_type == "page" && kind == "quote"][0]{_type, kind, slug},
  "routes": *[_type in ["page", "service"] && (defined(slug.fr) || kind == "home")]{_type, kind, slug, "noIndex": seo.noIndex, _updatedAt}
}`);

export const HOME_QUERY = defineQuery(`*[_type == "page" && kind == "home"][0]{
  _id, _type, kind, title, slug, titleBlock, ${seo}, ${sections}
}`);

export const NOT_FOUND_QUERY = defineQuery(`*[_type == "page" && kind == "notFound"][0]{
  _id, _type, kind, title, titleBlock, ${sections}
}`);

// Une page ou un service selon son adresse dans la langue demandée (ex. « services/prefabrication-mep »).
export const DOCUMENT_BY_SLUG_QUERY = defineQuery(`*[_type in ["page", "service"] && slug[$locale] == $slug][0]{
  _id, _type, kind, title, slug, titleBlock, updatedLabel, ${seo},
  _type == "page" => { ${sections} },
  _type == "service" => {
    code, network, heroHeading, heroIntro, "heroCta": heroCta${cta}, "heroImage": heroImage${image},
    offeringsHeading, offerings, deliverablesHeading, deliverables, deliverablesNote,
    methodHeading, methodSteps, extraHeading, extraItems, extraNote,
    ctaHeading, ctaText, "ctaButton": ctaButton${cta}
  }
}`);

// Adresses à pré-générer : une entrée par document et par langue disponible.
export const SLUGS_QUERY = defineQuery(`*[_type in ["page", "service"] && defined(slug.fr)]{ "fr": slug.fr, "en": slug.en }`);
