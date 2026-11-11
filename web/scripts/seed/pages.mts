import { block, callCta, internalCta, keyed, l, pt, titled } from "./helpers.mts";
import { home } from "./pages-home.mts";

// N4 — À propos et soumission : positionnement du document v3.1 (EN : traduction à relire).
// Aucun membre d'équipe, client, certification ni affiliation (CLAUDE.md §4, ADR-006 n° 12).
const tb = (sheet: string) => ({ sheet, revision: "0", date: "2026-11" });

const about = {
  _id: "page-about",
  _type: "page",
  kind: "about",
  title: l("À propos", "About"),
  slug: l("a-propos", "about"),
  titleBlock: tb("A-100"),
  seo: {
    title: l("À propos de Bimurix | Préfabrication MEP et BIM", "About Bimurix | MEP prefabrication and BIM"),
    description: l(
      "Bimurix est un spécialiste BIM MEP et préfabrication, bilingue, avec une expérience en construction modulaire et un interlocuteur local dans le Grand Montréal.",
      "Bimurix is a bilingual BIM MEP and prefabrication specialist with modular construction experience and a local contact in Greater Montreal.",
    ),
  },
  sections: [
    block("heroSheet", {
      heading: l("Un spécialiste BIM MEP et préfabrication, ici, en français et en anglais.", "A BIM MEP and prefabrication specialist, right here, in French and English."),
      intro: l(
        "Bimurix prépare votre tuyauterie et vos gicleurs pour la fabrication en atelier, et vérifie les données de vos modèles pour l'exploitation. Notre expérience en construction modulaire guide notre façon de coordonner : ce qui est dessiné doit pouvoir se fabriquer.",
        "Bimurix prepares your piping and sprinklers for shop fabrication, and checks your model data for operations. Our modular construction experience shapes how we coordinate: what is drawn must be buildable.",
      ),
    }),
    block("richText", {
      heading: l("Ce que nous faisons", "What we do"),
      body: {
        fr: pt([
          ["normal", "Quatre offres, chacune avec un forfait d'entrée à prix fixe, un livrable clair et un délai. Vous achetez un résultat, pas des heures."],
          ["bullet", "Préfabrication de tuyauterie mécanique, avec SysQue"],
          ["bullet", "Préfabrication de gicleurs, avec AutoSPRINK"],
          ["bullet", "Tuyauterie et gicleurs coordonnés"],
          ["bullet", "BIM 7D : données d'exploitation et de maintenance"],
          ["h3", "Ce qui nous distingue"],
          ["bullet", "Une automatisation maison avec Dynamo et pyRevit, pour livrer plus vite"],
          ["bullet", "Un service bilingue, en français et en anglais"],
          ["bullet", "Un interlocuteur local, dans le Grand Montréal"],
          ["h3", "Ce qui reste à d'autres"],
          ["normal", "La conception, les calculs d'ingénierie (y compris parasismique), l'approbation, la signature et le sceau des dessins restent à l'ingénieur ou à l'entrepreneur."],
        ]),
        en: pt([
          ["normal", "Four offers, each with a fixed-price entry package, a clear deliverable and a lead time. You buy a result, not hours."],
          ["bullet", "Mechanical piping prefabrication, with SysQue"],
          ["bullet", "Sprinkler prefabrication, with AutoSPRINK"],
          ["bullet", "Coordinated piping and sprinklers"],
          ["bullet", "BIM 7D: operations and maintenance data"],
          ["h3", "What sets us apart"],
          ["bullet", "In-house automation with Dynamo and pyRevit, to deliver faster"],
          ["bullet", "Bilingual service, in French and in English"],
          ["bullet", "A local contact in Greater Montreal"],
          ["h3", "What stays with others"],
          ["normal", "Design, engineering calculations (including seismic), approval, and the signature and seal of the drawings remain with the engineer or the contractor."],
        ]),
      },
    }),
    block("pointsList", {
      heading: l("Notre approche", "Our approach"),
      layout: "columns",
      items: keyed([
        titled(l("Un forfait, un livrable, un délai", "One package, one deliverable, one lead time"), l("Le prix d'entrée est fixe et le délai est annoncé avant de commencer.", "The entry price is fixed and the lead time is stated before we start.")),
        titled(l("Ce qui est dessiné se fabrique", "What is drawn can be built"), l("Pièces réelles du fabricant, longueurs exactes et numéros de pièces pour l'approvisionnement.", "The manufacturer's real parts, exact lengths and part numbers for purchasing.")),
        titled(l("Conflits réglés avant la fabrication", "Clashes resolved before fabrication"), l("La coordination est prise en charge au modèle, pas sur le chantier.", "Coordination is handled in the model, not on site.")),
        titled(l("Un pilote qui se mesure", "A pilot you can measure"), l("Un bilan d'une page à la fin de la zone pilote : pourcentage préfabriqué, nombre de spools, heures de modélisation.", "A one-page summary at the end of the pilot zone: prefabricated percentage, number of spools, modelling hours.")),
      ]),
    }),
    block("quoteCta", { heading: l("Parlons de votre prochaine zone.", "Let's talk about your next zone."), button: callCta() }),
  ],
};

const quote = {
  _id: "page-quote",
  _type: "page",
  kind: "quote",
  title: l("Appel ou soumission", "Call or quote"),
  slug: l("soumission", "quote"),
  titleBlock: tb("A-900"),
  seo: {
    title: l("Réserver un appel ou demander une soumission | Bimurix", "Book a call or request a quote | Bimurix"),
    description: l(
      "Réservez un appel de 20 minutes ou demandez une soumission pour la préfabrication de tuyauterie, de gicleurs ou l'audit de données BIM 7D. Grand Montréal.",
      "Book a 20-minute call or request a quote for piping or sprinkler prefabrication or a BIM 7D data audit. Greater Montreal.",
    ),
  },
  sections: [
    block("heroSheet", {
      heading: l("Réservez un appel ou demandez une soumission.", "Book a call or request a quote."),
      intro: l(
        "Dites-nous ce que vous voulez préfabriquer ou faire vérifier. Une phrase suffit pour préparer l'appel.",
        "Tell us what you want prefabricated or checked. One sentence is enough to prepare the call.",
      ),
    }),
    block("quoteForm", {}),
  ],
};

const notFound = {
  _id: "page-not-found",
  _type: "page",
  kind: "notFound",
  title: l("Page introuvable", "Page not found"),
  titleBlock: tb("X-404"),
  seo: { noIndex: true },
  sections: [
    block("heroSheet", {
      heading: l("Cette feuille n'existe pas.", "This sheet doesn't exist."),
      intro: l("La page demandée a peut-être été déplacée ou renommée.", "The page you requested may have been moved or renamed."),
      ctas: keyed([internalCta(l("Retour à l'accueil", "Back to home"), "page-home")]),
    }),
  ],
};

export const pages = [home, about, quote, notFound];
