import type { MetadataRoute } from "next";
import { siteUrl } from "@/lib/seo";

// Studio et tableau de bord ne sont pas à indexer.
export default function robots(): MetadataRoute.Robots {
  return {
    rules: [{ userAgent: "*", allow: "/", disallow: ["/studio", "/admin", "/api"] }],
    sitemap: `${siteUrl}/sitemap.xml`,
  };
}
