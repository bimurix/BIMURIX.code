import { block, keyed, l, titled } from "./helpers.mts";

// T2 (cahier v6 C-14) : « Pourquoi confier ce travail à Bimurix ». Six raisons tirées des faits déjà publiés
// (production et document v3.1) : aucun chiffre, aucun concurrent, aucune certification. Posée sur l'accueil (bande teintée)
// et en tête de la page À propos, où elle remplace « Notre positionnement en préfabrication » (mêmes faits).
const reasons = [
  titled(
    l("Les deux logiciels, un seul interlocuteur", "Both tools, one contact"),
    l("Tuyauterie dans SysQue et gicleurs dans AutoSPRINK, dans la même équipe.", "Piping in SysQue and sprinklers in AutoSPRINK, in the same team."),
  ),
  titled(
    l("Dessiné pour être fabriqué", "Drawn to be built"),
    l(
      "Notre expérience en construction modulaire guide le travail : ce qui est dessiné doit pouvoir se fabriquer, avec les pièces réelles du fabricant. Les tâches répétitives sont automatisées avec Dynamo et pyRevit.",
      "Our modular construction experience guides the work: what is drawn must be buildable, with the manufacturer's real parts. Repetitive tasks are automated with Dynamo and pyRevit.",
    ),
  ),
  titled(
    l("Un renfort quand vos dessinateurs sont débordés", "Extra capacity when your drafters are swamped"),
    l("Pour une zone, un étage ou un projet entier.", "For a zone, a floor or a whole project."),
  ),
  titled(
    l("Ici, dans le Grand Montréal", "Here, in Greater Montreal"),
    l("Un interlocuteur local, dans le même fuseau horaire que votre chantier.", "A local contact, in the same time zone as your site."),
  ),
  titled(l("En français et en anglais", "In French and in English"), l("Nous travaillons dans la langue de votre équipe.", "We work in your team's language.")),
  titled(
    l("Chacun son rôle, par écrit", "Each role in writing"),
    l("L'ingénieur conçoit et signe ; Bimurix modélise et dessine ; vous approuvez.", "The engineer designs and signs; Bimurix models and draws; you approve."),
  ),
];

export const whyBimurix = (band: boolean) =>
  block("pointsList", {
    heading: l("Pourquoi confier ce travail à Bimurix", "Why entrust this work to Bimurix"),
    layout: "columns",
    band,
    items: keyed(reasons),
  });
