/**
 * Ajoute un administrateur du tableau de bord (liste blanche « admins »).
 *   node --env-file=.env.development.local scripts/add-admin.mjs contact@bimurix.com
 * Crée le compte s'il n'existe pas (connexion ensuite par lien magique), puis l'inscrit comme admin.
 */
import { createClient } from "@supabase/supabase-js";

const email = process.argv[2]?.trim().toLowerCase();
if (!email || !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) {
  console.error("Usage : node --env-file=.env.development.local scripts/add-admin.mjs courriel@domaine.com");
  process.exit(1);
}
const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const key = process.env.SUPABASE_SECRET_KEY;
if (!url || !key) {
  console.error("NEXT_PUBLIC_SUPABASE_URL et SUPABASE_SECRET_KEY manquants (voir scripts/db-env.mjs).");
  process.exit(1);
}

const supabase = createClient(url, key, { auth: { persistSession: false, autoRefreshToken: false } });

async function findUser() {
  for (let page = 1; page < 50; page++) {
    const { data, error } = await supabase.auth.admin.listUsers({ page, perPage: 200 });
    if (error) throw error;
    const user = data.users.find((u) => u.email?.toLowerCase() === email);
    if (user || data.users.length < 200) return user;
  }
  return undefined;
}

let user = await findUser();
if (!user) {
  const { data, error } = await supabase.auth.admin.createUser({ email, email_confirm: true });
  if (error) throw error;
  user = data.user;
}
const { error } = await supabase.from("admins").upsert({ user_id: user.id, email }, { onConflict: "user_id" });
if (error) throw error;
console.log(`Administrateur : ${email}`);
