// Génère le dossier identite-visuelle/ : SVG, PNG, ICO, PDF, gabarits.
// Logo principal = « couleur » (BIM bleu nuit, URIX bleu foncé), comme sur la carte d'affaires.
import fs from 'node:fs';
import path from 'node:path';
import { createRequire } from 'node:module';
import { C, SCHEMES, logoSVG, symbolSVG, tileSVG, tileBody, lockupSVG, stackedSVG } from './brand-svg.mjs';

const ROOT = 'C:/Users/souil/Downloads/Bimurix-siteweb/identite-visuelle';
const require = createRequire('C:/Users/souil/Downloads/Bimurix-siteweb/web/package.json');
const { chromium } = require('@playwright/test');

const w = (rel, data) => { const p = path.join(ROOT, rel); fs.mkdirSync(path.dirname(p), { recursive: true }); fs.writeFileSync(p, data); return p; };
const sized = (s, width) => s.replace(/width="[^"]+" height="[^"]+"/, `width="${width}"`);
const vb = s => s.match(/viewBox="0 0 ([\d.]+) ([\d.]+)"/).slice(1).map(Number);
const FONTS = '<link href="https://fonts.googleapis.com/css2?family=Archivo:wdth,wght@62..125,300..800&family=JetBrains+Mono:wght@400;500&display=swap" rel="stylesheet">';

// ---------- 1. SVG du logo ----------
const L = '01-logo/svg/';
const STACKED = ['couleur', 'gris', 'noir', 'blanc', 'bleu'];
const LOCKUPS = { couleur: ['couleur', 'bleu'], gris: ['gris', 'noir'], noir: ['noir', 'noir'], blanc: ['blanc', 'blanc'] };
const TILE_KINDS = ['blanc', 'bleu', 'marine', 'noir', 'blanc-noir'];
for (const s of Object.keys(SCHEMES)) {
  w(`${L}bimurix-logo-${s}.svg`, logoSVG(s));
  w(`${L}bimurix-symbole-x-${s}.svg`, symbolSVG(s));
}
for (const s of STACKED) w(`${L}bimurix-logo-empile-${s}.svg`, stackedSVG(s));
for (const [name, [s, t]] of Object.entries(LOCKUPS)) w(`${L}bimurix-logo-icone-${name}.svg`, lockupSVG(s, t));
for (const t of TILE_KINDS) w(`${L}bimurix-icone-${t}.svg`, tileSVG(t));

// ---------- 2. Gabarits ----------
// clair = principal (logo couleur). Sur fond foncé : logo blanc, hiérarchie par la graisse.
const TH = {
  clair: { bg: '#FFFFFF', line: '#E9EEF5', ink: C.navy, acc: C.blue, sub: '#475569', logo: 'couleur', weight: false },
  bleu: { bg: C.blue, line: '#1D5DC4', ink: '#FFFFFF', acc: '#FFFFFF', sub: '#DCE6F7', logo: 'blanc', weight: true },
  marine: { bg: C.navy, line: '#18233A', ink: '#FFFFFF', acc: '#FFFFFF', sub: '#B4C0D3', logo: 'blanc', weight: true },
  'noir-blanc': { bg: '#FFFFFF', line: '#EDEDED', ink: '#000000', acc: '#000000', sub: '#4B5563', logo: 'noir', weight: true },
};
const THEMES = Object.keys(TH);
const grid = (line, step = 24) => `background-image:linear-gradient(${line} 1px,transparent 1px),linear-gradient(90deg,${line} 1px,transparent 1px);background-size:${step}px ${step}px;`;
const page = (W, H, css, body) => `<!doctype html><html><head><meta charset="utf-8">${FONTS}<style>
*{box-sizing:border-box}html,body{margin:0;width:${W}px;height:${H}px;overflow:hidden}
body{font-family:Archivo,system-ui,sans-serif;font-variation-settings:"wdth" 100}
.d{font-variation-settings:"wdth" 118;font-weight:700;letter-spacing:-.01em;line-height:1.04}
.m{font-family:"JetBrains Mono",ui-monospace,monospace}
svg{display:block}${css}</style></head><body>${body}</body></html>`;
const base = t => `body{background:${t.bg};${grid(t.line)}color:${t.ink}}.hi{color:${t.acc}}.m{color:${t.sub}}` +
  (t.weight ? '.d{font-weight:400}.d .hi{font-weight:800}' : '');
const PROMISE = ['Des modèles fiables.', 'Des installations mieux préparées.', 'Des données exploitables.'];
const SERVICES = 'Modélisation et coordination · Préfabrication MEP · BIM 7D · TQC';

function banner(W, H, t, { logoW = 0, padStart, textSize, monoSize }) {
  const logo = logoW ? sized(logoSVG(t.logo), logoW) : '';
  return page(W, H, `${base(t)}body{display:flex;align-items:center}
.in{padding-inline:${padStart}px ${Math.round(W * 0.05)}px;display:grid;gap:${Math.round(H * 0.07)}px}.p{font-size:${textSize}px}.m{font-size:${monoSize}px}`,
  `<div class="in">${logo}<div class="d p">${PROMISE[0]} <span class="hi">${PROMISE[1]}</span> ${PROMISE[2]}</div><div class="m">${SERVICES} — Québec</div></div>`);
}
const og = t => page(1200, 630, `${base(t)}body{padding:72px 80px;display:flex;flex-direction:column;justify-content:space-between}.p{font-size:58px}.m{font-size:20px}`,
  `${sized(logoSVG(t.logo), 360)}<div class="d p">${PROMISE[0]}<br><span class="hi">${PROMISE[1]}</span><br>${PROMISE[2]}</div><div class="m">${SERVICES}</div>`);
function post(W, H, t) {
  const f = Math.round(Math.min(W, H) * 0.085);
  return page(W, H, `${base(t)}body{background-size:30px 30px;padding:${Math.round(H * 0.08)}px ${Math.round(W * 0.07)}px;display:flex;flex-direction:column;justify-content:space-between}
.t{font-size:${f}px;max-width:90%}.m{font-size:${Math.round(f * 0.3)}px}`,
  `<div class="m">[ Gabarit : remplacer ce texte ]</div><div class="d t">Votre titre de publication<br><span class="hi">sur deux lignes.</span></div>${sized(logoSVG(t.logo), Math.round(W * 0.28))}`);
}
const tilePage = (kind, side, ratio) => page(side, side, '', `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" width="${side}" height="${side}">${tileBody(kind, 512, ratio)}</svg>`);
const emailHeader = () => page(600, 120, `body{background:#fff;display:flex;align-items:center;justify-content:space-between;padding:0 32px;border-bottom:4px solid ${C.blue}}.m{font-size:11px;color:#475569;text-align:end;line-height:1.5}`,
  `${sized(logoSVG('couleur'), 220)}<div class="m">Services BIM<br>Québec</div>`);

// Carte d'affaires 3,5 × 2 po, valeurs d'exemple. Deux jeux : couleur et noir-blanc.
const CARDS = {
  couleur: { logo: 'couleur', stack: 'couleur', ink: C.navy, sub: '#475569', band: C.blue, vbg: '#FFFFFF', vline: '#E9EEF5' },
  'noir-blanc': { logo: 'noir', stack: 'blanc', ink: '#000000', sub: '#4B5563', band: '#000000', vbg: '#000000', vline: '#1A1A1A' },
};
const cardCss = k => `@page{size:3.5in 2in;margin:0}html,body{width:3.5in;height:2in}
.f{width:3.5in;height:2in;position:relative;overflow:hidden;page-break-after:always}
.recto{background:#fff;padding:.22in .24in;display:flex;flex-direction:column;justify-content:space-between;color:${k.ink};border-bottom:.06in solid ${k.band}}
.n{font-size:12.5pt;font-weight:700;font-variation-settings:"wdth" 112}.r{font-size:8pt;color:${k.sub};margin-top:2pt}
.c{font-family:"JetBrains Mono",monospace;font-size:6.6pt;line-height:1.55;color:${k.ink}}.ex{color:${k.sub}}
.verso{background:${k.vbg};${grid(k.vline, 9)}display:grid;place-items:center}`;
function card(k, forPdf) {
  const recto = `<div class="f recto">${sized(logoSVG(k.logo), 120)}<div><div class="n">Prénom Nom</div><div class="r">Titre du poste</div></div>
<div class="c">514 555-0100 <span class="ex">(exemple)</span><br>prenom@bimurix.com <span class="ex">(exemple)</span><br>bimurix.com <span class="ex">(exemple)</span></div></div>`;
  const verso = `<div class="f verso">${sized(stackedSVG(k.stack), 130)}</div>`;
  if (forPdf) return `<!doctype html><html><head><meta charset="utf-8">${FONTS}<style>*{box-sizing:border-box}body{margin:0;font-family:Archivo,sans-serif}svg{display:block}${cardCss(k)}</style></head><body>${recto}${verso}</body></html>`;
  return [recto, verso].map(f => page(1008, 576, `body{zoom:3}${cardCss(k).replace(/@page[^}]+}/, '')}`, f));
}

// ---------- 3. Rendu ----------
const browser = await chromium.launch();
const pg = await (await browser.newContext({ deviceScaleFactor: 1 })).newPage();
async function shot(html, W, H, rel, transparent = false) {
  await pg.setViewportSize({ width: W, height: H });
  await pg.setContent(html, { waitUntil: 'networkidle' });
  await pg.evaluate(() => document.fonts.ready);
  const p = path.join(ROOT, rel); fs.mkdirSync(path.dirname(p), { recursive: true });
  await pg.screenshot({ path: p, omitBackground: transparent, clip: { x: 0, y: 0, width: W, height: H } });
}
const svgPng = async (svgStr, W, rel) => { const [vw, vh] = vb(svgStr); const H = Math.ceil(W * vh / vw); await shot(page(W, H, 'body{background:transparent}', sized(svgStr, W)), W, H, rel, true); };

// Logos PNG transparents
for (const s of Object.keys(SCHEMES)) for (const W of [600, 1200, 2400]) await svgPng(logoSVG(s), W, `01-logo/png/bimurix-logo-${s}-${W}px.png`);
for (const s of STACKED) for (const W of [800, 1600]) await svgPng(stackedSVG(s), W, `01-logo/png/bimurix-logo-empile-${s}-${W}px.png`);
for (const [name, [s, t]] of Object.entries(LOCKUPS)) for (const W of [800, 1600]) await svgPng(lockupSVG(s, t), W, `01-logo/png/bimurix-logo-icone-${name}-${W}px.png`);
for (const s of Object.keys(SCHEMES)) await svgPng(symbolSVG(s), 903, `01-logo/png/bimurix-symbole-x-${s}-903px.png`);
for (const t of TILE_KINDS) for (const S of [512, 1024]) await shot(tilePage(t, S, 0.5), S, S, `01-logo/png/bimurix-icone-${t}-${S}px.png`);

// Site web : icône blanche (X bleu + bleu nuit, comme le logo)
const fav = {};
for (const S of [16, 32, 48]) { await shot(tilePage('blanc', S, S <= 16 ? 0.66 : 0.58), S, S, `02-site-web/favicon-${S}.png`); fav[S] = fs.readFileSync(path.join(ROOT, `02-site-web/favicon-${S}.png`)); }
{ // ICO : en-tête + entrées pointant vers des PNG intégrés
  const sizes = [16, 32, 48]; const head = Buffer.alloc(6 + 16 * sizes.length); head.writeUInt16LE(1, 2); head.writeUInt16LE(sizes.length, 4);
  let off = head.length; sizes.forEach((s, i) => { const e = 6 + i * 16; head.writeUInt8(s, e); head.writeUInt8(s, e + 1); head.writeUInt16LE(1, e + 4); head.writeUInt16LE(32, e + 6); head.writeUInt32LE(fav[s].length, e + 8); head.writeUInt32LE(off, e + 12); off += fav[s].length; });
  w('02-site-web/favicon.ico', Buffer.concat([head, ...sizes.map(s => fav[s])])); }
w('02-site-web/favicon.svg', tileSVG('blanc', 0.58));
await shot(tilePage('blanc', 180, 0.5), 180, 180, '02-site-web/apple-touch-icon.png');
await shot(tilePage('blanc', 192, 0.5), 192, 192, '02-site-web/icon-192.png');
await shot(tilePage('blanc', 512, 0.5), 512, 512, '02-site-web/icon-512.png');
await shot(tilePage('blanc', 512, 0.4), 512, 512, '02-site-web/icon-maskable-512.png');
for (const k of THEMES) await shot(og(TH[k]), 1200, 630, `02-site-web/og-image-${k}-1200x630.png`);
w('02-site-web/site.webmanifest', JSON.stringify({ name: 'Bimurix', short_name: 'Bimurix', icons: [
  { src: '/icon-192.png', sizes: '192x192', type: 'image/png' }, { src: '/icon-512.png', sizes: '512x512', type: 'image/png' },
  { src: '/icon-maskable-512.png', sizes: '512x512', type: 'image/png', purpose: 'maskable' }], theme_color: C.navy, background_color: '#FFFFFF', display: 'standalone' }, null, 2) + '\n');
w('02-site-web/head-snippet.html', `<!-- À placer dans <head> ; fichiers à copier dans web/public/ -->
<link rel="icon" href="/favicon.ico" sizes="48x48">
<link rel="icon" href="/favicon.svg" type="image/svg+xml">
<link rel="apple-touch-icon" href="/apple-touch-icon.png">
<link rel="manifest" href="/site.webmanifest">
<meta name="theme-color" content="${C.navy}">
<meta property="og:image" content="https://VOTRE-DOMAINE/og-image-clair-1200x630.png">
`);

// LinkedIn
for (const t of ['blanc', 'bleu', 'marine', 'noir']) await shot(tilePage(t, 400, 0.5), 400, 400, `03-linkedin/logo-page-entreprise-${t}-400x400.png`);
for (const k of THEMES) {
  await shot(banner(1128, 191, TH[k], { padStart: 300, textSize: 26, monoSize: 12 }), 1128, 191, `03-linkedin/banniere-page-entreprise-${k}-1128x191.png`);
  await shot(banner(1584, 396, TH[k], { logoW: 300, padStart: 520, textSize: 40, monoSize: 16 }), 1584, 396, `03-linkedin/banniere-profil-personnel-${k}-1584x396.png`);
  await shot(post(1200, 1200, TH[k]), 1200, 1200, `03-linkedin/gabarit-publication-carree-${k}-1200x1200.png`);
}
for (const k of ['clair', 'bleu']) {
  await shot(post(1200, 627, TH[k]), 1200, 627, `03-linkedin/gabarit-publication-lien-${k}-1200x627.png`);
  await shot(post(1080, 1350, TH[k]), 1080, 1350, `03-linkedin/gabarit-publication-portrait-${k}-1080x1350.png`);
}

// Courriel
await svgPng(logoSVG('couleur'), 400, '04-courriel/logo-signature-400px.png');
await shot(tilePage('bleu', 160, 0.5), 160, 160, '04-courriel/icone-signature-160px.png');
await shot(emailHeader(), 600, 120, '04-courriel/en-tete-infolettre-600x120.png');

// Imprimé
for (const [name, k] of Object.entries(CARDS)) {
  const [cr, cv] = card(k, false);
  await shot(cr, 1008, 576, `05-imprime/carte-affaires-${name}-recto-apercu.png`);
  await shot(cv, 1008, 576, `05-imprime/carte-affaires-${name}-verso-apercu.png`);
  await pg.setContent(card(k, true), { waitUntil: 'networkidle' }); await pg.evaluate(() => document.fonts.ready);
  await pg.pdf({ path: path.join(ROOT, `05-imprime/carte-affaires-${name}-3.5x2po.pdf`), width: '3.5in', height: '2in', printBackground: true, preferCSSPageSize: true });
}
for (const s of ['couleur', 'gris', 'noir']) {
  await pg.setContent(`<!doctype html><style>@page{size:200mm 33mm;margin:0}body{margin:0;padding:3mm 4mm}svg{display:block}</style>${sized(logoSVG(s), '100%')}`);
  await pg.pdf({ path: path.join(ROOT, `05-imprime/bimurix-logo-${s}-vectoriel.pdf`), width: '200mm', height: '33mm', printBackground: true });
}

// Réseaux (avatar générique : Facebook, Instagram, Google)
for (const t of ['blanc', 'bleu', 'marine', 'noir']) await shot(tilePage(t, 1080, 0.5), 1080, 1080, `06-reseaux/avatar-${t}-1080x1080.png`);

await browser.close();
console.log('ok');
