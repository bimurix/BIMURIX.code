# Plan de contenu v5 — la valeur avant le prix

**Date** : 2026-11-12 · **Statut** : proposition à approuver par le client · **Décisions** : `docs/decisions/ADR-008-valeur-sans-prix.md`
**Lecture seule** : rien n'a été modifié dans le site, dans Sanity ni dans la base. Ce document est le seul livrable de la tâche S1.

## Comment lire ce document
- **Ce que le client doit regarder** : § 3 (nouveaux textes), § 4 (situations types) et § 10 (questions). Le reste sert aux personnes qui appliqueront le plan.
- Mots de verdict : **Garder** (texte conservé tel quel) · **Réécrire** (même sens et mêmes faits, nouveaux mots) · **Déplacer** · **Fusionner** (le contenu va dans une autre section) · **Retirer** (ne s'affiche plus ; reste dans Studio quand c'est un forfait).
- Les textes d'origine restent dans `production` et dans Git ; rien n'est perdu.
- **Anglais** : non rédigé ici. La session S2 traduira les textes une fois la version française approuvée (Loi 96 : une page EN incomplète n'est pas publiée).
- Les « Situations types » ne sont **pas** des projets réalisés. Aucun nom, aucun chiffre de gain, aucun pourcentage, aucun témoignage.

## 0. Le lecteur et la règle de rédaction
Le lecteur est un **directeur de construction, un chargé de projet ou un estimateur pressé**, souvent sur téléphone, entre deux
réunions. Il pose trois questions dans cet ordre : *Est-ce mon problème ? Qu'est-ce que vous faites ? Qu'est-ce que je reçois ?*
Puis : *Comment je demande un prix ?* L'ordre de chaque page suit ces questions :
**problème → ce qu'on fait → ce qu'il reçoit → preuve honnête → action.**

Règles de rédaction appliquées partout (skill `impeccable`, volet clarté) :
1. Une idée par phrase, 20 mots au plus. Verbes concrets : modéliser, détecter, dessiner, numéroter, livrer.
2. On dit ce que le lecteur **obtient** (« un rapport de conflits pour la réunion de coordination »), pas ce que Bimurix « accompagne » ou « soutient ».
3. Pas de mots vides : « accompagner », « optimiser », « solutions », « expertise orientée », « selon le périmètre convenu » répété.
4. Lexique de chantier québécois (`CLAUDE.md` § 4) : soumission = le prix ; devis = le cahier des charges ; dessins d'atelier ; corps de métier ; détection de conflits ; réunion de coordination ; percements et manchons ; salle mécanique ; colonnes montantes ; mise en service ; manuels d'exploitation et d'entretien ; demande de changement ; tel que construit ; courriel.
5. Le français suit la casse de phrase (« Demander une soumission »), pas la casse de titre anglaise des Web Interface Guidelines.
6. Un fait absent du texte d'origine n'est pas ajouté. Là où une phrase nouvelle suppose un fait que seul le client connaît, elle est marquée **[à confirmer]** et reprise dans le § 10.

## 1. Les six services, leurs noms et leurs familles (décision ADR-008 n° 2)

| Famille | Code | Nom complet (page, SEO, titre) | Nom court (menu, carte, formulaire) | Adresse (inchangée) |
|---|---|---|---|---|
| **Modéliser et coordonner** | P-01 | Modélisation et coordination BIM : architecture, structure, mécanique du bâtiment | Modélisation et coordination BIM | `/services/modelisation-bim-coordination` |
| **Préfabriquer** | H-02 | Dessins d'atelier et préfabrication : tuyauterie et plomberie | Tuyauterie et plomberie | `/services/prefabrication-tuyauterie` |
| | G-03 | Dessins d'atelier : protection incendie (gicleurs) | Gicleurs | `/services/prefabrication-gicleurs` |
| | C-04 | Coordination tuyauterie et gicleurs | Tuyauterie + gicleurs | `/services/tuyauterie-gicleurs-coordonnes` |
| **Livrer et exploiter** | D-05 | Données d'actifs pour l'exploitation (BIM 7D) | Données d'actifs (BIM 7D) | `/services/bim-7d-donnees-actifs` |
| | Q-06 | Modèles et plans tel que construit (TQC) | Tel que construit (TQC) | `/services/tqc-controle-qualite` |

Notes : les codes restent dans l'ordre D-05 puis Q-06 pour ne pas renuméroter les feuilles, les tests et les adresses ; l'ordre
d'affichage suit les codes (question 9 au client). « MEP » est écrit « mécanique du bâtiment (MEP) » à sa première apparition de chaque page.

---

## 2. Critique de l'existant et nouvel ordre des sections

### 2a. Critique page par page (état actuel, lu le 2026-11-12 sur http://localhost:3100)

#### Accueil `/`
| N° | Section actuelle | Verdict | Raison en une phrase | Devient |
|---|---|---|---|---|
| ACC-1 | En-tête : « Des modèles BIM fiables… », accroche, 2 boutons, bande « Architecture · Structure · MEP… » | Réécrire | L'accroche énumère des activités sans dire le résultat ; la bande répète les services. | H1 |
| ACC-2 | Isométrique des six réseaux (SVG) | Garder | Bon repère visuel de la direction A, déjà léger ; seuls les libellés changent. | H1 |
| ACC-3 | « Le BIM doit servir le chantier, pas seulement le modèle » | Fusionner | Phrase juste mais abstraite : elle devient l'introduction des problèmes de chantier. | H2 |
| ACC-4 | « Nos services » (six cartes, chacune avec un code au-dessus du titre) | Réécrire | Six cartes à plat, sans ordre logique ; on les range en trois familles. | H3 |
| ACC-5 | « Commencez petit, à prix fixe » : tableau de cinq forfaits | Retirer | Prix, délais et types de forfaits : le client ne les publie plus. | (masqué dans Studio) |
| ACC-6 | « Conditions des forfaits de lancement » | Retirer | Crédit, paiement, délai, portée en pi² : tout dépend du projet. La mention de l'ingénieur survit dans « Qui fait quoi ». | (masqué) |
| ACC-7 | « Ce que donne la préfabrication, selon un entrepreneur » (≈ 90 % / ≈ 15 %, J.M. Brennan) | Garder | Preuve honnête : chiffres d'un tiers, source et lien présents ; on la rapproche des situations types. | H7 |
| ACC-8 | « Inclus pour l'atelier et le chantier » (5 livrables) | Fusionner | Bonne liste, mais sans l'usage de chaque livrable ; elle rejoint « Ce que vous recevez ». | H5 |
| ACC-9 | « Une méthode claire, du besoin au livrable » (4 étapes) | Réécrire | Étapes abstraites (« comprendre, produire… ») ; on dit ce que le visiteur fait à chacune. | H9 |
| ACC-10 | « Une approche axée sur la qualité des livrables » (4 points) | Retirer | « Coordination plus claire », « données mieux organisées » : promesses vagues, déjà dites ailleurs. | — |
| ACC-11 | « Un soutien BIM adapté aux équipes de construction » (5 publics) | Fusionner | Les cinq publics sont gardés mais dits par leur problème, dans H2. | H2 |
| ACC-12 | « Questions fréquentes » (8) | Réécrire | Trois questions parlent de prix ou de forfait ; on en ajoute sur les documents et le calcul du prix. | H10 |
| ACC-13 | « Une expertise BIM orientée vers les besoins réels du projet » + lien « En savoir plus » | Retirer | Texte vague ; sa seule idée (« commencer par clarifier besoins et critères ») passe dans la méthode. | H9 |
| ACC-14 | « Parlons de votre prochain projet » + « Demander une soumission » | Réécrire | « Parlons » suggère un appel ; on dit ce qu'il faut écrire dans la demande. | H11 |
| ACC-15 | Bandeau de lancement (déjà éteint) | Retirer | Plus de lancement à annoncer. | (réglage Studio gardé, éteint) |

Verdict d'ensemble : l'accueil a de bons morceaux, mais **la première moitié parle de prix** et la seconde de qualité en termes vagues.
Aucune section ne montre une situation de chantier. L'action (« Demander une soumission ») n'apparaît que deux fois et en haut et en bas seulement.

#### Modélisation `/services/modelisation-bim-coordination`
| N° | Section actuelle | Verdict | Raison | Devient |
|---|---|---|---|---|
| MOD-1 | Titre, intro, bouton « Discuter de votre projet BIM » | Réécrire | « Discuter » : on veut une soumission ; l'intro est un long « selon le périmètre défini ». | P1 |
| MOD-2 | « Pour qui » | Réécrire | Correct, mais dit « MEP » sans l'expliquer. | P2 |
| MOD-3 | « Nos services » (5 prestations) | Réécrire | Descriptions administratives (« selon les documents de référence… ») sans résultat visible. | P4 |
| MOD-4 | « Livrables possibles » (6) | Réécrire | Liste sans l'usage de chaque livrable. | P5 |
| MOD-5 | « Notre approche qualité » (5 étapes) | Réécrire | Utile ; on la garde sous « Comment ça se passe » avec des verbes de chantier. | P7 |
| MOD-6 | « Qui fait quoi » (un paragraphe) | Réécrire | La mention de l'ingénieur est essentielle mais noyée ; elle devient un tableau. | P8 |
| MOD-7 | Appel final « Votre équipe a besoin de soutien BIM ? » | Réécrire | Question vague ; on nomme ce qu'il faut envoyer. | P11 |

#### Tuyauterie `/services/prefabrication-tuyauterie`
| N° | Section actuelle | Verdict | Raison | Devient |
|---|---|---|---|---|
| TUY-1 | Titre « Fabriquez votre tuyauterie en atelier… » + intro (« en 5 jours ouvrables ») | Réécrire | Le titre est bon (on le garde) ; le délai fixe sort de l'intro. | P1 |
| TUY-2 | « Pour qui » | Garder | Précis et factuel. | P2 |
| TUY-3 | « Ce que couvre l'offre » (6 prestations) | Réécrire | Faits justes ; on ajoute l'usage et deux prestations de l'ancien texte « Préfabrication MEP ». | P4 |
| TUY-4 | « Ce que vous recevez » (8 livrables + bilan de zone pilote) | Réécrire | Livrables bons mais sans usage ; le bilan « zone pilote » est un forfait (question 6). | P5 |
| TUY-5 | « Forfaits de cette offre » (tableau F-01, F-02) | Retirer | Prix, portée, délais. | (masqué) |
| TUY-6 | « Comment ça marche » (3 étapes, « 5 jours ouvrables ») | Réécrire | Utile ; le délai fixe sort. | P7 |
| TUY-7 | « Ce dont nous avons besoin pour démarrer » | Déplacer | Information clé pour le lecteur, trop loin ; elle monte avant « Comment ça se passe ». | P6 |
| TUY-8 | « Pourquoi préparer la préfabrication avec une approche BIM ? » (5 points) | Fusionner | Liste de principes ; ses idées deviennent « Ce que ça évite » dans les situations. | P3 |
| TUY-9 | « Qui fait quoi » (paragraphe) | Réécrire | Voir MOD-6. | P8 |
| TUY-10 | Appel final « Prêt à essayer sur une zone ? » | Réécrire | « Essayer sur une zone » renvoie au forfait pilote. | P11 |

#### Gicleurs `/services/prefabrication-gicleurs`
| N° | Section actuelle | Verdict | Raison | Devient |
|---|---|---|---|---|
| GIC-1 | Titre « …livrés en 5 jours ouvrables » + intro | Réécrire | Délai fixe retiré ; « quand la pointe arrive » est la vraie promesse, on la monte au titre. | P1 |
| GIC-2 | « Pour qui » | Garder | Précis. | P2 |
| GIC-3 | « Ce que couvre l'offre » (4 blocs dont « Un étage à la fois », 10 000 pi²) | Réécrire | Le bloc « Un étage à la fois » est un forfait ; les autres sont justes. | P4 |
| GIC-4 | « Ce que vous recevez » (5) | Réécrire | Sans usage. | P5 |
| GIC-5 | « Forfaits de cette offre » (F-03) | Retirer | Prix et délai. | (masqué) |
| GIC-6 | « Comment ça marche » (3 étapes, 5 jours) | Réécrire | Délai fixe retiré. | P7 |
| GIC-7 | « Qui fait quoi » | Réécrire | Voir MOD-6. | P8 |
| GIC-8 | Appel final « Un étage à dessiner cette semaine ? » | Réécrire | « Cette semaine » est un engagement implicite de délai. | P11 |

#### Tuyauterie + gicleurs `/services/tuyauterie-gicleurs-coordonnes`
| N° | Section actuelle | Verdict | Raison | Devient |
|---|---|---|---|---|
| COM-1 | Titre « …coordonnés avant la fabrication » + intro | Réécrire | Titre bon, gardé ; intro resserrée. | P1 |
| COM-2 | « Pour qui » | Garder | Précis. | P2 |
| COM-3 | « Ce que couvre l'offre » (4) | Réécrire | Bon fond ; ajout de l'usage et des mots de chantier. | P4 |
| COM-4 | « Ce que vous recevez » (4) | Réécrire | Sans usage. | P5 |
| COM-5 | « Forfaits de cette offre » (F-04, « Recommandé ») | Retirer | Prix, délai. | (masqué) |
| COM-6 | « Comment ça marche » (3 étapes, 7 jours) | Réécrire | Délai retiré. | P7 |
| COM-7 | « Qui fait quoi » | Réécrire | Voir MOD-6. | P8 |
| COM-8 | Appel final « Deux disciplines, une seule zone à essayer » | Réécrire | Renvoie au forfait d'essai. | P11 |

#### BIM 7D `/services/bim-7d-donnees-actifs`
| N° | Section actuelle | Verdict | Raison | Devient |
|---|---|---|---|---|
| SEP-1 | Titre, intro, bouton « Discuter de vos données BIM » | Réécrire | Titre abstrait (« données BIM organisées ») ; on dit « données d'équipements à la remise ». | P1 |
| SEP-2 | « Pour qui » | Garder | Précis. | P2 |
| SEP-3 | « Services » (11 blocs) | Réécrire | Onze blocs de même poids : on regroupe en neuf, par étape de travail. | P4 |
| SEP-4 | « Exemples de données » (8) | Fusionner | Liste utile mais isolée ; elle devient le contenu de « Ce que vous recevez ». | P5 |
| SEP-5 | « Forfaits de cette offre » (F-05) | Retirer | Prix, délai. | (masqué) |
| SEP-6 | « Méthode de travail » (5 étapes) | Réécrire | Bonne ; verbes de chantier. | P7 |
| SEP-7 | « Ce que vous recevez avec l'audit 7D » | Fusionner | Rattaché au forfait ; le rapport Excel rejoint P5. | P5 |
| SEP-8 | « Qui fait quoi » | Réécrire | Voir MOD-6 ; la phrase « données jamais inventées » est gardée. | P8 |
| SEP-9 | Appel final « Vous devez compléter les paramètres… ? » | Réécrire | Garde la liste de ce qu'il faut indiquer. | P11 |

#### TQC `/services/tqc-controle-qualite`
| N° | Section actuelle | Verdict | Raison | Devient |
|---|---|---|---|---|
| TQC-1 | Titre, intro, bouton « Discuter de vos livrables TQC » | Réécrire | « Livrables finaux cohérents » ne dit rien ; on dit « plans et modèles qui reflètent le chantier ». | P1 |
| TQC-2 | « Pour qui » | Garder | Précis. | P2 |
| TQC-3 | « Services » (5) | Réécrire | Ajout du vocabulaire (demandes de changement, relevés, dossier de remise). | P4 |
| TQC-4 | « Informations nécessaires » (6) + avertissement | Déplacer | Très bon contenu ; il devient « Ce qu'il faut nous envoyer ». | P6 |
| TQC-5 | « Notre démarche » (5 étapes) | Réécrire | Verbes de chantier. | P7 |
| TQC-6 | « Qui fait quoi » | Réécrire | Voir MOD-6. | P8 |
| TQC-7 | Appel final « Vous préparez la remise finale… ? » | Réécrire | Garde l'idée, ajoute les pièces à joindre. | P11 |

#### À propos `/a-propos`
| N° | Section actuelle | Verdict | Raison | Devient |
|---|---|---|---|---|
| APR-1 | Titre « Le BIM au service de la qualité et de la coordination » + intro | Réécrire | Générique : n'importe quelle firme BIM pourrait l'écrire. | AP1 |
| APR-2 | « Rendre l'information BIM plus utile aux équipes… » | Fusionner | Répète l'intro ; sa phrase utile rejoint AP1. | AP1 |
| APR-3 | « Nos domaines d'intervention » (6 lignes) | Réécrire | Liste sans liens ; devient les trois familles avec liens vers les services. | AP2 |
| APR-4 | « Notre positionnement en préfabrication » (4 points) | Garder | C'est ce qui distingue Bimurix (SysQue, AutoSPRINK, Dynamo, pyRevit, bilingue, local). | AP3 |
| APR-5 | Mention de l'ingénieur | Fusionner | Passe dans le tableau « Qui fait quoi ». | AP5 |
| APR-6 | « Engagement » | Fusionner | Idées (périmètre clair, traçabilité) fondues dans « Notre façon de travailler ». | AP4 |
| APR-7 | « Notre approche » (4 principes) | Réécrire | Principes sans gestes ; on ajoute ce que ça change pour le client. | AP4 |
| APR-8 | Appel « Parlons de vos besoins BIM » → « Nous contacter » | Réécrire | Un seul chemin vers le formulaire : « Demander une soumission ». | AP6 |

#### Soumission `/soumission`
| N° | Section actuelle | Verdict | Raison | Devient |
|---|---|---|---|---|
| SOU-1 | Titre « Parlez-nous de votre projet » + intro | Réécrire | L'intro ne dit pas ce qui rend la soumission juste. | SO1 |
| SOU-2 | Formulaire (nom, entreprise, courriel, service, projet, région, phase, échéancier, budget, logiciels, description, consentement) | Garder | Complet et conforme à la Loi 25 ; deux ajustements en question 8 (budget, « Forfait visé »). | SO2 |

### 2b. Nouvel ordre des sections

Notation des blocs : `existant` = dossier déjà dans `web/src/blocks/` ; **Nouveau** = bloc à créer (un dossier = schéma, requête, composant, selon `docs/ARCHITECTURE.md`).

#### Accueil
| N° | Section | Réponse à la question du lecteur | Bloc |
|---|---|---|---|
| H1 | **En-tête** : promesse, accroche courte, « Demander une soumission », isométrique | Est-ce pour moi ? | `hero-sheet` + `service-networks` (existants) |
| H2 | **Les problèmes de chantier qu'on règle** (six problèmes, chacun renvoie à un service ; cite les cinq publics) | Est-ce mon problème ? | **Nouveau** `problems` (liste problème → réponse → lien) |
| H3 | **Six services, trois familles** | Que faites-vous ? | `service-networks` (existant) + champ « famille » |
| H4 | **Où Bimurix intervient dans votre projet** (schéma du cycle, six stations) | Où ça s'insère ? | **Nouveau** `project-cycle` (SVG rendu côté serveur) |
| H5 | **Ce que vous recevez** (livrables avec leur usage) | Qu'est-ce que je reçois ? | `deliverables` (existant) + champ « à quoi ça sert » |
| H6 | **Situations types** (trois, une par famille) | Concrètement, ça donne quoi ? | **Nouveau** `scenarios` |
| H7 | **Ce que donne la préfabrication, selon un entrepreneur** | Y a-t-il une preuve ? | `proof` (existant) |
| H8 | **Qui fait quoi** (Bimurix / ingénieur / entrepreneur) | Qui est responsable ? | **Nouveau** `responsibility-table` |
| H9 | **Comment se déroule un mandat** + ce qu'il faut nous envoyer | Comment je commence ? | `method` (existant) + `points-list` (existant) |
| H10 | **Questions fréquentes** (sans prix) | Et si… ? | `faq` (existant) |
| H11 | **Envoyez-nous votre projet** | Action | `quote-cta` (existant) |

L'accueil passe de 14 sections à 11, et la première question de prix n'arrive qu'en FAQ.

#### Gabarit commun des six pages de service
| N° | Section | Réponse à la question du lecteur | Bloc |
|---|---|---|---|
| P1 | **En-tête** : nom du service, promesse en une phrase, bouton « Demander une soumission… » | De quoi s'agit-il ? | `ServicePage` en-tête (`hero-sheet`, existant) |
| P2 | **Pour qui** | Est-ce pour moi ? | existant (`Note` de `ServicePage`) |
| P3 | **Situations types** (2) | Est-ce mon problème ? Concrètement ? | **Nouveau** `scenarios` (réutilisé de H6) |
| P4 | **Ce que nous faisons** | Qu'est-ce que vous faites ? | `points-list` (existant) |
| P5 | **Ce que vous recevez** (avec « à quoi ça sert ») | Qu'est-ce que je reçois ? | `deliverables` (existant, étendu) |
| P6 | **Ce qu'il faut nous envoyer** | Qu'est-ce que je dois fournir ? | `points-list` (existant) ; **nouvelle section** sur P-01, G-03, C-04, D-05 |
| P7 | **Comment ça se passe** (3 à 5 étapes, sans délai) | Et après ma demande ? | `method` (existant) |
| P8 | **Qui fait quoi** | Qui signe ? | `responsibility-table` (**Nouveau**, réutilisé de H8) |
| P9 | **Preuve** (H-02 et C-04 seulement : Brennan) | Y a-t-il une preuve ? | `proof` (existant) ; aucune preuve sur les autres pages, on ne l'invente pas |
| P10 | **Questions sur ce service** (3 à 4) | Et si… ? | `faq` (existant) ; **nouvelle section** sur les six pages |
| P11 | **Appel final** avec le bouton propre au service | Action | `quote-cta` (existant) |

Les sections « Forfaits de cette offre » (`packages`) et « Conditions » (`conditions`) ne sont plus posées dans le gabarit.
Elles restent codées et se rallument en cochant les forfaits dans Studio (ADR-008 n° 1).

#### À propos
| N° | Section | Bloc |
|---|---|---|
| AP1 | En-tête : qui est Bimurix, en deux phrases | `hero-sheet` (existant) |
| AP2 | Nos domaines d'intervention (trois familles, liens vers les six services) | `service-networks` (existant) |
| AP3 | Notre positionnement en préfabrication | `points-list` (existant) |
| AP4 | Notre façon de travailler (4 gestes) | `points-list` (existant) |
| AP5 | Qui fait quoi | `responsibility-table` (**Nouveau**, partagé) |
| AP6 | Appel final | `quote-cta` (existant) |

#### Soumission
| N° | Section | Bloc |
|---|---|---|
| SO1 | En-tête : titre, intro | `hero-sheet` (existant) |
| SO2 | **Ce qu'il faut nous envoyer** (encart à côté du formulaire, **nouvelle section**) | `points-list` (existant) |
| SO3 | Formulaire | `quote-form` (existant) |
| SO4 | Questions fréquentes courtes (3 : prix, documents, langue) — option | `faq` (existant) |

---

## 3. Tableau avant / après des textes français

« Inchangé » = le texte actuel est gardé tel quel. Les textes d'interface (menu, pied de page) suivent les noms courts du § 1.
Les faits d'origine sont gardés : SysQue, AutoSPRINK, pièces réelles du fabricant, export Revit et NWC, mention de l'ingénieur, Grand Montréal, français et anglais.

### 3.1 Accueil

| Élément | Avant | Après |
|---|---|---|
| H1 | Des modèles BIM fiables. Une construction mieux préparée. | Des modèles BIM fiables. Moins de surprises au chantier. |
| Accroche | Bimurix accompagne les professionnels de la construction dans la modélisation BIM, la coordination des systèmes du bâtiment, la préparation à la préfabrication et la structuration des données d'actifs. | Bimurix modélise, coordonne et dessine pour les entrepreneurs, les firmes de génie-conseil et les propriétaires. Les conflits se règlent au modèle. La tuyauterie et les gicleurs arrivent prêts à fabriquer. Les plans tel que construit et les données sont prêts à remettre. |
| Boutons | Demander une soumission · Découvrir nos services | Demander une soumission · Voir les six services |
| Bande sous le titre | Architecture · Structure · MEP · Préfabrication · BIM 7D · TQC | Modéliser et coordonner · Préfabriquer · Livrer et exploiter |
| Phrase de l'isométrique | Choisissez un réseau pour demander une soumission sur ce service. | Choisissez un service pour demander une soumission. |
| H2 (titre) | Le BIM doit servir le chantier, pas seulement le modèle. | Les problèmes qu'on règle avant le chantier. |
| H2 (intro) | Un modèle BIM apporte une réelle valeur lorsqu'il aide les équipes à mieux coordonner les disciplines, à anticiper les difficultés d'installation et à transmettre des informations fiables. Bimurix intervient sur les modèles, les données et les livrables… | Un modèle BIM vaut ce qu'il apporte au chantier : moins de conflits entre les corps de métier, moins d'imprévus à l'installation, des informations fiables à la remise. Pour les directeurs de construction, les chargés de projet, les estimateurs, les entrepreneurs généraux et spécialisés, les firmes de génie-conseil et les propriétaires. |
| H2, problème 1 | (nouveau) | **Les tuyaux, les gicleurs et les conduits se croisent au même endroit.** On détecte les conflits au modèle et on les règle en réunion de coordination, avant l'installation. → Modélisation et coordination, Tuyauterie + gicleurs |
| H2, problème 2 | (nouveau ; reprend « Fabriquez en atelier, pas sur le chantier ») | **Le chantier perd du temps à mesurer et à couper sur place.** La tuyauterie se fabrique en atelier, avec des spools numérotés et des listes de coupe. → Tuyauterie et plomberie |
| H2, problème 3 | (nouveau ; reprend « quand vos dessinateurs manquent ») | **Vos dessinateurs de gicleurs sont débordés.** Nous dessinons étage par étage, dans AutoSPRINK. → Gicleurs |
| H2, problème 4 | (nouveau ; reprend « un seul interlocuteur ») | **Deux fournisseurs, deux modèles, des allers-retours.** Un seul interlocuteur pour la tuyauterie et les gicleurs. → Tuyauterie + gicleurs |
| H2, problème 5 | (nouveau) | **Les plans de remise montrent la conception, pas ce qui a été construit.** Nous intégrons les demandes de changement et les relevés de chantier. → Tel que construit |
| H2, problème 6 | (nouveau) | **Le propriétaire exige des données d'équipements à la remise.** Nous structurons, vérifions et signalons ce qui manque. → Données d'actifs |
| H3 (titre) | Nos services | Six services, du modèle à l'exploitation. |
| H3 (familles) | (aucune) | Modéliser et coordonner · Préfabriquer · Livrer et exploiter |
| Carte P-01 | Titre : Modélisation BIM et coordination · Des modèles structurés et coordonnés · Modélisation en architecture, structure et MEP, coordination interdisciplinaire et vérification des livrables selon les exigences du projet. · Découvrir la modélisation BIM | Modélisation et coordination BIM · Des modèles à jour et des conflits réglés avant l'installation · Architecture, structure et mécanique du bâtiment (MEP). Modèle fédéré, détection de conflits, contrôle des livrables. · Voir la modélisation et la coordination |
| Carte H-02 | Préfabrication de tuyauterie mécanique · Votre tuyauterie, prête à fabriquer en atelier · Modélisation SysQue avec les pièces réelles du fabricant : dessins de spool, listes de coupe et de matériel, supports et parasismique coordonnés. · Voir l'offre tuyauterie | Tuyauterie et plomberie · Votre tuyauterie, prête à fabriquer en atelier · Dessins d'atelier dans SysQue avec les pièces réelles du fabricant : spools, listes de coupe et de matériel, supports et contreventements parasismiques coordonnés. · Voir la tuyauterie et la plomberie |
| Carte G-03 | Préfabrication de gicleurs · Des dessins de gicleurs quand vos dessinateurs manquent · Dessins d'atelier, listes de coupe et supports d'un étage dans AutoSPRINK, avec export Revit et NWC. · Voir l'offre gicleurs | Gicleurs · Des dessins de gicleurs quand vos dessinateurs manquent · Dessins d'atelier, listes de coupe et supports, étage par étage, dans AutoSPRINK, avec export Revit et NWC. · Voir les gicleurs |
| Carte C-04 | Tuyauterie et gicleurs coordonnés · Un seul interlocuteur pour les deux disciplines · Une zone modélisée en tuyauterie et en gicleurs, conflits réglés avant la fabrication, dessins d'atelier des deux. · Voir l'offre combinée | Tuyauterie + gicleurs · Un seul interlocuteur pour les deux disciplines · Une zone modélisée en tuyauterie et en gicleurs, conflits réglés avant la fabrication, dessins d'atelier des deux. · Voir la coordination tuyauterie et gicleurs |
| Carte D-05 | BIM 7D et données d'actifs · Des données prêtes pour la livraison et l'exploitation · Structuration des paramètres, vérification de la complétude des informations et préparation des données d'équipements selon les exigences de remise du projet. · Découvrir le BIM 7D | Données d'actifs (BIM 7D) · Des données prêtes pour la remise et l'exploitation · Paramètres structurés, complétude vérifiée, équipements codifiés, données prêtes pour les manuels d'exploitation et d'entretien et la maintenance. · Voir les données d'actifs |
| Carte Q-06 | TQC et contrôle qualité · Des livrables finaux cohérents et documentés · Mise à jour des modèles et documents à partir des informations validées du chantier, avec des contrôles de cohérence et de complétude. · Découvrir les TQC et le contrôle qualité | Tel que construit (TQC) · Des plans et des modèles qui reflètent le chantier · Mise à jour des modèles et des plans à partir des relevés, des changements approuvés et des informations validées du chantier. Contrôles de cohérence et de complétude. · Voir le tel que construit |
| H4 (titre) | (nouveau) | Où Bimurix intervient dans votre projet. |
| H4 (intro) | (nouveau) | Du modèle de conception à la remise du bâtiment, chaque service prend la suite du précédent. Un mandat peut couvrir une étape ou plusieurs. **[à confirmer, question 10]** |
| H5 (titre) | Inclus pour l'atelier et le chantier | Ce que vous recevez, et à quoi ça sert. |
| H5 (lignes) | 5 livrables en une phrase chacun | Voir § 5 (livrables avec usage). |
| H6 (titre) | (nouveau) | Trois situations types de chantier. |
| H6 (note) | (nouveau) | Ce sont des situations types, pas des projets réalisés. |
| H7 | Ce que donne la préfabrication, selon un entrepreneur · ≈ 90 % de préfabrication · ≈ 15 % d'économies globales · Résultats publiés par l'entrepreneur J.M. Brennan, avec SysQue. Ce ne sont pas des résultats de Bimurix. Source : Étude de cas Trimble MEP | **Inchangé** (règle ADR-006 n° 21 : chiffres d'un tiers, avec source et lien). |
| H8 (titre) | (nouveau) | Qui fait quoi. |
| H8 (corps) | La conception, les calculs (y compris parasismique), l'approbation, la signature et le sceau des dessins restent à l'ingénieur ou à l'entrepreneur. | Tableau, voir § 3.9. La phrase d'origine reste sous le tableau, mot pour mot. |
| H9 (titre) | Une méthode claire, du besoin au livrable. | Comment se déroule un mandat. |
| H9, étape 1 | 01 Comprendre · Nous clarifions les exigences du projet, les disciplines concernées, les usages BIM, les formats attendus et les critères d'acceptation. | 01 Vous demandez une soumission. Dites-nous le projet, la discipline et ce que vous voulez recevoir. |
| H9, étape 2 | 02 Produire · Nous réalisons ou mettons à jour les modèles, les données et la documentation selon le périmètre convenu. | 02 Nous clarifions la portée. Exigences du projet, disciplines, formats attendus et critères d'acceptation. |
| H9, étape 3 | 03 Vérifier · Nous contrôlons les éléments convenus : cohérence, paramètres, coordination, complétude et conformité aux exigences communiquées. | 03 Nous produisons et nous vérifions. Modèles, dessins et données ; cohérence, paramètres, coordination et complétude. |
| H9, étape 4 | 04 Livrer · Nous préparons les fichiers et documents convenus pour faciliter leur revue, leur utilisation par les équipes et leur intégration au processus du projet. | 04 Nous livrons. Les fichiers et documents convenus, avec la liste des points à confirmer. |
| H9, « À nous envoyer » | (nouveau, tiré de « Documents requis » et des pages de service) | Les plans ou le modèle de l'ingénieur · les dessins d'atelier approuvés · les fabricants retenus (raccords, vannes, supports) · les standards de votre atelier · les exigences de remise du propriétaire. |
| H10 | Questions fréquentes | **Garder** : Faut-il avoir SysQue ? · Qui conçoit le parasismique ? · Qui signe les dessins ? · Quels fabricants ? — **Réécrire** : « Et si un projet démarre vite ? » → « Mon projet démarre bientôt : pouvez-vous suivre ? » ; réponse : « Le délai dépend de la portée et des documents reçus. Indiquez votre échéancier dans la demande ; la soumission le précise. » — **Remplacer** « Le prix inclut-il les taxes ? » et « Le montant du forfait est-il perdu ? » par **« Comment se calcule le prix ? »** : « Sur soumission, selon la portée : ce qu'il faut modéliser ou dessiner, la quantité d'éléments, les documents reçus et l'échéancier. Prix en dollars canadiens, avant TPS et TVQ. » **[facteurs à confirmer, question 5]** — **Ajouter** « Quels documents faut-il envoyer ? » (liste de H9) — **Garder** « Quelle région desservez-vous ? » : Le Grand Montréal. Nous travaillons en français et en anglais. |
| H11 | Parlons de votre prochain projet. · Vous avez besoin de soutien en modélisation BIM, coordination MEP, préfabrication, données d'actifs ou documentation TQC ? Présentez-nous votre projet et les livrables attendus. · Demander une soumission | Envoyez-nous votre projet. · Dites-nous la discipline, les plans disponibles et ce que vous voulez recevoir : modèle, dessins d'atelier, plans tel que construit ou données d'actifs. · Demander une soumission |

### 3.2 Modélisation et coordination BIM (P-01)

| Élément | Avant | Après |
|---|---|---|
| Nom du service | Modélisation BIM et coordination | Modélisation et coordination BIM : architecture, structure, mécanique du bâtiment |
| H1 | Des modèles BIM structurés pour mieux coordonner le projet. | Des modèles BIM à jour et des conflits réglés avant l'installation. |
| Intro | Bimurix soutient les équipes de construction dans la production, la coordination et la vérification des modèles BIM en architecture, structure et mécanique, selon le périmètre et les exigences définis pour chaque mandat. | Bimurix produit, met à jour et coordonne les modèles d'architecture, de structure et de mécanique du bâtiment (MEP), selon la portée de chaque mandat. Les conflits entre corps de métier sont détectés et listés avant d'arriver au chantier. |
| Bouton du haut | Discuter de votre projet BIM | Demander une soumission de modélisation |
| Pour qui | Entrepreneurs généraux, entrepreneurs MEP et firmes de génie-conseil qui ont besoin de modèles BIM structurés, coordonnés et vérifiés selon le périmètre du mandat. | Entrepreneurs généraux, entrepreneurs spécialisés en mécanique du bâtiment et firmes de génie-conseil qui ont besoin de modèles structurés, coordonnés et vérifiés. |
| P4 (titre) | Nos services | Ce que nous faisons |
| P4, 1 | Modélisation architecture · Production ou mise à jour des éléments architecturaux du modèle selon les documents de référence, le niveau de développement et les exigences convenus. | Modélisation d'architecture · Production ou mise à jour des éléments architecturaux selon les documents de référence et le niveau de développement convenu. |
| P4, 2 | Modélisation structure · Modélisation ou mise à jour des éléments structuraux à partir des informations et documents fournis par les responsables concernés. | Modélisation de structure · Modélisation ou mise à jour des éléments structuraux à partir des documents fournis par l'ingénieur ou le concepteur. |
| P4, 3 | Modélisation MEP · Développement des modèles de mécanique du bâtiment, notamment les réseaux et équipements de plomberie, chauffage et autres disciplines incluses dans le mandat. | Modélisation de mécanique du bâtiment · Réseaux et équipements de plomberie, de chauffage et des autres disciplines du mandat : salle mécanique, colonnes montantes, distribution aux étages. |
| P4, 4 | Coordination interdisciplinaire · Préparation et revue des modèles fédérés, identification des conflits et soutien au suivi des problèmes selon le processus de coordination du projet. | Coordination et détection de conflits · Préparation du modèle fédéré, détection des conflits entre les corps de métier, liste des conflits pour la réunion de coordination et suivi jusqu'à leur résolution. |
| P4, 5 | Assurance et contrôle qualité · Vérification des éléments convenus : organisation du modèle, propriétés, paramètres, nomenclatures, cohérence des informations et exigences de livraison. | Contrôle de la qualité · Vérification de l'organisation du modèle, des propriétés, des paramètres, des nomenclatures et des exigences de livraison convenues. |
| P5 | Livrables possibles · 6 lignes · Les formats, le niveau de détail et les responsabilités sont précisés dans l'offre de service. | Ce que vous recevez · 6 lignes avec usage (§ 5) · Les formats, le niveau de détail et les responsabilités sont précisés dans la soumission. |
| P6 (nouveau) | (aucun) | Ce qu'il faut nous envoyer : les plans et les modèles de référence · les exigences du projet (niveau de développement, formats) · la liste des corps de métier et de leurs modèles · l'échéancier des réunions de coordination · qui approuve quoi. |
| P7 | Notre approche qualité · 01 Revue des exigences et des documents de référence · 02 Confirmation du périmètre, des responsabilités et des formats · 03 Production ou mise à jour des modèles · 04 Vérifications selon les règles et critères convenus · 05 Remise des livrables et signalement des éléments en attente | Comment ça se passe · 01 Nous revoyons vos exigences et vos documents de référence · 02 Nous confirmons la portée, les responsabilités et les formats · 03 Nous produisons ou mettons à jour les modèles · 04 Nous vérifions selon les règles convenues · 05 Nous livrons et signalons les éléments en attente |
| P11 | Votre équipe a besoin de soutien BIM ? · Présentez-nous les disciplines concernées, l'état d'avancement du projet et les livrables attendus. · Demander une soumission BIM | Un modèle à produire ou à coordonner ? · Indiquez les disciplines, l'avancement du projet et les livrables attendus. · Demander une soumission de modélisation |

### 3.3 Tuyauterie et plomberie (H-02)

| Élément | Avant | Après |
|---|---|---|
| Nom | Préfabrication de tuyauterie mécanique | Dessins d'atelier et préfabrication : tuyauterie et plomberie |
| H1 | Fabriquez votre tuyauterie en atelier, pas sur le chantier. | **Inchangé** (c'est la meilleure phrase du site). |
| Intro | À partir de vos dessins d'atelier approuvés, Bimurix modélise votre tuyauterie dans SysQue (Revit) avec les pièces réelles du fabricant. Vous recevez des spools, des listes de coupe et de matériel prêts pour l'atelier, en 5 jours ouvrables. | À partir de vos dessins d'atelier approuvés, Bimurix modélise votre tuyauterie dans SysQue (Revit) avec les pièces réelles du fabricant. Vous recevez des spools, des listes de coupe et de matériel prêts pour l'atelier. Les réseaux mécaniques sont préparés avant leur installation. |
| Bouton | Demander une soumission | Demander une soumission de tuyauterie |
| Pour qui | Entrepreneurs en mécanique du bâtiment et en plomberie (dont les membres de la CMMTQ) qui ont un atelier de préfabrication, fabricants de skids et constructeurs modulaires. | **Inchangé.** |
| P4 (titre) | Ce que couvre l'offre | Ce que nous faisons |
| P4, 1 | Skids d'alimentation en eau · Pompes, collecteurs d'aspiration et de refoulement, avec un cadre selon le dessin du fabricant ou de l'ingénieur. | Skids d'alimentation en eau · Pompes, collecteurs d'aspiration et de refoulement, avec un cadre selon le dessin du fabricant ou de l'ingénieur : le skid s'assemble en atelier. |
| P4, 2 | Chauffage et refroidissement · Eau chaude, eau refroidie et glycol. | **Inchangé** (reste factuel). |
| P4, 3 | Plomberie de tout type · Toute canalisation de plomberie, modélisée à partir des dessins d'atelier approuvés. | **Inchangé.** |
| P4, 4 | Pièces réelles du fabricant · Raccords, vannes, accouplements et supports tirés du contenu fabricant de SysQue : les longueurs de coupe et les listes de matériel correspondent à ce que vous commandez. | **Inchangé.** |
| P4, 5 | Supports coordonnés · Suspensions à tige, trapèzes, supports muraux et au sol, glissières, guides et ancrages, selon la canalisation et son diamètre, coordonnés avec la structure et les autres métiers. | **Inchangé.** |
| P4, 6 | Parasismique · Contreventements rigides modélisés et coordonnés selon les dessins et les calculs approuvés. | **Inchangé.** |
| P4, 7 (repris de l'ancien texte « Préfabrication MEP ») | Coordination des parcours · Vérification de la cohérence des parcours avec les modèles et contraintes communiqués par les autres disciplines. | Coordination des parcours · Vérification des parcours des réseaux avec les modèles et les contraintes des autres corps de métier, avant la fabrication. |
| P4, 8 (repris de l'ancien texte) | Contrôle des informations · Vérification des dimensions, raccords, assemblages, annotations et propriétés inclus dans le périmètre convenu. | Contrôle des informations · Vérification des dimensions, des raccords, des assemblages, des annotations et des propriétés. |
| P5 | Ce que vous recevez · 8 lignes · « À la fin d'une zone pilote, vous recevez un bilan d'une page… » · Les livrables dépendent des outils utilisés, des informations reçues et du processus de fabrication du client. | Ce que vous recevez · 8 lignes avec usage (§ 5) + « Vues isométriques et listes de points à vérifier » (repris de l'ancien texte) · Bilan d'une page : **retiré** (question 6) · Note sur les outils : **inchangée**. |
| P6 | Ce dont nous avons besoin pour démarrer · Les dessins d'atelier approuvés · Le modèle de l'ingénieur ou les plans · Les fabricants retenus (raccords, vannes, supports) · Les standards de votre atelier | Ce qu'il faut nous envoyer · **Mêmes quatre lignes**, plus : la zone ou les systèmes à préfabriquer. |
| P7 | Comment ça marche · 01 Vous demandez une soumission : zone pilote, fabricants retenus et délai souhaité. · 02 Vous envoyez les dessins d'atelier approuvés ou le modèle de l'ingénieur. · 03 Vous recevez le paquet d'atelier en 5 jours ouvrables à partir de documents complets. | Comment ça se passe · 01 Vous demandez une soumission : zone ou systèmes à préfabriquer, fabricants retenus, échéancier. · 02 Vous envoyez les dessins d'atelier approuvés ou le modèle de l'ingénieur. · 03 Nous modélisons, nous vérifions, puis vous recevez le paquet d'atelier. |
| P3 « Pourquoi… » | Pourquoi préparer la préfabrication avec une approche BIM ? · 5 points | Fusionné dans les situations types (« Ce que ça évite »). La liste d'origine reste dans `production`. |
| P11 | Prêt à essayer sur une zone ? · Dites-nous la zone à préfabriquer, vos fabricants et le délai souhaité. · Demander une soumission | Une tuyauterie à préfabriquer ? · Dites-nous les systèmes, vos fabricants et l'échéancier. · Demander une soumission de tuyauterie |

### 3.4 Gicleurs (G-03)

| Élément | Avant | Après |
|---|---|---|
| Nom | Préfabrication de gicleurs | Dessins d'atelier : protection incendie (gicleurs) |
| H1 | Des dessins d'atelier de gicleurs, livrés en 5 jours ouvrables. | Des dessins d'atelier de gicleurs quand vos dessinateurs manquent. |
| Intro | Bimurix dessine vos étages de gicleurs dans AutoSPRINK : dessins d'atelier, listes de coupe et supports, avec un export Revit et NWC pour la coordination. Un renfort de dessin quand la pointe arrive. | **Inchangée.** |
| Bouton | Demander une soumission | Demander une soumission de gicleurs |
| Pour qui | Entrepreneurs en gicleurs (protection incendie) qui manquent de dessinateurs en période de pointe. | **Inchangé.** |
| P4 | Dessins d'atelier · Listes de coupe et de matériel · Supports et parasismique · **Un étage à la fois : le forfait d'entrée couvre un étage jusqu'à 10 000 pi². Au-delà : au nombre de têtes, sur soumission.** | Les trois premiers : **inchangés**. Le quatrième devient : **Étage par étage** · La portée se précise à la soumission : étages, superficie et nombre de têtes. |
| P5 | Ce que vous recevez · 5 lignes | 5 lignes avec usage (§ 5). |
| P6 (nouveau) | (aucun) | Ce qu'il faut nous envoyer : les plans ou le modèle de l'ingénieur · vos standards · l'étage ou la zone à dessiner · les fabricants retenus, s'ils sont imposés. |
| P7 | 01 Vous demandez une soumission : étage à dessiner et délai souhaité. 02 Vous envoyez les plans ou le modèle de l'ingénieur et vos standards. 03 Vous recevez les dessins d'atelier en 5 jours ouvrables à partir de documents complets. | 01 Vous demandez une soumission : étage à dessiner et échéancier. 02 Vous envoyez les plans ou le modèle de l'ingénieur et vos standards. 03 Nous dessinons, nous vérifions, puis vous recevez les dessins d'atelier. |
| P11 | Un étage à dessiner cette semaine ? · Dites-nous l'étage à dessiner et le délai souhaité. | Des gicleurs à dessiner ? · Dites-nous les étages à dessiner et l'échéancier. · Demander une soumission de gicleurs |

### 3.5 Tuyauterie + gicleurs (C-04)

| Élément | Avant | Après |
|---|---|---|
| Nom | Tuyauterie et gicleurs coordonnés | Coordination tuyauterie et gicleurs |
| H1 | Tuyauterie et gicleurs coordonnés avant la fabrication. | **Inchangé.** |
| Intro | Une zone modélisée dans les deux disciplines, avec SysQue et AutoSPRINK. Les conflits sont réglés avant la fabrication et vous recevez les dessins d'atelier des deux. Un seul interlocuteur, moins d'allers-retours. | **Inchangée.** |
| Bouton | Demander une soumission | Demander une soumission tuyauterie + gicleurs |
| Pour qui | Entrepreneurs mécaniques qui font les deux disciplines, entrepreneurs généraux et constructeurs modulaires. | **Inchangé.** |
| P4, 1 | Une zone, deux disciplines · La tuyauterie dans SysQue et les gicleurs dans AutoSPRINK, dans le même modèle de coordination. | **Inchangé.** |
| P4, 2 | Conflits réglés avant la fabrication · Les croisements entre tuyauterie, gicleurs et autres métiers sont réglés au modèle, pas sur le chantier. | Détection de conflits avant la fabrication · Les croisements entre tuyauterie, gicleurs et autres corps de métier sont détectés et réglés au modèle, pas sur le chantier. |
| P4, 3 | Dessins d'atelier des deux disciplines · Spools de tuyauterie et dessins de gicleurs issus du même modèle coordonné. | **Inchangé.** |
| P4, 4 | Un seul interlocuteur · Un seul interlocuteur maîtrise les deux outils : moins d'allers-retours. | **Inchangé.** |
| P5 | 4 lignes | 4 lignes avec usage (§ 5). |
| P6 (nouveau) | (aucun) | Ce qu'il faut nous envoyer : les dessins d'atelier approuvés, le modèle de l'ingénieur ou les plans · les fabricants retenus · la zone à modéliser · les modèles des autres corps de métier, s'ils existent. |
| P7 | 01 … zone à modéliser et fabricants retenus. 02 … 03 Vous recevez les dessins des deux disciplines en 7 jours ouvrables à partir de documents complets. | 01 Vous demandez une soumission : zone à modéliser et fabricants retenus. 02 Vous envoyez les documents. 03 Nous coordonnons, nous vérifions, puis vous recevez les dessins des deux disciplines. |
| P11 | Deux disciplines, une seule zone à essayer. · Dites-nous la zone à modéliser dans les deux disciplines et vos fabricants. | Deux disciplines à coordonner ? · Dites-nous la zone, les deux disciplines et vos fabricants. · Demander une soumission tuyauterie + gicleurs |

### 3.6 Données d'actifs, BIM 7D (D-05)

| Élément | Avant | Après |
|---|---|---|
| Nom | BIM 7D et données d'actifs | Données d'actifs pour l'exploitation (BIM 7D) |
| H1 | Des données BIM organisées pour faciliter la livraison du bâtiment. | Des données d'équipements complètes à la remise du bâtiment. |
| Intro | Bimurix aide à structurer, compléter et vérifier les informations associées aux équipements et aux actifs du bâtiment, en fonction des exigences de remise et des besoins d'exploitation définis par le client. | Bimurix structure, complète et vérifie les informations des équipements et des actifs du bâtiment, selon les exigences de remise et les besoins d'exploitation du client. Les données manquantes sont signalées, jamais inventées. |
| Bouton | Discuter de vos données BIM | Demander une soumission de données 7D |
| Pour qui | Propriétaires institutionnels et gestionnaires d'actifs, entrepreneurs généraux et entrepreneurs mécaniques qui livrent un modèle tel que construit avec données, firmes d'ingénierie. | **Inchangé.** |
| P4 | 11 blocs | 9 blocs, mêmes faits : **Audit des données** · **Structuration des paramètres** · **Remplissage des données** · **Contrôle de complétude** · **Codification des équipements** (pompes, réservoirs, compteurs, chauffe-eau, panneaux radiants) · **Robinets** : numéro, fonction et position normale (à bille, papillon, équilibrage, filtre, antirefoulement, réducteur de pression) · **Lien avec les dessins d'atelier** (numéro de devis, description, code de système, quantité, nom du dessin révisé, tirés de vos livrables Procore) · **Local de chaque élément** (numéro et nom du local) · **Préparation à la remise et à l'exploitation-maintenance** (tableaux, nomenclatures, exports). |
| P5 | Exemples de données · 8 lignes + Ce que vous recevez avec l'audit 7D · Rapport Excel des données manquantes ou erronées · Détail par élément du modèle | Ce que vous recevez · rapport Excel des données manquantes ou erronées, détail par élément · données d'actifs (identifiant, désignation, fabricant et modèle, numéro de série, localisation, garantie, consignes d'entretien, références aux manuels d'exploitation et d'entretien) **avec usage** (§ 5). Phrase « Les données ne sont jamais inventées… » : **inchangée**. |
| P6 (nouveau) | (aucun) | Ce qu'il faut nous envoyer : le modèle (format) · la convention de codification du propriétaire · les grilles de suivi · les livrables de dessins d'atelier · le type et le nombre approximatif d'actifs. |
| P7 | Méthode de travail · 01 Revoir les exigences d'information du client … 05 Produire les exports et livrables convenus | Comment ça se passe · 01 Nous revoyons vos exigences d'information · 02 Nous définissons les paramètres et les formats · 03 Nous intégrons les données fournies par les parties responsables · 04 Nous contrôlons la complétude et la cohérence · 05 Nous produisons les exports et les livrables convenus |
| P11 | Vous devez compléter les paramètres de vos modèles BIM ? · Indiquez les types d'actifs, le format du modèle, les exigences de remise et le volume approximatif de données. · Demander une soumission pour les données BIM | Des données d'équipements à fournir à la remise ? · Indiquez les types d'actifs, le format du modèle, les exigences de remise et le volume approximatif de données. · Demander une soumission de données 7D |

### 3.7 Tel que construit, TQC (Q-06)

| Élément | Avant | Après |
|---|---|---|
| Nom | TQC et contrôle qualité | Modèles et plans tel que construit (TQC) |
| H1 | Des livrables finaux cohérents avec les informations du chantier. | Des plans et des modèles tel que construit qui reflètent le chantier. |
| Intro | Bimurix soutient la préparation des documents et modèles tel que construit à partir des relevés, annotations, changements approuvés et informations transmis par les équipes responsables du projet. | Bimurix prépare les modèles et les plans tel que construit à partir de vos relevés, de vos annotations et des changements approuvés. Un élément n'est jamais présenté comme vérifié sur chantier sans les données qui le prouvent. |
| Bouton | Discuter de vos livrables TQC | Demander une soumission tel que construit |
| Pour qui | Entrepreneurs généraux et entrepreneurs mécaniques qui livrent un modèle tel que construit, firmes de génie-conseil et propriétaires qui préparent la remise finale d'un projet. | **Inchangé.** |
| P4, 1 | Mise à jour des modèles · Intégration des modifications documentées et validées dans les modèles concernés, selon le périmètre du mandat. | Mise à jour des modèles · Intégration des demandes de changement documentées et approuvées dans les modèles concernés. |
| P4, 2 | Mise à jour des plans · Révision des plans et vues pour refléter les changements confirmés et les informations disponibles. | **Inchangé.** |
| P4, 3 | Intégration des informations terrain · Organisation et intégration des relevés, annotations, photos référencées et autres données fournies lorsque leur utilisation est prévue au mandat. | Intégration des informations de chantier · Organisation des relevés, des annotations et des photos référencées, quand leur utilisation est prévue au mandat. |
| P4, 4 | Vérification de cohérence · Comparaison des modèles, plans, nomenclatures et documents dans les limites des informations reçues. | **Inchangé.** |
| P4, 5 | Préparation du dossier de remise · Organisation des fichiers, versions et documents convenus pour la livraison finale. | Préparation du dossier de remise · Organisation des fichiers, des versions et des documents convenus pour la livraison finale, par exemple les manuels d'exploitation et d'entretien fournis. |
| P6 | Informations nécessaires · 6 lignes · La qualité d'un dossier tel que construit dépend de… | Ce qu'il faut nous envoyer · **Mêmes six lignes** · Avertissement **inchangé** (il est honnête et utile). |
| P7 | Notre démarche · 01 Inventorier les documents et informations reçus … 05 Remettre les fichiers et signaler les réserves restantes | Comment ça se passe · 01 Nous inventorions les documents reçus · 02 Nous repérons les données manquantes ou ambiguës · 03 Nous intégrons les changements confirmés · 04 Nous vérifions la cohérence selon les critères convenus · 05 Nous remettons les fichiers et nous signalons les réserves restantes |
| P11 | Vous préparez la remise finale d'un projet ? · Présentez-nous vos exigences TQC, les disciplines concernées et les documents disponibles. · Demander une soumission TQC | Une remise finale à préparer ? · Indiquez les exigences de remise, les disciplines et les documents disponibles : plans de référence, relevés, changements approuvés. · Demander une soumission tel que construit |

### 3.8 À propos et Soumission

| Élément | Avant | Après |
|---|---|---|
| À propos, H1 | Le BIM au service de la qualité et de la coordination. | Le BIM au service du chantier : qualité et coordination. |
| À propos, intro | Bimurix est une entreprise de services BIM et de construction numérique qui accompagne les équipes de projet dans la production, la coordination et la structuration des informations du bâtiment. | Bimurix est une entreprise de services BIM et de construction numérique. Nous aidons les équipes de projet à produire, coordonner et structurer l'information du bâtiment, du modèle de conception à la remise. |
| AP2 (titre + corps) | Nos domaines d'intervention · 6 lignes | Ce que nous faisons · les trois familles, chacune avec ses services et un lien : Modéliser et coordonner · Préfabriquer · Livrer et exploiter. |
| AP3 | Notre positionnement en préfabrication · Bimurix est un spécialiste BIM MEP et préfabrication. Notre expérience en construction modulaire guide notre façon de coordonner : ce qui est dessiné doit pouvoir se fabriquer. · Préfabrication de tuyauterie avec SysQue et de gicleurs avec AutoSPRINK · Une automatisation maison avec Dynamo et pyRevit, pour livrer plus vite · Un service bilingue, en français et en anglais · Un interlocuteur local, dans le Grand Montréal | **Inchangé.** |
| AP4 | Notre approche · Comprendre avant de produire · Structurer l'information · Contrôler les livrables · Collaborer avec les équipes · (+ Engagement : clarté du périmètre, transparence sur les informations disponibles, traçabilité) | Notre façon de travailler · **Nous comprenons avant de produire** : objectifs, exigences, responsabilités, formats attendus. · **Nous structurons l'information** selon les conventions du projet. · **Nous contrôlons les livrables** et nous signalons les points à confirmer. · **Nous travaillons avec vos décisions** : nous partons des informations que les responsables du projet nous transmettent. · Sous la liste : « Chaque mandat est défini selon vos besoins, les responsabilités des intervenants et les critères d'acceptation du projet. » |
| AP6 | Parlons de vos besoins BIM. · Nous contacter | Un projet à nous confier ? · Demander une soumission |
| Soumission, H1 | Parlez-nous de votre projet. | **Inchangé.** |
| Soumission, intro | Décrivez votre besoin dans le formulaire ci-dessous. Les informations transmises nous aideront à comprendre votre demande et à déterminer les prochaines étapes. | Décrivez votre projet et le service qui vous intéresse. Plus nous avons de détails (plans, disciplines, échéancier), plus la soumission est juste. |
| Soumission, encart (nouveau) | (aucun) | Ce qu'il faut nous envoyer : les plans ou le modèle de l'ingénieur · les dessins d'atelier approuvés · les fabricants retenus · les exigences de remise du propriétaire · vos standards. Vous pouvez aussi les envoyer après votre demande. **[à confirmer, question 7]** |
| Soumission, message de succès | Votre message a été transmis. Nous examinerons les informations fournies et communiquerons avec vous si des précisions sont nécessaires. | **Inchangé** (ne promet aucun délai). |

### 3.9 Tableau « Qui fait quoi » (nouveau bloc, identique sur l'accueil, À propos et les six services)
| Responsabilité | Bimurix | Ingénieur | Entrepreneur |
|---|---|---|---|
| Conception et calculs (y compris parasismique) | | ● | |
| Approbation, signature et sceau des dessins | | ● | ● (l'approbation et la signature des dessins d'atelier) |
| Modèles, dessins d'atelier, listes de coupe et de matériel | ● | | |
| Détection de conflits et suivi des corrections | ● | | ● (décide des corrections) |
| Dessins d'atelier approuvés, fabricants retenus, standards de l'atelier | | | ● (les fournit) |
| Relevés de chantier et changements approuvés (tel que construit) | | | ● (les fournit) |
| Fabrication et installation | | | ● |

Phrase sous le tableau, **mot pour mot** : « La conception, les calculs (y compris parasismique), l'approbation, la signature et le sceau des dessins restent à l'ingénieur ou à l'entrepreneur. »
Sur chaque page de service, seules les lignes pertinentes sont affichées (champ « lignes à afficher » dans Studio). Le tableau n'affirme rien que le texte d'origine ne dit déjà ; la ligne « Détection de conflits » est à confirmer (question 3).

---

## 4. Situations types (deux par service)

Titre de chaque bloc : **Situation type**. Phrase fixe sous le titre de la section : « Ces situations sont des exemples types. Elles ne décrivent pas un projet réel ni un client de Bimurix. »
Format : **Situation → Ce que fait Bimurix → Ce que vous recevez → Ce que ça évite.** Aucun nom, aucun chiffre de gain, aucun pourcentage.
Les faits sur ce que fait Bimurix viennent des prestations d'origine ; la ligne « Ce que ça évite » décrit la conséquence connue sur un chantier, sans la chiffrer.

### 4.1 Modélisation et coordination BIM (P-01)
**Situation type 1 — Trois modèles qui ne se sont jamais vus ensemble**
- **Situation** : la mécanique, la structure et l'architecture sont modélisées par des équipes différentes. La veille de la réunion de coordination, personne n'a regardé les modèles ensemble.
- **Ce que fait Bimurix** : prépare le modèle fédéré, détecte les conflits entre les corps de métier (un conduit contre une poutre, une tuyauterie contre un gicleur) et les classe par étage et par discipline.
- **Ce que vous recevez** : le modèle fédéré, la liste des conflits pour la réunion de coordination, le registre des éléments à corriger ou à confirmer.
- **Ce que ça évite** : découvrir au chantier qu'une poutre bloque le passage d'une colonne montante.

**Situation type 2 — Un modèle de conception incomplet**
- **Situation** : le modèle reçu a des niveaux de détail inégaux, des paramètres vides et des nomenclatures qui ne concordent pas. L'entrepreneur général doit pourtant s'en servir pour planifier.
- **Ce que fait Bimurix** : revoit le modèle selon vos exigences, met à jour l'architecture, la structure ou la mécanique du bâtiment selon le mandat, vérifie les paramètres et les nomenclatures.
- **Ce que vous recevez** : le modèle mis à jour, la liste de vérification de la qualité, la liste des points à confirmer auprès du concepteur.
- **Ce que ça évite** : bâtir une planification et des quantités sur des données qui ne concordent pas.

### 4.2 Tuyauterie et plomberie (H-02)
**Situation type 1 — Des dessins approuvés qui ne se fabriquent pas**
- **Situation** : les dessins d'atelier sont approuvés, mais l'atelier n'a ni longueurs de coupe ni numéros de pièces du fabricant. Le chantier avance.
- **Ce que fait Bimurix** : modélise les réseaux approuvés dans SysQue avec les pièces réelles du fabricant retenu, les découpe en spools et les numérote.
- **Ce que vous recevez** : des dessins de spool et d'assemblage numérotés, des listes de coupe et de matériel avec les références du fabricant, des étiquettes imprimables.
- **Ce que ça évite** : couper et ajuster la tuyauterie sur place, avec des pièces qui ne correspondent pas à la commande.
- Reprend l'idée de l'ancien texte de `production` : « Préparer les réseaux mécaniques avant leur installation ».

**Situation type 2 — Un skid à préparer pour une salle mécanique serrée**
- **Situation** : une salle mécanique doit recevoir des pompes, des collecteurs et un cadre. L'espace est limité et le dessin du fabricant est approuvé par l'ingénieur.
- **Ce que fait Bimurix** : modélise le skid (pompes, collecteurs d'aspiration et de refoulement, cadre selon le dessin du fabricant ou de l'ingénieur) et coordonne les supports et les contreventements.
- **Ce que vous recevez** : les dessins d'assemblage et de spool, la liste de matériel.
- **Ce que ça évite** : assembler le skid dans la salle mécanique, sans dessin d'assemblage, avec des parcours vérifiés trop tard. (La conception structurale du cadre reste à l'ingénieur.)

### 4.3 Gicleurs (G-03)
**Situation type 1 — La pointe de travail**
- **Situation** : plusieurs soumissions de dessins d'atelier arrivent en même temps et vos dessinateurs de gicleurs sont déjà au maximum.
- **Ce que fait Bimurix** : dessine les étages dans AutoSPRINK, à partir des plans ou du modèle de l'ingénieur et de vos standards, étage par étage.
- **Ce que vous recevez** : le fichier AutoSPRINK, les dessins d'atelier, les listes de coupe et de matériel.
- **Ce que ça évite** : refuser un contrat ou retarder l'envoi des dessins d'atelier à l'ingénieur.

**Situation type 2 — Les gicleurs doivent apparaître au modèle de coordination**
- **Situation** : le modèle de coordination est dans Revit et Navisworks. Le réseau de gicleurs doit y figurer pour la réunion de coordination.
- **Ce que fait Bimurix** : exporte le réseau vers Revit ou NWC et coordonne les supports et les contreventements parasismiques selon les calculs approuvés.
- **Ce que vous recevez** : l'export Revit ou NWC, les supports et contreventements coordonnés.
- **Ce que ça évite** : découvrir un croisement avec une conduite ou un chemin de câbles au moment d'installer.

### 4.4 Tuyauterie + gicleurs (C-04)
**Situation type 1 — Un corridor technique, deux fournisseurs de dessins**
- **Situation** : un corridor reçoit de la tuyauterie, des gicleurs et d'autres réseaux. Deux fournisseurs dessinent chacun de leur côté.
- **Ce que fait Bimurix** : modélise la tuyauterie dans SysQue et les gicleurs dans AutoSPRINK, dans le même modèle de coordination, et règle les croisements au modèle.
- **Ce que vous recevez** : le modèle coordonné de la zone, les dessins de spool de tuyauterie, les dessins d'atelier de gicleurs.
- **Ce que ça évite** : les allers-retours entre deux fournisseurs et les reprises à l'installation.

**Situation type 2 — Les gicleurs d'abord, la tuyauterie ensuite**
- **Situation** : les gicleurs ont été dessinés en premier. La tuyauterie arrive plus tard et passe au même endroit.
- **Ce que fait Bimurix** : met les deux disciplines dans un seul modèle, détecte les conflits et propose les déplacements à valider avec vous et avec l'ingénieur.
- **Ce que vous recevez** : la liste des conflits réglés, les listes de coupe et de matériel des deux disciplines, les dessins d'atelier des deux.
- **Ce que ça évite** : refaire des dessins déjà envoyés à l'atelier.

### 4.5 Données d'actifs, BIM 7D (D-05)
**Situation type 1 — Une remise qui approche, des champs vides**
- **Situation** : le propriétaire a une grille de suivi des équipements. À l'approche de la remise, le modèle de mécanique du bâtiment a des champs vides et des codes qui ne suivent pas la convention.
- **Ce que fait Bimurix** : compare le modèle aux grilles du propriétaire et rapporte, élément par élément, les données manquantes ou erronées. Rien n'est inventé.
- **Ce que vous recevez** : un rapport Excel des données manquantes ou erronées, avec le détail par élément.
- **Ce que ça évite** : repousser la remise finale pour des champs à compléter.

**Situation type 2 — Retrouver une vanne dans le plafond**
- **Situation** : l'équipe d'entretien du propriétaire cherche une vanne : où est-elle, de quel type, quelle est sa position normale ?
- **Ce que fait Bimurix** : numérote les robinets (code d'équipement et code de système), renseigne leur fonction et leur position normale, repère chaque élément dans son local.
- **Ce que vous recevez** : un modèle renseigné, avec les données prêtes pour les manuels d'exploitation et d'entretien et la maintenance.
- **Ce que ça évite** : chercher les équipements avec des plans qui ne les identifient pas.

### 4.6 Tel que construit, TQC (Q-06)
**Situation type 1 — Des demandes de changement pendant les travaux**
- **Situation** : des demandes de changement ont déplacé des conduites et des équipements. Les plans de remise montrent encore la conception.
- **Ce que fait Bimurix** : intègre les changements approuvés dans les modèles et les plans, et compare les documents entre eux.
- **Ce que vous recevez** : les modèles et les plans tel que construit mis à jour, la liste des réserves restantes.
- **Ce que ça évite** : remettre au propriétaire des plans qui ne correspondent pas à ce qui est dans le plafond.

**Situation type 2 — Des annotations et des photos éparpillées**
- **Situation** : le contremaître a annoté des plans et pris des photos. Le dossier de remise exige des fichiers organisés et nommés selon la convention du projet.
- **Ce que fait Bimurix** : inventorie les relevés, les annotations et les photos référencées, repère les données manquantes, organise les documents convenus.
- **Ce que vous recevez** : un dossier de remise (fichiers, versions, documents) et la liste des informations manquantes.
- **Ce que ça évite** : fouiller les courriels et les photos au moment de la mise en service et de la remise.

### 4.7 Situations de l'accueil (H6)
Une par famille, tirées des situations ci-dessus : **4.1 n° 1** (Modéliser et coordonner), **4.2 n° 1** (Préfabriquer), **4.5 n° 2** (Livrer et exploiter). Chacune renvoie à la page du service.

---

## 5. Valeur partout : à quoi sert chaque livrable

Chaque ligne de « Ce que vous recevez » porte une demi-phrase d'usage (champ « à quoi ça sert » du bloc `deliverables`).

| Service | Livrable (texte actuel) | À quoi ça sert |
|---|---|---|
| P-01 | Modèles BIM natifs ou formats d'échange convenus | à ce que chaque corps de métier travaille sur la même base |
| P-01 | Modèles fédérés pour la coordination | à voir tous les corps de métier ensemble avant l'installation |
| P-01 | Rapports ou listes de problèmes | à décider en réunion de coordination qui déplace quoi |
| P-01 | Vues, nomenclatures et documents issus du modèle | à sortir les plans et les quantités du même modèle |
| P-01 | Listes de vérification qualité | à savoir ce qui a été contrôlé |
| P-01 | Registre des éléments à corriger ou à confirmer | à suivre chaque point jusqu'à sa résolution |
| H-02 | Modèle Revit SysQue | à garder la source des dessins et à la modifier au besoin |
| H-02 | Dessins de spool et d'assemblage numérotés | à ce que l'atelier fabrique chaque pièce sans ambiguïté |
| H-02 | Listes de coupe et de matériel avec références du fabricant | à couper et à commander les bonnes pièces |
| H-02 | Export pour l'atelier | à transmettre les données à l'atelier de fabrication |
| H-02 | Plans d'installation étiquetés | à ce que les installateurs sachent où va chaque spool |
| H-02 | Étiquettes imprimables pour chaque spool et support | à repérer chaque pièce à la réception et à l'installation |
| H-02 | Plans couleur par système et par spool, lisibles sur tablette | à lire l'installation au chantier |
| H-02 | Hauteurs de tiges calculées | à couper les tiges d'après les listes de matériel |
| H-02 (repris de l'ancien texte) | Vues isométriques ou détails · Listes de points à vérifier ou à résoudre | à comprendre un assemblage d'un coup d'œil · à régler les questions avant la fabrication |
| G-03 | Fichier AutoSPRINK | à reprendre et à modifier les dessins dans votre propre outil |
| G-03 | Export Revit ou NWC | à vérifier les croisements avec les autres corps de métier |
| G-03 | Dessins d'atelier | à fabriquer et à installer, après approbation par l'ingénieur ou l'entrepreneur |
| G-03 | Listes de coupe et de matériel | à fabriquer et à commander |
| G-03 | Supports et contreventements parasismiques coordonnés | à installer selon les calculs approuvés par l'ingénieur |
| C-04 | Modèle coordonné de la zone | à voir tuyauterie, gicleurs et autres corps de métier dans un seul modèle |
| C-04 | Dessins de spool de tuyauterie | à fabriquer la tuyauterie en atelier |
| C-04 | Dessins d'atelier de gicleurs | à fabriquer et à installer les gicleurs |
| C-04 | Listes de coupe et de matériel des deux disciplines | à commander et à fabriquer les deux réseaux d'un seul coup |
| D-05 | Rapport Excel des données manquantes ou erronées, avec détail par élément | à savoir quoi compléter avant la remise |
| D-05 | Données d'actifs : identifiant, désignation, fabricant et modèle, numéro de série, localisation, garantie, consignes d'entretien, références aux manuels | à ce que l'équipe d'exploitation retrouve chaque équipement et son entretien |
| Q-06 | Modèles et plans tel que construit mis à jour | à remettre au propriétaire ce qui est réellement installé |
| Q-06 | Dossier de remise (fichiers, versions, documents) | à retrouver chaque document sans fouiller |
| Q-06 | Liste des réserves restantes | à savoir ce qui reste à confirmer avant la fermeture du dossier |

Pour les trois lignes « D-05 données d'actifs », « Q-06 dossier de remise » et « C-04 listes des deux disciplines », les usages sont des
déductions tirées des prestations d'origine ; le client les relit (question 12).

---

## 6. Parcours vers l'action

### 6.1 Où poser « Demander une soumission »
| Page | Emplacements | Cible |
|---|---|---|
| Toutes | **En-tête du site** : bouton permanent à droite du menu (déjà présent à vérifier) | `/soumission` |
| Accueil | H1 (bouton principal) · après H6 Situations types · H11 appel final | `/soumission` ; sur H6, `/soumission?service=…` du service de la situation |
| Service | P1 (bouton du haut, libellé du service) · après P3 Situations types (lien « Demander une soumission pour une situation comme celle-ci ») · P11 appel final | `/soumission?service=<id>` |
| À propos | AP6 | `/soumission` |
| Mobile | Barre fixe en bas de l'écran, 44 px, en CSS seulement (aucun script) : option à tester contre la lisibilité du pied de page | `/soumission` |

Règle : **un seul bouton principal visible par écran**. Les autres liens vers la soumission sont des liens soulignés, pas des boutons.

### 6.2 Libellé par service
| Service | Bouton du haut et appel final |
|---|---|
| Accueil, À propos | Demander une soumission |
| P-01 | Demander une soumission de modélisation |
| H-02 | Demander une soumission de tuyauterie |
| G-03 | Demander une soumission de gicleurs |
| C-04 | Demander une soumission tuyauterie + gicleurs |
| D-05 | Demander une soumission de données 7D |
| Q-06 | Demander une soumission tel que construit |

### 6.3 « Ce qu'il faut nous envoyer »
Section P6 sur chaque service, H9 sur l'accueil, encart SO2 sur la page Soumission. Contenu : § 3.2 à 3.8. Le message est le même partout :
*plus la demande est précise, plus la soumission l'est.* Aucun engagement de délai de réponse n'est écrit nulle part (question 1).

### 6.4 FAQ refaite (accueil ; trois à quatre questions par service reprises de la liste)
1. Faut-il avoir SysQue ? — Non. Vous recevez des PDF, des listes Excel et des étiquettes. Le modèle Revit est inclus si vous le voulez. *(inchangé)*
2. Qui conçoit le parasismique ? — Votre ingénieur. Bimurix modélise et coordonne les contreventements selon les dessins et les calculs approuvés. *(inchangé)*
3. Qui signe les dessins ? — Bimurix produit les dessins. L'approbation, la signature et le sceau restent à l'ingénieur ou à l'entrepreneur. *(inchangé)*
4. Quels fabricants ? — Ceux que vous utilisez déjà, pour les raccords, les vannes et les supports, grâce au contenu fabricant de SysQue. *(inchangé)*
5. **Quels documents faut-il envoyer ?** — Les plans ou le modèle de l'ingénieur, les dessins d'atelier approuvés, les fabricants retenus, vos standards, les exigences de remise du propriétaire. *(nouveau)*
6. **Comment se calcule le prix ?** — Sur soumission, selon la portée : ce qu'il faut modéliser ou dessiner, la quantité d'éléments, les documents reçus et l'échéancier. Prix en dollars canadiens, avant TPS et TVQ. *(nouveau ; question 5)*
7. **Mon projet démarre bientôt : pouvez-vous suivre ?** — Le délai dépend de la portée et des documents reçus. Indiquez votre échéancier dans la demande ; la soumission le précise. *(réécrit)*
8. Quelle région desservez-vous ? — Le Grand Montréal. Nous travaillons en français et en anglais. *(inchangé)*

Questions retirées : « Le prix inclut-il les taxes ? » (fondue dans la 6) et « Le montant du forfait est-il perdu ? » (crédit de forfait).
Questions par service : P-01 → 3, 5, 6 ; H-02 → 1, 2, 3, 4 ; G-03 → 2, 3, 5, 6 ; C-04 → 3, 4, 5, 6 ; D-05 → 5, 6 + « Que faites-vous si une donnée manque ? » (« Elle est signalée comme manquante ou à confirmer ; nous n'inventons rien. ») ; Q-06 → 5, 6 + « Pouvez-vous vérifier le chantier ? » (« Non : nous travaillons à partir de vos relevés et changements approuvés. Un élément n'est jamais présenté comme vérifié sur chantier sans données. »).

---

## 7. Images : emplacements, ratios, textes alternatifs

Règles (valables pour toutes les images) :
1. **Toute image passe par un champ Sanity** (`imageWithAlt` : fichier + texte alternatif FR/EN + légende) ; aucune image dans le code.
2. **Photo de banque d'images** : légende « Photo d'illustration » obligatoire ; jamais de nom de projet, de client ni de lieu ; aucun logo ni marque visible (casques, camions, panneaux, ordinateurs) ; pas de visage identifiable en gros plan ; elle ne suggère jamais un projet de Bimurix.
3. **Capture d'un vrai livrable** : fournie par le client, anonymisée (nom du projet, du client, de l'entrepreneur retirés) ; légende « Exemple de livrable, informations masquées ».
4. **Schéma au trait SVG** : dessiné dans le style feuille de plan (trait 1,5 px, couleurs de réseau des tokens, JetBrains Mono pour les cotes) ; légende « Schéma illustratif ».
5. Dimensions et ratio fixés dans le gabarit (pas de saut de mise en page), chargement différé sous la ligne de flottaison, `fetchpriority` haut seulement pour l'image du haut. Une photo pèse au plus 120 Ko après compression (AVIF/WebP).
6. L'image décorative a un texte alternatif vide ; l'image qui informe a un texte alternatif de une phrase.
7. **Aucun téléchargement n'est fait dans cette tâche.** Les mots-clés servent à la recherche sur Unsplash par S3.

| Page | Emplacement | Ratio | Sujet | Texte alternatif FR | Type recommandé | Mots-clés de recherche |
|---|---|---|---|---|---|---|
| Accueil | H1 : isométrique des six réseaux | existant (SVG) | Six réseaux colorés | « Schéma isométrique des six services de Bimurix, un réseau par service. » | Schéma SVG (**existant**) | — |
| Accueil | H2 : bande sous « Les problèmes… » | 21:9 (1 680 × 720) | Plafond de chantier avec tuyauterie et conduits | « Tuyauterie et conduits suspendus dans un plafond de chantier. » | Photo d'illustration | `mechanical room pipes` · `construction ceiling pipework` · `hvac ductwork construction` |
| Accueil | H4 : schéma du cycle du projet | 16:5, pleine largeur | Six stations reliées par un trait | « Les six services de Bimurix placés dans l'ordre d'un projet : modélisation, préfabrication, tel que construit, exploitation. » | Schéma SVG (**nouveau**) | — |
| Accueil | H6 : une vignette par situation (3) | 3:2 | Schéma au trait de la situation (conflit, spool, vanne repérée) | « Schéma illustratif : … » (une phrase par vignette) | Schéma SVG | — |
| À propos | AP1 : bande | 21:9 | Chantier de bâtiment institutionnel en construction, sans enseigne | « Chantier de bâtiment en construction. » | Photo d'illustration | `building construction site` · `institutional building construction` · `steel structure construction` |
| À propos | Équipe | — | **Aucune photo d'équipe** : aucun membre n'est publié (CLAUDE.md § 4) | — | — | — |
| Soumission | SO2 : encart « Ce qu'il faut nous envoyer » | — | Aucune image (la page est un formulaire) | — | — | — |
| P-01 | P1 : image du haut | 4:3 | Modèle fédéré : trois corps de métier de trois couleurs, un conflit marqué d'un nuage de révision | « Schéma illustratif : trois modèles superposés, un conflit entre un conduit et une poutre. » | Schéma SVG | — |
| P-01 | P5 : exemple de livrable | 4:3 | Extrait d'un rapport de conflits | « Exemple de livrable : liste de conflits classés par étage. » | **Capture d'un vrai livrable** (client) | — |
| H-02 | P1 : image du haut | 4:3 | Atelier de préfabrication, spools de tuyauterie alignés | « Photo d'illustration : spools de tuyauterie en atelier de préfabrication. » | Photo d'illustration | `pipe spools workshop` · `pipe prefabrication shop` · `plumbing pipes fabrication` |
| H-02 | P5 : exemple de livrable | 4:3 | Un dessin de spool numéroté avec sa liste de coupe | « Exemple de livrable : dessin de spool numéroté et liste de coupe. » | **Capture d'un vrai livrable** (client) | — |
| H-02 | P3 : vignette de chaque situation (2) | 3:2 | Spool numéroté ; skid en plan | « Schéma illustratif : … » | Schéma SVG | — |
| G-03 | P1 : image du haut | 4:3 | Réseau de gicleurs au plafond | « Photo d'illustration : réseau de gicleurs apparent au plafond d'un chantier. » | Photo d'illustration | `fire sprinkler pipes ceiling` · `sprinkler system installation` · `fire protection piping` |
| G-03 | P5 : exemple de livrable | 4:3 | Un dessin d'atelier de gicleurs (un étage) | « Exemple de livrable : dessin d'atelier de gicleurs d'un étage. » | **Capture d'un vrai livrable** (client) | — |
| C-04 | P1 : image du haut | 4:3 | Coupe d'un corridor avec tuyauterie et gicleurs, conflit réglé | « Schéma illustratif : coupe d'un corridor technique avec tuyauterie et gicleurs coordonnés. » | Schéma SVG | — |
| C-04 | P5 : exemple de livrable | 4:3 | Vue du modèle coordonné de la zone | « Exemple de livrable : vue du modèle coordonné d'une zone. » | **Capture d'un vrai livrable** (client), sinon schéma SVG | — |
| D-05 | P1 : image du haut | 4:3 | Salle mécanique avec robinets et équipements identifiés | « Photo d'illustration : robinets et équipements dans une salle mécanique. » | Photo d'illustration | `mechanical room valves` · `boiler room pipes` · `building plant room` |
| D-05 | P5 : exemple de livrable | 4:3 | Extrait du rapport Excel des données manquantes | « Exemple de livrable : rapport Excel des données manquantes par élément. » | **Capture d'un vrai livrable** (client) | — |
| Q-06 | P1 : image du haut | 4:3 | Plan « conçu » et plan « tel que construit » superposés, avec nuage de révision | « Schéma illustratif : un plan de conception et le même plan tel que construit, les différences entourées. » | Schéma SVG | — |
| Q-06 | P5 : exemple de livrable | 4:3 | Plan tel que construit avec cartouche de révision | « Exemple de livrable : plan tel que construit avec cartouche de révision. » | **Capture d'un vrai livrable** (client), sinon schéma SVG | — |

Priorité : les captures de vrais livrables valent plus que toutes les photos, parce qu'elles prouvent ce que le lecteur reçoit. Tant qu'elles ne sont pas fournies, le schéma SVG tient la place et le champ image reste vide (le gabarit n'affiche rien si le champ est vide).
Budget JS : photos en `<img>` natives, schémas en SVG ou HTML rendu côté serveur ; aucune bibliothèque d'images ni de carrousel.

---

## 8. Améliorations de design, sans changer la direction A

La direction **A « La feuille de plan »** est gardée : polices Archivo et JetBrains Mono (données seulement), tokens de `web/src/styles/tokens.css`,
bleu `--bx-blue`, couleurs de réseau, traits `--bx-line-hair` et `--bx-line-frame`, cartouche (Feuille / Révision / Date). Aucune valeur en dur.
Interdits respectés : pas de kickers, pas de grille de cartes identiques, pas de dégradé ni de verre dépoli, pas d'emoji, pas de statistique inventée.

1. **Hiérarchie** : un H1, des H2 de même poids, des H3 seulement pour les groupes (familles de services, lignes du tableau). Pas de niveau sauté. Une idée dominante par écran à 360 px.
2. **Code de service au-dessus du titre (observation de l'audit R3 § 4)** : le code (H-02) est un petit libellé au-dessus du titre de chaque carte, ce qui ressemble à un kicker. Le déplacer à droite du titre, sur la même ligne, en JetBrains Mono, ou dans la colonne « cote » du tableau.
3. **Rythme vertical** : deux espacements de section seulement (grand entre sections, moyen entre un titre et son contenu), définis comme tokens. Alternance fond papier / `--bx-paper-2` toutes les deux sections pour séparer sans cartes.
4. **Familles de services (H3)** : trois groupes à entêtes de ligne (« Modéliser et coordonner », « Préfabriquer », « Livrer et exploiter »), un trait `--bx-rule` entre groupes, la couleur de réseau en filet de gauche. Ce n'est pas une grille de cartes identiques : le groupe Préfabriquer en contient trois, les autres un et deux, en lignes de nomenclature.
5. **Nomenclature à la place des forfaits** : le style du tableau de forfaits (hauteur de ligne, hairlines, colonne code en mono) est **réutilisé** pour « Ce que vous recevez » : colonnes *Cote* (02.1, 02.2…) · *Livrable* · *À quoi ça sert*. Sur mobile, chaque ligne devient une liste de définitions (aucun défilement horizontal).
6. **Situations types** : présentées comme une feuille de plan, pas comme des cartes : une situation = une bande avec quatre cellules séparées par des hairlines (*Situation | Ce que fait Bimurix | Ce que vous recevez | Ce que ça évite*) ; sur mobile, quatre blocs empilés avec leur étiquette. Pas d'icône, pas de numéro décoratif.
7. **Schéma du cycle du projet (H4)** : un SVG rendu côté serveur : un trait horizontal (vertical sur mobile), six stations dans l'ordre du projet (P-01 → H-02, G-03, C-04 → D-05, Q-06), chaque station nommée avec son code en mono et sa couleur de réseau, cliquable vers sa page. Texte alternatif complet et liste de liens équivalente pour les lecteurs d'écran. Aucun script.
8. **Tableau « Qui fait quoi »** : vrai `<table>` avec en-têtes de colonne et de ligne ; cases marquées par un texte (« Oui ») et non par la seule couleur ; hauteur de cellule ≥ 44 px.
9. **Densité** : 11 sections à l'accueil (au lieu de 14) et 11 par service ; paragraphes de 70 caractères de large au plus ; phrases de 20 mots.
10. **Cohérence des codes de feuille** : accueil A-000, À propos A-100, Soumission A-900 ; service S-0n avec n = numéro du code de réseau ; une même règle écrite dans `design/PRODUCT.md`. Le cartouche reste en pied de l'en-tête de chaque page.
11. **Boutons** : un seul principal par écran ; les autres en lien souligné ; cible 44 px ; état de survol, de focus et d'action visibles ; `touch-action: manipulation`.
12. **Images** : ratios fixes, cadre à trait fin comme une feuille, légende en JetBrains Mono (« Photo d'illustration », « Schéma illustratif », « Exemple de livrable »).
13. **Accessibilité** : AA, ordre de lecture identique à l'ordre visuel, un lien d'évitement, `text-wrap: balance` sur les titres, mouvement réduit respecté (aucune animation nouvelle).
14. **Budget de JS (149,8 Ko sur 150)** : tout ajout est du HTML rendu côté serveur ou du SVG ; aucun bloc nouveau n'est « client ». S3 mesure le JS initial de l'accueil avant et après ; si une section dépasse, elle est coupée avant d'élargir le budget.

---

## 9. Liste de retrait : prix, forfaits, délais, crédit, conditions, bandeau

Rien n'est supprimé du code ni de Studio : tout est masqué (ADR-008 n° 1). Réglages Studio : **Forfaits → F-01 à F-05 → « Affiché sur le site » décoché** ; **Pages → Accueil → retirer les blocs « Forfaits » et « Conditions »** (ou les décocher) ; **Lancement et conditions → vider « Crédit sur le projet complet » et laisser « Conditions » sans effet** ; **bandeau de lancement : éteint (déjà)**.

| Page | Ce qui est retiré | Réglage Studio |
|---|---|---|
| Accueil | Titre « Commencez petit, à prix fixe », tableau F-01 à F-05 (prix 1 800 $, 2 200 $, 1 500 $, 2 800 $, 1 200 $ ; délais 5, 5, 5, 7, 3 jours ouvrables ; portées en pi² et en spools), pastille « Recommandé », boutons « Choisir ce forfait — … », « Prix en dollars canadiens, avant TPS et TVQ », exemple de crédit « 12 000 $ − 1 800 $ = 10 200 $ » | Forfaits masqués ; bloc `packages` retiré de la page |
| Accueil | Section « Conditions des forfaits de lancement » (portée d'une zone pilote, portée gicleurs, crédit, documents requis, délai, révisions, **100 $/h**, **paiement 50 % / 50 %, net 15 jours**, exclusions) | Bloc `conditions` retiré ; « Documents requis » et « Exclusions » réutilisés dans « Ce qu'il faut nous envoyer » et « Qui fait quoi » |
| Accueil | FAQ : « Et si un projet démarre vite ? » (5 jours ouvrables), « Le prix inclut-il les taxes ? », « Le montant du forfait est-il perdu ? » | Document FAQ : questions modifiées (§ 6.4) |
| Accueil | Bande « Commencez petit… » dans les cartes de service s'il y en a ; mention « jusqu'à 30 spools » dans toute carte | — |
| Toutes | Bandeau de lancement et date limite | `bannerEnabled` faux (déjà), `deadline` vide |
| P-01 | Rien (aucun forfait) ; vérifier le SEO | — |
| H-02 | « en 5 jours ouvrables » (intro) ; tableau « Forfaits de cette offre » (F-01 Zone pilote, F-02 Skid standard) ; phrase de crédit ; étape 1 « zone pilote… délai souhaité » ; étape 3 « en 5 jours ouvrables » ; bilan « À la fin d'une zone pilote… » (question 6) | F-01, F-02 masqués ; bloc `packages` retiré du gabarit |
| G-03 | « livrés en 5 jours ouvrables » (titre) ; « Un étage à la fois… 10 000 pi² » ; tableau F-03 ; étape 3 « 5 jours ouvrables » ; appel final « cette semaine » | F-03 masqué |
| C-04 | Tableau F-04 (« Recommandé », 7 jours, 2 800 $) ; étape 3 « 7 jours ouvrables » ; appel « une seule zone à essayer » | F-04 masqué |
| D-05 | Tableau F-05 (Audit 7D, 3 jours, 1 200 $) ; « Ce que vous recevez avec l'audit 7D » est repris sans le mot « forfait » | F-05 masqué |
| Q-06 | Rien (aucun forfait) | — |
| À propos | Rien | — |
| Soumission | Paramètre d'adresse `?forfait=F-0n` (reste accepté mais sans effet visible) ; champ « Forfait visé » du formulaire ; phrase « Forfait visé : {package} » des courriels (déjà omise si vide) ; champ « Budget approximatif » (question 8) | Formulaire : option masquée ; modèles de courriel inchangés |
| Courriels | « Forfait visé » (vide quand aucun forfait) | `emailTemplates` inchangé |
| Textes d'interface | « Choisir ce forfait », « Recommandé », « Forfaits de cette offre », « Prix en dollars canadiens », bandeau « jusqu'au… » | `ui-strings` laissés en place, inutilisés |
| Données structurées et SEO | Vérifier qu'aucune description SEO ni donnée structurée ne cite un prix, un délai ou « forfait » | S2 balaie les champs SEO |

Gardé volontairement : « avant TPS et TVQ » (dans la réponse « Comment se calcule le prix ? »), les budgets du formulaire s'ils restent (question 8).

---

## 10. Questions au client

1. **Délai de réponse** : voulez-vous écrire un engagement (« Nous répondons d'ici… ») ou ne rien promettre ? Ce plan ne promet rien.
2. **Noms** : approuvez-vous les six noms complets et courts du § 1, et les trois familles ?
3. **Coordination** : pour « détecter les conflits » et préparer la réunion de coordination, Bimurix prépare-t-il seulement les documents, ou anime-t-il aussi la réunion ? Le tableau « Qui fait quoi » dépend de la réponse.
4. **Images** : pouvez-vous fournir, anonymisés, un dessin de spool, un dessin d'atelier de gicleurs, un rapport de conflits et un rapport Excel de données manquantes ? Acceptez-vous des photos d'illustration de banque d'images (avec la mention « Photo d'illustration ») en attendant ?
5. **Calcul du prix** : la réponse « selon la portée : ce qu'il faut modéliser ou dessiner, la quantité d'éléments, les documents reçus et l'échéancier » est-elle exacte ?
6. **Bilan d'une page** (pourcentage préfabriqué, nombre de spools, heures de modélisation) : le garder comme livrable sans le mot « zone pilote », ou le retirer ?
7. **Envoi des documents** : par courriel après la demande ? Par un lien de partage ? Le formulaire n'a pas de téléversement.
8. **Formulaire** : retirer ou rendre facultatif le champ « Budget approximatif » ? Masquer « Forfait visé » ?
9. **Ordre des codes** : garder D-05 (données d'actifs) puis Q-06 (tel que construit) pour ne pas renuméroter, ou les échanger pour suivre l'ordre du chantier (tel que construit avant l'exploitation) ?
10. **Un ou plusieurs services** : un mandat peut-il couvrir une seule étape du schéma (H4) ? La phrase « une étape ou plusieurs » le dit.
11. **Ancien texte « Préfabrication MEP »** (audit R3 § 2 et § 8 n° 1) : acceptez-vous la reprise de ses quatre éléments utiles (coordination des parcours, contrôle des informations, vues isométriques, listes de points à vérifier) dans la page tuyauterie ?
12. **Usages des livrables** (§ 5) : les trois lignes déduites (données d'actifs, dossier de remise, listes des deux disciplines) vous conviennent-elles ?
13. **Preuve Brennan** : on garde l'encadré sur l'accueil seulement, plus sur les pages tuyauterie et tuyauterie + gicleurs ? (Aucune preuve n'est ajoutée ailleurs.)
14. **Rapports d'audit avant et après, export Excel pour le logiciel de maintenance** (document v3.1, lié à la « mise en conformité 7D ») : les publier comme livrables du service Données d'actifs ?

---

## 11. Découpage pour S2 à S5

Ordre recommandé : **S3a** (champs et blocs vides) → **S2** (contenu) → **S3b** (design et images) → **S5** (audit) ; **S4** peut courir en parallèle (fichiers différents).
Chaque session : un commit par tâche, lint + typecheck + test + build verts, rendu vérifié à 360 px et 1440 px, FR et EN, `production` jamais touché, aucun `git push`.

Contrat de champs entre S3a et S2 (noms provisoires) : `service.shortTitle`, `service.family` (modeler | prefabriquer | livrer), `service.scenarios[]` (`title`, `situation`, `action`, `receive`, `avoid`), `service.needsHeading`/`needs[]`, `service.faq[]`, `service.responsibilityRows[]`, `deliverable.purpose` (sur chaque ligne de livrable), `service.heroImage`/`figureImage` (existant `imageWithAlt` + légende), nouveaux blocs de page `problems`, `project-cycle`, `scenarios`, `responsibility-table`.

| Session | Mission | Fichiers touchés | Risques |
|---|---|---|---|
| **S2 — contenu** | Appliquer les § 3, 4, 5, 6.4 et 9 au dataset `development` : noms, accroches, corps, situations, FAQ, forfaits masqués. Traduire en anglais les textes approuvés. Mettre à jour `scripts/seed/` pour un dataset neuf. | `web/scripts/seed/*.mts`, nouveau `web/scripts/patch-content-s2.mts` (même garde que `patch-content-r1.mts` : refuse tout dataset autre que `development`), `web/tests/unit/seed-integrity.test.ts`, `web/tests/e2e/*` (assertions de prix et de forfaits), `design/PRODUCT.md`, `CLAUDE.md` § 1 | Tests e2e qui cherchent « 1 800 $ » ou « Choisir ce forfait » à réécrire ; masquer un forfait masque son service dans le formulaire (contrat de masquage de l'audit R3 § 6) ; une page EN incomplète ne se publie pas ; `check-placeholders` |
| **S3a — champs et blocs** | Créer les blocs `problems`, `project-cycle`, `scenarios`, `responsibility-table` ; ajouter famille, usage de livrable, FAQ, besoins aux schémas ; refaire le gabarit de page de service (P1 à P11). | `web/src/blocks/{problems,project-cycle,scenarios,responsibility-table}/`, `web/src/blocks/{schemas.ts,render.tsx,service-networks,deliverables}`, `web/src/sanity/schemas/documents/service.ts`, `web/src/sanity/{queries.ts,types-content.ts}`, `web/src/ui/patterns/{ServicePage.tsx,ServicesMenu.tsx,SiteFooter.tsx}` | **Budget JS 149,8/150 Ko** : tout en serveur ; fichier ≤ 300 lignes ; dépendances `blocks → lib` seulement ; compatibilité des documents existants (champs facultatifs) |
| **S3b — design et images** | Appliquer le § 8 : tokens d'espacement, nomenclature des livrables, situations en feuille, schéma du cycle, zones d'image, légendes. Brancher les images (schémas SVG ; photos d'illustration choisies sur Unsplash avec mention ; captures du client). | `web/src/styles/tokens.css`, blocs de S3a, `web/src/ui/patterns/Sheet.tsx`, `web/tests/e2e/a11y.spec.ts`, captures `docs/audits/` | Pas de dégradé ni de kicker ; AA ; cibles 44 px ; photos : pas de logo visible, mention « Photo d'illustration » ; poids des images |
| **S4 — défauts de production** | Corriger les deux défauts du mode production (audit R3 § 10) : 404 réel sur adresse inconnue ; redirection 308 avec en-tête `Location` pour l'ancienne adresse « préfabrication MEP ». | `web/next.config.ts`, `web/src/app/(site)/[locale]/[...slug]/page.tsx`, `web/tests/e2e/pages.spec.ts` (lignes 29 et 61) | Changement de la façon dont Studio publie (reconstruction) ; à vérifier sur Netlify ; ne touche pas le contenu |
| **S5 — audit** | Audit indépendant : fidélité aux faits d'origine (comparaison `production` ↔ `development`), aucun prix ni forfait ni délai publié, mention de l'ingénieur partout, FR et EN complets, 360 px et 1440 px, a11y, JS ≤ 150 Ko, `PLAYWRIGHT_PROD=1`. | `docs/audits/AAAA-MM-JJ_audit-s5.md`, captures | Instabilité du mode dev (voir audit R3 § 1) : utiliser le build de production comme référence |

---

## 12. Bilan chiffré
Sur les 74 sections actuelles des 9 pages (accueil, six services, À propos, soumission) :

| Verdict | Nombre |
|---|---|
| Gardées telles quelles | 9 |
| Réécrites (même sens, nouveaux mots) | 45 |
| Déplacées (texte gardé, nouvelle place) | 2 |
| Fusionnées dans une autre section | 9 |
| Retirées de l'affichage (forfaits, conditions, qualité vague, expertise vague, bandeau) | 9 |
| **Ajoutées** (sections nouvelles) | **21** : accueil 4 (problèmes, cycle du projet, situations types, qui fait quoi) · services 16 (situations types ×6, questions ×6, « Ce qu'il faut nous envoyer » ×4) · soumission 1 (encart) |

Nouveaux blocs de code à créer : 4 (`problems`, `project-cycle`, `scenarios`, `responsibility-table`). Blocs existants réutilisés : 11 sur 13.
L'anglais n'est pas rédigé ici : **S2 traduira les textes français approuvés.**
