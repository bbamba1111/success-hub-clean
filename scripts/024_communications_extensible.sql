-- Communicate + Delegate™ — extensible communication object
-- ---------------------------------------------------------------------------
-- Fixes the schema-cache error ("Could not find the 'audience' column") by
-- aligning the table with the fields the UI actually uses, and reshapes it
-- into the future-ready model:
--
--   COMMUNICATION (one approved SOURCE message, tied to its decision context)
--       ↓
--   DELIVERIES     (zero or more per communication; channel adaptation later)
--
-- No social publishing, Notion, or outbound email is implemented here — the
-- deliveries table exists so those can be added later without touching the
-- source communication record. The table is extended in place (no duplicate
-- table). RLS stays user-scoped.

-- ── 1. Rename / add columns on the source record ─────────────────────────────
alter table public.commitment_communications
  -- commitment is now optional: a communication may hang off a work item instead
  alter column commitment_id drop not null;

alter table public.commitment_communications
  rename column audiences to audience;

alter table public.commitment_communications
  rename column generated_message to source_message;

alter table public.commitment_communications
  rename column final_message to approved_message;

alter table public.commitment_communications
  rename column generated_subject to source_subject;

alter table public.commitment_communications
  rename column final_subject to approved_subject;

-- timing was text[]; the UI stores one human-readable string
alter table public.commitment_communications
  alter column timing drop default,
  alter column timing drop not null,
  alter column timing type text using array_to_string(timing, ', ');

alter table public.commitment_communications
  add column if not exists audience_other     text,
  -- where the founder opened the tool from: 'decide-design' | 'ceo-workday' | 'other'
  add column if not exists source_context     text not null default 'decide-design',
  -- the live CEO Workday work item this was created beside, when applicable
  add column if not exists work_item_id       uuid references public.ceo_workday_plan_items(id) on delete set null,
  add column if not exists plan_id            uuid references public.ceo_workday_plans(id) on delete set null,
  -- what the founder is doing: communicate | notify | inform | delegate | boundary | ask | operating-rule | other
  add column if not exists communication_type text not null default 'communicate',
  -- the thing being communicated (rule, boundary, hand-off, update), in her words
  add column if not exists subject_text       text,
  -- "what do you want them to know" — distinct from desired_outcome
  add column if not exists message_intent     text,
  -- structured extras per flow (delegation: owner / done / authority; rule: applies_to / trigger)
  add column if not exists details            jsonb not null default '{}'::jsonb;

-- commitment_type now also allows 'delegation' and 'none'
alter table public.commitment_communications drop constraint if exists commitment_communications_commitment_type_check;
alter table public.commitment_communications
  add constraint commitment_communications_commitment_type_check
  check (commitment_type in ('operating-rule', 'life', 'delegation', 'none'));

alter table public.commitment_communications drop constraint if exists commitment_communications_communication_type_check;
alter table public.commitment_communications
  add constraint commitment_communications_communication_type_check
  check (communication_type in ('communicate', 'notify', 'inform', 'delegate', 'boundary', 'ask', 'operating-rule', 'other'));

alter table public.commitment_communications drop constraint if exists commitment_communications_source_context_check;
alter table public.commitment_communications
  add constraint commitment_communications_source_context_check
  check (source_context in ('decide-design', 'ceo-workday', 'other'));

create index if not exists commitment_communications_user_work_item_idx
  on public.commitment_communications (user_id, work_item_id, created_at desc);

-- ── 2. Deliveries — architecture only (no channel UI yet) ────────────────────
create table if not exists public.communication_deliveries (
  id                 uuid primary key default gen_random_uuid(),
  communication_id   uuid not null references public.commitment_communications(id) on delete cascade,
  user_id            uuid not null references auth.users(id) on delete cascade,
  -- 'copy' | 'email' | 'pdf' | 'google-doc' | 'print' today; social channels later
  channel            text not null,
  destination        text,
  -- a channel-adapted version of the source message; null = used source as-is
  adapted_subject    text,
  adapted_message    text,
  status             text not null default 'prepared' check (status in ('prepared', 'used', 'published', 'failed')),
  published_at       timestamptz,
  external_reference text,
  created_at         timestamptz not null default now(),
  updated_at         timestamptz not null default now()
);

create index if not exists communication_deliveries_comm_idx
  on public.communication_deliveries (communication_id, created_at desc);

alter table public.communication_deliveries enable row level security;

drop policy if exists "deliveries: own rows" on public.communication_deliveries;
create policy "deliveries: own rows"
  on public.communication_deliveries
  for all
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

drop trigger if exists communication_deliveries_touch on public.communication_deliveries;
create trigger communication_deliveries_touch
  before update on public.communication_deliveries
  for each row execute function public.touch_commitment_communications();

-- ── 3. Make PostgREST see the new shape immediately ──────────────────────────
notify pgrst, 'reload schema';
