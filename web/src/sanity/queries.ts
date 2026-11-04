import { defineQuery } from "next-sanity";

// Fragments réutilisés : un lien résout sa cible (type, kind, adresse FR/EN) pour construire l'URL.
const link = `{kind, external, email, "internal": internal->{_type, kind, slug}, "serviceId": service->_id}`;
const cta = `{label, style, "link": link${link}}`;
const asset = `asset->{url, "width": metadata.dimensions.width, "height": metadata.dimensions.height}`;

// Tout ce que partagent les pages : identité, menu, pied de page, petits textes, services, adresses.
export const SHELL_QUERY = defineQuery(`{
  "settings": *[_id == "settings"][0]{
    siteName, wordmark, tagline, descriptor, email, phone, serviceArea, neq, legalName, logoAlt,
    "logo": logo{${asset}}, "logoInverse": logoInverse{${asset}}
  },
  "navigation": *[_id == "navigation"][0]{
    items[]{_key, label, listServices, "link": link${link}}, "cta": cta${cta}, languageLabel
  },
  "footer": *[_id == "footer"][0]{ blurb, copyright, columns[]{_key, title, links[]{_key, ...${cta}}} },
  "ui": *[_id == "uiStrings"][0],
  "services": *[_type == "service"] | order(order asc){_id, _type, code, network, title, slug, cardTitle},
  "quotePage": *[_type == "page" && kind == "quote"][0]{_type, kind, slug},
  "routes": *[_type in ["page", "service"] && defined(slug.fr) || kind == "home"]{_type, kind, slug}
}`);

export const HOME_QUERY = defineQuery(`*[_type == "page" && kind == "home"][0]{
  _id, title, titleBlock, seo,
  sections[]{
    ...,
    _type == "heroSheet" => { ..., ctas[]{_key, ...${cta}}, "illustration": illustration{alt, illustrative, ${asset}} },
    _type == "serviceNetworks" => {
      ...,
      "services": coalesce(services[]->, *[_type == "service"] | order(order asc))[]{
        _id, _type, code, network, title, slug, cardTitle, cardText, cardLinkLabel
      }
    },
    _type == "quoteCta" => { ..., "button": button${cta} }
  }
}`);
