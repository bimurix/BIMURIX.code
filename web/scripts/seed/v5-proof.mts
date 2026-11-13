import { keyed, l } from "./helpers.mts";

/** Preuve d'un tiers (ADR-006 n° 21) : 2 chiffres, avec le nom et le lien de la source. Accueil, tuyauterie, tuyauterie + gicleurs. */
export const brennanProof = () => ({
  enabled: true,
  heading: l("Ce que donne la préfabrication, selon un entrepreneur", "What prefabrication delivers, according to one contractor"),
  intro: l("Un exemple publié par un tiers, pour situer ce que la préfabrication permet.", "An example published by a third party, to show what prefabrication makes possible."),
  figures: keyed([
    { value: "≈ 90 %", label: l("de préfabrication", "prefabricated") },
    { value: "≈ 15 %", label: l("d'économies globales", "in overall savings") },
  ]),
  attribution: l(
    "Résultats publiés par l'entrepreneur J.M. Brennan, avec SysQue. Ce ne sont pas des résultats de Bimurix.",
    "Results published by contractor J.M. Brennan, using SysQue. These are not Bimurix results.",
  ),
  sourceName: "Étude de cas Trimble MEP",
  sourceNameEn: "Trimble MEP case study",
  sourceUrl: "https://www.casestudies.com/company/trimble-mep/case-study/15-cost-savings-with-streamlined-bim-workflow",
});
