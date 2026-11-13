import type { IconName } from "@/lib/icon-names";
import { documentIcons } from "./documents";
import { networkIcons } from "./networks";
import { placeIcons } from "./places-actions";
import type { IconShape } from "./shape";

/** Les 39 symboles de `ICON_NAMES` (un fichier par groupe). Le test de rendu vérifie que la liste reste complète. */
export const ICON_SHAPES = { ...networkIcons, ...documentIcons, ...placeIcons } as Record<IconName, IconShape>;
