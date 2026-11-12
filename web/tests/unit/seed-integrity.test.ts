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

  it("affiche 6 services complets en FR et EN, dans l'ordre d'affichage (ADR-007)", () => {
    const services = docs.filter((d) => d._type === "service");
    const shown = services.filter((d) => d.visible !== false).sort((a, b) => (a.order as number) - (b.order as number));
    expect(shown.map((d) => d._id)).toEqual(["service-modelisation", "service-prefabrication", "service-gicleurs", "service-combinee", "service-bim-7d", "service-tqc"]);
    expect(services.filter((d) => d.visible === false)).toEqual([]);
    expect(new Set(shown.map((d) => d.order)).size).toBe(6);
    expect(new Set(shown.map((d) => d.code)).size).toBe(6);
    expect(shown.map((d) => d.code)).toEqual(["P-01", "H-02", "G-03", "C-04", "D-05", "Q-06"]);
    // Adresses d'origine conservées pour les services d'origine.
    const slug = (id: string) => (shown.find((d) => d._id === id)?.slug as { fr: string; en: string });
    expect(slug("service-modelisation")).toEqual({ fr: "services/modelisation-bim-coordination", en: "services/bim-modeling-coordination" });
    expect(slug("service-tqc")).toEqual({ fr: "services/tqc-controle-qualite", en: "services/as-built-quality-control" });
    expect(slug("service-bim-7d")).toEqual({ fr: "services/bim-7d-donnees-actifs", en: "services/bim-7d-asset-data" });
    const pair = (v: unknown) => (v as { fr?: string; en?: string } | undefined);
    for (const d of shown) {
      for (const f of ["title", "slug", "heroHeading", "heroIntro", "audience", "responsibilityNote", "ctaHeading", "ctaText"]) expect(pair(d[f])?.fr && pair(d[f])?.en, `${d._id}.${f}`).toBeTruthy();
      expect(/seo/.test(JSON.stringify(Object.keys(d))), d._id).toBe(true);
      expect(JSON.stringify(d.responsibilityNote), d._id).toMatch(/ing[ée]nieur|engineer/);
    }
    expect(new Set(shown.map((d) => (d.slug as { fr: string }).fr)).size).toBe(6);
  });

  it("n'attache aucun forfait à la modélisation ni au TQC (aucun n'existe pour ces services)", () => {
    const pkgs = docs.filter((d) => d._type === "package").map((p) => (p.service as { _ref: string })._ref);
    expect(pkgs).not.toContain("service-modelisation");
    expect(pkgs).not.toContain("service-tqc");
  });

  it("le BIM 7D garde son contenu d'origine et y ajoute les éléments du v3.1", () => {
    const d = docs.find((x) => x._id === "service-bim-7d") as Doc;
    const titles = (d.offerings as Array<{ title: { fr: string } }>).map((o) => o.title.fr);
    for (const t of ["Structuration des paramètres", "Contrôle de complétude", "Préparation à l'exploitation-maintenance", "Audit des données", "Codification des équipements", "Numérotation des robinets", "Fonction et position des robinets", "Lien avec les dessins d'atelier", "Local de chaque élément"]) {
      expect(titles, t).toContain(t);
    }
    expect((d.heroHeading as { fr: string }).fr).toBe("Des données BIM organisées pour faciliter la livraison du bâtiment.");
  });

  it("aucune mention d'un appel de 20 minutes dans le contenu du site (ADR-007)", () => {
    const reserved = ["formSettings", "emailTemplates"]; // appartiennent à la révision du formulaire (R2)
    const text = JSON.stringify(docs.filter((d) => !reserved.includes(d._id)));
    expect(text).not.toMatch(/20 minutes|20-minute|appel de 20|book a (20-minute )?call|réserver un appel|réservez un appel/i);
  });

  it("accueil : sections d'origine dans leur ordre, ajouts intégrés, preuve limitée aux 2 chiffres sourcés (ADR-006 n° 21)", () => {
    const home = docs.find((d) => d.kind === "home") as unknown as { sections: Array<{ _type: string } & Record<string, unknown>> };
    const types = home.sections.map((x) => x._type).filter((t) => t !== "serviceNetworks");
    expect(types).toEqual(["heroSheet", "richText", "packages", "conditions", "proof", "pointsList", "method", "pointsList", "pointsList", "faq", "quoteCta", "quoteCta"]);
    // Les sections d'origine restent dans l'ordre d'origine (production).
    const heading = (s: Record<string, unknown>) => (s.heading as { fr?: string } | undefined)?.fr;
    expect(home.sections.map((s) => heading(s)).filter((h) => h && !/forfait|Conditions|selon un entrepreneur|Inclus pour|Questions fréquentes|Commencez/.test(h))).toEqual([
      "Des modèles BIM fiables. Une construction mieux préparée.", "Le BIM doit servir le chantier, pas seulement le modèle.", "Nos services", "Une méthode claire, du besoin au livrable.",
      "Une approche axée sur la qualité des livrables.", "Un soutien BIM adapté aux équipes de construction.", "Une expertise BIM orientée vers les besoins réels du projet.", "Parlons de votre prochain projet.",
    ]);
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
    const hidden = ["page-terms", "page-privacy"];
    const text = JSON.stringify(docs.filter((d) => d._type !== "redirect" && !hidden.includes(d._id)));
    const banned = [/60 \$/, /\$60/, /300 \$/, /3 900/, /2 500/, /3 300/, /\brack/i, /implantation/i, /garantie de correction|correction guarantee|free correction/i, /\$ par spool|\$ per spool|\$\/spool/i];
    for (const re of banned) expect(text, String(re)).not.toMatch(re);
  });

  it("donne un texte FR et EN à chaque forfait et à chaque condition", () => {
    const pairs = [...(packageDocs as unknown as Array<Record<string, { fr?: string; en?: string }>>).flatMap((p) => [p.title, p.scope]), ...launchSettingsDoc.conditions.flatMap((c) => [c.title, c.text])];
    for (const v of pairs) expect(v?.fr && v?.en).toBeTruthy();
  });
});
