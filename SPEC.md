# SPEC — Site BIMURIX v1.1 (offres à forfaits, ADR-006)

## Objectif
Présenter les **4 offres à forfaits** de Bimurix (préfabrication tuyauterie, préfabrication gicleurs,
tuyauterie + gicleurs, BIM 7D) aux entrepreneurs en mécanique du bâtiment, en plomberie et en gicleurs,
aux constructeurs modulaires et aux propriétaires du Grand Montréal, et transformer les visites en
**demandes d'appel de 20 minutes ou de soumission**, suivies dans un **tableau de bord privé**.

Réussite :
- un visiteur voit les forfaits, leurs prix et leurs conditions, et réserve un appel en moins de 2 minutes, sur mobile ;
- chaque demande arrive en base, déclenche une notification, et Bimurix y répond depuis `/admin` ;
- Bimurix modifie seul tout le contenu public dans Sanity Studio, sans développeur : textes, **prix, délais,
  conditions, date limite**, et peut **masquer un forfait ou une offre** en un clic.

## Périmètre
**Inclus** : 9 pages FR/EN (accueil, 4 services, à propos, soumission, confidentialité, conditions) + 404,
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
- Contrat : un forfait ou une offre masqué n'apparaît nulle part (page, menu, sitemap, formulaire) ;
  un forfait « sur soumission » n'affiche aucun montant.

## Limites
- **Toujours** : valider les entrées, tester avant de committer, textes dans Sanity.
- **Demander d'abord** : nouvelle dépendance, changement de schéma de base, toute action en ligne.
- **Jamais** : prix ou conditions dans le code, écriture dans le dataset `production` avant la phase M, secrets dans le code, `DELETE` de demandes, contenu inventé présenté comme réel.
