// Libellés du tableau de bord (FR seulement, ADR-003).
export const STATUSES = ["new", "in_review", "replied", "won", "lost", "archived", "spam"] as const;
export type QuoteStatus = (typeof STATUSES)[number];

export const statusLabel: Record<QuoteStatus, string> = {
  new: "Nouvelle",
  in_review: "En cours",
  replied: "Répondue",
  won: "Gagnée",
  lost: "Perdue",
  archived: "Archivée",
  spam: "Indésirable",
};

export const statusTone: Record<QuoteStatus, string> = {
  new: "bg-blue text-paper",
  in_review: "bg-ink text-paper",
  replied: "bg-paper text-ink shadow-[inset_0_0_0_1px_var(--bx-ink)]",
  won: "bg-success text-paper",
  lost: "bg-paper text-ink-2 shadow-[inset_0_0_0_1px_var(--bx-rule)]",
  archived: "bg-paper-2 text-ink-3",
  spam: "bg-paper-2 text-error",
};

export function isStatus(value: unknown): value is QuoteStatus {
  return typeof value === "string" && (STATUSES as readonly string[]).includes(value);
}

const dateFormat = new Intl.DateTimeFormat("fr-CA", { dateStyle: "medium", timeStyle: "short", timeZone: "America/Toronto" });
export const formatDate = (iso: string | null | undefined) => (iso ? dateFormat.format(new Date(iso)) : "—");
