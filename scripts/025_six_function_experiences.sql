-- Six Function Execution Architecture — additive migration.
-- Adds the sixth business function (Workshops, Webinars & Trust-Building
-- Experiences), the experience series / occurrence tables and two nullable
-- columns on plan items. No existing row is rewritten.

begin;

-- 1. Allow the new function value in the three existing check constraints.
alter table public.ceo_workday_plan_items drop constraint if exists ceo_workday_plan_items_business_function_check;
alter table public.ceo_workday_plan_items add constraint ceo_workday_plan_items_business_function_check
  check (business_function = any (array[
    'client-attraction','sales-conversion','delivery','operations','operations-design','trust-experiences',
    'build','decide','own','delegate','systemize','augment-automate-ai','connect','communicate','sell','market','deliver','solve'
  ]::text[]));

alter table public.boss_jobs drop constraint if exists boss_jobs_business_function_check;
alter table public.boss_jobs add constraint boss_jobs_business_function_check
  check (business_function = any (array['attraction','sales','delivery','operations','design','experiences']::text[]));

alter table public.boss_team_members drop constraint if exists boss_team_members_business_functions_check;
alter table public.boss_team_members add constraint boss_team_members_business_functions_check
  check (business_functions <@ array['attraction','sales','delivery','operations','design','experiences']::text[]);

-- 2. Experience series (founder-owned, defines the cadence).
create table if not exists public.boss_experience_series (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  template_key text not null check (template_key in ('monday-redesigned','reality-check','weekly-workshop','masterclass')),
  name text not null check (char_length(name) between 1 and 200),
  cadence text not null default 'weekly' check (cadence in ('weekly','one-off')),
  weekday smallint check (weekday between 0 and 6),
  local_start_time time,
  duration_minutes integer not null default 60 check (duration_minutes between 15 and 480),
  conversion_offer text check (char_length(conversion_offer) <= 300),
  status text not null default 'active' check (status in ('active','paused','ended')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create index if not exists boss_experience_series_user_idx on public.boss_experience_series(user_id);

-- 3. Experience occurrences (one dated instance with its own results).
create table if not exists public.boss_experience_occurrences (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  series_id uuid references public.boss_experience_series(id) on delete set null,
  template_key text not null check (template_key in ('monday-redesigned','reality-check','weekly-workshop','masterclass')),
  occurrence_date date not null,
  starts_at timestamptz,
  duration_minutes integer not null default 60 check (duration_minutes between 15 and 480),
  workday_overlap text not null default 'none' check (workday_overlap in ('none','approved-exception')),
  status text not null default 'planned' check (status in ('planned','held','cancelled')),
  registration_url text check (char_length(registration_url) <= 500),
  registrations integer check (registrations >= 0),
  attended integer check (attended >= 0),
  no_shows integer check (no_shows >= 0),
  follow_up_status text not null default 'not-started' check (follow_up_status in ('not-started','drafted','founder-reported-sent','verified-sent')),
  conversions integer check (conversions >= 0),
  review_notes text check (char_length(review_notes) <= 4000),
  chosen_improvement text check (char_length(chosen_improvement) <= 1000),
  dismissed_option_keys text[] not null default '{}',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (series_id, occurrence_date)
);
create index if not exists boss_experience_occurrences_user_date_idx on public.boss_experience_occurrences(user_id, occurrence_date);

-- 4. Owner-only RLS (same four policies as boss_readiness_answers).
alter table public.boss_experience_series enable row level security;
alter table public.boss_experience_occurrences enable row level security;

drop policy if exists exp_series_select_own on public.boss_experience_series;
drop policy if exists exp_series_insert_own on public.boss_experience_series;
drop policy if exists exp_series_update_own on public.boss_experience_series;
drop policy if exists exp_series_delete_own on public.boss_experience_series;
create policy exp_series_select_own on public.boss_experience_series for select using (user_id = auth.uid());
create policy exp_series_insert_own on public.boss_experience_series for insert with check (user_id = auth.uid());
create policy exp_series_update_own on public.boss_experience_series for update using (user_id = auth.uid()) with check (user_id = auth.uid());
create policy exp_series_delete_own on public.boss_experience_series for delete using (user_id = auth.uid());

drop policy if exists exp_occ_select_own on public.boss_experience_occurrences;
drop policy if exists exp_occ_insert_own on public.boss_experience_occurrences;
drop policy if exists exp_occ_update_own on public.boss_experience_occurrences;
drop policy if exists exp_occ_delete_own on public.boss_experience_occurrences;
create policy exp_occ_select_own on public.boss_experience_occurrences for select using (user_id = auth.uid());
create policy exp_occ_insert_own on public.boss_experience_occurrences for insert with check (
  user_id = auth.uid()
  and (series_id is null or exists (select 1 from public.boss_experience_series s where s.id = series_id and s.user_id = auth.uid()))
);
create policy exp_occ_update_own on public.boss_experience_occurrences for update using (user_id = auth.uid()) with check (
  user_id = auth.uid()
  and (series_id is null or exists (select 1 from public.boss_experience_series s where s.id = series_id and s.user_id = auth.uid()))
);
create policy exp_occ_delete_own on public.boss_experience_occurrences for delete using (user_id = auth.uid());

-- 5. Assignment links on plan items.
alter table public.ceo_workday_plan_items
  add column if not exists experience_occurrence_id uuid references public.boss_experience_occurrences(id) on delete set null,
  add column if not exists completion_basis text check (completion_basis in ('internal','founder-reported','system-verified'));
create index if not exists ceo_workday_plan_items_occurrence_idx on public.ceo_workday_plan_items(experience_occurrence_id);

-- The occurrence a plan item links to must belong to the same founder.
create or replace function public.ceo_plan_item_occurrence_owner_check()
returns trigger language plpgsql security invoker set search_path = public as $$
begin
  if new.experience_occurrence_id is not null and not exists (
    select 1 from public.boss_experience_occurrences o
    where o.id = new.experience_occurrence_id and o.user_id = new.user_id
  ) then
    raise exception 'Experience occurrence does not belong to this founder';
  end if;
  return new;
end $$;

drop trigger if exists ceo_plan_item_occurrence_owner on public.ceo_workday_plan_items;
create trigger ceo_plan_item_occurrence_owner
  before insert or update of experience_occurrence_id, user_id on public.ceo_workday_plan_items
  for each row execute function public.ceo_plan_item_occurrence_owner_check();

-- "Verified" may only be written by the server (service role), never by a
-- founder session, so a click can never claim an external outcome.
create or replace function public.ceo_plan_item_completion_basis_guard()
returns trigger language plpgsql security invoker set search_path = public as $$
begin
  if new.completion_basis = 'system-verified'
     and (tg_op = 'INSERT' or old.completion_basis is distinct from 'system-verified')
     and coalesce(auth.role(), '') <> 'service_role' then
    raise exception 'Only an authorized capability can mark work as verified';
  end if;
  return new;
end $$;

drop trigger if exists ceo_plan_item_completion_basis_guard on public.ceo_workday_plan_items;
create trigger ceo_plan_item_completion_basis_guard
  before insert or update of completion_basis on public.ceo_workday_plan_items
  for each row execute function public.ceo_plan_item_completion_basis_guard();

commit;
