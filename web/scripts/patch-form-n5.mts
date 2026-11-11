/**
 * Ajoute les champs de l'étape N5 (type de demande, forfait visé) aux documents `formSettings` et
 * `emailTemplates` existants, sans rien écraser (setIfMissing). Refuse tout autre dataset que `development`.
 *
 *   NEXT_PUBLIC_SANITY_DATASET=development pnpm exec sanity exec scripts/patch-form-n5.mts --with-user-token
 */
import { getCliClient } from "sanity/cli";
import { emailTemplatesN5, formSettingsN5 } from "./seed/form-n5.mts";

const client = getCliClient({ apiVersion: "2026-11-01", useCdn: false });
const { projectId, dataset } = client.config();
console.log(`Cible : ${projectId}/${dataset}`);
if (dataset !== "development") {
  console.error(`Refusé : ce script n'écrit que dans « development » (cible : « ${dataset} »).`);
  process.exit(1);
}

await client.createIfNotExists({ _id: "formSettings", _type: "formSettings" });
await client.patch("formSettings").setIfMissing(formSettingsN5).commit();
await client.createIfNotExists({ _id: "emailTemplates", _type: "emailTemplates" });
await client.patch("emailTemplates").setIfMissing(emailTemplatesN5).commit();
console.log(`${Object.keys(formSettingsN5).length + Object.keys(emailTemplatesN5).length} champs ajoutés s'ils étaient absents.`);
