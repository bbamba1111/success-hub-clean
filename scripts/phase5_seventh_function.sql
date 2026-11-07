-- Phase 5 Step 2a: add the seventh business function, "Other — Bring & Create Your Own Work".
-- Widen-only: every existing row stays valid and nothing is renamed.
-- BO$$ tables use `own_work`; CEO Workday tables use `own-work` (hyphen style). Legacy `own` is untouched.

alter table public.boss_jobs drop constraint if exists boss_jobs_business_function_check;
alter table public.boss_jobs add constraint boss_jobs_business_function_check
  check (business_function = any (array['attraction','sales','delivery','operations','design','experiences','own_work']));

alter table public.boss_team_members drop constraint if exists boss_team_members_business_functions_check;
alter table public.boss_team_members add constraint boss_team_members_business_functions_check
  check (business_functions <@ array['attraction','sales','delivery','operations','design','experiences','own_work']);

alter table public.ceo_workday_plan_items drop constraint if exists ceo_workday_plan_items_business_function_check;
alter table public.ceo_workday_plan_items add constraint ceo_workday_plan_items_business_function_check
  check (business_function = any (array[
    'client-attraction','sales-conversion','delivery','operations','operations-design','trust-experiences','own-work',
    'build','decide','own','delegate','systemize','augment-automate-ai','connect','communicate','sell','market','deliver','solve'
  ]));

create or replace function public.boss_grant_preauthorization(
  p_job_id uuid, p_business_function text, p_action_kinds text[], p_expires_at timestamptz,
  p_max_uses integer default null, p_note text default null)
returns uuid
language plpgsql
security definer
set search_path to 'public'
as $function$
declare
  uid uuid := auth.uid();
  k text;
  new_id uuid;
begin
  if uid is null then raise exception 'Not signed in'; end if;
  if p_job_id is not null and not exists (select 1 from boss_jobs where id = p_job_id and user_id = uid) then
    raise exception 'Job not found';
  end if;
  if p_job_id is null and (p_business_function is null or p_business_function <> all (
       array['attraction','sales','delivery','operations','design','experiences','own_work'])) then
    raise exception 'That business area is not recognized';
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
end $function$;
