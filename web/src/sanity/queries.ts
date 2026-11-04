import { defineQuery } from "next-sanity";

export const SETTINGS_QUERY = defineQuery(`*[_id == "settings"][0]{
  siteName, wordmark, tagline, descriptor, email, phone, serviceArea, neq,
  "logo": logo{asset->{url, metadata{dimensions}}}, logoAlt
}`);

export const HOME_QUERY = defineQuery(`*[_type == "page" && kind == "home"][0]{
  _id, title, titleBlock, seo,
  "hero": sections[_type == "heroSheet"][0]{heading, intro, specialties}
}`);
