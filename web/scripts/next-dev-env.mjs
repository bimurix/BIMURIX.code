/**
 * Lance `next build` ou `next start` avec les variables locales de `.env.development.local` (sans les afficher).
 * Sert à tester le build de production contre la pile locale (R3) : `node scripts/next-dev-env.mjs build|start`.
 * (`node --env-file` ne convient pas : Next refuse ce drapeau dans les processus de build.)
 */
import { createRequire } from "node:module";
import { pathToFileURL } from "node:url";

process.loadEnvFile(new URL("../.env.development.local", import.meta.url));
const [command, ...rest] = process.argv.slice(2);
if (!["build", "start"].includes(command)) throw new Error("Usage : node scripts/next-dev-env.mjs build|start");
const next = createRequire(import.meta.url).resolve("next/dist/bin/next");
process.argv = [process.argv[0], next, command, ...(command === "start" ? ["-p", "3100"] : []), ...rest];
await import(pathToFileURL(next).href);
