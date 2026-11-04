import "server-only";

export type MailMessage = {
  from: { email: string; name?: string };
  to: { email: string; name?: string };
  replyTo?: string;
  subject: string;
  text: string;
  html: string;
};

export type Mailer = (message: MailMessage) => Promise<{ id: string }>;

/**
 * Envoi de courriel par fetch, sans SDK (ADR-002).
 * MAIL_TRANSPORT=mailpit : capture locale (aucun envoi réel) ; MAIL_TRANSPORT=resend : envoi réel.
 */
export function createMailer(env: NodeJS.ProcessEnv = process.env): Mailer {
  const transport = env.MAIL_TRANSPORT;
  if (transport === "mailpit") return mailpit(env.MAILPIT_URL ?? "http://127.0.0.1:54424");
  if (transport === "resend" && env.RESEND_API_KEY) return resend(env.RESEND_API_KEY);
  // Sans configuration : échec explicite plutôt qu'un envoi silencieusement perdu.
  return async () => {
    throw new Error("MAIL_TRANSPORT non configuré (mailpit en local, resend en ligne).");
  };
}

function mailpit(baseUrl: string): Mailer {
  return async (m) => {
    const res = await fetch(`${baseUrl}/api/v1/send`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        From: { Email: m.from.email, Name: m.from.name ?? "" },
        To: [{ Email: m.to.email, Name: m.to.name ?? "" }],
        ReplyTo: m.replyTo ? [{ Email: m.replyTo }] : [],
        Subject: m.subject,
        Text: m.text,
        HTML: m.html,
      }),
    });
    if (!res.ok) throw new Error(`Mailpit ${res.status}`);
    return { id: ((await res.json()) as { ID: string }).ID };
  };
}

function resend(apiKey: string): Mailer {
  return async (m) => {
    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: { Authorization: `Bearer ${apiKey}`, "Content-Type": "application/json" },
      body: JSON.stringify({
        from: m.from.name ? `${m.from.name} <${m.from.email}>` : m.from.email,
        to: [m.to.email],
        reply_to: m.replyTo,
        subject: m.subject,
        text: m.text,
        html: m.html,
      }),
    });
    if (!res.ok) throw new Error(`Resend ${res.status}`);
    return { id: ((await res.json()) as { id: string }).id };
  };
}
