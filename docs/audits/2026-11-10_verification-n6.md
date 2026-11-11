# Vérification finale N6 — 2026-11-10

Vérification indépendante de la refonte « 4 offres à forfaits » (commits N2 à N5), faite en local sur le dataset
Sanity `development` et la base Supabase locale. Aucun déploiement, aucune écriture dans `production`.

## Résultats chiffrés (sur le dernier commit de code)
| Contrôle | Résultat |
|---|---|
| `pnpm lint`, `pnpm typecheck` | 0 erreur |
| `pnpm test` | 76 réussis (8 fichiers) |
| `pnpm build` | réussi |
| `pnpm test:e2e` | 115 réussis, 0 échec, 7 ignorés (tests réservés au bureau) |
| axe WCAG AA | 22 pages × mobile et bureau : 0 violation (le test couvrait 11 pages, il en couvre 22) |
| JS initial de l'accueil (navigateurs modernes, gzip) | ≈ 149,7 Ko, budget 150 Ko : conforme, très juste |
| `pnpm audit` | 1 vulnérabilité modérée (minimatch, via la ligne de commande Sanity : outil de développement) |
| Rendu 360 px et 1440 px, FR et EN (18 pages + 404) | 1 seul H1, aucun débordement horizontal, aucune clé brute |

Le premier E2E complet (avant corrections) : 84 réussis, 3 échecs, 7 ignorés. Les 3 échecs réussissaient seuls.

## Défauts trouvés et corrigés
1. **Clic avant la fin du chargement** : « Envoyer » ne faisait rien, et Entrée pouvait envoyer les renseignements
   dans l'adresse de la page. Le bouton est inactif jusqu'à ce que le formulaire soit prêt (test rouge puis vert).
2. **Forfait choisi dans la liste** : l'offre n'était pas choisie, la demande était refusée « champ obligatoire ».
   Corrigé (test rouge puis vert).
3. **Redirection d'ancienne adresse** : `//autre-site` et une cible identique à la source étaient acceptées.
   `safeRedirectTarget` + champ Studio resserré (tests unitaires).
4. **Pied de page** : liens à 40 px, portés à 44 px.
5. **Tests instables** (changement de langue, connexion admin) : compilation à la demande en mode dev sous charge.
   Préchauffage des routes (`tests/e2e/warm-up.ts`) et délai de 45 s.

## Vérifié sans défaut
- Validation Zod serveur de `requestType` et `packageCode` (fail-closed, liste des forfaits publiés), `?forfait=`
  traité comme non fiable, objets de courriel sur une ligne, migration (contraintes, RLS et droits inchangés),
  filtre « type » de `/admin` validé, `requireAdmin` partout, en-têtes de sécurité et CSP en place
  (`unsafe-eval` seulement en dev), aucune route publique n'expose de demande.
- Masquage temporaire dans `development`, état d'origine remis et revérifié : forfait masqué absent de la page,
  du formulaire et du menu ; offre masquée en 404 et absente du sitemap ; forfait « sur soumission » sans montant.
- Contenu FR et EN : aucun des éléments « à valider » (60 $/spool, implantation, rack, 7D à 3 900 $, tarifs
  réguliers, garantie), pas de 718 000 pi², pas de téléphone, NEQ, affiliation ni nom de personne ; chiffres de
  J.M. Brennan avec source et lien ; mention sur l'ingénieur présente ; « dessins d'atelier » et « soumission ».
- Parcours : appel FR à 360 px et soumission EN à 1440 px : référence, ligne en base (type + forfait), 2 courriels
  dans la bonne langue, demande filtrable dans `/admin`, réponse envoyée.

## Risques restants
- Le budget de 150 Ko est atteint à 0,3 Ko près : tout ajout de script le dépasse.
- Masquer une offre ne retire pas son nom des textes libres (liste de À propos, descriptions SEO).
- L'objet du courriel interne mélange le français et le nom du service dans la langue du client (mineur).
- Cibles tactiles de 40 px dans `/admin` (outil interne, non corrigé).
- Non vérifié : Turnstile réel et Resend (clés de test et Mailpit seulement).
- Deux demandes de test (BX-L2NTAY, BX-34ATWS) restent dans la base locale.

## À faire relire par le client
- « Modifications après approbation : 100 $/h » et « 50 % à la commande, 50 % à la livraison, net 15 jours » :
  publiés (conditions non marquées à valider dans le document v3.1), mais ce sont un tarif à l'heure et des
  conditions de paiement.
- Délai « un jour ouvrable » (ADR-006 n° 23), prix des 5 forfaits, exemple « 12 000 $ − 1 800 $ = 10 200 $ ».
- Textes EN (traduits, à relire), phrase « Recommandé » sur F-04.
- Faits à fournir : téléphone, NEQ, nom légal ; date limite des forfaits à saisir à la mise en ligne.
