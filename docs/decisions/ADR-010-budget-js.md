# ADR-010 — Budget de JS initial relevé de 150 à 155 Ko

**Statut** : accepté (2026-11-13, audit T7) — décision prise par Claude sur délégation du client, réversible.

## Contexte
ADR-009 n° 15 visait 150 Ko de JS initial (octets reçus en gzip, 1 Ko = 1000 octets, `web/scripts/measure-js.mjs`). Le build de production mesure **154,3 Ko**, identique sur l'accueil, `/en` et `/soumission`.

## Ce qui a été cherché (T7)
- Le code du formulaire n'est déjà pas dans le JS initial (même total sur `/` et `/soumission`).
- `SanityLive` retiré du build de production par import dynamique : **aucun gain** (le code ne pesait que quelques centaines d'octets, le regroupement des fichiers a absorbé la différence) ; annulé.
- Détail des 154,3 Ko : React 65 Ko, routeur de Next 36 Ko, exécution des actions serveur 14 Ko (toujours chargée par Next), polyfills modernes 6,5 Ko, exécution Turbopack 4,4 Ko ≈ 126 Ko **incompressibles** ; reste ≈ 28 Ko : menus et sélecteur de langue (`MobileMenu`, `ServicesMenu`, `LanguageSwitch`) et `next/link`.
- Seule piste restante : refaire les menus sans JS (`<details>`/popover). C'est un changement de fonction (menu du mobile), non retenu pour 4 Ko.

## Décision
Budget fixé à **155 Ko** (155 000 octets) dans `measure-js.mjs` et dans le test `tests/e2e/js-budget.spec.ts`, qui échoue si une page publique le dépasse. Toute hausse future doit être justifiée par un nouvel ADR.

## Conséquences
Le site est à 0,7 Ko sous le budget : toute dépendance cliente nouvelle le dépasse. À rouvrir si un menu sans JS est jugé acceptable.
