-- Weekly Work-Life Balance Reality Check™ seat registrations.
-- Writes go through a server action using the service role; no public access.
create table if not exists public.reality_check_registrations (
  id uuid primary key default gen_random_uuid(),
  full_name text not null check (char_length(full_name) between 1 and 120),
  email text not null check (char_length(email) between 3 and 254),
  mobile text check (mobile is null or char_length(mobile) between 7 and 25),
  sms_consent boolean not null default false,
  session_date date not null,
  source text not null default 'landing-holiday',
  created_at timestamptz not null default now(),
  unique (email, session_date)
);

alter table public.reality_check_registrations enable row level security;

revoke all on public.reality_check_registrations from anon, authenticated;

create index if not exists reality_check_registrations_session_idx
  on public.reality_check_registrations (session_date);
