import type { MetadataRoute } from "next";
import { isIndexable } from "@/lib/indexing";
import { siteUrl } from "@/lib/seo";

// Studio et tableau de bord ne sont pas à indexer.
export default function robots(): MetadataRoute.Robots {
  // Aperçu de déploiement ou domaine provisoire : rien à indexer (R-13).
  if (!isIndexable()) return { rules: [{ userAgent: "*", disallow: "/" }] };
  return {
    rules: [{ userAgent: "*", allow: "/", disallow: ["/studio", "/admin", "/api"] }],
    sitemap: `${siteUrl}/sitemap.xml`,
  };
}
