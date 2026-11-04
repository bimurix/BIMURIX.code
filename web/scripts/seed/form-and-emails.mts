import { keyed, l } from "./helpers.mts";

const opt = (value: string, fr: string, en: string) => ({ value, label: l(fr, en) });

// Les 17 régions administratives du Québec, plus « Hors Québec ».
const regions = [
  opt("bas-saint-laurent", "Bas-Saint-Laurent", "Bas-Saint-Laurent"),
  opt("saguenay-lac-saint-jean", "Saguenay–Lac-Saint-Jean", "Saguenay–Lac-Saint-Jean"),
  opt("capitale-nationale", "Capitale-Nationale", "Capitale-Nationale"),
  opt("mauricie", "Mauricie", "Mauricie"),
  opt("estrie", "Estrie", "Estrie"),
  opt("montreal", "Montréal", "Montréal"),
  opt("outaouais", "Outaouais", "Outaouais"),
  opt("abitibi-temiscamingue", "Abitibi-Témiscamingue", "Abitibi-Témiscamingue"),
  opt("cote-nord", "Côte-Nord", "Côte-Nord"),
  opt("nord-du-quebec", "Nord-du-Québec", "Nord-du-Québec"),
  opt("gaspesie-iles-de-la-madeleine", "Gaspésie–Îles-de-la-Madeleine", "Gaspésie–Îles-de-la-Madeleine"),
  opt("chaudiere-appalaches", "Chaudière-Appalaches", "Chaudière-Appalaches"),
  opt("laval", "Laval", "Laval"),
  opt("lanaudiere", "Lanaudière", "Lanaudière"),
  opt("laurentides", "Laurentides", "Laurentides"),
  opt("monteregie", "Montérégie", "Montérégie"),
  opt("centre-du-quebec", "Centre-du-Québec", "Centre-du-Québec"),
  opt("hors-quebec", "Hors Québec", "Outside Quebec"),
];

const formSettings = {
  _id: "formSettings",
  _type: "formSettings",
  label_fullName: l("Nom complet", "Full name"),
  label_company: l("Entreprise", "Company"),
  label_email: l("Courriel professionnel", "Business email"),
  label_phone: l("Téléphone", "Phone"),
  label_preferredLanguage: l("Langue de communication", "Preferred language"),
  label_service: l("Service recherché", "Service needed"),
  label_projectType: l("Type de projet", "Project type"),
  label_region: l("Région du projet", "Project region"),
  label_phase: l("Phase du projet", "Project phase"),
  label_timeline: l("Échéancier souhaité", "Desired timeline"),
  label_budget: l("Budget approximatif", "Approximate budget"),
  label_software: l("Logiciels et formats", "Software and formats"),
  label_description: l("Description du besoin", "Describe your needs"),
  label_optional: l("facultatif", "optional"),
  label_submit: l("Envoyer ma demande", "Send my request"),
  label_sending: l("Envoi de votre demande…", "Sending your request…"),
  descriptionHelp: l("Disciplines concernées, état d'avancement, livrables attendus.", "Disciplines involved, project progress, expected deliverables."),
  filesHelp: l("Pour partager des fichiers, ajoutez un lien (ACC, Drive, WeTransfer) dans la description.", "To share files, add a link (ACC, Drive, WeTransfer) in the description."),
  includeServices: true,
  extraServiceOptions: keyed([opt("multiple", "Plusieurs services", "Several services"), opt("other", "Autre demande", "Other request")]),
  projectTypes: keyed([
    opt("commercial", "Commercial", "Commercial"),
    opt("institutional", "Institutionnel", "Institutional"),
    opt("residential", "Résidentiel multilogement", "Multi-unit residential"),
    opt("industrial", "Industriel", "Industrial"),
    opt("infrastructure", "Infrastructure", "Infrastructure"),
    opt("other", "Autre", "Other"),
  ]),
  regions: keyed(regions),
  phases: keyed([
    opt("design", "Conception", "Design"),
    opt("tender", "Appel d'offres", "Tender"),
    opt("construction", "Construction", "Construction"),
    opt("handover", "Mise en service et remise", "Commissioning and handover"),
    opt("operations", "Exploitation", "Operations"),
  ]),
  timelines: keyed([
    opt("lt-1m", "Moins d'un mois", "Less than a month"),
    opt("1-3m", "1 à 3 mois", "1 to 3 months"),
    opt("3-6m", "3 à 6 mois", "3 to 6 months"),
    opt("gt-6m", "Plus de 6 mois", "More than 6 months"),
    opt("tbd", "À déterminer", "To be determined"),
  ]),
  budgets: keyed([
    opt("lt-5k", "Moins de 5 000 $", "Under $5,000"),
    opt("5-15k", "5 000 $ à 15 000 $", "$5,000 to $15,000"),
    opt("15-50k", "15 000 $ à 50 000 $", "$15,000 to $50,000"),
    opt("gt-50k", "Plus de 50 000 $", "Over $50,000"),
    opt("tbd", "À déterminer", "To be determined"),
  ]),
  softwareOptions: keyed([
    opt("revit", "Revit", "Revit"),
    opt("navisworks", "Navisworks", "Navisworks"),
    opt("autocad", "AutoCAD / DWG", "AutoCAD / DWG"),
    opt("ifc", "IFC", "IFC"),
    opt("acc", "Autodesk Construction Cloud", "Autodesk Construction Cloud"),
    opt("other", "Autre", "Other"),
  ]),
  errorRequired: l("Ce champ est obligatoire.", "This field is required."),
  errorEmail: l("Veuillez saisir une adresse courriel valide.", "Please enter a valid email address."),
  successTitle: l("Merci pour votre demande.", "Thank you for your request."),
  successBody: l("Votre message a été transmis. Nous examinerons les informations fournies et communiquerons avec vous si des précisions sont nécessaires.", "Your message has been sent. We will review the information and contact you if we need more details."),
  failureTitle: l("L'envoi n'a pas abouti.", "Your request could not be sent."),
  failureBody: l("Veuillez vérifier les champs requis et réessayer. Si le problème persiste, écrivez-nous à contact@bimurix.com.", "Please check the required fields and try again. If the problem persists, email us at contact@bimurix.com."),
  consentText: l(
    "J'accepte que Bimurix utilise ces renseignements pour traiter ma demande et communiquer avec moi à son sujet, conformément à la politique de confidentialité.",
    "I agree that Bimurix may use this information to handle my request and contact me about it, in accordance with the privacy policy.",
  ),
  policyVersion: "2026-11",
  notificationEmail: "contact@bimurix.com",
};

const emailTemplates = {
  _id: "emailTemplates",
  _type: "emailTemplates",
  fromName: "Bimurix",
  ackSubject: l("Nous avons bien reçu votre demande ({reference})", "We received your request ({reference})"),
  ackBody: l(
    "Bonjour {name},\n\nMerci d'avoir communiqué avec Bimurix au sujet de « {service} ». Nous examinons votre demande et vous répondrons dans les meilleurs délais.\n\nVotre référence : {reference}.",
    "Hello {name},\n\nThank you for contacting Bimurix about \"{service}\". We are reviewing your request and will get back to you shortly.\n\nYour reference: {reference}.",
  ),
  signature: l("L'équipe Bimurix\ncontact@bimurix.com", "The Bimurix team\ncontact@bimurix.com"),
  internalSubject: "Nouvelle demande : {company} — {service} ({reference})",
  replyTemplates: keyed([
    {
      name: "Demande de précisions",
      subject: l("Votre demande {reference} : quelques précisions", "Your request {reference}: a few questions"),
      body: l("Bonjour {name},\n\nPour préparer une soumission juste, pourriez-vous nous préciser :\n- \n- \n\nMerci !", "Hello {name},\n\nTo prepare an accurate quote, could you tell us:\n- \n- \n\nThank you!"),
    },
    {
      name: "Soumission envoyée",
      subject: l("Votre soumission Bimurix ({reference})", "Your Bimurix quote ({reference})"),
      body: l("Bonjour {name},\n\nVous trouverez ci-joint notre soumission pour « {service} ». Nous restons disponibles pour en discuter.", "Hello {name},\n\nPlease find attached our quote for \"{service}\". We are happy to discuss it."),
    },
    {
      name: "Refus poli",
      subject: l("Votre demande {reference}", "Your request {reference}"),
      body: l("Bonjour {name},\n\nMerci pour votre intérêt. Nous ne sommes malheureusement pas en mesure de prendre ce mandat pour le moment.", "Hello {name},\n\nThank you for your interest. Unfortunately we are not able to take on this mandate at this time."),
    },
  ]),
};

export const formAndEmails = [formSettings, emailTemplates];
