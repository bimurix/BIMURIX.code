import { deliverables } from "./deliverables/schema";
import { faq } from "./faq/schema";
import { heroSheet } from "./hero-sheet/schema";
import { imageFigure } from "./image-figure/schema";
import { method } from "./method/schema";
import { pointsList } from "./points-list/schema";
import { quoteCta } from "./quote-cta/schema";
import { quoteForm } from "./quote-form/schema";
import { richText } from "./rich-text/schema";
import { serviceNetworks } from "./service-networks/schema";

// Un bloc = un dossier (schéma, requête, composant). decision: ADR-002 (patron turbo-start-sanity).
export const blockSchemas = [heroSheet, serviceNetworks, method, deliverables, pointsList, richText, quoteCta, faq, imageFigure, quoteForm];
export const blockTypeNames = blockSchemas.map((schema) => schema.name);
