# ADR-002 — Stack technique

**Statut** : accepté (2026-11-03)

## Décision
Une seule application **Next.js 16** (App Router) dans `web/`, avec Sanity Studio intégré sur
`/studio`, Supabase pour les données et l'authentification, Tailwind 4, Zod, Vitest, Playwright.

Dépendances volontairement minimales :
- **pas de `next-intl`** : les adresses viennent de Sanity, un `proxy.ts` gère FR/EN (ADR-003) ;
- **pas de SDK Resend ni React Email** : envoi par `fetch` (Mailpit en local, Resend en ligne) ;
- pas de monorepo ni Turborepo : un seul site, un seul déploiement Netlify.

## Références
Patrons repris (pas de clonage) de `sanity-io/sanity-template-nextjs-clean` (édition visuelle,
Live Content API) et `robotostudio/turbo-start-sanity` (MIT : un dossier par bloc, singletons,
redirections, revalidation par tags, seed).

## Conséquences
Moins de code tiers à maintenir ; un peu plus de code maison (routage, mailer), couvert par des tests.
