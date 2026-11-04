# ADR-005 — Logo « Croisement » et identité visuelle

**Statut** : accepté (2026-11-03)

## Contexte
Le logotype texte provisoire devait être remplacé. Trois planches de départ (traits de vitesse, dégradés,
plusieurs bleus) ont été revues ; quatre pistes ont été comparées (L-00 à L-03).

## Décision
- Logo L-01 « Croisement » : BIM bleu nuit `#0F172A`, URIX bleu `#0F52BA`, X dont le trait fin est
  coupé là où il passe derrière le trait épais (convention de dessin d'un croisement de réseaux).
- Lettres Archivo largeur 125, graisse 800, vectorisées : aucun fichier ne dépend de la police.
- Pas de cyan ni de bleu clair (choix du client). Sur fond foncé, logo blanc.
- Fichiers et guide dans `identite-visuelle/` ; pistes non retenues dans `identite-visuelle/99-archive/`.

## Conséquences
- `#00B4D8` (cyan) n'est plus une couleur de marque ; `web/src/styles/tokens.css` est à aligner.
- Le logo public doit être déposé dans Sanity (règle de contenu) : à faire avec l'accord du client.
- Recherche de marque de commerce (OPIC) à faire avant l'impression.
