# CLAUDE.md — projet BIMURIX (site vitrine + dashboard des soumissions)

> Ce fichier **remplace** pour ce dossier le `CLAUDE.md` de `Downloads\` (projet « safer-mvp », location
> de voitures en Algérie), qui ne s'applique pas ici. En cas de conflit, ce fichier prime.

## 0. Avant chaque tâche
1. Lire `PLAN.md`, `SPEC.md`, `docs/decisions/` et `docs/ARCHITECTURE.md`.
2. Une règle de contenu ou métier absente : **ne pas l'inventer**, demander.
3. Tâche touchant plusieurs fichiers : annoncer le plan (fichiers, tests, risques) avant de coder.

## 1. Produit
Entreprise de services BIM au **Québec**, spécialisée en préfabrication MEP. Vitrine de **6 services** (ADR-007) : modélisation BIM et coordination, préfabrication tuyauterie (SysQue),
préfabrication gicleurs (AutoSPRINK), tuyauterie + gicleurs, BIM 7D, TQC et contrôle qualité ; les 4 préfabrications
et le 7D ont des forfaits à prix fixe (ADR-006). Règle : on intègre les offres au site existant, on ne le remplace pas. Site **FR par défaut** (`/`), **EN** sous `/en`.
Objectif : demande de soumission → Supabase → tableau de bord `/admin` → réponse par courriel.

## 2. Stack
Next.js 16 (App Router, Server Components par défaut) · TypeScript strict · Tailwind 4 ·
Sanity 6 (Studio intégré sur `/studio`) · Supabase (Postgres, Auth, RLS) · Zod · Vitest · Playwright.
Courriels : Mailpit en local, Resend en ligne, via `fetch` (pas de SDK). Antispam : Turnstile + honeypot.
Hébergement plus tard : Netlify. Code dans `web/`.

## 3. Isolation locale (ne jamais changer sans raison)
- Next.js : **port 3100**. Supabase : `project_id = "bimurix"`, ports **54421–54429**
  (API 54421, base 54422, tableau 54423, Mailpit 54424).
- Sanity : dataset **`development`** en local (ADR-004 révisé le 2026-11-10) ; `production` = site en ligne,
  intouchable avant la phase M.
- Ne pas toucher aux conteneurs d'autres projets (ex. `derbigo-postgres-1`).
- Rien d'installé globalement ; tout passe par `pnpm` dans `web/`.

## 4. Règles de contenu (non négociables)
- **Tout texte, image et logo public vient de Sanity.** Le code ne contient que des valeurs de secours.
- Champs bilingues `{ fr, en }` ; le FR est obligatoire. Une page EN incomplète n'est pas publiée (Loi 96).
- Aucun faux témoignage, logo client, chiffre, certification, affiliation (RBQ, CMMTQ…) ou membre d'équipe.
- **Prix, délais et conditions** : uniquement dans Sanity, jamais dans le code. Un élément « hypothèse à valider »
  ou « à confirmer » du document d'offres n'est pas publié sans accord du client (ADR-006).
- Chiffre d'un tiers : seulement avec le nom et le lien de la source, attribué à ce tiers.
- Conception, calculs, signature et sceau : toujours attribués à l'ingénieur ou à l'entrepreneur, jamais à Bimurix.
- Valeurs génériques (téléphone 555, NEQ fictif…) toujours marquées comme exemples.
- Lexique de chantier québécois : **soumission** (le prix) et **devis** (le cahier des charges), jamais l'inverse ;
  **dessins d'atelier** ; donneur d'ouvrage ; entrepreneur général, entrepreneur spécialisé ; chargé de projet,
  surintendant, contremaître ; mécanique du bâtiment, tuyauterie, gicleurs, parasismique ; tel que construit (TQC) ;
  courriel. Mesures doubles « 150 m (500 pi) », surfaces en pi², prix « 1 800 $ », « avant TPS et TVQ ».

## 5. Design (direction A, « La feuille de plan »)
- Voir `design/directions-visuelles.html` et `design/PRODUCT.md`.
- Polices : Archivo (titres en largeur étendue, texte normal), JetBrains Mono **uniquement** pour les
  données (cotes, numéros de feuille, références).
- Les forfaits se présentent en nomenclature (tableau de feuille de plan), pas en cartes (ADR-006).
- Interdits : Inter en titre, petits titres au-dessus des titres (kickers), grilles de cartes identiques,
  dégradés, texte en dégradé, verre dépoli, statistiques inventées, emoji en guise d'icônes.
- Couleurs et tailles uniquement via les tokens (`web/src/styles/tokens.css`) ; aucune valeur en dur.
- Mobile d'abord (360 px), propriétés logiques (`ms-`, `pe-`…), cibles tactiles ≥ 44 px, AA.

## 6. Sécurité et données
- Ne jamais lire, écrire ou recopier `.env*` : l'utilisateur saisit lui-même les secrets.
  Seule exception, autorisée par le client le 2026-11-04 : lancer `node scripts/db-env.mjs`, qui génère
  `web/.env.development.local` avec les clés de la pile Supabase **locale** (valables seulement sur ce PC)
  et les clés de test Turnstile, plus le nom du dataset Sanity de développement (non secret, ajouté le 2026-11-10).
  Ne jamais afficher ni recopier son contenu.
- Toute entrée validée par Zod côté serveur. Clé `service_role` Supabase uniquement côté serveur.
- RLS activé sur toutes les tables ; aucune lecture publique des demandes.
- Loi 25 : consentement horodaté, durée de conservation, anonymisation (jamais de `DELETE` de demande
  dans le code applicatif).
- Un succès de formulaire ne s'affiche qu'après l'insertion réelle en base.

## 7. Conventions
- Code, tables et colonnes en anglais ; textes d'interface admin en français.
- Fichiers `kebab-case`, composants `PascalCase.tsx`. Fichier ≤ 300 lignes, fonction ≤ 40 lignes.
- Un bloc de page = un dossier `web/src/blocks/<bloc>/` (schéma, requête GROQ, composant).
- Rangement et sens des dépendances : `docs/ARCHITECTURE.md`. Documents datés `AAAA-MM-JJ_` ; on archive, on ne supprime pas.
- Pas de nouvelle dépendance sans l'indiquer et la justifier.
- Commentaires : le **pourquoi**, avec référence (`// decision: ADR-003`).

## 8. Commandes (dans `web/`)
```bash
pnpm dev            # http://localhost:3100
pnpm lint && pnpm typecheck && pnpm test && pnpm build
pnpm test:e2e       # Playwright
pnpm db:start       # Supabase local isolé (Docker)
pnpm db:stop
```

## 9. Interdits sans accord explicite
`git push`, création du dépôt GitHub, déploiement Netlify, configuration DNS ou Resend, écriture dans
le dataset Sanity `production` autre que `pnpm seed` sans `--force` (création des documents absents), suppression de tests ou de règles RLS.

## 10. Terminé =
Tests verts · lint, typecheck, build OK · rendu vérifié à 360 px et 1440 px en FR **et** EN ·
aucun texte public codé en dur · docs et décisions à jour · un commit par tâche.
