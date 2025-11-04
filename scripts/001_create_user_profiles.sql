-- Create user profiles table
create table if not exists public.user_profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  email text not null,
  name text,
  membership_tier text not null default 'monday_only' check (membership_tier in (
    'monday_only',
    '7_day_monthly',
    '7_day_3month',
    '14_day_monthly',
    '14_day_3month',
    '21_day_monthly',
    '21_day_3month'
  )),
  current_cycle integer not null default 1 check (current_cycle >= 1 and current_cycle <= 8),
  cycle_start_date timestamptz,
  cycle_end_date timestamptz,
  joined_date timestamptz not null default now(),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- Enable RLS
alter table public.user_profiles enable row level security;

-- RLS Policies
create policy "users_can_view_own_profile"
  on public.user_profiles for select
  using (auth.uid() = id);

create policy "users_can_update_own_profile"
  on public.user_profiles for update
  using (auth.uid() = id);

-- Create trigger to auto-create profile on signup
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.user_profiles (id, email, name, membership_tier)
  values (
    new.id,
    new.email,
    coalesce(new.raw_user_meta_data ->> 'name', null),
    coalesce(new.raw_user_meta_data ->> 'membership_tier', 'monday_only')
  )
  on conflict (id) do nothing;

  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;

create trigger on_auth_user_created
  after insert on auth.users
  for each row
  execute function public.handle_new_user();

-- Create updated_at trigger
create or replace function public.handle_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create trigger handle_user_profiles_updated_at
  before update on public.user_profiles
  for each row
  execute function public.handle_updated_at();
