import { conditions } from "./conditions/schema";
import { deliverables } from "./deliverables/schema";
import { faq } from "./faq/schema";
import { heroSheet } from "./hero-sheet/schema";
import { imageFigure } from "./image-figure/schema";
import { method } from "./method/schema";
import { packages } from "./packages/schema";
import { pointsList } from "./points-list/schema";
import { problems } from "./problems/schema";
import { projectCycle } from "./project-cycle/schema";
import { proof } from "./proof/schema";
import { quoteCta } from "./quote-cta/schema";
import { quoteForm } from "./quote-form/schema";
import { responsibilityTable } from "./responsibility-table/schema";
import { richText } from "./rich-text/schema";
import { scenarios } from "./scenarios/schema";
import { serviceNetworks } from "./service-networks/schema";

// Un bloc = un dossier (schéma, requête, composant). decision: ADR-002 (patron turbo-start-sanity).
export const blockSchemas = [heroSheet, serviceNetworks, method, deliverables, pointsList, richText, quoteCta, faq, imageFigure, quoteForm, packages, conditions, proof, problems, projectCycle, scenarios, responsibilityTable];
export const blockTypeNames = blockSchemas.map((schema) => schema.name);
