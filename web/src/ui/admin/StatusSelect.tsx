"use client";

import { useState, useTransition } from "react";
import { updateStatus } from "@/lib/admin/actions";
import { STATUSES, statusLabel, type QuoteStatus } from "@/lib/admin/labels";

export function StatusSelect({ requestId, status }: { requestId: string; status: QuoteStatus }) {
  const [value, setValue] = useState(status);
  const [error, setError] = useState<string | null>(null);
  const [pending, start] = useTransition();

  return (
    <label className="text-[13px] text-ink-2">
      Statut
      <select
        id="request-status"
        value={value}
        disabled={pending}
        onChange={(e) => {
          const next = e.target.value as QuoteStatus;
          const previous = value;
          setValue(next); // mise à jour optimiste, annulée si le serveur refuse
          start(async () => {
            const res = await updateStatus(requestId, next);
            if (!res?.ok) {
              setValue(previous);
              setError(res && !res.ok ? res.error : "Erreur.");
            } else setError(null);
          });
        }}
        className="mt-1 block min-h-11 border-[1.5px] border-ink bg-paper px-3 text-[15px] font-semibold text-ink"
      >
        {STATUSES.map((s) => <option key={s} value={s}>{statusLabel[s]}</option>)}
      </select>
      {error && <span role="alert" className="mt-1 block text-error">{error}</span>}
    </label>
  );
}
