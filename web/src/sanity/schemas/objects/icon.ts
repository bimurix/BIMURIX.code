import { defineField } from "sanity";
import { ICON_OPTIONS } from "@/lib/icon-names";

/** Symbole au trait d'une ligne (liste fermée, cahier v6 T3-A). Vide : la ligne s'affiche sans symbole. */
export const iconField = defineField({
  name: "icon",
  title: "Symbole (facultatif)",
  type: "string",
  options: { list: ICON_OPTIONS.map((o) => ({ title: o.title, value: o.value })) },
  description: "Symbole au trait qui accompagne la ligne. Vide : la ligne s'affiche sans symbole.",
});
