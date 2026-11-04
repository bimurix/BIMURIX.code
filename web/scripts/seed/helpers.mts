// Petits utilitaires pour écrire le contenu de départ lisiblement.
let keyCounter = 0;
const nextKey = () => `k${(++keyCounter).toString(36).padStart(4, "0")}`;

export const l = (fr: string, en: string) => ({ fr, en });

export const ref = (id: string) => ({ _type: "reference", _ref: id });

/** Ajoute un _key à chaque élément d'un tableau (exigé par Sanity). */
export function keyed<T extends object>(items: T[]): Array<T & { _key: string }> {
  return items.map((item) => ({ _key: nextKey(), ...item }));
}

export const block = <T extends object>(type: string, fields: T) => ({ _type: type, _key: nextKey(), ...fields });

export const titled = (title: { fr: string; en: string }, text?: { fr: string; en: string }) => ({ title, text });

type Para = [style: "normal" | "h2" | "h3", text: string] | ["bullet", string];

/** Convertit une liste de paragraphes simples en Portable Text. */
export function pt(paras: Para[]) {
  return paras.map(([style, text]) => ({
    _type: "block",
    _key: nextKey(),
    style: style === "bullet" ? "normal" : style,
    ...(style === "bullet" ? { listItem: "bullet", level: 1 } : {}),
    markDefs: [],
    children: [{ _type: "span", _key: nextKey(), text, marks: [] }],
  }));
}

export const internalCta = (label: { fr: string; en: string }, pageId: string, style = "primary", serviceId?: string) => ({
  label,
  style,
  link: { kind: "internal", internal: ref(pageId), ...(serviceId ? { service: ref(serviceId) } : {}) },
});

// Valeurs génériques à remplacer avant la mise en ligne (decision: D12, PLAN.md §1).
export const PLACEHOLDER_MARKERS = ["555-01", "1234567890", "(exemple)", "(example)"];
