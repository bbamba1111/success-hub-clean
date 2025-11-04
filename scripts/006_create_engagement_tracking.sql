-- Create engagement tracking table
create table if not exists public.engagement_tracking (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  
  -- Engagement data
  session_date date not null,
  session_type text not null check (session_type in ('morning_routine', 'workout', 'lunch', 'ceo_workday', 'power_down', 'onboarding', 'sunday_shift')),
  attended boolean not null default false,
  duration_minutes integer,
  notes text,
  
  created_at timestamptz not null default now()
);

-- Enable RLS
alter table public.engagement_tracking enable row level security;

-- RLS Policies
create policy "users_can_view_own_engagement"
  on public.engagement_tracking for select
  using (auth.uid() = user_id);

create policy "users_can_insert_own_engagement"
  on public.engagement_tracking for insert
  with check (auth.uid() = user_id);

create policy "users_can_update_own_engagement"
  on public.engagement_tracking for update
  using (auth.uid() = user_id);

-- Create indexes
create index engagement_user_id_idx on public.engagement_tracking(user_id);
create index engagement_session_date_idx on public.engagement_tracking(session_date desc);
create index engagement_session_type_idx on public.engagement_tracking(session_type);
