"use client";

import { useState, useTransition } from "react";
import { anonymizeRequest } from "@/lib/admin/actions";

/** Anonymisation (Loi 25) : action irréversible, demandée en deux temps. */
export function AnonymizeButton({ requestId }: { requestId: string }) {
  const [confirming, setConfirming] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [pending, start] = useTransition();

  if (!confirming) {
    return (
      <button type="button" onClick={() => setConfirming(true)} className="min-h-10 text-[14px] font-semibold text-error underline underline-offset-4">
        Anonymiser cette demande (Loi 25)
      </button>
    );
  }
  return (
    <div role="alertdialog" aria-labelledby="anon-title" className="border-[1.5px] border-error bg-paper p-4">
      <p id="anon-title" className="text-[14px] text-ink">
        Les nom, courriel, téléphone, description et contenus des échanges seront effacés définitivement. Les statistiques sont conservées.
      </p>
      <div className="mt-3 flex gap-3">
        <button
          type="button"
          disabled={pending}
          onClick={() => start(async () => {
            const res = await anonymizeRequest(requestId);
            setMessage(res?.ok ? res.message ?? "" : res && !res.ok ? res.error : "Erreur.");
          })}
          className="min-h-10 bg-error px-4 text-[14px] font-semibold text-paper disabled:opacity-60"
        >
          Confirmer l&apos;anonymisation
        </button>
        <button type="button" onClick={() => setConfirming(false)} className="min-h-10 px-4 text-[14px] font-semibold text-ink">Annuler</button>
      </div>
      {message && <p role="status" className="mt-2 text-[13px] text-ink-2">{message}</p>}
    </div>
  );
}
