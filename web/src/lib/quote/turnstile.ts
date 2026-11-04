import "server-only";

/**
 * Vérifie le jeton Cloudflare Turnstile côté serveur.
 * Fail-closed : sans clé secrète configurée ou en cas d'erreur réseau, la demande est refusée.
 */
export async function verifyTurnstile(token: string | undefined, ip: string | undefined, secret = process.env.TURNSTILE_SECRET_KEY): Promise<boolean> {
  if (!secret) {
    console.error("[turnstile] TURNSTILE_SECRET_KEY manquant : demande refusée.");
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
