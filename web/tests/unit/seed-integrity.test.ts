import { describe, expect, it } from "vitest";
import { schemaTypes, singletonTypes } from "@/sanity/schemas";
import { formAndEmails } from "../../scripts/seed/form-and-emails.mts";
import { legalPages } from "../../scripts/seed/legal.mts";
import { launchSettingsDoc, packageDocs } from "../../scripts/seed/packages.mts";
import { pages } from "../../scripts/seed/pages.mts";
import { services1 } from "../../scripts/seed/services-1.mts";
import { services2 } from "../../scripts/seed/services-2.mts";
import { singletons } from "../../scripts/seed/singletons.mts";

type Doc = { _id: string; _type: string } & Record<string, unknown>;
const docs = [...singletons, ...formAndEmails, ...services1, ...services2, ...packageDocs, launchSettingsDoc, ...pages, ...legalPages] as Doc[];
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

  it("n'inclut aucun élément « hypothèse à valider » (ADR-006 n° 3)", () => {
    const text = JSON.stringify([...packageDocs, launchSettingsDoc]);
    for (const banned of ["60 $", "$60", "300 $", "3 900", "2 500", "Rack", "Implantation"]) expect(text, banned).not.toContain(banned);
  });

  it("donne un texte FR et EN à chaque forfait et à chaque condition", () => {
    const pairs = [...(packageDocs as unknown as Array<Record<string, { fr?: string; en?: string }>>).flatMap((p) => [p.title, p.scope]), ...launchSettingsDoc.conditions.flatMap((c) => [c.title, c.text])];
    for (const v of pairs) expect(v?.fr && v?.en).toBeTruthy();
  });
});
