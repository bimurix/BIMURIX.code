import { createElement as h } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";
import { DeliverableRows } from "@/blocks/deliverables/DeliverableRows";
import { Problems } from "@/blocks/problems/Problems";
import { ProjectCycle } from "@/blocks/project-cycle/ProjectCycle";
import { ResponsibilityTable } from "@/blocks/responsibility-table/ResponsibilityTable";
import { Scenarios } from "@/blocks/scenarios/Scenarios";

const render = (el: React.ReactElement) => renderToStaticMarkup(el);
const quotePath = "/soumission";
const svc = (id: string, code: string, family?: string) => ({
  _id: id, _type: "service", code, network: "plumb" as const, family,
  title: { fr: `Titre ${code}`, en: `Title ${code}` }, shortTitle: { fr: `Court ${code}` },
  slug: { fr: `services/${id}`, en: `services/${id}-en` },
});

describe("Scenarios", () => {
  const item = { _key: "k1", title: { fr: "Trois modèles" }, situation: { fr: "La veille de la réunion." }, action: { fr: "Détecte les conflits." }, receive: { fr: "La liste." }, avoid: { fr: "Une surprise." }, service: svc("p01", "P-01") };

  it("ne rend rien sans situation", () => {
    expect(render(h(Scenarios, { data: { items: [] }, locale: "fr", ui: null }))).toBe("");
  });

  it("affiche titre, note fixe de secours, quatre cellules étiquetées et les liens du service", () => {
    const html = render(h(Scenarios, { data: { items: [item] }, locale: "fr", ui: null, quotePath }));
    expect(html).toContain("Situations types");
    expect(html).toContain("Elles ne décrivent pas un projet réel");
    for (const label of ["Situation", "Ce que fait Bimurix", "Ce que vous recevez", "Ce que ça évite"]) expect(html).toContain(label);
    expect(html).toContain('href="/services/p01"');
    expect(html).toContain("/soumission?service=p01");
  });

  it("utilise la note et le titre de Studio, et saute les cellules vides", () => {
    const html = render(h(Scenarios, { data: { heading: { fr: "Cas types" }, note: { fr: "Note du client" }, items: [{ ...item, avoid: undefined }] }, locale: "fr", ui: null }));
    expect(html).toContain("Cas types");
    expect(html).toContain("Note du client");
    expect(html).not.toContain("Ce que ça évite");
    expect(html).not.toContain("/soumission");
  });

  it("n'invente pas de texte anglais : la langue EN prend ses propres valeurs de secours", () => {
    const html = render(h(Scenarios, { data: { items: [{ ...item, title: { en: "Three models" } }] }, locale: "en", ui: null }));
    expect(html).toContain("Typical situations");
    expect(html).not.toContain("Trois modèles");
  });
});

describe("ResponsibilityTable", () => {
  const rows = [
    { _key: "a", label: { fr: "Conception et calculs" }, engineer: true },
    { _key: "b", label: { fr: "Détection de conflits" }, bimurix: true, contractor: true, contractorNote: { fr: "décide des corrections" } },
  ];

  it("rend un vrai tableau avec en-têtes, texte « Oui » et équivalent « Non » pour lecteurs d'écran", () => {
    const html = render(h(ResponsibilityTable, { data: { heading: { fr: "Qui fait quoi" }, rows, note: { fr: "La conception reste à l'ingénieur." } }, locale: "fr", ui: null }));
    expect(html).toContain("<table");
    expect(html).toContain('scope="col"');
    expect(html).toContain('scope="row"');
    expect(html).toContain("Oui");
    expect(html).toContain('<span class="sr-only">Non</span>');
    expect(html).toContain("décide des corrections");
    expect(html).toContain("La conception reste à l&#x27;ingénieur.");
    expect(html).toContain("Entrepreneur");
  });

  it("sans ligne, garde l'ancien rendu (titre et phrase) ; sans rien, ne rend rien", () => {
    const only = render(h(ResponsibilityTable, { data: { heading: { fr: "Responsabilités" }, rows: [], note: { fr: "Phrase." } }, locale: "fr", ui: null }));
    expect(only).not.toContain("<table");
    expect(only).toContain("Phrase.");
    expect(render(h(ResponsibilityTable, { data: { rows: [] }, locale: "fr", ui: null }))).toBe("");
  });
});

describe("Problems", () => {
  it("lie chaque problème aux services visibles qui ont une adresse dans la langue", () => {
    const data = { heading: { fr: "Les problèmes" }, items: [{ _key: "p", title: { fr: "Les tuyaux se croisent." }, text: { fr: "On règle au modèle." }, services: [svc("p01", "P-01"), { ...svc("x", "X-09"), slug: { fr: "services/x" } }] }] };
    const fr = render(h(Problems, { data, locale: "fr" }));
    expect(fr).toContain("Court P-01");
    expect(fr).toContain('href="/services/p01"');
    expect(render(h(Problems, { data: { items: [{ _key: "p", title: { en: "Pipes clash." }, services: [{ ...svc("x", "X-09"), slug: { fr: "services/x" } }] }] }, locale: "en" }))).not.toContain("<a ");
  });

  it("ne rend rien sans problème", () => {
    expect(render(h(Problems, { data: { heading: { fr: "Titre" }, items: [] }, locale: "fr" }))).toBe("");
  });
});

describe("ProjectCycle", () => {
  const services = [svc("p01", "P-01", "modeler"), svc("h02", "H-02", "prefabriquer"), svc("g03", "G-03", "prefabriquer"), svc("d05", "D-05", "livrer")];

  it("regroupe les stations par famille, avec lien et nom court", () => {
    const html = render(h(ProjectCycle, { data: { heading: { fr: "Où Bimurix intervient" }, summary: { fr: "Description du schéma." }, services }, locale: "fr", ui: null }));
    expect(html).toContain("Modéliser et coordonner");
    expect(html).toContain("Préfabriquer");
    expect(html).toContain("Livrer et exploiter");
    expect(html).toContain('href="/services/h02"');
    expect(html).toContain("Court G-03");
    expect(html).toContain('<figcaption class="sr-only">Description du schéma.</figcaption>');
    expect((html.match(/<a /g) ?? []).length).toBe(4);
  });

  it("sans famille : un seul groupe sans titre ; sans service : rien", () => {
    const html = render(h(ProjectCycle, { data: { services: services.map((s) => ({ ...s, family: undefined })) }, locale: "fr", ui: null }));
    expect(html).not.toContain("<h3");
    expect(render(h(ProjectCycle, { data: { services: [] }, locale: "fr", ui: null }))).toBe("");
  });
});

describe("DeliverableRows", () => {
  it("affiche chaque livrable avec son usage ; rien sans livrable", () => {
    const rows = [{ _key: "1", title: { fr: "Listes de coupe" }, purpose: { fr: "à couper et à commander les bonnes pièces" } }, { _key: "2", title: { fr: "Export" } }];
    const html = render(h(DeliverableRows, { heading: { fr: "Ce que vous recevez" }, rows, locale: "fr", ui: null }));
    expect(html).toContain("Listes de coupe");
    expect(html).toContain("À quoi ça sert");
    // S3b : l'étiquette est un en-tête de colonne, dit une seule fois quel que soit le nombre de livrables.
    expect((html.match(/À quoi ça sert/g) ?? []).length).toBe(1);
    expect(html).toContain('<th role="columnheader" scope="col"');
    expect(html).toContain("Livrable");
    expect(render(h(DeliverableRows, { rows: [], locale: "fr", ui: null }))).toBe("");
  });
});
