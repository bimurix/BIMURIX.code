-- T5 / S-01 : garde de anonymize_quote corrigée.
-- Avant : « if not is_admin() and current_user <> 'postgres' ». Dans une fonction « security definer », current_user
-- vaut le propriétaire de la fonction (postgres) : la garde était toujours fausse, donc tout compte connecté
-- pouvait anonymiser une demande dont il connaissait l'identifiant (prouvé par tests/unit/db-security.test.ts).
-- Après : le travail est fait par une fonction interne, fermée à tous les rôles de l'API ; la fonction publique
-- exige is_admin() sans exception ; la tâche de conservation appelle la fonction interne.

create function public.anonymize_quote_internal(target uuid) returns void
language plpgsql security definer set search_path = ''
as $$
begin
  update public.quote_requests set
    full_name = 'Anonymisé',
    company = '—',
    email = 'anonymise+' || id || '@invalid.local',
    phone = null,
    description = '[contenu anonymisé]',
    source_path = null,
    ip_hash = null,
    anonymized_at = now()
  where id = target and anonymized_at is null;
  update public.quote_messages set body = '[contenu anonymisé]', subject = null
  where request_id = target and kind in ('outbound', 'inbound', 'note');
  insert into public.quote_messages (request_id, kind, body, author_id)
  values (target, 'event', 'Demande anonymisée', auth.uid());
end
$$;

revoke all on function public.anonymize_quote_internal(uuid) from public, anon, authenticated;

create or replace function public.anonymize_quote(target uuid) returns void
language plpgsql security definer set search_path = ''
as $$
begin
  if not public.is_admin() then
    raise exception 'FORBIDDEN' using errcode = '42501';
  end if;
  perform public.anonymize_quote_internal(target);
end
$$;

create or replace function public.anonymize_expired_quotes(months int default 24) returns int
language plpgsql security definer set search_path = ''
as $$
declare
  n int := 0;
  r record;
begin
  for r in
    select id from public.quote_requests
    where anonymized_at is null and coalesce(last_reply_at, created_at) < now() - make_interval(months => months)
  loop
    perform public.anonymize_quote_internal(r.id);
    n := n + 1;
  end loop;
  return n;
end
$$;
