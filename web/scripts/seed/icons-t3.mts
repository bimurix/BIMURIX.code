// T3-A : quel symbole accompagne quelle ligne. Une seule table, lue par le seed (`documents.mts`) et par
// `scripts/patch-design-t3.mts`, pour que le contenu de départ et le dataset `development` disent la même chose.
// Les noms viennent de la liste fermée `src/lib/icon-names.ts` (le test `t3-icons.test.ts` le vérifie).
// Règle : un symbole déjà choisi dans Studio n'est jamais remplacé ; une ligne sans règle reste sans symbole.

type Rule = [pattern: RegExp, icon: string];
type Kind = "problems" | "why" | "deliverables" | "needs" | "steps" | "assurance";

/** Texte sans accent, en minuscules, apostrophes droites : les règles s'écrivent une fois. */
export const normalize = (text: string) => text.normalize("NFD").replace(/[̀-ͯ]/g, "").replace(/[’‘]/g, "'").toLowerCase();

const RULES: Record<Kind, Rule[]> = {
  problems: [
    [/croisent|conflit/, "conflit"],
    [/mesurer|couper sur place/, "chantier"],
    [/dessinateurs de gicleurs/, "tete-gicleur"],
    [/deux fournisseurs/, "interlocuteur"],
    [/plans de remise|ce qui a ete construit/, "tel-que-construit"],
    [/donnees d'equipements|proprietaire exige/, "fiche-equipement"],
  ],
  why: [
    [/deux logiciels|un seul interlocuteur/, "interlocuteur"],
    [/dessine pour etre fabrique/, "atelier"],
    [/renfort|debordes/, "dessin-atelier"],
    [/grand montreal/, "region"],
    [/francais et en anglais/, "courriel"],
    [/chacun son role/, "sceau"],
  ],
  deliverables: [
    [/rapport excel/, "donnee-manquante"],
    [/donnees d'actifs/, "fiche-equipement"],
    [/tel que construit/, "tel-que-construit"],
    [/dossier de remise/, "dossier-remise"],
    [/etiquette/, "etiquette"],
    [/tablette|plans couleur/, "tablette"],
    [/isometrique/, "isometrique"],
    [/parasismique/, "parasismique"],
    [/hauteurs de tiges|supports/, "support"],
    [/spool|assemblage/, "tuyau-spool"],
    [/listes? de coupe|materiel|nomenclatures/, "liste-coupe"],
    [/gicleurs/, "tete-gicleur"],
    [/conflit|probleme|reserves|a verifier|elements a corriger/, "conflit"],
    [/export pour l'atelier/, "atelier"],
    [/verification/, "liste-coupe"],
    [/federe|modele|export|fichier/, "modele-federe"],
    [/dessins? d'atelier|plans d'installation|vues/, "dessin-atelier"],
  ],
  needs: [
    [/releves/, "releve"],
    [/modifications approuvees/, "changement"],
    [/fabricants/, "vanne"],
    [/dessins d'atelier/, "dessin-atelier"],
    [/remise|formats de fichiers/, "dossier-remise"],
    [/convention|standards|nommage|exigences|regles de validation/, "codification"],
    [/grilles de suivi/, "liste-coupe"],
    [/type et le nombre|actifs/, "fiche-equipement"],
    [/corps de metier/, "interlocuteur"],
    [/echeancier/, "reponse"],
    [/qui approuve/, "sceau"],
    [/zone|etage|systemes a/, "local"],
    [/modele|plans/, "modele-federe"],
  ],
  steps: [
    [/demandez/, "courriel"],
    [/donnees manquantes/, "donnee-manquante"],
    [/integrons les changements/, "changement"],
    [/integrons les donnees/, "fiche-equipement"],
    [/exports|livrons|remettons|livrables/, "dossier-remise"],
    [/dessinons/, "dessin-atelier"],
    [/modelisons|produisons|coordonnons|mettons a jour/, "modele-federe"],
    [/verifions|controlons/, "oui"],
    [/inventorions/, "liste-coupe"],
    [/envoyez/, "dossier-remise"],
    [/clarifions|confirmons la portee/, "interlocuteur"],
    [/revoyons|definissons/, "codification"],
  ],
  assurance: [
    [/^reponse|^reply/, "reponse"],
    [/^ensuite|^next/, "interlocuteur"],
    [/^telephone|^phone/, "telephone"],
    [/^confidentialite|^privacy/, "sceau"],
  ],
};

export function iconFor(kind: Kind, french: string | undefined): string | undefined {
  const text = normalize(french ?? "");
  return RULES[kind].find(([pattern]) => pattern.test(text))?.[1];
}

/** Symbole de la ligne de chaque service (accueil) : l'objet du service en un coup d'œil. */
export const SERVICE_ICONS: Record<string, string> = {
  "service-modelisation": "modele-federe",
  "service-prefabrication": "tuyau-spool",
  "service-gicleurs": "tete-gicleur",
  "service-combinee": "conflit",
  "service-bim-7d": "fiche-equipement",
  "service-tqc": "tel-que-construit",
};

type Item = Record<string, unknown> & { _key?: string; icon?: string | null };
type Doc = Record<string, unknown> & { _id: string; _type: string };
export type IconSlot = { path: string; item: Item; icon: string };

const frOf = (item: Item) => {
  const named = (item.title ?? item.label) as { fr?: string } | undefined;
  return named?.fr ?? (item.fr as string | undefined);
};

/** Toutes les lignes d'un document qui n'ont pas encore de symbole mais en méritent un (avec leur chemin Sanity). */
export function iconSlots(doc: Doc): IconSlot[] {
  const slots: IconSlot[] = [];
  const scan = (items: unknown, base: string, kind: Kind) => {
    for (const item of (Array.isArray(items) ? items : []) as Item[]) {
      if (!item?._key || item.icon) continue;
      const icon = iconFor(kind, frOf(item));
      if (icon) slots.push({ path: `${base}[_key=="${item._key}"].icon`, item, icon });
    }
  };
  if (doc._type === "service") {
    scan(doc.needs, "needs", "needs");
    scan(doc.methodSteps, "methodSteps", "steps");
    scan(doc.deliverableRows, "deliverableRows", "deliverables");
  } else if (doc._type === "page") {
    for (const section of (doc.sections ?? []) as Array<Record<string, unknown> & { _key: string; _type: string }>) {
      const base = `sections[_key=="${section._key}"]`;
      if (section._type === "problems") scan(section.items, `${base}.items`, "problems");
      if (section._type === "pointsList") scan(section.items, `${base}.items`, "why");
      if (section._type === "deliverables") scan(section.items, `${base}.items`, "deliverables");
      if (section._type === "method") scan(section.steps, `${base}.steps`, "steps");
    }
  } else if (doc._type === "formSettings") {
    scan(doc.needsItems, "needsItems", "needs");
    scan(doc.assuranceRows, "assuranceRows", "assurance");
  }
  return slots;
}

/** Pose les symboles dans les documents de départ (le seed d'un dataset neuf les porte déjà). */
export function withIcons<T extends Doc>(docs: T[]): T[] {
  for (const doc of docs) {
    for (const slot of iconSlots(doc)) slot.item.icon = slot.icon;
    if (doc._type === "service" && !doc["cardIcon"] && SERVICE_ICONS[doc._id]) (doc as Record<string, unknown>)["cardIcon"] = SERVICE_ICONS[doc._id];
  }
  return docs;
}
