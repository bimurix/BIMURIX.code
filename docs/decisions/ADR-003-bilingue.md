# ADR-003 — Bilinguisme FR / EN

**Statut** : accepté (2026-11-03)

## Décision
- Français par défaut sans préfixe (`/a-propos`), anglais sous `/en` (`/en/about`).
- Dans Sanity, **un document par page** avec des champs `{ fr, en }` (types `localeString`,
  `localeText`, `localeSlug`…), sans plugin. Le FR est obligatoire.
- Une page dont l'EN est incomplet n'est pas publiée en anglais (Charte de la langue française :
  le français n'est jamais moins complet).
- `hreflang` `fr-CA` / `en-CA` ; le sélecteur de langue mène à la page équivalente.
- Le tableau de bord est en français seulement ; les courriels suivent la langue choisie par le client.

## Alternatives écartées
- Plugin `document-internationalization` (une copie par langue) : archivé, et les versions peuvent
  diverger.
- `next-intl` : sa table d'adresses fixes ne sert pas quand les adresses viennent du CMS.
