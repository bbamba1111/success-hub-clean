-- Phase 4: founder authority, approvals, pre-authorizations, immutable history,
-- AI usage limits and emergency shutdown.

begin;

-- ---------------------------------------------------------------------------
-- Settings (emergency AI shutdown). Service role only.
-- ---------------------------------------------------------------------------
create table if not exists public.app_settings (
  key text primary key,
  value jsonb not null,
  updated_by uuid references auth.users(id) on delete set null,
  updated_at timestamptz not null default now()
);
alter table public.app_settings enable row level security;
insert into public.app_settings (key, value) values ('ai_enabled', 'true'::jsonb)
on conflict (key) do nothing;

-- ---------------------------------------------------------------------------
-- AI usage (member and public pools are counted separately). Service role only.
-- ---------------------------------------------------------------------------
create table if not exists public.ai_usage_events (
  id bigserial primary key,
  scope text not null check (scope in ('member', 'public')),
  subject text not null check (char_length(subject) between 1 and 128),
  route text not null check (char_length(route) between 1 and 128),
  created_at timestamptz not null default now()
);
create index if not exists ai_usage_events_window_idx
  on public.ai_usage_events (scope, subject, created_at desc);
alter table public.ai_usage_events enable row level security;

create or replace function public.ai_consume_quota(
  p_scope text, p_subject text, p_route text, p_per_minute int, p_per_hour int
) returns jsonb
language plpgsql security definer set search_path = public as $$
declare
  used_minute int;
  used_hour int;
  oldest timestamptz;
begin
  if p_scope not in ('member', 'public') then
    raise exception 'invalid scope';
  end if;

  perform pg_advisory_xact_lock(hashtextextended(p_scope || ':' || p_subject, 0));

  select count(*) filter (where created_at > now() - interval '1 minute'),
         count(*),
         min(created_at)
    into used_minute, used_hour, oldest
    from ai_usage_events
   where scope = p_scope and subject = p_subject and created_at > now() - interval '1 hour';

  if used_minute >= p_per_minute then
    return jsonb_build_object('allowed', false, 'reason', 'minute', 'retry_after', 60);
  end if;
  if used_hour >= p_per_hour then
    return jsonb_build_object(
      'allowed', false, 'reason', 'hour',
      'retry_after', greatest(1, ceil(extract(epoch from (oldest + interval '1 hour' - now())))::int)
    );
  end if;

  insert into ai_usage_events (scope, subject, route) values (p_scope, p_subject, p_route);
  delete from ai_usage_events where created_at < now() - interval '2 days' and id % 50 = 0;

  return jsonb_build_object('allowed', true, 'minute_used', used_minute + 1, 'hour_used', used_hour + 1);
end $$;
revoke all on function public.ai_consume_quota(text, text, text, int, int) from public, anon, authenticated;
grant execute on function public.ai_consume_quota(text, text, text, int, int) to service_role;

-- ---------------------------------------------------------------------------
-- Helpers
-- ---------------------------------------------------------------------------
create or replace function public.boss_ai_enabled() returns boolean
language sql stable security definer set search_path = public as $$
  select coalesce((select value = 'true'::jsonb from app_settings where key = 'ai_enabled'), false)
$$;

create or replace function public.boss_member_active(p_user uuid) returns boolean
language sql stable security definer set search_path = public as $$
  select coalesce((
    select role = 'platform_admin'
        or (membership_tier is not null
            and btrim(membership_tier) <> ''
            and lower(membership_tier) not like '%free%'
            and lower(membership_tier) <> 'premium_member')
      from user_profiles where id = p_user
  ), false)
$$;

-- Internal BO$$ actions only. Anything not listed here cannot be proposed or run.
create or replace function public.boss_action_required_level(p_kind text) returns text
language sql immutable as $$
  select case p_kind
    when 'job.save_whats_ready' then 'prepare'
    when 'job.set_status' then 'approved_execution'
    else null
  end
$$;

create or replace function public.boss_payload_hash(p_kind text, p_payload jsonb) returns text
language sql immutable as $$
  select encode(sha256(convert_to(p_kind || '|' || p_payload::text, 'UTF8')), 'hex')
$$;

-- ---------------------------------------------------------------------------
-- History: accountability columns + append-only
-- ---------------------------------------------------------------------------
alter table public.boss_job_history
  add column if not exists proposal_id uuid,
  add column if not exists preauthorization_id uuid,
  add column if not exists ai_capability text,
  add column if not exists permission_level text,
  add column if not exists result text,
  add column if not exists error text;

create or replace function public.boss_job_history_immutable() returns trigger
language plpgsql as $$
begin
  if tg_op = 'UPDATE' then
    -- Only the foreign-key cleanup when a job is deleted may touch a row.
    if new.job_id is null and old.job_id is not null
       and (to_jsonb(new) - 'job_id') = (to_jsonb(old) - 'job_id') then
      return new;
    end if;
    raise exception 'History is permanent and cannot be changed';
  end if;
  -- Deletion is only allowed as part of deleting the whole account.
  if exists (select 1 from auth.users where id = old.user_id) then
    raise exception 'History is permanent and cannot be deleted';
  end if;
  return old;
end $$;

drop trigger if exists boss_job_history_immutable on public.boss_job_history;
create trigger boss_job_history_immutable
  before update or delete on public.boss_job_history
  for each row execute function public.boss_job_history_immutable();

-- ---------------------------------------------------------------------------
-- Proposals
-- ---------------------------------------------------------------------------
create table if not exists public.boss_job_proposals (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  job_id uuid not null references public.boss_jobs(id) on delete cascade,
  version int not null default 1,
  supersedes_id uuid references public.boss_job_proposals(id) on delete set null,
  proposed_by text not null check (proposed_by in ('cherry', 'executive', 'system')),
  ai_capability text not null check (char_length(ai_capability) between 1 and 120),
  summary text not null check (char_length(summary) between 1 and 2000),
  action_kind text not null check (public.boss_action_required_level(action_kind) is not null),
  action_payload jsonb not null default '{}'::jsonb,
  payload_hash text not null,
  permission_level text not null,
  status text not null default 'pending' check (status in
    ('pending', 'approved', 'rejected', 'change_requested', 'waiting', 'superseded', 'executing', 'executed', 'failed')),
  decision_note text check (decision_note is null or char_length(decision_note) <= 2000),
  decided_by uuid references auth.users(id) on delete set null,
  decided_at timestamptz,
  preauthorization_id uuid,
  executed_at timestamptz,
  execution_result text,
  error text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  check (payload_hash = public.boss_payload_hash(action_kind, action_payload))
);
create index if not exists boss_job_proposals_job_idx on public.boss_job_proposals (user_id, job_id, created_at desc);
alter table public.boss_job_proposals enable row level security;
drop policy if exists "own proposals select" on public.boss_job_proposals;
create policy "own proposals select" on public.boss_job_proposals for select using (auth.uid() = user_id);

create or replace function public.boss_job_proposals_immutable() returns trigger
language plpgsql as $$
begin
  if new.user_id <> old.user_id or new.job_id <> old.job_id or new.version <> old.version
     or new.proposed_by <> old.proposed_by or new.ai_capability <> old.ai_capability
     or new.summary <> old.summary or new.action_kind <> old.action_kind
     or new.action_payload <> old.action_payload or new.payload_hash <> old.payload_hash
     or new.permission_level <> old.permission_level or new.created_at <> old.created_at then
    raise exception 'A proposal cannot be edited. Propose a new version instead.';
  end if;
  if old.status in ('rejected', 'superseded', 'executed', 'failed') then
    raise exception 'This proposal is closed';
  end if;
  new.updated_at := now();
  return new;
end $$;

drop trigger if exists boss_job_proposals_immutable on public.boss_job_proposals;
create trigger boss_job_proposals_immutable
  before update on public.boss_job_proposals
  for each row execute function public.boss_job_proposals_immutable();

-- ---------------------------------------------------------------------------
-- Pre-authorizations
-- ---------------------------------------------------------------------------
create table if not exists public.boss_preauthorizations (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  job_id uuid references public.boss_jobs(id) on delete cascade,
  business_function text,
  action_kinds text[] not null check (cardinality(action_kinds) between 1 and 10),
  max_uses int check (max_uses is null or max_uses between 1 and 1000),
  uses int not null default 0,
  note text check (note is null or char_length(note) <= 1000),
  expires_at timestamptz not null,
  created_at timestamptz not null default now(),
  revoked_at timestamptz,
  revoke_note text check (revoke_note is null or char_length(revoke_note) <= 1000),
  check (job_id is not null or business_function is not null),
  check (expires_at > created_at and expires_at <= created_at + interval '90 days')
);
create index if not exists boss_preauthorizations_user_idx on public.boss_preauthorizations (user_id, created_at desc);
alter table public.boss_preauthorizations enable row level security;
drop policy if exists "own preauthorizations select" on public.boss_preauthorizations;
create policy "own preauthorizations select" on public.boss_preauthorizations for select using (auth.uid() = user_id);

-- ---------------------------------------------------------------------------
-- RPC: create a proposal (any new version replaces the open one)
-- ---------------------------------------------------------------------------
create or replace function public.boss_create_proposal(
  p_job_id uuid, p_proposed_by text, p_ai_capability text, p_summary text, p_action_kind text, p_action_payload jsonb
) returns uuid
language plpgsql security definer set search_path = public as $$
declare
  uid uuid := auth.uid();
  j record;
  prev record;
  new_id uuid;
begin
  if uid is null then raise exception 'Not signed in'; end if;
  if p_proposed_by not in ('cherry', 'executive', 'system') then
    raise exception 'Only Cherry Blossom, an executive or BO$$ can propose';
  end if;
  if boss_action_required_level(p_action_kind) is null then
    raise exception 'That action is not allowed';
  end if;

  select * into j from boss_jobs where id = p_job_id and user_id = uid;
  if not found then raise exception 'Job not found'; end if;

  select * into prev from boss_job_proposals
   where job_id = p_job_id and user_id = uid and status in ('pending', 'waiting', 'change_requested', 'approved')
   order by version desc limit 1;

  if found then
    update boss_job_proposals set status = 'superseded'
     where job_id = p_job_id and user_id = uid and status in ('pending', 'waiting', 'change_requested', 'approved');
  end if;

  insert into boss_job_proposals (
    user_id, job_id, version, supersedes_id, proposed_by, ai_capability, summary,
    action_kind, action_payload, payload_hash, permission_level
  ) values (
    uid, p_job_id,
    coalesce((select max(version) from boss_job_proposals where job_id = p_job_id), 0) + 1,
    prev.id, p_proposed_by, p_ai_capability, btrim(p_summary),
    p_action_kind, coalesce(p_action_payload, '{}'::jsonb),
    boss_payload_hash(p_action_kind, coalesce(p_action_payload, '{}'::jsonb)), j.permission_level
  ) returning id into new_id;

  insert into boss_job_history (user_id, job_id, action, actor, field, new_value, note, proposal_id, ai_capability, permission_level)
  values (uid, p_job_id, 'proposal_created', p_proposed_by, 'proposal', p_summary,
          case when prev.id is not null then 'Replaces an earlier version' end,
          new_id, p_ai_capability, j.permission_level);

  return new_id;
end $$;

-- ---------------------------------------------------------------------------
-- RPC: founder decision on one exact proposal version
-- ---------------------------------------------------------------------------
create or replace function public.boss_decide_proposal(
  p_proposal_id uuid, p_decision text, p_expected_hash text, p_note text default null
) returns text
language plpgsql security definer set search_path = public as $$
declare
  uid uuid := auth.uid();
  p record;
  next_status text;
begin
  if uid is null then raise exception 'Not signed in'; end if;
  next_status := case p_decision
    when 'yes_do_it' then 'approved'
    when 'no_stop' then 'rejected'
    when 'change_it' then 'change_requested'
    when 'wait' then 'waiting'
  end;
  if next_status is null then raise exception 'Unknown decision'; end if;

  select * into p from boss_job_proposals where id = p_proposal_id and user_id = uid for update;
  if not found then raise exception 'Proposal not found'; end if;
  if p.status not in ('pending', 'waiting') then raise exception 'This proposal is no longer waiting for you'; end if;
  if p_expected_hash is distinct from p.payload_hash then
    raise exception 'This proposal changed. Review the new version.';
  end if;

  update boss_job_proposals
     set status = next_status, decided_by = uid, decided_at = now(), decision_note = nullif(btrim(p_note), '')
   where id = p.id;

  insert into boss_job_history (user_id, job_id, action, actor, field, previous_value, new_value, note, proposal_id, ai_capability, permission_level)
  values (uid, p.job_id, 'proposal_decided', 'founder', 'decision', p.status, next_status, nullif(btrim(p_note), ''),
          p.id, p.ai_capability, p.permission_level);

  return next_status;
end $$;

-- ---------------------------------------------------------------------------
-- RPC: pre-authorizations (grant / revoke)
-- ---------------------------------------------------------------------------
create or replace function public.boss_grant_preauthorization(
  p_job_id uuid, p_business_function text, p_action_kinds text[], p_expires_at timestamptz,
  p_max_uses int default null, p_note text default null
) returns uuid
language plpgsql security definer set search_path = public as $$
declare
  uid uuid := auth.uid();
  k text;
  new_id uuid;
begin
  if uid is null then raise exception 'Not signed in'; end if;
  if p_job_id is not null and not exists (select 1 from boss_jobs where id = p_job_id and user_id = uid) then
    raise exception 'Job not found';
  end if;
  foreach k in array p_action_kinds loop
    if boss_action_required_level(k) is null then raise exception 'That action is not allowed'; end if;
  end loop;

  insert into boss_preauthorizations (user_id, job_id, business_function, action_kinds, max_uses, note, expires_at)
  values (uid, p_job_id, case when p_job_id is null then p_business_function end, p_action_kinds,
          p_max_uses, nullif(btrim(p_note), ''), p_expires_at)
  returning id into new_id;

  insert into boss_job_history (user_id, job_id, action, actor, field, new_value, note, preauthorization_id)
  values (uid, p_job_id, 'preauthorization_granted', 'founder', 'preauthorization',
          array_to_string(p_action_kinds, ', ') || ' until ' || to_char(p_expires_at, 'YYYY-MM-DD HH24:MI TZ'),
          coalesce(nullif(btrim(p_note), ''), case when p_job_id is null then 'Area: ' || p_business_function end),
          new_id);
  return new_id;
end $$;

create or replace function public.boss_revoke_preauthorization(p_id uuid, p_note text default null) returns void
language plpgsql security definer set search_path = public as $$
declare
  uid uuid := auth.uid();
  a record;
begin
  if uid is null then raise exception 'Not signed in'; end if;
  select * into a from boss_preauthorizations where id = p_id and user_id = uid for update;
  if not found then raise exception 'Pre-authorization not found'; end if;
  if a.revoked_at is not null then return; end if;
  update boss_preauthorizations set revoked_at = now(), revoke_note = nullif(btrim(p_note), '') where id = p_id;
  insert into boss_job_history (user_id, job_id, action, actor, field, note, preauthorization_id)
  values (uid, a.job_id, 'preauthorization_revoked', 'founder', 'preauthorization', nullif(btrim(p_note), ''), p_id);
end $$;

-- ---------------------------------------------------------------------------
-- RPC: the one execution gate. Authorizes, runs and records atomically.
-- ---------------------------------------------------------------------------
create or replace function public.boss_execute_proposal(p_proposal_id uuid) returns jsonb
language plpgsql security definer set search_path = public as $$
declare
  uid uuid := auth.uid();
  p record;
  j record;
  pre record;
  required_level text;
  via text;
  refusal text;
  err text;
begin
  if uid is null then return jsonb_build_object('ok', false, 'reason', 'Not signed in'); end if;

  select * into p from boss_job_proposals where id = p_proposal_id and user_id = uid for update;
  if not found then return jsonb_build_object('ok', false, 'reason', 'Proposal not found'); end if;
  select * into j from boss_jobs where id = p.job_id and user_id = uid for update;
  required_level := boss_action_required_level(p.action_kind);

  if not boss_ai_enabled() then
    refusal := 'AI actions are switched off (emergency shutdown)';
  elsif not boss_member_active(uid) then
    refusal := 'An active paid membership is required';
  elsif p.payload_hash <> boss_payload_hash(p.action_kind, p.action_payload) then
    refusal := 'The proposal does not match what was approved';
  elsif j.stopped or j.paused then
    refusal := 'This job is paused or stopped';
  elsif boss_job_unfinished_prereqs(j.id) then
    refusal := 'Something that must happen first is not done';
  elsif boss_permission_rank(j.permission_level) < boss_permission_rank(required_level) then
    refusal := 'This job is not allowed to do that';
  elsif p.status = 'approved' then
    via := 'approval';
  elsif p.status in ('pending', 'waiting') and j.permission_level = 'preauthorized_execution' then
    select * into pre from boss_preauthorizations a
     where a.user_id = uid and a.revoked_at is null and a.expires_at > now()
       and (a.max_uses is null or a.uses < a.max_uses)
       and p.action_kind = any (a.action_kinds)
       and (a.job_id = j.id or (a.job_id is null and a.business_function = j.business_function))
     order by a.job_id nulls last, a.expires_at
     limit 1 for update;
    if found then via := 'preauthorization'; else refusal := 'Not approved and no active pre-authorization covers it'; end if;
  else
    refusal := 'Not approved';
  end if;

  if refusal is not null then
    insert into boss_job_history (user_id, job_id, action, actor, field, note, proposal_id, ai_capability, permission_level, result, error)
    values (uid, p.job_id, 'execution_refused', p.proposed_by, 'proposal', p.summary, p.id, p.ai_capability,
            j.permission_level, 'refused', refusal);
    return jsonb_build_object('ok', false, 'reason', refusal);
  end if;

  begin
    if p.action_kind = 'job.save_whats_ready' then
      update boss_jobs set whats_ready = left(p.action_payload ->> 'text', 4000),
             last_change_actor = p.proposed_by, last_change_action = 'whats_ready',
             last_change_note = 'Proposal v' || p.version
       where id = j.id;
    elsif p.action_kind = 'job.set_status' then
      update boss_jobs set status = p.action_payload ->> 'status',
             last_change_actor = p.proposed_by, last_change_action = 'status',
             last_change_note = 'Proposal v' || p.version
       where id = j.id;
    end if;
  exception when others then
    err := sqlerrm;
  end;

  if via = 'preauthorization' and err is null then
    update boss_preauthorizations set uses = uses + 1 where id = pre.id;
  end if;

  update boss_job_proposals
     set status = case when err is null then 'executed' else 'failed' end,
         executed_at = now(), preauthorization_id = pre.id,
         execution_result = case when err is null then 'done via ' || via end, error = err
   where id = p.id;

  insert into boss_job_history (user_id, job_id, action, actor, field, note, proposal_id, preauthorization_id,
                                ai_capability, permission_level, result, error)
  values (uid, p.job_id, case when err is null then 'executed' else 'execution_failed' end, p.proposed_by, 'proposal',
          p.summary, p.id, pre.id, p.ai_capability, j.permission_level,
          case when err is null then 'done via ' || via else 'failed' end, err);

  return jsonb_build_object('ok', err is null, 'via', via, 'reason', err);
end $$;

revoke all on function public.boss_create_proposal(uuid, text, text, text, text, jsonb) from public, anon;
revoke all on function public.boss_decide_proposal(uuid, text, text, text) from public, anon;
revoke all on function public.boss_grant_preauthorization(uuid, text, text[], timestamptz, int, text) from public, anon;
revoke all on function public.boss_revoke_preauthorization(uuid, text) from public, anon;
revoke all on function public.boss_execute_proposal(uuid) from public, anon;
grant execute on function public.boss_create_proposal(uuid, text, text, text, text, jsonb) to authenticated;
grant execute on function public.boss_decide_proposal(uuid, text, text, text) to authenticated;
grant execute on function public.boss_grant_preauthorization(uuid, text, text[], timestamptz, int, text) to authenticated;
grant execute on function public.boss_revoke_preauthorization(uuid, text) to authenticated;
grant execute on function public.boss_execute_proposal(uuid) to authenticated;
revoke all on function public.boss_member_active(uuid) from public, anon, authenticated;
revoke all on function public.boss_ai_enabled() from public, anon;

commit;
