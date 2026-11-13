import { formAndEmails } from "./form-and-emails.mts";
import { withIcons } from "./icons-t3.mts";
import { legalPages } from "./legal.mts";
import { launchSettingsDoc, packageDocs } from "./packages.mts";
import { pages } from "./pages.mts";
import { redirects } from "./redirects.mts";
import { service7d } from "./services-7d.mts";
import { serviceCombinee } from "./services-combinee.mts";
import { serviceGicleurs } from "./services-gicleurs.mts";
import { servicesOrigine } from "./services-origine.mts";
import { serviceTuyauterie } from "./services-tuyauterie.mts";
import { singletons } from "./singletons.mts";

/** Les 6 services affichés (ADR-007), dans l'ordre d'affichage : modélisation, 3 préfabrications, BIM 7D, TQC. */
const [modelisation, tqc] = servicesOrigine;
export const serviceDocs = [modelisation, serviceTuyauterie, serviceGicleurs, serviceCombinee, service7d, tqc];

/** Tout le contenu de départ : un dataset neuf reçoit exactement ceci (source commune du seed, du patch R1 et des tests). */
// T3-A : les symboles des lignes viennent de `icons-t3.mts` (une table pour le seed et pour le patch development).
export const seedDocuments: Array<{ _id: string; _type: string } & Record<string, unknown>> = withIcons([...singletons, ...formAndEmails, ...serviceDocs, ...redirects, ...packageDocs, launchSettingsDoc, ...pages, ...legalPages]);
