"use client";

import { useActionState, useEffect, useRef } from "react";
import { addNote, type ActionResult } from "@/lib/admin/actions";

export function NoteForm({ requestId }: { requestId: string }) {
  const [state, action, pending] = useActionState<ActionResult, FormData>(addNote, null);
  const formRef = useRef<HTMLFormElement>(null);
  useEffect(() => {
    if (state?.ok) formRef.current?.reset();
  }, [state]);

  return (
    <form ref={formRef} action={action} className="border border-rule bg-paper p-4">
      <input type="hidden" name="requestId" value={requestId} />
      <label htmlFor="note" className="text-[13px] font-semibold text-ink-2">Note interne (jamais envoyée au client)</label>
      <textarea id="note" name="body" rows={3} maxLength={5000} required className="mt-1 block w-full border border-ink px-3 py-2 text-[15px]" />
      <div className="mt-2 flex items-center gap-3">
        <button type="submit" disabled={pending} className="min-h-10 bg-ink px-4 text-[14px] font-semibold text-paper disabled:opacity-60">Ajouter la note</button>
        <span role="status" className="text-[13px]">{state && (state.ok ? <span className="text-success">{state.message}</span> : <span className="text-error">{state.error}</span>)}</span>
      </div>
    </form>
  );
}
