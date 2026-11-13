import { createElement as h } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";
import type { Shell } from "@/sanity/types-content";
import { ServicePage, type ServiceDoc } from "@/ui/patterns/ServicePage";

const quotePage = { _type: "page", kind: "quote", slug: { fr: "soumission", en: "quote" } };
const shell: Shell = { ui: { responsibilities: { fr: "Qui fait quoi" }, forWhom: { fr: "Pour qui" } }, quotePage, services: [] };
const render = (doc: ServiceDoc) => renderToStaticMarkup(h(ServicePage, { doc, locale: "fr", shell }));

// Un service tel que les documents actuels le décrivent : aucun des nouveaux champs.
const legacy: ServiceDoc = {
  _id: "svc-h02", code: "H-02", network: "plumb", title: { fr: "Tuyauterie" },
  heroHeading: { fr: "Fabriquez en atelier." }, heroIntro: { fr: "Intro." },
  audience: { fr: "Entrepreneurs." },
  offeringsHeading: { fr: "Ce que couvre l'offre" }, offerings: [{ _key: "o", title: { fr: "Skids" }, text: { fr: "Pompes." } }],
  deliverablesHeading: { fr: "Livrables" }, deliverables: [{ _key: "d", fr: "Spools" }],
  responsibilityNote: { fr: "L'ingénieur signe." },
  ctaHeading: { fr: "Prêt ?" }, ctaButton: { label: { fr: "Demander une soumission" }, link: { kind: "internal", internal: quotePage, serviceId: "svc-h02" } },
};

describe("ServicePage : documents actuels", () => {
  const html = render(legacy);
  it("garde les sections actuelles", () => {
    for (const text of ["Fabriquez en atelier.", "Pour qui", "Skids", "Spools", "Qui fait quoi", "L&#x27;ingénieur signe.", "Prêt ?"]) expect(html).toContain(text);
  });
  it("n'affiche aucune des nouvelles sections quand leurs champs sont vides", () => {
    for (const text of ["Situations types", "Ce qu&#x27;il faut nous envoyer", "Questions sur ce service", "À quoi ça sert", "<table", "Voir le service"]) expect(html).not.toContain(text);
  });
});

describe("ServicePage : nouveaux champs", () => {
  const doc: ServiceDoc = {
    ...legacy,
    quoteButtonLabel: { fr: "Demander une soumission de tuyauterie" },
    scenarios: [{ _key: "s", title: { fr: "Des dessins qui ne se fabriquent pas" }, situation: { fr: "L'atelier n'a pas de longueurs." } }],
    deliverableRows: [{ _key: "r", title: { fr: "Listes de coupe" }, purpose: { fr: "à couper les bonnes pièces" } }],
    needs: [{ _key: "n", fr: "Les dessins approuvés" }],
    responsibilityRows: [{ _key: "q", label: { fr: "Conception" }, engineer: true }],
    faq: [{ _key: "f", question: { fr: "Faut-il SysQue ?" }, answer: { fr: "Non." } }],
  };
  const html = render(doc);

  it("affiche les nouvelles sections dans l'ordre du plan (P3, P4, P5, P6, P8, P10, P11)", () => {
    const order = ["Des dessins qui ne se fabriquent pas", "Skids", "Listes de coupe", "Les dessins approuvés", "<table", "Faut-il SysQue ?", "Prêt ?"].map((t) => html.indexOf(t));
    expect(order.every((i) => i >= 0)).toBe(true);
    expect([...order].sort((a, b) => a - b)).toEqual(order);
  });

  it("remplace la liste simple des livrables par les livrables avec usage", () => {
    expect(html).not.toContain("Spools");
    expect(html).toContain("à couper les bonnes pièces");
  });

  it("répète « Demander une soumission » avec le libellé du service (haut, lien sous les situations, appel final)", () => {
    expect((html.match(/Demander une soumission de tuyauterie/g) ?? []).length).toBe(2);
    expect(html).toContain("Demander une soumission pour une situation comme celle-ci");
    expect(html).toContain("/soumission?service=svc-h02");
  });
});
