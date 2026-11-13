import { createElement as h } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";
import { CompanySheet } from "@/blocks/company-sheet/CompanySheet";
import { groupItems, PointsList } from "@/blocks/points-list/PointsList";
import { Projects } from "@/blocks/projects/Projects";
import { QuoteCta } from "@/blocks/quote-cta/QuoteCta";
import { QuoteAssurance } from "@/blocks/quote-form/QuoteAssurance";
import { ResponsibilityTable } from "@/blocks/responsibility-table/ResponsibilityTable";
import { Scenarios } from "@/blocks/scenarios/Scenarios";
import { ICON_NAMES } from "@/lib/icon-names";
import { schemaTypes } from "@/sanity/schemas";
import { buildFormModel } from "@/ui/patterns/quote-form/form-model";
import { seedDocuments } from "../../scripts/seed/documents.mts";

type Doc = { _id: string; _type: string } & Record<string, unknown>;
type Sec = { _type: string } & Record<string, unknown>;
const docs = seedDocuments as unknown as Doc[];
const page = (kind: string) => docs.find((d) => d.kind === kind) as unknown as { sections: Sec[] };
const render = (el: React.ReactElement) => renderToStaticMarkup(el);
const text = (v: unknown) => JSON.stringify(v);

describe("T2 — contenu de départ (cahier v6)", () => {
  const home = page("home");
  const section = (type: string) => home.sections.find((s) => s._type === type) as Sec;

  it("accueil : nouveau titre, accroche courte, ligne de réassurance (C-10 à C-12)", () => {
    const hero = section("heroSheet") as unknown as { heading: { fr: string; en: string }; intro: { fr: string; en: string }; specialties: { fr: string; en: string } };
    expect(hero.heading.fr).toBe("Des modèles BIM qui se fabriquent. Moins de surprises au chantier.");
    expect(hero.heading.en).toBe("BIM models you can build from. Fewer surprises on site.");
    expect(hero.intro.fr).toMatch(/^Bimurix modélise, coordonne et dessine la mécanique du bâtiment/);
    expect(hero.specialties.fr).toBe("Réponse d'ici un jour ouvrable · Grand Montréal · Français et anglais");
  });

  it("« Pourquoi Bimurix » : six raisons, fond teinté, aucun chiffre (C-14)", () => {
    const why = section("pointsList") as unknown as { items: unknown[]; band: boolean; layout: string };
    expect(why.items).toHaveLength(6);
    expect(why.band).toBe(true);
    // Les clés techniques (_key) contiennent des chiffres : on ne regarde que le texte des raisons.
    expect(text((why.items as Array<{ title: unknown; text: unknown }>).map((i) => [i.title, i.text]))).not.toMatch(/\d/);
    expect(text(why)).toMatch(/Dynamo et pyRevit/);
  });

  it("projets : trois fiches marquées « Exemple — à remplacer », sans client, lieu, chiffre ni image (C-16, V-18)", () => {
    const projects = section("projects") as unknown as { enabled: boolean; items: Array<Record<string, unknown>> };
    expect(projects.enabled).toBe(true);
    expect(projects.items).toHaveLength(3);
    for (const item of projects.items) {
      expect(text(item.badge)).toContain("Exemple — à remplacer");
      expect(text(item.badge)).toContain("Example — to be replaced");
      expect(text(item.title)).toMatch(/\(exemple\)/);
      expect(text(item.title)).toMatch(/\(example\)/);
      expect(Object.keys(item).filter((k) => !k.startsWith("_")).sort()).toEqual(["badge", "delivered", "discipline", "title", "tools"]);
    }
  });

  it("situations et « Qui fait quoi » en version courte ; « Ce qu'il faut nous envoyer » retiré de l'accueil (C-15, C-18, C-19)", () => {
    expect((section("scenarios") as unknown as { short: boolean }).short).toBe(true);
    const table = section("responsibilityTable") as unknown as { short: boolean; shortRows: Array<{ title: { fr: string } }>; note: { fr: string }; rows: Array<{ label: { fr: string } }> };
    expect(table.short).toBe(true);
    expect(table.shortRows.map((r) => r.title.fr)).toEqual(["Bimurix", "L'ingénieur", "L'entrepreneur"]);
    expect(table.note.fr).toBe("La conception, les calculs (y compris parasismique), l'approbation, la signature et le sceau des dessins restent à l'ingénieur ou à l'entrepreneur.");
    // Tableau complet : les lignes de Bimurix d'abord.
    expect(table.rows[0].label.fr).toMatch(/^Modèles/);
    expect(home.sections.filter((s) => s._type === "pointsList")).toHaveLength(1);
  });

  it("FAQ de l'accueil : onze questions au plus, avec les trois nouvelles (C-20)", () => {
    const faq = section("faq") as unknown as { items: Array<{ question: { fr: string } }> };
    expect(faq.items).toHaveLength(11);
    expect(faq.items.map((i) => i.question.fr)).toEqual(expect.arrayContaining(["Travaillez-vous en anglais ?", "Pouvez-vous prendre une seule zone ou un seul étage ?", "Comment envoyer les plans et les modèles ?"]));
  });

  it("preuve : phrase d'introduction, attribution à un tiers conservée (C-17)", () => {
    const proof = section("proof") as unknown as { intro: { fr: string }; attribution: { fr: string } };
    expect(proof.intro.fr).toBe("Un exemple publié par un tiers, pour situer ce que la préfabrication permet.");
    expect(proof.attribution.fr).toContain("Ce ne sont pas des résultats de Bimurix.");
  });

  it("titres : pas de point final sur un titre qui n'est pas une phrase (C-22)", () => {
    const headings = home.sections.map((s) => (s.heading as { fr: string } | undefined)?.fr ?? "");
    for (const h of ["Qui fait quoi", "Comment se déroule un mandat", "Six services, du modèle à l'exploitation"]) expect(headings).toContain(h);
  });

  it("À propos : ordre du cahier (C-31), fiche « L'entreprise » sans fondateur (C-32), gestes (C-33)", () => {
    const about = page("about");
    expect(about.sections.map((s) => s._type)).toEqual(["heroSheet", "pointsList", "companySheet", "pointsList", "serviceNetworks", "responsibilityTable", "quoteCta"]);
    const company = about.sections[2] as Record<string, unknown>;
    for (const k of ["founderName", "founderPhoto", "founderNote"]) expect(company[k], k).toBeUndefined();
    expect(text(about.sections[3])).toContain("La portée est écrite avant de commencer");
    expect((about.sections[5] as { short?: boolean }).short).toBeFalsy();
    expect(text(about.sections[0])).toContain("Un spécialiste BIM de la mécanique du bâtiment et de la préfabrication, dans le Grand Montréal.");
  });

  it("soumission : titre, encart renommé, budget masqué, réassurance en nomenclature (C-40 à C-43)", () => {
    const hero = page("quote").sections[0] as unknown as { heading: { fr: string; en: string } };
    expect(hero.heading).toEqual({ fr: "Demandez votre soumission.", en: "Request your quote." });
    const form = docs.find((d) => d._id === "formSettings") as Doc;
    expect(form.showBudget).toBe(false);
    expect((form.needsHeading as { fr: string }).fr).toBe("Utile, si vous l'avez sous la main");
    expect((form.assuranceRows as Array<{ source: string }>).map((r) => r.source)).toEqual(["text", "text", "phone", "privacy"]);
  });

  it("404 : titre d'onglet et lien vers la soumission (C-44)", () => {
    const nf = docs.find((d) => d.kind === "notFound") as unknown as { seo: { title: { fr: string; en: string } }; sections: Array<{ ctas: unknown[] }> };
    expect(nf.seo.title.fr).toBe("Page introuvable | Bimurix");
    expect(nf.sections[0].ctas).toHaveLength(2);
  });

  it("lexique : « robinet » une seule fois dans le contenu public ; « mandate » absent de l'anglais (C-29, C-45)", () => {
    const pub = docs.filter((d) => !["page-privacy", "page-terms", "formSettings", "emailTemplates"].includes(d._id) && d._type !== "package");
    expect(text(pub).match(/robinet/gi)).toHaveLength(1);
    const en: string[] = [];
    const walk = (v: unknown) => {
      if (Array.isArray(v)) v.forEach(walk);
      else if (v && typeof v === "object") {
        const o = v as Record<string, unknown>;
        if (typeof o.en === "string") en.push(o.en);
        Object.values(o).forEach(walk);
      }
    };
    walk(pub);
    expect(en.filter((t) => /mandate/i.test(t))).toEqual([]);
  });

  it("services : phrases de confiance, groupes de prestations, titre G-03, intro P-01 (C-25 à C-28)", () => {
    const svc = (id: string) => docs.find((d) => d._id === id) as Doc;
    expect(text(svc("service-bim-7d").pledge)).toContain("Les données manquantes sont signalées, jamais inventées.");
    expect(text(svc("service-tqc").pledge)).toContain("Un élément n'est jamais présenté comme vérifié sur chantier sans les données qui le prouvent.");
    expect(text(svc("service-bim-7d").heroIntro)).not.toContain("jamais inventées");
    const groups = (id: string) => (svc(id).offerings as Array<{ group?: { fr: string } }>).flatMap((o) => (o.group ? [o.group.fr] : []));
    expect(groups("service-prefabrication")).toEqual(["Réseaux", "Pièces et supports", "Vérifications"]);
    expect(groups("service-bim-7d")).toEqual(["Vérifier", "Structurer", "Préparer la remise"]);
    expect((svc("service-gicleurs").heroHeading as { fr: string }).fr).toBe("Vos dessins d'atelier de gicleurs, quand vos dessinateurs manquent.");
    expect(text(svc("service-modelisation").heroIntro)).toContain("Avant chaque réunion de coordination, vous recevez la liste des conflits");
  });

  it("aucun « gratuit » ni « sans engagement » dans le contenu public (C-21)", () => {
    const pub = docs.filter((d) => !["page-privacy", "page-terms"].includes(d._id));
    expect(text(pub)).not.toMatch(/gratuit|sans engagement|free of charge|no[- ]obligation|obligation-free/i);
  });
});

describe("T2 — champs préparés pour T3 : liste fermée de symboles", () => {
  const iconValues = (field: { options?: { list?: Array<{ value: string }> } }) => (field.options?.list ?? []).map((o) => o.value);
  const fieldsOf = (name: string) => (schemaTypes.find((t) => t.name === name) as unknown as { fields: Array<{ name: string; options?: { list?: Array<{ value: string }> } }> }).fields;

  it("`icon` existe, vide, avec les mêmes noms, sur les lignes de problèmes, livrables, points, étapes, besoins et réassurance", () => {
    const problemItem = (fieldsOf("problems").find((f) => f.name === "items") as unknown as { of: Array<{ fields: Array<{ name: string; options?: { list?: Array<{ value: string }> } }> }> }).of[0].fields;
    const lists = [problemItem, fieldsOf("deliverableRow"), fieldsOf("localeStringIcon")].map((fields) => iconValues(fields.find((f) => f.name === "icon") as never));
    for (const list of lists) expect(list).toEqual([...ICON_NAMES]);
    // « points-list » et « method » partagent titledText (même membre).
    const items = (fieldsOf("pointsList").find((f) => f.name === "items") as unknown as { of: Array<{ fields: Array<{ name: string }> }> }).of[0].fields;
    expect(items.map((f) => f.name)).toContain("icon");
    expect(ICON_NAMES.length).toBeGreaterThanOrEqual(34);
    expect(new Set(ICON_NAMES).size).toBe(ICON_NAMES.length);
  });

  // T3 a choisi les symboles (scripts/seed/icons-t3.mts) : tous viennent de la liste fermée.
  it("tout symbole du contenu de départ appartient à la liste fermée", () => {
    const found = [...text(docs).matchAll(/"(?:icon|cardIcon)":"([^"]+)"/g)].map((m) => m[1]);
    expect(found.length).toBeGreaterThan(20);
    for (const name of found) expect(ICON_NAMES as readonly string[], name).toContain(name);
  });
});

describe("T2 — rendu des blocs", () => {
  const ui = null;
  const project = { _key: "p1", title: { fr: "Immeuble (exemple)" }, badge: { fr: "Exemple — à remplacer" }, delivered: [{ _key: "d1", fr: "Dessins" }], tools: { fr: "AutoSPRINK" } };

  it("projets : interrupteur coupé = section absente ; pastille et liste affichées ; pas de client ni de lieu", () => {
    expect(render(h(Projects, { data: { enabled: false, items: [project] }, locale: "fr", ui }))).toBe("");
    expect(render(h(Projects, { data: { items: [] }, locale: "fr", ui }))).toBe("");
    const html = render(h(Projects, { data: { enabled: true, heading: { fr: "Projets" }, note: { fr: "Fiches d'exemple" }, items: [project] }, locale: "fr", ui }));
    expect(html).toContain("Exemple — à remplacer");
    expect(html).toContain("Immeuble (exemple)");
    expect(html).toContain("<ol");
    expect(html).not.toContain("<img");
  });

  it("promesse sous le bouton, en FR et en EN ; téléphone d'exemple en texte simple, sans lien tel:", () => {
    const button = { label: { fr: "Demander une soumission", en: "Request a quote" }, style: "primary" as const, link: { kind: "external" as const, external: "/soumission" } };
    const fr = render(h(QuoteCta, { data: { heading: { fr: "Envoyez" }, button }, locale: "fr", ui, phone: "514 555-0199 (exemple)" }));
    expect(fr).toContain("Nous vous répondons d&#x27;ici un jour ouvrable.");
    expect(fr).toContain("Ou appelez le");
    expect(fr).toContain("514 555-0199 (exemple)");
    expect(fr).not.toContain("tel:");
    const en = render(h(QuoteCta, { data: { heading: { en: "Send" }, button }, locale: "en", ui, phone: "514 555-0199 (exemple)" }));
    expect(en).toContain("We reply within one business day.");
    expect(en).toContain("Or call");
    expect(en).not.toMatch(/gratuit|free|sans engagement|no obligation/i);
  });

  it("téléphone vide = pas de ligne « Ou appelez » ; téléphone réel = lien tel: ; réglage coupé = rien", () => {
    const button = { label: { fr: "Demander" }, style: "primary" as const, link: { kind: "external" as const, external: "/soumission" } };
    expect(render(h(QuoteCta, { data: { heading: { fr: "X" }, button }, locale: "fr", ui, phone: "" }))).not.toContain("Ou appelez");
    expect(render(h(QuoteCta, { data: { heading: { fr: "X" }, button }, locale: "fr", ui, phone: "514 555-1234" }))).toContain('href="tel:5145551234"');
    expect(render(h(QuoteCta, { data: { heading: { fr: "X" }, button, showPhone: false }, locale: "fr", ui, phone: "514 555-1234" }))).not.toContain("Ou appelez");
  });

  it("fiche « L'entreprise » : valeur d'exemple en texte simple ; champs vides invisibles ; fondateur absent tant que vide", () => {
    const settings = { email: "contact@bimurix.com", phone: "514 555-0199 (exemple)", legalName: "Bimurix inc. (exemple)", neq: "1234567890 (exemple)", serviceArea: { fr: "Grand Montréal" } };
    const html = render(h(CompanySheet, { data: { heading: { fr: "L'entreprise" }, languages: { fr: "Français, anglais" }, responsible: { fr: "Fondateur" } }, locale: "fr", ui, settings }));
    for (const v of ["Bimurix inc. (exemple)", "1234567890 (exemple)", "514 555-0199 (exemple)", "Français, anglais", "Fondateur", "mailto:contact@bimurix.com"]) expect(html).toContain(v);
    expect(html).not.toContain("tel:");
    const empty = render(h(CompanySheet, { data: { heading: { fr: "L'entreprise" } }, locale: "fr", ui, settings: { email: "contact@bimurix.com" } }));
    expect(empty).not.toContain("Nom légal");
    expect(empty).not.toContain("Téléphone");
    expect(render(h(CompanySheet, { data: {}, locale: "fr", ui, settings: null }))).toBe("");
  });

  it("réassurance : téléphone d'exemple en texte simple, ligne absente sans téléphone, lien vers la politique", () => {
    const rows = [
      { _key: "a", label: { fr: "Réponse" }, text: { fr: "d'ici un jour ouvrable" }, source: "text" as const },
      { _key: "b", label: { fr: "Téléphone" }, source: "phone" as const },
      { _key: "c", label: { fr: "Confidentialité" }, text: { fr: "vos renseignements servent seulement à traiter votre demande" }, source: "privacy" as const },
    ];
    const withPhone = render(h(QuoteAssurance, { data: { rows }, locale: "fr", phone: "514 555-0199 (exemple)", privacyHref: "/confidentialite", privacyLabel: "Politique de confidentialité" }));
    expect(withPhone).toContain("514 555-0199 (exemple)");
    expect(withPhone).not.toContain("tel:");
    expect(withPhone).toContain('href="/confidentialite"');
    const noPhone = render(h(QuoteAssurance, { data: { rows }, locale: "fr", phone: "", privacyHref: null, privacyLabel: "x" }));
    expect(noPhone).not.toContain("Téléphone");
  });

  it("situations en version courte : situation et ce que vous recevez seulement, une seule note", () => {
    const item = { _key: "k", title: { fr: "Trois modèles" }, situation: { fr: "La veille." }, action: { fr: "Détecte." }, receive: { fr: "La liste." }, avoid: { fr: "Une surprise." } };
    const html = render(h(Scenarios, { data: { short: true, items: [item] }, locale: "fr", ui }));
    expect(html).toContain("Ce que vous recevez");
    expect(html).not.toContain("Ce que fait Bimurix");
    expect(html).not.toContain("Ce que ça évite");
    expect(html.match(/pas un projet réel/g)).toHaveLength(1);
  });

  it("« Qui fait quoi » en version courte : trois lignes, phrase d'origine, lien « Voir le détail »", () => {
    const data = {
      heading: { fr: "Qui fait quoi" },
      short: true,
      shortRows: [{ _key: "1", title: { fr: "Bimurix" }, text: { fr: "Modèles." } }, { _key: "2", title: { fr: "L'ingénieur" }, text: { fr: "Conception." } }],
      note: { fr: "Conception, signature et sceau à l'ingénieur." },
      detailLink: { label: { fr: "Voir le détail" }, link: { kind: "external" as const, external: "/a-propos" } },
      rows: [{ _key: "r", label: { fr: "Ligne du tableau" }, bimurix: true }],
    };
    const html = render(h(ResponsibilityTable, { data, locale: "fr", ui }));
    expect(html).not.toContain("<table");
    expect(html).toContain("<dl");
    expect(html).toContain("Conception, signature et sceau à l&#x27;ingénieur.");
    expect(html).toContain('href="/a-propos"');
    expect(render(h(ResponsibilityTable, { data: { ...data, short: false }, locale: "fr", ui }))).toContain("<table");
  });

  it("prestations : sous-titres de groupe quand il y en a, sinon rendu d'avant", () => {
    const items = [
      { _key: "1", title: { fr: "A" }, text: { fr: "a" }, group: { fr: "Réseaux" } },
      { _key: "2", title: { fr: "B" }, text: { fr: "b" } },
      { _key: "3", title: { fr: "C" }, text: { fr: "c" }, group: { fr: "Vérifications" } },
    ];
    expect(groupItems(items, "fr").map((g) => [g.title, g.items.length])).toEqual([["Réseaux", 2], ["Vérifications", 1]]);
    const html = render(h(PointsList, { data: { heading: { fr: "Ce que nous faisons" }, layout: "columns", items }, locale: "fr" }));
    expect(html).toContain("Réseaux");
    expect(html).toContain("Vérifications");
    const plain = render(h(PointsList, { data: { heading: { fr: "X" }, layout: "columns", items: items.map((i) => ({ _key: i._key, title: i.title, text: i.text })) }, locale: "fr" }));
    expect(plain).not.toContain("<h4");
  });

  it("budget : masqué par défaut (réglage Studio), de retour quand showBudget est vrai", () => {
    const content = (showBudget?: boolean) => ({ form: { showBudget, budgets: [{ value: "b1", label: { fr: "Moins de 5 000 $" } }] } }) as unknown as Parameters<typeof buildFormModel>[0];
    expect(buildFormModel(content(), "fr").showBudget).toBe(false);
    expect(buildFormModel(content(false), "fr").showBudget).toBe(false);
    expect(buildFormModel(content(true), "fr").showBudget).toBe(true);
  });
});
