import { expect, test, type Page } from "@playwright/test";

// Cahier v6 T4 (M-21, M-22, M-23) : le mouvement n'est jamais nécessaire à la lecture et ne décale rien.
const PAGES = ["/", "/en", "/services/prefabrication-tuyauterie", "/en/services/piping-prefabrication"];

async function scrollThrough(page: Page) {
  const height = await page.evaluate(() => document.documentElement.scrollHeight);
  for (let y = 0; y < height; y += 500) {
    await page.evaluate((top) => window.scrollTo(0, top), y);
    await page.waitForTimeout(60);
  }
}

const hiddenRows = (page: Page) =>
  page.evaluate(() => [...document.querySelectorAll(".bx-reveal, .bx-figure-draw, .bx-rail, .bx-method-line")].filter((el) => {
    const s = getComputedStyle(el);
    return Number(s.opacity) < 1 || (s.clipPath !== "none" && s.clipPath !== "") || (s.transform !== "none" && !/^matrix\(1, 0, 0, 1, 0, 0\)$/.test(s.transform));
  }).length);

test.describe("mouvement réduit : tout visible, rien ne bouge", () => {
  test.use({ reducedMotion: "reduce" });
  for (const path of PAGES) {
    test(`${path}`, async ({ page }) => {
      await page.goto(path);
      expect(await page.locator(".bx-reveal, .bx-rail").count()).toBeGreaterThan(0);
      expect(await hiddenRows(page)).toBe(0);
      expect(await page.evaluate(() => document.getAnimations().filter((a) => a.playState === "running" && !(a instanceof CSSTransition)).length)).toBe(0);
      await expect(page.locator("#contenu h1")).toBeVisible();
    });
  }
});

test.describe("sans animations liées au défilement : tout visible", () => {
  for (const path of PAGES) {
    test(`${path}`, async ({ page }) => {
      await page.goto(path);
      // Simule un navigateur qui ne connaît pas `animation-timeline` : les règles de ce @supports ne s'appliquent pas.
      await page.evaluate(() => {
        for (const sheet of [...document.styleSheets]) {
          const rules = [...sheet.cssRules];
          for (let i = rules.length - 1; i >= 0; i--) {
            const text = rules[i].cssText;
            if (/animation-timeline: view\(\)/.test(text) || /bx-reveal|bx-rail|bx-figure-draw|bx-method-line/.test(text)) {
              if (rules[i] instanceof CSSMediaRule || rules[i] instanceof CSSSupportsRule) { try { sheet.deleteRule(i); } catch { /* feuille croisée */ } }
            }
          }
        }
      });
      await scrollThrough(page);
      expect(await hiddenRows(page)).toBe(0);
    });
  }
});

test.describe("décalage de mise en page (CLS)", () => {
  for (const path of PAGES) {
    test(`${path} : CLS proche de 0`, async ({ page }) => {
      await page.addInitScript(() => {
        (window as unknown as { __cls: number }).__cls = 0;
        new PerformanceObserver((list) => {
          for (const e of list.getEntries() as unknown as Array<{ value: number; hadRecentInput: boolean }>) if (!e.hadRecentInput) (window as unknown as { __cls: number }).__cls += e.value;
        }).observe({ type: "layout-shift", buffered: true });
      });
      await page.goto(path);
      await scrollThrough(page);
      await page.waitForTimeout(500);
      const cls = await page.evaluate(() => (window as unknown as { __cls: number }).__cls);
      expect(cls).toBeLessThan(0.02);
    });
  }
});
