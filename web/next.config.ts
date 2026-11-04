import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  cacheComponents: true,
  // Images téléversées dans Sanity (logo, visuels), servies par son CDN.
  images: { remotePatterns: [{ protocol: "https", hostname: "cdn.sanity.io" }] },
  partialPrefetching: true,
  turbopack: {
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },
};

export default nextConfig;
