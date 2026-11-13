# Critique visuelle et finition — S3b (2026-11-12)

Pages vues au navigateur à 360 px et 1440 px, en français, avant toute modification (dataset `development`, contenu de S2).
Direction A « La feuille de plan » gardée : Archivo, JetBrains Mono pour les données, cartouche, tokens. Aucun texte de S2 n'a changé de sens.

## 1. Critique avant correction

| Page | Constat (une ligne) |
|---|---|
| Accueil | 10 498 px à 1440 : les six services sont listés trois fois (légende sous l'isométrique, rangées par famille, schéma du cycle) ; les problèmes n'affichent aucun lien vers leur service (les liens existaient dans Studio, la requête les perdait) ; « À quoi ça sert » répété huit fois ; situations en quatre colonnes étroites sur bureau et en mur de texte sur mobile ; « Ce qu'il faut nous envoyer » en gros titres empilés sur une demi-largeur ; numéros de situation 1, 1, 2. |
| Six pages de service | « Pour qui » occupe une section entière pour une phrase ; « À quoi ça sert » répété à chaque ligne (dix fois sur H-02) ; mêmes situations en colonnes étroites ; aucun visuel ; bouton du haut dont le libellé long se casse mal à 360 px. |
| À propos | Aucun visuel ; les six services y sont redits avec le même gabarit que l'accueil (acceptable : autre page) ; rythme correct. |
| Soumission | Claire. Rien à corriger hors pied de page. |
| Toutes | Sur mobile, « Demander une soumission » n'est visible qu'en haut et en bas de page (le bouton de l'en-tête est masqué sous 1024 px) ; pied de page avec une rangée presque vide (cinq blocs sur quatre colonnes) ; espacement des sections inégal (56/80 px ici, 64/96 px là). |

## 2. Ce qui a été fait

| Page | Avant → après (une ligne) |
|---|---|
| Accueil | Services présentés une seule fois, en nomenclature le long d'un tuyau (stations = codes, dans l'ordre d'un projet) : le schéma du cycle y est fondu, la légende sous l'isométrique retirée (chaque tracé reste un lien nommé) ; chaque problème montre son service (couleur, code, lien) ; livrables en tableau « Livrable / À quoi ça sert » dit une fois ; situations en quatre temps sur fond teinté, numérotées 1 à 3 ; liste « à envoyer » compacte sur trois colonnes. |
| Modélisation (P-01) | « Pour qui » dans la bande du cartouche ; livrables en tableau avec le schéma « modèle fédéré et conflit » à côté ; situations en quatre temps. |
| Tuyauterie (H-02) | Idem, plus une photo d'illustration en haut et le schéma « spool isométrique ». |
| Gicleurs (G-03) | Idem, photo d'un réseau de gicleurs et schéma « étage de gicleurs ». |
| Tuyauterie + gicleurs (C-04) | Idem, schéma « coupe d'un corridor ». |
| Données d'actifs (D-05) | Idem, photo de robinetterie et schéma « fiche d'équipement, donnée manquante signalée ». |
| Tel que construit (Q-06) | Idem, schéma « conçu / construit, écart entouré ». |
| À propos | Photo d'illustration dans le premier écran ; services au nouveau gabarit. |
| Soumission | Pas de barre d'action (le formulaire est l'action) ; pied de page resserré. |
| Toutes | Barre « Demander une soumission » fixe en bas sous 1024 px, en CSS seulement ; deux espacements de section en tokens ; pied de page sur cinq colonnes ; bouton multi-ligne centré. |

## 3. Choix de conception à connaître
- **Barre d'action mobile** : cachée tant que le bouton du premier écran est visible (un seul bouton principal par écran), grâce à une animation liée au défilement ; les navigateurs qui ne la connaissent pas affichent la barre en permanence. La page réserve sa hauteur : le pied de page se lit en entier. Absente de la page Soumission.
- **Bande teintée** : une seule section par page est sur fond `--bx-paper-2` (les situations types). L'alternance sur toutes les sections (plan v5 § 8 n° 3) n'a pas été retenue : le gris `--bx-ink-3` des notes n'y atteint pas le contraste AA.
- **Schémas** : fichiers SVG dans Sanity (remplaçables dans Studio), servis tels quels ; leurs couleurs reprennent les tokens mais sont écrites dans le fichier, un SVG chargé comme image ne pouvant pas lire les variables CSS du site.
- **Requête des problèmes** : le filtre « service visible » est fait dans le composant ; en GROQ, posé après le déréférencement, il vidait la liste.

Mesures, résultats des commandes et points non vérifiés : voir le compte rendu de la tâche S3b dans `PLAN.md` et le message de fin de session.
