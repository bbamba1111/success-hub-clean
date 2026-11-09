-- Installed Business Asset™ (Business Blueprint foundation) — one row per
-- founder per Business Asset™ from BUSINESS_ASSET_REGISTRY
-- (lib/executive-decision-engine/asset-registry.ts).
--
-- This is the canonical, direct answer to "does this founder actually have
-- this Business Asset™" — distinct from Build Records (which track
-- Readiness Capability™ build progress) and from the legacy ESA-pillar-score
-- proxy used by deriveReadinessRelevance()'s "already-installed" status.
-- Both remain valid evidence and are recorded in the `evidence` jsonb column
-- (see BusinessAssetEvidenceSource), but this table is the authoritative
-- installation-state record going forward.
--
-- One row per (user_id, business_asset_id): a new evidence entry upserts
-- this row rather than creating a parallel history. `evidence` is JSONB,
-- matching this codebase's existing business_foundations-style convention.

create table if not exists public.installed_business_assets (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  business_asset_id text not null,
  status text not null default 'not-installed',
  evidence jsonb not null default '[]'::jsonb,
  created_at timestamp with time zone not null default now(),
  updated_at timestamp with time zone not null default now(),
  unique (user_id, business_asset_id)
);

alter table public.installed_business_assets enable row level security;

create policy "users_can_view_own_installed_business_assets" on public.installed_business_assets
  for select using (auth.uid() = user_id);

create policy "users_can_insert_own_installed_business_assets" on public.installed_business_assets
  for insert with check (auth.uid() = user_id);

create policy "users_can_update_own_installed_business_assets" on public.installed_business_assets
  for update using (auth.uid() = user_id);

create policy "users_can_delete_own_installed_business_assets" on public.installed_business_assets
  for delete using (auth.uid() = user_id);

create index if not exists installed_business_assets_user_id_idx on public.installed_business_assets (user_id);
