import { statusLabel, statusTone, type QuoteStatus } from "@/lib/admin/labels";

export function StatusBadge({ status }: { status: QuoteStatus }) {
  return <span className={`inline-flex min-h-6 items-center px-2 text-[12px] font-semibold ${statusTone[status]}`}>{statusLabel[status]}</span>;
}
