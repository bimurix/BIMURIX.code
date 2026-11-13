/* eslint-disable @typescript-eslint/no-explicit-any -- documents Sanity non typés (M1) */
/**
 * M1 — transformations de mise en ligne (fonction pure, sans accès réseau ni écriture).
 * Entrée : documents du dataset `development` ; sortie : documents prêts pour `production` + journal des changements.
 * Décisions du client (2026-11-13) : valeurs d'exemple non publiées, section Projets coupée, pages légales sans mention de validation.
 */
import { findPlaceholders } from "../../src/lib/placeholders.ts";

export type Doc = { _id: string; _type: string; [k: string]: any };
export type Change = { id: string; path: string; before: unknown; after: unknown; kind: "vidé" | "coupé" | "légal" };
export const PRODUCTION_DATE = { fr: "13 novembre 2026", en: "November 13, 2026" };

/** [avant, après] appliqués dans l'ordre, par sous-chaîne, au texte des pages légales. */
const LEGAL_REWRITES: Array<[string, string]> = [
  [" Il doit être validé par un conseiller juridique avant la mise en ligne.", ""],
  [" It must be validated by a legal adviser before launch.", ""],
  ["Bimurix (raison sociale et numéro d'entreprise du Québec : à compléter — exemple) est", "Bimurix est"],
  ["Bimurix (legal name and Quebec enterprise number: to be completed — example) is", "Bimurix is"],
  [" (lieux exacts à confirmer — exemple)", "; les lieux exacts dépendent de chaque fournisseur"],
  [" (exact locations to be confirmed — example)", "; the exact locations depend on each provider"],
  [" (30 jours — exemple, à confirmer)", ""],
  [" (30 days — example, to be confirmed)", ""],
  [" (à faire valider par un conseiller juridique)", ""],
  [" (to be validated by a legal adviser)", ""],
];
const SETTINGS_EMPTY = ["phone", "legalName", "neq"];
const LEGAL_IDS = ["page-privacy", "page-terms"];

export function prepareProduction(input: Doc[]): { docs: Doc[]; changes: Change[] } {
  const docs: Doc[] = JSON.parse(JSON.stringify(input));
  const changes: Change[] = [];

  for (const d of docs) {
    if (d._id === "settings") {
      for (const k of SETTINGS_EMPTY) {
        if (typeof d[k] === "string" && findPlaceholders({ [k]: d[k] }).length) {
          changes.push({ id: d._id, path: k, before: d[k], after: null, kind: "vidé" });
          delete d[k];
        }
      }
    }
    if (d._id === "page-home") {
      (d.sections ?? []).forEach((s: any, i: number) => {
        if (s._type !== "projects" || !findPlaceholders(s).length) return;
        if (s.enabled !== false) changes.push({ id: d._id, path: `sections[${i}].enabled`, before: s.enabled ?? null, after: false, kind: "coupé" });
        (s.items ?? []).forEach((it: any, j: number) =>
          changes.push({ id: d._id, path: `sections[${i}].items[${j}]`, before: it.title?.fr ?? "(fiche)", after: "(fiche retirée)", kind: "coupé" }));
        s.enabled = false;
        s.items = [];
      });
    }
    if (LEGAL_IDS.includes(d._id)) legal(d, changes);
  }
  return { docs, changes };
}

function legal(d: Doc, changes: Change[]) {
  if (d.updatedLabel && findPlaceholders({ u: d.updatedLabel }).length) {
    const after = { fr: `Dernière mise à jour : ${PRODUCTION_DATE.fr}`, en: `Last updated: ${PRODUCTION_DATE.en}` };
    for (const l of ["fr", "en"] as const)
      changes.push({ id: d._id, path: `updatedLabel.${l}`, before: d.updatedLabel[l], after: after[l], kind: "légal" });
    d.updatedLabel = { ...d.updatedLabel, ...after };
  }
  (d.sections ?? []).forEach((s: any, i: number) => {
    for (const lang of Object.keys(s.body ?? {})) {
      (s.body[lang] ?? []).forEach((block: any, b: number) =>
        (block.children ?? []).forEach((c: any, k: number) => {
          if (typeof c.text !== "string") return;
          let t = c.text;
          for (const [from, to] of LEGAL_REWRITES) t = t.replace(from, to);
          if (t === c.text) return;
          changes.push({ id: d._id, path: `sections[${i}].body.${lang}[${b}].children[${k}].text`, before: c.text, after: t, kind: "légal" });
          c.text = t;
        }));
    }
  });
}
