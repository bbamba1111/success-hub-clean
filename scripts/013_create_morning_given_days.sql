-- GIV•EN™ (Morning Alignment) daily sessions.
-- Mirrors scripts/012_create_flex_time_days.sql: one row per member per day,
-- upserted progressively as the member moves through each step.

create table if not exists public.morning_given_days (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  day_key text not null, -- YYYY-MM-DD, local to the member
  gratitude text,
  ask text, -- Invitation + Intention
  vision_see text,
  vision_hear text,
  vision_feel text,
  vision_smell text,
  vision_taste text,
  embody text[] not null default '{}',
  nurture text[] not null default '{}',
  step_completed text not null default 'gratitude', -- last step reached
  completed_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (user_id, day_key)
);

alter table public.morning_given_days enable row level security;

drop policy if exists "morning_given_days_select_own" on public.morning_given_days;
create policy "morning_given_days_select_own"
  on public.morning_given_days for select
  using (auth.uid() = user_id);

drop policy if exists "morning_given_days_insert_own" on public.morning_given_days;
create policy "morning_given_days_insert_own"
  on public.morning_given_days for insert
  with check (auth.uid() = user_id);

drop policy if exists "morning_given_days_update_own" on public.morning_given_days;
create policy "morning_given_days_update_own"
  on public.morning_given_days for update
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

drop policy if exists "morning_given_days_delete_own" on public.morning_given_days;
create policy "morning_given_days_delete_own"
  on public.morning_given_days for delete
  using (auth.uid() = user_id);

create index if not exists morning_given_days_user_day_idx
  on public.morning_given_days (user_id, day_key);
