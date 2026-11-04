"use client";

import { useActionState, useEffect, useRef } from "react";
import { sendReply, type ActionResult } from "@/lib/admin/actions";

type Template = { name: string; subject: string; body: string };

/** Réponse au client : modèles de Studio (déjà remplis dans sa langue), modifiables avant envoi. */
export function ReplyComposer({ requestId, templates, to }: { requestId: string; templates: Template[]; to: string }) {
  const [state, action, pending] = useActionState<ActionResult, FormData>(sendReply, null);
  const formRef = useRef<HTMLFormElement>(null);
  const subjectRef = useRef<HTMLInputElement>(null);
  const bodyRef = useRef<HTMLTextAreaElement>(null);

  // Champs non contrôlés : vidés après un envoi réussi, conservés en cas d'erreur.
  useEffect(() => {
    if (state?.ok) formRef.current?.reset();
  }, [state]);

  return (
    <form ref={formRef} action={action} className="border-[1.5px] border-ink bg-paper p-4">
      <input type="hidden" name="requestId" value={requestId} />
      <div className="flex flex-wrap items-end justify-between gap-3">
        <h3 className="text-[15px] font-semibold text-ink">Répondre à <span className="font-mono text-[13px] font-normal">{to}</span></h3>
        {templates.length > 0 && (
          <label className="text-[13px] text-ink-2">
            Modèle
            <select
              defaultValue=""
              onChange={(e) => {
                const t = templates.find((x) => x.name === e.target.value);
                if (t && subjectRef.current && bodyRef.current) {
                  subjectRef.current.value = t.subject;
                  bodyRef.current.value = t.body;
                }
              }}
              className="ms-2 min-h-10 border border-ink bg-paper px-2 text-[14px] text-ink"
            >
              <option value="">Choisir…</option>
              {templates.map((t) => <option key={t.name} value={t.name}>{t.name}</option>)}
            </select>
          </label>
        )}
      </div>
      <label htmlFor="reply-subject" className="mt-3 block text-[13px] text-ink-2">Objet</label>
      <input id="reply-subject" name="subject" ref={subjectRef} required maxLength={300} className="mt-1 block min-h-11 w-full border border-ink px-3 text-[15px]" />
      <label htmlFor="reply-body" className="mt-3 block text-[13px] text-ink-2">Message</label>
      <textarea id="reply-body" name="body" ref={bodyRef} required rows={9} maxLength={20000} className="mt-1 block w-full border border-ink px-3 py-2 text-[15px] leading-relaxed" />
      <div className="mt-3 flex flex-wrap items-center gap-3">
        <button type="submit" disabled={pending} className="min-h-11 bg-blue px-5 text-[15px] font-semibold text-paper hover:bg-blue-deep disabled:opacity-60">
          {pending ? "Envoi…" : "Envoyer la réponse"}
        </button>
        <span role="status" className="text-[14px]">{state && (state.ok ? <span className="text-success">{state.message}</span> : <span className="text-error">{state.error}</span>)}</span>
      </div>
    </form>
  );
}
