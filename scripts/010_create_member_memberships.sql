-- Membership Architecture — the platform's source of truth for ACCESS & EXPERIENCE.
--
-- Separation of concerns:
--   • user_profiles.membership_tier  -> AUTHORIZATION layer (middleware checks this)
--   • member_memberships             -> EXPERIENCE layer (what was purchased, how it's
--                                       billed, current status, and how Cherry Blossom
--                                       personalizes the journey)
--   • Stripe / SamCart               -> BILLING source of truth (added later)
--
-- One active membership per member. Future-ready for upgrades, renewals, gift
-- memberships, enterprise plans, promotional access, and cohort programs — all
-- WITHOUT further schema changes (plan_version + cohort + experience + member_state).
create table if not exists public.member_memberships (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,

  -- What experience the member is in (product ladder)
  membership_type text not null default 'monday_installation'
    check (membership_type in ('monday_installation', 'business_week')),

  -- Human-readable experience name (sold as an experience, not software)
  experience text not null default 'make_time_for_more_mondays'
    check (experience in ('make_time_for_more_mondays', 'work_life_balance_business_week')),

  -- How it's billed (access is independent of the billing processor)
  billing_type text not null default 'single_pass'
    check (billing_type in ('single_pass', 'monthly')),

  -- Lifecycle status
  status text not null default 'active'
    check (status in ('active', 'expired', 'cancelled', 'paused', 'trial')),

  -- Coarse access level the app resolves day-gating against
  access_level text not null default 'monday'
    check (access_level in ('monday', 'business_week')),

  -- Where the member is in the weekly operating rhythm (journey state).
  -- Lets navigation / dynamic heroes / Cherry Blossom respond without inferring
  -- from multiple tables.
  member_state text not null default 'onboarding'
    check (member_state in (
      'onboarding',
      'sunday_design_day',
      'monday_installation',
      'business_week',
      'time_freedom',
      'completed_cycle'
    )),

  -- Lifecycle dates
  started_at timestamptz not null default now(),
  expires_at timestamptz,
  renewal_date timestamptz,
  auto_renew boolean not null default false,

  -- Billing linkage (reference only — billing truth lives in the processor)
  payment_provider text check (payment_provider in ('stripe', 'samcart', 'manual', 'comp')),
  payment_reference text,

  -- Future-proofing: keep older members on their plan when pricing changes,
  -- and support beta / corporate / healthcare / founders cohorts.
  plan_version int not null default 1,
  cohort text,

  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- Enable RLS
alter table public.member_memberships enable row level security;

-- RLS Policies — every row is private to its owner
create policy "users_can_view_own_membership"
  on public.member_memberships for select
  using (auth.uid() = user_id);

create policy "users_can_insert_own_membership"
  on public.member_memberships for insert
  with check (auth.uid() = user_id);

create policy "users_can_update_own_membership"
  on public.member_memberships for update
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

create policy "users_can_delete_own_membership"
  on public.member_memberships for delete
  using (auth.uid() = user_id);

-- Indexes
create index if not exists member_memberships_user_id_idx on public.member_memberships(user_id);
-- One ACTIVE membership per member (allows historical expired/cancelled rows to coexist)
create unique index if not exists member_memberships_one_active_per_user
  on public.member_memberships(user_id)
  where status = 'active';
