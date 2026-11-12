# ADR-007 — Intégrer les offres au site existant, ne pas le remplacer

**Statut** : accepté (2026-11-12), à la demande du client.

## Contexte
Le site v1 présentait 4 services généraux (modélisation BIM et coordination, préfabrication MEP, BIM 7D, TQC),
avec son accueil et sa page À propos. Ce contenu vit toujours, intact, dans le dataset Sanity `production` (le site
en ligne) et dans l'historique Git (`git show bd26323:web/scripts/seed/...`).
Les 10 et 11 novembre, la refonte N2–N6 (ADR-006) l'a **remplacé** dans `development` par un site centré sur 4 offres à
forfaits, a masqué la modélisation et le TQC et a mis en avant un « appel de 20 minutes ». Le client corrige : le document
d'offres v3.1 donnait des prestations à **intégrer** au site existant, pas un nouveau site. Il n'a pas le temps de faire des appels.

## Décisions

| # | Décision |
|---|---|
| 1 | **Règle d'or : on ajoute et on ajuste, on ne remplace pas.** Tout texte d'origine se reprend mot pour mot (`production` en lecture seule, ou Git). |
| 2 | **Six services visibles**, même gabarit de page : modélisation BIM et coordination (P-01), préfabrication de tuyauterie SysQue (H-02), préfabrication de gicleurs AutoSPRINK (G-03), tuyauterie + gicleurs (C-04), BIM 7D (D-05), TQC et contrôle qualité (Q-06). Modélisation et TQC : contenu d'origine, sans forfait ni prix (aucun n'existe). Adresses FR et EN d'origine conservées. |
| 3 | **BIM 7D** : contenu d'origine, auquel s'ajoutent les éléments du v3.1 (audit, codification, robinets, lien avec les dessins d'atelier, local) et le forfait Audit 7D. **Tuyauterie** : la liste d'origine « Pourquoi préparer la préfabrication avec une approche BIM ? » est reprise (champs `moreHeading`/`moreItems`). |
| 4 | **Accueil** : sections d'origine dans leur ordre ; s'y intègrent la liste des six services, les forfaits, les conditions, la preuve Brennan (ADR-006 n° 21), « Inclus pour l'atelier et le chantier » et la FAQ. La méthode « Comment ça marche » de N4 fait double emploi avec la méthode d'origine : retirée. **À propos** : texte d'origine + positionnement en préfabrication du v3.1. |
| 5 | **Plus d'appel de 20 minutes** : ADR-006 n° 7, 22 et 23 sont **remplacés**. Action principale : « Demander une soumission ». Aucune phrase ne promet un appel ni un délai de rappel. « Choisir ce forfait » reste et mène au formulaire avec le forfait pré-sélectionné. Le formulaire et les courriels sont adaptés par la révision R2. |
| 6 | **Code de la refonte conservé** : document `package` (F-01 à F-05), réglage `launchSettings`, blocs `packages`, `conditions`, `proof`, bandeau, champ `visible`, pages d'offres (« Pour qui », forfaits, « Qui fait quoi »). L'isométrique passe de 4 à 6 tracés. |
| 7 | **Inchangé** : ADR-006 n° 2, 3, 5, 11, 12, 14 à 21 (5 prix d'entrée seulement, aucune « hypothèse à valider », ni téléphone ni NEQ, Grand Montréal, responsable Loi 25 « Fondateur de Bimurix », bandeau sans date, EN complet). |

## Conséquences
- `scripts/seed/` produit ce contenu pour un dataset neuf ; `scripts/patch-content-r1.mts` l'applique à `development`
  (refuse tout autre dataset, ne touche ni `formSettings` ni `emailTemplates`). `production` n'est jamais modifié avant la phase M.
- Champs sans source, laissés vides : aucun forfait pour la modélisation et le TQC ; `audience` et `responsibilityNote`
  de ces deux services sont rédigés d'après le contenu d'origine et le v3.1 (à faire relire).
