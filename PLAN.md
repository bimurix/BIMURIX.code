# BIMURIX — Plan v4 : vitrine des 4 offres à forfaits (local d'abord)

> Remplace le plan v3 (archivé : `docs/archive/2026-11-04_PLAN-v3.md`, étapes L0–L7 terminées).
> Décisions : `docs/decisions/ADR-006-offres-forfaits.md`. Source du contenu :
> `docs/source/2026-11-04_offres-v3-1/offres-bim-v3-1.md` (+ maquette dans `brochure/`).
> Structure du code : `docs/ARCHITECTURE.md`.
> **Tout se fait en local, sur le dataset Sanity `development`. Aucun déploiement avant la phase M.**

## 0. État d'avancement

| Étape | État | Résultat vérifiable |
|---|---|---|
| N0 Cadrage | ✅ 2026-11-10 | ADR-006, ce plan, SPEC, lexique |
| N1 Rangement | ✅ 2026-11-10 | Dossiers datés, `affaires/` hors Git, 9 skills, dataset `development` |
| N2 Sanity | ✅ 2026-11-10 | Un forfait masqué dans Studio disparaît du site |
| N3 Blocs visuels | ✅ 2026-11-10 | Blocs `packages`, `conditions`, `proof` rendus à 360 px et 1440 px |
| N4 Contenu | ✅ 2026-11-10 | Accueil + 4 pages d'offres + FAQ complets en FR et EN (dataset `development`, script `patch-content-n4.mts`) |
| N5 Formulaire et admin | ✅ 2026-11-10 | Demande d'appel : ligne en base, 2 courriels Mailpit, visible dans `/admin` |
| N6 Vérification | ✅ 2026-11-10 | Rapport : `docs/audits/2026-11-10_verification-n6.md` (5 défauts corrigés) |
| M Déploiement | ⏸ sur feu vert | Contenu copié vers `production`, Netlify, GitHub |

Mettre ce tableau à jour à la fin de chaque étape (✅ + date).

### Révision R (2026-11-12) — « intégrer, ne pas remplacer » (ADR-007)

Le client corrige la refonte : les offres du document v3.1 s'**intègrent** au site d'origine. L'historique N0–N6
ci-dessus reste valable pour le code ; le contenu est revu.

| Étape | État | Contenu |
|---|---|---|
| R1 Contenu | ✅ 2026-11-12 | Contenu d'origine restauré dans `development` + 6 services, forfaits, conditions, preuve intégrés ; plus d'appel de 20 minutes ; `patch-content-r1.mts` ; ADR-007 |
| R2 Formulaire | ✅ 2026-11-12 | Formulaire et courriels sans appel de 20 minutes (réglage Studio `callEnabled`, faux par défaut) ; `patch-form-r2.mts` |
| R3 Vérification | ✅ 2026-11-12 | Audit indépendant après R1 et R2 : `docs/audits/2026-11-12_audit-r3.md` ; 3 corrections (accusé sans forfait, menu, tests instables) ; reste à faire relire par le client |

### Révision S (2026-11-12) — la valeur avant le prix (ADR-008)

Le client ne publie plus de prix, de type de forfait ni de délai fixe : six services en trois familles, situations types,
« Qui fait quoi ». Plan de contenu : `docs/source/2026-11-12_plan-contenu-v5.md`. Les forfaits restent dans Studio, masqués.

| Étape | État | Contenu |
|---|---|---|
| S1 Plan de contenu | ✅ 2026-11-12 | Plan v5 (critique, textes avant/après, situations types, choix par défaut) et ADR-008 (commits `8c640d1`, `37b16a7`) |
| S3a Champs et blocs | ✅ 2026-11-12 | Blocs `problems`, `projectCycle`, `scenarios`, `responsibilityTable`, champs de service (famille, nom court, situations, livrables avec usage, besoins, FAQ), gabarit P1 à P11 (commits `50d23cc` à `7d81717`) |
| S4 Défauts de production | ✅ 2026-11-12 | 404 et 308 décidés avant le rendu par le proxy (commit `cf421b3`) |
| S2 Contenu | ✅ 2026-11-12 | Plan v5 appliqué à `development` en FR et EN (`patch-content-s2.mts`, seed à jour) ; forfaits masqués, bandeau éteint, conditions retirées ; champ « Forfait visé » absent du formulaire ; tests transformés |
| S3b Design et images | ✅ 2026-11-12 | Accueil raccourci (services présentés une fois, cycle fondu, livrables en tableau, situations en quatre temps), barre d'action mobile en CSS, tokens de rythme, six schémas au trait et quatre photos Unsplash dans `development` (`patch-design-s3b.mts`) ; critique : `docs/audits/2026-11-12_critique-s3b.md` ; images : `docs/source/2026-11-12_images-s3b.md` |
| S5 Audit | ⏳ | Audit indépendant : fidélité aux faits d'origine, aucun prix publié, FR et EN, 360 px et 1440 px, JS ≤ 150 Ko |

Les sections 3 (pages) et 4 (formulaire) plus bas décrivent l'état N4/N5 ; elles sont remplacées par ADR-007 pour le contenu.

## 1. Règles de travail (toutes les sessions)

1. Lire `CLAUDE.md`, ce plan, `SPEC.md`, `docs/decisions/` et `docs/ARCHITECTURE.md` avant de coder.
2. **Une étape = une session = un ou plusieurs commits** (un par tâche). Ne pas déborder sur l'étape suivante.
3. Dataset : `development` uniquement. Toute commande Sanity (seed, types) se lance avec
   `NEXT_PUBLIC_SANITY_DATASET=development`. Ne jamais écrire dans `production`.
4. Ne jamais lire ni écrire `.env*` (seule exception : `node scripts/db-env.mjs`).
5. Pas de `git push`, pas de Netlify, pas de Supabase cloud.
6. Terminé = `pnpm lint && pnpm typecheck && pnpm test && pnpm build` verts, `pnpm test:e2e` vert,
   rendu vérifié à 360 px et 1440 px en FR et EN.
7. Un test E2E qui dépasse le délai en mode dev sous charge : le relancer seul avant de conclure à un défaut.
8. Aucun texte public dans le code (valeurs de secours seulement). Aucun prix dans le code.
9. Un doute sur une règle de contenu ou d'affaires : ne pas inventer, noter la question dans le rapport final.

## 2. Modèle de contenu (N2)

### Document `service` (libellé Studio : « Offres »)
Champs ajoutés : `visible` (booléen, défaut vrai), `audience` (pour qui, `localeText`),
`responsibilityNote` (qui signe, `localeText`). Un service masqué n'apparaît ni au menu, ni sur l'accueil,
ni dans le sitemap ; son adresse répond 404.

### Document `package` (libellé Studio : « Forfaits »)
| Champ | Type | Note |
|---|---|---|
| `title` | `localeString` | FR obligatoire |
| `code` | chaîne courte | ex. `F-01`, affiché en JetBrains Mono |
| `service` | référence → `service` | obligatoire |
| `priceMode` | `fixed` · `from` · `quote` | `quote` = « sur soumission », aucun montant affiché |
| `price` | nombre entier ($ CA) | requis sauf `quote` |
| `scope` | `localeString` | ex. « zone pilote, jusqu'à 30 spools » |
| `leadTimeDays` | nombre | jours ouvrables |
| `inclusions` | liste de `localeString` | |
| `highlighted` | booléen | un seul forfait mis en avant |
| `visible` | booléen | masqué = absent du site et du formulaire |
| `order` | nombre | |

### Réglage unique `launchSettings` (« Lancement et conditions »)
`bannerEnabled`, `bannerText`, `deadline` (date), `taxNote`, `creditText`, `conditions`
(liste : titre + texte), `professionalNote` (mention ingénieur, ADR-006 n° 11).

### Blocs de page
| Bloc | Rôle | Réglages |
|---|---|---|
| `packages` | Nomenclature des forfaits visibles (tableau de feuille de plan ; liste empilée à 360 px) | titre, filtre par offre (facultatif), afficher la note de taxes |
| `conditions` | Conditions tirées de `launchSettings` | titre |
| `proof` | Chiffres d'un tiers avec source | titre, chiffres (valeur + libellé), **nom et lien de la source obligatoires**, `enabled` |

Réutilisés tels quels : `heroSheet`, `method` (« Comment ça marche »), `pointsList` (« Inclus pour l'atelier
et le chantier »), `faq`, `quoteCta`, `quoteForm`, `richText`, `imageFigure`, `serviceNetworks` (ne liste
que les offres visibles).

## 3. Pages (N4)

| Page | Sections, dans l'ordre |
|---|---|
| Accueil | hero (promesse + « Réserver un appel de 20 minutes » + « Voir les forfaits ») · preuve (2 chiffres + source, ADR-006 n° 21) · forfaits · conditions · inclus · comment ça marche · FAQ · appel final |
| 4 pages d'offres | titre, pour qui, portée, livrables, forfaits de l'offre, responsabilités, appel final |
| À propos | positionnement v3.1 (spécialiste BIM MEP et préfabrication, bilingue, automatisation Dynamo et pyRevit) |
| Soumission | formulaire (N5) |
| Légales, 404 | inchangées |

Contenu FR tiré du document v3.1, réécrit avec le lexique de `CLAUDE.md` §4 ; EN traduit, à relire.
Les anciens textes des services (modélisation générale, TQC) restent dans le seed, `visible: false`.

## 4. Formulaire et tableau de bord (N5)

- Deux champs : **type de demande** (`call` · `quote`) et **forfait visé** (liste des forfaits visibles + « autre »).
- Migration Supabase : colonnes `request_type` et `package_code` sur `quote_requests` (RLS inchangé).
- Validation Zod fail-closed : seuls les codes de forfaits publiés sont acceptés.
- `/admin` : colonne et filtre « type », forfait dans la fiche ; courriels (accusé, notification) adaptés.
- Tests d'abord (`test-driven-development`) : unitaires `submit-quote`, E2E `quote-form` et `admin`.

## 5. Étapes, skills et modèles

| Étape | Skills (`.claude/skills/` ou globaux) | Modèle | Parallèle |
|---|---|---|---|
| N2 | `writing-plans`, `test-driven-development` | Sonnet 5.5 | non (fichiers partagés) |
| N3 | `impeccable`, `web-design-guidelines`, `dispatching-parallel-agents` | Sonnet 5.5 | 3 blocs en parallèle (un dossier chacun) |
| N4 | `subagent-driven-development` | Sonnet 5.5 | FR puis EN ; en parallèle de N3 seulement sur `scripts/seed/` |
| N5 | `test-driven-development`, `systematic-debugging` | Sonnet 5.5 | non (migration) |
| N6 | `verification-before-completion`, revue de code et de sécurité | Fable 5.2 | — |

Fichiers partagés, à modifier **un à la fois** : `src/blocks/schemas.ts`, `src/blocks/render.tsx`,
`src/sanity/schemas/index.ts`, `src/sanity/queries.ts`, `src/sanity/structure.ts`, `src/styles/tokens.css`,
`scripts/seed-sanity.mts`.

## 6. Phase M — déploiement (plus tard, sur feu vert du client)

1. Remplacer les valeurs d'exemple dans Studio ; `pnpm check:placeholders` à zéro.
2. Saisir la date limite (mise en ligne + 60 jours) ; client : téléphone, NEQ et nom légal s'il veut les afficher.
3. Copier le contenu `development` → `production` (export puis import), déployer les schémas.
4. Migration Supabase sur `bimurix-prod`, variables Netlify, déploiement, GitHub (push sur demande).
5. Checklist `shipping-and-launch`, test de retour arrière.

## 7. Questions du client : tranchées

Toutes les questions ouvertes sont tranchées dans ADR-006, décisions 13 à 21 (date limite, courriel, téléphone,
ville, NEQ, responsable Loi 25, garantie, prix à valider, chiffres J.M. Brennan). À appliquer au contenu en N4.
Seuls faits encore attendus du client, sans bloquer : téléphone d'affaires, NEQ, nom légal.
