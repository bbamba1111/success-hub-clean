-- Phase 3: Delegation Brief™ multi-instance support.
--
-- business_asset_builds previously enforced a de facto singleton per
-- (user_id, business_asset_id, build_mode) purely in application code
-- (getBusinessAssetBuildFromDb / saveGuidedDiyCompletionToDb always picked
-- or updated the single most-recent row). Delegation is a recurring
-- activity with multiple independent real-world instances (e.g. "Client
-- Onboarding", "Invoicing", "Scheduling" all delegated by the same
-- founder), so a nullable discriminator column is added to let multiple
-- rows coexist for assets explicitly marked `isMultiInstance` in the
-- registry (currently only "delegation-brief").
--
-- NULL preserves the exact legacy singleton behavior for every existing
-- asset (Meeting Rule™, etc.) — no other asset ever sets this column, and
-- all existing lookups explicitly filter `.is("instance_key", null)` when no
-- instanceKey is passed, so this is additive and non-breaking.

alter table public.business_asset_builds
  add column if not exists instance_key text;

create index if not exists idx_business_asset_builds_lookup
  on public.business_asset_builds (user_id, business_asset_id, build_mode, instance_key);
