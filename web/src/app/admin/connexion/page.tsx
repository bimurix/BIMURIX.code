import { LoginForm } from "@/ui/admin/LoginForm";

// Lit ?erreur= à la requête : page bloquante assumée (pas de coquille statique utile ici).
export const instant = false;

export default async function LoginPage({ searchParams }: PageProps<"/admin/connexion">) {
  const { erreur } = await searchParams;
  return (
    <main className="flex min-h-dvh items-center justify-center px-4">
      <div className="w-full max-w-md border-[1.5px] border-ink bg-paper p-8">
        <p className="font-display text-2xl font-extrabold text-blue" style={{ fontVariationSettings: '"wdth" 125' }}>bimurix</p>
        <h1 className="font-display mt-6 text-2xl font-bold text-ink">Tableau de bord</h1>
        <p className="mt-2 text-[15px] text-ink-2">Entrez votre courriel : vous recevrez un lien de connexion à usage unique.</p>
        {erreur && <p role="alert" className="mt-4 text-[14px] font-semibold text-error">Ce lien n&apos;est plus valide. Demandez-en un nouveau.</p>}
        <LoginForm />
      </div>
    </main>
  );
}
