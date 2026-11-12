/**
 * R2 : retire l'appel de 20 minutes du formulaire. Met `callEnabled` à faux dans `formSettings` et remplace l'accusé de réception
 * et l'objet de la notification par les textes de la soumission (forfait visé, aucune mention d'appel). Les textes « appel »
 * (N5) ne sont pas touchés : ils servent si l'appel est réactivé. Refuse tout autre dataset que `development`.
 *
 *   NEXT_PUBLIC_SANITY_DATASET=development pnpm exec sanity exec scripts/patch-form-r2.mts --with-user-token
 */
import { getCliClient } from "sanity/cli";
import { emailTemplatesR2, formSettingsR2 } from "./seed/form-and-emails.mts";

const client = getCliClient({ apiVersion: "2026-11-01", useCdn: false });
const { projectId, dataset } = client.config();
console.log(`Cible : ${projectId}/${dataset}`);
if (dataset !== "development") {
  console.error(`Refusé : ce script n'écrit que dans « development » (cible : « ${dataset} »).`);
  process.exit(1);
}

await client.createIfNotExists({ _id: "formSettings", _type: "formSettings" });
await client.patch("formSettings").set(formSettingsR2).commit();
await client.createIfNotExists({ _id: "emailTemplates", _type: "emailTemplates" });
await client.patch("emailTemplates").set(emailTemplatesR2).commit();
console.log(`${Object.keys(formSettingsR2).length + Object.keys(emailTemplatesR2).length} champs mis à jour (appel désactivé).`);
