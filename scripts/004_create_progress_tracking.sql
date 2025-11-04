-- Create progress tracking table
create table if not exists public.progress_tracking (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  journey_id uuid references public.personalized_journeys(id) on delete cascade,
  
  -- Progress data
  step_name text not null,
  step_category text not null, -- "zone-of-genius", "delegation", "ai-readiness", etc.
  status text not null default 'not_started' check (status in ('not_started', 'in_progress', 'completed')),
  completed_date timestamptz,
  notes text,
  
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- Enable RLS
alter table public.progress_tracking enable row level security;

-- RLS Policies
create policy "users_can_view_own_progress"
  on public.progress_tracking for select
  using (auth.uid() = user_id);

create policy "users_can_insert_own_progress"
  on public.progress_tracking for insert
  with check (auth.uid() = user_id);

create policy "users_can_update_own_progress"
  on public.progress_tracking for update
  using (auth.uid() = user_id);

create policy "users_can_delete_own_progress"
  on public.progress_tracking for delete
  using (auth.uid() = user_id);

-- Create updated_at trigger
create trigger handle_progress_updated_at
  before update on public.progress_tracking
  for each row
  execute function public.handle_updated_at();

-- Create indexes
create index progress_user_id_idx on public.progress_tracking(user_id);
create index progress_journey_id_idx on public.progress_tracking(journey_id);
create index progress_status_idx on public.progress_tracking(status);
