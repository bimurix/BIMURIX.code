/**
 * T7 — retire les photos des fiches de projets d'exemple 1 et 2 (accueil), dataset `development` seulement.
 * Raison : la photo 1 montre du câblage (pas des gicleurs) et l'auteur de la photo 2 n'est pas relevé : une image trompeuse ou sans
 * source ne reste pas. L'emplacement devient vide (le champ existe : Studio → Accueil → Projets → fiche → Image). Fiche 3 inchangée.
 * Relançable (idempotent) ; refuse tout autre dataset. Relancer après `patch-photos-t3.mts` (qui les remettrait).
 *
 *   NEXT_PUBLIC_SANITY_DATASET=development pnpm exec sanity exec scripts/patch-photos-t7.mts --with-user-token
 */
import { getCliClient } from "sanity/cli";

const client = getCliClient({ apiVersion: "2026-11-01", useCdn: false });
const { projectId, dataset } = client.config();
console.log(`Cible : ${projectId}/${dataset}`);
if (dataset !== "development") {
  console.error(`Refusé : ce script n'écrit que dans « development » (cible : « ${dataset} »).`);
  process.exit(1);
}
type Section = { _key: string; _type: string; items?: Array<{ _key: string; hasImage: boolean }> };
const page = await client.fetch<{ _id: string; sections: Section[] } | null>(`*[_id == "page-home"][0]{_id, sections[]{_key, _type, "items": items[]{_key, "hasImage": defined(image.asset)}}}`);
const projects = page?.sections.find((s) => s._type === "projects");
if (!page || !projects) {
  console.log("Aucune section Projets : rien à faire.");
  process.exit(0);
}
const unset = (projects.items ?? []).slice(0, 2).filter((i) => i.hasImage).map((i) => `sections[_key=="${projects._key}"].items[_key=="${i._key}"].image`);
if (unset.length) await client.patch(page._id).unset(unset).commit();
console.log(`${unset.length} photo(s) retirée(s).`);
