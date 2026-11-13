// S-03 : l'accusé de réception part à l'adresse saisie par le visiteur. Sans limite, le formulaire servirait à
// écrire à un tiers depuis le domaine de Bimurix. Au plus deux accusés par adresse et par période de 24 h ;
// la demande est enregistrée dans tous les cas (seul l'accusé est omis).
export const MAX_ACKS_PER_ADDRESS = 2;
export const ACK_WINDOW_MS = 24 * 60 * 60 * 1000;

/** `previousAcks` : accusés déjà envoyés à cette adresse pendant la fenêtre (hors la demande en cours). */
export function shouldSendAck(previousAcks: number): boolean {
  return previousAcks < MAX_ACKS_PER_ADDRESS;
}
