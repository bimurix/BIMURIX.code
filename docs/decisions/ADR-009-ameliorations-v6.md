# ADR-009 — Améliorations v6 : confiance, preuve, images, mouvement, sans changer la structure

**Statut** : accepté (2026-11-13) — décisions prises par Claude sur délégation du client (« toute question se règle par une
recommandation que l'on applique »), à relire par le client. Critique : `docs/audits/2026-11-13_critique-t1.md`.
Détail du travail : `docs/source/2026-11-13_cahier-ameliorations-v6.md`.

## Contexte
Le site (six services en trois familles, sans prix, ADR-008) explique bien ce que Bimurix fait. La critique T1 montre qu'il
ne prouve pas que l'entreprise existe (ni téléphone, ni nom légal, ni NEQ, ni projet), qu'il ne dit pas pourquoi choisir
Bimurix, que l'accueil est trop long et que les pages manquent d'images et de mouvement.
Le client demande d'aller plus loin **sans changer la structure ni la direction visuelle A**. Pour les faits qu'il n'a pas
encore fournis, il veut **une valeur générique visible**, qu'il remplacera dans Studio.

## Décisions

| # | Décision | Pourquoi |
|---|---|---|
| 1 | **Téléphone, nom légal et NEQ s'affichent, avec une valeur d'exemple marquée.** Valeurs : téléphone `514 555-0199 (exemple)` ; nom légal `Bimurix inc. (exemple)` ; NEQ `1234567890 (exemple)`. **Remplace ADR-006 n° 15 et n° 17** et la partie « restent vides ou non affichés » de ADR-008 n° 9. | Consigne du client. Les numéros 555-0100 à 555-0199 sont réservés aux exemples : ils n'appartiennent à personne. Le site est conçu pour montrer ces preuves ; le client n'a qu'à les remplacer. |
| 2 | **Format exact du marquage** : la valeur se termine par une espace puis `(exemple)` en français, `(example)` en anglais — minuscules, entre parenthèses, à la fin de la valeur, dans le champ lui-même (pas ajouté par le code). Pour une fiche entière (projet), une pastille visible **« Exemple — à remplacer »** / **« Example — to be replaced »** s'ajoute, et le titre de la fiche se termine aussi par `(exemple)` / `(example)`. | Une seule règle, lisible par le visiteur, par le client dans Studio et par le script de contrôle. Conforme à `CLAUDE.md` § 4 (« valeurs génériques toujours marquées comme exemples »). |
| 3 | **`pnpm check:placeholders` bloque la mise en ligne tant qu'il reste une valeur d'exemple.** Le script cherche déjà `555-01`, `1234567890`, `(exemple)`, `(example)` ; on y ajoute `Exemple — à remplacer` et `Example — to be replaced` (même liste dans `scripts/seed/helpers.mts`). Phase M, étape 1 : le script doit répondre « Aucune valeur d'exemple ». | Aucune valeur fausse ne peut partir en ligne par oubli. |
| 4 | **Une valeur d'exemple ne devient jamais un lien ni une donnée structurée.** Un téléphone marqué s'affiche en texte (pas de lien `tel:`) ; téléphone, nom légal et NEQ marqués sont **exclus des données structurées** (JSON-LD) et des métadonnées. | Un moteur de recherche ou un téléphone ne doit jamais prendre un exemple pour un fait. |
| 5 | **Où s'affichent ces valeurs** : pied de page (téléphone sous le courriel ; nom légal et NEQ sur la ligne du bas) ; page À propos (fiche « L'entreprise ») ; page Soumission (colonne de réassurance : téléphone) ; politique de confidentialité, article 1 (nom légal). Un champ vide n'affiche rien, comme aujourd'hui. | Ce sont les endroits où un entrepreneur cherche à vérifier une entreprise. |
| 6 | **Section « Projets »** : nouveau bloc de page, présenté en **registre** (tableau de feuille de plan : type de bâtiment, discipline, ce qui a été livré, outils), pas en cartes. Trois fiches d'exemple, toutes marquées (décision 2). **Aucun nom de client, aucun lieu précis, aucun chiffre de gain, aucun témoignage.** Le bloc a un interrupteur dans Studio ; sans projet réel à la mise en ligne, il se coupe. | Le client saisira ses vrais projets sans développeur. Direction A (ADR-006 n° 6) : nomenclature, pas grille de cartes. |
| 7 | **Aucune personne inventée.** Le rôle « Fondateur » reste sans nom (ADR-006 n° 18). Des champs facultatifs « Nom », « Photo » et « Mot du fondateur » sont ajoutés dans Studio, **vides** : rien ne s'affiche tant que le client ne les remplit pas. | `CLAUDE.md` § 4 : aucun faux membre d'équipe. Un nom de personne marqué « (exemple) » serait pire que rien. |
| 8 | **Section « Pourquoi Bimurix » sur l'accueil**, écrite seulement avec les faits déjà publiés : SysQue et AutoSPRINK dans la même équipe, Grand Montréal, français et anglais, expérience en construction modulaire, automatisation avec Dynamo et pyRevit, partage clair des responsabilités. **Aucune phrase sur les concurrents**, aucun chiffre. | Répond au dessinateur interne et au sous-traitant éloigné sans rien affirmer d'invérifiable. |
| 9 | **Nouveau titre d'accueil** : « Des modèles BIM qui se fabriquent. Moins de surprises au chantier. » (EN : « BIM models you can build from. Fewer surprises on site. »). Accroche ramenée à deux phrases. | Dit la spécialité (préfabrication) avec un fait existant : « ce qui est dessiné doit pouvoir se fabriquer ». |
| 10 | **L'accueil se resserre sans perdre de section utile** : situations types en deux temps sur l'accueil (quatre temps sur les services) ; « Qui fait quoi » en version courte sur l'accueil (tableau complet ailleurs) ; « Ce qu'il faut nous envoyer » retiré de l'accueil (il reste sur les services et la page Soumission). Cibles : moins de 7 500 px à 1440 px et moins de 11 500 px à 360 px. | La structure générale ne change pas ; la longueur baisse malgré deux sections ajoutées. |
| 11 | **Le champ « Budget approximatif » du formulaire est masqué** (réglage Studio, valeur gardée en base et dans le code). | Seul « $ » du site ; contraire à « le prix se donne sur soumission » (ADR-008). Tranche le point laissé ouvert par l'audit S5. |
| 12 | **La promesse « Nous vous répondons d'ici un jour ouvrable » s'affiche près de chaque bouton de soumission** et à côté du formulaire. On n'écrit ni « gratuit » ni « sans engagement » : ce ne sont pas des faits confirmés. | Seul engagement de délai autorisé (`CLAUDE.md` § 1). |
| 13 | **Icônes : un jeu de symboles au trait dessiné pour le site**, inspiré des symboles de plans de mécanique et de protection incendie. SVG rendu côté serveur, couleur héritée du texte, **aucune bibliothèque d'icônes, aucun emoji**. Grille 24 px, trait 1,5 px. | Direction A ; aucune dépendance nouvelle ; zéro script. |
| 14 | **Photos : banque Unsplash, sujets de métier seulement**, toujours légendées « Photo d'illustration » / « Illustrative photo », sans logo, marque, visage reconnaissable ni lieu identifiable ; texte alternatif qui décrit l'image, jamais Bimurix. Source et auteur consignés dans `docs/source/`. Les vrais livrables du client remplaceront les schémas dès qu'il les fournit (champ déjà en place). | ADR-008 n° 5, étendu à plus d'emplacements. |
| 15 | **Mouvement : CSS seulement, zéro script de plus.** Durées et courbes en tokens ; tout s'arrête avec `prefers-reduced-motion` ; un navigateur qui ne connaît pas les animations liées au défilement affiche le contenu immobile et complet. **Jamais d'animation sur le titre ni sur l'image du premier écran.** Transitions entre pages : **non retenues** (elles demandent du script dans Next ; à rouvrir seulement si le JS initial reste sous 150 Ko, mesure à l'appui). | Budget JS à 149,6 Ko sur 150 ; la vitesse du premier affichage passe avant l'effet. |
| 16 | **Mesure des visites : rien n'est installé maintenant.** Option retenue pour la phase M : les statistiques de l'hébergeur (Netlify Analytics), calculées à partir des journaux du serveur, **sans script, sans témoin, sans identifiant sur l'appareil du visiteur**. À inscrire alors dans la politique de confidentialité. Le tableau de bord `/admin` compte déjà les demandes par service et par page d'origine. | Loi 25 : aucun consentement à demander quand rien n'est déposé ni lu sur l'appareil ; zéro script. |
| 17 | **Lexique** : « vanne » partout ; « robinet » est rappelé une fois entre parenthèses sur la page Données d'actifs (c'est le mot des codifications de propriétaires). En anglais, « project » remplace « mandate ». | Tranche les deux remarques de l'audit S5. |
| 18 | **Titres** : un point final seulement quand le titre est une phrase (« Fabriquez votre tuyauterie en atelier, pas sur le chantier. ») ; pas de point sur une étiquette (« Qui fait quoi », « Questions fréquentes »). | Cohérence entre l'accueil et les pages de service. |
| 19 | **Sécurité et Loi 25 : les correctifs passent avant la mise en ligne**, dans cet ordre : fonction d'anonymisation appelable par un compte non administrateur, limite d'envois qui ne s'applique pas sans sel ou sans adresse IP, accusé de réception utilisable pour envoyer du texte à un tiers, lien de connexion bâti sur un en-tête de la requête, pages légales complétées. Détail et preuves à apporter : cahier, partie T5. | Défauts repérés à la lecture du code ; chacun doit d'abord être prouvé par un test. |
| 20 | **Ordre de travail** : T2 (contenu) seule d'abord ; puis T3 + T4 (visuel) dans une même suite, T5 (sécurité) et T6 (référencement, vitesse, accessibilité) en parallèle ; T7 (audit) à la fin. Fichiers de chacune : cahier, section « Ordre et fichiers ». | Éviter que deux sessions modifient le même fichier. |

## Ce qui remplace quoi
| Texte antérieur | Sort |
|---|---|
| ADR-006 n° 15 (téléphone non affiché) | **Remplacé** par les décisions 1 à 5 : affiché, avec une valeur d'exemple marquée. |
| ADR-006 n° 17 (NEQ non affiché, nom « Bimurix ») | **Remplacé** par les décisions 1 à 5. |
| ADR-008 n° 9 (« téléphone, NEQ, nom légal […] restent vides ou non affichés ») | **Remplacé pour ces trois champs.** Le reste tient : aucun nom de client, chiffre de résultat, certification ni témoignage, même en exemple. |
| ADR-006 n° 18 (responsable Loi 25 : « Fondateur de Bimurix », sans nom) | Gardé (décision 7). |
| ADR-006 n° 14 (courriel `contact@bimurix.com`), n° 16 (Grand Montréal) | Gardés. |
| ADR-008 n° 3 (situations types en quatre temps) | Gardé sur les pages de service ; **deux temps sur l'accueil** (décision 10). |
| Audit S5, « budget en dollars : à décider » | Tranché : masqué (décision 11). |

## Ce qui ne change pas
Six services, trois familles, mêmes adresses. Aucun prix, forfait ni délai de production publié. Direction A, polices, tokens.
Mention de l'ingénieur partout. Preuve J.M. Brennan avec sa source. Dataset `development` seulement ; `production` intouché
avant la phase M. Aucune nouvelle dépendance. Aucun `git push`.

## Conséquences
- Nouveau bloc `projects` ; champs facultatifs pour le fondateur ; champ d'icône (liste fermée) sur les lignes de problèmes, de
  livrables, de besoins et d'étapes ; réglage « afficher le budget » du formulaire.
- `scripts/check-placeholders.mjs` et `scripts/seed/helpers.mts` : deux marqueurs de plus.
- `OrganizationJsonLd` et le pied de page : garde « valeur d'exemple » (décision 4), avec un test.
- `PLAN.md` § 6 (phase M) : l'étape 1 reste « `pnpm check:placeholders` à zéro » ; l'étape 2 devient « le client remplace
  téléphone, nom légal, NEQ et projets dans Studio, ou vide les champs ».
- `CLAUDE.md` § 1 et § 4, `design/PRODUCT.md` (« Preuves disponibles ») : à mettre à jour par T2 une fois le contenu appliqué.
