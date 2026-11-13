import { mkdirSync, writeFileSync } from "node:fs";
import { dirname } from "node:path";
import { createElement as h } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";
import { ICON_NAMES, ICON_OPTIONS } from "@/lib/icon-names";
import { Icon } from "@/ui/components/Icon";
import { ICON_SHAPES } from "@/ui/components/icons/paths";

const render = (el: React.ReactElement) => renderToStaticMarkup(el);

describe("Icon (cahier v6 T3-A)", () => {
  it("dessine chacun des 39 noms de la liste fermée, décoratif par défaut", () => {
    expect(ICON_NAMES).toHaveLength(39);
    for (const name of ICON_NAMES) {
      const html = render(h(Icon, { name }));
      expect(html, name).toContain(`data-icon="${name}"`);
      expect(html, name).toContain('aria-hidden="true"');
      expect(html, name).toContain('viewBox="0 0 24 24"');
      expect(html, name).toContain('stroke="currentColor"');
      expect(html, name).toContain('stroke-width="1.5"');
      expect(html, name).toContain('vector-effect="non-scaling-stroke"');
      expect(html, name).not.toContain("<script");
      expect(html, name).not.toMatch(/#[0-9a-f]{3,6}/i);
    }
  });

  it("garde la liste des tracés égale à la liste fermée, sans doublon, un seul point plein au plus", () => {
    expect(Object.keys(ICON_SHAPES).sort()).toEqual([...ICON_NAMES].sort());
    for (const name of ICON_NAMES) {
      const shape = ICON_SHAPES[name];
      expect(shape.d.length, name).toBeGreaterThanOrEqual(8);
      // Tous les nombres du tracé restent dans la grille de 24 px (marge intérieure de 2 px incluse, sauf traits de bord).
      const nums = [...shape.d.matchAll(/-?\d+(?:\.\d+)?/g)].map((m) => Number(m[0]));
      expect(nums.every((n) => Math.abs(n) <= 24), name).toBe(true);
    }
    expect(new Set(Object.values(ICON_SHAPES).map((s) => s.d)).size).toBe(39);
  });

  it("donne un nom accessible seulement quand le symbole porte le sens", () => {
    const html = render(h(Icon, { name: "oui", label: "Oui" }));
    expect(html).toContain('role="img"');
    expect(html).toContain('aria-label="Oui"');
    expect(html).not.toContain("aria-hidden");
  });

  it("ne rend rien pour un nom vide ou inconnu", () => {
    expect(render(h(Icon, { name: null }))).toBe("");
    expect(render(h(Icon, { name: "" }))).toBe("");
    expect(render(h(Icon, { name: "licorne" }))).toBe("");
  });

  it("utilise les trois tailles par jetons", () => {
    expect(render(h(Icon, { name: "plus", size: "sm" }))).toContain("var(--bx-icon-sm)");
    expect(render(h(Icon, { name: "plus", size: "md" }))).toContain("var(--bx-icon-md)");
    expect(render(h(Icon, { name: "plus", size: "lg" }))).toContain("var(--bx-icon-lg)");
  });

  // Planche de contrôle (V-01) : ICON_SHEET_OUT=chemin.html pnpm test -t planche — non publiée, sert à la capture.
  it("planche de contrôle : écrit la page des 39 symboles aux trois tailles quand ICON_SHEET_OUT est défini", () => {
    const out = process.env.ICON_SHEET_OUT;
    if (!out) return;
    const css = `:root{--bx-icon-sm:20px;--bx-icon-md:24px;--bx-icon-lg:40px}body{font:14px Archivo,system-ui,sans-serif;color:#0f172a;margin:24px;background:#fff}
h1{font-size:20px;margin:0 0 16px}.g{display:grid;grid-template-columns:repeat(auto-fill,minmax(210px,1fr));gap:0;border-top:1.5px solid #0f172a}
.c{border-bottom:1px solid #cbd5e1;padding:10px 8px;display:grid;grid-template-columns:auto 1fr;gap:10px;align-items:center}.s{display:flex;gap:12px;align-items:center}
.n{font:12px 'JetBrains Mono',ui-monospace,monospace;color:#475569}.t{font-weight:600;font-size:13px}.blue{color:#0f52ba}`;
    const cells = ICON_OPTIONS.map((o) => `<div class="c"><div class="s">${render(h(Icon, { name: o.value, size: "lg" }))}${render(h(Icon, { name: o.value, size: "md" }))}${render(h(Icon, { name: o.value, size: "sm", className: "blue" }))}</div><div><div class="t">${o.title}</div><div class="n">${o.value}</div></div></div>`);
    mkdirSync(dirname(out), { recursive: true });
    writeFileSync(out, `<!doctype html><meta charset="utf-8"><title>Planche des symboles</title><style>${css}</style><h1>Symboles Bimurix — 39 noms, 40 / 24 / 20 px, trait 1,5 px</h1><div class="g">${cells.join("")}</div>`);
    expect(cells).toHaveLength(39);
  });
});
