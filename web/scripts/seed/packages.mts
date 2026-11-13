import { keyed, l, ref } from "./helpers.mts";

// Source : docs/source/2026-11-04_offres-v3-1/offres-bim-v3-1.md. EN : traduction à relire.
// decision: ADR-006 n° 2 — seuls les 5 forfaits d'entrée à prix confirmé sont saisis comme forfaits.
// decision: ADR-006 n° 3 — « hypothèse à valider » (60 $/spool, implantation, rack multi-métiers, conformité 7D,
// tarifs réguliers, garantie) : aucun forfait, aucun montant dans les conditions.
// N4 : chaque forfait est rattaché à son offre ; un seul forfait mis en avant (l'offre combinée).

const prefab = "service-prefabrication";
const sprinkler = "service-gicleurs";
const combined = "service-combinee";
const sevenD = "service-bim-7d";

const pkg = (n: number, fields: Record<string, unknown>) => ({
  _id: `package-f-0${n}`,
  _type: "package",
  code: `F-0${n}`,
  visible: false,
  highlighted: false,
  priceMode: "fixed",
  order: n * 10,
  ...fields,
});

export const packageDocs = [
  pkg(1, {
    title: l("Zone pilote", "Pilot zone"),
    service: ref(prefab),
    price: 1800,
    scope: l("Jusqu'à 30 spools ou 150 m (500 pi) de tuyauterie d'une discipline", "Up to 30 spools or 150 m (500 ft) of piping, one discipline"),
    leadTimeDays: 5,
    inclusions: keyed([
      l("Modélisation en LOD 400", "LOD 400 modelling"),
      l("Dessins de spool", "Spool drawings"),
      l("Supports et contreventements parasismiques de la zone", "Hangers and seismic bracing for the zone"),
    ]),
  }),
  pkg(2, {
    title: l("Skid standard", "Standard skid"),
    service: ref(prefab),
    price: 2200,
    scope: l("Jusqu'à 2 pompes, collecteurs d'aspiration et de refoulement, environ 20 spools", "Up to 2 pumps, suction and discharge headers, about 20 spools"),
    leadTimeDays: 5,
    inclusions: keyed([
      l("Dessins d'assemblage", "Assembly drawings"),
      l("Dessins de spool", "Spool drawings"),
      l("Liste de matériel", "Material list"),
      l("Cadre selon le dessin du fabricant ou de l'ingénieur (sans conception structurale)", "Frame per the manufacturer's or engineer's drawing (no structural design)"),
    ]),
  }),
  pkg(3, {
    title: l("Un étage de gicleurs", "One floor of sprinklers"),
    service: ref(sprinkler),
    price: 1500,
    scope: l("Un étage jusqu'à 10 000 pi²", "One floor up to 10,000 sq. ft"),
    leadTimeDays: 5,
    inclusions: keyed([
      l("Dessins d'atelier", "Shop drawings"),
      l("Listes de coupe", "Cut lists"),
      l("Supports", "Hangers"),
    ]),
  }),
  pkg(4, {
    title: l("Tuyauterie et gicleurs coordonnés", "Coordinated piping and sprinklers"),
    service: ref(combined),
    price: 2800,
    scope: l("Une zone modélisée dans les deux disciplines", "One zone modelled in both disciplines"),
    leadTimeDays: 7,
    highlighted: true,
    inclusions: keyed([
      l("Conflits réglés avant la fabrication", "Clashes resolved before fabrication"),
      l("Dessins d'atelier des deux disciplines", "Shop drawings for both disciplines"),
    ]),
  }),
  pkg(5, {
    title: l("Audit 7D", "7D audit"),
    service: ref(sevenD),
    price: 1200,
    scope: l("Audit d'un modèle MEP", "Audit of one MEP model"),
    leadTimeDays: 3,
    inclusions: keyed([
      l("Rapport Excel des données manquantes", "Excel report of missing data"),
    ]),
  }),
];

// ADR-008 : forfaits masqués (visible: false), bandeau éteint, crédit, conditions de paiement et « 100 $/h » retirés. Le code des forfaits reste.
export const launchSettingsDoc = {
  _id: "launchSettings",
  _type: "launchSettings",
  bannerEnabled: false,
  bannerText: l("Forfaits de lancement à prix fixe", "Fixed-price launch packages"),
  taxNote: l("Prix en dollars canadiens, avant TPS et TVQ.", "Prices in Canadian dollars, before GST and QST."),
  professionalNote: l(
    "La conception, les calculs (y compris parasismique), l'approbation, la signature et le sceau des dessins restent à l'ingénieur ou à l'entrepreneur.",
    "Design, calculations (including seismic), approval, and the signature and seal of the drawings remain with the engineer or the contractor.",
  ),
};
