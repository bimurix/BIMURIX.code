import type { NextConfig } from "next";

const isDev = process.env.NODE_ENV !== "production";

/**
 * Politique de sécurité du contenu (site public et tableau de bord). Studio a la sienne, plus large.
 * - scripts : 'unsafe-inline' requis par les scripts d'hydratation de Next sans nonce (pages statiques) ;
 *   'unsafe-eval' seulement en développement (rechargement à chaud).
 * - Sanity : images (cdn.sanity.io) et mises à jour en direct (api/apicdn, WebSocket).
 * - Cloudflare Turnstile : script et iframe du contrôle antispam.
 */
const csp = [
  "default-src 'self'",
  `script-src 'self' 'unsafe-inline'${isDev ? " 'unsafe-eval'" : ""} https://challenges.cloudflare.com`,
  "style-src 'self' 'unsafe-inline'",
  "img-src 'self' data: blob: https://cdn.sanity.io",
  "font-src 'self'",
  `connect-src 'self' https://*.sanity.io wss://*.sanity.io${isDev ? " ws: http://127.0.0.1:*" : ""}`,
  "frame-src https://challenges.cloudflare.com",
  "frame-ancestors 'self'",
  "form-action 'self'",
  "base-uri 'self'",
  "object-src 'none'",
  ...(isDev ? [] : ["upgrade-insecure-requests"]),
].join("; ");

const common = [
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=(), payment=(), usb=()" },
  ...(isDev ? [] : [{ key: "Strict-Transport-Security", value: "max-age=63072000; includeSubDomains; preload" }]),
];

const nextConfig: NextConfig = {
  cacheComponents: true,
  // Images téléversées dans Sanity (logo, visuels), servies par son CDN.
  images: { remotePatterns: [{ protocol: "https", hostname: "cdn.sanity.io" }] },
  partialPrefetching: true,
  poweredByHeader: false,
  async headers() {
    return [
      // Tout sauf Studio : CSP stricte et pas d'intégration dans un site tiers.
      { source: "/((?!studio).*)", headers: [...common, { key: "Content-Security-Policy", value: csp }, { key: "X-Frame-Options", value: "SAMEORIGIN" }] },
      // Studio charge ses propres ressources Sanity : seulement les en-têtes communs et l'anti-iframe.
      { source: "/studio/:path*", headers: [...common, { key: "X-Frame-Options", value: "SAMEORIGIN" }] },
      // Tableau de bord : jamais mis en cache par un intermédiaire.
      { source: "/admin/:path*", headers: [{ key: "Cache-Control", value: "private, no-store" }] },
    ];
  },
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
