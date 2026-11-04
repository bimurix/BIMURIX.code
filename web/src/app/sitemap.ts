import type { MetadataRoute } from "next";
import { pathFor, type RouteTarget } from "@/lib/links";
import { siteUrl } from "@/lib/seo";
import { fetchPublished } from "@/sanity/fetch";
import { SHELL_QUERY } from "@/sanity/queries";

type Route = RouteTarget & { noIndex?: boolean; _updatedAt?: string };

// Une entrée par page publiée et par langue, avec ses équivalents FR/EN.
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const shell = await fetchPublished<{ routes?: Route[] }>({ query: SHELL_QUERY });
  const routes = (shell?.routes ?? []).filter((r) => !r.noIndex && r.kind !== "notFound");

  return routes.flatMap((route) => {
    const fr = pathFor(route, "fr");
    const en = pathFor(route, "en");
    const languages = { ...(fr ? { "fr-CA": `${siteUrl}${fr}` } : {}), ...(en ? { "en-CA": `${siteUrl}${en}` } : {}) };
    return [fr, en].flatMap((path) =>
      path ? [{ url: `${siteUrl}${path}`, lastModified: route._updatedAt, alternates: { languages } }] : [],
    );
  });
}
