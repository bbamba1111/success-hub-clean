-- Create assessments table
create table if not exists public.assessments (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  completed_date timestamptz not null default now(),
  
  -- Assessment data (stored as JSONB for flexibility)
  entrepreneurial_status text,
  life_balance_scores jsonb, -- {health: 7, relationships: 5, ...}
  passions jsonb, -- ["fitness", "coaching", ...]
  skills jsonb, -- ["communication", "problem-solving", ...]
  zone_of_genius jsonb, -- ["relationship-building", "empathy", ...]
  industry text,
  business_type text,
  ai_readiness_level text,
  delegation_readiness text,
  current_work_schedule text,
  desired_lifestyle text,
  desired_business_size text,
  goals jsonb, -- ["break-hustle", "achieve-balance", ...]
  revenue_target text,
  
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- Enable RLS
alter table public.assessments enable row level security;

-- RLS Policies
create policy "users_can_view_own_assessments"
  on public.assessments for select
  using (auth.uid() = user_id);

create policy "users_can_insert_own_assessments"
  on public.assessments for insert
  with check (auth.uid() = user_id);

create policy "users_can_update_own_assessments"
  on public.assessments for update
  using (auth.uid() = user_id);

-- Create updated_at trigger
create trigger handle_assessments_updated_at
  before update on public.assessments
  for each row
  execute function public.handle_updated_at();

-- Create index for faster queries
create index assessments_user_id_idx on public.assessments(user_id);
create index assessments_completed_date_idx on public.assessments(completed_date desc);
