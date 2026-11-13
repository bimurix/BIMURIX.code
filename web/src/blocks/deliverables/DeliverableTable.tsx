import { Icon } from "@/ui/components/Icon";

export type DeliverableLine = { key: string; title: string; text?: string; purpose?: string; icon?: string | null };

type Props = {
  lines: DeliverableLine[];
  /** En-têtes de colonne, dits une seule fois : « Livrable » et « À quoi ça sert ». */
  labels: { item: string; purpose: string };
  caption?: string;
  className?: string;
};

// La cote (01, 02…) est un compteur CSS : une donnée de repérage, hors du tableau lu par les lecteurs d'écran ; absente sur téléphone (T3), où le symbole et le texte prennent toute la largeur.
const ROW = "grid grid-cols-1 gap-x-3 md:grid-cols-[2.25rem_minmax(0,1fr)_minmax(0,1.15fr)] md:gap-x-6";
const COTE = "[counter-increment:bx-row] before:pt-0.5 before:font-mono before:text-[13px] before:text-ink-2 before:content-[counter(bx-row,decimal-leading-zero)] max-md:before:content-none";

/**
 * Nomenclature « livrable → à quoi ça sert » (plan de contenu v5 § 8 n° 5) : un vrai tableau à deux colonnes, la cote
 * en mono. Sous md, chaque rangée s'empile (livrable en gras, usage dessous) et l'en-tête sert de légende ;
 * les rôles ARIA gardent la sémantique du tableau. Aucun défilement horizontal.
 */
export function DeliverableTable({ lines, labels, caption, className = "" }: Props) {
  const withPurpose = lines.some((l) => l.purpose);
  return (
    <table role="table" className={`block w-full border-t-[1.5px] border-ink text-start ${className}`}>
      {caption && <caption className="sr-only">{caption}</caption>}
      <thead role="rowgroup" className="block">
        <tr role="row" className={`${ROW} border-b border-ink py-2 text-[13px] before:content-[""]`}>
          <th role="columnheader" scope="col" className="text-start font-semibold text-ink">{labels.item}</th>
          {withPurpose && <th role="columnheader" scope="col" className="col-start-1 text-start font-normal text-ink-2 md:col-start-3 md:font-semibold">{labels.purpose}</th>}
        </tr>
      </thead>
      <tbody role="rowgroup" className="block [counter-reset:bx-row]">
        {lines.map((line) => (
          <tr key={line.key} role="row" className={`${ROW} ${COTE} border-b border-rule py-3`}>
            <th role="rowheader" scope="row" className="text-start text-[16px] leading-snug font-semibold text-ink">
              <span className="flex items-start gap-3">
                <Icon name={line.icon} className="mt-px text-blue" />
                <span>{line.title}</span>
              </span>
              {line.text && <span className="mt-1 block text-[15px] leading-relaxed font-normal text-ink-2">{line.text}</span>}
            </th>
            {withPurpose && <td role="cell" className="col-start-1 mt-0.5 text-[15px] leading-relaxed text-ink-2 md:col-start-3 md:mt-0">{line.purpose}</td>}
          </tr>
        ))}
      </tbody>
    </table>
  );
}
