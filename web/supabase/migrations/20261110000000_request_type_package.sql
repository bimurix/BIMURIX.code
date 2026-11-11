-- N5 (ADR-006 n° 7) : type de demande (appel de 20 minutes ou soumission) et forfait visé.
-- Ce ne sont pas des renseignements personnels : anonymize_quote() n'y touche pas, et RLS/droits sont inchangés
-- (les droits de table couvrent les nouvelles colonnes).

alter table public.quote_requests
  add column request_type text not null default 'quote' check (request_type in ('call', 'quote')),
  -- Code du forfait publié dans Sanity (ex. « F-01 ») ou « other » ; nul si aucun forfait n'est visé.
  add column package_code text check (char_length(package_code) between 1 and 20);

create index quote_requests_request_type_idx on public.quote_requests (request_type);
