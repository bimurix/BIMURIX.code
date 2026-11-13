import { describe, expect, it } from "vitest";
import { breadcrumbsFor, cleanJsonLd, faqLd, organizationLd, serviceLd, websiteLd } from "@/lib/jsonld";
import type { Shell } from "@/sanity/types-content";

const shell = {
  settings: {
    siteName: "Bimurix", email: "contact@bimurix.com", phone: "514 555-0100 (exemple)", legalName: "Bimurix inc. (exemple)", neq: "1234567890",
    descriptor: { fr: "Services BIM", en: "BIM services" }, serviceArea: { fr: "Grand Montréal", en: "Greater Montréal" },
    logo: { asset: { url: "https://cdn.sanity.io/images/p/d/logo.svg" } },
  },
  ui: { services: { fr: "Services", en: "Services" } },
  home: { title: { fr: "Accueil", en: "Home" } },
} as unknown as Shell;
const service = {
  _type: "service", slug: { fr: "services/prefabrication-tuyauterie", en: "services/pipe-prefabrication" },
  title: { fr: "Dessins d'atelier de tuyauterie", en: "Pipe shop drawings" }, shortTitle: { fr: "Tuyauterie", en: "Piping" },
  heroIntro: { fr: "Nous dessinons.", en: "We draw." },
};

describe("T6-A données structurées", () => {
  it("cleanJsonLd retire les valeurs nulles, vides et d'exemple", () => {
    expect(cleanJsonLd({ "@type": "X", a: null, b: "", c: "555-01", d: ["ok", "(exemple)"], e: { f: undefined } })).toEqual({ "@type": "X", d: ["ok"] });
  });

  it("l'organisation n'a ni champ nul ni valeur d'exemple (téléphone, nom légal, NEQ)", () => {
    const json = JSON.stringify(organizationLd(shell, "fr"));
    expect(json).not.toContain("null");
    expect(json).not.toMatch(/555-01|1234567890|\(exemple\)/);
    expect(json).toContain("ProfessionalService");
    expect(json).toContain("fr-CA");
    expect(json).toContain("en-CA");
  });

  it("l'organisation garde téléphone, nom légal et NEQ quand ils sont réels", () => {
    const real = { settings: { ...shell!.settings, phone: "+1 514 555 0199", legalName: "Bimurix inc.", neq: "1177654321" } } as unknown as Shell;
    const json = JSON.stringify(organizationLd(real, "en"));
    expect(json).toContain("+1 514 555 0199");
    expect(json).toContain("Bimurix inc.");
    expect(json).toContain("1177654321");
  });

  it("jamais d'adresse postale, de note, d'avis ni de prix", () => {
    const all = JSON.stringify([organizationLd(shell, "fr"), websiteLd(shell, "fr"), serviceLd(service, shell, "fr")]);
    expect(all).not.toMatch(/PostalAddress|aggregateRating|Review|offers|price/i);
  });

  it("le service pointe vers l'organisation et porte le nom complet, sans prix", () => {
    const fr = serviceLd(service, shell, "fr") as Record<string, unknown>;
    expect(fr).toMatchObject({ "@type": "Service", name: "Dessins d'atelier de tuyauterie", serviceType: "Tuyauterie", provider: { "@id": "https://bimurix.com/#organization" }, areaServed: "Grand Montréal" });
    expect(fr.url).toBe("https://bimurix.com/services/prefabrication-tuyauterie");
    const en = serviceLd(service, shell, "en") as Record<string, unknown>;
    expect(en.url).toBe("https://bimurix.com/en/services/pipe-prefabrication");
    expect(en.name).toBe("Pipe shop drawings");
  });

  it("un service sans adresse dans la langue n'a pas de données structurées", () => {
    expect(serviceLd({ ...service, slug: { fr: "services/x" } }, shell, "en")).toBeUndefined();
  });

  it("la FAQ reprend mot pour mot les textes affichés et ignore les entrées incomplètes", () => {
    const items = [
      { question: { fr: "Combien de temps ?", en: "How long?" }, answer: { fr: "Un jour ouvrable.", en: "One business day." } },
      { question: { fr: "Sans réponse", en: "No answer" }, answer: { fr: "", en: "" } },
    ];
    const fr = faqLd(items, "fr") as { mainEntity: Array<{ name: string; acceptedAnswer: { text: string } }> };
    expect(fr.mainEntity).toEqual([{ "@type": "Question", name: "Combien de temps ?", acceptedAnswer: { "@type": "Answer", text: "Un jour ouvrable." } }]);
    expect(faqLd([], "fr")).toBeUndefined();
  });

  it("fil d'Ariane : Accueil › Services › service, puis Accueil › page, dernier maillon sans adresse", () => {
    const crumbs = breadcrumbsFor(service, shell, "en") as { itemListElement: Array<{ name: string; position: number; item?: string }> };
    expect(crumbs.itemListElement.map((c) => c.name)).toEqual(["Home", "Services", "Pipe shop drawings"]);
    expect(crumbs.itemListElement.map((c) => c.position)).toEqual([1, 2, 3]);
    expect(crumbs.itemListElement[0].item).toBe("https://bimurix.com/en");
    expect(crumbs.itemListElement[2].item).toBeUndefined();
    const page = breadcrumbsFor({ _type: "page", slug: { fr: "a-propos" }, title: { fr: "À propos" } }, shell, "fr") as typeof crumbs;
    expect(page.itemListElement.map((c) => c.name)).toEqual(["Accueil", "À propos"]);
    expect(breadcrumbsFor({ _type: "page", kind: "home", slug: {}, title: { fr: "Accueil" } }, shell, "fr")).toBeUndefined();
  });
});
