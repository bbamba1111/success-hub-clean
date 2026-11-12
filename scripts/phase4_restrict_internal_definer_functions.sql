-- Phase 4: keep SECURITY DEFINER helpers and trigger functions internal.
-- Founder-facing proposal/approval/preauthorization RPCs remain executable by authenticated.
begin;

revoke all on function public.boss_ai_enabled() from public, anon, authenticated;
revoke all on function public.boss_job_unfinished_prereqs(uuid) from public, anon, authenticated;
revoke all on function public.boss_job_dependencies_enforce() from public, anon, authenticated;
revoke all on function public.boss_jobs_enforce() from public, anon, authenticated;
revoke all on function public.boss_jobs_log() from public, anon, authenticated;
revoke all on function public.business_profile_facts_log() from public, anon, authenticated;
revoke all on function public.ceo_workday_item_job_owner() from public, anon, authenticated;
revoke all on function public.handle_new_user() from public, anon, authenticated;

commit;
