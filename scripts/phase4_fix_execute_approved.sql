-- Phase 4 fix: approved (non-pre-authorized) proposals failed with
-- 'record "pre" is not assigned yet' because the record was only populated on the
-- pre-authorization path. The grant id is now held in a plain uuid variable.
-- Authorization logic is unchanged.

begin;

create or replace function public.boss_execute_proposal(p_proposal_id uuid) returns jsonb
language plpgsql security definer set search_path = public as $$
declare
  uid uuid := auth.uid();
  p record;
  j record;
  pre_id uuid;
  required_level text;
  via text;
  refusal text;
  err text;
begin
  if uid is null then return jsonb_build_object('ok', false, 'reason', 'Not signed in'); end if;

  select * into p from boss_job_proposals where id = p_proposal_id and user_id = uid for update;
  if not found then return jsonb_build_object('ok', false, 'reason', 'Proposal not found'); end if;
  select * into j from boss_jobs where id = p.job_id and user_id = uid for update;
  if not found then return jsonb_build_object('ok', false, 'reason', 'Job not found'); end if;
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
    select a.id into pre_id from boss_preauthorizations a
     where a.user_id = uid and a.revoked_at is null and a.expires_at > now()
       and (a.max_uses is null or a.uses < a.max_uses)
       and p.action_kind = any (a.action_kinds)
       and (a.job_id = j.id or (a.job_id is null and a.business_function = j.business_function))
     order by a.job_id nulls last, a.expires_at
     limit 1 for update;
    if pre_id is not null then via := 'preauthorization'; else refusal := 'Not approved and no active pre-authorization covers it'; end if;
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
    update boss_preauthorizations set uses = uses + 1 where id = pre_id;
  end if;

  update boss_job_proposals
     set status = case when err is null then 'executed' else 'failed' end,
         executed_at = now(), preauthorization_id = pre_id,
         execution_result = case when err is null then 'done via ' || via end, error = err
   where id = p.id;

  insert into boss_job_history (user_id, job_id, action, actor, field, note, proposal_id, preauthorization_id,
                                ai_capability, permission_level, result, error)
  values (uid, p.job_id, case when err is null then 'executed' else 'execution_failed' end, p.proposed_by, 'proposal',
          p.summary, p.id, pre_id, p.ai_capability, j.permission_level,
          case when err is null then 'done via ' || via else 'failed' end, err);

  return jsonb_build_object('ok', err is null, 'via', via, 'reason', err);
end $$;

revoke all on function public.boss_execute_proposal(uuid) from public, anon;
grant execute on function public.boss_execute_proposal(uuid) to authenticated;

commit;
