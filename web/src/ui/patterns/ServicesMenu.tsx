"use client";

import Link from "next/link";
import { useEffect, useId, useRef, useState } from "react";
import { NetworkSwatch } from "@/ui/components/NetworkSwatch";
import type { NavService } from "./nav-model";

// Sous-menu « Services » (bureau) : s'ouvre au clic, se ferme avec Échap ou un clic à l'extérieur.
export function ServicesMenu({ label, services }: { label: string; services: NavService[] }) {
  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);
  const panelId = useId();

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    const onClick = (e: MouseEvent) => !rootRef.current?.contains(e.target as Node) && setOpen(false);
    document.addEventListener("keydown", onKey);
    document.addEventListener("mousedown", onClick);
    return () => {
      document.removeEventListener("keydown", onKey);
      document.removeEventListener("mousedown", onClick);
    };
  }, [open]);

  return (
    <div ref={rootRef} className="relative">
      <button
        type="button"
        aria-expanded={open}
        aria-controls={panelId}
        onClick={() => setOpen((v) => !v)}
        className="inline-flex min-h-(--bx-tap-min) items-center gap-1.5 px-1 text-[15px] text-ink hover:text-blue"
      >
        {label}
        <svg aria-hidden="true" viewBox="0 0 10 6" width="10" height="6" className={`transition-transform ${open ? "rotate-180" : ""}`}>
          <path d="M1 1l4 4 4-4" fill="none" stroke="currentColor" strokeWidth="1.5" />
        </svg>
      </button>
      <div id={panelId} hidden={!open} className="absolute start-0 top-full z-30 mt-px w-[22rem] border border-ink bg-paper shadow-[0_18px_40px_-24px_rgb(15_23_42/0.45)]">
        <ul className="divide-y divide-rule">
          {services.map((s) => (
            <li key={s.id}>
              <Link href={s.href} onClick={() => setOpen(false)} className="flex items-center gap-3 px-4 py-3 text-[15px] hover:bg-paper-2">
                <NetworkSwatch network={s.network} />
                <span className="font-mono text-xs text-ink-2">{s.code}</span>
                <span className="text-ink">{s.label}</span>
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
