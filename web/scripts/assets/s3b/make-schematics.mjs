/**
 * S3b — génère les six schémas au trait (un par service) dans ce dossier, au style « feuille de plan ».
 * Ce sont des illustrations génériques : aucune cote chiffrée, aucun nom, aucune référence de projet.
 * Les couleurs reprennent les tokens de web/src/styles/tokens.css (un fichier SVG ne peut pas lire les variables CSS du site).
 *
 *   node scripts/assets/s3b/make-schematics.mjs
 */
import { writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const here = dirname(fileURLToPath(import.meta.url));
const C = { ink: "#0f172a", ink2: "#475569", rule: "#cbd5e1", grid: "#e7edf5", paper: "#ffffff", paper2: "#f4f7fb", blue: "#0f52ba", green: "#1f7a45", red: "#c0392b", violet: "#6a4c9c", gray: "#52627a" };
const W = 800, H = 600;
const r1 = (n) => Math.round(n * 10) / 10;

const line = (x1, y1, x2, y2, stroke = C.ink, w = 2, extra = "") => `<line x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" stroke="${stroke}" stroke-width="${w}" stroke-linecap="round" ${extra}/>`;
const path = (d, stroke = C.ink, w = 2, extra = "") => `<path d="${d}" fill="none" stroke="${stroke}" stroke-width="${w}" stroke-linecap="round" stroke-linejoin="round" ${extra}/>`;
const rect = (x, y, w, h, stroke = C.ink, sw = 2, fill = "none", extra = "") => `<rect x="${x}" y="${y}" width="${w}" height="${h}" fill="${fill}" stroke="${stroke}" stroke-width="${sw}" ${extra}/>`;
const circle = (cx, cy, r, stroke = C.ink, sw = 2, fill = C.paper) => `<circle cx="${cx}" cy="${cy}" r="${r}" fill="${fill}" stroke="${stroke}" stroke-width="${sw}"/>`;
const text = (x, y, s, size = 24, fill = C.ink, anchor = "middle") => `<text x="${x}" y="${y}" font-family="ui-monospace, 'JetBrains Mono', Menlo, Consolas, monospace" font-size="${size}" fill="${fill}" text-anchor="${anchor}">${s}</text>`;
/** Repère de nomenclature : cercle et lettre, relié à l'élément par un trait fin. */
const balloon = (x, y, label, tx, ty) => line(x, y, tx, ty, C.ink, 1.5) + circle(x, y, 20, C.ink, 2) + text(x, y + 8, label, 24);
/** Nuage de révision : festons autour d'un cercle. */
function cloud(cx, cy, r, n = 12, stroke = C.red) {
  const pts = Array.from({ length: n }, (_, i) => [r1(cx + r * Math.cos((2 * Math.PI * i) / n)), r1(cy + r * Math.sin((2 * Math.PI * i) / n))]);
  const a = r1((2 * Math.PI * r) / n / 1.6);
  return path(pts.map(([x, y], i) => (i ? `A${a} ${a} 0 0 1 ${x} ${y}` : `M${x} ${y}`)).join(" ") + ` A${a} ${a} 0 0 1 ${pts[0][0]} ${pts[0][1]}`, stroke, 3);
}
/** Ligne de cote sans chiffre : traits d'attache, flèches en tirets obliques, lettre au milieu. */
function dim(x1, y1, x2, y2, label) {
  const mx = (x1 + x2) / 2, my = (y1 + y2) / 2;
  const tick = (x, y) => line(x - 7, y + 7, x + 7, y - 7, C.ink2, 2);
  return line(x1, y1, x2, y2, C.ink2, 1.5) + tick(x1, y1) + tick(x2, y2) + `<rect x="${mx - 16}" y="${my - 16}" width="32" height="32" fill="${C.paper}"/>` + text(mx, my + 8, label, 22, C.ink2);
}
/** Lignes de texte figurées par des barres : un tableau sans contenu lisible. */
const bars = (x, y, widths, gap = 26, color = C.rule) => widths.map((w, i) => `<rect x="${x}" y="${y + i * gap}" width="${w}" height="8" rx="4" fill="${color}"/>`).join("");

function sheet(body) {
  const grid = `<defs><pattern id="g" width="40" height="40" patternUnits="userSpaceOnUse"><path d="M40 0H0V40" fill="none" stroke="${C.grid}" stroke-width="1.5"/></pattern></defs>`;
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${W} ${H}" width="${W}" height="${H}">${grid}<rect width="${W}" height="${H}" fill="${C.paper}"/><rect width="${W}" height="${H}" fill="url(#g)"/>${body}</svg>\n`;
}

// P-01 — modèle fédéré : structure, conduit et tuyauterie superposés ; un conflit repéré d'un nuage.
const federated = () => {
  const hatch = (x) => [0, 1, 2, 3].map((i) => line(x + 8 + i * 16, 196, x + 24 + i * 16, 124, C.gray, 1.5)).join("");
  return sheet(
    rect(60, 90, 680, 30, C.ink, 2.5, C.paper2) + // dalle
    rect(170, 120, 80, 80, C.gray, 2.5, C.paper) + hatch(170) + rect(520, 120, 80, 80, C.gray, 2.5, C.paper) + hatch(520) + // poutres
    rect(60, 160, 680, 70, C.violet, 3, "none") + line(60, 195, 740, 195, C.violet, 1.5, 'stroke-dasharray="14 10"') + // conduit, en conflit avec les poutres
    line(60, 300, 740, 300, C.green, 8) + line(60, 340, 740, 340, C.red, 8) + // tuyauterie sous le conduit
    [140, 330, 470, 660].map((x) => line(x, 120, x, 372, C.ink2, 1.5) + line(x - 34, 372, x + 34, 372, C.ink2, 4)).join("") + // suspentes et trapèzes
    cloud(560, 172, 78) + balloon(690, 440, "1", 600, 232) +
    rect(60, 470, 300, 80, C.ink, 2, C.paper) + line(60, 510, 360, 510, C.ink, 1.5) + // légende des trois modèles
    line(80, 490, 120, 490, C.gray, 6) + line(180, 490, 220, 490, C.violet, 6) + line(280, 490, 320, 490, C.green, 6) + bars(80, 526, [220]),
  );
};

// H-02 — spool isométrique coté : tronçons, coudes, brides, repères, lignes de cote sans chiffre, liste de coupe figurée.
const spool = () => {
  const A = [0.866, -0.5], B = [0.866, 0.5];
  const step = ([x, y], [dx, dy], n) => [r1(x + dx * n), r1(y + dy * n)];
  const p0 = [110, 380], p1 = step(p0, A, 230), p2 = [p1[0], p1[1] - 120], p3 = step(p2, B, 250), p4 = step(p3, A, 110);
  const pts = [p0, p1, p2, p3, p4];
  const d = pts.map(([x, y], i) => `${i ? "L" : "M"}${x} ${y}`).join(" ");
  const flange = ([x, y]) => line(x - 14, y - 24, x + 14, y + 24, C.ink, 5);
  const off = (p, dy) => [p[0], p[1] + dy];
  return sheet(
    path(d, C.paper, 26) + path(d, C.red, 12) + pts.slice(1, -1).map(([x, y]) => circle(x, y, 9, C.red, 3)).join("") + flange(p0) + flange(p4) +
    dim(...off(p0, 70), ...off(p1, 70), "A") + dim(p1[0] - 70, p1[1], p2[0] - 70, p2[1], "B") + dim(...off(p2, -60), ...off(p3, -60), "C") +
    balloon(90, 250, "1", ...step(p0, A, 100)) + balloon(470, 430, "2", ...step(p2, B, 130)) + balloon(700, 160, "3", ...step(p3, A, 60)) +
    rect(480, 470, 260, 100, C.ink, 2, C.paper) + line(480, 500, 740, 500, C.ink, 1.5) + line(530, 470, 530, 570, C.ink, 1.5) +
    text(505, 492, "n°", 18, C.ink2) + bars(545, 482, [120]) + ["1", "2"].map((n, i) => text(505, 526 + i * 26, n, 18, C.ink2)).join("") + bars(545, 514, [170, 140]),
  );
};

// G-03 — étage de gicleurs : contour d'un étage, colonne montante, conduite principale, antennes et têtes.
const sprinklers = () => {
  const rows = [170, 270, 370, 470], cols = [200, 300, 400, 500, 600, 690];
  const head = (x, y) => circle(x, y, 10, C.red, 2.5) + line(x - 6, y - 6, x + 6, y + 6, C.red, 2) + line(x - 6, y + 6, x + 6, y - 6, C.red, 2);
  return sheet(
    rect(60, 90, 680, 440, C.ink, 4, "none") + line(60, 320, 330, 320, C.ink, 2.5) + line(450, 90, 450, 230, C.ink, 2.5) + line(450, 300, 450, 320, C.ink, 2.5) + line(450, 320, 740, 320, C.ink, 2.5) + // cloisons
    line(120, 130, 120, 500, C.red, 8) + rows.map((y) => line(120, y, 700, y, C.red, 3.5)).join("") + // conduite principale et antennes
    rows.map((y) => cols.map((x) => head(x, y)).join("")).join("") +
    circle(120, 130, 16, C.red, 3) + circle(120, 130, 5, C.red, 2, C.red) + balloon(80, 50, "1", 112, 116) + // colonne montante
    dim(200, 560, 300, 560, "A") + dim(770, 170, 770, 270, "B"),
  );
};

// C-04 — coupe d'un corridor : conduit, tuyauterie sur trapèze et gicleurs coordonnés sous la dalle.
const corridor = () => sheet(
  rect(60, 70, 680, 34, C.ink, 2.5, C.paper2) + rect(60, 104, 34, 440, C.ink, 2.5, C.paper2) + rect(706, 104, 34, 440, C.ink, 2.5, C.paper2) + line(94, 430, 706, 430, C.ink2, 2, 'stroke-dasharray="16 10"') + // dalle, murs, plafond fini
  rect(130, 150, 230, 110, C.gray, 3, C.paper) + line(130, 150, 360, 260, C.gray, 1.5) + line(130, 260, 360, 150, C.gray, 1.5) + // conduit de ventilation
  [430, 640].map((x) => line(x, 104, x, 300, C.ink2, 2)).join("") + line(410, 300, 660, 300, C.ink2, 5) + // trapèze
  circle(470, 268, 30, C.green, 6) + circle(545, 276, 22, C.green, 6) + circle(610, 280, 18, C.green, 6) + // tuyauterie
  line(245, 104, 245, 150, C.ink2, 2) + line(245, 260, 245, 330, C.red, 3) + circle(245, 350, 20, C.red, 6) + line(245, 370, 245, 422, C.red, 3) + path("M229 422h32l-8 14h-16z", C.red, 2.5) + // gicleur
  balloon(170, 500, "1", 235, 366) + balloon(520, 500, "2", 480, 300) + balloon(400, 370, "3", 360, 240) + dim(94, 570, 706, 570, "A"),
);

// D-05 — fiche de données d'un équipement : symbole repéré et tableau de paramètres, une donnée manquante signalée.
const assetSheet = () => {
  const rows = [150, 206, 262, 318, 374, 430];
  return sheet(
    line(60, 330, 150, 330, C.violet, 8) + circle(210, 330, 60, C.violet, 6) + path("M175 380 L210 280 L245 380", C.violet, 4) + line(270, 330, 330, 330, C.violet, 8) + line(330, 300, 330, 360, C.ink, 5) + // pompe
    balloon(120, 190, "1", 180, 280) +
    rect(400, 94, 340, 392, C.ink, 2.5, C.paper) + line(400, 150, 740, 150, C.ink, 2) + line(560, 150, 560, 486, C.ink, 1.5) + bars(424, 118, [180], 26, C.ink2) +
    rows.slice(1).map((y) => line(400, y, 740, y, C.rule, 1.5)).join("") +
    rows.map((y, i) => bars(424, y + 24, [[90, 110, 70, 100, 80, 96][i]], 26, C.ink2)).join("") +
    rows.map((y, i) => (i === 3 ? rect(576, y + 12, 148, 32, C.red, 2.5, "none", 'stroke-dasharray="8 6"') + text(650, y + 37, "?", 26, C.red) : bars(580, y + 24, [[120, 90, 130, 0, 100, 70][i]]))).join("") +
    rect(60, 470, 250, 70, C.ink, 2, C.paper) + rect(78, 492, 34, 26, C.red, 2.5, "none", 'stroke-dasharray="8 6"') + bars(130, 501, [150]),
  );
};

// Q-06 — plan tel que construit : parcours conçu (tirets), parcours construit (trait plein), écart entouré, cartouche de révision.
const asBuilt = () => sheet(
  rect(60, 80, 680, 360, C.ink, 4, "none") + line(60, 260, 280, 260, C.ink, 2.5) + line(400, 80, 400, 200, C.ink, 2.5) + line(400, 280, 400, 440, C.ink, 2.5) + // murs
  path("M110 150 H560 V380", C.gray, 4, 'stroke-dasharray="16 12"') + // conçu
  path("M110 170 H470 V300 H640 V380", C.green, 7) + [[470, 170], [470, 300], [640, 300]].map(([x, y]) => circle(x, y, 8, C.green, 3)).join("") + // construit
  cloud(555, 250, 112, 14) + path("M690 110 l26 46 h-52 z", C.ink, 2.5) + text(690, 148, "1", 22) + line(690, 156, 640, 190, C.ink, 1.5) +
  rect(440, 470, 300, 90, C.ink, 2.5, C.paper) + line(440, 500, 740, 500, C.ink, 1.5) + line(500, 470, 500, 560, C.ink, 1.5) + line(620, 470, 620, 560, C.ink, 1.5) +
  path("M470 512 l14 24 h-28 z", C.ink, 2) + bars(516, 482, [80]) + bars(636, 482, [80]) + bars(516, 526, [86]) + bars(636, 526, [70]) +
  line(60, 500, 130, 500, C.gray, 4, 'stroke-dasharray="16 12"') + bars(150, 496, [120]) + line(60, 540, 130, 540, C.green, 7) + bars(150, 536, [150]),
);

const files = { "p-01-modele-federe": federated, "h-02-spool-isometrique": spool, "g-03-etage-gicleurs": sprinklers, "c-04-coupe-corridor": corridor, "d-05-fiche-equipement": assetSheet, "q-06-plan-tel-que-construit": asBuilt };
for (const [name, make] of Object.entries(files)) {
  writeFileSync(join(here, `${name}.svg`), make());
  console.log("ok", name);
}
