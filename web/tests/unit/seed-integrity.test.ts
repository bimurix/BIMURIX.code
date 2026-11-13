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

  it("garde les 5 forfaits d'entrée dans Studio, masqués du site (ADR-008), avec prix fixe et une offre existante", () => {
    const pkgs = docs.filter((d) => d._type === "package");
    expect(pkgs.map((p) => p.price)).toEqual([1800, 2200, 1500, 2800, 1200]);
    for (const p of pkgs) {
      expect(p.visible).toBe(false);
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

  it("le BIM 7D garde ses faits d'origine (en 9 blocs) et ceux du v3.1", () => {
    const d = docs.find((x) => x._id === "service-bim-7d") as Doc;
    const titles = (d.offerings as Array<{ title: { fr: string } }>).map((o) => o.title.fr);
    for (const t of ["Structuration des paramètres", "Contrôle de complétude", "Préparation à la remise et à l'exploitation-maintenance", "Audit des données", "Codification des équipements", "Robinets", "Lien avec les dessins d'atelier", "Local de chaque élément"]) {
      expect(titles, t).toContain(t);
    }
    expect((d.heroHeading as { fr: string }).fr).toBe("Des données d'équipements complètes à la remise du bâtiment.");
  });

  it("aucune mention d'un appel de 20 minutes dans le contenu du site (ADR-007)", () => {
    const reserved = ["formSettings", "emailTemplates"]; // appartiennent à la révision du formulaire (R2)
    const text = JSON.stringify(docs.filter((d) => !reserved.includes(d._id)));
    expect(text).not.toMatch(/20 minutes|20-minute|appel de 20|book a (20-minute )?call|réserver un appel|réservez un appel/i);
  });

  // S3b : le schéma du cycle (H4) est fondu dans la section des services (H3) ; l'accueil compte onze sections.
  it("accueil : onze sections dans l'ordre du plan v5 (§ 2b), sans forfaits ni conditions, preuve limitée aux 2 chiffres sourcés", () => {
    const home = docs.find((d) => d.kind === "home") as unknown as { sections: Array<{ _type: string } & Record<string, unknown>> };
    expect(home.sections.map((x) => x._type)).toEqual([
      "heroSheet", "problems", "serviceNetworks", "deliverables", "scenarios", "proof", "responsibilityTable", "method", "pointsList", "faq", "quoteCta",
    ]);
    const proof = home.sections.find((x) => x._type === "proof") as Record<string, unknown>;
    expect((proof.figures as Array<{ value: string }>).map((f) => f.value)).toEqual(["≈ 90 %", "≈ 15 %"]);
    expect(proof.sourceUrl).toBe("https://www.casestudies.com/company/trimble-mep/case-study/15-cost-savings-with-streamlined-bim-workflow");
    expect(proof.sourceName).toBeTruthy();
    expect(JSON.stringify(home)).not.toMatch(/718|même méthode|same method/);
    const scenarios = home.sections.find((x) => x._type === "scenarios") as unknown as { items: unknown[]; note: { fr: string } };
    expect(scenarios.items).toHaveLength(3);
    expect(scenarios.note.fr).toMatch(/situations types, pas des projets réalisés/);
  });

  it("coordonnées et lancement (ADR-006 n° 13 à 18)", () => {
    const settings = docs.find((d) => d._id === "settings") as Record<string, unknown>;
    expect(settings.email).toBe("contact@bimurix.com");
    for (const k of ["phone", "neq", "legalName"]) expect(settings[k], k).toBeUndefined();
    expect(settings.serviceArea).toEqual({ fr: "Grand Montréal", en: "Greater Montreal" });
    expect(settings.privacyOfficer).toBe("Fondateur de Bimurix");
    expect(launchSettingsDoc.bannerEnabled).toBe(false);
    expect("deadline" in launchSettingsDoc).toBe(false);
    // ADR-008 : ni crédit, ni conditions de paiement, ni taux horaire.
    expect(JSON.stringify(launchSettingsDoc)).not.toMatch(/100 \$|net 15|50 %|credit|crédit|60 jours|60 days/i);
  });

  it("n'inclut aucun élément « hypothèse à valider » (ADR-006 n° 3)", () => {
    const hidden = ["page-terms", "page-privacy"];
    const text = JSON.stringify(docs.filter((d) => d._type !== "redirect" && !hidden.includes(d._id)));
    const banned = [/60 \$/, /\$60/, /300 \$/, /3 900/, /2 500/, /3 300/, /\brack/i, /implantation/i, /garantie de correction|correction guarantee|free correction/i, /\$ par spool|\$ per spool|\$\/spool/i];
    for (const re of banned) expect(text, String(re)).not.toMatch(re);
  });

  it("donne un texte FR et EN à chaque forfait (le code des forfaits reste)", () => {
    const pairs = (packageDocs as unknown as Array<Record<string, { fr?: string; en?: string }>>).flatMap((p) => [p.title, p.scope]);
    for (const v of pairs) expect(v?.fr && v?.en).toBeTruthy();
  });

  it("Loi 96 : chaque champ { fr, en } rempli dans une langue l'est dans les deux", () => {
    const missing: string[] = [];
    const walk = (v: unknown, path: string) => {
      if (Array.isArray(v)) return v.forEach((x, i) => walk(x, `${path}[${i}]`));
      if (!v || typeof v !== "object") return;
      const o = v as Record<string, unknown>;
      const keys = Object.keys(o);
      if (keys.length && keys.every((k) => k === "fr" || k === "en") && typeof (o.fr ?? o.en) === "string") {
        if (!o.fr || !o.en) missing.push(path);
        return;
      }
      for (const [k, x] of Object.entries(o)) walk(x, `${path}.${k}`);
    };
    for (const d of docs.filter((x) => !["page-privacy", "page-terms"].includes(x._id))) walk(d, d._id);
    expect(missing).toEqual([]);
  });

  it("ADR-008 : aucune page ni aucun service ne publie de prix, de forfait, de délai fixe ni de condition de paiement", () => {
    const shown = docs.filter((d) => ["page", "service", "navigation", "footer", "settings"].includes(d._type) && !["page-privacy", "page-terms"].includes(d._id));
    const all = JSON.stringify(shown);
    const text = all.replace(/un jour ouvrable|one business day/g, "");
    const banned = [/\d\s?\$/, /\$\s?\d/, /forfait/i, /fixed[- ]price|launch package|choose this package|packages for this offer/i, /F-0\d/, /jours? ouvrables?/, /business days?/, /60 jours/, /60 days/, /net 15/i, /100 \$/, /Choisir ce/i, /lancement|launch/i];
    for (const re of banned) expect(text, String(re)).not.toMatch(re);
    // Le délai de réponse est le seul engagement de délai : « un jour ouvrable » / « one business day ».
    expect(all).toMatch(/un jour ouvrable/);
  });

  it("six services : famille, nom court, situations types, livrables avec usage, besoins, qui fait quoi, FAQ, bouton propre, mention de l'ingénieur", () => {
    const shown = docs.filter((d) => d._type === "service");
    expect(shown.map((d) => d.family)).toEqual(["modeler", "prefabriquer", "prefabriquer", "prefabriquer", "livrer", "livrer"]);
    const pair = (v: unknown) => v as { fr?: string; en?: string } | undefined;
    for (const d of shown) {
      expect(pair(d.shortTitle)?.fr && pair(d.shortTitle)?.en, `${d._id}.shortTitle`).toBeTruthy();
      expect(pair(d.quoteButtonLabel)?.fr, d._id).toMatch(/^Demander une soumission/);
      expect(d.heroCta, d._id).toBeUndefined();
      expect(d.deliverables, d._id).toBeUndefined();
      expect((d.scenarios as unknown[]).length, d._id).toBe(2);
      expect(JSON.stringify(d.scenarios), d._id).toMatch(/Situation type 1/);
      expect((d.deliverableRows as Array<{ purpose: unknown }>).every((r) => r.purpose), d._id).toBe(true);
      expect((d.needs as unknown[]).length, d._id).toBeGreaterThanOrEqual(4);
      expect((d.responsibilityRows as unknown[]).length, d._id).toBeGreaterThanOrEqual(2);
      expect((d.faq as unknown[]).length, d._id).toBeGreaterThanOrEqual(3);
      expect(JSON.stringify(d.responsibilityRows), d._id).toMatch(/Conception et calculs/);
      expect(d.heroImage, d._id).toBeUndefined(); // les images viennent de S3b
    }
    // Preuve J.M. Brennan : tuyauterie et tuyauterie + gicleurs seulement, source et lien présents.
    expect(shown.filter((d) => d.proof).map((d) => d._id)).toEqual(["service-prefabrication", "service-combinee"]);
    for (const d of shown.filter((x) => x.proof)) expect((d.proof as { sourceUrl: string }).sourceUrl).toMatch(/^https:\/\/www\.casestudies\.com\//);
  });

  it("Soumission : encart « Ce qu'il faut nous envoyer » et accusé avec le délai de réponse ; À propos : tableau « Qui fait quoi »", () => {
    const form = docs.find((d) => d._id === "formSettings") as Doc;
    expect((form.needsItems as unknown[]).length).toBeGreaterThanOrEqual(4);
    expect(JSON.stringify(form.successBody)).toMatch(/un jour ouvrable/);
    const mail = docs.find((d) => d._id === "emailTemplates") as Doc;
    expect(JSON.stringify(mail.ackBody)).toMatch(/un jour ouvrable/);
    expect(JSON.stringify(mail.ackBody)).not.toMatch(/forfait|package/i);
    const about = docs.find((d) => d.kind === "about") as unknown as { sections: Array<{ _type: string; note?: { fr: string } }> };
    const table = about.sections.find((x) => x._type === "responsibilityTable");
    expect(table?.note?.fr).toMatch(/ingénieur ou à l'entrepreneur/);
  });
});
