-- T5 / S-05 : limite d'envois du lien de connexion de /admin (par empreinte d'IP, plus un plafond global).
-- Table écrite et lue par le serveur seulement (clé secrète) : RLS actif, aucun droit pour anon ni authenticated.
create table public.admin_login_attempts (
  id bigint generated always as identity primary key,
  ip_hash text,
  created_at timestamptz not null default now()
);
create index admin_login_attempts_recent_idx on public.admin_login_attempts (created_at, ip_hash);

alter table public.admin_login_attempts enable row level security;
revoke all on public.admin_login_attempts from anon, authenticated;

-- Ce ne sont pas des demandes de clients : les tentatives de plus d'un jour sont simplement supprimées.
create function public.purge_login_attempts() returns int
language plpgsql security definer set search_path = ''
as $$
declare n int;
begin
  delete from public.admin_login_attempts where created_at < now() - interval '1 day';
  get diagnostics n = row_count;
  return n;
end
$$;

revoke all on function public.purge_login_attempts() from public, anon, authenticated;
select cron.schedule('bimurix-purge-login-attempts', '45 3 * * *', $$select public.purge_login_attempts()$$);
