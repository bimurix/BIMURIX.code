import { ring, type IconShape } from "./shape";

// Symboles de réseaux de mécanique du bâtiment et de protection incendie, comme sur un plan : vanne, pompe, gicleur, supports.
export const networkIcons: Record<string, IconShape> = {
  // deux triangles pointe à pointe sur la conduite, volant au-dessus
  vanne: { d: "M2 13h3M19 13h3M5 8v10l7-5-7-5zM19 8v10l-7-5 7-5zM12 13V5.5M9 5.5h6" },
  // volute, triangle d'écoulement, refoulement
  pompe: { d: `${ring(10, 12, 7)}M17 12h5M7.5 8.5v7l6-3.5z` },
  // tige, raccord, deux bras, déflecteur, trois filets d'eau
  "tete-gicleur": { d: "M12 2v4M10 6h4v2.5h-4zM10.5 8.5L8.5 14M13.5 8.5L15.5 14M8 14h8M8 17.5l-2 2.5M12 17v3.5M16 17.5l2 2.5" },
  // segment entre deux brides, bulle de repère reliée au tuyau
  "tuyau-spool": { d: `M2 14h3M19 14h3M5 10v8M19 10v8M5 12.5h14M5 15.5h14${ring(12, 6, 2.5)}M12 8.5v4`, dot: [12, 6] },
  // tuyau à 90 degrés, deux brides
  coude: { d: "M5 21V12a7 7 0 0 1 7-7h9M11 21v-8a2 2 0 0 1 2-2h8M3 19h10M19 3v10" },
  // dalle, tige filetée, collier autour du tuyau en coupe
  support: { d: `M8.5 2h7M12 2v12M6.5 14h11M6.5 14v2.5a5.5 5.5 0 0 0 11 0V14${ring(12, 17.5, 3)}` },
  // plafond, tige, tuyau, contreventement en diagonale
  parasismique: { d: `M3 3h18M8 3v9M8 11L18 3${ring(8, 16.5, 4.5)}`, dot: [18, 3] },
  // profilé en I en coupe
  poutre: { d: "M5 4h14v3h-5.5v10H19v3H5v-3h5.5V7H5z" },
  // gaine rectangulaire en coupe, diagonale de la gaine
  conduit: { d: "M3 6h18v12H3zM3 6l18 12" },
  // deux réseaux qui se croisent, cercle de révision au croisement
  conflit: { d: `M2 16L22 8M2 8l20 8${ring(12, 12, 4.5)}` },
  // trois plans superposés
  "modele-federe": { d: "M12 3l9 4.5-9 4.5-9-4.5zM3 12l9 4.5 9-4.5M3 16.5l9 4.5 9-4.5" },
  // double trait vertical qui traverse deux planchers
  "colonne-montante": { d: "M10.5 2v20M13.5 2v20M2 8h8.5M13.5 8H22M2 16h8.5M13.5 16H22" },
  // mur en élévation, manchon, tuyau traversant, hachures d'angle
  manchon: { d: `M3 3h18v18H3z${ring(12, 12, 5.5)}${ring(12, 12, 2.5)}M3 9l6-6M3 4.5L4.5 3` },
  // cadre, pompe, collecteur à trois piquages
  skid: { d: `M2.5 5h19v14h-19z${ring(8.5, 12, 3.5)}M12 12h3M15 8v8M15 8h4M15 12h4M15 16h4` },
  // trois axes à 30 degrés qui partent d'un même point
  isometrique: { d: "M12 13V3M9.8 5.2L12 3l2.2 2.2M12 13L3.5 18M12 13l8.5 5M17.5 18.5l3-.5-1.5-2.6M6.5 15.3L3.5 18l.4 3.2", dot: [12, 13] },
};
