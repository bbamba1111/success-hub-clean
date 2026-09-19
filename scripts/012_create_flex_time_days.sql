-- Flex Time & Preparation™ accountability: one row per member per day, holding
-- the actual activity text the member declared/completed/left outstanding, plus
-- how any outstanding item was resolved (borrowed from another segment, or
-- deferred to tomorrow's Flex Time™). Applied directly via the Supabase MCP;
-- this file mirrors that change for the repo history.

create table if not exists public.flex_time_days (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  day_key text not null, -- e.g. "2026-08-10"
  intended jsonb not null default '[]'::jsonb,
  completed jsonb not null default '[]'::jsonb,
  outstanding jsonb not null default '[]'::jsonb,
  resolution text, -- 'complete' | 'borrowed' | 'deferred'
  borrowed_from text, -- 'morning-given' | 'healthy-hybrid-lunch'
  borrowed_items jsonb not null default '[]'::jsonb,
  deferred_items jsonb not null default '[]'::jsonb,
  checked_in_at timestamp with time zone,
  created_at timestamp with time zone not null default now(),
  updated_at timestamp with time zone not null default now(),
  unique (user_id, day_key)
);

alter table public.flex_time_days enable row level security;

drop policy if exists "flex_time_days_select_own" on public.flex_time_days;
drop policy if exists "flex_time_days_insert_own" on public.flex_time_days;
drop policy if exists "flex_time_days_update_own" on public.flex_time_days;
drop policy if exists "flex_time_days_delete_own" on public.flex_time_days;

create policy "flex_time_days_select_own" on public.flex_time_days for select using (auth.uid() = user_id);
create policy "flex_time_days_insert_own" on public.flex_time_days for insert with check (auth.uid() = user_id);
create policy "flex_time_days_update_own" on public.flex_time_days for update using (auth.uid() = user_id);
create policy "flex_time_days_delete_own" on public.flex_time_days for delete using (auth.uid() = user_id);

create index if not exists flex_time_days_user_day_idx on public.flex_time_days (user_id, day_key desc);
