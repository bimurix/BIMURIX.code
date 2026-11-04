# Bimurix — site et tableau de bord (`web/`)

Next.js 16 · Sanity 6 (Studio sur `/studio`) · Supabase · Tailwind 4. Voir `../PLAN.md`, `../CLAUDE.md`, `../docs/`.

## Démarrer en local

```bash
pnpm install
pnpm db:start                      # Supabase local isolé (Docker, projet « bimurix », ports 54421-54429)
node scripts/db-env.mjs            # clés locales → .env.development.local (une fois)
pnpm admin:add contact@bimurix.com # autorise un compte sur /admin
pnpm dev                           # http://localhost:3100
```

| Adresse | Rôle |
|---|---|
| http://localhost:3100 | Site (FR), `/en` pour l'anglais |
| http://localhost:3100/studio | Sanity Studio : tout le contenu |
| http://localhost:3100/admin | Tableau de bord des demandes (lien magique) |
| http://localhost:54424 | Mailpit : tous les courriels envoyés en local |
| http://localhost:54423 | Tableau Supabase local |

## Commandes

```bash
pnpm lint && pnpm typecheck && pnpm test && pnpm build
pnpm test:e2e                 # Playwright mobile + bureau (dont axe WCAG AA)
pnpm seed:login               # contenu de départ dans Sanity (documents absents seulement)
pnpm check:placeholders       # bloque la mise en ligne s'il reste des valeurs d'exemple
pnpm db:reset                 # rejoue les migrations sur la base locale
pnpm db:stop
```
