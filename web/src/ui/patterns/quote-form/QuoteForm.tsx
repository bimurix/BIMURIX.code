"use client";

import Link from "next/link";
import Script from "next/script";
import { useSearchParams } from "next/navigation";
import { startTransition, useActionState, useEffect, useRef, useState, useSyncExternalStore } from "react";
import type { Locale } from "@/lib/i18n/locales";
import { submitQuoteAction } from "@/lib/quote/actions";
import type { SubmitResult } from "@/lib/quote/schema";
import { DetailFields } from "./detail-fields";
import { ChoiceGroup, SelectField, TextArea, TextField } from "./fields";
import type { FormModel } from "./form-model";

declare global {
  interface Window { turnstile?: { reset: (el?: HTMLElement | string) => void } }
}

type Props = { model: FormModel; locale: Locale; siteKey?: string };

const noop = () => () => {};
/** Faux côté serveur et à l'hydratation, vrai ensuite : le bouton d'envoi reste inactif tant que le formulaire n'est pas prêt (N6). */
const useHydrated = () => useSyncExternalStore(noop, () => true, () => false);

/** Formulaire de soumission (îlot client). Le succès ne s'affiche qu'après l'enregistrement réel en base. */
export function QuoteForm({ model, locale, siteKey }: Props) {
  const { t, options } = model;
  const [state, dispatch, pending] = useActionState<SubmitResult | null, FormData>(submitQuoteAction, null);
  const hydrated = useHydrated();
  const params = useSearchParams();
  const formRef = useRef<HTMLFormElement>(null);
  const statusRef = useRef<HTMLDivElement>(null);
  const presetService = params.get("service") ?? undefined;
  // decision: ADR-006 n° 7 — ?forfait=<code> (lien d'une ligne de forfait) pré-choisit le forfait et son offre.
  const presetCode = params.get("forfait")?.trim().toUpperCase();
  const hasPackages = model.packages.length > 1; // plus que « autre »
  const presetPackage = model.packages.find((p) => p.value === presetCode);
  // decision: R2 — sans appel activé dans Studio, la demande est toujours une soumission et aucun choix n'est affiché.
  const { callEnabled } = model;
  const [chosenType, setRequestType] = useState<"call" | "quote">("call");
  const requestType = callEnabled ? chosenType : "quote";
  const [service, setService] = useState(() => {
    const fromPackage = presetPackage?.serviceId;
    const wanted = presetService ?? fromPackage;
    return options.service.some((o) => o.value === wanted) ? (wanted as string) : "";
  });
  const detailsRef = useRef<HTMLDetailsElement>(null);
  const fields = state && !state.ok ? (state.fields ?? {}) : {};

  // Demande d'appel (si activée) : les champs de précision se replient (parcours court) ; soumission : toujours ouverts.
  useEffect(() => {
    if (detailsRef.current) detailsRef.current.open = requestType === "quote";
  }, [requestType]);

  // Après une réponse : jeton antispam renouvelé (usage unique) ; en cas d'erreurs de saisie, le focus va au premier champ en erreur
  // (le résumé ci-dessous est annoncé par role="alert") ; sinon au message d'état. R-35.
  useEffect(() => {
    if (!state) return;
    if (!state.ok) window.turnstile?.reset();
    const firstInvalid = state.ok ? null : formRef.current?.querySelector<HTMLElement>('input[aria-invalid="true"], select[aria-invalid="true"], textarea[aria-invalid="true"]');
    (firstInvalid ?? statusRef.current)?.focus();
  }, [state]);

  if (state?.ok) {
    return (
      <div ref={statusRef} tabIndex={-1} role="status" className="max-w-3xl border-[1.5px] border-success p-6 outline-none sm:p-8">
        <h2 className="font-display text-2xl font-bold text-ink">{t.successTitle}</h2>
        <p className="mt-3 text-[17px] leading-relaxed text-ink-2">{requestType === "call" && t.successBodyCall ? t.successBodyCall : t.successBody}</p>
        <p className="mt-4 font-mono text-[14px] text-ink">{t.reference}{locale === "fr" ? " " : ""}: <strong>{state.reference}</strong></p>
      </div>
    );
  }

  const err = (name: string) => {
    const e = (fields as Record<string, string | undefined>)[name];
    if (!e) return undefined;
    if (e === "required") return t.required;
    return name === "email" ? t.invalidEmail : t.invalid;
  };
  const failure = state && !state.ok && state.code !== "VALIDATION_FAILED"
    ? state.code === "RATE_LIMITED" ? t.rateLimited : state.code === "CAPTCHA_FAILED" ? t.captcha : t.failureBody
    : null;
  const common = { optionalLabel: t.optional };
  // Résumé des erreurs (R-35) : chaque ligne mène au champ ; mêmes libellés et mêmes messages que sous les champs.
  const labels: Record<string, string> = {
    fullName: t.fullName, company: t.company, email: t.email, phone: t.phone, preferredLanguage: t.preferredLanguage, service: t.service,
    description: t.description, consent: t.consent, requestType: t.requestType, packageCode: t.package,
    projectType: t.projectType, region: t.region, phase: t.phase, timeline: t.timeline, budget: t.budget, software: t.software,
  };
  const summary = Object.keys(fields).flatMap((name) => (labels[name] && err(name) ? [{ name, label: labels[name], message: err(name) as string }] : []));

  return (
    <form
      ref={formRef}
      data-quote-form
      noValidate
      onSubmit={(e) => {
        e.preventDefault();
        const data = new FormData(e.currentTarget);
        data.set("sourcePath", window.location.pathname + window.location.search);
        // Hors action de formulaire : React ne vide pas les champs, rien n'est perdu en cas d'erreur.
        startTransition(() => dispatch(data));
      }}
      className="max-w-3xl space-y-10"
    >
      <input type="hidden" name="locale" value={locale} />
      {/* Champ piège : invisible pour les humains, rempli par les robots. */}
      <div aria-hidden="true" className="absolute -start-[9999px] h-px w-px overflow-hidden">
        <label htmlFor="website">Website</label>
        <input id="website" name="website" type="text" tabIndex={-1} autoComplete="off" />
      </div>

      <div ref={statusRef} tabIndex={-1} role="alert" className="outline-none">
        {state && !state.ok && (
          <div className="border-[1.5px] border-error p-4 text-[15px]">
            <p className="font-semibold text-error">{t.failureTitle}</p>
            {failure && <p className="mt-1 text-ink-2">{failure}</p>}
            {summary.length > 0 && (
              <ul className="mt-2 list-disc space-y-1 ps-5">
                {summary.map((item) => (
                  <li key={item.name}>
                    <a href={`#${item.name}`} className="text-error underline underline-offset-4">{item.label} : {item.message}</a>
                  </li>
                ))}
              </ul>
            )}
          </div>
        )}
      </div>

      {callEnabled ? (
        <ChoiceGroup {...common} name="requestType" type="radio" required label={t.requestType} defaultValue="call" onValueChange={(v) => setRequestType(v === "quote" ? "quote" : "call")} options={[{ value: "call", label: t.requestTypeCall }, { value: "quote", label: t.requestTypeQuote }]} error={err("requestType")} />
      ) : (
        <input type="hidden" name="requestType" value="quote" />
      )}

      <fieldset className="space-y-5">
        <legend className="font-display mb-4 text-xl font-bold text-ink">{t.contactInfo}</legend>
        <div className="grid gap-5 sm:grid-cols-2">
          <TextField {...common} name="fullName" label={t.fullName} required autoComplete="name" maxLength={120} error={err("fullName")} />
          <TextField {...common} name="company" label={t.company} required autoComplete="organization" maxLength={160} error={err("company")} />
          <TextField {...common} name="email" type="email" label={t.email} required autoComplete="email" inputMode="email" maxLength={254} error={err("email")} />
          <TextField {...common} name="phone" type="tel" label={t.phone} autoComplete="tel" inputMode="tel" maxLength={40} error={err("phone")} />
        </div>
        <ChoiceGroup {...common} name="preferredLanguage" type="radio" required label={t.preferredLanguage} defaultValue={locale} options={[{ value: "fr", label: t.langFr }, { value: "en", label: t.langEn }]} error={err("preferredLanguage")} />
      </fieldset>

      <fieldset className="space-y-5">
        <legend className="font-display mb-4 text-xl font-bold text-ink">{t.project}</legend>
        {/* decision: ADR-008 — aucun forfait affiché : le champ « Forfait visé » n'existe que si un forfait est rendu visible dans Studio. */}
        {hasPackages ? (
          <SelectField {...common} name="packageCode" label={t.package} placeholder={t.choose} options={model.packages} defaultValue={presetPackage?.value} onValueChange={(code) => {
            const linked = model.packages.find((p) => p.value === code)?.serviceId;
            if (linked && options.service.some((o) => o.value === linked)) setService(linked);
          }} error={err("packageCode")} />
        ) : null}
        <SelectField {...common} name="service" label={t.service} required placeholder={t.choose} options={options.service} value={service} onValueChange={setService} error={err("service")} />
        {callEnabled ? (
          <details ref={detailsRef} className={requestType === "quote" ? "[&>summary]:hidden" : ""}>
            <summary className="inline-flex min-h-11 cursor-pointer items-center text-[15px] font-semibold text-blue underline underline-offset-4">{t.moreDetails} ({t.optional})</summary>
            <div className="mt-5"><DetailFields model={model} err={err} optionalLabel={t.optional} /></div>
          </details>
        ) : (
          <DetailFields model={model} err={err} optionalLabel={t.optional} />
        )}
        <TextArea {...common} name="description" label={t.description} required maxLength={5000} help={[model.help.description, model.help.files].filter(Boolean).join(" ")} error={err("description")} />
      </fieldset>

      <div className="space-y-5">
        <label className="flex items-start gap-3 text-[15px] text-ink-2">
          <input id="consent" type="checkbox" name="consent" required aria-invalid={err("consent") ? true : undefined} aria-describedby={err("consent") ? "consent-error" : undefined} className="mt-1 size-5 shrink-0 accent-(--bx-blue)" />
          <span>
            {t.consent}{" "}
            {model.privacyHref && <Link href={model.privacyHref} className="text-blue underline underline-offset-4">{t.privacy}</Link>}
          </span>
        </label>
        {err("consent") && <p id="consent-error" className="text-[14px] font-semibold text-error">{err("consent")}</p>}

        {siteKey && (
          <>
            <Script src="https://challenges.cloudflare.com/turnstile/v0/api.js" async defer />
            <div className="cf-turnstile" data-sitekey={siteKey} data-language={locale === "fr" ? "fr" : "en"} />
          </>
        )}

        <button type="submit" disabled={pending || !hydrated} className="inline-flex min-h-12 w-full items-center justify-center bg-blue px-6 text-[16px] font-semibold text-paper hover:bg-blue-deep disabled:opacity-60 sm:w-auto">
          {pending ? t.sending : t.submit}
        </button>
      </div>
    </form>
  );
}
