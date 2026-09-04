-- Communicate My Change™ / Communicate My Boundary™
-- One approved communication per (commitment, audience, purpose). Several
-- communications may hang off the same weekly commitment — never duplicate the
-- priority itself.

create table if not exists public.commitment_communications (
  id                uuid primary key default gen_random_uuid(),
  user_id           uuid not null references auth.users(id) on delete cascade,
  commitment_id     uuid not null references public.weekly_commitments(id) on delete cascade,
  -- 'operating-rule' → Communicate My Change™ · 'life' → Communicate My Boundary™
  commitment_type   text not null check (commitment_type in ('operating-rule', 'life')),
  commitment_text   text not null,
  audiences         text[] not null default '{}',
  timing            text[] not null default '{}',
  desired_outcome   text,
  tone              text not null default 'warm' check (tone in ('warm', 'clear-direct', 'professional', 'collaborative')),
  generated_subject text,
  generated_message text,
  final_subject     text,
  final_message     text,
  final_format      text,
  status            text not null default 'draft' check (status in ('draft', 'approved', 'used')),
  used_at           timestamptz,
  created_at        timestamptz not null default now(),
  updated_at        timestamptz not null default now()
);

create index if not exists commitment_communications_user_commitment_idx
  on public.commitment_communications (user_id, commitment_id, created_at desc);

alter table public.commitment_communications enable row level security;

drop policy if exists "communications: own rows" on public.commitment_communications;
create policy "communications: own rows"
  on public.commitment_communications
  for all
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

create or replace function public.touch_commitment_communications()
returns trigger language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end $$;

drop trigger if exists commitment_communications_touch on public.commitment_communications;
create trigger commitment_communications_touch
  before update on public.commitment_communications
  for each row execute function public.touch_commitment_communications();
