import { keyed, l, ref } from "./helpers.mts";

// Source : docs/source/2026-11-04_offres-v3-1/offres-bim-v3-1.md. EN : traduction à relire.
// decision: ADR-006 n° 2 — seuls les 5 forfaits d'entrée à prix confirmé sont saisis comme forfaits.
// decision: ADR-006 n° 3 — « hypothèse à valider » (60 $/spool, implantation, rack multi-métiers, conformité 7D,
// tarifs réguliers, garantie) : aucun forfait, aucun montant dans les conditions.
// Rattachement provisoire aux offres existantes ; l'étape N4 crée les 4 offres définitives et rattache les forfaits.

const prefab = "service-prefabrication";
const sevenD = "service-bim-7d";

const pkg = (n: number, fields: Record<string, unknown>) => ({
  _id: `package-f-0${n}`,
  _type: "package",
  code: `F-0${n}`,
  visible: true,
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
    highlighted: true,
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
    service: ref(prefab),
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
    service: ref(prefab),
    price: 2800,
    scope: l("Une zone modélisée dans les deux disciplines", "One zone modelled in both disciplines"),
    leadTimeDays: 7,
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

// Valeurs manquantes marquées « (exemple) » : date limite et texte du bandeau, à confirmer par le client.
export const launchSettingsDoc = {
  _id: "launchSettings",
  _type: "launchSettings",
  bannerEnabled: false,
  bannerText: l("Forfaits de lancement pendant 60 jours (exemple)", "Launch packages for 60 days (example)"),
  taxNote: l("Prix en dollars canadiens, avant TPS et TVQ.", "Prices in Canadian dollars, before GST and QST."),
  creditText: l(
    "Le montant du forfait est déduit si vous commandez le reste du projet dans les 60 jours (exemple : 12 000 $ − 1 800 $ = 10 200 $).",
    "The package price is deducted if you order the rest of the project within 60 days (example: $12,000 − $1,800 = $10,200).",
  ),
  conditions: keyed([
    { title: l("Portée d'une zone pilote", "Pilot zone scope"), text: l("Jusqu'à 30 spools ou 150 m (500 pi) de tuyauterie, une discipline, supports et parasismique de la zone compris. Au-delà : sur soumission.", "Up to 30 spools or 150 m (500 ft) of piping, one discipline, including hangers and seismic bracing for the zone. Beyond that: on quote.") },
    { title: l("Portée gicleurs", "Sprinkler scope"), text: l("Un étage jusqu'à 10 000 pi². Au-delà : au nombre de têtes, sur soumission.", "One floor up to 10,000 sq. ft. Beyond that: by head count, on quote.") },
    { title: l("Crédit", "Credit"), text: l("Une seule fois, même client, nouvelle commande supérieure au montant du forfait. Non remboursable, non transférable.", "One time only, same client, for a new order larger than the package price. Non-refundable and non-transferable.") },
    { title: l("Documents requis", "Required documents"), text: l("Dessins d'atelier approuvés, modèle de l'ingénieur ou plans, fabricants retenus (raccords, vannes, supports) et standards de l'atelier. Pour la 7D : modèle, convention de codification et livrables de dessins d'atelier.", "Approved shop drawings, the engineer's model or drawings, selected manufacturers (fittings, valves, hangers) and shop standards. For 7D: the model, the coding convention and the shop drawing deliverables.") },
    { title: l("Délai", "Lead time"), text: l("5 jours ouvrables pour la zone pilote, le skid standard et les gicleurs, 7 pour l'offre combinée, à partir de documents complets.", "5 business days for the pilot zone, standard skid and sprinklers, 7 for the combined offer, from complete documents.") },
    { title: l("Révisions", "Revisions"), text: l("Une ronde de commentaires incluse. Modifications après approbation : 100 $/h, sur accord préalable.", "One round of comments included. Changes after approval: $100/h, by prior agreement.") },
    { title: l("Paiement", "Payment"), text: l("50 % à la commande, 50 % à la livraison, net 15 jours.", "50% at order, 50% on delivery, net 15 days.") },
    { title: l("Exclusions", "Exclusions"), text: l("Conception et calculs d'ingénierie (y compris parasismique), approbation, signature et sceau des dessins.", "Engineering design and calculations (including seismic), approval, signature and seal of the drawings.") },
  ]),
  professionalNote: l(
    "La conception, les calculs (y compris parasismique), l'approbation, la signature et le sceau des dessins restent à l'ingénieur ou à l'entrepreneur.",
    "Design, calculations (including seismic), approval, and the signature and seal of the drawings remain with the engineer or the contractor.",
  ),
};
