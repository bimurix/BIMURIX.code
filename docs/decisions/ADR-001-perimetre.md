# ADR-001 — Périmètre : ajout d'un tableau de bord et d'un CMS

**Statut** : accepté (2026-11-03)

## Contexte
Les documents d'origine (`docs/source/`) prévoyaient un site sans base de données, sans CMS ni
tableau de bord : les demandes arrivaient seulement dans la boîte courriel.

## Décision
Ajouter :
- **Sanity** pour que Bimurix modifie tout le contenu public (logo, images, textes, SEO, courriels) ;
- **Supabase** pour stocker les demandes et les échanges ;
- un **tableau de bord `/admin`** pour suivre les demandes et y répondre par courriel.

Restent exclus : espace client, paiement, CRM complet.

## Conséquences
- Données personnelles stockées → obligations Loi 25 (consentement, conservation, anonymisation).
- Plus de pièces mobiles ; compensé par un développement entièrement local (ADR-004) et des tests.
