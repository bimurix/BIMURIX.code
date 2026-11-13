// Un symbole = un tracé SVG (grille 24 px, trait 1,5 px, sans remplissage) et, au plus, un point plein (raccord, tête, bulle).
export type IconShape = { d: string; dot?: readonly [number, number] };

/** Cercle ouvert en tracé : deux demi-arcs, pour que tout le symbole reste un seul `<path>`. */
export const ring = (cx: number, cy: number, r: number) => `M${cx - r} ${cy}a${r} ${r} 0 1 0 ${2 * r} 0a${r} ${r} 0 1 0 ${-2 * r} 0`;
