/** Colonne et filtre « Type » du tableau de bord : visibles si l'appel est activé, ou s'il existe des demandes d'appel à retrouver (R2). */
export const showRequestType = (callEnabled: boolean, callRequestCount: number) => callEnabled || callRequestCount > 0;
