// Variables des modèles de courriel saisis dans Studio : {name}, {company}, {service}, {reference}.
export type TemplateVars = { name: string; company: string; service: string; reference: string };

export function fillTemplate(template: string, vars: TemplateVars): string {
  return template.replace(/\{(name|company|service|reference)\}/g, (_, key: keyof TemplateVars) => vars[key]);
}

/** Objet de courriel : une seule ligne, quelle que soit la saisie du visiteur (pas d'injection d'en-tête). */
export function oneLine(value: string): string {
  return value.replace(/[\r\n\t]+/g, " ").trim().slice(0, 250);
}

const REFERENCE_ALPHABET = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789"; // sans 0/O ni 1/I/L : lisible au téléphone

/** Référence courte d'une demande, ex. « BX-7K4Q9M ». */
export function newReference(random: (n: number) => Uint8Array = (n) => crypto.getRandomValues(new Uint8Array(n))): string {
  const bytes = random(6);
  return `BX-${Array.from(bytes, (b) => REFERENCE_ALPHABET[b % REFERENCE_ALPHABET.length]).join("")}`;
}

/** Échappe le texte saisi par le visiteur avant de l'insérer dans un courriel HTML. */
export function escapeHtml(value: string): string {
  return value.replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c] as string);
}

/** Texte brut → HTML simple : paragraphes et sauts de ligne, contenu échappé. */
export function textToHtml(text: string): string {
  return text
    .split(/\n{2,}/)
    .map((p) => `<p style="margin:0 0 14px;font:15px/1.55 Arial,sans-serif;color:#0F172A">${escapeHtml(p).replace(/\n/g, "<br>")}</p>`)
    .join("");
}
