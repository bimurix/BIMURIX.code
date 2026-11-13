/**
 * S2 (ADR-008, plan de contenu v5) — applique le contenu v5 au dataset `development`, en français et en anglais :
 * six services en trois familles (noms, situations types, livrables avec usage, besoins, qui fait quoi, FAQ), accueil réordonné,
 * À propos, Soumission, menu et pied de page par famille, SEO, 20 petits textes, forfaits masqués, bandeau éteint, conditions retirées.
 * Les documents du seed sont remplacés (createOrReplace, donc idempotent) ; le logo et l'icône de `settings` et les images
 * des services (`heroImage`, `figureImage`) et la photo du premier écran des pages (`heroSheet.illustration`, ex. À propos) déjà téléversées sont conservés
 * (S5 : on peut donc relancer ce script avant ou après `patch-design-s3b.mts`, sans perdre de photo). `formSettings` et `emailTemplates` ne reçoivent
 * que les champs S2 (message de succès, encart, accusé de réception) : le reste appartient à R2 et au client.
 * Refuse tout autre dataset que `development` (jamais `production`).
 *
 *   NEXT_PUBLIC_SANITY_DATASET=development pnpm exec sanity exec scripts/patch-content-s2.mts --with-user-token
 */
import { getCliClient } from "sanity/cli";
import { seedDocuments } from "./seed/documents.mts";
import { emailTemplatesS2, formSettingsS2 } from "./seed/form-s2.mts";

const SINGLE_FIELDS_ONLY = ["formSettings", "emailTemplates"];
const KEEP_IMAGES = ["heroImage", "figureImage"];

const client = getCliClient({ apiVersion: "2026-11-01", useCdn: false });
const { projectId, dataset } = client.config();
const documents = seedDocuments.filter((d) => !SINGLE_FIELDS_ONLY.includes(d._id));
console.log(`Cible : ${projectId}/${dataset} (${documents.length} documents)`);
if (dataset !== "development") {
  console.error(`Refusé : ce script n'écrit que dans « development » (cible : « ${dataset} »).`);
  process.exit(1);
}

const existing = await client.fetch<Array<Record<string, unknown> & { _id: string }>>(`*[_id in $ids]{_id, logo, logoInverse, favicon, heroImage, figureImage, "heroIllustrations": sections[_type == "heroSheet"].illustration}`, { ids: documents.map((d) => d._id) });
const byId = new Map(existing.map((d) => [d._id, d]));
const kept = (id: string) => {
  const old = byId.get(id);
  const fields = id === "settings" ? ["logo", "logoInverse", "favicon"] : KEEP_IMAGES;
  return Object.fromEntries(fields.filter((f) => old?.[f]).map((f) => [f, old?.[f]]));
};

// S5 : la photo du premier écran d'une page (heroSheet.illustration) vit dans ses sections : on la remet sur le nouveau heroSheet.
type Section = { _type?: string; illustration?: unknown };
const withKeptIllustrations = <T extends { _id: string }>(doc: T): T => {
  const old = (byId.get(doc._id)?.heroIllustrations as unknown[] | undefined) ?? [];
  const sections = (doc as { sections?: Section[] }).sections;
  if (!sections || !old.some(Boolean)) return doc;
  let n = 0;
  return { ...doc, sections: sections.map((sec) => (sec._type === "heroSheet" ? { ...sec, ...(old[n] && !sec.illustration ? { illustration: old[n++] } : (n++, {})) } : sec)) };
};

const tx = client.transaction();
for (const doc of documents) tx.createOrReplace(withKeptIllustrations({ ...doc, ...kept(doc._id) }) as typeof doc);
await tx.commit();

await client.createIfNotExists({ _id: "formSettings", _type: "formSettings" });
await client.patch("formSettings").set(formSettingsS2).commit();
await client.createIfNotExists({ _id: "emailTemplates", _type: "emailTemplates" });
await client.patch("emailTemplates").set(emailTemplatesS2).commit();

const drafts = await client.fetch<string[]>(`*[_id in path("drafts.**")]._id`);
console.log(`${documents.length} documents remplacés, ${Object.keys(formSettingsS2).length + Object.keys(emailTemplatesS2).length} champs de formulaire et de courriel mis à jour dans ${projectId}/${dataset}.`);
if (drafts.length) console.log(`Attention : ${drafts.length} brouillon(s) dans Studio peuvent masquer ces changements : ${drafts.join(", ")}`);
