import { ring, type IconShape } from "./shape";

// Symboles de documents et de données de chantier : dessins, listes, fiches, relevés, remise.
export const documentIcons: Record<string, IconShape> = {
  // feuille avec cartouche en bas à droite
  "dessin-atelier": { d: "M4 3h16v18H4zM12 21v-4h8M7 7h10M7 10.5h6" },
  // lignes de liste et règle graduée
  "liste-coupe": { d: "M3 5h18M3 9.5h12M3 14h18v6H3zM6 14v2.5M9 14v1.5M12 14v2.5M15 14v1.5M18 14v2.5" },
  // étiquette percée, code à barres
  etiquette: { d: "M3 6h13l5 6-5 6H3zM11 9.5v5M13.5 9.5v5M16 10.5v3", dot: [6.5, 12] },
  // tablette montrant un plan
  tablette: { d: "M6 3h12a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2zM7.5 6.5h9v9h-9zM7.5 11h5v4.5", dot: [12, 18.5] },
  // carte d'équipement : titre et trois lignes de données
  "fiche-equipement": { d: "M3 5h18v14H3zM3 9h18M6 12.5h4M13 12.5h5M6 16h4M13 16h5" },
  // rangée de données dont la dernière case est vide et entourée
  "donnee-manquante": { d: `M2 8h20v8H2zM8 8v8M14 8v8M4 12h2M10 12h2${ring(18, 12, 3)}` },
  // dièse du code, entre crochets
  codification: { d: "M8 4H5v16h3M16 4h3v16h-3M10.5 8l-1 8M14.5 8l-1 8M9 10h6.5M8.5 14h6.5" },
  // pièce en plan, porte avec son battement, numéro
  local: { d: "M9 21H3V3h18v18h-8M9 21v-4a4 4 0 0 1 4 4M8.5 9l1.8-1.3V13M14 7.5h3v5.5h-3z" },
  // parcours construit, nuage de révision (huit arcs) à l'endroit de l'écart
  "tel-que-construit": { d: "M2 20h14v-6M21 9a2.2 2.2 0 0 1-1.46 3.54 2.2 2.2 0 0 1-3.54 1.46 2.2 2.2 0 0 1-3.54-1.46 2.2 2.2 0 0 1-1.46-3.54 2.2 2.2 0 0 1 1.46-3.54 2.2 2.2 0 0 1 3.54-1.46 2.2 2.2 0 0 1 3.54 1.46 2.2 2.2 0 0 1 1.46 3.54z" },
  // mire graduée et ruban à mesurer
  releve: { d: `M3 3h5v18H3zM3 7h2.5M3 11h2.5M3 15h2.5M3 19h2.5${ring(16.5, 15.5, 4.5)}M16.5 11V6h4`, dot: [16.5, 15.5] },
  // triangle de révision avec son numéro
  changement: { d: "M12 3l9 16H3zM10.5 12.5l1.8-1.2V16" },
  // chemise à onglet, coche
  "dossier-remise": { d: "M3 5h6.5l2 2.5H21V19H3zM8.5 14l2.5 2.5 4.5-5" },
};
