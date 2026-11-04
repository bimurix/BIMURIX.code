import Link from "next/link";
import { Suspense } from "react";
import { signOut } from "@/lib/admin/actions";
import { requireAdmin } from "@/lib/admin/auth";

// Session admin lue à chaque requête : rendu bloquant assumé (Cache Components).
export const instant = false;

/** Zone protégée : tout ce qui est sous ce dossier exige un administrateur (vérifié à chaque requête). */
export default function AdminAppLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-dvh">
      <header className="border-b border-ink bg-paper">
        <div className="mx-auto flex h-14 max-w-7xl items-center gap-6 px-4 sm:px-6">
          <Link href="/admin" className="font-display text-xl font-extrabold text-blue" style={{ fontVariationSettings: '"wdth" 125' }}>
            bimurix
          </Link>
          <nav aria-label="Tableau de bord" className="flex items-center gap-4 text-[14px]">
            <Link href="/admin" className="font-semibold text-ink hover:text-blue">Demandes</Link>
            {/* Studio et site public ont leur propre racine : navigation complète voulue (pas de <Link>). */}
            {/* eslint-disable-next-line @next/next/no-html-link-for-pages */}
            <a href="/studio" className="text-ink-2 hover:text-blue">Contenu (Studio)</a>
            {/* eslint-disable-next-line @next/next/no-html-link-for-pages */}
            <a href="/" className="text-ink-2 hover:text-blue">Voir le site</a>
          </nav>
          <div className="ms-auto flex items-center gap-3 text-[13px] text-ink-2">
            <Suspense fallback={null}>
              <AdminEmail />
            </Suspense>
            <form action={signOut}>
              <button type="submit" className="min-h-10 px-2 font-semibold text-ink underline-offset-4 hover:underline">Déconnexion</button>
            </form>
          </div>
        </div>
      </header>
      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6">
        <Suspense fallback={<p className="text-[15px] text-ink-2">Chargement…</p>}>{children}</Suspense>
      </main>
    </div>
  );
}

// Lit la session dans sa propre zone <Suspense> : l'en-tête s'affiche sans attendre.
async function AdminEmail() {
  const { email } = await requireAdmin();
  return <span className="hidden sm:inline">{email}</span>;
}
