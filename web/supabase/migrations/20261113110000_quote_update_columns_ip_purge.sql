-- T5 / S-10 : un administrateur ne réécrit plus le consentement, le courriel ou le reste d'une demande :
-- seules les colonnes « status » et « last_reply_at » sont modifiables par l'API (le tableau de bord n'en modifie pas d'autres).
revoke update on public.quote_requests from authenticated;
grant update (status, last_reply_at) on public.quote_requests to authenticated;

-- T5 / S-21 : l'empreinte d'IP ne sert qu'à limiter les envois répétés ; purgée après 30 jours
-- (la demande elle-même reste jusqu'à l'anonymisation à 24 mois).
create function public.purge_old_ip_hashes() returns int
language plpgsql security definer set search_path = ''
as $$
declare n int;
begin
  update public.quote_requests set ip_hash = null where ip_hash is not null and created_at < now() - interval '30 days';
  get diagnostics n = row_count;
  return n;
end
$$;

revoke all on function public.purge_old_ip_hashes() from public, anon, authenticated;

select cron.schedule('bimurix-purge-ip-hashes', '30 3 * * *', $$select public.purge_old_ip_hashes()$$);
