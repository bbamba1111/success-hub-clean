CREATE OR REPLACE FUNCTION public.handle_new_user()
 RETURNS trigger
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
begin
  -- SECURITY: new accounts NEVER receive paid access on creation. Client-
  -- supplied raw_user_meta_data.membership_tier is intentionally ignored here
  -- so account creation can never be used as a payment bypass. Paid tiers are
  -- granted only by the SamCart webhook (app/api/samcart/webhook/route.ts)
  -- after a verified payment, via an explicit UPDATE against this row.
  insert into public.user_profiles (id, email, name, membership_tier)
  values (
    new.id,
    new.email,
    coalesce(new.raw_user_meta_data ->> 'name', null),
    'free'
  )
  on conflict (id) do nothing;

  return new;
end;
$function$
;
CREATE OR REPLACE FUNCTION public.handle_updated_at()
 RETURNS trigger
 LANGUAGE plpgsql
AS $function$
begin
  new.updated_at = now();
  return new;
end;
$function$
;
CREATE OR REPLACE FUNCTION public.set_ceo_workday_updated_at()
 RETURNS trigger
 LANGUAGE plpgsql
AS $function$
begin
  new.updated_at = now();
  return new;
end $function$
;
CREATE OR REPLACE FUNCTION public.business_profile_facts_enforce()
 RETURNS trigger
 LANGUAGE plpgsql
 SET search_path TO 'public'
AS $function$
begin
  new.updated_at := now();
  if tg_op = 'INSERT' then
    if new.approval_status <> 'draft' or new.approved_value is not null or new.approved_at is not null then
      raise exception 'New business facts must start as drafts';
    end if;
    return new;
  end if;

  if new.user_id <> old.user_id then
    raise exception 'Business facts cannot change owner';
  end if;

  if (new.approval_status = 'approved' and old.approval_status <> 'approved')
     or new.approved_value is distinct from old.approved_value
     or new.approved_label is distinct from old.approved_label then
    if new.last_change_actor <> 'founder' then
      raise exception 'Only the founder can approve business facts';
    end if;
    if new.approval_status = 'approved' and (new.value is distinct from new.approved_value or new.label is distinct from new.approved_label) then
      raise exception 'Approval must match the current wording';
    end if;
    if new.approved_value is distinct from old.approved_value or new.approved_label is distinct from old.approved_label then
      new.approved_at := now();
    end if;
  elsif new.approval_status = 'approved'
     and (new.value is distinct from new.approved_value or new.label is distinct from new.approved_label) then
    new.approval_status := 'needs_review';
  end if;
  return new;
end $function$
;
CREATE OR REPLACE FUNCTION public.business_profile_facts_log()
 RETURNS trigger
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
begin
  if tg_op = 'UPDATE'
     and new.label is not distinct from old.label
     and new.value is not distinct from old.value
     and new.approval_status is not distinct from old.approval_status
     and new.approved_value is not distinct from old.approved_value
     and new.category_key is not distinct from old.category_key then
    return new;
  end if;
  insert into public.business_profile_fact_history (
    user_id, fact_id, category_key, action, actor,
    previous_label, new_label, previous_value, new_value,
    previous_status, new_status, previous_approved_value, new_approved_value, note
  ) values (
    new.user_id, new.id, new.category_key, new.last_change_action, new.last_change_actor,
    case when tg_op = 'UPDATE' then old.label end, new.label,
    case when tg_op = 'UPDATE' then old.value end, new.value,
    case when tg_op = 'UPDATE' then old.approval_status end, new.approval_status,
    case when tg_op = 'UPDATE' then old.approved_value end, new.approved_value,
    new.last_change_note
  );
  return new;
end $function$
;
CREATE OR REPLACE FUNCTION public.boss_team_members_enforce()
 RETURNS trigger
 LANGUAGE plpgsql
 SET search_path TO 'public'
AS $function$
begin
  new.updated_at := now();
  if tg_op = 'UPDATE' and new.user_id <> old.user_id then
    raise exception 'Team members cannot change owner';
  end if;
  return new;
end $function$
;
CREATE OR REPLACE FUNCTION public.boss_jobs_enforce()
 RETURNS trigger
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
begin
  new.updated_at := now();

  if new.assignee_team_member_id is not null and not exists (
    select 1 from boss_team_members m where m.id = new.assignee_team_member_id and m.user_id = new.user_id
  ) then
    raise exception 'Team member does not belong to this member';
  end if;

  if tg_op = 'INSERT' then
    if new.last_change_actor <> 'founder' then
      if new.permission_level <> 'research' then
        raise exception 'Only the founder can set a higher permission level';
      end if;
      if new.decision is not null then
        raise exception 'Only the founder can record a decision';
      end if;
      if new.status = 'done' then
        raise exception 'Only the founder can mark a job Done';
      end if;
    end if;
    new.created_by_actor := new.last_change_actor;
    if new.decision is not null then new.decided_at := now(); end if;
    if new.status = 'done' then new.completed_at := now(); end if;
    return new;
  end if;

  if new.user_id <> old.user_id then
    raise exception 'Jobs cannot change owner';
  end if;
  new.created_by_actor := old.created_by_actor;

  if boss_permission_rank(new.permission_level) > boss_permission_rank(old.permission_level)
     and new.last_change_actor <> 'founder' then
    raise exception 'Only the founder can raise a permission level';
  end if;

  if new.decision is distinct from old.decision
     or new.decision_note is distinct from old.decision_note
     or new.last_change_action = 'decided' then
    if new.last_change_actor <> 'founder' then
      raise exception 'Only the founder can record a decision';
    end if;
    new.decided_at := now();
  end if;

  if new.status in ('working', 'done') and new.status is distinct from old.status
     and boss_job_unfinished_prereqs(new.id) then
    raise exception 'This job is waiting on a job that must happen first';
  end if;

  if new.status = 'done' and old.status <> 'done' then
    if new.last_change_actor <> 'founder' then
      raise exception 'Only the founder can mark a job Done';
    end if;
    new.completed_at := now();
  elsif new.status = 'done' then
    new.completed_at := old.completed_at;
  else
    new.completed_at := null;
  end if;

  return new;
end $function$
;
CREATE OR REPLACE FUNCTION public.boss_jobs_log()
 RETURNS trigger
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
declare
  act text := new.last_change_action;
  who text := new.last_change_actor;
  nt text := new.last_change_note;
begin
  if tg_op = 'INSERT' then
    insert into boss_job_history (user_id, job_id, action, actor, field, new_value, note)
    values (new.user_id, new.id, 'created', who, 'title', new.title, nt);
    return new;
  end if;

  if new.title is distinct from old.title then
    insert into boss_job_history (user_id, job_id, action, actor, field, previous_value, new_value, note) values (new.user_id, new.id, act, who, 'title', old.title, new.title, nt);
  end if;
  if new.details is distinct from old.details then
    insert into boss_job_history (user_id, job_id, action, actor, field, previous_value, new_value, note) values (new.user_id, new.id, act, who, 'details', old.details, new.details, nt);
  end if;
  if new.business_function is distinct from old.business_function then
    insert into boss_job_history (user_id, job_id, action, actor, field, previous_value, new_value, note) values (new.user_id, new.id, act, who, 'business_function', old.business_function, new.business_function, nt);
  end if;
  if new.due_date is distinct from old.due_date then
    insert into boss_job_history (user_id, job_id, action, actor, field, previous_value, new_value, note) values (new.user_id, new.id, act, who, 'due_date', old.due_date::text, new.due_date::text, nt);
  end if;
  if new.do_first_rank is distinct from old.do_first_rank then
    insert into boss_job_history (user_id, job_id, action, actor, field, previous_value, new_value, note) values (new.user_id, new.id, act, who, 'do_first_rank', old.do_first_rank::text, new.do_first_rank::text, nt);
  end if;
  if new.assignee_type is distinct from old.assignee_type
     or new.assignee_executive_id is distinct from old.assignee_executive_id
     or new.assignee_team_member_id is distinct from old.assignee_team_member_id then
    insert into boss_job_history (user_id, job_id, action, actor, field, previous_value, new_value, note) values (
      new.user_id, new.id, act, who, 'assignee',
      old.assignee_type || coalesce(':' || old.assignee_executive_id, ':' || old.assignee_team_member_id::text, ''),
      new.assignee_type || coalesce(':' || new.assignee_executive_id, ':' || new.assignee_team_member_id::text, ''),
      nt);
  end if;
  if new.status is distinct from old.status then
    insert into boss_job_history (user_id, job_id, action, actor, field, previous_value, new_value, note) values (new.user_id, new.id, act, who, 'status', old.status, new.status, nt);
  end if;
  if new.paused is distinct from old.paused then
    insert into boss_job_history (user_id, job_id, action, actor, field, previous_value, new_value, note) values (new.user_id, new.id, act, who, 'paused', old.paused::text, new.paused::text, nt);
  end if;
  if new.stopped is distinct from old.stopped then
    insert into boss_job_history (user_id, job_id, action, actor, field, previous_value, new_value, note) values (new.user_id, new.id, act, who, 'stopped', old.stopped::text, new.stopped::text, nt);
  end if;
  if new.permission_level is distinct from old.permission_level then
    insert into boss_job_history (user_id, job_id, action, actor, field, previous_value, new_value, note) values (new.user_id, new.id, act, who, 'permission_level', old.permission_level, new.permission_level, nt);
  end if;
  if new.waiting_question is distinct from old.waiting_question then
    insert into boss_job_history (user_id, job_id, action, actor, field, previous_value, new_value, note) values (new.user_id, new.id, act, who, 'waiting_question', old.waiting_question, new.waiting_question, nt);
  end if;
  if new.whats_ready is distinct from old.whats_ready then
    insert into boss_job_history (user_id, job_id, action, actor, field, previous_value, new_value, note) values (new.user_id, new.id, act, who, 'whats_ready', old.whats_ready, new.whats_ready, nt);
  end if;
  if new.decision is distinct from old.decision
     or new.decision_note is distinct from old.decision_note
     or act = 'decided' then
    insert into boss_job_history (user_id, job_id, action, actor, field, previous_value, new_value, note) values (new.user_id, new.id, act, who, 'decision', old.decision, new.decision, coalesce(new.decision_note, nt));
  end if;
  return new;
end $function$
;
CREATE OR REPLACE FUNCTION public.boss_job_dependencies_enforce()
 RETURNS trigger
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
begin
  if tg_op = 'INSERT' then
    if not exists (select 1 from boss_jobs where id = new.job_id and user_id = new.user_id)
       or not exists (select 1 from boss_jobs where id = new.depends_on_job_id and user_id = new.user_id) then
      raise exception 'Both jobs must belong to this member';
    end if;
    if exists (
      with recursive chain(id) as (
        select new.depends_on_job_id
        union
        select d.depends_on_job_id from boss_job_dependencies d join chain c on d.job_id = c.id
      )
      select 1 from chain where id = new.job_id
    ) then
      raise exception 'These jobs would wait on each other forever';
    end if;
    insert into boss_job_history (user_id, job_id, action, actor, field, new_value)
    values (new.user_id, new.job_id, 'dependency_added', 'founder', 'must_happen_first', new.depends_on_job_id::text);
    return new;
  end if;
  if exists (select 1 from boss_jobs where id = old.job_id) then
    insert into boss_job_history (user_id, job_id, action, actor, field, previous_value)
    values (old.user_id, old.job_id, 'dependency_removed', 'founder', 'must_happen_first', old.depends_on_job_id::text);
  end if;
  return old;
end $function$
;
CREATE OR REPLACE FUNCTION public.ceo_workday_item_job_owner()
 RETURNS trigger
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
begin
  if new.job_id is not null and not exists (
    select 1 from public.boss_jobs j where j.id = new.job_id and j.user_id = new.user_id
  ) then
    raise exception 'job does not belong to this founder' using errcode = '42501';
  end if;
  return new;
end $function$
;
CREATE OR REPLACE FUNCTION public.boss_job_history_immutable()
 RETURNS trigger
 LANGUAGE plpgsql
AS $function$
begin
  if tg_op = 'UPDATE' then
    if new.job_id is null and old.job_id is not null
       and (to_jsonb(new) - 'job_id') = (to_jsonb(old) - 'job_id') then
      return new;
    end if;
    raise exception 'History is permanent and cannot be changed';
  end if;
  if exists (select 1 from auth.users where id = old.user_id) then
    raise exception 'History is permanent and cannot be deleted';
  end if;
  return old;
end $function$
;
CREATE OR REPLACE FUNCTION public.boss_job_proposals_immutable()
 RETURNS trigger
 LANGUAGE plpgsql
AS $function$
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
end $function$
;
CREATE OR REPLACE FUNCTION public.ceo_plan_item_occurrence_owner_check()
 RETURNS trigger
 LANGUAGE plpgsql
 SET search_path TO 'public'
AS $function$
begin
  if new.experience_occurrence_id is not null and not exists (
    select 1 from public.boss_experience_occurrences o
    where o.id = new.experience_occurrence_id and o.user_id = new.user_id
  ) then
    raise exception 'Experience occurrence does not belong to this founder';
  end if;
  return new;
end $function$
;
CREATE OR REPLACE FUNCTION public.ceo_plan_item_completion_basis_guard()
 RETURNS trigger
 LANGUAGE plpgsql
 SET search_path TO 'public'
AS $function$
begin
  if new.completion_basis = 'system-verified'
     and (tg_op = 'INSERT' or old.completion_basis is distinct from 'system-verified')
     and coalesce(auth.role(), '') <> 'service_role' then
    raise exception 'Only an authorized capability can mark work as verified';
  end if;
  return new;
end $function$
;

