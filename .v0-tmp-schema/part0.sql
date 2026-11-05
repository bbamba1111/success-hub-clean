CREATE OR REPLACE FUNCTION public.boss_action_required_level(p_kind text)
 RETURNS text
 LANGUAGE sql
 IMMUTABLE
AS $function$
  select case p_kind
    when 'job.save_whats_ready' then 'prepare'
    when 'job.set_status' then 'approved_execution'
    else null
  end
$function$;

CREATE OR REPLACE FUNCTION public.boss_job_unfinished_prereqs(p_job_id uuid)
 RETURNS boolean
 LANGUAGE sql
 STABLE SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
  select exists (
    select 1 from boss_job_dependencies d join boss_jobs j on j.id = d.depends_on_job_id
    where d.job_id = p_job_id and j.status <> 'done' and not j.stopped
  )
$function$;

CREATE OR REPLACE FUNCTION public.boss_payload_hash(p_kind text, p_payload jsonb)
 RETURNS text
 LANGUAGE sql
 IMMUTABLE
AS $function$
  select encode(sha256(convert_to(p_kind || '|' || p_payload::text, 'UTF8')), 'hex')
$function$;

CREATE OR REPLACE FUNCTION public.boss_permission_rank(level text)
 RETURNS integer
 LANGUAGE sql
 IMMUTABLE
 SET search_path TO 'public'
AS $function$
  select case level when 'research' then 1 when 'prepare' then 2 when 'approved_execution' then 3 when 'preauthorized_execution' then 4 else 0 end
$function$;
