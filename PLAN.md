# BIMURIX — Plan de production v3 (local d'abord)

> Site vitrine FR (défaut) / EN + tableau de bord des demandes de soumission
> **Tout se développe en local** (`localhost`). La mise en ligne (Netlify, DNS, Resend, Supabase cloud) vient **après**.
> **Direction visuelle : A — « La feuille de plan »** ([design/directions-visuelles.html](design/directions-visuelles.html))
> **Tout le contenu se pilote depuis Sanity Studio** : logo, images, textes, menus, SEO, formulaire, courriels.
> Statut : **à valider — aucun code écrit**

---

## 0. État d'avancement (2026-11-04)

| Étape | État | Détail |
|---|---|---|
| L0 Cadrage | ✅ | CLAUDE.md, SPEC, ADR 001–005, PRODUCT, directions visuelles |
| Identité visuelle | ✅ | Logo L-01 « Croisement » (ADR-005), `identite-visuelle/` |
| L1 Squelette | ✅ | Next.js 16, FR/EN, port 3100, Supabase isolé `bimurix` (544xx) |
| L2 Sanity | ✅ | Studio, schémas, 10 blocs, 16 documents dans `production` (seed via session `sanity login`) |
| GitHub | 🟡 | Clé dédiée + remote `bimurix/BIMURIX.code` OK, **rien poussé** |
| L3 Système visuel | ✅ | Tokens L-01 sans cyan, logo depuis Sanity, en-tête, menu mobile, pied de page, feuille + cartouche, isométrique animé, services |
| L4 Pages + SEO | ✅ | 9 pages FR/EN + 404, 10 blocs rendus, gabarit service, métadonnées, hreflang, sitemap, robots, JSON-LD — édition visuelle reportée (jeton Viewer requis) |
| L5 Formulaire | ✅ | Migration + RLS, validation Zod, antispam (Turnstile + piège + limite IP), courriels Mailpit/Resend, formulaire FR/EN — parcours complet vérifié (base + 2 courriels Mailpit) |
| L6 Tableau de bord | ✅ | Lien magique + liste blanche, RLS, boîte de réception (filtres, recherche, indicateurs), fiche, statuts, notes, réponse avec modèles Studio, anonymisation, conservation 24 mois (pg_cron) |
| L7 Sécurité, a11y, perf | ✅ | En-têtes (CSP, HSTS…), dépendances corrigées, axe WCAG AA 0 violation, JS ≈ 149 Ko gzip |
| Audit complet | ✅ | 16/20 → 19/20, voir `docs/AUDIT-2026-11.md` |
| M Mise en ligne | ⏳ | Valeurs d'exemple à remplacer (`pnpm check:placeholders`), puis GitHub, Netlify, Supabase cloud, Resend |

Écarts restants : les PNG et PDF générés (cartes, signatures) affichent encore `bimurix.ca` : relancer
`identite-visuelle/07-sources/gen.mjs` (les sources texte sont corrigées en `bimurix.com`).

---

## 1. Nouvelles décisions (s'ajoutent à la v2)

| # | Décision |
|---|---|
| D9 | **Local d'abord** : site, Studio, base de données, courriels et antispam tournent sur ton PC. Aucune configuration en ligne avant la phase M. |
| D10 | **Direction A** retenue. |
| D11 | **Sanity contrôle tout le contenu** (voir §4). Le code ne contient aucun texte public, à part des valeurs de secours. |
| D12 | **Infos manquantes = valeurs génériques** (téléphone 555, NEQ fictif…) marquées « exemple », et un script bloque la mise en ligne tant qu'il en reste (§8, M1). |
| D13 | **Moins de dépendances** que prévu : pas de `next-intl`, pas de SDK Resend, pas de React Email (voir §2). |

Ce qui reste valable de la v2 : ajustements Québec (Loi 25, Loi 96, formulaire, NEQ), modèle Supabase, écrans du dashboard. Ils sont repris en résumé ci-dessous.

---

## 2. Analyse des dépôts GitHub de référence

| Dépôt | État (nov. 2026) | On reprend | On laisse |
|---|---|---|---|
| [sanity-io/sanity-template-nextjs-clean](https://github.com/sanity-io/sanity-template-nextjs-clean) — modèle officiel Sanity | Actif, Next.js 16 | **Visual Editing + Presentation** (cliquer sur un texte du site pour l'éditer dans Studio), **Live Content API**, document `settings` | Blog, auteurs, monorepo séparé frontend/studio |
| [robotostudio/turbo-start-sanity](https://github.com/robotostudio/turbo-start-sanity) — MIT | Actif, Next 16, Sanity 6, Tailwind 4 | **Un dossier par bloc** (schéma + requête GROQ + composant ensemble), singletons `settings` / `navbar` / `footer`, documents `redirect`, **webhook de revalidation par tags**, script de **données de départ (seed)**, sitemap | Turborepo, Mux vidéo, Biome, blog, `llms.txt` |
| [Starter Sanity + Next.js + i18n](https://www.sanity.io/templates/sanity-next-js-cloudflare-i18n-starter) | Peu suivi (4 ★) | L'idée : FR/EN géré dans Sanity | Cloudflare, `next-intl` |
| [sanity-io/document-internationalization](https://github.com/sanity-io/document-internationalization) | **Archivé** (déplacé dans `sanity-io/plugins`) | — | Une copie de document par langue. Inutile ici : on veut que FR et EN restent alignés |
| Exemples Supabase (`supabase/supabase`, `@supabase/ssr`) | Actif | Auth par lien magique côté serveur, client SSR, **pile locale Docker** | — |

**Conclusion** : on ne clone aucun modèle tel quel : ils embarquent un blog, un monorepo et des outils dont on n'a pas besoin. On part d'un projet Next.js propre et on reprend **seulement les 6 patrons notés en gras**.

**Versions actuelles vérifiées** : Next.js 16.4 · Sanity 6.22 · next-sanity 13.4 · Tailwind 4.3 · supabase-js 2.x.

**Choix bilingue** : les champs Sanity ont la forme `{ fr, en }` sur **un seul document** par page. Le FR est obligatoire et l'EN facultatif. Une page EN incomplète n'est pas publiée (Loi 96 : le FR n'est jamais moins complet). Ce choix n'ajoute aucun plugin.

**Routage FR/EN sans `next-intl`** : les adresses viennent de Sanity (`slug.fr`, `slug.en`), donc la table d'adresses fixes de next-intl ne sert pas. Un *proxy* Next.js d'environ 30 lignes suffit : `/…` → FR, `/en/…` → EN.

---

## 3. Fonctionnement en local

Outils vérifiés sur ton PC : Node 24 · npm 11 · pnpm 12 · Git · **Docker (actif)** · GitHub CLI · Netlify CLI. Le CLI Supabase passe par `npx` (rien à installer).

| Service | En local | En ligne (phase M) |
|---|---|---|
| Site | `pnpm dev` → **http://localhost:3000** | Netlify |
| Sanity Studio | **http://localhost:3000/studio** (intégré au site) | Même adresse sur bimurix.com |
| Contenu Sanity | Projet Sanity gratuit, jeu de données **`development`** (Sanity n'a pas de mode hors ligne, voir §9) | Jeu de données `production` |
| Base de données + connexion admin | **Supabase local dans Docker** (`npx supabase start`) : Postgres, Auth, tableau Supabase sur :54323 | Supabase cloud, région Canada |
| Courriels | **Mailpit** (fourni avec Supabase local) : tous les courriels (accusés, réponses, liens de connexion) s'affichent sur **http://localhost:54324** ; rien ne part sur Internet | Resend (`contact@bimurix.com`) |
| Antispam | Clés de **test officielles** Cloudflare Turnstile (toujours valides) | Vraies clés Turnstile |
| Git | Dépôt Git local, commits par étape | Dépôt GitHub privé + previews Netlify |

### Isolation de Bimurix (aucun conflit avec tes autres projets)

| Élément | Valeur Bimurix | Pourquoi |
|---|---|---|
| Site Next.js | **port 3100** | Le 3000 reste libre pour tes autres projets |
| Supabase local | `project_id = "bimurix"` | Conteneurs Docker et volumes séparés (`supabase_*_bimurix`) |
| Supabase API · base · tableau · Mailpit | **54421 · 54422 · 54423 · 54424** (+ 54425–54429 pour les services internes) | Pas de collision avec les ports par défaut (543xx) ni avec `safer-postgres` (5432) |
| Dépendances | `web/node_modules` uniquement, rien de global | Versions indépendantes |
| Variables | `web/.env.local` propre | Aucun mélange de clés |
| Règles Claude | `Bimurix-siteweb/CLAUDE.md` | Prime sur le `CLAUDE.md` de `Downloads\` (projet location) |
| Arrêt | `pnpm db:stop` dans `web/` | N'arrête que les conteneurs Bimurix |

Adresses locales : site **http://localhost:3100** · Studio **http://localhost:3100/studio** · tableau Supabase **http://localhost:54423** · courriels **http://localhost:54424**.

Tu pourras tout tester en local : remplir le formulaire, voir le courriel dans Mailpit, te connecter au dashboard, répondre, et modifier un texte dans Studio pour le voir changer sur le site.

---

## 4. Ce que tu contrôles depuis Sanity Studio

| Domaine | Modifiable dans Studio |
|---|---|
| **Identité** | Logo (SVG ou PNG, version claire et foncée), logotype texte de secours (« bimurix »), favicon, image de partage (Open Graph) par défaut |
| **Navigation** | Menu principal (ordre, libellés, sous-menu Services), bouton d'action, sélecteur de langue, pied de page (colonnes, liens, mentions) |
| **Pages** | Accueil, À propos, Soumission, pages légales, 404 : **constructeur de sections** (ajouter, retirer et réordonner des blocs conçus dans la direction A) |
| **Services** | Les 4 services (et d'autres plus tard) : textes, livrables, méthode, image, **couleur de réseau** (choisie dans une palette validée), code (P-01…) |
| **Images** | Toutes les images, avec recadrage et point focal (*hotspot*), texte alternatif FR/EN obligatoire. Isométrique du hero : dessin par défaut **ou** ton image/SVG |
| **Cartouche** | Les textes du cartouche (feuille, révision, date) sur chaque page |
| **Formulaire** | Libellés, aides, messages d'erreur et de succès, listes (services, régions, budgets, phases, logiciels), texte de consentement, version de la politique |
| **Courriels** | Accusé de réception FR/EN, notification interne, **modèles de réponse du dashboard** FR/EN, adresse qui reçoit les notifications |
| **Coordonnées** | Courriel, téléphone, NEQ, région desservie, responsable Loi 25, liens professionnels |
| **SEO** | Titre, description et image par page et par langue, `noindex`, **redirections** |
| **Petits textes** | Boutons, libellés et messages du site (« Demander une soumission », « Envoi en cours… », etc.) |
| **Aperçu** | **Édition visuelle** : tu cliques sur un texte du site dans Studio et tu le modifies sur place ; brouillons visibles avant publication |

**Ce qui reste dans le code**, pour protéger la qualité du design :
- les polices ;
- les espacements et la mise en page ;
- la palette de base (les couleurs de réseau se choisissent dans une liste qui garantit le contraste) ;
- l'interface du dashboard admin (en français, pour toi seul).

Chaque texte a une **valeur de secours** dans le code : le site ne casse jamais si un champ est vide.

---

## 5. Structure du dossier

```
Bimurix-siteweb/                 ← dépôt Git
├─ CLAUDE.md                     ← règles du projet (remplace celui de Downloads\ qui vise un autre projet)
├─ PLAN.md  SPEC.md
├─ docs/
│  ├─ source/                    ← tes 2 documents .md d'origine (déplacés ici)
│  └─ decisions/                 ← ADR-001 périmètre, ADR-002 stack, ADR-003 bilingue, ADR-004 local d'abord
├─ design/                       ← directions visuelles, PRODUCT.md, DESIGN.md
└─ web/                          ← **le code** (application Next.js unique)
   ├─ src/app/
   │  ├─ (site)/[locale]/…       ← pages publiques FR/EN
   │  ├─ studio/[[...tool]]/     ← Sanity Studio intégré
   │  ├─ admin/…                 ← tableau de bord
   │  └─ api/revalidate/         ← webhook Sanity
   ├─ src/blocks/<bloc>/         ← schéma + requête + composant par bloc (patron turbo-start)
   ├─ src/sanity/                ← schémas, client, requêtes, types générés
   ├─ src/lib/                   ← supabase, mailer (Mailpit / Resend), turnstile, validation
   ├─ src/proxy.ts               ← routage FR / EN
   ├─ supabase/                  ← config locale, migrations SQL, données de test
   ├─ scripts/seed-sanity.ts     ← contenu de départ (textes des docs + valeurs génériques)
   └─ tests/                     ← Vitest (unitaires) · Playwright (parcours complets)
```

**Dépendances (liste complète)** : `next`, `react`, `react-dom`, `sanity`, `next-sanity`, `@sanity/image-url`, `styled-components` (exigé par Studio), `@supabase/supabase-js`, `@supabase/ssr`, `zod`, `tailwindcss`. En développement : `typescript`, `eslint`, `vitest`, `@playwright/test`, `supabase` (CLI).
Les courriels passent par `fetch` (API Mailpit en local, API Resend en ligne), sans SDK.

---

## 6. Schémas Sanity

- **Singletons** : `settings` (identité, logo, coordonnées, Loi 25, NEQ), `navigation`, `footer`, `uiStrings` (petits textes), `formSettings` (formulaire et listes), `emailTemplates` (accusé, notification, modèles de réponse).
- **Documents** : `page` (constructeur de sections), `service`, `redirect`.
- **Blocs de section** (direction A) : `heroSheet` (titre, texte, boutons, isométrique), `serviceNetworks` (les réseaux cliquables), `method` (étapes), `deliverables` (exemples de livrables, avec la mention « exemple illustratif »), `audiences` (clientèles), `richText`, `quoteCta` (appel à l'action), `faq`, `imageFigure`.
- **Types communs** : `localeString`, `localeText`, `localeRichText`, `localeSlug`, `seo`, `link`, `titleBlock` (cartouche).

---

## 7. Supabase (rappel de la v2)

Tables `quote_requests`, `quote_messages`, `admins` · RLS partout · aucune lecture publique · insertion par le serveur seulement · statuts `new → in_review → replied → won | lost → archived` (+ `spam`) · anonymisation après la durée de conservation (Loi 25). Migrations SQL versionnées dans `web/supabase/migrations/`, appliquées en local par `npx supabase db reset`.

---

## 8. Phases

### Phase L — tout en local

| ID | Étape | Résultat vérifiable |
|---|---|---|
| **L0** | **Cadrage** : `CLAUDE.md` du projet, `SPEC.md`, ADR 001 à 004, `design/PRODUCT.md`, déplacement des docs dans `docs/source/`, `git init` | Documents relus par toi |
| **L1** | **Squelette** : Next.js 16 + TS strict + Tailwind 4 dans `web/`, lint, typecheck, Vitest, Playwright, routage FR/EN | `pnpm dev` → localhost:3000 affiche FR, `/en` affiche EN |
| **L2** | **Sanity** : Studio sur `/studio`, tous les schémas du §6, seed (textes des docs + EN traduit + valeurs génériques), types générés | Tu modifies un texte dans Studio → il change sur localhost |
| **L3** | **Système visuel A** : polices auto-hébergées, tokens, feuille + cartouche + repères, en-tête, menu mobile, pied de page, boutons, champs, isométrique animé | Revue impeccable `critique` + `audit` à 360 px et 1440 px |
| **L4** | **Pages** : accueil, 4 services, à propos, légales, 404, SEO (métadonnées, sitemap, `hreflang`, JSON-LD), édition visuelle | Chaque page en FR et EN, 1 H1, Lighthouse ≥ 90 en local |
| **L5** | **Formulaire** : Supabase local + migrations + RLS, validation Zod, Turnstile (clés de test), honeypot, limite par IP, courriels vers Mailpit | Une demande envoyée → ligne en base + 2 courriels visibles dans Mailpit ; tests de succès et d'échec |
| **L6** | **Dashboard** : connexion par lien magique (reçu dans Mailpit), boîte de réception, fiche, statuts, notes, réponse avec modèles Sanity, indicateurs, anonymisation | Un non-admin ne voit rien ; une réponse arrive dans Mailpit et s'ajoute à l'historique |
| **L7** | **Durcissement** : en-têtes de sécurité, revue STRIDE (*security-and-hardening*), accessibilité AA, performance, impeccable `polish` | 0 erreur axe, `pnpm audit` sans faille haute, JS initial < 150 Ko |

Points de contrôle avec toi après **L2**, **L4** et **L6**. Un commit Git par tâche.

### Phase M — mise en ligne (plus tard, sur ton feu vert)

| ID | Étape |
|---|---|
| M1 | Remplacer les valeurs génériques dans Studio · le script `check:placeholders` doit passer à zéro |
| M2 | Dépôt GitHub privé + CI · Supabase cloud (Canada) + migrations · jeu de données Sanity `production` |
| M3 | Netlify (variables saisies par toi), domaine `bimurix.com`, HTTPS, Resend (SPF/DKIM/DMARC), vraies clés Turnstile, webhook Sanity |
| M4 | Checklist *shipping-and-launch* + checklist §17 des docs, Search Console, test de retour arrière |

---

## 9. Ce dont j'ai besoin pour démarrer

1. **Un seul geste en ligne, inévitable** : Sanity stocke le contenu dans son nuage même en local. Crée un projet gratuit « Bimurix » sur sanity.io/manage (ou je lance `npx sanity init` et tu te connectes dans la fenêtre), puis donne-moi son **Project ID** (il n'est pas secret).
2. Pour le seed, crée un **jeton Editor** dans ce projet et colle-le toi-même dans `web/.env.local`. Je ne lis pas et ne copie pas les fichiers `.env`.
3. Ton accord pour commencer **L0 → L1**.

Les infos manquantes (NEQ, téléphone, responsable Loi 25, logiciels, logo) reçoivent des **valeurs génériques**, modifiables plus tard dans Studio.

---

## 10. Risques et parades

| Risque | Parade |
|---|---|
| Tout éditable = risque de casser le design | Blocs conçus d'avance, palette contrôlée, limites de longueur et validations dans Studio, valeurs de secours |
| Studio intégré alourdit le site | Studio isolé sur `/studio` : son code n'est jamais chargé sur les pages publiques (vérifié en L7) |
| Valeurs génériques oubliées à la mise en ligne | Script `check:placeholders` bloquant en M1 |
| Écarts entre le local et le cloud | Mêmes migrations SQL, mêmes variables, préproduction Netlify avant le domaine |
| API d'envoi Mailpit à confirmer (format exact) | Vérifié en L5 ; sinon envoi SMTP vers Mailpit, sans changer le reste |

---

## 11. Skills utilisés (`Downloads\SAAS-CLAUDE-SKILLS\skills\`)

| Étape | Skill |
|---|---|
| L0 | `spec-driven-development`, `planning-and-task-breakdown`, `documentation-and-adrs`, impeccable `init` |
| L1–L6 | `incremental-implementation`, `test-driven-development`, `git-workflow-and-versioning`, `frontend-ui-engineering` |
| L3–L4 | impeccable (construction direction A → `critique` → `audit`), `performance-optimization` |
| L5–L6 | `api-and-interface-design`, `security-and-hardening` |
| L7 | `browser-testing-with-devtools`, impeccable `polish` |
| M | `ci-cd-and-automation`, `shipping-and-launch` |
