import { describe, expect, it } from "vitest";
import { keepImages } from "../../scripts/seed/keep-images.mts";

const img = (id: string) => ({ _type: "imageWithAlt", asset: { _ref: id } });

describe("patch-content-t2 : images conservées", () => {
  it("reporte l'image d'un service et la photo du premier écran d'une page, même si les sections ont été réordonnées", () => {
    const old = { heroImage: img("a"), figureImage: img("b"), sections: [{ _type: "heroSheet", illustration: img("c") }, { _type: "problems", image: img("d") }] };
    const next = { title: "x", sections: [{ _type: "heroSheet", heading: "n" }, { _type: "pointsList" }, { _type: "problems", heading: "p" }] };
    const out = keepImages({ ...next, heroImage: undefined }, old) as { heroImage: unknown; figureImage: unknown; sections: Array<Record<string, unknown>> };
    expect(out.heroImage).toEqual(img("a"));
    expect(out.figureImage).toEqual(img("b"));
    expect(out.sections[0].illustration).toEqual(img("c"));
    expect(out.sections[1].image).toBeUndefined();
    expect(out.sections[2].image).toEqual(img("d"));
  });

  it("ne remplace jamais un texte neuf et se relance sans effet", () => {
    const old = { sections: [{ _type: "heroSheet", heading: "ancien", illustration: img("c") }] };
    const next = { sections: [{ _type: "heroSheet", heading: "nouveau" }] };
    const once = keepImages(next, old);
    expect(once).toEqual({ sections: [{ _type: "heroSheet", heading: "nouveau", illustration: img("c") }] });
    expect(keepImages(next, once)).toEqual(once);
  });
});
