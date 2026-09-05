-- Cherry Blossom's Memory Vault™ — long-term member memory.
-- Layer 2 of the memory hierarchy (reality_checks = weekly, member_memory = long-term,
-- in-session messages = conversation). Stores meaningful, structured facts that make
-- future coaching more personal: relationships, important dates, preferences, and
-- gradual "AI learning" about the member.
create table if not exists public.member_memory (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,

  -- Categorization
  memory_type text not null check (
    memory_type in (
      'relationship',          -- e.g. daughter -> Ashley
      'important_date',        -- e.g. anniversary -> May 14
      'lifestyle_preference',  -- e.g. favorite_park -> Botanical Gardens
      'planning_preference',   -- e.g. lunch-break -> give_me_ideas
      'work_life_preference',  -- e.g. friday -> family day
      'ai_learning',           -- e.g. enjoys lunch with her daughter Ashley
      'system'                 -- e.g. last_monthly_checkin -> 2026-07
    )
  ),
  memory_key text not null,
  memory_value text not null,

  -- How confident Cherry Blossom is in this memory
  confidence text not null default 'medium' check (confidence in ('low', 'medium', 'high')),

  -- Where the memory came from
  source text not null default 'conversation' check (
    source in ('conversation', 'monthly_checkin', 'planning_choice', 'reality_check')
  ),

  -- Year-agnostic date parts for gentle reminders (only set for important_date rows)
  event_month int check (event_month between 1 and 12),
  event_day int check (event_day between 1 and 31),

  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),

  -- One memory per (user, type, key) so we can upsert/refine rather than duplicate
  unique (user_id, memory_type, memory_key)
);

-- Enable RLS
alter table public.member_memory enable row level security;

-- RLS Policies — every row is private to its owner
create policy "users_can_view_own_member_memory"
  on public.member_memory for select
  using (auth.uid() = user_id);

create policy "users_can_insert_own_member_memory"
  on public.member_memory for insert
  with check (auth.uid() = user_id);

create policy "users_can_update_own_member_memory"
  on public.member_memory for update
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

create policy "users_can_delete_own_member_memory"
  on public.member_memory for delete
  using (auth.uid() = user_id);

-- Indexes
create index if not exists member_memory_user_id_idx on public.member_memory(user_id);
create index if not exists member_memory_type_idx on public.member_memory(memory_type);
create index if not exists member_memory_event_idx on public.member_memory(event_month, event_day);
