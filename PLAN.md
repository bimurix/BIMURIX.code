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
| N2 Sanity | ⏳ | Un forfait masqué dans Studio disparaît du site |
| N3 Blocs visuels | ⏳ | Blocs `packages`, `conditions`, `proof` rendus à 360 px et 1440 px |
| N4 Contenu | ⏳ | Accueil + 4 pages d'offres + FAQ complets en FR et EN |
| N5 Formulaire et admin | ⏳ | Demande d'appel : ligne en base, 2 courriels Mailpit, visible dans `/admin` |
| N6 Vérification | ⏳ | Tout vert, revue de code et de sécurité |
| M Déploiement | ⏸ sur feu vert | Contenu copié vers `production`, Netlify, GitHub |

Mettre ce tableau à jour à la fin de chaque étape (✅ + date).

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
| Accueil | hero (promesse + « Réserver un appel de 20 minutes » + « Voir les forfaits ») · preuve (masquée sans lien) · forfaits · conditions · inclus · comment ça marche · FAQ · appel final |
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
2. Client : confirmer ou retirer chaque élément « hypothèse à valider » (ADR-006 n° 3) et fournir le lien de l'étude de cas.
3. Copier le contenu `development` → `production` (export puis import), déployer les schémas.
4. Migration Supabase sur `bimurix-prod`, variables Netlify, déploiement, GitHub (push sur demande).
5. Checklist `shipping-and-launch`, test de retour arrière.

## 7. Questions ouvertes pour le client (ne bloquent pas le développement)

- Date limite des forfaits de lancement.
- Courriel, téléphone, ville affichée (Longueuil ?), NEQ, responsable Loi 25.
- Lien exact de l'étude de cas J.M. Brennan.
- Garantie de correction gratuite : confirmée ?
- Prix « hypothèse à valider » : lesquels publier ?
