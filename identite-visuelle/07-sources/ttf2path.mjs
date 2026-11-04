// Minimal TrueType reader: glyph outlines -> SVG path (y flipped), advances, kerning ignored.
import fs from 'node:fs';
const buf = fs.readFileSync(process.argv[2]);
const dv = new DataView(buf.buffer, buf.byteOffset, buf.byteLength);
const n = dv.getUint16(4); const T = {};
for (let i = 0; i < n; i++) { const o = 12 + i * 16; T[buf.toString('latin1', o, o + 4)] = { off: dv.getUint32(o + 8), len: dv.getUint32(o + 12) }; }
const upm = dv.getUint16(T.head.off + 18), locFmt = dv.getInt16(T.head.off + 50);
const numH = dv.getUint16(T.hhea.off + 34);
const numG = dv.getUint16(T.maxp.off + 4);
// cmap
function cmapLookup() {
  const c = T.cmap.off, nt = dv.getUint16(c + 2); const map = {};
  for (let i = 0; i < nt; i++) {
    const off = c + dv.getUint32(c + 4 + i * 8 + 4); const fmt = dv.getUint16(off);
    if (fmt === 4) { const segX2 = dv.getUint16(off + 6), seg = segX2 / 2; const ends = off + 14, starts = ends + segX2 + 2, deltas = starts + segX2, ros = deltas + segX2;
      for (let s = 0; s < seg; s++) { const e = dv.getUint16(ends + s * 2), st = dv.getUint16(starts + s * 2), d = dv.getInt16(deltas + s * 2), ro = dv.getUint16(ros + s * 2);
        for (let ch = st; ch <= e && ch !== 0xffff; ch++) { let g; if (ro === 0) g = (ch + d) & 0xffff; else { const gi = ros + s * 2 + ro + (ch - st) * 2; g = dv.getUint16(gi); if (g) g = (g + d) & 0xffff; } map[ch] = g; } } }
    if (fmt === 12) { const ng = dv.getUint32(off + 12); for (let k = 0; k < ng; k++) { const b = off + 16 + k * 12; const s = dv.getUint32(b), e = dv.getUint32(b + 4), g = dv.getUint32(b + 8); for (let ch = s; ch <= e; ch++) map[ch] = g + ch - s; } }
  } return map; }
const cmap = cmapLookup();
const adv = g => dv.getUint16(T.hmtx.off + 4 * Math.min(g, numH - 1));
const loca = g => locFmt ? dv.getUint32(T.loca.off + g * 4) : dv.getUint16(T.loca.off + g * 2) * 2;
function outline(g) {
  const s = loca(g), e = loca(g + 1); if (s === e) return [];
  let p = T.glyf.off + s; const nc = dv.getInt16(p); if (nc < 0) throw new Error('composite glyph ' + g);
  p += 10; const ends = []; for (let i = 0; i < nc; i++) { ends.push(dv.getUint16(p)); p += 2; }
  const il = dv.getUint16(p); p += 2 + il; const np = ends[nc - 1] + 1; const fl = [];
  while (fl.length < np) { const f = buf[p++]; fl.push(f); if (f & 8) { let r = buf[p++]; while (r--) fl.push(f); } }
  const xs = [], ys = []; let v = 0;
  for (const f of fl) { if (f & 2) { const d = buf[p++]; v += f & 16 ? d : -d; } else if (!(f & 16)) { v += dv.getInt16(p); p += 2; } xs.push(v); }
  v = 0; for (const f of fl) { if (f & 4) { const d = buf[p++]; v += f & 32 ? d : -d; } else if (!(f & 32)) { v += dv.getInt16(p); p += 2; } ys.push(v); }
  const contours = []; let st = 0; for (const en of ends) { const pts = []; for (let i = st; i <= en; i++) pts.push({ x: xs[i], y: ys[i], on: !!(fl[i] & 1) }); contours.push(pts); st = en + 1; }
  return contours; }
function toPath(contours, ox, oy, sc) {
  const X = x => +(ox + x * sc).toFixed(2), Y = y => +(oy - y * sc).toFixed(2); let d = '';
  for (const c of contours) { if (!c.length) continue;
    let start = c.findIndex(q => q.on); let pts;
    if (start < 0) { const a = c[0], b = c[1]; pts = [{ x: (a.x + b.x) / 2, y: (a.y + b.y) / 2, on: true }, ...c.slice(1), c[0]]; start = 0; }
    else pts = [...c.slice(start), ...c.slice(0, start)];
    d += `M${X(pts[0].x)} ${Y(pts[0].y)}`; const L = pts.length;
    for (let i = 1; i <= L; i++) { const q = pts[i % L];
      if (q.on) { d += `L${X(q.x)} ${Y(q.y)}`; continue; }
      const nx = pts[(i + 1) % L]; let end; if (nx.on) { end = nx; i++; } else end = { x: (q.x + nx.x) / 2, y: (q.y + nx.y) / 2 };
      d += `Q${X(q.x)} ${Y(q.y)} ${X(end.x)} ${Y(end.y)}`; }
    d += 'Z'; } return d; }
// Output JSON: for each requested char, path at scale 1 (font units, baseline y=0) and advance
const chars = process.argv[3]; const out = { upm, capHeight: T['OS/2'] ? dv.getInt16(T['OS/2'].off + 88) : null, glyphs: {} };
for (const ch of chars) { const g = cmap[ch.codePointAt(0)]; const c = outline(g); let minX = Infinity, maxX = -Infinity; for (const k of c) for (const q of k) { minX = Math.min(minX, q.x); maxX = Math.max(maxX, q.x); }
  out.glyphs[ch] = { adv: adv(g), minX, maxX, d: toPath(c, 0, 0, 1) }; }
console.log(JSON.stringify(out));
