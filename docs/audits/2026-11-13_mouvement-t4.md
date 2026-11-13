# Mouvement (T4) — 2026-11-13

CSS seulement : `web/src/styles/motion.css` (importé par `globals.css`) et les jetons `--bx-dur-1/2/3/draw`, `--bx-stagger`, `--bx-ease-out/inout`
(+ `--bx-iso-step`, `--bx-iso-fittings` pour l'isométrique) dans `tokens.css`. Zéro script, zéro dépendance.

## Inventaire

| N° | Élément | État | Mouvement réduit | Sans `animation-timeline` |
|---|---|---|---|---|
| M-01 | Isométrique de l'accueil | repris, passé aux jetons (`globals.css`) | tracés complets | sans objet |
| M-02 | Filet sous les titres | **non fait** (aucun filet propre sous les titres : le trait est la bordure de la liste, non animable sans élément de plus) | — | — |
| M-03 | Tuyau des services | `.bx-rail`, `scaleY` lié à `view()` | complet | complet |
| M-04 | Trait des étapes | `.bx-method-line`, `scaleX` (lg) / `scaleY` | complet | complet |
| M-05 | Lignes (problèmes, livrables, raisons, projets) | `.bx-reveal`, fondu + 8 px, `view()`. Pas de décalage `--bx-stagger` : une animation liée au défilement ne se décale pas (la position suffit) | visibles | visibles |
| M-06 | Schémas SVG | `.bx-figure-draw` : `clip-path` de gauche à droite. **Non fait** : tracé interne au fichier SVG | complet | complet |
| M-07 | Photos | aucune animation | — | — |
| M-08 | FAQ | `::details-content` + `interpolate-size`, « + » pivote (`--bx-dur-2`) | immédiat | immédiat |
| M-09 | Flèches | `.bx-arrow` avance de 4 px (`--bx-dur-1`) | pas de déplacement | — |
| M-10 | Lignes de service | fond `--bx-paper-2` au survol (`.bx-hover-bg`) ; **épaississement du trait non fait** | couleur seulement | — |
| M-11 | Boutons | inchangés (couleur seulement) | — | — |
| M-12 | Focus | contour 2 px / décalage 2 px, sans transition ; l'isométrique reçoit le même contour | idem | — |
| M-13 | Barre d'action mobile | existante ; en mouvement réduit elle reste toujours visible (`html .bx-actionbar { animation: none }`) | visible | visible (existant) |
| M-14, M-15 | Menus, formulaire | **non faits** (hors du temps disponible ; aucun script touché) | — | — |
| M-16 | Transition entre pages | non retenue (ADR-009 n° 15) | — | — |

Ajout : en impression, tout est affiché sans animation (`@media print`).

## Mouvement réduit et prise en charge

- L'état caché n'existe que dans `@media (prefers-reduced-motion: no-preference)` **et** `@supports (animation-timeline: view())` (vérifié par `tests/unit/motion-css.test.ts`).
- Les animations de défilement sont **liées à la position** (elles se rejouent à l'envers si l'on remonte) : une ligne sous l'écran est transparente tant qu'elle n'est pas entrée. Conséquence : une capture pleine page ou un outil qui mesure sans défiler voit des lignes vides ; `capture-pages.mjs` capture donc en mouvement réduit, et `a11y.spec.ts` mesure en bas de page (seule modification d'un test de T6, signalée).
- Pas de compteur, pas de parallaxe, pas de boucle.

## Mesures (build de production, port 3200)

- JS initial : 154,3 Ko (`measure-js.mjs`), **identique** à la mesure de T6 avant T4 (aucun script ajouté) ; le budget de 150 Ko reste dépassé, comme dans le rapport T6.
- CLS (`measure-vitals.mjs`) : accueil 0,000 ; Soumission 0,000 ; service tuyauterie 0,022 (venant de l'image, à vérifier : seuil du test e2e < 0,02 sur ces pages, passé).
- LCP : accueil 1,30 s (paragraphe), service 1,88 s (image), Soumission 1,04 s ; rien d'animé dans le premier écran.
- Tests : `motion-css.test.ts` (5), `motion.spec.ts` (mouvement réduit, sans règles `view()`, CLS sur 4 pages), axe vert sur les 26 pages (FR/EN, 360 et 1440 px).
- `pnpm lint`, `typecheck`, `test` (238) verts ; `pnpm build` vert ; `PLAYWRIGHT_PROD=1 pnpm test:e2e` : 185 passés, 13 ignorés, 2 échecs dans `quote-form.spec.ts` (« Merci pour votre demande ») : le journal du serveur indique le plafond global d'envois par heure atteint par les relances (travail de T5), pas un effet du mouvement.

## Non vérifié

- Firefox / Safari (aucun installé) : le comportement sans `animation-timeline` est simulé (règles retirées dans le test) et garanti par la revue du CSS, pas vu dans un vrai navigateur.
- Rendu animé à l'œil (captures faites en mouvement réduit) ; temps de rendu des animations sur un téléphone réel.
- Les deux tests de formulaire, à relancer une fois la fenêtre d'une heure écoulée.
- M-02, M-14, M-15 et la partie « dans le SVG » de M-06 ne sont pas faites.
