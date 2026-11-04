import type { StructureResolver } from "sanity/structure";

// Organisation du Studio : réglages uniques en haut, puis pages, services, redirections.
// Les documents uniques ont un identifiant fixe égal à leur type (ex. « settings »).
const singleton = (S: Parameters<StructureResolver>[0], type: string, title: string) =>
  S.listItem().title(title).id(type).child(S.document().schemaType(type).documentId(type).title(title));

export const structure: StructureResolver = (S) =>
  S.list()
    .title("Contenu Bimurix")
    .items([
      S.listItem()
        .title("Pages")
        .child(S.documentTypeList("page").title("Pages")),
      S.listItem()
        .title("Services")
        .child(S.documentTypeList("service").title("Services").defaultOrdering([{ field: "order", direction: "asc" }])),
      S.divider(),
      singleton(S, "settings", "Identité et coordonnées"),
      singleton(S, "navigation", "Menu principal"),
      singleton(S, "footer", "Pied de page"),
      singleton(S, "uiStrings", "Petits textes du site"),
      S.divider(),
      singleton(S, "formSettings", "Formulaire de soumission"),
      singleton(S, "emailTemplates", "Courriels"),
      S.divider(),
      S.listItem().title("Redirections").child(S.documentTypeList("redirect").title("Redirections")),
    ]);
