-- Build Record™ (Phase 10) — one row per founder per capability being built.
-- Captures the full execution lifecycle for a chosen Build Path™ (Phase 9F),
-- from "not_started" through "installed" (which then feeds back into the
-- Founder GPS™ readiness/relevance engine as an ESA-score proxy).
--
-- One active build per (user_id, capability_id): starting a new Build Path™
-- for the same capability upserts this row rather than creating a parallel
-- history. milestones/tasks/dependencies are JSONB, matching this codebase's
-- existing business_foundations-style convention — intentionally not a
-- normalized project-management schema. `blueprint`/`execution` hold all
-- Build Path™-specific fields (per the 8 paths) as JSON so this single table
-- serves every path without a schema migration per path.

create table if not exists public.build_records (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  capability_id text not null,
  build_path text not null,
  status text not null default 'not_started',
  title text,
  summary text,
  -- The full Build Blueprint™ (Phase 9F) this record was created from.
  blueprint jsonb not null default '{}'::jsonb,
  -- The per-Build-Path execution progress (BuildPathExecution).
  execution jsonb not null default '{}'::jsonb,
  milestones jsonb not null default '[]'::jsonb,
  tasks jsonb not null default '[]'::jsonb,
  prerequisite_capability_ids jsonb not null default '[]'::jsonb,
  blocked_by_capability_ids jsonb not null default '[]'::jsonb,
  blocker_note text,
  owner_summary text,
  executor text,
  started_at timestamp with time zone,
  completed_at timestamp with time zone,
  installed_at timestamp with time zone,
  created_at timestamp with time zone not null default now(),
  updated_at timestamp with time zone not null default now(),
  unique (user_id, capability_id)
);

alter table public.build_records enable row level security;

create policy "users_can_view_own_build_records" on public.build_records
  for select using (auth.uid() = user_id);

create policy "users_can_insert_own_build_records" on public.build_records
  for insert with check (auth.uid() = user_id);

create policy "users_can_update_own_build_records" on public.build_records
  for update using (auth.uid() = user_id);

create policy "users_can_delete_own_build_records" on public.build_records
  for delete using (auth.uid() = user_id);

create index if not exists build_records_user_id_idx on public.build_records (user_id);
