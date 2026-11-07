-- Email delivery tracking + persistent rate limiting for the Reality Check™.
-- Existing columns (including mobile and sms_consent history) are preserved.
alter table public.reality_check_registrations
  add column if not exists confirmation_sent_at timestamptz,
  add column if not exists confirmation_error text,
  add column if not exists reminder_sent_at timestamptz,
  add column if not exists reminder_error text;

create table if not exists public.reality_check_rate_limits (
  id bigint generated always as identity primary key,
  ip_hash text not null,
  created_at timestamptz not null default now()
);

alter table public.reality_check_rate_limits enable row level security;
revoke all on public.reality_check_rate_limits from anon, authenticated;

create index if not exists reality_check_rate_limits_ip_time_idx
  on public.reality_check_rate_limits (ip_hash, created_at desc);
