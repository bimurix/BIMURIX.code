# Architecture — Bimurix

> Où va chaque chose, et pourquoi. À lire avant de créer un fichier. Mis à jour le 2026-11-10.

## 1. Le dossier de travail

| Dossier | Contenu | Dans Git |
|---|---|---|
| `web/` | **Tout le code** : une seule application Next.js (site, Studio, tableau de bord). | oui |
| `docs/decisions/` | ADR numérotés : une décision = un fichier. | oui |
| `docs/source/AAAA-MM-JJ_sujet/` | Documents du client qui alimentent le contenu du site. | oui |
| `docs/audits/AAAA-MM-JJ_sujet.md` | Audits datés. | oui |
| `docs/archive/` | Plans et documents remplacés. Rien n'est supprimé, on archive. | oui |
| `design/` | Direction visuelle A, `PRODUCT.md`. | oui |
| `identite-visuelle/` | Logo et déclinaisons (ADR-005). | oui |
| `affaires/AAAA-MM-JJ_sujet/` | Stratégie, marges, sous-traitance. **Jamais dans le dépôt.** | non |
| `.claude/skills/` | Skills du projet (méthode de travail, design). | oui |
| `.claude/launch.json` | Serveur d'aperçu `bimurix-web` (port 3100). | oui |

Règles : tout document porte une date `AAAA-MM-JJ_` ; le code n'en porte jamais (Git la garde).
Avant de créer un dossier, dire où il va et pourquoi. Les fichiers générés (`.next`, `test-results`) ne se rangent pas.

## 2. Le code (`web/`)

```
web/
├─ src/
│  ├─ app/                    Routes seulement : pas de logique métier ici
│  │  ├─ (site)/[locale]/     Pages publiques FR/EN (accueil, [...slug], 404)
│  │  ├─ admin/               Tableau de bord (connexion, liste, fiche)
│  │  ├─ studio/              Sanity Studio intégré
│  │  ├─ sitemap.ts  robots.ts
│  ├─ blocks/<bloc>/          Un bloc de page = un dossier : schema.ts + Composant.tsx
│  │  ├─ schemas.ts           Liste des blocs (fichier partagé)
│  │  └─ render.tsx           Type de bloc → composant (fichier partagé)
│  ├─ sanity/                 Client, requêtes GROQ, types de contenu
│  │  └─ schemas/             documents/ · singletons/ · objects/
│  ├─ lib/                    Logique sans interface, testable
│  │  ├─ quote/               Cas d'usage « demande » : schéma Zod, envoi, courriels
│  │  ├─ admin/               Auth, lecture et actions du tableau de bord
│  │  ├─ supabase/            Clients serveur, admin, session
│  │  ├─ mail/  i18n/         Envoi (Mailpit / Resend) · langues et routage
│  ├─ ui/
│  │  ├─ components/          Petites pièces réutilisables (bouton, logo, pastille)
│  │  ├─ patterns/            Assemblages du site (en-tête, pied, feuille, formulaire)
│  │  └─ admin/               Pièces du tableau de bord
│  ├─ styles/tokens.css       Seule source des couleurs, tailles et traits
│  └─ proxy.ts                Routage FR / EN et garde de /admin
├─ scripts/                   seed-sanity.mts + seed/*.mts, db-env, add-admin, check-placeholders
├─ supabase/migrations/       SQL versionné, appliqué par `pnpm db:reset`
└─ tests/unit · tests/e2e     Vitest · Playwright (mobile et bureau)
```

### Sens des dépendances (ne pas l'inverser)
`app` → `blocks`, `ui` → `lib`, `sanity`. `lib` n'importe jamais `ui`, `blocks` ni `app`.
`ui/components` n'importe pas `ui/patterns`.

### Où mettre une nouveauté

| Je veux ajouter… | Ça va dans… |
|---|---|
| Une section de page éditable | `src/blocks/<nom>/` + une ligne dans `schemas.ts` et `render.tsx` |
| Un type de contenu (ex. forfait) | `src/sanity/schemas/documents/` + `index.ts`, `structure.ts`, `queries.ts` |
| Un réglage unique | `src/sanity/schemas/singletons/` |
| Une règle métier ou une validation | `src/lib/<domaine>/`, avec son test dans `tests/unit/` |
| Un texte public | Sanity (seed dans `scripts/seed/`), jamais dans le code |
| Une couleur ou une taille | `src/styles/tokens.css` |
| Une colonne en base | Nouvelle migration dans `supabase/migrations/` (jamais modifier une ancienne) |

### Limites
Fichier ≤ 300 lignes, fonction ≤ 40 lignes (au 2026-11-10 : plus gros fichier 194 lignes).
Server Components par défaut ; `"use client"` seulement pour l'interaction.

## 3. Les données

| Donnée | Où | En local | En ligne |
|---|---|---|---|
| Contenu public (textes, prix, images) | Sanity | dataset **`development`** | dataset `production` |
| Demandes, notes, admins | Supabase (RLS partout) | Docker `bimurix`, ports 54421–54429 | projet `bimurix-prod` (Canada) |
| Courriels | — | Mailpit `localhost:54424` | Resend |
| Antispam | Turnstile | clés de test | vraies clés |

Le dataset est choisi par `NEXT_PUBLIC_SANITY_DATASET` : `development` en mode dev (écrit par
`node scripts/db-env.mjs`), `production` par défaut ailleurs (ADR-004, révision du 2026-11-10).

## 4. Parcours d'une demande
Visiteur → formulaire (`ui/patterns/quote-form`) → action serveur (`lib/quote/actions.ts`) → Turnstile,
champ piège, limite par IP → Zod (`lib/quote/schema.ts`) → insertion Supabase → courriels (accusé +
notification) → succès affiché **après** l'insertion → `/admin` (lien magique, liste blanche `admins`).
