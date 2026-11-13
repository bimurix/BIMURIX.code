# SPEC — Site BIMURIX v1.3 (6 services en 3 familles, sans prix publiés, ADR-007 et ADR-008)

## Objectif
Présenter les **6 services** de Bimurix (modélisation BIM et coordination, préfabrication tuyauterie,
préfabrication gicleurs, tuyauterie + gicleurs, BIM 7D, TQC et contrôle qualité), rangés en trois familles (Modéliser et coordonner, Préfabriquer, Livrer et exploiter), sans prix, type de forfait ni délai fixe publiés, aux entrepreneurs en mécanique du bâtiment, en plomberie et en gicleurs,
aux constructeurs modulaires et aux propriétaires du Grand Montréal, et transformer les visites en
**demandes de soumission**, suivies dans un **tableau de bord privé**.

Réussite :
- un visiteur reconnaît son problème de chantier, voit ce qu'il reçoit et à quoi ça sert, et demande une soumission en moins de 2 minutes, sur mobile ;
- chaque demande arrive en base, déclenche une notification, et Bimurix y répond depuis `/admin` ;
- Bimurix modifie seul tout le contenu public dans Sanity Studio, sans développeur : textes, situations types, livrables,
  « Qui fait quoi », questions fréquentes, et peut **masquer un service** ou **rallumer un forfait** (masqué par défaut, ADR-008) en un clic.

## Périmètre
**Inclus** : 11 pages FR/EN (accueil, 6 services, à propos, soumission, confidentialité, conditions) + 404,
formulaire avec antispam, courriels transactionnels, dashboard (liste, fiche, statuts, notes, réponse,
indicateurs, anonymisation), Studio intégré avec édition visuelle, SEO.
**Exclus (v1)** : espace client, paiement, CRM complet, blog, fichiers joints (v1.1), réponses
entrantes automatiques (v1.1).

## Commandes
Voir `CLAUDE.md` §8. Toutes s'exécutent dans `web/`.

## Structure
Voir `docs/ARCHITECTURE.md`.

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
- Contrat : un forfait ou une offre masqué n'apparaît nulle part (page, menu, sitemap, formulaire) ; avec tous les forfaits masqués (état par défaut),
  aucune page n'affiche de prix, de forfait, de délai fixe ni de condition de paiement, et le champ « Forfait visé » est absent du formulaire.
- Contrat : un forfait remis à visible: true réapparaît (le code des forfaits reste).

## Limites
- **Toujours** : valider les entrées, tester avant de committer, textes dans Sanity.
- **Demander d'abord** : nouvelle dépendance, changement de schéma de base, toute action en ligne.
- **Jamais** : prix ou conditions dans le code, écriture dans le dataset `production` avant la phase M, secrets dans le code, `DELETE` de demandes, contenu inventé présenté comme réel.
