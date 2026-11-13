# ADR-011 — Replis natifs (`<details>`) sous 640 px pour raccourcir l'accueil du téléphone

**Statut** : accepté (2026-11-13, audit T7) — recommandation appliquée, réversible (retirer `bx-fold`).

## Contexte
Après T3, l'accueil mesurait 12 805 px à 360 px pour une cible de 11 500 (ADR-009 n° 10). Sur ordinateur (7 441 px à 1440 px) la cible était tenue.

## Décision
- `web/src/styles/fold.css` : classe `bx-fold` sur un `<details>`. **Fermé sous 640 px**, le titre (`<summary>`, cible ≥ 44 px) reste visible et un geste déplie ; **déployé dès 640 px** (`::details-content { content-visibility: visible }`). Zéro script, contenu toujours dans la page.
- Un navigateur qui ne connaît pas `::details-content` garde le repli à toute largeur (accordéon complet, rien ne disparaît).
- Utilisé pour : le détail des six problèmes de l'accueil (l'énoncé reste visible ; la réponse et les liens se déplient), « Ce que vous recevez » des situations types de l'accueil, les trois colonnes du pied de page (le titre `h2` est dans le `summary`). Pied de page resserré sous 640 px.
- Résultat mesuré (build de production) : 12 805 → **11 482 px** à 360 px ; 7 441 px à 1440 px (inchangé). Test : `tests/e2e/home-height.spec.ts`.

## Limite connue
Dès 640 px le `summary` reste dans l'ordre de tabulation sans effet visible (pas de script pour le retirer) ; compromis accepté.
