# Plan d'import du contenu dans Sanity `production` (M1)

Préparé le 2026-11-13. **Rien n'a été écrit dans `production` ni dans `development`.** Seules lectures : export de `development`, export (sauvegarde) de `production`.
Projet Sanity `49ul0nhr`. Les fichiers sont dans `web/.golive/` (ignoré par Git, jamais commité).

| Fichier | Contenu |
|---|---|
| `web/.golive/backup-production-2026-11-13.tar.gz` | Sauvegarde de `production` : 16 documents, 3 assets (31 Ko, non vide, relue) |
| `web/.golive/production-ready.tar.gz` | Contenu à importer : 26 documents, 18 assets |
| `web/.golive/transformations.md` | Chaque champ modifié, avant → après (23 changements) |
| `web/.golive/verification.md` | Résultat des contrôles automatiques |

Régénérer l'export : `cd web && node scripts/prepare-production.mts` (lit `development` seulement, refuse toute autre source ; session `sanity login` requise).

## Ce qui change dans l'export
- **Vidés** : `settings.phone`, `settings.legalName`, `settings.neq` (le site n'affiche rien quand le champ est vide).
- **Projets** : bloc « Projets » de l'accueil coupé (`enabled: false`) **et ses 3 fiches retirées** : `check:placeholders` ne tient pas compte de l'interrupteur, donc les fiches d'exemple auraient continué d'être signalées.
- **Pages légales** (confidentialité, conditions, FR et EN, 16 phrases) : voir `transformations.md`. Résumé :
  - date → « Dernière mise à jour : 13 novembre 2026 » / « Last updated: November 13, 2026 » ;
  - phrase « doit être validé par un conseiller juridique avant la mise en ligne » retirée (la phrase « Ce texte décrit ce que le site fait aujourd'hui. » reste) ;
  - « Bimurix (raison sociale et numéro d'entreprise… à compléter — exemple) est responsable » → « Bimurix est responsable » (le responsable reste « Fondateur de Bimurix, contact@bimurix.com ») ;
  - « notamment aux États-Unis (lieux exacts à confirmer — exemple) » → « notamment aux États-Unis ; les lieux exacts dépendent de chaque fournisseur » (EN : « the exact locations depend on each provider ») ;
  - journaux de l'hébergeur : « (30 jours — exemple, à confirmer) » retiré ; il reste « la courte durée prévue par ce fournisseur » ;
  - conditions : « (à faire valider par un conseiller juridique) » retiré après « les tribunaux du Québec sont compétents ».
- Rien d'autre : textes, images, forfaits masqués, réglages inchangés.
- **À relire par le client et son conseiller** : la validation juridique reste sur la liste du client (A2 de `2026-11-13_mise-en-ligne.md`) ; le texte est publié sans la mention.

## Contrôles faits (voir `verification.md`)
Aucune valeur d'exemple (`isPlaceholder`, export et archive relue) ; 26/26 documents et 18/18 assets comme `development` ; références intactes ; aucun champ EN vide quand le FR est rempli ; aucun brouillon ni document système (types : emailTemplates, footer, formSettings, launchSettings, navigation, package, page, redirect, service, settings, uiStrings).

## Comparaison avec `production`
- **Dans `production` mais absents de l'export : aucun** → rien ne reste en place par oubli, rien à retirer.
- **Remplacés (16)** : formSettings, page-home, footer, service-modelisation, service-bim-7d, service-tqc, service-prefabrication, page-terms, uiStrings, page-about, page-quote, page-privacy, navigation, emailTemplates, page-not-found, settings. (L'ancien contenu est dans la sauvegarde.)
- **Créés (10)** : package-f-01 à f-05 (forfaits masqués), service-combinee, service-gicleurs, redirect-prefab-fr, redirect-prefab-en, launchSettings.
- Assets : 3 en `production`, 18 dans l'export.
- **Compatibilité du schéma** : `sanity documents validate` (schéma actuel du code, contre `development`) : 24 documents valides, 2 erreurs **déjà présentes dans `development`**, hors transformations : `navigation` (item `k00eh`, lien externe `/#services`) et `page-home` (CTA `k0082`, lien externe `#services`) : Studio juge « pas une URL valide » des ancres. Le site les affiche correctement ; elles n'empêchent pas l'import (l'import ne valide pas), mais Studio les signalera à la prochaine modification de ces deux champs. Le schéma **n'a pas été déployé** et n'a pas besoin de l'être pour l'import (Studio intégré, voir C1).

## Commandes (à lancer par le pilote, dans `web/`, après confirmation du client)
Le dataset cible doit être explicite. Session Sanity requise (`pnpm exec sanity login`) avec droit d'écriture sur `production`.

**1. Sauvegarde préalable** (déjà faite le 2026-11-13 ; à refaire juste avant l'import si `production` a bougé) :
```bash
pnpm exec sanity dataset export production .golive/backup-production-2026-11-13.tar.gz --overwrite
```

**2. Import avec remplacement des documents existants** :
```bash
pnpm exec sanity dataset import .golive/production-ready.tar.gz production --replace
```
`--replace` remplace les documents de même `_id` (les 16 existants) ; les 10 autres sont créés. Il ne supprime pas les documents absents de l'archive (il n'y en a aucun). Les assets sont téléversés, ceux déjà présents sont réutilisés (pas de doublon).

**3. Retour arrière** (à partir de la sauvegarde ; remet les 16 documents d'origine) :
```bash
pnpm exec sanity dataset import .golive/backup-production-2026-11-13.tar.gz production --replace
```
Il faut aussi retirer les 10 documents créés par l'import, car `--replace` ne les supprime pas : `package-f-01`…`package-f-05`, `service-combinee`, `service-gicleurs`, `redirect-prefab-fr`, `redirect-prefab-en`, `launchSettings`, par exemple
```bash
pnpm exec sanity documents delete package-f-01 package-f-02 package-f-03 package-f-04 package-f-05 service-combinee service-gicleurs redirect-prefab-fr redirect-prefab-en launchSettings --dataset production
```
(c'est une suppression : à confirmer avec le client au moment voulu ; les brouillons éventuels seraient `drafts.<id>`.) L'historique de chaque document dans Studio permet aussi de revenir en arrière.

## Contrôles après import
1. `NEXT_PUBLIC_SANITY_DATASET=production pnpm check:placeholders` → « Aucune valeur d'exemple ».
2. `pnpm exec sanity documents query '*[_type=="settings"][0]{phone,legalName,neq}' --dataset production` → trois champs nuls.
3. Nombre de documents : 26, assets : 18 (`sanity documents query 'count(*)'` ; `count(*[_type=="sanity.imageAsset" || _type=="sanity.fileAsset"])`).
4. Aucun brouillon : `*[_id in path("drafts.**")]` → vide.
5. Ouvrir les 11 pages FR et EN (accueil, services, forfaits masqués absents, soumission, à propos, confidentialité, conditions, 404) ; l'accueil n'a plus la section Projets ; pas de téléphone/NEQ/nom légal affichés ; JSON-LD sans téléphone ni NEQ ; dates des pages légales = 13 novembre 2026.
6. Le site en ligne actuel lit `production` : vérifier https://www.bimurix.com juste après (les anciens liens et la redirection « préfabrication MEP » doivent répondre ; le contenu se rafraîchit en 15 min au plus, cache de Next).
7. Attention : l'ancien site en ligne (autre version du code) lira un contenu à la structure plus récente : importer **au moment du déploiement du nouveau code**, ou accepter un affichage dégradé entre les deux.

## Point 1 — adresse publique : `https://www.bimurix.com` (avec `www`)
Les documents du projet écrivent `https://bimurix.com`. À trancher (forme canonique) puis rendre **tout** cohérent :
- **`NEXT_PUBLIC_SITE_URL`** (Netlify) : doit être l'adresse canonique exacte, sans barre finale.
- **Code, deux constantes à aligner** : `web/src/lib/seo.ts:10` (`siteUrl`, valeur par défaut : canoniques, `hreflang`, JSON-LD, Open Graph, plan du site `sitemap.ts`, `robots.ts` qui s'en servent) et **`web/src/lib/indexing.ts:2` (`PRODUCTION_SITE`)**. ⚠ Si `NEXT_PUBLIC_SITE_URL=https://www.bimurix.com` alors que `PRODUCTION_SITE` vaut `https://bimurix.com`, le site se croit en aperçu et envoie **`noindex`** (indexing.ts:10) : changer la constante avec la variable, ou inversement.
- **Supabase (Auth)** : `site_url` et `additional_redirect_urls` du projet en ligne = `https://www.bimurix.com/admin/auth/callback` (le fichier local `supabase/config.toml` ne porte que localhost ; les réglages en ligne se font dans le tableau de bord). Le lien de connexion échoue si l'adresse ne correspond pas exactement.
- **CORS Sanity** : origine `https://www.bimurix.com` (et l'adresse Netlify provisoire).
- **Netlify / DNS** : domaine principal `www.bimurix.com`, redirection de l'apex `bimurix.com` vers `www` (ou l'inverse) ; Search Console : propriété de domaine ; **Turnstile** et **Resend** (domaine d'envoi : `bimurix.com` couvre les deux, l'expéditeur reste `contact@bimurix.com`).
- Documents : `docs/2026-11-13_mise-en-ligne.md` (B1, B2, B4, B6, D3, D4) et `PLAN.md`/`SPEC.md` à mettre à jour selon la décision.

## Point 2 — migrations Supabase pas encore appliquées en ligne
Relues : `20261110000000`, `20261113100000`, `20261113110000`, `20261113120000`.
- **Extension** : `pg_cron` est requis. `20261113110000` et `20261113120000` appellent `cron.schedule(...)` ; `20261104010000` (déjà prévue, plus ancienne) fait `create extension if not exists pg_cron`. Dans Supabase, l'activer d'abord dans Database → Extensions (comme déjà prévu en B1) ; sinon les migrations 6 et 7 échouent avec « schema cron does not exist ».
- **Ordre** : l'ordre des noms suffit ; les quatre dépendent des trois premières (`quote_requests`, `quote_messages`, `is_admin()`, `anonymize_expired_quotes`). Si on les applique toutes les sept d'un coup (cas d'une base neuve en ligne : c'est ce que dit B1), aucun ordre particulier au-delà du nom de fichier.
- **Sûreté sur une base qui contient déjà de vraies demandes** :
  - `20261110000000` : ajoute `request_type` (`not null default 'quote'`, rempli pour les lignes existantes) et `package_code` (nul) : sans perte, verrou bref.
  - `20261113100000` : ne fait que des `create`/`create or replace` de fonctions ; ne touche aucune ligne. La tâche de rétention existante appelle la même fonction (`anonymize_expired_quotes`), remplacée telle quelle.
  - `20261113110000` : **réduit** les droits : `authenticated` ne peut plus modifier que `status` et `last_reply_at`. Le tableau de bord n'en modifie pas d'autres (d'après le commentaire de la migration et le test `db-security.test.ts` ; non revérifié dans le code de `/admin`). Crée une 2e tâche cron à 3 h 30. `create function` sans `or replace` : ne pas la rejouer deux fois (erreur « already exists », sans dommage).
  - `20261113120000` : nouvelle table, aucune donnée existante touchée ; `cron.schedule` avec nom de tâche : rejouable sans doublon côté cron, mais pas le `create table`.
  - Résumé : sûres pour des demandes réelles, aucune ne supprime ni ne réécrit de données de visiteurs. Recommandation : sauvegarde Supabase manuelle avant, appliquer dans l'ordre des noms, puis `select jobname, active from cron.job` (3 tâches : `bimurix-anonymize-expired`, `bimurix-purge-ip-hashes`, `bimurix-purge-login-attempts`).
- Non vérifié : je n'ai exécuté ces fichiers contre aucune base en ligne (ils sont couverts par les tests locaux du projet, non relancés ici).

## Non vérifié
- Import réel et rendu du site sur `production` (rien n'a été écrit).
- Que la section « Projets » désactivée n'est pas référencée ailleurs (menu, ancre `#projets`).
- Rendu des pages légales après réécriture (relues dans l'export, pas dans un navigateur).
