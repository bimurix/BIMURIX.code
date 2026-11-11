// decision: ADR-006 n° 5 — chiffres d'un tiers : jamais sans le nom et le lien de la source.
export type ProofGate = { enabled?: boolean | null; sourceName?: string | null; sourceUrl?: string | null };

/** Le bloc de preuve ne se rend que s'il est activé et que la source est nommée et liée par une adresse http(s). */
export function canShowProof(data: ProofGate | null | undefined): boolean {
  if (!data || data.enabled !== true) return false;
  if (!data.sourceName?.trim()) return false;
  try {
    const url = new URL(data.sourceUrl ?? "");
    return url.protocol === "https:" || url.protocol === "http:";
  } catch {
    return false;
  }
}
