import { block, l, pt } from "./helpers.mts";

// Modèles de départ (docs/source §10 et §11), PAS un avis juridique : à faire valider avant la mise en ligne.
// Les valeurs « (exemple) » sont bloquées par le contrôle de mise en ligne (PLAN.md, M1).

const privacyFr = pt([
  ["normal", "Ce texte est un modèle de départ à faire valider avant la mise en ligne."],
  ["h2", "1. Responsable"],
  ["normal", "Bimurix est responsable des renseignements personnels recueillis par ce site. Responsable de la protection des renseignements personnels : Direction générale (exemple), contact@bimurix.com."],
  ["h2", "2. Renseignements recueillis"],
  ["normal", "Par le formulaire de soumission : nom, entreprise, courriel professionnel, téléphone (facultatif), langue de communication et informations sur votre projet. Nous ne demandons que ce qui est nécessaire au traitement de votre demande."],
  ["h2", "3. Finalités"],
  ["bullet", "Répondre à vos demandes de renseignements"],
  ["bullet", "Évaluer une demande de service ou de soumission"],
  ["bullet", "Communiquer avec vous au sujet de votre projet"],
  ["bullet", "Assurer la sécurité et le bon fonctionnement du site"],
  ["bullet", "Respecter nos obligations légales"],
  ["h2", "4. Fournisseurs et lieu de conservation"],
  ["normal", "Les demandes sont conservées dans une base de données hébergée au Canada. Le site est hébergé par Netlify et les courriels sont envoyés par Resend ; ces fournisseurs peuvent traiter certaines données hors du Québec. (Liste à confirmer avant la mise en ligne.)"],
  ["h2", "5. Conservation"],
  ["normal", "Les demandes sont conservées 24 mois après le dernier échange, puis anonymisées."],
  ["h2", "6. Témoins (cookies)"],
  ["normal", "Ce site n'utilise aucun témoin publicitaire ni de mesure d'audience. Seuls des témoins techniques nécessaires au fonctionnement peuvent être utilisés."],
  ["h2", "7. Sécurité"],
  ["normal", "L'accès aux demandes est limité aux personnes autorisées. N'envoyez pas de documents confidentiels par le formulaire : nous vous proposerons un moyen de transfert adapté."],
  ["h2", "8. Vos droits"],
  ["normal", "Vous pouvez demander l'accès à vos renseignements, leur rectification ou leur suppression en écrivant au responsable indiqué ci-dessus."],
  ["h2", "9. Modifications"],
  ["normal", "Cette politique peut être mise à jour ; la date de dernière mise à jour est indiquée en haut de la page."],
]);

const privacyEn = pt([
  ["normal", "This text is a starting template to be validated before launch."],
  ["h2", "1. Responsible party"],
  ["normal", "Bimurix is responsible for the personal information collected through this site. Person in charge of personal information protection: General management (example), contact@bimurix.com."],
  ["h2", "2. Information collected"],
  ["normal", "Through the quote form: name, company, business email, phone (optional), preferred language and information about your project. We only ask for what is needed to handle your request."],
  ["h2", "3. Purposes"],
  ["bullet", "Answer your enquiries"],
  ["bullet", "Assess a service or quote request"],
  ["bullet", "Communicate with you about your project"],
  ["bullet", "Keep the site secure and working"],
  ["bullet", "Meet our legal obligations"],
  ["h2", "4. Providers and storage location"],
  ["normal", "Requests are stored in a database hosted in Canada. The site is hosted by Netlify and emails are sent by Resend; these providers may process some data outside Quebec. (List to be confirmed before launch.)"],
  ["h2", "5. Retention"],
  ["normal", "Requests are kept for 24 months after the last exchange, then anonymised."],
  ["h2", "6. Cookies"],
  ["normal", "This site uses no advertising or analytics cookies. Only technical cookies required for the site to work may be used."],
  ["h2", "7. Security"],
  ["normal", "Access to requests is limited to authorised people. Do not send confidential documents through the form: we will offer a suitable transfer method."],
  ["h2", "8. Your rights"],
  ["normal", "You may request access to, correction of or deletion of your information by writing to the person named above."],
  ["h2", "9. Changes"],
  ["normal", "This policy may be updated; the last update date is shown at the top of the page."],
]);

const termsFr = pt([
  ["normal", "Ce texte est un modèle de départ à faire valider avant la mise en ligne. Il ne remplace pas le contrat propre à chaque mandat."],
  ["h2", "1. Objet"],
  ["normal", "Ce site présente les services de Bimurix et permet de communiquer avec l'entreprise pour obtenir des informations ou demander une soumission."],
  ["h2", "2. Informations présentées"],
  ["normal", "Les informations du site sont fournies à titre général. Le périmètre, les livrables, les échéances, les responsabilités, les honoraires et les critères d'acceptation de tout mandat sont confirmés dans une offre ou une entente distincte."],
  ["h2", "3. Demandes de soumission"],
  ["normal", "L'envoi d'un formulaire ne constitue ni une acceptation de mandat ni une garantie de disponibilité."],
  ["h2", "4. Utilisation du site"],
  ["normal", "Vous vous engagez à fournir des informations exactes et à ne pas utiliser le formulaire pour transmettre des contenus illicites, malveillants ou sans lien avec nos services."],
  ["h2", "5. Propriété intellectuelle"],
  ["normal", "Les textes, éléments graphiques et marques de Bimurix ne peuvent être reproduits sans autorisation, sous réserve des exceptions prévues par la loi."],
  ["h2", "6. Liens externes"],
  ["normal", "Bimurix ne contrôle pas le contenu, la disponibilité ni les pratiques des sites externes liés."],
  ["h2", "7. Limites"],
  ["normal", "Le contenu du site ne remplace pas les documents contractuels, les plans approuvés, les validations professionnelles ni les instructions propres à un projet."],
  ["h2", "8. Contact"],
  ["normal", "Questions : contact@bimurix.com."],
]);

const termsEn = pt([
  ["normal", "This text is a starting template to be validated before launch. It does not replace the contract specific to each mandate."],
  ["h2", "1. Purpose"],
  ["normal", "This site presents Bimurix's services and lets you contact the company for information or to request a quote."],
  ["h2", "2. Information provided"],
  ["normal", "Site information is general. The scope, deliverables, deadlines, responsibilities, fees and acceptance criteria of any mandate are confirmed in a separate proposal or agreement."],
  ["h2", "3. Quote requests"],
  ["normal", "Submitting a form is neither acceptance of a mandate nor a guarantee of availability."],
  ["h2", "4. Use of the site"],
  ["normal", "You agree to provide accurate information and not to use the form for unlawful, malicious or unrelated content."],
  ["h2", "5. Intellectual property"],
  ["normal", "Bimurix texts, graphics and marks may not be reproduced without permission, subject to exceptions provided by law."],
  ["h2", "6. External links"],
  ["normal", "Bimurix does not control the content, availability or practices of linked external sites."],
  ["h2", "7. Limits"],
  ["normal", "Site content does not replace contract documents, approved drawings, professional validations or project-specific instructions."],
  ["h2", "8. Contact"],
  ["normal", "Questions: contact@bimurix.com."],
]);

const legalPage = (id: string, kind: string, title: { fr: string; en: string }, slug: { fr: string; en: string }, sheet: string, body: { fr: unknown; en: unknown }) => ({
  _id: id,
  _type: "page",
  kind,
  title,
  slug,
  titleBlock: { sheet, revision: "0", date: "2026-11" },
  updatedLabel: l("Dernière mise à jour : novembre 2026 (exemple)", "Last updated: November 2026 (example)"),
  seo: { title: l(`${title.fr} | Bimurix`, `${title.en} | Bimurix`) },
  sections: [block("heroSheet", { heading: title }), block("richText", { body })],
});

export const legalPages = [
  legalPage("page-privacy", "privacy", l("Politique de confidentialité", "Privacy policy"), l("confidentialite", "privacy"), "L-01", { fr: privacyFr, en: privacyEn }),
  legalPage("page-terms", "terms", l("Conditions d'utilisation", "Terms of use"), l("conditions", "terms"), "L-02", { fr: termsFr, en: termsEn }),
];
