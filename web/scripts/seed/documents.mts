import { formAndEmails } from "./form-and-emails.mts";
import { legalPages } from "./legal.mts";
import { launchSettingsDoc, packageDocs } from "./packages.mts";
import { pages } from "./pages.mts";
import { redirects } from "./redirects.mts";
import { service7d } from "./services-7d.mts";
import { serviceCombinee } from "./services-combinee.mts";
import { serviceGicleurs } from "./services-gicleurs.mts";
import { servicesHidden } from "./services-hidden.mts";
import { serviceTuyauterie } from "./services-tuyauterie.mts";
import { singletons } from "./singletons.mts";

/** Les 4 offres affichées, puis les 2 offres masquées (phase 2). */
export const serviceDocs = [serviceTuyauterie, serviceGicleurs, serviceCombinee, service7d, ...servicesHidden];

/** Tout le contenu de départ : un dataset neuf reçoit exactement ceci (source commune du seed, du patch N4 et des tests). */
export const seedDocuments: Array<{ _id: string; _type: string } & Record<string, unknown>> = [...singletons, ...formAndEmails, ...serviceDocs, ...redirects, ...packageDocs, launchSettingsDoc, ...pages, ...legalPages];
