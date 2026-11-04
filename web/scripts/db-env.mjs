/**
 * Écrit web/.env.development.local à partir de la pile Supabase LOCALE (pnpm db:start).
 * Ces clés ne valent que sur ce PC (conteneurs Docker « bimurix ») : ce ne sont pas des secrets de
 * production. Les clés de production seront saisies par le client dans Netlify (phase M).
 * decision: ADR-004 ; CLAUDE.md §6 (exception documentée).
 */
import { execSync } from "node:child_process";
import { writeFileSync } from "node:fs";

// npx trouve le CLI Supabase installé dans web/node_modules, même si pnpm n'est pas dans le PATH.
const raw = execSync("npx --no-install supabase status -o env", { encoding: "utf8", cwd: new URL("..", import.meta.url) });
const status = Object.fromEntries(
  raw.split(/\r?\n/).flatMap((line) => {
    const m = line.match(/^([A-Z0-9_]+)="?(.*?)"?$/);
    return m ? [[m[1], m[2]]] : [];
  }),
);

for (const key of ["API_URL", "PUBLISHABLE_KEY", "SECRET_KEY", "MAILPIT_URL"]) {
  if (!status[key]) throw new Error(`Supabase local : ${key} introuvable. Lance d'abord « pnpm db:start ».`);
}

const lines = [
  "# Généré par « pnpm db:env » — pile Supabase locale uniquement, ne pas copier en production.",
  `NEXT_PUBLIC_SUPABASE_URL=${status.API_URL}`,
  `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=${status.PUBLISHABLE_KEY}`,
  `SUPABASE_SECRET_KEY=${status.SECRET_KEY}`,
  "",
  "# Courriels : capturés par Mailpit (aucun envoi réel).",
  "MAIL_TRANSPORT=mailpit",
  `MAILPIT_URL=${status.MAILPIT_URL}`,
  "",
  "# Turnstile : clés de test officielles de Cloudflare (toujours valides).",
  "NEXT_PUBLIC_TURNSTILE_SITE_KEY=1x00000000000000000000AA",
  "TURNSTILE_SECRET_KEY=1x0000000000000000000000000000000AA",
  "",
  "# Sel du hachage des adresses IP (limite d'envois) : valeur de développement.",
  "IP_HASH_SALT=bimurix-local-dev",
  "",
];
writeFileSync(new URL("../.env.development.local", import.meta.url), lines.join("\n"));
console.log("web/.env.development.local écrit (Supabase local, Mailpit, Turnstile test).");
