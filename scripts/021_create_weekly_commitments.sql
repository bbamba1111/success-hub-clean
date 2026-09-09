-- ============================================================================
-- Weekly Work-Life Balance Commitments™ — the three changes a founder chooses
-- in Decide & Design™ and carries Monday–Thursday.
-- ----------------------------------------------------------------------------
-- ONE row per founder per WLBB week (week_key = Monday date). Upserted on
-- (user_id, week_key) so the same record is read every day of the week and a
-- second visit to Decide & Design never creates a duplicate.
--
-- This deliberately does NOT reference ceo_workday_plans — the priorities are
-- not a task list, and the CEO Workday™ remains its own protected container.
-- Mirrors ceo_workday_plans conventions: RLS on auth.uid() = user_id,
-- updated_at trigger, additive + idempotent.
-- ============================================================================

create table if not exists public.weekly_commitments (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  week_key text not null,

  -- Priority 1 · Weekly Life Priority™
  life_priority text,
  life_priority_option_id text,
  life_windows text[] not null default '{}',
  life_intention text,
  life_intention_variant smallint not null default 0,
  life_intention_edited boolean not null default false,
  life_status text not null default 'not-planned'
    check (life_status in ('not-planned','planned','in-progress','experienced','deferred','changed')),
  boundary_audiences text[] not null default '{}',
  boundary_draft text,
  boundary_draft_edited boolean not null default false,

  -- Priority 2 · Weekly Delegation Priority™
  delegation_priority text,
  delegation_option_id text,
  delegation_intention text,
  delegation_intention_variant smallint not null default 0,
  delegation_intention_edited boolean not null default false,
  delegation_status text not null default 'not-started'
    check (delegation_status in ('not-started','in-progress','delegated','completed','deferred','no-longer-needed')),

  -- Priority 3 · Weekly Operating Rule Priority™
  operating_rule text,
  operating_rule_option_id text,
  operating_rule_intention text,
  operating_rule_intention_variant smallint not null default 0,
  operating_rule_intention_edited boolean not null default false,
  operating_rule_status text not null default 'not-started'
    check (operating_rule_status in ('not-started','in-progress','implemented','needs-adjustment','deferred','no-longer-needed')),

  designed_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),

  constraint weekly_commitments_user_week_unique unique (user_id, week_key)
);

create index if not exists weekly_commitments_user_week_idx
  on public.weekly_commitments (user_id, week_key desc);

alter table public.weekly_commitments enable row level security;

drop policy if exists "weekly_commitments_select_own" on public.weekly_commitments;
create policy "weekly_commitments_select_own" on public.weekly_commitments
  for select using (auth.uid() = user_id);

drop policy if exists "weekly_commitments_insert_own" on public.weekly_commitments;
create policy "weekly_commitments_insert_own" on public.weekly_commitments
  for insert with check (auth.uid() = user_id);

drop policy if exists "weekly_commitments_update_own" on public.weekly_commitments;
create policy "weekly_commitments_update_own" on public.weekly_commitments
  for update using (auth.uid() = user_id) with check (auth.uid() = user_id);

drop policy if exists "weekly_commitments_delete_own" on public.weekly_commitments;
create policy "weekly_commitments_delete_own" on public.weekly_commitments
  for delete using (auth.uid() = user_id);

-- updated_at trigger (reuses the shared helper if present; defines it otherwise)
create or replace function public.set_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end $$;

drop trigger if exists weekly_commitments_set_updated_at on public.weekly_commitments;
create trigger weekly_commitments_set_updated_at
  before update on public.weekly_commitments
  for each row execute function public.set_updated_at();
