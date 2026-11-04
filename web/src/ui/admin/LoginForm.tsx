"use client";

import { useActionState } from "react";
import { sendMagicLink, type ActionResult } from "@/lib/admin/actions";

export function LoginForm() {
  const [state, action, pending] = useActionState<ActionResult, FormData>(sendMagicLink, null);
  return (
    <form action={action} className="mt-6 space-y-4">
      <label htmlFor="email" className="block text-[15px] font-semibold text-ink">Courriel</label>
      <input id="email" name="email" type="email" required autoComplete="email" inputMode="email" className="block min-h-12 w-full border-[1.5px] border-ink px-3 text-[16px] outline-none focus-visible:border-blue" />
      <button type="submit" disabled={pending} className="inline-flex min-h-12 w-full items-center justify-center bg-blue px-5 font-semibold text-paper hover:bg-blue-deep disabled:opacity-60">
        {pending ? "Envoi…" : "Recevoir un lien de connexion"}
      </button>
      <p role="status" className="min-h-6 text-[14px]">
        {state?.ok && <span className="text-success">{state.message}</span>}
        {state && !state.ok && <span className="text-error">{state.error}</span>}
      </p>
    </form>
  );
}
