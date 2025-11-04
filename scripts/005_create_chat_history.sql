-- Create chat history table
create table if not exists public.chat_history (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  
  -- Chat data
  chat_context text not null, -- "morning-routine", "ceo-workday", etc.
  message text not null,
  role text not null check (role in ('user', 'assistant')),
  timestamp timestamptz not null default now(),
  context_data jsonb -- Additional context about what they were working on
);

-- Enable RLS
alter table public.chat_history enable row level security;

-- RLS Policies
create policy "users_can_view_own_chat_history"
  on public.chat_history for select
  using (auth.uid() = user_id);

create policy "users_can_insert_own_chat_history"
  on public.chat_history for insert
  with check (auth.uid() = user_id);

-- Create indexes
create index chat_history_user_id_idx on public.chat_history(user_id);
create index chat_history_context_idx on public.chat_history(chat_context);
create index chat_history_timestamp_idx on public.chat_history(timestamp desc);
