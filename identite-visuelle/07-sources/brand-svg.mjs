// Géométrie du logo L-01 « Croisement » : lettres Archivo (wdth 125, wght 800) vectorisées + X redessiné.
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const here = path.dirname(fileURLToPath(import.meta.url));
const G = JSON.parse(fs.readFileSync(path.join(here, '../font/glyphs.json'), 'utf8')).glyphs;

// Choix du client : BIM bleu nuit + URIX bleu foncé partout (pas de cyan, pas de bleu clair).
// Sur fond foncé, le bleu disparaît : on passe alors au logo blanc.
export const C = { navy: '#0F172A', blue: '#0F52BA', white: '#FFFFFF', black: '#000000', grey: '#6B7280' };
export const SCHEMES = {
  couleur: { ink: C.navy, acc: C.blue },   // principal, fonds clairs
  gris: { ink: C.black, acc: C.grey },     // noir et blanc en deux tons (photocopie, journal)
  noir: { ink: C.black, acc: C.black },
  marine: { ink: C.navy, acc: C.navy },
  blanc: { ink: C.white, acc: C.white },
  bleu: { ink: C.blue, acc: C.blue },
};

const S = 0.1; // unités police -> unités SVG
const r = n => +(n).toFixed(2);
function shift(d, dx, dy, s = S) {
  return d.replace(/(-?\d+(?:\.\d+)?)\s+(-?\d+(?:\.\d+)?)/g, (_, x, y) => `${r((+x + dx) * s)} ${r((+y + dy) * s)}`);
}
const poly = pts => 'M' + pts.map(([x, y]) => `${x} ${y}`).join('L') + 'Z';

// X : trait épais continu (passe devant), trait fin coupé en deux (passe derrière).
// Coupes parallèles au trait épais, jeu de 45 unités (6,5 % de la hauteur de capitale).
const X_THICK = poly([[53, -688], [316, -688], [926, 0], [663, 0]]);
const X_THIN = poly([[654, -688], [897, -688], [632.3, -398.9], [512.7, -533.9]]) +
  poly([[317.4, -321.0], [437.7, -186.4], [267, 0], [23, 0]]);

export const CAP = 688 * S; // 68.8
const LEFT = 85; // approche gauche du B

// Logotype : BIM (encre) URI (accent) X (accent épais + encre fin)
export function wordmarkPaths(ox = 0, oy = 0) {
  let x = 0, ink = '', acc = '';
  for (const [ch, k] of [['B', 'i'], ['I', 'i'], ['M', 'i'], ['U', 'a'], ['R', 'a'], ['I', 'a']]) {
    const d = shift(G[ch].d, x - LEFT + ox / S, 688 + oy / S);
    if (k === 'i') ink += d; else acc += d;
    x += G[ch].adv;
  }
  acc += shift(X_THICK, x - LEFT + ox / S, 688 + oy / S);
  ink += shift(X_THIN, x - LEFT + ox / S, 688 + oy / S);
  const width = (x + 926 - LEFT) * S;
  return { ink, acc, width, height: CAP + 1.2 }; // +1,2 : dépassement du U sous la ligne de base
}
export const WM = wordmarkPaths();

// Symbole X seul, ramené à l'origine
export function xPaths(ox = 0, oy = 0, s = S) {
  return {
    acc: shift(X_THICK, -23 + ox / s, 688 + oy / s, s),
    ink: shift(X_THIN, -23 + ox / s, 688 + oy / s, s),
    width: 903 * s, height: 688 * s,
  };
}

const svg = (w, h, body, title = 'Bimurix') =>
  `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${r(w)} ${r(h)}" width="${r(w)}" height="${r(h)}" role="img" aria-label="${title}"><title>${title}</title>${body}</svg>\n`;
const pp = (d, fill) => `<path fill="${fill}" d="${d}"/>`;

export function logoSVG(scheme) {
  const c = SCHEMES[scheme];
  return svg(WM.width, WM.height, pp(WM.ink, c.ink) + pp(WM.acc, c.acc));
}

export function symbolSVG(scheme) {
  const c = SCHEMES[scheme]; const x = xPaths();
  return svg(x.width, x.height, pp(x.ink, c.ink) + pp(x.acc, c.acc), 'Bimurix, symbole');
}

// Tuile carrée : fond + X centré. ratio = hauteur du X / côté
export const TILES = {
  marine: { bg: C.navy, thick: C.white, thin: C.white },
  noir: { bg: C.black, thick: C.white, thin: C.white },
  'blanc-noir': { bg: C.white, thick: C.black, thin: C.black },
  bleu: { bg: C.blue, thick: C.white, thin: C.navy },
  blanc: { bg: C.white, thick: C.blue, thin: C.navy },
};
export function tileBody(kind, side, ratio = 0.5, ox = 0, oy = 0) {
  const t = TILES[kind]; const s = (side * ratio) / 688;
  const w = 903 * s, h = 688 * s;
  const x = xPaths(ox + (side - w) / 2, oy + (side - h) / 2, s);
  return `<rect x="${ox}" y="${oy}" width="${side}" height="${side}" fill="${t.bg}"/>` + pp(x.ink, t.thin) + pp(x.acc, t.thick);
}
export function tileSVG(kind, ratio = 0.5) {
  return svg(512, 512, tileBody(kind, 512, ratio), 'Bimurix, icône');
}

// Logo avec symbole : tuile à gauche (1,5 × capitale), logotype centré verticalement
export function lockupSVG(scheme, tileKind) {
  const c = SCHEMES[scheme]; const side = CAP * 1.5, gap = CAP * 0.45;
  const w = wordmarkPaths(side + gap, (side - CAP) / 2);
  return svg(side + gap + WM.width, side, tileBody(tileKind, side, 0.5) + pp(w.ink, c.ink) + pp(w.acc, c.acc));
}

// Logo empilé : X au-dessus du logotype
export function stackedSVG(scheme) {
  const c = SCHEMES[scheme]; const xs = 2.0 * S; const xw = 903 * xs, xh = 688 * xs; const gap = CAP * 0.55;
  const x = xPaths((WM.width - xw) / 2, 0, xs);
  const w = wordmarkPaths(0, xh + gap);
  return svg(WM.width, xh + gap + WM.height, pp(x.ink, c.ink) + pp(x.acc, c.acc) + pp(w.ink, c.ink) + pp(w.acc, c.acc));
}
