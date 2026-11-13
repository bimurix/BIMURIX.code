# ADR-008 — Vendre la valeur, pas le prix : six services en trois familles

**Statut** : proposé (2026-11-12) — à approuver par le client avant toute application (S2 à S5).
Détail des textes, des sections et des images : `docs/source/2026-11-12_plan-contenu-v5.md`.

## Contexte
Le client constate que le prix, le type de forfait et le délai dépendent du projet. Les afficher fait fuir les
visiteurs dont le projet ne rentre pas dans la case, et ne dit rien de ce que Bimurix règle sur un chantier. Il
demande aussi des noms de services plus clairs, des sections mieux ordonnées, un texte qu'un directeur de
construction ou un chargé de projet comprend tout de suite, des situations de chantier concrètes, des images,
et un meilleur design, **sans remplacer le site** (ADR-007 : on ajoute et on ajuste).

## Décisions

| # | Décision | Pourquoi |
|---|---|---|
| 1 | **Plus aucun prix, type de forfait, délai fixe, crédit, condition de paiement ni bandeau de lancement n'est publié.** Les forfaits F-01 à F-05 sont **masqués dans Studio** (`visible` décoché), pas supprimés ; le code (`package`, `launchSettings`, blocs `packages`, `conditions`) est conservé. Le prix devient : « sur soumission, selon la portée ». | Le prix dépend du projet. Garder le code permet de rouvrir les forfaits sans développeur (ADR-006 n° 4). |
| 2 | **Six services gardés, rangés en trois familles** : *Modéliser et coordonner* (P-01) ; *Préfabriquer* (H-02, G-03, C-04) ; *Livrer et exploiter* (D-05, Q-06). Chaque service a un **nom complet** (page, SEO) et un **nom court** (menu, cartes, formulaire). Codes de réseau et adresses (URL) **inchangés**. | Un visiteur trouve son service en suivant l'ordre du projet. Aucune redirection à créer. |
| 3 | **Mises en situation** : chaque service a 2 « Situations types » au format *Situation → Ce que fait Bimurix → Ce que vous recevez → Ce que ça évite*. Jamais présentées comme des projets ni des clients réels ; aucun nom, aucun chiffre de gain, aucun témoignage. | Montrer la valeur au chantier, sans rien inventer (CLAUDE.md § 4). |
| 4 | **Chaque livrable cité dit à quoi il sert** (demi-phrase) au chantier ou à l'atelier. | Une liste de fichiers ne vend rien ; l'usage, oui. |
| 5 | **Images d'illustration** : emplacements prévus sur chaque page, tous alimentés par un champ Sanity. Trois types : schéma au trait SVG « feuille de plan », capture d'un vrai livrable fourni par le client, photo d'illustration (banque d'images). Une photo de banque porte « photo d'illustration », ne laisse jamais croire à un projet de Bimurix et ne montre aucun logo ni marque. | Direction A conservée ; budget JS de l'accueil (149,8 Ko sur 150) respecté : SVG et HTML serveur seulement. |
| 6 | **Gabarit unique des pages de service** : résumé en tête, pour qui, situations types, ce que nous faisons, ce que vous recevez, ce qu'il faut nous envoyer, comment ça se passe, qui fait quoi, preuve, questions, action. Même ordre sur les six pages. | Un lecteur pressé sait où chercher. |
| 7 | **L'action reste « Demander une soumission »**, répétée à 3 endroits par page. Aucun engagement de délai de réponse n'est écrit (question au client). | ADR-007 n° 5. |

## Ce qui remplace quoi
| Texte des ADR-006 et ADR-007 | Sort |
|---|---|
| ADR-006 n° 1 (« 4 offres en vitrine ») | Remplacé par la décision 2 ci-dessus (six services, trois familles). |
| ADR-006 n° 2 (5 prix d'entrée), n° 4 (prix affiché / sur soumission), n° 13 (date limite), n° 20 (prix « hypothèse ») | **Mis en veille** : réglages conservés dans Studio, rien n'est publié. |
| ADR-006 n° 3, 5, 6, 9 à 12, 14 à 19, 21 | Inchangés (lexique, mention de l'ingénieur, pas de RBQ, coordonnées, preuve Brennan avec sa source). |
| ADR-007 n° 1 (« tout texte d'origine se reprend mot pour mot ») | **Assoupli pour les textes de présentation** : le client demande une réécriture ; les **faits** d'origine sont gardés, les mots changent. Les textes d'origine restent dans `production` et dans Git. |
| ADR-007 n° 2 (six services, adresses) | Gardé : mêmes six services, mêmes adresses ; nouveaux noms. |
| ADR-007 n° 3, 4 (accueil « dans son ordre d'origine ») | Remplacé : nouvel ordre des sections (plan v5). |
| ADR-007 n° 5 (action « Demander une soumission ») | Gardé. |
| ADR-007 n° 6 (code de la refonte conservé) | Gardé : le code des forfaits reste, sans affichage. |

## Conséquences
- S2 écrit le contenu dans le dataset `development` seulement (jamais `production` avant la phase M) et traduit en anglais les textes approuvés.
- S3 crée les blocs manquants (situations, cycle du projet, qui fait quoi, problèmes) et règle le design.
- Le formulaire garde le champ « Forfait visé » masqué tant qu'aucun forfait n'est visible ; le champ « Budget approximatif » est une question au client.
- `design/PRODUCT.md` et `CLAUDE.md` § 1 à mettre à jour après approbation (« 6 services, forfaits masqués »).
