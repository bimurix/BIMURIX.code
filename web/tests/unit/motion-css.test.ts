import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";

const strip = (css: string) => css.replace(/\/\*[\s\S]*?\*\//g, "");
const read = (p: string) => strip(readFileSync(new URL(`../../src/${p}`, import.meta.url), "utf8"));
const motion = read("styles/motion.css");
const globals = read("app/globals.css");

/** Retire de la feuille chaque bloc dont l'ouverture correspond à `opener` (accolades équilibrées). */
function stripBlocks(css: string, opener: RegExp): string {
  let out = css;
  for (;;) {
    const m = opener.exec(out);
    if (!m) return out;
    let depth = 0;
    let i = out.indexOf("{", m.index);
    for (; i < out.length; i++) {
      if (out[i] === "{") depth++;
      if (out[i] === "}" && --depth === 0) break;
    }
    out = out.slice(0, m.index) + out.slice(i + 1);
  }
}

describe("mouvement (cahier v6 T4)", () => {
  // Les images-clés ne s'appliquent que par les règles protégées : on les écarte avant de chercher un état caché.
  const outside = stripBlocks(stripBlocks(motion, /@media \(prefers-reduced-motion: no-preference\)/), /@keyframes [\w-]+/);

  it("aucune animation liée au défilement ni état caché hors de « no-preference »", () => {
    expect(outside).not.toMatch(/animation-timeline/);
    expect(outside).not.toMatch(/opacity:\s*0\b/);
    expect(outside).not.toMatch(/animation(-name)?:\s*bx-/);
    expect(outside).not.toMatch(/clip-path|scale[XY]\(0\)/);
  });

  it("les animations liées au défilement sont dans @supports (animation-timeline: view())", () => {
    expect(motion).toMatch(/@supports \(animation-timeline: view\(\)\)/);
    const withoutSupports = stripBlocks(motion, /@supports \(animation-timeline: view\(\)\)/);
    expect(withoutSupports).not.toMatch(/animation-timeline/);
  });

  it("le mouvement réduit coupe les déplacements de flèche", () => {
    expect(motion).toMatch(/@media \(prefers-reduced-motion: reduce\)[\s\S]*transform: none/);
  });

  it("aucune durée ni courbe en dur dans motion.css ni dans globals.css (hors jetons)", () => {
    for (const css of [motion, globals]) {
      expect(css).not.toMatch(/cubic-bezier/);
      expect(css).not.toMatch(/(?<![-\w(.])\d+(\.\d+)?m?s\b/);
    }
  });

  it("pas de dégradé ni de verre dépoli", () => {
    expect(motion).not.toMatch(/gradient|backdrop-filter|blur\(/);
  });
});
