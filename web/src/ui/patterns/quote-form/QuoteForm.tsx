"use client";

import Link from "next/link";
import Script from "next/script";
import { useSearchParams } from "next/navigation";
import { startTransition, useActionState, useEffect, useRef } from "react";
import type { Locale } from "@/lib/i18n/locales";
import { submitQuoteAction } from "@/lib/quote/actions";
import type { SubmitResult } from "@/lib/quote/schema";
import { ChoiceGroup, SelectField, TextArea, TextField } from "./fields";
import type { FormModel } from "./form-model";

declare global {
  interface Window { turnstile?: { reset: (el?: HTMLElement | string) => void } }
}

type Props = { model: FormModel; locale: Locale; siteKey?: string };

/** Formulaire de soumission (îlot client). Le succès ne s'affiche qu'après l'enregistrement réel en base. */
export function QuoteForm({ model, locale, siteKey }: Props) {
  const { t, options } = model;
  const [state, dispatch, pending] = useActionState<SubmitResult | null, FormData>(submitQuoteAction, null);
  const params = useSearchParams();
  const formRef = useRef<HTMLFormElement>(null);
  const statusRef = useRef<HTMLDivElement>(null);
  const preset = params.get("service") ?? undefined;
  const fields = state && !state.ok ? (state.fields ?? {}) : {};

  // Après une réponse : jeton antispam renouvelé (usage unique) et message annoncé aux lecteurs d'écran.
  useEffect(() => {
    if (!state) return;
    if (!state.ok) window.turnstile?.reset();
    statusRef.current?.focus();
  }, [state]);

  if (state?.ok) {
    return (
      <div ref={statusRef} tabIndex={-1} role="status" className="max-w-3xl border-[1.5px] border-success p-6 outline-none sm:p-8">
        <h2 className="font-display text-2xl font-bold text-ink">{t.successTitle}</h2>
        <p className="mt-3 text-[17px] leading-relaxed text-ink-2">{t.successBody}</p>
        <p className="mt-4 font-mono text-[14px] text-ink">{t.reference} : <strong>{state.reference}</strong></p>
      </div>
    );
  }

  const err = (name: keyof NonNullable<typeof fields>) => {
    const e = fields[name];
    if (!e) return undefined;
    if (e === "required") return t.required;
    return name === "email" ? t.invalidEmail : t.invalid;
  };
  const failure = state && !state.ok && state.code !== "VALIDATION_FAILED"
    ? state.code === "RATE_LIMITED" ? t.rateLimited : state.code === "CAPTCHA_FAILED" ? t.captcha : t.failureBody
    : null;
  const common = { optionalLabel: t.optional };

  return (
    <form
      ref={formRef}
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
          </div>
        )}
      </div>

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
        <SelectField {...common} name="service" label={t.service} required placeholder={t.choose} options={options.service} defaultValue={options.service.some((o) => o.value === preset) ? preset : undefined} error={err("service")} />
        <div className="grid gap-5 sm:grid-cols-2">
          <SelectField {...common} name="projectType" label={t.projectType} placeholder={t.choose} options={options.projectType} error={err("projectType")} />
          <SelectField {...common} name="region" label={t.region} placeholder={t.choose} options={options.region} error={err("region")} />
          <SelectField {...common} name="phase" label={t.phase} placeholder={t.choose} options={options.phase} error={err("phase")} />
          <SelectField {...common} name="timeline" label={t.timeline} placeholder={t.choose} options={options.timeline} error={err("timeline")} />
          <SelectField {...common} name="budget" label={t.budget} placeholder={t.choose} options={options.budget} error={err("budget")} />
        </div>
        <ChoiceGroup {...common} name="software" type="checkbox" label={t.software} options={options.software} error={err("software")} />
        <TextArea {...common} name="description" label={t.description} required maxLength={5000} help={[model.help.description, model.help.files].filter(Boolean).join(" ")} error={err("description")} />
      </fieldset>

      <div className="space-y-5">
        <label className="flex items-start gap-3 text-[15px] text-ink-2">
          <input type="checkbox" name="consent" required aria-invalid={err("consent") ? true : undefined} aria-describedby={err("consent") ? "consent-error" : undefined} className="mt-1 size-5 shrink-0 accent-(--bx-blue)" />
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

        <button type="submit" disabled={pending} className="inline-flex min-h-12 w-full items-center justify-center bg-blue px-6 text-[16px] font-semibold text-paper hover:bg-blue-deep disabled:opacity-60 sm:w-auto">
          {pending ? t.sending : t.submit}
        </button>
      </div>
    </form>
  );
}
