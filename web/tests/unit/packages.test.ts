import { describe, expect, it } from "vitest";
import { formatPrice, isVisible, visiblePackages, type PackageData } from "@/lib/packages/packages";
import { canShowProof } from "@/lib/packages/proof";

const plain = (s: string) => s.replace(/\s/g, " ");

describe("formatPrice", () => {
  it("formate en français : « 1 800 $ »", () => {
    expect(plain(formatPrice(1800, "fixed", "fr")?.amount ?? "")).toBe("1 800 $");
  });
  it("formate en anglais : « $1,800 »", () => {
    expect(formatPrice(1800, "fixed", "en")?.amount).toBe("$1,800");
  });
  it("n'affiche aucun montant en mode « sur soumission », même avec un prix saisi", () => {
    expect(formatPrice(1800, "quote", "fr")).toBeNull();
    expect(formatPrice(1800, "quote", "en")).toBeNull();
  });
  it("marque le mode « à partir de »", () => {
    expect(formatPrice(2500, "from", "en")).toEqual({ amount: "$2,500", from: true });
  });
  it("n'affiche rien si le prix manque ou n'est pas un nombre", () => {
    expect(formatPrice(undefined, "fixed", "fr")).toBeNull();
    expect(formatPrice(Number.NaN, "fixed", "fr")).toBeNull();
  });
  it("traite un mode absent comme un prix fixe", () => {
    expect(formatPrice(1200, undefined, "en")?.amount).toBe("$1,200");
  });
});

describe("isVisible", () => {
  it("compte un document sans champ « visible » comme visible", () => {
    expect(isVisible({})).toBe(true);
    expect(isVisible({ visible: null })).toBe(true);
    expect(isVisible({ visible: true })).toBe(true);
  });
  it("masque seulement quand visible est faux", () => {
    expect(isVisible({ visible: false })).toBe(false);
  });
});

describe("visiblePackages", () => {
  const pkg = (code: string, extra: Partial<PackageData> = {}): PackageData => ({ _id: code, code, order: 1, service: { visible: true }, ...extra });
  it("retire un forfait masqué", () => {
    expect(visiblePackages([pkg("F-01"), pkg("F-02", { visible: false })]).map((p) => p.code)).toEqual(["F-01"]);
  });
  it("retire un forfait dont l'offre est masquée", () => {
    const list = [pkg("F-01", { service: { visible: false } }), pkg("F-02", { service: { visible: true } }), pkg("F-03", { service: null })];
    expect(visiblePackages(list).map((p) => p.code)).toEqual(["F-02"]);
  });
  it("trie par ordre puis par code", () => {
    const list = [pkg("F-03", { order: 3 }), pkg("F-02", { order: 1 }), pkg("F-01", { order: 1 })];
    expect(visiblePackages(list).map((p) => p.code)).toEqual(["F-01", "F-02", "F-03"]);
  });
});

describe("canShowProof", () => {
  const ok = { enabled: true, sourceName: "Étude de cas", sourceUrl: "https://example.com/etude" };
  it("rend le bloc quand il est activé et que la source est complète", () => {
    expect(canShowProof(ok)).toBe(true);
  });
  it("ne rend rien si le bloc est désactivé", () => {
    expect(canShowProof({ ...ok, enabled: false })).toBe(false);
    expect(canShowProof({ ...ok, enabled: undefined })).toBe(false);
  });
  it("ne rend rien sans lien, avec un lien invalide ou non http(s)", () => {
    expect(canShowProof({ ...ok, sourceUrl: "" })).toBe(false);
    expect(canShowProof({ ...ok, sourceUrl: null })).toBe(false);
    expect(canShowProof({ ...ok, sourceUrl: "pas un lien" })).toBe(false);
    expect(canShowProof({ ...ok, sourceUrl: "javascript:alert(1)" })).toBe(false);
  });
  it("ne rend rien sans nom de source", () => {
    expect(canShowProof({ ...ok, sourceName: "  " })).toBe(false);
  });
  it("ne rend rien sans données", () => {
    expect(canShowProof(null)).toBe(false);
  });
});

describe("forfaits masqués par défaut (ADR-008) et rallumables dans Studio", () => {
  it("le seed masque les 5 forfaits ; les remettre à visible: true les fait réapparaître sur le site", async () => {
    const { packageDocs } = await import("../../scripts/seed/packages.mts");
    const docs = packageDocs as unknown as Array<Record<string, unknown>>;
    const asData = (visible: boolean): PackageData[] =>
      docs.map((d) => ({ _id: d._id as string, code: d.code as string, order: d.order as number, visible, service: { visible: true } }));
    expect(docs.every((d) => d.visible === false)).toBe(true);
    expect(visiblePackages(asData(false))).toEqual([]);
    expect(visiblePackages(asData(true)).map((p) => p.code)).toEqual(["F-01", "F-02", "F-03", "F-04", "F-05"]);
  });
});
