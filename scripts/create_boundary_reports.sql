-- Work-Life Balance Reality Check™ persistence.
-- This table is required for the full 30-day Boundary Report and weekly 7-day audit.
-- Each founder can read and change only their own records.

create table if not exists public.boundary_reports (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  version integer not null default 1,
  is_initial_baseline boolean not null default false,
  original_intention jsonb,
  baseline_scores jsonb,
  baseline_overall integer,
  baseline_date timestamptz,
  priority_focus_areas jsonb,
  life_boundaries jsonb,
  boundary_collisions jsonb,
  business_requirements jsonb,
  stage_considerations jsonb,
  report jsonb,
  selected_path text,
  completed_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  status text not null default 'completed',
  founder_profile jsonb,
  current_business jsonb,
  freedom_gap_findings jsonb,
  draft_state jsonb,
  assessment_type text not null default 'full_30_day',
  period_start timestamptz,
  period_end timestamptz,
  constraint boundary_reports_status_check check (status in ('draft', 'completed')),
  constraint boundary_reports_assessment_type_check check (assessment_type in ('full_30_day', 'weekly_7_day'))
);

create unique index if not exists boundary_reports_one_draft_per_user_type
  on public.boundary_reports (user_id, assessment_type)
  where status = 'draft';

create index if not exists boundary_reports_user_idx
  on public.boundary_reports (user_id, created_at desc);

alter table public.boundary_reports enable row level security;

drop policy if exists boundary_reports_select_own on public.boundary_reports;
create policy boundary_reports_select_own
  on public.boundary_reports for select to authenticated
  using ((select auth.uid()) = user_id);

drop policy if exists boundary_reports_insert_own on public.boundary_reports;
create policy boundary_reports_insert_own
  on public.boundary_reports for insert to authenticated
  with check ((select auth.uid()) = user_id);

drop policy if exists boundary_reports_update_own on public.boundary_reports;
create policy boundary_reports_update_own
  on public.boundary_reports for update to authenticated
  using ((select auth.uid()) = user_id)
  with check ((select auth.uid()) = user_id);

drop policy if exists boundary_reports_delete_own on public.boundary_reports;
create policy boundary_reports_delete_own
  on public.boundary_reports for delete to authenticated
  using ((select auth.uid()) = user_id);

grant select, insert, update, delete on public.boundary_reports to authenticated;
