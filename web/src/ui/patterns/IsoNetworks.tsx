import type { NetworkColor } from "@/sanity/types-content";
import { networkVar } from "@/ui/components/NetworkSwatch";

export type IsoRun = { id: string; code: string; label: string; network: NetworkColor; href: string };

// Tracés isométriques (axes à 30°), un par service, dans l'ordre des services de Sanity :
// quatre réseaux parallèles sur un même support, chacun monte à sa colonne puis repart vers l'avant
// et croise le réseau voisin ; le tuyau de devant coupe celui de derrière, comme dans le logo L-01.
const A: [number, number] = [0.866, -0.5]; // vers la droite, en profondeur
const B: [number, number] = [0.866, 0.5]; // vers la droite, vers l'avant
const step = ([x, y]: [number, number], [dx, dy]: [number, number], n: number): [number, number] => [
  Math.round((x + dx * n) * 10) / 10,
  Math.round((y + dy * n) * 10) / 10,
];

function rack(k: number): Array<[number, number]> {
  const start = step([62, 262], B, 26 * k);
  const station = step(start, A, 120 + 40 * k);
  const riser: [number, number] = [station[0], station[1] - (78 - 16 * k)];
  const top = step(riser, A, 190 - 20 * k);
  return [start, station, riser, top, step(top, B, 58)];
}

const PATHS = [0, 1, 2, 3].map(rack);

const d = (pts: Array<[number, number]>) => pts.map(([x, y], i) => `${i ? "L" : "M"}${x} ${y}`).join(" ");

/** Isométrique des réseaux : chaque tracé est un lien vers la demande de soumission du service. */
export function IsoNetworks({ runs, title }: { runs: IsoRun[]; title: string }) {
  const shown = runs.slice(0, PATHS.length);
  return (
    <svg viewBox="0 14 548 306" role="group" aria-label={title} className="h-auto w-full overflow-visible">
      {shown.map((run, i) => {
        const pts = PATHS[i];
        const [sx, sy] = pts[0];
        return (
          <a key={run.id} href={run.href} className="bx-run" data-net-i={i} style={{ "--i": i } as React.CSSProperties} aria-label={`${run.code} · ${run.label}`}>
            {/* Halo couleur papier : crée la coupure au croisement. */}
            <path d={d(pts)} className="bx-pipe" pathLength={1} fill="none" stroke="var(--bx-paper)" strokeWidth={16} strokeLinecap="round" strokeLinejoin="round" />
            <path d={d(pts)} className="bx-pipe" pathLength={1} fill="none" stroke={networkVar[run.network]} strokeWidth={6} strokeLinecap="round" strokeLinejoin="round" />
            {pts.slice(1, -1).map(([x, y]) => (
              <circle key={`${x}-${y}`} className="bx-fitting" cx={x} cy={y} r={5} fill="var(--bx-paper)" stroke={networkVar[run.network]} strokeWidth={2} />
            ))}
            <text x={sx - 12} y={sy + 4} textAnchor="end" className="bx-fitting font-mono max-sm:hidden" fontSize={12} fill="var(--bx-ink)">
              {run.code}
            </text>
            {/* Zone de clic plus large que le tuyau. */}
            <path d={d(pts)} fill="none" stroke="transparent" strokeWidth={28} strokeLinecap="round" />
          </a>
        );
      })}
    </svg>
  );
}
