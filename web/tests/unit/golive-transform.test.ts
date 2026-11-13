/* eslint-disable @typescript-eslint/no-explicit-any -- documents Sanity non typés (M1) */
import { describe, expect, it } from "vitest";
import { findPlaceholders } from "../../src/lib/placeholders.ts";
import { prepareProduction, PRODUCTION_DATE } from "../../scripts/lib/golive-transform.mts";

const p = (text: string) => ({ _type: "block", _key: "k", children: [{ _type: "span", _key: "s", text }] });
const docs = () => [
  { _id: "settings", _type: "settings", phone: "514 555-0199 (exemple)", legalName: "Bimurix inc. (exemple)", neq: "1234567890 (exemple)", email: "contact@bimurix.com" },
  { _id: "page-home", _type: "page", sections: [
    { _type: "projects", _key: "a", enabled: true, items: [{ _key: "i", title: { fr: "X (exemple)", en: "X (example)" }, badge: { fr: "Exemple — à remplacer", en: "Example — to be replaced" } }] },
    { _type: "proof", _key: "b", enabled: true },
  ] },
  { _id: "page-privacy", _type: "page", updatedLabel: { fr: "Dernière mise à jour : novembre 2026 (exemple)", en: "Last updated: November 2026 (example)" }, sections: [{ _type: "richText", _key: "r", body: {
    fr: [p("Ce texte décrit ce que le site fait aujourd'hui. Il doit être validé par un conseiller juridique avant la mise en ligne."),
      p("Bimurix (raison sociale et numéro d'entreprise du Québec : à compléter — exemple) est responsable des renseignements.")],
    en: [p("This text describes what the site does today. It must be validated by a legal adviser before launch."),
      p("Bimurix (legal name and Quebec enterprise number: to be completed — example) is responsible for the information.")],
  } }] },
  { _id: "page-terms", _type: "page", sections: [{ _type: "richText", _key: "r", body: {
    fr: [p("Ce texte décrit ce que le site fait aujourd'hui. Il doit être validé par un conseiller juridique avant la mise en ligne. Il ne remplace pas le contrat."),
      p("Questions : contact@bimurix.com. Les tribunaux du Québec sont compétents (à faire valider par un conseiller juridique).")],
    en: [p("This text describes what the site does today. It must be validated by a legal adviser before launch. It does not replace the contract."),
      p("Questions: contact@bimurix.com. The courts of Quebec have jurisdiction (to be validated by a legal adviser).")],
  } }] },
];

describe("prepareProduction", () => {
  it("ne laisse aucune valeur d'exemple", () => {
    const { docs: out } = prepareProduction(docs());
    expect(findPlaceholders(out)).toEqual([]);
  });
  it("retire téléphone, nom légal et NEQ, garde le courriel", () => {
    const s = prepareProduction(docs()).docs.find((d) => d._id === "settings")!;
    expect(s).not.toHaveProperty("phone");
    expect(s).not.toHaveProperty("legalName");
    expect(s).not.toHaveProperty("neq");
    expect(s.email).toBe("contact@bimurix.com");
  });
  it("coupe le bloc Projets et retire ses fiches, sans toucher aux autres blocs", () => {
    const home = prepareProduction(docs()).docs.find((d) => d._id === "page-home")!;
    const [projects, proof] = home.sections as any[];
    expect(projects.enabled).toBe(false);
    expect(projects.items).toEqual([]);
    expect(proof.enabled).toBe(true);
  });
  it("réécrit les pages légales FR et EN", () => {
    const out = prepareProduction(docs()).docs;
    const priv = out.find((d) => d._id === "page-privacy")! as any;
    expect(priv.updatedLabel).toEqual({ fr: "Dernière mise à jour : 13 novembre 2026", en: "Last updated: November 13, 2026" });
    expect(priv.sections[0].body.fr[0].children[0].text).toBe("Ce texte décrit ce que le site fait aujourd'hui.");
    expect(priv.sections[0].body.fr[1].children[0].text).toBe("Bimurix est responsable des renseignements.");
    expect(priv.sections[0].body.en[1].children[0].text).toBe("Bimurix is responsible for the information.");
    const terms = out.find((d) => d._id === "page-terms")! as any;
    expect(terms.sections[0].body.fr[0].children[0].text).toBe("Ce texte décrit ce que le site fait aujourd'hui. Il ne remplace pas le contrat.");
    expect(terms.sections[0].body.en[1].children[0].text).toBe("Questions: contact@bimurix.com. The courts of Quebec have jurisdiction.");
  });
  it("ne modifie pas l'entrée et journalise chaque changement", () => {
    const input = docs();
    const copy = JSON.parse(JSON.stringify(input));
    const { changes } = prepareProduction(input);
    expect(input).toEqual(copy);
    expect(changes.length).toBeGreaterThanOrEqual(10);
    expect(changes.every((c) => c.id && c.path && "before" in c && "after" in c)).toBe(true);
    expect(PRODUCTION_DATE.fr).toBe("13 novembre 2026");
  });
  it("est idempotente", () => {
    const once = prepareProduction(docs()).docs;
    const twice = prepareProduction(once);
    expect(twice.docs).toEqual(once);
    expect(twice.changes).toEqual([]);
  });
});
