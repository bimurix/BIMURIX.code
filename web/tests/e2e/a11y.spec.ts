import AxeBuilder from "@axe-core/playwright";
import { expect, test } from "@playwright/test";

// Accessibilité automatique (WCAG 2.1 A/AA) sur chaque gabarit, mobile et bureau.
// axe ne remplace pas un test au lecteur d'écran, mais bloque les régressions mesurables.
const pages = ["/", "/en", "/a-propos", "/soumission", "/services/prefabrication-mep", "/en/services/as-built-quality-control", "/confidentialite", "/page-inexistante", "/admin/connexion"];

for (const path of pages) {
  test(`axe WCAG AA : ${path}`, async ({ page }) => {
    await page.goto(path);
    // Les tracés de l'isométrique sont animés : on attend leur état final pour mesurer les contrastes.
    await page.waitForTimeout(2200);
    const results = await new AxeBuilder({ page })
      .withTags(["wcag2a", "wcag2aa", "wcag21a", "wcag21aa"])
      // Iframe Turnstile (Cloudflare) : hors de notre contrôle.
      .exclude("iframe")
      .analyze();
    const summary = results.violations.map((v) => `${v.id} (${v.impact}) : ${v.nodes.length} × ${v.nodes[0]?.target.join(" ")}`);
    expect(summary, summary.join("\n")).toEqual([]);
  });
}
