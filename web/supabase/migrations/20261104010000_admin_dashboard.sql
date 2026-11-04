-- Tableau de bord (L6) : journal des actions, indicateurs, anonymisation (Loi 25), conservation automatique.

-- Journal : les changements de statut et anonymisations sont tracés comme des « event ».
alter table public.quote_messages drop constraint quote_messages_kind_check;
alter table public.quote_messages add constraint quote_messages_kind_check check (kind in ('outbound', 'inbound', 'note', 'event'));

-- Indicateurs du tableau de bord ; « security invoker » : RLS s'applique (admins seulement).
create function public.admin_stats() returns json
language sql stable security invoker set search_path = ''
as $$
  select json_build_object(
    'new_7d', (select count(*) from public.quote_requests where created_at > now() - interval '7 days' and status <> 'spam'),
    'new_30d', (select count(*) from public.quote_requests where created_at > now() - interval '30 days' and status <> 'spam'),
    'awaiting', (select count(*) from public.quote_requests where status in ('new', 'in_review') and anonymized_at is null),
    'avg_first_reply_hours', (
      select round(avg(extract(epoch from (m.first_reply - r.created_at)) / 3600)::numeric, 1)
      from public.quote_requests r
      join (select request_id, min(created_at) as first_reply from public.quote_messages where kind = 'outbound' group by request_id) m
        on m.request_id = r.id
      where r.created_at > now() - interval '90 days'
    ),
    'by_service', (
      select coalesce(json_object_agg(service, n), '{}'::json)
      from (select service, count(*) as n from public.quote_requests where created_at > now() - interval '90 days' and status <> 'spam' group by service) s
    )
  )
$$;

revoke all on function public.admin_stats() from public;
grant execute on function public.admin_stats() to authenticated;

-- Anonymisation d'une demande : données personnelles effacées, statistiques conservées.
-- « security definer » pour réécrire aussi les échanges ; l'appelant doit être admin.
create function public.anonymize_quote(target uuid) returns void
language plpgsql security definer set search_path = ''
as $$
begin
  if not public.is_admin() and current_user <> 'postgres' then
    raise exception 'FORBIDDEN' using errcode = '42501';
  end if;
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

revoke all on function public.anonymize_quote(uuid) from public;
grant execute on function public.anonymize_quote(uuid) to authenticated;

-- Conservation (Loi 25) : anonymisation des demandes sans échange depuis 24 mois (politique de confidentialité).
create function public.anonymize_expired_quotes(months int default 24) returns int
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
    perform public.anonymize_quote(r.id);
    n := n + 1;
  end loop;
  return n;
end
$$;

revoke all on function public.anonymize_expired_quotes(int) from public;

create extension if not exists pg_cron;
select cron.schedule('bimurix-anonymize-expired', '15 3 * * *', $$select public.anonymize_expired_quotes(24)$$);
