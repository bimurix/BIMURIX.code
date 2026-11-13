import { expect, test, type APIRequestContext } from "@playwright/test";

// T6-A / T6-B : données structurées, titres, langues, partage, plan du site. Le contenu vient du dataset Sanity de développement.
test.skip(({ isMobile }) => isMobile, "pages identiques sur mobile : une seule passe suffit");

const pairs = [
  { fr: "/", en: "/en" },
  { fr: "/a-propos", en: "/en/about" },
  { fr: "/soumission", en: "/en/quote" },
  { fr: "/confidentialite", en: "/en/privacy" },
  { fr: "/conditions", en: "/en/terms" },
  { fr: "/services/modelisation-bim-coordination", en: "/en/services/bim-modeling-coordination" },
  { fr: "/services/prefabrication-tuyauterie", en: "/en/services/piping-prefabrication" },
  { fr: "/services/prefabrication-gicleurs", en: "/en/services/sprinkler-prefabrication" },
  { fr: "/services/tuyauterie-gicleurs-coordonnes", en: "/en/services/coordinated-piping-sprinklers" },
  { fr: "/services/bim-7d-donnees-actifs", en: "/en/services/bim-7d-asset-data" },
  { fr: "/services/tqc-controle-qualite", en: "/en/services/as-built-quality-control" },
];
const services = pairs.filter((p) => p.fr.startsWith("/services/"));

async function head(request: APIRequestContext, path: string) {
  const html = await (await request.get(path)).text();
  const meta = (re: RegExp) => html.match(re)?.[1]?.replace(/&#x27;/g, "'").replace(/&amp;/g, "&");
  return {
    html,
    title: meta(/<title>([^<]*)<\/title>/),
    description: meta(/<meta name="description" content="([^"]*)"/),
    canonical: meta(/<link rel="canonical" href="([^"]*)"/),
    hreflang: Object.fromEntries([...html.matchAll(/<link rel="alternate" hrefLang="([^"]+)" href="([^"]*)"/g)].map((m) => [m[1], m[2]])),
    ogImage: meta(/<meta property="og:image" content="([^"]*)"/),
    twitterCard: meta(/<meta name="twitter:card" content="([^"]*)"/),
    lang: meta(/<html lang="([^"]*)"/),
    ld: [...html.matchAll(/<script type="application\/ld\+json">([^<]*)<\/script>/g)].map((m) => JSON.parse(m[1].replace(/\\u003c/g, "<")) as Record<string, unknown>),
  };
}

test("22 adresses : titre et description uniques par langue, longueurs, langue du document, canonique", async ({ request }) => {
  for (const lang of ["fr", "en"] as const) {
    const titles = new Set<string>();
    for (const pair of pairs) {
      const path = pair[lang];
      const h = await head(request, path);
      const label = `${lang} ${path}`;
      expect(h.title, label).toBeTruthy();
      expect(h.title!.length, `${label} titre`).toBeLessThanOrEqual(60);
      expect(titles.has(h.title!), `${label} titre en double`).toBe(false);
      titles.add(h.title!);
      expect(h.description, label).toBeTruthy();
      expect(h.description!.length, `${label} description`).toBeLessThanOrEqual(155);
      expect(h.lang, label).toBe(lang === "fr" ? "fr-CA" : "en-CA");
      expect(h.canonical, label).toBe(`https://bimurix.com${path === "/" ? "" : path}`);
      // R-11 : chaque page pointe vers son équivalent, et réciproquement.
      expect(h.hreflang["fr-CA"], label).toBe(`https://bimurix.com${pair.fr === "/" ? "" : pair.fr}`);
      expect(h.hreflang["en-CA"], label).toBe(`https://bimurix.com${pair.en}`);
      expect(h.hreflang["x-default"], label).toBe(h.hreflang["fr-CA"]);
      expect(h.twitterCard, label).toBe("summary_large_image");
      expect(h.html, label).toContain(lang === "fr" ? 'property="og:locale:alternate" content="en_CA"' : 'property="og:locale:alternate" content="fr_CA"');
    }
  }
});

test("images de partage : PNG 1200 × 630 générée pour chaque page, en FR et en EN", async ({ request }) => {
  for (const pair of pairs) {
    for (const lang of ["fr", "en"] as const) {
      const h = await head(request, pair[lang]);
      expect(h.ogImage, pair[lang]).toMatch(/^https:\/\/bimurix\.com\/og\//);
      const res = await request.get(new URL(h.ogImage!).pathname);
      expect(res.status(), h.ogImage).toBe(200);
      expect(res.headers()["content-type"]).toContain("image/png");
      const png = await res.body();
      expect(png.readUInt32BE(16), "largeur").toBe(1200);
      expect(png.readUInt32BE(20), "hauteur").toBe(630);
    }
  }
  expect((await request.get("/og/fr/page-inexistante")).status()).toBe(404);
  expect((await request.get("/og/de")).status()).toBe(404);
});

test("données structurées : organisation partout, service, FAQ et fil d'Ariane, jamais de valeur d'exemple ni de champ nul", async ({ request }) => {
  for (const pair of pairs) {
    for (const lang of ["fr", "en"] as const) {
      const h = await head(request, pair[lang]);
      const raw = JSON.stringify(h.ld);
      const types = h.ld.map((d) => d["@type"]);
      expect(types, pair[lang]).toContain("ProfessionalService");
      expect(raw, pair[lang]).not.toMatch(/:null|555-01|1234567890|\(exemple\)|\(example\)/);
      expect(raw, pair[lang]).not.toMatch(/"offers"|"price"|aggregateRating|"Review"/);
      if (pair.fr === "/") expect(types).toContain("WebSite");
      if (services.includes(pair)) {
        expect(types, pair[lang]).toContain("Service");
        expect(types, pair[lang]).toContain("BreadcrumbList");
      }
      // R-03 : chaque question du JSON est affichée mot pour mot.
      const faq = h.ld.find((d) => d["@type"] === "FAQPage") as { mainEntity: Array<{ name: string; acceptedAnswer: { text: string } }> } | undefined;
      for (const q of faq?.mainEntity ?? []) {
        const text = h.html.replace(/&#x27;/g, "'").replace(/&quot;/g, '"').replace(/&amp;/g, "&");
        expect(text, `${pair[lang]} question`).toContain(q.name);
        expect(text, `${pair[lang]} réponse`).toContain(q.acceptedAnswer.text);
      }
    }
  }
});

test("plan du site : les 22 adresses avec leurs équivalents, sans /admin, /studio ni page introuvable ; robots", async ({ request }) => {
  const xml = await (await request.get("/sitemap.xml")).text();
  const locs = [...xml.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => m[1]);
  expect(locs).toHaveLength(22);
  for (const pair of pairs) {
    for (const path of [pair.fr, pair.en]) expect(locs, path).toContain(`https://bimurix.com${path === "/" ? "" : path}`);
  }
  expect(xml).not.toMatch(/\/admin|\/studio|_404|introuvable|not-found/);
  expect(xml).toContain('hreflang="en-CA"');
  expect(xml).toContain('hreflang="fr-CA"');
  expect((xml.match(/<lastmod>/g) ?? []).length).toBe(22);
  const robots = await (await request.get("/robots.txt")).text();
  expect(robots).toContain("Disallow: /studio");
  expect(robots).toContain("Disallow: /admin");
  expect(robots).toContain("Sitemap: https://bimurix.com/sitemap.xml");
  // 404 non indexée ; domaine final : aucun en-tête noindex.
  const missing = await head(request, "/page-inexistante");
  expect(missing.html).toMatch(/<meta name="robots" content="noindex/);
  expect((await request.get("/")).headers()["x-robots-tag"]).toBeUndefined();
});
