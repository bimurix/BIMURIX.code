import type { TitleBlockData } from "@/sanity/types-content";

const COLUMNS = ["A", "B", "C", "D", "E", "F"];
const ROWS = ["1", "2", "3", "4"];

/**
 * Feuille de dessin (direction A) : cadre, repères de grille dans les marges, fond quadrillé.
 * Les repères sont décoratifs (aria-hidden) ; le contenu reste une page normale.
 */
export function Sheet({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return (
    <div className={`relative sm:ps-5 sm:pt-5 ${className}`}>
      <div aria-hidden="true" className="absolute inset-x-5 top-0 hidden justify-around font-mono text-[10px] text-ink-3 sm:flex">
        {COLUMNS.map((c) => <span key={c}>{c}</span>)}
      </div>
      <div aria-hidden="true" className="absolute inset-y-5 start-0 hidden flex-col justify-around font-mono text-[10px] text-ink-3 sm:flex">
        {ROWS.map((r) => <span key={r}>{r}</span>)}
      </div>
      <div className="bx-sheet-grid relative border-[1.5px] border-ink bg-paper">{children}</div>
    </div>
  );
}

type TitleBlockProps = { data: TitleBlockData; labels: { sheet: string; revision: string; date: string }; brand: React.ReactNode };

/** Cartouche : identification de la feuille, comme sur un plan. */
export function TitleBlock({ data, labels, brand }: TitleBlockProps) {
  const cells = [
    [labels.sheet, data?.sheet],
    [labels.revision, data?.revision],
    [labels.date, data?.date],
  ] as const;
  return (
    <dl className="grid grid-cols-3 border-t-[1.5px] border-ink bg-paper font-mono text-[12px] sm:border-s-[1.5px]">
      <div className="col-span-3 border-b border-ink px-3 py-2">{brand}</div>
      {cells.map(([label, value], i) => (
        <div key={label} className={`px-3 py-2 ${i < 2 ? "border-e border-ink" : ""}`}>
          <dt className="text-[10px] text-ink-3">{label}</dt>
          <dd className="text-ink">{value ?? "—"}</dd>
        </div>
      ))}
    </dl>
  );
}
