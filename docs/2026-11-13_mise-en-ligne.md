# Mise en ligne du site Bimurix — la liste complète, dans l'ordre

Rédigée par l'audit T7, le 2026-11-13. **Rien de ce qui suit n'a été fait** : le site tourne seulement sur votre ordinateur. Chaque étape en ligne se fait **sur votre feu vert**, une à la fois.

Qui : **Client** = vous (comptes, mots de passe, décisions) ; **Claude** = moi, une fois que vous m'avez donné l'accès ou la valeur.
Règle : aucun mot de passe ni aucune clé secrète ne se colle dans une conversation ; vous les saisissez vous-même dans la page du service concerné.

## A. Avant tout : ce que le site doit contenir

| # | Étape | Qui | Comment vérifier |
|---|---|---|---|
| A1 | **Remplacer les valeurs d'exemple dans Studio** (`/studio`, dataset `development`). Voir la liste exacte juste en dessous. | Client (Claude peut saisir si vous m'envoyez les vraies valeurs) | Dans le dossier `web`, la commande `pnpm check:placeholders` (avec `NEXT_PUBLIC_SANITY_DATASET=development`) répond « Aucune valeur d'exemple ». Aujourd'hui elle en signale **31**. |
| A2 | **Faire valider les pages légales** (confidentialité et conditions) par un conseiller juridique. Il corrige au besoin ; on retire ensuite la phrase « doit être validé par un conseiller juridique » en tête des deux pages et la mention « à faire valider » dans les conditions. | Client | Les deux pages ne contiennent plus « validé par un conseiller » ; le contrôle de l'étape A1 ne les signale plus. |
| A3 | **Décider du sort de la section « Projets »** : mettre de vrais projets (sans nom de client ni lieu précis sans leur accord), **ou la couper** (interrupteur « Afficher » dans Studio → Accueil → Projets). | Client | Le contrôle A1 ne signale plus les 3 fiches « Exemple — à remplacer ». |
| A4 | **Relire le texte en anglais** (surtout accueil, services, formulaire) : il a été traduit, pas relu par une personne. Remarque connue : sur les pages en anglais, le téléphone, le nom légal et le NEQ gardent la mention « (exemple) » en français — ces champs ne sont pas traduits ; ils disparaîtront quand les vraies valeurs seront saisies. | Client | Lecture de `/en` et des pages `/en/services/...`. |
| A5 | **Photos** : les fiches de projets 1 et 2 n'ont plus de photo (source non retrouvée / sujet trompeur). Les autres photos viennent d'Unsplash (auteurs dans `docs/source/2026-11-12_images-s3b.md`). Remplacer par de vraies photos de projets dès que possible. La photo du fondateur et son nom sont vides : rien ne s'affiche tant que vous ne les remplissez pas. | Client | Studio → Accueil / À propos. |

**Ce que `pnpm check:placeholders` signale aujourd'hui (dataset `development`) :**
- **Réglages du site** : téléphone (`514 555-0199 (exemple)`), nom légal (`Bimurix inc. (exemple)`), NEQ (`1234567890 (exemple)`).
- **Accueil, section Projets** : 3 fiches × (titre et pastille « Exemple — à remplacer ») en FR et EN = 12 lignes.
- **Page Confidentialité** : date « Dernière mise à jour… (exemple) » (FR et EN) ; la phrase de validation juridique (FR et EN) ; « raison sociale et NEQ : à compléter — exemple » (FR et EN) ; « lieux exacts à confirmer — exemple » (FR et EN) ; « 30 jours — exemple, à confirmer » pour les journaux de l'hébergeur (FR et EN).
- **Page Conditions** : date « Dernière mise à jour… (exemple) » (FR et EN) ; la phrase de validation juridique (FR et EN) ; « à faire valider par un conseiller juridique » dans la dernière phrase (FR et EN).

## B. Comptes et services en ligne (à créer, rien n'existe encore)

| # | Étape | Qui | Comment vérifier |
|---|---|---|---|
| B1 | **Supabase en ligne** : créer le projet `bimurix-prod` en région **Canada (Montréal)**. Activer l'extension `pg_cron`. Appliquer les **7 migrations** du dossier `web/supabase/migrations/` (dans l'ordre des noms). Fermer les inscriptions (« Allow new users to sign up » désactivé). Adresse de retour autorisée : **seulement** `https://bimurix.com/admin/auth/callback` ; `site_url` = `https://bimurix.com` ; durée du lien de connexion 600 s ; envoi des courriels de connexion par Resend (SMTP). Créer l'administrateur avec `pnpm admin:add contact@bimurix.com` (Claude, avec les clés que vous saisissez). Activer les sauvegardes. | Client crée le projet et saisit les clés ; Claude applique les migrations | Dans l'éditeur SQL : `select jobname, active from cron.job` montre 3 tâches actives ; toutes les tables de `public` ont RLS ; un visiteur non connecté ne lit aucune demande. |
| B2 | **Cloudflare Turnstile** : créer le widget pour `bimurix.com`. Vous obtenez une clé de site (publique) et une clé secrète. Les clés de test sont **refusées** en ligne (alerte dans les journaux). | Client | La page Soumission en ligne affiche le contrôle et accepte un envoi réel. |
| B3 | **Resend** : ajouter et **vérifier le domaine** `bimurix.com` (SPF, DKIM, DMARC) ; adresse d'envoi `contact@bimurix.com`. | Client (réglages DNS) | Resend affiche « Verified » ; un courriel de test arrive dans une vraie boîte (pas dans les pourriels). |
| B4 | **Sanity** : dataset `production` (existe déjà, ne le touchez pas avant l'étape C1). Limiter les origines **CORS** à `https://bimurix.com` (et l'adresse Netlify provisoire le temps des essais). Activer la double authentification sur les comptes ayant accès à Studio. Créer un jeton de **lecture** (jamais d'écriture) si on veut lire les brouillons. | Client | La page `/studio` ne s'ouvre que pour les comptes autorisés. |
| B5 | **Netlify** : créer le site relié au dépôt (le dépôt GitHub n'existe pas encore : à créer sur votre feu vert), forcer HTTPS, brancher le domaine `bimurix.com` (DNS). Le fichier `netlify.toml` est prêt (dossier `web`, Node 24, extension Next.js). | Client crée le compte et le DNS ; Claude prépare | Le domaine répond en HTTPS avec le site. |
| B6 | **Variables d'environnement Netlify** (noms seulement ; vous saisissez les valeurs) : `NEXT_PUBLIC_SITE_URL` (= `https://bimurix.com`, **production seulement** : sur les aperçus, ne pas la mettre, ils restent ainsi non indexés) · `NEXT_PUBLIC_SANITY_PROJECT_ID` · `NEXT_PUBLIC_SANITY_DATASET` (= `production`) · `NEXT_PUBLIC_SUPABASE_URL` · `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` · `SUPABASE_SECRET_KEY` · `NEXT_PUBLIC_TURNSTILE_SITE_KEY` (obligatoire **au build**) · `TURNSTILE_SECRET_KEY` · `IP_HASH_SALT` (longue valeur aléatoire, **obligatoire** : sans elle la limite d'envois par IP ne fonctionne pas) · `MAIL_TRANSPORT` (= `resend`) · `RESEND_API_KEY` · `SANITY_API_READ_TOKEN` (facultatif). **Ne pas définir** `NEXT_PUBLIC_SANITY_LIVE`. | Client | Dans Netlify, les 11 noms existent ; le build réussit ; le journal ne contient pas « ALERTE : limite par IP inopérante ». |

## C. Contenu en ligne

| # | Étape | Qui | Comment vérifier |
|---|---|---|---|
| C1 | **Copier le contenu `development` → `production`** (export puis import du dataset, images comprises), **après** A1 à A3. Déployer le schéma de Studio. C'est la seule écriture dans `production` ; elle se fait sur votre feu vert explicite. Ne pas relancer `pnpm seed` : le seed n'a pas les textes légaux, les titres de référencement ni les photos (voir le rapport T7, § Reste). | Claude, sur votre feu vert | `NEXT_PUBLIC_SANITY_DATASET=production pnpm check:placeholders` répond « Aucune valeur d'exemple » ; les 11 pages FR et EN s'affichent. |
| C2 | **Revalidation à la publication** : créer dans Sanity un webhook (contenu publié) vers une route de revalidation du site. **À construire** (non fait) ; sans elle, une modification dans Studio apparaît seule en **15 minutes au plus** (cache de Next), jamais instantanément. Le site envoie `Cache-Control: s-maxage=31536000` : vérifier sur Netlify que la modification se voit bien. | Claude (code) + Client (webhook dans Sanity) | Modifier un titre dans Studio, publier, recharger la page : le titre change en moins de 15 min (ou tout de suite avec le webhook). |

## D. Mise en ligne et contrôles

| # | Étape | Qui | Comment vérifier |
|---|---|---|---|
| D1 | **Premier déploiement sur l'adresse provisoire Netlify** (pas encore le domaine). | Claude | Les 22 adresses répondent ; en-tête `X-Robots-Tag: noindex` présent (aperçu non indexé). |
| D2 | **Essai complet sur l'adresse provisoire** : envoyer une vraie demande ; vérifier la ligne dans la base, les **deux courriels** (accusé au visiteur, notification à `contact@bimurix.com`), l'apparition dans `/admin` ; se connecter à `/admin` par lien magique ; répondre à la demande ; anonymiser la demande d'essai. | Client + Claude | Les deux courriels arrivent ; le lien de connexion fonctionne une fois et expire après 10 min. |
| D3 | **Brancher le domaine** `bimurix.com` et mettre `NEXT_PUBLIC_SITE_URL` en production. | Client + Claude | `https://bimurix.com` répond ; **plus** de `noindex` ; `/robots.txt` et `/sitemap.xml` (22 adresses) répondent ; `/.well-known/security.txt` répond. |
| D4 | **Google Search Console** : ajouter le domaine, déposer `https://bimurix.com/sitemap.xml`. Fiche d'établissement Google **seulement** avec un téléphone et un nom légal réels. | Client | Le plan du site est « Réussite » dans la Search Console. |
| D5 | **Contrôles après mise en ligne** (par Claude) : en-têtes (CSP, HSTS), pas de clé secrète dans le code envoyé au navigateur, JSON-LD valide (outil Google « Résultats enrichis » : non testé ici), `hreflang`, 404 réel, redirection de l'ancienne adresse « préfabrication MEP », JS initial ≤ 155 Ko, LCP ≤ 2,5 s sur un vrai téléphone, formulaire, `/admin` en `no-store`. | Claude | Rapport de contrôle daté dans `docs/audits/`. |
| D6 | **Test de retour arrière** : Netlify garde chaque déploiement ; savoir **republier le déploiement précédent en un clic** (Deploys → déploiement précédent → « Publish deploy »). L'essayer une fois avant l'annonce. Pour Sanity : l'historique de chaque document permet de revenir en arrière ; sauvegarder l'export `development` avant C1. Pour Supabase : sauvegardes quotidiennes activées en B1. | Client + Claude | Le site précédent revient en moins d'une minute après le clic. |
| D7 | **Après l'annonce** : boîte `contact@bimurix.com` protégée par une validation en deux étapes (elle protège aussi `/admin`) ; procédure Loi 25 (demande d'accès ou de retrait : réponse en 30 jours, bouton « Anonymiser » dans `/admin`, nettoyage des courriels reçus tous les trimestres). Documents internes à préparer, hors dépôt : registre des incidents, évaluation des facteurs relatifs à la vie privée (Netlify, Resend, Cloudflare), procédure de réponse. | Client | Voir `docs/audits/2026-11-13_securite-t5.md`, § 3. |

## E. Facultatif, plus tard
- Mesure des visites : « Netlify Analytics » (sans script ni témoin ; payant ; à ajouter à la politique de confidentialité).
- Remplacer les schémas d'exemple par de vrais livrables anonymisés ; ajouter le nom et la photo du fondateur.
- Menus du site sans JavaScript (gagnerait ≈ 4 Ko ; voir ADR-010).
