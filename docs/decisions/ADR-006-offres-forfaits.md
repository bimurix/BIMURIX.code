# ADR-006 — Vitrine recentrée sur 4 offres à forfaits (test de marché)

**Statut** : accepté (2026-11-10) — décisions prises par Claude sur délégation du client (« faites vos
recommandations logiques pour le Québec »), à relire par le client.

## Contexte
Le site v1 (L0–L7) présente 4 services généraux et un formulaire de soumission. Le document
`docs/source/2026-11-04_offres-v3-1/` remplace cette offre par un **test de marché de 60 jours** dans le
Grand Montréal : 4 offres, chacune avec un forfait d'entrée à prix fixe, un livrable et un délai.
Le plan du 24 octobre (taux horaires en plomberie et chauffage) est dépassé ; il est rangé hors dépôt
dans `affaires/`.

## Décisions

| # | Décision | Pourquoi |
|---|---|---|
| 1 | Les 4 offres en vitrine : **préfabrication tuyauterie (SysQue)**, **préfabrication gicleurs (AutoSPRINK)**, **tuyauterie + gicleurs**, **BIM 7D**. Modélisation générale et TQC passent en phase 2 : documents gardés dans Studio, **masqués**. | Document v3.1, « Phase 2 — à ajouter plus tard ». |
| 2 | Seuls **5 forfaits d'entrée** affichent un prix : zone pilote 1 800 $, skid standard 2 200 $, un étage de gicleurs 1 500 $, offre combinée 2 800 $, audit 7D 1 200 $. | Ce sont les seuls prix non marqués « hypothèse à valider ». |
| 3 | Les éléments « hypothèse à valider » ou « à confirmer » (60 $/spool, option implantation, rack multi-métiers, conformité 7D 3 900 $, tarifs réguliers, garantie de correction) sont saisis dans Studio mais **non publiés** tant que le client ne les active pas. | Ne rien promettre qui n'est pas confirmé (CLAUDE.md §4). |
| 4 | Chaque forfait a dans Studio : **affiché / masqué** et **prix affiché / « sur soumission »**. | Règle du test : « aucune demande après 40 jours : retirer le service de la vitrine », sans développeur. |
| 5 | Chiffres J.M. Brennan (90 %, ≈ 15 %, 718 000 pi²) : publiés **seulement avec la source et son lien** (étude de cas Trimble/SysQue), attribués à cet entrepreneur. La phrase « Bimurix applique la même méthode » est retirée. Bloc désactivable. | Ce sont les résultats d'un tiers, pas ceux de Bimurix. Le lien exact est à fournir par le client ; sans lien, le bloc reste masqué. |
| 6 | **Direction A conservée** (« La feuille de plan »). La maquette bleu marine et orange sert de source de contenu. Les forfaits se présentent en **nomenclature** (tableau de feuille de plan), pas en grille de cartes identiques ; pas de petits titres au-dessus des titres. | CLAUDE.md §5 ; ADR-005. |
| 7 | Action principale : **« Réserver un appel de 20 minutes »**, par le formulaire existant (type de demande : appel ou soumission, forfait visé). Aucun outil de réservation externe. | Pas de nouvelle dépendance, pas de données chez un tiers (Loi 25), tout reste dans `/admin`. |
| 8 | Refonte faite sur le dataset Sanity **`development`** (voir ADR-004, révision du 2026-11-10). Le site en ligne n'est pas touché avant le déploiement final. | Le client veut tout finir en local, puis tout déployer. |
| 9 | Vocabulaire : lexique de chantier québécois de `CLAUDE.md` §4. « Dessins d'atelier » remplace « plans d'atelier ». | Terme des devis et des entrepreneurs au Québec ; c'est celui du document v3.1. |
| 10 | Mesures doubles (« 150 m (500 pi) »), surfaces en pi², prix « 1 800 $ », mention « avant TPS et TVQ ». | Usages des ateliers et chantiers du Québec. |
| 11 | Mention visible : conception, calculs (dont parasismique), approbation, signature et sceau restent à l'ingénieur ou à l'entrepreneur. | Loi sur les ingénieurs ; exclusions du document v3.1. |
| 12 | Aucune mention d'affiliation ou de licence de Bimurix (RBQ, CMMTQ, etc.). CMMTQ n'apparaît que pour décrire la clientèle visée. | Aucune preuve fournie. |

## Valeurs d'exemple ajoutées (bloquées par `check:placeholders`)
Date limite des forfaits de lancement, courriel, téléphone, ville affichée (« Longueuil » dans la maquette,
à confirmer), lien de l'étude de cas.

## Conséquences
- Nouveau type de document `package` (forfait), réglage `launchSettings`, blocs `packages`, `conditions`,
  `proof` ; champ `visible` sur `service`.
- Formulaire : champs « type de demande » et « forfait visé » ; migration Supabase (2 colonnes).
- `design/PRODUCT.md` : la règle « aucune promesse chiffrée » devient « aucun chiffre sans source ; les prix et
  délais publiés sont ceux confirmés par le client ».
- SysQue, AutoSPRINK et Trimble sont des marques de tiers : citées comme outils utilisés, sans logo.

## Décisions complémentaires (2026-11-10) — questions ouvertes tranchées sur délégation du client

| # | Question | Décision | Pourquoi |
|---|---|---|---|
| 13 | Date limite des forfaits | Aucune date fixe pour l'instant. Règle : **date de mise en ligne + 60 jours**, saisie dans Studio à la phase M. Champ vide = aucune date affichée. | Le test dure 60 jours à partir du lancement réel, pas à partir d'aujourd'hui. |
| 14 | Courriel | `contact@bimurix.com` (domaine déjà vérifié pour l'envoi et la réception). Ce n'est plus une valeur d'exemple. | Adresse déjà en service. |
| 15 | Téléphone | **Non affiché** tant que le client n'a pas de ligne d'affaires. Champ vidé ; le site ne montre rien si le champ est vide. | Ne pas publier un faux numéro ni un numéro personnel par défaut. |
| 16 | Ville | Région desservie : **« Grand Montréal »**. Aucune adresse ni ville de bureau. « Longueuil » (maquette) retiré. | Le test de marché vise le Grand Montréal ; pas d'adresse d'affaires confirmée. |
| 17 | NEQ et nom légal | NEQ **non affiché** tant qu'il n'est pas fourni. Nom affiché : « Bimurix ». | L'affichage du NEQ sur un site n'est pas obligatoire ; le nom légal exact n'est pas connu. |
| 18 | Responsable Loi 25 | Titre **« Fondateur de Bimurix »** + `contact@bimurix.com`. Aucun nom de personne saisi par Claude. | La loi demande le titre et les coordonnées du responsable ; par défaut c'est la personne ayant la plus haute autorité. Le client peut ajouter son nom dans Studio. |
| 19 | Garantie de correction gratuite | **Non publiée.** Réévaluer après les 3 premiers mandats. | Elle engage la responsabilité sur des longueurs de coupe qui dépendent aussi des documents fournis ; à encadrer d'abord dans le contrat. |
| 20 | Prix « hypothèse à valider » | Restent masqués. Chacun s'active dans Studio quand une soumission réelle l'a confirmé. | Règles de décision sur les prix du document v3.1. |
| 21 | Chiffres J.M. Brennan | Source vérifiée le 2026-11-10 : étude de cas Trimble MEP, <https://www.casestudies.com/company/trimble-mep/case-study/15-cost-savings-with-streamlined-bim-workflow>. Formulation corrigée pour coller à la source : **« environ 90 % de préfabrication »** et **« environ 15 % d'économies globales »**, attribués à J.M. Brennan. Le chiffre **718 000 pi² est retiré** : il n'apparaît pas sur la page citée (seulement dans une copie PDF). Bloc publié avec le lien. | La maquette disait « 90 % de la tuyauterie » et « 15 % sur le coût total du projet » : la source ne précise pas ces portées. Remplace la réserve du n° 5 sur le lien manquant. |

| 22 | Description du besoin pour une demande d'appel | Elle reste **obligatoire** : elle sert à préparer l'appel. L'aide du champ dit qu'**une phrase suffit**. | Un appel de 20 minutes se prépare mieux avec une phrase sur le besoin ; la demande reste courte à remplir. |
| 23 | Message de succès et accusé de réception d'une demande d'appel | « **Nous vous écrivons d'ici un jour ouvrable pour fixer l'heure de l'appel** » / « **We will email you within one business day to set a time** ». Engagement recommandé par Claude sur délégation du client ; modifiable dans Studio (formulaire et courriels). | Le visiteur sait quand il aura des nouvelles. Un jour ouvrable est tenable pour un fondateur seul ; le client peut changer le délai dans Studio. |

Restent des faits que seul le client peut fournir, sans bloquer : numéro de téléphone d'affaires, NEQ, nom légal.
