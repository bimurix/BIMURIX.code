"use client";

import { defineConfig } from "sanity";
import { structureTool } from "sanity/structure";
import { apiVersion, dataset, projectId, studioBasePath } from "./src/sanity/env";
import { schemaTypes, singletonTypes } from "./src/sanity/schemas";
import { structure } from "./src/sanity/structure";

const singletons = new Set<string>(singletonTypes);
const singletonActions = new Set(["publish", "discardChanges", "restore"]);

export default defineConfig({
  name: "bimurix",
  title: "Bimurix",
  basePath: studioBasePath,
  projectId,
  dataset,
  plugins: [structureTool({ structure })],
  schema: {
    types: schemaTypes,
    // Les documents uniques ne se créent pas depuis le bouton « + ».
    templates: (templates) => templates.filter(({ schemaType }) => !singletons.has(schemaType)),
  },
  document: {
    // Ni suppression ni duplication des documents uniques.
    actions: (input, { schemaType }) =>
      singletons.has(schemaType) ? input.filter(({ action }) => action && singletonActions.has(action)) : input,
  },
  apiVersion,
});
