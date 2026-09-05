-- Business Foundation Assessment™ — the founder's living Business Blueprint™.
-- Layer of the Business Operating System™ (business_foundations = long-term
-- business identity, reality_checks = weekly human snapshot, member_memory =
-- personal long-term memory, chat_history = conversation memory).
--
-- One active record per member. The assessment is completed once (first visit
-- to the AI Augmentation Hour™) and thereafter only updated when the founder
-- chooses to refresh their Business Blueprint™. Versioned so Cherry Blossom can
-- reference how the business has evolved over time.
create table if not exists public.business_foundations (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,

  -- Business identity & stage
  business_identity text,            -- what the business is / does
  business_stage text,               -- idea, startup, growth, established, scaling
  growth_model text,                 -- how they intend to grow
  funding text,                      -- bootstrapped, self-funded, VC-backed, etc.
  revenue_stage text,                -- pre-revenue, <100k, 100k-500k, 500k-1M, 1M+
  revenue_model text,                -- services, products, subscription, hybrid
  business_size text,                -- solo, micro team, small team, growing team

  -- Insight fields (arrays of selected options)
  business_challenges jsonb default '[]'::jsonb,
  business_knowledge_interests jsonb default '[]'::jsonb,  -- Business Language University™ topics
  founder_bottlenecks jsonb default '[]'::jsonb,

  -- AI readiness & vision
  ai_readiness text,                 -- resistant, curious, adopting, integrated
  founder_success_vision text,       -- free-text vision of success

  -- Locale / preferences
  preferred_language text default 'English',
  preferred_currency text default 'USD',
  country text,
  time_zone text,

  -- Versioning & lifecycle
  version int not null default 1,
  completed_at timestamptz,
  last_reviewed_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),

  -- One active Business Blueprint™ per member (upsert target)
  unique (user_id)
);

-- Enable RLS
alter table public.business_foundations enable row level security;

-- RLS Policies — every row is private to its owner
create policy "users_can_view_own_business_foundation"
  on public.business_foundations for select
  using (auth.uid() = user_id);

create policy "users_can_insert_own_business_foundation"
  on public.business_foundations for insert
  with check (auth.uid() = user_id);

create policy "users_can_update_own_business_foundation"
  on public.business_foundations for update
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

create policy "users_can_delete_own_business_foundation"
  on public.business_foundations for delete
  using (auth.uid() = user_id);

-- Index
create index if not exists business_foundations_user_id_idx on public.business_foundations(user_id);
