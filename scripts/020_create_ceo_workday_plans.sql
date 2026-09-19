-- ============================================================================
-- CEO Workday™ — designed plan, work items, and hourly 5-Minute Check-In™ rows
-- ----------------------------------------------------------------------------
-- WHY NEW TABLES (instead of extending an existing one):
--   * `segment_completions` is ONE row per segment per day — it cannot hold
--     per-item designed work, founder decisions, or hourly outcome history.
--   * `ceo_work_items` (Today's Work™ queue) is localStorage-only today and has
--     no user id, so GPS / Cherry Blossom cannot read it server-side.
--   * `build_records` / `installed_business_assets` describe durable Business
--     Assets™ — the CEO Workday plan REFERENCES those (related_asset_id) but
--     must never become a second copy of them.
--
-- Plan (one per founder per day) → items (the designed work chain) →
-- check-ins (what actually happened each hour + what the founder decided next).
-- Mirrors bba_baseline_assessments / bba_weekly_checkins conventions: RLS on
-- auth.uid() = user_id, updated_at trigger, additive + idempotent.
-- ============================================================================

create table if not exists public.ceo_workday_plans (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  plan_date date not null,
  week_key text not null,

  -- Source decisions (from the Monday Work-Life Balance Weekly Debrief™)
  business_area_id text,
  bottleneck_ega_entry_ids text[] not null default '{}',
  primary_assignment_ref text,
  primary_asset_id text,

  -- GPS reasoning summary (explainable, deterministic)
  constraint_summary text,
  intervention_summary text,

  -- Declaration
  identity_statement text,
  declaration text,

  planned_minutes integer not null default 0,
  status text not null default 'designed'
    check (status in ('designed','entered','adjusted','declared','in-progress','closed')),

  entered_at timestamptz,
  closed_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),

  unique (user_id, plan_date)
);

create table if not exists public.ceo_workday_plan_items (
  id uuid primary key default gen_random_uuid(),
  plan_id uuid not null references public.ceo_workday_plans(id) on delete cascade,
  user_id uuid not null references auth.users(id) on delete cascade,
  position integer not null default 0,

  title text not null,
  purpose text,                 -- WHY THIS WORK
  expected_evidence text,       -- EXPECTED OUTCOME / EVIDENCE

  treatment text not null
    check (treatment in ('build-change','implement-operate','practice-develop','delegate-transfer','systemize-augment-automate-ai')),
  business_function text not null
    check (business_function in ('build','decide','own','delegate','systemize','augment-automate-ai','connect','communicate','sell','market','deliver','solve')),
  role text not null default 'primary'
    check (role in ('primary','supporting','validate','continue','founder-added')),

  estimated_minutes integer not null default 0,
  related_asset_id text,
  related_assignment_ref text,
  ceo_work_category text,       -- maps to lib/ceo-workday/categories CeoWorkCategoryId for the live queue mirror

  -- Immutable snapshot of what GPS proposed, so founder changes are measurable.
  gps_original jsonb,
  founder_decision text not null default 'keep'
    check (founder_decision in ('keep','edit','replace','defer','delegate','remove','added')),

  status text not null default 'planned'
    check (status in ('planned','in-progress','completed','deferred','delegated','eliminated','blocked','other')),
  next_action text
    check (next_action is null or next_action in ('continue-next-hour','move-segment','later','delegate','eliminate','need-help','other')),

  -- Id of the mirrored item in the localStorage Today's Work™ queue.
  local_work_item_id text,

  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.ceo_workday_checkins (
  id uuid primary key default gen_random_uuid(),
  plan_id uuid not null references public.ceo_workday_plans(id) on delete cascade,
  item_id uuid references public.ceo_workday_plan_items(id) on delete cascade,
  user_id uuid not null references auth.users(id) on delete cascade,

  hour_block integer not null check (hour_block between 1 and 4),
  scheduled_at timestamptz not null,   -- deterministic: block end − 5 min
  opened_at timestamptz,
  saved_at timestamptz,

  -- "Tell us what you're working on" (one per plan+hour, item_id null)
  working_on_declaration text,

  -- Per-item outcome (item_id set)
  actual_status text
    check (actual_status is null or actual_status in ('completed','in-progress','deferred','delegated','eliminated','blocked','other')),
  actual_minutes integer,
  blocker text,
  reflection text,
  next_action text
    check (next_action is null or next_action in ('continue-next-hour','move-segment','later','delegate','eliminate','need-help','other')),

  created_at timestamptz not null default now()
);

create index if not exists ceo_workday_plans_user_date_idx on public.ceo_workday_plans (user_id, plan_date desc);
create index if not exists ceo_workday_plan_items_plan_idx on public.ceo_workday_plan_items (plan_id, position);
create index if not exists ceo_workday_checkins_plan_hour_idx on public.ceo_workday_checkins (plan_id, hour_block);

-- Row Level Security — founders only ever see their own rows.
alter table public.ceo_workday_plans enable row level security;
alter table public.ceo_workday_plan_items enable row level security;
alter table public.ceo_workday_checkins enable row level security;

do $$
begin
  if not exists (select 1 from pg_policies where tablename = 'ceo_workday_plans' and policyname = 'ceo_workday_plans_owner') then
    create policy ceo_workday_plans_owner on public.ceo_workday_plans
      for all using (auth.uid() = user_id) with check (auth.uid() = user_id);
  end if;
  if not exists (select 1 from pg_policies where tablename = 'ceo_workday_plan_items' and policyname = 'ceo_workday_plan_items_owner') then
    create policy ceo_workday_plan_items_owner on public.ceo_workday_plan_items
      for all using (auth.uid() = user_id) with check (auth.uid() = user_id);
  end if;
  if not exists (select 1 from pg_policies where tablename = 'ceo_workday_checkins' and policyname = 'ceo_workday_checkins_owner') then
    create policy ceo_workday_checkins_owner on public.ceo_workday_checkins
      for all using (auth.uid() = user_id) with check (auth.uid() = user_id);
  end if;
end $$;

-- updated_at maintenance
create or replace function public.set_ceo_workday_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end $$;

drop trigger if exists ceo_workday_plans_set_updated_at on public.ceo_workday_plans;
create trigger ceo_workday_plans_set_updated_at
  before update on public.ceo_workday_plans
  for each row execute function public.set_ceo_workday_updated_at();

drop trigger if exists ceo_workday_plan_items_set_updated_at on public.ceo_workday_plan_items;
create trigger ceo_workday_plan_items_set_updated_at
  before update on public.ceo_workday_plan_items
  for each row execute function public.set_ceo_workday_updated_at();
