import { describe, expect, it } from "vitest";
import { schemaTypes, singletonTypes } from "@/sanity/schemas";
import { seedDocuments } from "../../scripts/seed/documents.mts";
import { launchSettingsDoc, packageDocs } from "../../scripts/seed/packages.mts";

type Doc = { _id: string; _type: string } & Record<string, unknown>;
const docs = seedDocuments as unknown as Doc[];
const ids = new Set(docs.map((d) => d._id));

function collectRefs(value: unknown, out: string[] = []): string[] {
  if (Array.isArray(value)) value.forEach((v) => collectRefs(v, out));
  else if (value && typeof value === "object") {
    const obj = value as Record<string, unknown>;
    if (obj._type === "reference" && typeof obj._ref === "string") out.push(obj._ref);
    Object.values(obj).forEach((v) => collectRefs(v, out));
  }
  return out;
}

function arraysWithoutKeys(value: unknown, path = "", out: string[] = []): string[] {
  if (Array.isArray(value)) {
    value.forEach((item, i) => {
      if (item && typeof item === "object" && !("_key" in item)) out.push(`${path}[${i}]`);
      arraysWithoutKeys(item, `${path}[${i}]`, out);
    });
  } else if (value && typeof value === "object") {
    for (const [k, v] of Object.entries(value)) arraysWithoutKeys(v, `${path}.${k}`, out);
  }
  return out;
}

describe("contenu de départ Sanity", () => {
  it("a des identifiants uniques", () => {
    expect(ids.size).toBe(docs.length);
  });

  it("n'utilise que des types de documents déclarés dans le schéma", () => {
    const declared = new Set<string>(schemaTypes.map((t) => t.name));
    for (const doc of docs) expect(declared.has(doc._type), doc._type).toBe(true);
  });

  it("contient chaque document unique sous son identifiant fixe", () => {
    for (const type of singletonTypes) expect(docs.find((d) => d._id === type)?._type).toBe(type);
  });

  it("ne référence que des documents existants", () => {
    for (const doc of docs) for (const target of collectRefs(doc)) expect(ids.has(target), `${doc._id} → ${target}`).toBe(true);
  });

  it("donne un _key à chaque élément d'objet dans les tableaux", () => {
    for (const doc of docs) expect(arraysWithoutKeys(doc), doc._id).toEqual([]);
  });

  it("a exactement une page d'accueil et une page 404", () => {
    expect(docs.filter((d) => d.kind === "home")).toHaveLength(1);
    expect(docs.filter((d) => d.kind === "notFound")).toHaveLength(1);
  });

  it("contient les 5 forfaits d'entrée, visibles, avec prix fixe et une offre existante", () => {
    const pkgs = docs.filter((d) => d._type === "package");
    expect(pkgs.map((p) => p.price)).toEqual([1800, 2200, 1500, 2800, 1200]);
    for (const p of pkgs) {
      expect(p.visible).toBe(true);
      expect(p.priceMode).toBe("fixed");
      expect(docs.find((d) => d._id === (p.service as { _ref: string })._ref)?._type).toBe("service");
    }
    expect(new Set(pkgs.map((p) => p.code)).size).toBe(5);
    expect(pkgs.filter((p) => p.highlighted)).toHaveLength(1);
  });

  it("rattache chaque forfait à la bonne offre et ne met en avant que l'offre combinée", () => {
    const byCode = (c: string) => docs.find((d) => d._type === "package" && d.code === c) as Doc;
    const svc = (c: string) => (byCode(c).service as { _ref: string })._ref;
    expect([svc("F-01"), svc("F-02"), svc("F-03"), svc("F-04"), svc("F-05")]).toEqual(["service-prefabrication", "service-prefabrication", "service-gicleurs", "service-combinee", "service-bim-7d"]);
    expect(byCode("F-04").leadTimeDays).toBe(7);
    expect(docs.filter((d) => d._type === "package" && d.highlighted).map((d) => d.code)).toEqual(["F-04"]);
  });

  it("affiche 4 offres complètes en FR et EN et masque les 2 anciennes", () => {
    const services = docs.filter((d) => d._type === "service");
    const shown = services.filter((d) => d.visible !== false);
    expect(shown.map((d) => d._id)).toEqual(["service-prefabrication", "service-gicleurs", "service-combinee", "service-bim-7d"]);
    expect(services.filter((d) => d.visible === false).map((d) => d._id).sort()).toEqual(["service-modelisation", "service-tqc"]);
    const pair = (v: unknown) => (v as { fr?: string; en?: string } | undefined);
    for (const d of shown) {
      for (const f of ["title", "slug", "heroHeading", "heroIntro", "audience", "responsibilityNote", "ctaHeading", "ctaText"]) expect(pair(d[f])?.fr && pair(d[f])?.en, `${d._id}.${f}`).toBeTruthy();
      expect(/seo/.test(JSON.stringify(Object.keys(d))), d._id).toBe(true);
      expect(JSON.stringify(d.responsibilityNote), d._id).toMatch(/ing[ée]nieur|engineer/);
    }
    expect(new Set(shown.map((d) => (d.slug as { fr: string }).fr)).size).toBe(4);
  });

  it("accueil : sections dans l'ordre, preuve limitée aux 2 chiffres sourcés (ADR-006 n° 21)", () => {
    const home = docs.find((d) => d.kind === "home") as unknown as { sections: Array<{ _type: string } & Record<string, unknown>> };
    const types = home.sections.map((x) => x._type).filter((t) => t !== "serviceNetworks");
    expect(types).toEqual(["heroSheet", "proof", "packages", "conditions", "pointsList", "method", "faq", "quoteCta"]);
    const proof = home.sections.find((x) => x._type === "proof") as Record<string, unknown>;
    expect((proof.figures as Array<{ value: string }>).map((f) => f.value)).toEqual(["≈ 90 %", "≈ 15 %"]);
    expect(proof.sourceUrl).toBe("https://www.casestudies.com/company/trimble-mep/case-study/15-cost-savings-with-streamlined-bim-workflow");
    expect(JSON.stringify(home)).not.toMatch(/718|même méthode|same method/);
  });

  it("coordonnées et lancement (ADR-006 n° 13 à 18)", () => {
    const settings = docs.find((d) => d._id === "settings") as Record<string, unknown>;
    expect(settings.email).toBe("contact@bimurix.com");
    for (const k of ["phone", "neq", "legalName"]) expect(settings[k], k).toBeUndefined();
    expect(settings.serviceArea).toEqual({ fr: "Grand Montréal", en: "Greater Montreal" });
    expect(settings.privacyOfficer).toBe("Fondateur de Bimurix");
    expect(launchSettingsDoc.bannerEnabled).toBe(true);
    expect(launchSettingsDoc.bannerText).toEqual({ fr: "Forfaits de lancement à prix fixe", en: "Fixed-price launch packages" });
    expect("deadline" in launchSettingsDoc).toBe(false);
  });

  it("n'inclut aucun élément « hypothèse à valider » (ADR-006 n° 3)", () => {
    const hidden = ["service-modelisation", "service-tqc", "page-terms", "page-privacy"];
    const text = JSON.stringify(docs.filter((d) => d._type !== "redirect" && !hidden.includes(d._id)));
    const banned = [/60 \$/, /\$60/, /300 \$/, /3 900/, /2 500/, /3 300/, /\brack/i, /implantation/i, /garantie|guarantee/i, /\$ par spool|\$ per spool|\$\/spool/i];
    for (const re of banned) expect(text, String(re)).not.toMatch(re);
  });

  it("donne un texte FR et EN à chaque forfait et à chaque condition", () => {
    const pairs = [...(packageDocs as unknown as Array<Record<string, { fr?: string; en?: string }>>).flatMap((p) => [p.title, p.scope]), ...launchSettingsDoc.conditions.flatMap((c) => [c.title, c.text])];
    for (const v of pairs) expect(v?.fr && v?.en).toBeTruthy();
  });
});
