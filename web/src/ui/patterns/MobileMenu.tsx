"use client";

import Link from "next/link";
import { useCallback, useEffect, useRef, useState } from "react";
import type { Locale } from "@/lib/i18n/locales";
import { NetworkSwatch } from "@/ui/components/NetworkSwatch";
import { LanguageSwitch } from "./LanguageSwitch";
import type { NavModel } from "./nav-model";

/**
 * Menu mobile en panneau plein écran (<dialog> : focus piégé, Échap ferme).
 * Le bouton retour Android ferme le panneau au lieu de quitter la page (CLAUDE.md §5).
 */
export function MobileMenu({ model, locale }: { model: NavModel; locale: Locale }) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const [open, setOpen] = useState(false);

  // Toute fermeture passe par l'événement « close » du dialog (bouton, Échap, retour, lien).
  const close = useCallback(() => dialogRef.current?.close(), []);

  useEffect(() => {
    if (!open) return;
    history.pushState({ bxMenu: true }, "");
    window.addEventListener("popstate", close);
    return () => window.removeEventListener("popstate", close);
  }, [open, close]);

  // Fermé sans le bouton retour : on retire l'entrée d'historique ajoutée à l'ouverture.
  const onDialogClose = () => {
    setOpen(false);
    if (history.state?.bxMenu) history.back();
  };

  // Un lien navigue lui-même : on neutralise l'entrée au lieu de revenir en arrière.
  const closeFromLink = () => {
    if (history.state?.bxMenu) history.replaceState(null, "");
    close();
  };

  return (
    <>
      <button
        type="button"
        aria-haspopup="dialog"
        onClick={() => {
          dialogRef.current?.showModal();
          setOpen(true);
        }}
        className="inline-flex min-h-(--bx-tap-min) items-center px-3 text-[15px] font-semibold text-ink shadow-[inset_0_0_0_1.5px_var(--bx-ink)] lg:hidden"
      >
        {model.menuLabel}
      </button>
      <dialog
        ref={dialogRef}
        onClose={onDialogClose}
        className="m-0 h-dvh max-h-none w-full max-w-none bg-paper p-0 backdrop:bg-ink/40 lg:hidden"
      >
        <div className="flex h-full flex-col">
          <div className="flex h-(--bx-header-h) items-center justify-end border-b border-ink px-4">
            <button type="button" onClick={close} className="inline-flex min-h-(--bx-tap-min) items-center px-3 text-[15px] font-semibold text-ink">
              {model.closeLabel}
            </button>
          </div>
          <nav className="flex-1 overflow-y-auto px-4 py-6">
            <ul className="space-y-1">
              {model.items.map((item) => (
                <li key={item.key}>
                  {item.href && (
                    <Link href={item.href} onClick={closeFromLink} className="font-display flex min-h-12 items-center text-2xl font-bold">
                      {item.label}
                    </Link>
                  )}
                  {!item.href && <p className="font-display flex min-h-12 items-center text-2xl font-bold">{item.label}</p>}
                  {item.services && (
                    <ul className="mb-4 border-s border-rule ps-4">
                      {item.services.map((s) => (
                        <li key={s.id}>
                          <Link href={s.href} onClick={closeFromLink} className="flex min-h-12 items-center gap-3 text-[16px]">
                            <NetworkSwatch network={s.network} />
                            <span className="w-11 shrink-0 font-mono text-xs text-ink-2">{s.code}</span>
                            <span>{s.label}</span>
                          </Link>
                        </li>
                      ))}
                    </ul>
                  )}
                </li>
              ))}
            </ul>
          </nav>
          <div className="space-y-3 border-t border-ink p-4">
            {model.cta && (
              <Link href={model.cta.href} onClick={closeFromLink} className="flex min-h-12 w-full items-center justify-center bg-blue px-5 font-semibold text-paper">
                {model.cta.label}
              </Link>
            )}
            <LanguageSwitch locale={locale} label={model.languageLabel} pairs={model.languagePairs} onNavigate={closeFromLink} className="flex min-h-12 items-center justify-center text-[15px] underline underline-offset-4" />
          </div>
        </div>
      </dialog>
    </>
  );
}
