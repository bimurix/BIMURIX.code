# Cahier d'améliorations v6 — ce que font les sessions T2 à T6

**Date** : 2026-11-13 · **Décisions** : `docs/decisions/ADR-009-ameliorations-v6.md` · **Critique** : `docs/audits/2026-11-13_critique-t1.md`
**Lecture seule** : la tâche T1 n'a rien modifié dans `web/` ni dans Sanity. Ce cahier pilote T2 à T6 ; T7 l'utilisera comme liste de contrôle.

## Comment lire ce cahier
- Chaque point a un **numéro** (C = contenu, V = visuel, M = mouvement, S = sécurité, R = référencement, vitesse, accessibilité) et dit **quoi, où, pourquoi, critère de réussite**.
- **Règles qui valent pour toutes les sessions** : dataset `development` seulement ; aucun texte public dans le code ; anglais complet pour tout texte ajouté (Loi 96) ; lexique de `CLAUDE.md` § 4 ; aucune nouvelle dépendance ; jamais de lecture de `.env*` ; pas de `git push` ; un commit par tâche ; terminé = lint, typecheck, tests, build et e2e verts, rendu vérifié à 360 px et 1440 px en FR et EN ; **JS initial ≤ 150 Ko gzip** (aujourd'hui 149,6).
- **Rien d'inventé de vrai** : une valeur générique porte `(exemple)` / `(example)` ; une fiche de projet porte « Exemple — à remplacer » (ADR-009 n° 2). Aucun client, témoignage, chiffre de résultat, certification, ni personne.
- **Interdits de design** (`CLAUDE.md` § 5) : pas d'emoji, pas de grille de cartes identiques, pas de dégradé ni de texte en dégradé, pas de verre dépoli, pas de petit titre au-dessus d'un titre, pas d'Inter en titre, pas de statistique inventée, couleurs et tailles par tokens seulement.

---

## T2 — Contenu et idées

Outil : un script `web/scripts/patch-content-t2.mts` (même modèle que `patch-content-s2.mts` : refuse tout dataset autre que `development`, relançable, conserve les images), et le seed mis à jour pour un dataset neuf.

### T2-A. Valeurs d'exemple (ADR-009 n° 1 à 5)

| N° | Quoi | Où | Pourquoi | Critère de réussite |
|---|---|---|---|---|
| C-01 | Saisir `514 555-0199 (exemple)` (téléphone), `Bimurix inc. (exemple)` (nom légal), `1234567890 (exemple)` (NEQ). | Studio « Réglages du site », onglet contact (`settings.phone`, `legalName`, `neq`). La validation du NEQ (10 chiffres) doit accepter le suffixe d'exemple, en avertissement seulement. | Montrer que l'entreprise existe ; le client remplace. | Les trois valeurs sont visibles ; `pnpm check:placeholders` les liste toutes et sort en erreur. |
| C-02 | Afficher ces valeurs : pied de page (téléphone sous le courriel ; « Nom légal · NEQ » sur la ligne du bas) ; fiche « L'entreprise » de la page À propos ; colonne de réassurance de la page Soumission (téléphone) ; article 1 de la politique de confidentialité (nom légal). | `SiteFooter`, page À propos, page Soumission, texte légal (ce dernier : fait par T5). | Ce sont les endroits où l'on vérifie une entreprise. | Champ vide = rien ne s'affiche (test). Champ marqué = texte simple, **sans lien `tel:`** (test). |
| C-03 | Garde « valeur d'exemple » : une fonction unique `isPlaceholder(valeur)` dans `lib/`, qui lit la même liste de marqueurs que le seed. | `web/src/lib/placeholders.ts` (nouveau) ; utilisée par le pied de page et par les données structurées. | ADR-009 n° 4. | Test unitaire : une valeur marquée n'apparaît ni dans un `href`, ni dans le JSON-LD. |
| C-04 | Ajouter les marqueurs `Exemple — à remplacer` et `Example — to be replaced`. | `scripts/check-placeholders.mjs` et `scripts/seed/helpers.mts` (même liste). | Bloquer aussi les fiches de projet. | Le script signale les trois fiches de projet. |

### T2-B. Accueil

| N° | Quoi (avant → après, en français) | Où | Pourquoi | Critère |
|---|---|---|---|---|
| C-10 | **Titre.** « Des modèles BIM fiables. Moins de surprises au chantier. » → **« Des modèles BIM qui se fabriquent. Moins de surprises au chantier. »** | Accueil, premier écran | Dit la spécialité avec un fait existant. | Un seul H1 ; tient en quatre lignes à 360 px. |
| C-11 | **Accroche.** « Bimurix modélise, coordonne et dessine pour les entrepreneurs, les firmes de génie-conseil et les propriétaires. Les conflits se règlent au modèle. La tuyauterie et les gicleurs arrivent prêts à fabriquer. Les plans tel que construit et les données sont prêts à remettre. » → **« Bimurix modélise, coordonne et dessine la mécanique du bâtiment pour les entrepreneurs, les firmes de génie-conseil et les propriétaires du Grand Montréal. Tuyauterie dans SysQue, gicleurs dans AutoSPRINK, en français et en anglais. »** | Idem | Quatre phrases → deux ; les faits qui distinguent montent au premier écran. | À 360 × 640 px, le bouton « Demander une soumission » est visible sans défiler. |
| C-12 | **Ligne sous les boutons.** « Modéliser et coordonner · Préfabriquer · Livrer et exploiter » → **« Réponse d'ici un jour ouvrable · Grand Montréal · Français et anglais »** | Idem | Les familles sont redites deux écrans plus bas ; la réassurance manque. | Texte venu de Sanity, en FR et EN. |
| C-13 | **Intro des problèmes.** Quatre lignes qui énumèrent sept publics → **« Un modèle BIM vaut ce qu'il apporte au chantier. Voici six problèmes de chantier, et le service qui y répond. »** (ne pas écrire « les plus fréquents » : cela supposerait un historique de mandats) | Bloc `problems` | Personne ne lit l'énumération. | Une phrase, 20 mots au plus. |
| C-14 | **Nouvelle section « Pourquoi Bimurix »**, après « Six services ». Bloc existant `points-list`. Titre : **« Pourquoi confier ce travail à Bimurix »**. Six lignes (titre — texte) : **1.** *Les deux logiciels, un seul interlocuteur* — Tuyauterie dans SysQue et gicleurs dans AutoSPRINK, dans la même équipe. **2.** *Dessiné pour être fabriqué* — Notre expérience en construction modulaire guide le travail : ce qui est dessiné doit pouvoir se fabriquer, avec les pièces réelles du fabricant. **3.** *Un renfort quand vos dessinateurs sont débordés* — Pour une zone, un étage ou un projet entier. **4.** *Ici, dans le Grand Montréal* — Un interlocuteur local, dans le même fuseau horaire que votre chantier. **5.** *En français et en anglais* — Nous travaillons dans la langue de votre équipe. **6.** *Chacun son rôle, par écrit* — L'ingénieur conçoit et signe ; Bimurix modélise et dessine ; vous approuvez. Phrase d'appoint sur l'automatisation : « Les tâches répétitives sont automatisées avec Dynamo et pyRevit. » (ajoutée à la ligne 2 ou 3). | Accueil ; repris en tête de la page À propos (C-30) | Critique § 2.3 : la différenciation est absente de l'accueil. | Aucun chiffre, aucun concurrent nommé, aucun fait absent de `production` ou du document v3.1 (liste des faits : audit S5). Section sur fond teinté. |
| C-15 | **Situations types en deux temps sur l'accueil** : pour chacune, garder « Situation » et « Ce que vous recevez » ; « Ce que fait Bimurix » et « Ce que ça évite » restent sur la page du service, vers laquelle le lien « Voir le service » mène. La mention « Ce sont des situations types, pas des projets réalisés. » reste **une seule fois**. | Bloc `scenarios` : réglage « version courte » | Trois murs de texte, surtout sur téléphone. | La section passe sous 900 px de haut à 1440 px. |
| C-16 | **Nouvelle section « Projets »** (bloc `projects`, à créer : registre en tableau, liste empilée à 360 px). Titre : **« Projets »**. Note sous le titre : **« Fiches d'exemple — elles seront remplacées par des projets réels. »** Trois fiches, chacune avec la pastille « Exemple — à remplacer » : **1.** *Immeuble résidentiel de moyenne hauteur (exemple)* · Gicleurs · Dessins d'atelier par étage, listes de coupe, export NWC pour la coordination · AutoSPRINK. **2.** *Salle mécanique d'un bâtiment institutionnel (exemple)* · Tuyauterie et plomberie · Modèle SysQue, dessins de spool numérotés, listes de coupe et de matériel, étiquettes · SysQue (Revit). **3.** *Bâtiment modulaire (exemple)* · Tuyauterie + gicleurs · Une zone coordonnée dans les deux disciplines, dessins d'atelier des deux · SysQue et AutoSPRINK. Champs par fiche : type de bâtiment, discipline (référence au service), ce qui a été livré (liste), outils, image facultative, année facultative. **Pas de champ « client », « lieu », « économie » ni « témoignage ».** | Accueil, entre les situations et la preuve ; interrupteur `enabled` dans Studio | Critique § 2.2. | Les trois fiches sont marquées ; `check:placeholders` les bloque ; interrupteur coupé = section absente (test) ; pas de grille de cartes. |
| C-17 | **Preuve J.M. Brennan** : texte inchangé. Ajouter une phrase d'introduction : **« Un exemple publié par un tiers, pour situer ce que la préfabrication permet. »** | Bloc `proof` | Dire pourquoi on montre un chiffre qui n'est pas celui de Bimurix. | La phrase « Ce ne sont pas des résultats de Bimurix. » reste, avec la source et le lien. |
| C-18 | **« Qui fait quoi » court sur l'accueil** : trois lignes au lieu de sept, dans cet ordre : *Bimurix* — modèles, dessins d'atelier, listes de coupe et de matériel, détection de conflits ; *L'ingénieur* — conception, calculs (y compris parasismique), signature et sceau ; *L'entrepreneur* — approbation des dessins d'atelier, fabricants retenus, fabrication et installation. La phrase d'origine sous le tableau reste mot pour mot. Lien « Voir le détail » vers la page À propos. Sur les services et À propos : tableau complet, mais **les lignes de Bimurix d'abord**. | Bloc `responsibility-table` : réglage « version courte » ; ordre des lignes dans Studio | Lu vite, le tableau actuel montre surtout ce que Bimurix ne fait pas. | La mention de l'ingénieur est présente sur les huit pages (test existant de S5 toujours vert). |
| C-19 | **Retirer « Ce qu'il faut nous envoyer » de l'accueil** (la section reste sur les six services et sur la page Soumission). | Accueil | Troisième répétition, avant la décision. | L'accueil compte 12 sections ; hauteur < 7 500 px à 1440 et < 11 500 px à 360. |
| C-20 | **FAQ : trois questions de plus**, réponses tirées des faits : « Travaillez-vous en anglais ? » — Oui, en français et en anglais. · « Pouvez-vous prendre une seule zone ou un seul étage ? » — Oui ; la portée se précise à la soumission. · « Comment envoyer les plans et les modèles ? » — Ajoutez un lien de partage dans votre demande ; nous vous indiquons ensuite le moyen de transfert adapté. | Bloc `faq` de l'accueil | Questions réelles d'un entrepreneur, absentes. | Onze questions au plus ; les mêmes servent aux données structurées (R-03). |
| C-21 | **Promesse près des boutons** : sous chaque bouton d'appel final, **« Nous vous répondons d'ici un jour ouvrable. »** ; si le téléphone existe : **« Ou appelez le [téléphone]. »** | Bloc `quote-cta` (champ `note`), les huit pages | Réassurance au moment du clic. | Présent en FR et EN ; ni « gratuit » ni « sans engagement » nulle part (recherche sur le texte rendu). |
| C-22 | **Titres : point final seulement pour une phrase** (ADR-009 n° 18). « Qui fait quoi. » → « Qui fait quoi » ; « Comment se déroule un mandat. » → sans point ; « Six services, du modèle à l'exploitation. » → sans point ; les titres-phrases gardent leur point. | Toutes les pages | Cohérence accueil / services. | Relevé des H2 des 11 pages : règle respectée. |

### T2-C. Pages de service

| N° | Quoi | Où | Pourquoi | Critère |
|---|---|---|---|---|
| C-25 | **Regrouper « Ce que nous faisons »** quand il y a plus de six blocs. H-02 (8 blocs) : *Réseaux* (skids, chauffage et refroidissement, plomberie) · *Pièces et supports* (pièces réelles du fabricant, supports coordonnés, parasismique) · *Vérifications* (coordination des parcours, contrôle des informations). D-05 (9 blocs) : *Vérifier* (audit, contrôle de complétude) · *Structurer* (paramètres, codification des équipements, vannes, local de chaque élément, lien avec les dessins d'atelier) · *Préparer la remise* (remplissage, préparation à la remise et à l'exploitation). Mêmes textes, seulement rangés sous trois sous-titres. | Champ `offerings` : sous-titre de groupe facultatif | Huit ou neuf blocs égaux ne se retiennent pas. | Aucun fait ajouté ni retiré ; trois groupes visibles. |
| C-26 | **Sortir les deux phrases de confiance** en évidence (phrase seule, encadrée d'un filet, sous l'intro) : D-05 « Les données manquantes sont signalées, jamais inventées. » ; Q-06 « Un élément n'est jamais présenté comme vérifié sur chantier sans les données qui le prouvent. » | Champ facultatif `pledge` sur le service | Ce sont les meilleures phrases de ces pages, noyées dans l'intro. | Une phrase, une fois par page. |
| C-27 | **P-01** : monter la détection de conflits. Intro → « Bimurix produit, met à jour et coordonne les modèles d'architecture, de structure et de mécanique du bâtiment (MEP). Avant chaque réunion de coordination, vous recevez la liste des conflits entre corps de métier, classée par étage et par discipline. » | Page modélisation | Page la plus générique des six. | Les faits viennent de la situation type et des livrables déjà publiés. |
| C-28 | **G-03** : titre resserré. « Des dessins d'atelier de gicleurs quand vos dessinateurs manquent. » → **« Vos dessins d'atelier de gicleurs, quand vos dessinateurs manquent. »** (même sens ; vérifier qu'il tient en quatre lignes à 1440 px, sinon réduire la taille d'un cran par token). | Page gicleurs | Six lignes de titre sur bureau. | Quatre lignes au plus à 1440 px. |
| C-29 | **Lexique** : « vanne » partout ; sur D-05, « vannes (robinets) » à la première occurrence. Recherche de « robinet » : une seule occurrence restante. | Six services, FAQ | ADR-009 n° 17. | Recherche sur le texte rendu. |

### T2-D. À propos

| N° | Quoi (avant → après) | Pourquoi | Critère |
|---|---|---|---|
| C-30 | **Titre.** « Le BIM au service du chantier : qualité et coordination. » → **« Un spécialiste BIM de la mécanique du bâtiment et de la préfabrication, dans le Grand Montréal. »** **Intro** → « Bimurix modélise, coordonne et dessine pour les équipes de projet, du modèle de conception à la remise. Notre expérience en construction modulaire guide notre façon de travailler : ce qui est dessiné doit pouvoir se fabriquer. » | Titre générique ; la spécialité est le seul vrai argument. | Faits tous présents dans `production`. |
| C-31 | **Ordre** : premier écran → « Pourquoi confier ce travail à Bimurix » (C-14, remplace « Notre positionnement en préfabrication », mêmes faits) → « L'entreprise » (C-32) → « Notre façon de travailler » (C-33) → « Ce que nous faisons » (liste des services, inchangée) → « Qui fait quoi » (complet) → appel final. | On vient ici pour savoir à qui on a affaire. | Les quatre faits du positionnement d'origine sont tous encore présents. |
| C-32 | **Nouvelle section « L'entreprise »** : fiche en nomenclature (libellé — valeur) : Nom légal · NEQ · Téléphone · Courriel · Région desservie (Grand Montréal) · Langues de travail (français, anglais) · Responsable (Fondateur). Champs facultatifs **vides** : nom du fondateur, photo, mot du fondateur (rien ne s'affiche tant qu'ils sont vides). | Critique § 6 : c'est la section qui manque. | Valeurs d'exemple marquées ; champs vides invisibles (test). |
| C-33 | **« Notre façon de travailler » en gestes.** *Nous comprenons avant de produire — Objectifs, exigences, responsabilités, formats attendus.* → **La portée est écrite avant de commencer** — Ce qui est inclus, les formats et qui approuve quoi : tout est dans la soumission. · *Nous structurons l'information — Selon les conventions du projet.* → **Nous suivons vos conventions** — Nommage, gabarits et codification : ceux du projet ou de votre atelier. · *Nous contrôlons les livrables — Et nous signalons les points à confirmer.* → **Chaque livraison a sa liste de points à confirmer** — Rien n'est présenté comme vérifié sans la donnée qui le prouve. · *Nous travaillons avec vos décisions…* → **Les décisions restent les vôtres** — Nous partons des documents approuvés ; l'ingénieur conçoit et signe. | Principes creux → gestes vérifiables, déjà dits ailleurs sur le site. | Aucun engagement nouveau (pas de délai, pas de garantie). |
| C-34 | **Appel final** : « Un projet à nous confier ? » reste ; ajouter la promesse (C-21). | — | — |

### T2-E. Soumission, 404, anglais

| N° | Quoi | Pourquoi | Critère |
|---|---|---|---|
| C-40 | **Titre** « Parlez-nous de votre projet. » → **« Demandez votre soumission. »** **Intro** → « Décrivez le projet et le service voulu. Nous vous répondons d'ici un jour ouvrable. » | Garder le mot du bouton ; dire le délai de réponse. | — |
| C-41 | **Encart** « Ce qu'il faut nous envoyer » → titre **« Utile, si vous l'avez sous la main »** ; note → **« Aucun document n'est exigé pour demander une soumission. Ajoutez un lien de partage dans la description, ou attendez notre réponse. »** L'encart passe **après** le bouton d'envoi sur téléphone, **dans la colonne de droite** sur bureau. | Placé avant le formulaire, il se lit comme une condition. | À 360 px, le premier champ est visible dès le deuxième écran. |
| C-42 | **Colonne de réassurance** (droite sur bureau, sous le formulaire sur téléphone), en nomenclature : *Réponse* — d'ici un jour ouvrable · *Ensuite* — nous clarifions la portée, puis vous recevez la soumission · *Téléphone* — [valeur] · *Confidentialité* — vos renseignements servent seulement à traiter votre demande (lien vers la politique). | 40 % de la largeur est vide ; c'est là qu'on hésite. | Textes dans `formSettings`, FR et EN. |
| C-43 | **Masquer « Budget approximatif »** : réglage `showBudget` (faux par défaut) dans `formSettings` ; la colonne en base, le schéma Zod et les courriels ne changent pas. | ADR-009 n° 11. | Aucun « $ » sur le site (recherche) ; réglage remis à vrai = le champ revient (test). |
| C-44 | **404** : titre d'onglet « Page introuvable \| Bimurix » ; sous le bouton, liens vers les six services et « Demander une soumission ». | Un seul lien aujourd'hui. | Statut 404 inchangé (test S4). |
| C-45 | **Anglais** : « Problems we solve before they reach the site. » · « mechanical (MEP) » · « on site » · « project » à la place de « mandate » partout · titre d'accueil « BIM models you can build from. Fewer surprises on site. » | Critique § 9. | Les neuf pages EN relues en entier. |
| C-46 | **Documents** : mettre à jour `CLAUDE.md` § 1 et § 4, `design/PRODUCT.md` (« Preuves disponibles »), `PLAN.md` (révision T, phase M étape 2), `SPEC.md` (contrats : valeur d'exemple jamais en lien ni en JSON-LD ; bloc projets). | `CLAUDE.md` § 10. | — |

---

## T3 — Icônes et photos

### T3-A. Le jeu de symboles

**Principe** : des symboles au trait, comme sur un plan de mécanique ou de protection incendie. Ils accompagnent une ligne de liste ou de tableau ; ils ne deviennent jamais une grille de cartes.

| Réglage | Valeur |
|---|---|
| Grille | 24 × 24 px, marge intérieure de 2 px, tracés posés sur des demi-pixels pour rester nets |
| Trait | 1,5 px, extrémités et angles arrondis, `vector-effect: non-scaling-stroke` (le trait garde 1,5 px à toutes les tailles) |
| Remplissage | aucun ; un seul point plein de 2 px permis par symbole (raccord, tête) |
| Couleur | `currentColor` (hérite du texte) ; couleur de réseau seulement quand le symbole désigne un service |
| Tailles | 20 px (dans une phrase ou un lien), 24 px (listes, tableaux), 40 px (tête de section, étapes) — tokens `--bx-icon-sm`, `--bx-icon-md`, `--bx-icon-lg` |
| Technique | un composant serveur `Icon` (`web/src/ui/components/Icon.tsx` + `icons/paths.ts`), SVG en ligne, `aria-hidden="true"` (le texte voisin porte le sens). Aucune bibliothèque, aucun script. |
| Choix dans Studio | champ `icon` : liste fermée de noms en français (« Vanne », « Pompe »…) sur les lignes de problèmes, de livrables, de besoins, d'étapes et de raisons |

**Liste complète (34 symboles)**

| Nom | Dessin (repère) | Où il s'emploie |
|---|---|---|
| `vanne` | deux triangles pointe à pointe | D-05 (vannes), situation « retrouver une vanne », liste des fabricants |
| `pompe` | cercle avec un triangle intérieur | H-02 (skids), D-05 (équipements) |
| `tete-gicleur` | tige, déflecteur, deux bras | G-03, problème « dessinateurs de gicleurs », menu |
| `tuyau-spool` | segment avec deux brides et un numéro | H-02, livrable « dessins de spool » |
| `coude` | tuyau à 90° avec raccords | « pièces réelles du fabricant » |
| `support` | tige filetée, collier, tuyau en coupe | « supports coordonnés », hauteurs de tiges |
| `parasismique` | support avec contreventement en diagonale | H-02, G-03, FAQ « parasismique » |
| `poutre` | profilé en I | conflits avec la structure, P-01 |
| `conduit` | rectangle avec une diagonale | conflits, C-04 |
| `conflit` | deux réseaux qui se croisent, cercle au croisement | P-01, C-04, livrable « liste de conflits », problème 1 |
| `modele-federe` | trois volumes superposés décalés | P-01, livrable « modèle fédéré » |
| `colonne-montante` | trait vertical traversant deux planchers | P-01 |
| `manchon` | cercle dans un mur en coupe | percements et manchons |
| `skid` | cadre, pompe et collecteur | H-02 |
| `isometrique` | trois axes à 30° | « vues isométriques » |
| `dessin-atelier` | feuille avec cartouche en bas à droite | livrables G-03, H-02 |
| `liste-coupe` | lignes de liste et une règle graduée | livrable « listes de coupe et de matériel » |
| `etiquette` | étiquette percée avec un code | livrable « étiquettes imprimables » |
| `tablette` | tablette montrant un plan | « plans couleur lisibles sur tablette » |
| `fiche-equipement` | carte avec trois lignes de données | D-05 |
| `donnee-manquante` | ligne de données dont une case est vide et entourée | D-05 « signalé, jamais inventé », rapport Excel |
| `codification` | code entre crochets | D-05 |
| `local` | pièce en plan avec un numéro | D-05 « local de chaque élément » |
| `tel-que-construit` | tracé avec nuage de révision | Q-06, problème 5 |
| `releve` | mire et ruban | Q-06 « relevés de chantier » |
| `changement` | triangle de révision numéroté | Q-06 « changements approuvés » |
| `dossier-remise` | chemise avec onglet et coche | Q-06, D-05, livrable « dossier de remise » |
| `sceau` | cercle cranté | « Qui fait quoi » (ingénieur), mention de l'ingénieur |
| `atelier` | toit en dents de scie | « fabriqué en atelier », raison 2 |
| `chantier` | niveau à bulle | « au chantier », problèmes |
| `interlocuteur` | deux bulles reliées par un trait | raison 1, C-04 |
| `region` | flèche du nord dans un cercle | Grand Montréal, pied de page |
| `reponse` | cadran d'horloge avec une coche | promesse « un jour ouvrable » |
| `courriel`, `telephone`, `oui`, `non`, `plus`, `lien-externe` | enveloppe, combiné, coche, tiret, plus, flèche sortante | pied de page, formulaire, tableau « Qui fait quoi » (coche et tiret à la place de « Oui » et « — », le mot restant lisible par un lecteur d'écran), FAQ, source de la preuve |

| N° | Quoi | Où | Critère |
|---|---|---|---|
| V-01 | Dessiner le jeu et le composant `Icon`. | `web/src/ui/components/` | Une planche de contrôle (page locale non publiée ou capture) montre les 34 symboles aux trois tailles ; trait identique partout. |
| V-02 | Un symbole par problème (accueil), par raison (« Pourquoi Bimurix »), par ligne de livrable, par étape (40 px, à la place du rond numéroté ou à côté), par ligne « à envoyer » (à la place des puces rondes). | Blocs `problems`, `points-list`, `deliverables`, `method`, `QuoteNeeds` | Lignes sans icône choisie = rendu actuel (rien ne casse) ; contraste AA ; aucune grille de cartes. |
| V-03 | Coche et tiret dans « Qui fait quoi ». | `responsibility-table` | Le lecteur d'écran lit toujours « Bimurix : Oui ». |
| V-04 | Symboles du pied de page (courriel, téléphone, région) et de la colonne de réassurance. | `SiteFooter`, page Soumission | Cibles tactiles ≥ 44 px conservées. |

### T3-B. Photos

**Règle « Photo d'illustration »** (ADR-009 n° 14) : légende « Photo d'illustration » / « Illustrative photo » ; aucun logo, marque, visage reconnaissable ni lieu identifiable ; texte alternatif qui décrit ce qu'on voit ; rapport fixé par `FigureImage` ; chargement différé sauf l'image du premier écran ; source ≤ 350 Ko, servie redimensionnée ; auteur et adresse de chaque photo consignés dans `docs/source/2026-11-13_images-t3.md` ; images téléversées dans `development` par `patch-design-t3.mts`. Une photo par page au premier écran, au plus une autre dans le corps. Mêmes cadre et légende que les quatre photos actuelles.

| N° | Page, section | Rapport | Sujet | Mots-clés Unsplash | Texte alternatif FR / EN |
|---|---|---|---|---|---|
| V-10 | Accueil, « Les problèmes… » (champ `problems.image`) | 21:9 | Plafond technique chargé : tuyaux, conduits et gicleurs qui se croisent | `ceiling pipes ducts`, `mechanical ceiling construction`, `plenum pipes` | « Tuyaux, conduits de ventilation et gicleurs serrés sous une dalle de béton. » / « Pipes, ventilation ducts and sprinklers packed under a concrete slab. » |
| V-11 | Accueil, « Pourquoi Bimurix » | 4:3 | Atelier de préfabrication de tuyauterie, pièces sur établi ou chevalets | `pipe fabrication shop`, `pipe spool workshop`, `pipefitter workshop` | « Tronçons de tuyauterie préfabriqués, posés sur des chevalets dans un atelier. » / « Prefabricated pipe sections on stands in a workshop. » |
| V-12 | P-01, premier écran | 4:3 | Plans de coordination étalés, ou écran montrant un modèle 3D sans logo de logiciel | `construction drawings table`, `blueprints coordination meeting`, `engineer drawings desk` | « Plans de mécanique étalés sur une table de réunion. » / « Mechanical drawings spread on a meeting table. » |
| V-13 | C-04, premier écran | 4:3 | Corridor en construction, tuyauterie et gicleurs au plafond | `corridor ceiling pipes sprinkler`, `building corridor construction pipes` | « Corridor en chantier : tuyauterie et réseau de gicleurs suspendus au plafond. » / « Corridor under construction with piping and sprinkler mains hung from the ceiling. » |
| V-14 | Q-06, premier écran | 4:3 | Relevé en chantier : mesure, plan annoté, tablette | `construction site measuring`, `site survey tablet construction`, `marked up drawings site` | « Une personne compare un plan annoté à l'installation en place. » / « A person checks a marked-up drawing against the installed work. » (pas de visage reconnaissable) |
| V-15 | À propos, premier écran (remplace la charpente au coucher du soleil) | 4:3 | Salle mécanique propre : pompes, collecteurs, tuyauterie isolée | `mechanical room pumps`, `boiler room pipes`, `plant room piping` | « Salle mécanique : pompes, collecteurs et tuyauterie isolée. » / « Mechanical room with pumps, headers and insulated piping. » |
| V-16 | H-02, situation « skid » (champ `scenario.image`) | 3:2 | Skid de pompes assemblé | `pump skid`, `industrial pump assembly` | « Groupe de pompes monté sur un cadre d'acier. » / « Pump set mounted on a steel frame. » |
| V-17 | G-03, corps de page (remplace rien, s'ajoute près de « Ce que nous faisons ») | 3:2 | Gros plan d'une tête de gicleur et de son tuyau | `fire sprinkler head`, `sprinkler pipe ceiling` | « Tête de gicleur vissée sur une conduite rouge. » / « Sprinkler head threaded onto a red pipe. » |
| V-18 | Projets (C-16), image facultative de chaque fiche | 3:2 | Laisser **vide** dans les fiches d'exemple | — | Une photo de banque sur une fiche de projet ferait croire à un projet réel. |

| N° | Quoi | Critère |
|---|---|---|
| V-20 | **Premier écran sur téléphone** : sur l'accueil, l'isométrique remonte entre le titre et l'accroche, ou l'accroche courte (C-11) suffit à le faire apparaître ; sur les services, la photo reste sous le bouton. | À 360 × 780 px, le haut de l'isométrique est visible sans défiler. |
| V-21 | **Relief** : deux bandes teintées au plus par page (« Pourquoi Bimurix » et situations sur l'accueil), en vérifiant le contraste AA des notes grises sur fond teinté (défaut relevé en S3b : utiliser `--bx-ink-2` sur fond teinté). | Test d'accessibilité e2e (`a11y.spec.ts`) vert. |
| V-22 | **Preuve Brennan** : chiffres réduits d'un cran (token de taille), symbole `lien-externe` sur la source. | La section pèse moins que « Projets ». |
| V-23 | **Cartouche** : « Date » = mois de la dernière mise à jour du document (champ `_updatedAt` de Sanity), au lieu d'une valeur fixe. Priorité basse. | Même rendu, donnée vraie. |
| V-24 | **Vrais livrables** : rappeler au client, dans le rapport de fin, que le champ « Exemple de livrable » de chaque service attend une capture réelle (caviardée) : aucun travail de code. | — |

---

## T4 — Mouvement (CSS seulement, zéro script de plus)

**Tokens à créer** (`web/src/styles/tokens.css`) et à utiliser partout, y compris pour les animations existantes, aujourd'hui écrites en dur dans `globals.css` :

| Token | Valeur | Usage |
|---|---|---|
| `--bx-dur-1` | 120 ms | survol, focus, couleur |
| `--bx-dur-2` | 240 ms | ouverture de la FAQ, menu, messages du formulaire |
| `--bx-dur-3` | 480 ms | apparition d'un élément au défilement |
| `--bx-dur-draw` | 1 400 ms | tracé d'un réseau ou d'un schéma |
| `--bx-stagger` | 80 ms | décalage entre deux éléments d'une même série (six au plus) |
| `--bx-ease-out` | `cubic-bezier(0.16, 1, 0.3, 1)` | tout ce qui entre |
| `--bx-ease-inout` | `cubic-bezier(0.65, 0, 0.35, 1)` | tout ce qui s'ouvre et se referme |

**Règles générales**
- Propriétés animées : `opacity`, `transform`, `stroke-dashoffset`, `clip-path`, couleurs. Jamais `width`, `height`, `top`, `margin` (sauf la hauteur du contenu de la FAQ, M-08).
- **État de départ visible par défaut.** L'état caché n'existe qu'à l'intérieur de `@supports (animation-timeline: view())` **et** de `@media (prefers-reduced-motion: no-preference)`. Un navigateur qui ne connaît pas les animations liées au défilement (Firefox, anciens Safari) montre donc tout, immobile.
- `prefers-reduced-motion: reduce` : aucune animation ni translation ; état final affiché ; seuls les changements de couleur de 120 ms restent.
- Chaque animation ne joue qu'une fois ; rien ne tourne en boucle.

| N° | Élément | Animation | Durée, courbe | Mouvement réduit | Sans prise en charge |
|---|---|---|---|---|---|
| M-01 | Isométrique de l'accueil (existant) | Les six tracés se dessinent, les raccords apparaissent | `--bx-dur-draw`, `--bx-ease-out`, décalage 220 ms → passer aux tokens | Tracés complets, immobiles (déjà fait) | Sans objet (animation au chargement) |
| M-02 | Filet sous chaque titre de section | Le filet se trace de gauche à droite quand la section entre à l'écran (`scaleX` de 0 à 1, origine à gauche, `animation-timeline: view()`, plage `entry 10%` à `entry 40%`) | liée au défilement | Filet complet | Filet complet |
| M-03 | Ligne des six services (tuyau vertical et stations) | La ligne se trace de haut en bas au défilement ; chaque station se remplit quand la ligne l'atteint | liée au défilement, plage `entry 0%` à `cover 60%` | Ligne complète | Ligne complète |
| M-04 | Étapes « Comment se déroule un mandat » | Le trait horizontal relie 01 → 04 au défilement ; les ronds se remplissent l'un après l'autre | liée au défilement | Tout rempli | Tout rempli |
| M-05 | Lignes de tableaux et de listes (problèmes, livrables, raisons, projets) | Apparition en fondu avec 8 px de montée, décalage `--bx-stagger`, six lignes au plus ; les suivantes apparaissent ensemble | `--bx-dur-3`, `--bx-ease-out`, déclenchée par `view()` | Visibles | Visibles |
| M-06 | Schémas au trait des services (images SVG) | Le cadre se dévoile de gauche à droite (`clip-path: inset()`), comme une feuille qui sort du traceur ; dans le fichier SVG lui-même, l'élément mis en valeur (spool rouge, conflit entouré, donnée manquante) se trace une fois, par une animation CSS interne au fichier, avec sa propre règle `prefers-reduced-motion` | `--bx-dur-draw` (valeur recopiée dans le SVG, qui ne lit pas les tokens du site) | Schéma complet | Schéma complet |
| M-07 | Photos | Aucune animation d'entrée ; aucun zoom au survol | — | — | — |
| M-08 | FAQ (`<details>` natif) | Ouverture en hauteur (`::details-content`, `interpolate-size: allow-keywords`) ; le « + » pivote en « × » | `--bx-dur-2`, `--bx-ease-inout` | Ouverture immédiate | Ouverture immédiate (comportement actuel) |
| M-09 | Liens avec flèche | La flèche avance de 4 px au survol et au focus | `--bx-dur-1` | Pas de déplacement | — |
| M-10 | Lignes de service et de problème (cliquables) | Fond `--bx-paper-2` au survol ; la station ou le trait de réseau s'épaissit | `--bx-dur-1` | Changement de couleur seulement | — |
| M-11 | Boutons | Changement de couleur seulement (existant) ; **pas** d'agrandissement, pas d'ombre | `--bx-dur-1` | Idem | — |
| M-12 | Focus clavier | Contour de 2 px, décalé de 2 px, **affiché sans transition** ; l'isométrique reçoit ce même contour (reste de l'audit S5) | immédiat | Idem | — |
| M-13 | Barre d'action mobile (existant) | Glisse à l'écran quand le bouton du haut sort de la vue | liée au défilement (existant) | Toujours visible | Toujours visible (existant) |
| M-14 | Menu mobile et menu des services | Fondu et descente de 8 px à l'ouverture, en CSS (`@starting-style` ou classe déjà posée par le composant existant) ; **aucun changement de script** | `--bx-dur-2` | Affichage immédiat | Affichage immédiat |
| M-15 | Formulaire | Message d'erreur et panneau de succès : fondu ; bouton d'envoi : libellé « Envoi… » déjà géré par l'état du formulaire, sans animation de plus | `--bx-dur-2` | Affichage immédiat | — |
| M-16 | Transition entre deux pages | **Non retenue** (ADR-009 n° 15). Les transitions de vue en CSS seul ne s'appliquent pas à la navigation de Next sans activer une option qui ajoute du code. | — | — | — |

**À ne PAS animer**
- Le titre, l'accroche, les boutons et l'image du premier écran (ils fixent la vitesse d'affichage mesurée, R-20).
- Les paragraphes de texte courant, les cellules de chiffres, les champs du formulaire.
- Les chiffres de la preuve (pas de compteur qui monte : il faudrait un script, et c'est un tic).
- Aucun parallaxe, aucun défilement détourné, aucune boucle, aucun effet au pointeur qui suit la souris.
- Rien de plus long que 600 ms, hors tracés.

| N° | Critère de réussite de T4 |
|---|---|
| M-20 | JS initial identique à avant T4 (mesure avant et après, même méthode que S5). |
| M-21 | Décalage de mise en page (CLS) ≈ 0 sur les 11 pages ; plus grand élément affiché (LCP) non retardé (comparaison avant et après sur l'accueil et H-02). |
| M-22 | e2e avec `reducedMotion: "reduce"` : aucune animation en cours, tout le contenu visible. |
| M-23 | Vérification dans un navigateur sans `animation-timeline` (Firefox si installé ; sinon revue du CSS : aucun état caché hors `@supports`) : tout le contenu est visible. À noter comme « non vérifié » si Firefox manque. |
| M-24 | Aucune durée ni courbe en dur dans `globals.css` (recherche de `ms`, `s)` et `cubic-bezier` hors tokens). |

---

## T5 — Sécurité et Loi 25

Méthode : pour chaque risque, **écrire d'abord le test qui le prouve**, puis corriger. Toute modification de base passe par une **nouvelle** migration. Les constats viennent de la lecture de `web/src/lib/quote/`, `web/src/lib/admin/`, `web/src/proxy.ts`, `web/next.config.ts` et `web/supabase/migrations/` ; aucun n'a été exploité.

| N° | Gravité | Constat (fichier) | Risque | Correctif proposé | Critère |
|---|---|---|---|---|---|
| S-01 | **élevée** | `anonymize_quote` (`…010000_admin_dashboard.sql`) autorise l'appel si `is_admin()` **ou** si `current_user = 'postgres'`. Dans une fonction `security definer`, `current_user` vaut le propriétaire de la fonction, donc `postgres` : la garde serait toujours vraie. La fonction est ouverte au rôle `authenticated`. En local, `enable_signup = true` (`supabase/config.toml`). | Un compte connecté **non administrateur** pourrait anonymiser une demande dont il connaît l'identifiant. Les identifiants ne sont pas lisibles par lui (RLS), ce qui limite l'exploitation, mais la garde ne protège pas. | Nouvelle migration : la fonction publique exige `is_admin()` sans exception ; la tâche planifiée appelle une fonction interne distincte, non accordée à `authenticated`. En ligne : inscriptions fermées dans Supabase. | Test : un utilisateur connecté absent de `admins` appelle la fonction → erreur 42501 ; la tâche planifiée fonctionne toujours. |
| S-02 | **élevée** | `actions.ts` : la limite par IP ne s'applique que si `ipHash` existe, donc si `IP_HASH_SALT` est défini **et** si l'en-tête d'IP est présent. Hors Netlify, l'IP vient de `X-Forwarded-For`, que le client peut écrire. Le test `process.env.NETLIFY` doit être vrai à l'exécution, pas seulement à la construction. | Limite d'envois inopérante sans qu'on le sache ; contournable. | En production : refuser de démarrer l'envoi (ou journaliser une alerte forte) si le sel manque ; vérifier la présence de la variable Netlify à l'exécution ; sans IP fiable, appliquer une limite globale (S-03). | Tests unitaires : sans sel en production → alerte ; quatre envois de la même IP en dix minutes → refus. |
| S-03 | **élevée** | `emails.ts` : l'accusé de réception part à l'adresse saisie, avec `{name}` et `{company}` saisis par le visiteur. La limite ne compte que les demandes **enregistrées** par IP. | Le formulaire peut servir à envoyer du texte choisi par un attaquant à un tiers, depuis le domaine de Bimurix (hameçonnage, réputation du domaine d'envoi). | Limite par adresse destinataire (2 par 24 h) ; plafond global par heure avec alerte ; refuser les adresses web et les barres obliques dans le nom et l'entreprise ; l'accusé ne recopie jamais la description. | Tests : nom contenant une adresse web → refus de validation ; troisième demande vers la même adresse → pas d'accusé. |
| S-04 | moyenne | `admin/actions.ts`, `sendMagicLink` : l'adresse de retour du lien est bâtie sur les en-têtes `Origin` ou `Host` de la requête, avec repli en `http://`. | Lien de connexion pointant vers un autre hôte si la liste d'adresses autorisées de Supabase est trop large. | Adresse du site lue dans la configuration du serveur (`NEXT_PUBLIC_SITE_URL`), jamais dans la requête ; liste d'adresses de retour exacte dans Supabase en ligne. | Test : en-tête `Host` falsifié → le lien garde le bon domaine. |
| S-05 | moyenne | Connexion `/admin` : pas d'antispam ni de limite propre (seulement celle de Supabase). Un seul facteur : la boîte courriel. | Envois répétés de liens ; tout repose sur la sécurité de la boîte courriel. | Limite simple par IP sur l'envoi du lien ; durée de vie du lien réduite (10 min) ; recommandation au client : validation en deux étapes sur sa boîte courriel. | Sixième demande de lien en dix minutes → refusée, même message neutre. |
| S-06 | moyenne | `next.config.ts` : `script-src 'unsafe-inline'` (choix assumé pour les pages statiques) ; `connect-src https://*.sanity.io wss://*.sanity.io` ; `/studio` sans politique de contenu. | Protection réduite contre l'injection de script ; surface de connexion plus large que nécessaire. | Garder `'unsafe-inline'` (un nonce rendrait toutes les pages dynamiques et plus lentes) et l'écrire dans la décision ; restreindre `connect-src` à l'hôte du projet Sanity ; ajouter `Cross-Origin-Opener-Policy: same-origin` ; vérifier les en-têtes sur le build de production. | En-têtes relevés sur le port 3200 ; Turnstile, images et Studio fonctionnent toujours (e2e). |
| S-07 | moyenne | `layout.tsx` du site : `<SanityLive />` est chargé pour **tous** les visiteurs (connexion ouverte vers Sanity, script). | Surface et coût inutiles en ligne ; pèse sur le budget JS. | À décider avec T6 (R-22) : en production, remplacer par une revalidation à la publication. T5 ne fait que constater. | Voir R-22. |
| S-08 | moyenne | Journaux : `console.error` écrit le message d'erreur brut de Supabase ou du service de courriel. | Un message d'erreur de base peut contenir la ligne refusée, donc des renseignements personnels, dans les journaux de l'hébergeur. | Journaliser un code et la référence de la demande, jamais le message brut ni l'adresse courriel. Ajouter un événement « connexion réussie » au journal du tableau de bord. | Recherche de `console.error` : aucun message brut ; test sur une insertion refusée. |
| S-09 | faible | `proxy.ts` et `not-found-response.ts` : l'en-tête `x-bimurix-404-template` suffit à faire sauter la décision 404 / 308. | Un visiteur qui l'envoie obtient une page « introuvable » en statut 200 ; pas de fuite, mais un contournement gratuit. | Valeur secrète générée au démarrage de l'instance et comparée, au lieu de la simple présence de l'en-tête. | Requête externe avec l'en-tête → toujours 404. |
| S-10 | faible | Politique RLS : `grant update on quote_requests` porte sur toutes les colonnes. | Un administrateur (ou un compte admin compromis) peut réécrire `consent_at` ou `email`. | Droit de mise à jour limité aux colonnes `status` et `last_reply_at`. | Test : mise à jour de `consent_at` par un admin → refusée. |
| S-11 | faible | `schema.ts` : `sourcePath` est un texte libre de 300 caractères. | Valeur arbitraire affichée dans le tableau de bord. | Exiger un chemin interne (commence par `/`, sans `//`). | Test de schéma. |
| S-12 | faible | `actions.ts` : `policyVersion` vaut « inconnue » si Studio ne la fournit pas. | Consentement enregistré sans version de politique. | Refuser l'envoi (erreur serveur) si la version manque. | Test. |
| S-13 | faible | Clés Turnstile de test. | Antispam inopérant si elles partent en ligne. | `check:placeholders` (ou un contrôle de démarrage) refuse les clés de test connues en production. | Contrôle ajouté, documenté dans la phase M. |
| S-14 | faible | Dépendances : `pnpm audit` signale 1 vulnérabilité modérée (minimatch, par l'outil en ligne de commande de Sanity). | Hors du code servi. | Relancer `pnpm audit` ; mettre à jour si un correctif existe ; sinon consigner. | Résultat noté dans le rapport. |
| S-15 | faible | Pas de fichier `/.well-known/security.txt`. | Aucun contact pour signaler une faille. | Fichier statique avec `contact@bimurix.com`. | Fichier servi. |

**À examiner en plus (non lu en T1)** : drapeaux des témoins de session `/admin` (HttpOnly, Secure, SameSite) ; contrôle d'origine des actions serveur ; comptes ayant accès à Studio et origines CORS de Sanity ; rendu des champs du visiteur dans `/admin` (échappement) ; `ui/admin/` en entier.

### Loi 25

| N° | Quoi | Où | Critère |
|---|---|---|---|
| S-20 | **Compléter les deux pages légales** et retirer la mention « modèle de départ » seulement quand le client les a fait valider ; la date « (exemple) » reste bloquante d'ici là. Ajouter : nom légal (valeur d'exemple, C-01) ; **liste complète des fournisseurs** — Supabase (base de données, Canada), Netlify (hébergement), Resend (courriels), **Cloudflare Turnstile (antispam : traite l'adresse IP)**, Sanity (contenu du site, aucun renseignement personnel) ; mention que certains traitent des données hors du Québec ; **retrait du consentement** ; **plainte à la Commission d'accès à l'information** ; durée de conservation des journaux. | `scripts/seed/legal.mts` + `patch-legal-t5.mts` (FR et EN) | Les cinq fournisseurs sont nommés ; les deux droits ajoutés ; `check:placeholders` signale toujours la date d'exemple. |
| S-21 | **Empreinte d'IP** : aujourd'hui gardée jusqu'à l'anonymisation (24 mois). La purger après 30 jours par la tâche planifiée. | Nouvelle migration | Test : une demande de plus de 30 jours n'a plus d'`ip_hash`. |
| S-22 | **Documents internes à remettre au client (modèles, hors site, dans `affaires/`, jamais dans le dépôt)** : registre des incidents de confidentialité ; évaluation des facteurs relatifs à la vie privée pour les fournisseurs hors Québec ; procédure de réponse à une demande d'accès ou de suppression. T5 fournit seulement la **liste** et le plan de chaque document dans son rapport. | Rapport de T5 | Liste remise ; rien d'écrit dans le dépôt. |
| S-23 | **Copies hors système** : la notification envoyée à `contact@bimurix.com` contient les renseignements du demandeur et n'est pas anonymisée par la base. Le dire dans la politique (« les courriels de notification sont supprimés à la même échéance ») et l'ajouter à la procédure du client. | Texte légal ; rapport | Phrase présente. |
| S-24 | **Anonymisation** : vérifier par test que `anonymize_quote` vide aussi le téléphone, la description, les échanges, et que rien ne fait de `DELETE`. | Tests | Vert. |

---

## T6 — Référencement, vitesse, accessibilité

### T6-A. Données structurées (JSON-LD)

État : une seule donnée structurée, sur l'accueil (`ProfessionalService`), avec `"telephone": null`.

| N° | Quoi | Où | Critère |
|---|---|---|---|
| R-01 | **Organisation** (`ProfessionalService`) sur toutes les pages : nom, adresse du site, logo, courriel, région desservie, langues (`fr-CA`, `en-CA`). **Aucun champ nul** ; téléphone, nom légal et NEQ seulement s'ils existent et ne sont **pas** des valeurs d'exemple (C-03). Pas d'adresse postale, pas de note, pas d'avis. | `ui/patterns/OrganizationJsonLd.tsx` | Validateur de données structurées sans erreur ; test : valeur d'exemple absente du JSON. |
| R-02 | **Service** sur chacune des six pages : nom complet, description, fournisseur (l'organisation), région desservie, type de service. Aucun prix (`offers` absent). | Nouveau `ui/patterns/jsonld/ServiceJsonLd.tsx`, appelé par la page | Six pages, FR et EN. |
| R-03 | **FAQ** (`FAQPage`) sur l'accueil, les six services et la page Soumission, à partir des questions affichées. Google ne montre plus ces résultats enrichis pour la plupart des sites depuis 2023 ; d'autres moteurs et les assistants s'en servent : coût faible, gain modeste. | `jsonld/FaqJsonLd.tsx` | Le JSON reprend mot pour mot le texte visible. |
| R-04 | **Fil d'Ariane** (`BreadcrumbList`) en données structurées seulement : Accueil › Services › [service] ; Accueil › [page]. Pas de fil visible de plus (la ligne « code + nom du service » en tient lieu). | `jsonld/BreadcrumbJsonLd.tsx` | Valide, FR et EN. |
| R-05 | **Site** (`WebSite`) sur l'accueil : nom, adresse, langues. Pas de champ de recherche (le site n'en a pas). | `jsonld/` | Valide. |

### T6-B. Titres, descriptions, langues, partage, plan du site

| N° | Quoi | Critère |
|---|---|---|
| R-10 | **Titres (≤ 60 caractères) et descriptions (≤ 155)**, dans le champ SEO de chaque document (script `patch-seo-t6.mts`). Propositions FR : Accueil — « Services BIM et préfabrication MEP au Québec \| Bimurix » ; P-01 — « Modélisation et coordination BIM à Montréal \| Bimurix » ; H-02 — « Dessins d'atelier de tuyauterie (SysQue) \| Bimurix » ; G-03 — « Dessins d'atelier de gicleurs (AutoSPRINK) \| Bimurix » ; C-04 — « Coordination tuyauterie et gicleurs \| Bimurix » ; D-05 — « Données d'actifs BIM 7D pour la remise \| Bimurix » ; Q-06 — « Modèles et plans tel que construit (TQC) \| Bimurix » ; À propos — « À propos : spécialiste BIM MEP, Grand Montréal \| Bimurix » ; Soumission — « Demander une soumission BIM \| Bimurix » (inchangé) ; 404 — « Page introuvable \| Bimurix ». EN : mêmes pages, mots-clés de R-14. Chaque description dit le livrable, le logiciel et « Grand Montréal ». | Aucun titre en double ; longueurs respectées ; 404 non indexée. |
| R-11 | **`hreflang`** : `fr-CA`, `en-CA` et `x-default` sont en place sur les pages vues (accueil, service). Vérifier les 11 pages, y compris les légales ; vérifier `<html lang>` (`fr-CA` / `en-CA`) ; ajouter `og:locale:alternate`. | Relevé des 22 adresses : chaque page pointe vers son équivalent, et réciproquement. |
| R-12 | **Images de partage** : aujourd'hui une seule image fixe pour tout le site, et pas de balise de carte pour les réseaux qui la demandent (`twitter:card`). Produire une image 1200 × 630 par page clé (accueil, six services, À propos), en FR et EN, dans le style « feuille de plan » (titre, code du service, cartouche), générée côté serveur par l'outil d'image intégré à Next (aucune dépendance, aucun script côté visiteur), ou à défaut des PNG statiques téléversés dans le champ SEO. Ajouter `twitter:card = summary_large_image`. | Aperçu de partage correct pour 16 adresses ; texte lisible à 600 px de large. |
| R-13 | **Plan du site et robots** : vérifier que les 22 adresses publiques y sont, avec leurs équivalents de langue et la date de mise à jour ; que `/admin`, `/studio` et la page 404 n'y sont pas ; **aperçus de déploiement non indexés** (en-tête `X-Robots-Tag: noindex` hors du domaine de production). | `sitemap.xml` relu ; en-tête vérifié avec `NEXT_PUBLIC_SITE_URL` différent du domaine final. |
| R-14 | **Mots de recherche réalistes au Québec** (à placer dans les titres, descriptions, H1 et premiers paragraphes, sans bourrage). FR : « dessins d'atelier tuyauterie », « dessins d'atelier gicleurs », « dessinateur gicleurs sous-traitance », « dessins de spool », « préfabrication tuyauterie », « modélisation BIM Montréal », « coordination BIM MEP Québec », « détection de conflits Navisworks », « modélisation Revit MEP sous-traitance », « SysQue Québec », « AutoSPRINK Québec », « plans tel que construit », « modèle tel que construit Revit », « BIM 7D données d'actifs », « services BIM entrepreneur mécanique ». EN : « sprinkler shop drawings Montreal », « AutoSPRINK drafting services », « fire protection shop drawings Quebec », « pipe spool drawings », « SysQue modeling services », « MEP BIM coordination Montreal », « clash detection services », « as-built drawings Revit Montreal », « BIM 7D asset data », « BIM outsourcing Quebec ». **Les volumes n'ont pas été mesurés** (aucun outil branché) : ce sont des requêtes de niche, à confirmer dans la Search Console après la mise en ligne. | Chaque page vise deux ou trois de ces expressions, présentes dans son titre et son premier paragraphe. |
| R-15 | **Hors code, pour le client à la phase M** : ouvrir la Search Console et y déposer le plan du site ; fiche d'établissement Google seulement quand le téléphone et le nom légal sont réels. | Noté dans le rapport. |

### T6-C. Vitesse

Mesurer sur le **build de production** (port 3200), en simulation de téléphone moyen sur réseau 4G, pour l'accueil, H-02 et la page Soumission, **avant et après** T3 et T4.

| N° | Indicateur | Cible |
|---|---|---|
| R-20 | Plus grand élément affiché (LCP) | ≤ 2,5 s |
| R-20 | Décalage de mise en page (CLS) | ≤ 0,05 |
| R-20 | Réactivité à l'interaction (INP) | ≤ 200 ms |
| R-20 | Délai de la première réponse du serveur (TTFB) | ≤ 0,8 s |
| R-20 | JS initial | ≤ 150 Ko gzip |
| R-20 | Poids total de l'accueil au premier affichage | ≤ 600 Ko ; aucune image du premier écran > 120 Ko |

| N° | Quoi | Critère |
|---|---|---|
| R-21 | **Images** : celle du premier écran en priorité avec `sizes` exact ; toutes les autres en chargement différé, rapport fixé ; formats modernes servis par Next. Avec les photos de T3, le poids ne doit pas dépasser la cible. | Relevé réseau à 360 px. |
| R-22 | **`<SanityLive />` pour les visiteurs** : mesurer ce qu'il pèse en script et s'il garde une connexion ouverte en production. S'il pèse : le réserver à l'aperçu de Studio et brancher la revalidation à la publication (prévue à la phase M par l'audit S5). C'est le seul gain de budget JS identifié. **Décision à prendre sur mesure, pas à l'aveugle.** | Mesure avant et après ; une modification dans Studio apparaît toujours sur le site. |
| R-23 | **Polices** : Archivo (axe de largeur) et JetBrains Mono viennent de `next/font` ; vérifier le poids des fichiers chargés au premier écran, retirer `latin-ext` s'il n'est pas utile au français, et ne pas précharger JetBrains Mono (elle ne sert qu'aux données). | Poids des polices relevé avant et après. |
| R-24 | **Turnstile** : le script n'est chargé que sur la page Soumission (à confirmer) ; le charger à l'approche du formulaire plutôt qu'à l'ouverture de la page. | Aucune requête vers Cloudflare sur l'accueil. |
| R-25 | **Animations** (T4) : aucune sur l'élément du LCP ; vérifier après T4. | LCP inchangé à ± 100 ms. |

### T6-D. Accessibilité (restes de l'audit S5 et nouveautés)

| N° | Quoi | Critère |
|---|---|---|
| R-30 | Contour de focus sur les tracés de l'isométrique (fait par T4, M-12 ; vérifié par T6). | Focus visible à 3:1 de contraste. |
| R-31 | Titre de la page 404 (fait par T2, C-44 ; vérifié par T6). | — |
| R-32 | « Ce que vous recevez, et à quoi ça sert. » lu deux fois (titre puis légende du tableau) : relier le tableau au titre par `aria-labelledby` au lieu d'une légende répétée. Idem « Qui fait quoi ». | Lecture d'écran : une seule annonce. |
| R-33 | Nouveautés de T2 à T4 : textes alternatifs des photos ; symboles décoratifs en `aria-hidden` ; registre « Projets » lisible en liste à 360 px ; coche et tiret de « Qui fait quoi » avec texte pour lecteur d'écran ; contraste des notes sur fond teinté. | `a11y.spec.ts` étendu aux nouvelles sections, vert. |
| R-34 | Zoom à 200 % et largeur de 320 px : aucune perte de contenu ni défilement horizontal, sur les 11 pages. | Vérifié au navigateur. |
| R-35 | Formulaire : résumé des erreurs annoncé et focus sur le premier champ en erreur ; `autocomplete` présent sur nom, entreprise, courriel, téléphone (constaté) ; messages reliés par `aria-describedby`. | Parcours au clavier seul, de l'accueil à l'envoi. |
| R-36 | Navigateurs : barre d'action mobile dans Firefox et WebKit (non vérifiée en S5 : navigateurs absents de Playwright). Les installer demande un téléchargement : **à faire seulement si le client l'autorise** ; sinon, garder « non vérifié » dans le rapport. | Noté. |
| R-37 | Changement de langue : le lien « English » / « Français » porte `lang` et `hreflang`. | Vérifié. |

### T6-E. Mesure des visites (ADR-009 n° 16)

**Rien n'est installé.** Option décrite pour la phase M : **statistiques de l'hébergeur (Netlify Analytics)**. Elles sont calculées à partir des journaux du serveur : pages vues, provenances, pages introuvables. Aucun script n'est ajouté au site, aucun témoin n'est déposé, aucun identifiant n'est lu sur l'appareil : pas de bandeau de consentement à prévoir. Service payant, à activer par le client dans son compte. À inscrire alors dans la politique de confidentialité (« statistiques agrégées produites par notre hébergeur, sans témoin »).
Écartées : Google Analytics (témoins, transfert hors Québec, bandeau obligatoire) ; un outil à script léger (le budget JS n'a plus de marge).
Déjà disponible sans rien ajouter : le tableau de bord `/admin` compte les demandes par service et garde la page d'origine de chaque demande.

---

## Ordre et fichiers

```
T2 (seule)  →  T3 puis T4 (même suite visuelle)  ┐
               T5 (sécurité)                      ├→  T7 (audit)
               T6 (référencement, vitesse, a11y)  ┘
```
T2 passe **seule et d'abord** : elle crée le bloc `projects`, les réglages (« version courte », `showBudget`, `pledge`, groupes) et touche les fichiers partagés de schéma. T3, T5 et T6 partent ensuite en parallèle ; **T4 suit T3** (elle anime ce que T3 a posé).

| Partie | Fichiers qu'elle possède (elle seule y écrit) |
|---|---|
| **T2** | `scripts/patch-content-t2.mts` ; `scripts/seed/*` **sauf** `legal.mts` ; `scripts/check-placeholders.mjs` ; `src/lib/placeholders.ts` (nouveau) ; `src/blocks/projects/` (nouveau) ; réglages de contenu dans `src/blocks/scenarios/`, `responsibility-table/`, `quote-cta/`, `points-list/` ; `src/sanity/schemas/**` ; `src/sanity/queries.ts`, `structure.ts` ; `src/blocks/schemas.ts`, `render.tsx` ; `src/ui/patterns/SiteFooter.tsx` (téléphone, nom légal, NEQ) ; `src/ui/patterns/quote-form/` (budget, colonne de réassurance) ; `src/lib/i18n/v5-labels.ts` ; `CLAUDE.md`, `PLAN.md`, `SPEC.md`, `design/PRODUCT.md` |
| **T3** | `src/ui/components/Icon.tsx`, `src/ui/components/icons/` (nouveaux) ; `FigureImage.tsx` ; rendu (JSX et classes) des blocs `problems`, `deliverables`, `method`, `points-list`, `proof`, `hero-sheet`, `service-networks`, `projects`, `responsibility-table`, `quote-form/QuoteNeeds` ; `src/ui/patterns/ServicePage.tsx`, `service-sections.tsx`, `Sheet.tsx` ; `scripts/patch-design-t3.mts`, `scripts/assets/t3/` ; `docs/source/2026-11-13_images-t3.md` ; section « icônes » de `tokens.css` |
| **T4** (après T3) | `src/styles/motion.css` (nouveau, importé une fois par `globals.css`) ; section « mouvement » de `tokens.css` ; déplacement des animations existantes de `globals.css` vers `motion.css` ; `scripts/assets/` : animation interne des six schémas SVG (`make-schematics.mjs`) ; `src/ui/patterns/IsoNetworks.tsx` (contour de focus) ; `src/blocks/faq/` (classes d'animation) |
| **T5** | `src/lib/quote/` ; `src/lib/admin/` ; `src/lib/supabase/` ; `src/lib/mail/` ; `src/lib/not-found-response.ts` ; `src/proxy.ts` ; `next.config.ts` ; `supabase/migrations/` (nouvelles migrations seulement) ; `supabase/config.toml` ; `src/app/admin/` ; `src/ui/admin/` ; `scripts/seed/legal.mts`, `scripts/patch-legal-t5.mts` ; `public/.well-known/security.txt` ; tests `submit-quote`, `quote-*`, `admin` |
| **T6** | `src/lib/seo.ts` ; `src/ui/patterns/OrganizationJsonLd.tsx`, `src/ui/patterns/jsonld/` (nouveau) ; `src/app/sitemap.ts`, `robots.ts` ; `src/app/(site)/[locale]/page.tsx`, `[...slug]/page.tsx`, `layout.tsx` (métadonnées, JSON-LD, polices, `SanityLive`) ; images de partage (`opengraph-image` ou `public/`) ; `scripts/patch-seo-t6.mts` ; `tests/e2e/a11y.spec.ts`, `pages.spec.ts` |

**Fichiers partagés — un seul auteur à la fois**

| Fichier | Qui y touche | Règle |
|---|---|---|
| `src/styles/tokens.css` | T3 (tailles d'icônes), T4 (durées, courbes) | Chacune ajoute **un bloc commenté à son nom**, en fin de fichier ; T4 après T3. |
| `src/app/globals.css` | T3 (styles des nouveaux composants, si besoin), T4 (import de `motion.css`, retrait des animations déplacées) | T4 après T3 ; T5 et T6 n'y touchent pas. |
| `src/sanity/schemas/**`, `queries.ts`, `blocks/schemas.ts`, `render.tsx` | T2 seulement | Si T3 a besoin d'un champ (ex. `icon`), **T2 le crée d'avance** : liste des champs à prévoir ci-dessous. T6 n'ajoute aucun champ (le champ SEO existe). |
| Rendu des blocs (`src/blocks/*/Composant.tsx`) | T2 (logique « version courte »), puis T3 (icônes, photos) | T2 termine avant que T3 commence. T6 ne modifie un composant que pour R-32, **après** T3, ou confie la correction à T3. |
| `src/ui/patterns/SiteFooter.tsx` | T2 (valeurs), T3 (symboles) | T2 d'abord. |
| `src/app/(site)/[locale]/layout.tsx` | T6 seulement | T5 constate S-07, T6 tranche R-22. |
| `scripts/seed/` | T2 (tout sauf légal), T5 (`legal.mts`) | T3 et T6 passent par leur propre script `patch-*`, puis reportent au seed **en fin de session, une à la fois**. |
| `tests/unit/seed-integrity.test.ts` | Toutes | Ajouts seulement, en fin de fichier. |
| `PLAN.md`, `docs/ARCHITECTURE.md` | Toutes | Une ligne chacune dans le tableau de la révision T ; pas de réécriture. |

**Champs que T2 crée pour les autres** (tous facultatifs, bilingues quand c'est du texte) : `icon` (liste fermée des 34 noms) sur les lignes de `problems`, `deliverableRows`, `needs`, `methodSteps`, `points-list` ; image de la section « Pourquoi Bimurix » ; `image` par fiche de projet ; `note` de `quote-cta` ; `pledge` du service ; sous-titre de groupe des `offerings` ; `showBudget` ; champs du fondateur (nom, photo, mot).

---

## Choix par défaut (aucune question n'est posée au client)

| N° | Question | Valeur retenue | Raison | Où la changer |
|---|---|---|---|---|
| 1 | Téléphone | `514 555-0199 (exemple)` | Numéro réservé aux exemples ; bloqué avant la mise en ligne. | Studio › Réglages du site › Contact › Téléphone |
| 2 | Nom légal | `Bimurix inc. (exemple)` | Forme la plus courante ; marquée comme exemple. | Studio › Réglages du site › Contact › Nom légal |
| 3 | NEQ | `1234567890 (exemple)` | Déjà reconnu par le contrôle. | Studio › Réglages du site › Contact › NEQ |
| 4 | Le client n'a pas encore ces faits à la mise en ligne | Vider le champ : rien ne s'affiche. | Mieux vaut rien qu'un exemple en ligne. | Mêmes champs |
| 5 | Projets | Trois fiches « Exemple — à remplacer » ; section coupée à la mise en ligne s'il n'y a aucun projet réel. | Le gabarit est prêt ; rien de faux en ligne. | Studio › Pages › Accueil › section Projets (interrupteur et fiches) |
| 6 | Nom et photo du fondateur | Champs vides, rien d'affiché. | Aucune personne inventée. | Studio › Pages › À propos › L'entreprise |
| 7 | Titre d'accueil | « Des modèles BIM qui se fabriquent. Moins de surprises au chantier. » | Dit la spécialité. | Studio › Pages › Accueil › premier écran |
| 8 | Raisons de choisir Bimurix | Six raisons tirées des faits existants. | Rien d'invérifiable. | Studio › Pages › Accueil › Pourquoi Bimurix |
| 9 | Situations sur l'accueil | Deux temps (situation, ce que vous recevez). | Accueil plus court. | Studio › Pages › Accueil › Situations › « version courte » |
| 10 | « Qui fait quoi » sur l'accueil | Version courte, Bimurix d'abord. | Lecture rapide. | Studio › Pages › Accueil › Qui fait quoi › « version courte » |
| 11 | « Ce qu'il faut nous envoyer » sur l'accueil | Retiré (reste ailleurs). | Répétition. | Studio › Pages › Accueil (ajouter la section) |
| 12 | Budget dans le formulaire | Masqué. | Seul « $ » du site. | Studio › Formulaire › « Afficher le budget » |
| 13 | « Gratuit », « sans engagement » | Non écrits. | Faits non confirmés. | Studio › texte de l'appel final, si le client le confirme |
| 14 | Vanne ou robinet | « vanne » ; « (robinets) » une fois sur D-05. | Mot du chantier ; mot des codifications. | Studio › Services |
| 15 | « Mandate » en anglais | « project ». | Sonne moins traduit. | Studio › champs anglais |
| 16 | Photos | Sept emplacements de plus, Unsplash, « Photo d'illustration ». | Matière visuelle en attendant les vraies images. | Studio › champ image de chaque section |
| 17 | Photo d'À propos | Remplacée par une salle mécanique. | Lien avec le métier. | Studio › Pages › À propos › image |
| 18 | Icônes | 34 symboles dessinés pour le site, trait de 1,5 px. | Direction A, zéro dépendance. | Studio › champ « Symbole » de chaque ligne |
| 19 | Animations | CSS seulement ; liste M-01 à M-15. | Budget JS. | Code (tokens `--bx-dur-*`) |
| 20 | Transitions entre pages | Non. | Demandent du script. | Décision à rouvrir si R-22 libère du budget |
| 21 | Fil d'Ariane visible | Non ; données structurées seulement. | La ligne « code + service » suffit. | Code |
| 22 | Images de partage | Une par page clé, style feuille de plan. | Meilleur aperçu dans un courriel ou un message. | Studio › SEO › image de partage (prioritaire sur l'image générée) |
| 23 | Mesure des visites | Rien maintenant ; statistiques de l'hébergeur à la phase M. | Sans témoin, sans script. | Compte Netlify |
| 24 | Politique de sécurité du contenu | `'unsafe-inline'` gardé pour les scripts. | Un nonce rendrait toutes les pages dynamiques. | `next.config.ts` |
| 25 | Conservation de l'empreinte d'IP | 30 jours. | Elle ne sert qu'à limiter les envois répétés. | Migration |
| 26 | Durée de vie du lien de connexion `/admin` | 10 minutes. | Usage immédiat. | Réglage Supabase |
| 27 | Pages légales | Complétées par T5, mention « modèle de départ » gardée jusqu'à validation. | La validation juridique est celle du client. | Studio › Pages légales |
| 28 | Firefox et WebKit dans les tests | Pas de téléchargement sans accord. | Aucune installation non demandée. | — |
| 29 | Cartouche : date | Mois de la dernière mise à jour du contenu. | Donnée vraie. | Automatique |
| 30 | Ordre de l'accueil | Premier écran → problèmes → services → pourquoi Bimurix → livrables → situations → projets → preuve → qui fait quoi → déroulement → questions → appel final. | Problème, offre, raisons, preuve, action. | Studio › Pages › Accueil (glisser les sections) |

---

## Ce que T7 vérifiera

1. `pnpm check:placeholders` liste exactement : téléphone, nom légal, NEQ, trois fiches de projet, deux dates légales.
2. Aucune valeur d'exemple dans un lien, une métadonnée ou une donnée structurée.
3. Aucun prix, forfait, délai de production, « gratuit », témoignage, client, certification.
4. Hauteur de l'accueil : < 7 500 px à 1440 et < 11 500 px à 360 ; bouton visible à 360 × 640.
5. JS initial ≤ 150 Ko ; LCP, CLS, INP dans les cibles ; animations coupées en mouvement réduit.
6. Les quinze points de sécurité : chacun a son test, vert.
7. Données structurées valides sur les 22 adresses ; titres uniques ; `hreflang` réciproques.
8. Lint, typecheck, tests, build, e2e de production ; rendu à 360 et 1440 px, FR et EN.
