import type { MessageRow } from "@/lib/admin/data";
import { formatDate } from "@/lib/admin/labels";

const kindLabel: Record<MessageRow["kind"], string> = {
  outbound: "Réponse envoyée",
  inbound: "Réponse du client",
  note: "Note interne",
  event: "Journal",
};

const kindStyle: Record<MessageRow["kind"], string> = {
  outbound: "border-blue",
  inbound: "border-success",
  note: "border-ink-3 bg-paper-2",
  event: "border-rule",
};

/** Historique de la demande : réponses, notes internes et journal des actions, du plus ancien au plus récent. */
export function Timeline({ messages }: { messages: MessageRow[] }) {
  if (messages.length === 0) return <p className="text-[14px] text-ink-2">Aucun échange pour l&apos;instant.</p>;
  return (
    <ol className="space-y-3">
      {messages.map((m) => (
        <li key={m.id} className={`border bg-paper p-3 ${kindStyle[m.kind]}`}>
          <p className="flex flex-wrap justify-between gap-2 text-[12px] text-ink-2">
            <span className="font-semibold">{kindLabel[m.kind]}</span>
            <span>{formatDate(m.created_at)}</span>
          </p>
          {m.subject && <p className="mt-1 text-[14px] font-semibold text-ink">{m.subject}</p>}
          <p className={`mt-1 whitespace-pre-line text-ink ${m.kind === "event" ? "text-[13px] text-ink-2" : "text-[14px]"}`}>{m.body}</p>
        </li>
      ))}
    </ol>
  );
}
