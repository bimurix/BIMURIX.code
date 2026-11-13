import { ICON_NAMES, type IconName } from "@/lib/icon-names";
import { ICON_SHAPES } from "./icons/paths";

const SIZE = { sm: "var(--bx-icon-sm)", md: "var(--bx-icon-md)", lg: "var(--bx-icon-lg)" } as const;

type Props = {
  /** Nom saisi dans Studio : un nom inconnu ou vide ne rend rien (la ligne garde son rendu d'avant). */
  name: string | null | undefined;
  /** 20 px dans une phrase, 24 px dans une liste ou un tableau, 40 px en tête de section ou d'étape (tokens --bx-icon-*). */
  size?: keyof typeof SIZE;
  /** Donné seulement quand le symbole porte le sens à lui seul ; sinon décoratif (aria-hidden), le texte voisin dit tout. */
  label?: string;
  className?: string;
};

export function isIconName(name: string | null | undefined): name is IconName {
  return Boolean(name) && (ICON_NAMES as readonly string[]).includes(name as string);
}

/**
 * Symbole au trait (cahier v6 T3-A) : grille de 24 px, trait de 1,5 px qui garde cette épaisseur à toute taille
 * (`non-scaling-stroke`), extrémités et angles arrondis, `currentColor`. Composant serveur, SVG en ligne, aucun script.
 */
export function Icon({ name, size = "md", label, className = "" }: Props) {
  if (!isIconName(name)) return null;
  const shape = ICON_SHAPES[name];
  const px = SIZE[size];
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden={label ? undefined : "true"}
      role={label ? "img" : undefined}
      aria-label={label}
      focusable="false"
      data-icon={name}
      className={`bx-icon shrink-0 ${className}`}
      style={{ width: px, height: px }}
    >
      <path d={shape.d} vectorEffect="non-scaling-stroke" />
      {shape.dot && <circle cx={shape.dot[0]} cy={shape.dot[1]} r="1" fill="currentColor" stroke="none" />}
    </svg>
  );
}
