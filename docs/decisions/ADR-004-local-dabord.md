# ADR-004 — Développement local d'abord, isolé

**Statut** : accepté (2026-11-03)

## Décision
Tout est développé et testé sur le poste avant toute configuration en ligne :
- site sur `localhost:3100` ;
- Supabase local dans Docker (`project_id = "bimurix"`, ports 54421–54429) ;
- courriels capturés par Mailpit (`localhost:54424`) ;
- Turnstile avec les clés de test officielles ;
- Sanity : seul service en ligne obligatoire (pas de mode hors ligne), jeu de données `development`.

## Pourquoi isoler
D'autres projets tournent sur le même poste (ex. `safer-postgres-1` sur 5432). Des ports et un
identifiant de projet propres évitent toute collision de conteneurs, de volumes ou de ports.

## Conséquences
La mise en ligne (phase M du plan) rejoue les mêmes migrations et variables sur les services cloud.
