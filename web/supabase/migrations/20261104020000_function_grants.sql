-- Droits d'exécution des fonctions (audit phase M, conseiller sécurité Supabase 0028/0029).
-- Supabase accorde par défaut EXECUTE à anon et authenticated sur toute fonction de « public » :
-- le « revoke ... from public » des migrations précédentes ne suffit pas. Sans ce correctif, un visiteur
-- anonyme pouvait appeler /rest/v1/rpc/anonymize_expired_quotes avec months = 0 et tout anonymiser.

revoke execute on function public.is_admin() from anon;
revoke execute on function public.admin_stats() from anon;
revoke execute on function public.anonymize_quote(uuid) from anon;

-- Réservée à la tâche planifiée pg_cron (rôle postgres) : personne ne l'appelle par l'API.
revoke execute on function public.anonymize_expired_quotes(int) from anon, authenticated;

-- Les fonctions créées plus tard dans « public » ne seront plus ouvertes aux visiteurs par défaut.
alter default privileges in schema public revoke execute on functions from anon;
