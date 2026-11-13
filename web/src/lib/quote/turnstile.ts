import "server-only";

// S-13 : clés de test publiées par Cloudflare (1x… accepte tout, 2x… refuse tout, 3x… jeton déjà utilisé).
// En ligne (Netlify), une clé de test rendrait l'antispam inopérant : demande refusée et alerte.
export function isTestTurnstileSecret(secret: string): boolean {
  return /^[123]x0{20,}[A-Za-z]{0,4}$/.test(secret);
}

/**
 * Vérifie le jeton Cloudflare Turnstile côté serveur.
 * Fail-closed : sans clé secrète configurée ou en cas d'erreur réseau, la demande est refusée.
 */
export async function verifyTurnstile(token: string | undefined, ip: string | undefined, secret = process.env.TURNSTILE_SECRET_KEY, env: NodeJS.ProcessEnv = process.env): Promise<boolean> {
  if (!secret) {
    console.error("[turnstile] TURNSTILE_SECRET_KEY manquant : demande refusée.");
    return false;
  }
  if (env.NETLIFY && isTestTurnstileSecret(secret)) {
    console.error("[turnstile] ALERTE : clé de test en ligne, demande refusée.");
    return false;
  }
  if (!token) return false;
  try {
    const body = new URLSearchParams({ secret, response: token });
    if (ip) body.set("remoteip", ip);
    const res = await fetch("https://challenges.cloudflare.com/turnstile/v0/siteverify", { method: "POST", body });
    const data = (await res.json()) as { success?: boolean };
    return data.success === true;
  } catch (error) {
    console.error(`[turnstile] vérification impossible : ${(error as Error).message}`);
    return false;
  }
}
