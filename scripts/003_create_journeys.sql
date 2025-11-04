-- Create personalized journeys table
create table if not exists public.personalized_journeys (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  assessment_id uuid references public.assessments(id) on delete set null,
  
  -- Journey data
  phase text not null check (phase in ('startup', 'growth', 'scale', 'burned-out', 'aspiring', 'displaced')),
  focus_areas jsonb, -- ["zone-of-genius", "delegation", "ai-readiness", ...]
  action_steps jsonb, -- [{step: "...", category: "...", status: "..."}]
  delegation_plan jsonb,
  business_ideas jsonb, -- For aspiring entrepreneurs
  
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- Enable RLS
alter table public.personalized_journeys enable row level security;

-- RLS Policies
create policy "users_can_view_own_journeys"
  on public.personalized_journeys for select
  using (auth.uid() = user_id);

create policy "users_can_insert_own_journeys"
  on public.personalized_journeys for insert
  with check (auth.uid() = user_id);

create policy "users_can_update_own_journeys"
  on public.personalized_journeys for update
  using (auth.uid() = user_id);

-- Create updated_at trigger
create trigger handle_journeys_updated_at
  before update on public.personalized_journeys
  for each row
  execute function public.handle_updated_at();

-- Create index
create index journeys_user_id_idx on public.personalized_journeys(user_id);
