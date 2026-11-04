# Identité visuelle Bimurix

Logo retenu : **L-01 « Croisement »**. BIM en bleu nuit `#0F172A`, URIX en bleu `#0F52BA`.
Le X : trait épais bleu (devant), trait fin bleu nuit coupé (derrière), comme un croisement de réseaux
sur un dessin de coordination. Pas de cyan, pas de bleu clair, pas de dégradé.

Ouvrir `guide-identite.html` pour tout voir (règles, couleurs, typographie, formats).

## Quel fichier prendre

| Besoin | Fichier |
|---|---|
| Logo par défaut (site, documents) | `01-logo/svg/bimurix-logo-couleur.svg` (ou le PNG de même nom) |
| Fond foncé ou photo | `bimurix-logo-blanc` |
| Noir et blanc | `bimurix-logo-gris` (deux tons) ou `bimurix-logo-noir` |
| Une seule encre | `bimurix-logo-bleu`, `-marine`, `-noir` |
| Format carré | `bimurix-logo-empile-*` |
| Logo + icône | `bimurix-logo-icone-*` |
| Petit format, avatar | `bimurix-icone-blanc` (principal), `-bleu`, `-marine`, `-noir`, `-blanc-noir` |
| Site web | `02-site-web/` : favicons, icônes, manifeste, images de partage ; voir `head-snippet.html` |
| LinkedIn | `03-linkedin/` : logo 400×400, bannières entreprise 1128×191 et profil 1584×396, gabarits de publication |
| Courriel | `04-courriel/` : deux signatures HTML, logo et icône PNG, en-tête d'infolettre |
| Imprimé | `05-imprime/` : logo vectoriel PDF, cartes d'affaires couleur et noir-blanc (PDF) |
| Autres réseaux | `06-reseaux/` : avatars 1080×1080 |

Les fonds de gabarits existent en quatre versions : `clair` (principal), `bleu`, `marine`, `noir-blanc`.

## Valeurs d'exemple
Téléphone 514 555-0100, `prenom@bimurix.ca`, `bimurix.ca`, « Prénom Nom », « Titre du poste » et
`VOTRE-DOMAINE` sont des **exemples** à remplacer. Le titre des gabarits de publication aussi.

## Regénérer
`07-sources/` contient les scripts. Les lettres viennent d'Archivo (licence SIL Open Font),
instance largeur 125 / graisse 800, vectorisée dans `font/glyphs.json`. Le rendu PNG/PDF utilise le
Playwright déjà installé dans `web/`. Les chemins absolus en tête de `gen.mjs` sont à ajuster si le dossier bouge.

```bash
node identite-visuelle/07-sources/gen.mjs
```

## Archive
`99-archive/` : planches de départ et pistes non retenues (L-00, L-02, L-03). Ne pas utiliser.
