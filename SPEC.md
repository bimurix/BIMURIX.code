# SPEC — Site BIMURIX v1

## Objectif
Présenter les 4 services BIM de Bimurix aux équipes de construction du Québec (entrepreneurs généraux,
entrepreneurs MEP, firmes de génie-conseil, fabricants, propriétaires) et transformer les visites en
**demandes de soumission**, suivies et traitées dans un **tableau de bord privé**.

Réussite :
- un visiteur comprend l'offre et peut demander une soumission en moins de 2 minutes, sur mobile ;
- chaque demande arrive en base, déclenche une notification, et Bimurix y répond depuis `/admin` ;
- Bimurix modifie seul tout le contenu public dans Sanity Studio, sans développeur.

## Périmètre
**Inclus** : 9 pages FR/EN (accueil, 4 services, à propos, soumission, confidentialité, conditions) + 404,
formulaire avec antispam, courriels transactionnels, dashboard (liste, fiche, statuts, notes, réponse,
indicateurs, anonymisation), Studio intégré avec édition visuelle, SEO.
**Exclus (v1)** : espace client, paiement, CRM complet, blog, fichiers joints (v1.1), réponses
entrantes automatiques (v1.1).

## Commandes
Voir `CLAUDE.md` §8. Toutes s'exécutent dans `web/`.

## Structure
Voir `PLAN.md` §5.

## Style de code
```ts
// Un cas d'usage = une fonction, entrée validée, erreurs explicites.
export async function submitQuote(input: unknown, deps: QuoteDeps): Promise<SubmitResult> {
  const parsed = quoteSchema.safeParse(input);
  if (!parsed.success) return { ok: false, code: "VALIDATION_FAILED", issues: parsed.error.issues };
  // ...
}
```

## Tests
- **Vitest** : routage FR/EN, validation du formulaire, mappage des contenus Sanity, mailer, statuts.
- **Playwright** (mobile 390 px et bureau 1440 px) : navigation FR/EN, envoi d'une demande (succès et
  échec), connexion admin, réponse à une demande.
- Contrat : aucune route publique n'expose de demande ; un non-admin ne lit rien.

## Limites
- **Toujours** : valider les entrées, tester avant de committer, textes dans Sanity.
- **Demander d'abord** : nouvelle dépendance, changement de schéma de base, toute action en ligne.
- **Jamais** : secrets dans le code, `DELETE` de demandes, contenu inventé présenté comme réel.
