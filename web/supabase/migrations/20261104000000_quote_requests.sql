-- Demandes de soumission, échanges et administrateurs (PLAN.md §5, ADR-001).
-- Règle : aucune lecture ni écriture publique. Le site insère avec la clé serveur ;
-- seuls les comptes de la table admins lisent et modifient (RLS).

create type public.quote_status as enum ('new', 'in_review', 'replied', 'won', 'lost', 'archived', 'spam');

create table public.quote_requests (
  id uuid primary key default gen_random_uuid(),
  reference text not null unique,
  created_at timestamptz not null default now(),
  locale text not null check (locale in ('fr', 'en')),
  full_name text not null check (char_length(full_name) between 2 and 120),
  company text not null check (char_length(company) between 1 and 160),
  email text not null check (char_length(email) between 3 and 254),
  phone text check (char_length(phone) <= 40),
  preferred_language text not null check (preferred_language in ('fr', 'en')),
  service text not null check (char_length(service) <= 80),
  project_type text check (char_length(project_type) <= 80),
  region text check (char_length(region) <= 80),
  phase text check (char_length(phase) <= 80),
  timeline text check (char_length(timeline) <= 80),
  budget_range text check (char_length(budget_range) <= 80),
  software_formats text[] not null default '{}' check (cardinality(software_formats) <= 12),
  description text not null check (char_length(description) between 10 and 5000),
  -- Loi 25 : consentement horodaté et version de la politique acceptée.
  consent_at timestamptz not null,
  consent_policy_version text not null,
  status public.quote_status not null default 'new',
  source_path text check (char_length(source_path) <= 300),
  -- Adresse IP jamais stockée en clair : hachage salé, pour limiter les envois répétés.
  ip_hash text,
  notification_sent_at timestamptz,
  ack_email_sent_at timestamptz,
  last_reply_at timestamptz,
  -- Anonymisation (Loi 25) : les données personnelles sont effacées, la ligne reste pour les statistiques.
  anonymized_at timestamptz
);

create index quote_requests_created_at_idx on public.quote_requests (created_at desc);
create index quote_requests_status_idx on public.quote_requests (status);
create index quote_requests_ip_recent_idx on public.quote_requests (ip_hash, created_at);

create table public.quote_messages (
  id uuid primary key default gen_random_uuid(),
  request_id uuid not null references public.quote_requests (id) on delete restrict,
  kind text not null check (kind in ('outbound', 'inbound', 'note')),
  subject text check (char_length(subject) <= 300),
  body text not null check (char_length(body) between 1 and 20000),
  created_at timestamptz not null default now(),
  author_id uuid references auth.users (id),
  provider_message_id text
);

create index quote_messages_request_idx on public.quote_messages (request_id, created_at);

create table public.admins (
  user_id uuid primary key references auth.users (id) on delete cascade,
  email text not null unique,
  created_at timestamptz not null default now()
);

-- Vrai si l'utilisateur connecté est dans la liste blanche des administrateurs.
create function public.is_admin() returns boolean
language sql stable security definer set search_path = ''
as $$ select exists (select 1 from public.admins where user_id = (select auth.uid())) $$;

revoke all on function public.is_admin() from public;
grant execute on function public.is_admin() to authenticated;

alter table public.quote_requests enable row level security;
alter table public.quote_messages enable row level security;
alter table public.admins enable row level security;

-- Aucun droit pour les visiteurs anonymes, même pas l'insertion (elle passe par le serveur).
revoke all on public.quote_requests, public.quote_messages, public.admins from anon;
revoke all on public.quote_requests, public.quote_messages, public.admins from authenticated;
grant select, update on public.quote_requests to authenticated;
grant select, insert on public.quote_messages to authenticated;
grant select on public.admins to authenticated;

create policy "admins lisent les demandes" on public.quote_requests
  for select to authenticated using ((select public.is_admin()));
create policy "admins modifient les demandes" on public.quote_requests
  for update to authenticated using ((select public.is_admin())) with check ((select public.is_admin()));

create policy "admins lisent les échanges" on public.quote_messages
  for select to authenticated using ((select public.is_admin()));
create policy "admins ajoutent des échanges" on public.quote_messages
  for insert to authenticated with check ((select public.is_admin()) and author_id = (select auth.uid()));

create policy "un admin voit sa propre ligne" on public.admins
  for select to authenticated using (user_id = (select auth.uid()));
