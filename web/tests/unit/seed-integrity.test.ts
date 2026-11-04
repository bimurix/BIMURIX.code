import { describe, expect, it } from "vitest";
import { schemaTypes, singletonTypes } from "@/sanity/schemas";
import { formAndEmails } from "../../scripts/seed/form-and-emails.mts";
import { legalPages } from "../../scripts/seed/legal.mts";
import { pages } from "../../scripts/seed/pages.mts";
import { services1 } from "../../scripts/seed/services-1.mts";
import { services2 } from "../../scripts/seed/services-2.mts";
import { singletons } from "../../scripts/seed/singletons.mts";

type Doc = { _id: string; _type: string } & Record<string, unknown>;
const docs = [...singletons, ...formAndEmails, ...services1, ...services2, ...pages, ...legalPages] as Doc[];
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
});
