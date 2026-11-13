import { ring, type IconShape } from "./shape";

// Lieux, rôles et petites actions (pied de page, formulaire, tableaux).
export const placeIcons: Record<string, IconShape> = {
  // cachet cranté (dix arcs), cercle intérieur
  sceau: { d: `M20 12a2.6 2.6 0 0 1-1.53 4.7 2.6 2.6 0 0 1-4 2.91 2.6 2.6 0 0 1-4.94 0 2.6 2.6 0 0 1-4-2.91A2.6 2.6 0 0 1 4 12a2.6 2.6 0 0 1 1.53-4.7 2.6 2.6 0 0 1 4-2.91 2.6 2.6 0 0 1 4.94 0 2.6 2.6 0 0 1 4 2.91A2.6 2.6 0 0 1 20 12z${ring(12, 12, 3.5)}` },
  // bâtiment à toit en dents de scie, porte
  atelier: { d: "M3 20V8l6 4V8l6 4V8l6 4v8zM10.5 20v-4.5h3V20" },
  // niveau à bulle : fioles et bulle
  chantier: { d: "M2 9h20v6H2zM9.5 9v6M14.5 9v6", dot: [12, 12] },
  // deux bulles reliées
  interlocuteur: { d: `${ring(6, 7, 3.5)}${ring(18, 17, 3.5)}M8.5 9.5l7 5` },
  // flèche du nord dans un cercle
  region: { d: `${ring(12, 12, 9)}M12 5.5l3.2 10.5L12 14l-3.2 2z` },
  // cadran d'horloge et coche
  reponse: { d: `${ring(11, 11, 8)}M11 6.5V11l3 2M15.5 18l2.3 2.3L22 16` },
  courriel: { d: "M3 5h18v14H3zM3 6.5l9 7 9-7" },
  telephone: { d: "M5 4h4l2 5-2.5 1.5a11 11 0 0 0 5 5L15 13l5 2v4a2 2 0 0 1-2 2A16 16 0 0 1 3 6a2 2 0 0 1 2-2z" },
  oui: { d: "M4.5 12.5l5 5L19.5 7" },
  non: { d: "M5 12h14" },
  plus: { d: "M12 5v14M5 12h14" },
  "lien-externe": { d: "M10 5H5v14h14v-5M14 4h6v6M20 4l-9 9" },
};
