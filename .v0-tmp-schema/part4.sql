alter table public.boss_experience_occurrences enable row level security;
alter table public.boss_experience_series enable row level security;
alter table public.boss_job_dependencies enable row level security;
alter table public.boss_job_history enable row level security;
alter table public.boss_job_proposals enable row level security;
alter table public.boss_jobs enable row level security;
alter table public.boss_preauthorizations enable row level security;
alter table public.boss_readiness_answers enable row level security;
alter table public.boss_team_members enable row level security;
alter table public.business_context_profiles enable row level security;
alter table public.business_profile_documents enable row level security;
alter table public.business_profile_fact_history enable row level security;
alter table public.business_profile_facts enable row level security;
alter table public.ceo_workday_browser_imports enable row level security;
alter table public.ceo_workday_checkins enable row level security;
alter table public.ceo_workday_day_state enable row level security;
alter table public.ceo_workday_plan_items enable row level security;
alter table public.ceo_workday_plans enable row level security;
alter table public.member_entitlements enable row level security;
alter table public.segment_access_audit enable row level security;
alter table public.segment_access_overrides enable row level security;
alter table public.segment_completions enable row level security;
alter table public.user_profiles enable row level security;

create policy "exp_occ_delete_own" on public.boss_experience_occurrences as PERMISSIVE for DELETE to public using ((user_id = auth.uid()));
create policy "exp_occ_insert_own" on public.boss_experience_occurrences as PERMISSIVE for INSERT to public with check (((user_id = auth.uid()) AND ((series_id IS NULL) OR (EXISTS ( SELECT 1
   FROM boss_experience_series s
  WHERE ((s.id = boss_experience_occurrences.series_id) AND (s.user_id = auth.uid())))))));
create policy "exp_occ_select_own" on public.boss_experience_occurrences as PERMISSIVE for SELECT to public using ((user_id = auth.uid()));
create policy "exp_occ_update_own" on public.boss_experience_occurrences as PERMISSIVE for UPDATE to public using ((user_id = auth.uid())) with check (((user_id = auth.uid()) AND ((series_id IS NULL) OR (EXISTS ( SELECT 1
   FROM boss_experience_series s
  WHERE ((s.id = boss_experience_occurrences.series_id) AND (s.user_id = auth.uid())))))));
create policy "exp_series_delete_own" on public.boss_experience_series as PERMISSIVE for DELETE to public using ((user_id = auth.uid()));
create policy "exp_series_insert_own" on public.boss_experience_series as PERMISSIVE for INSERT to public with check ((user_id = auth.uid()));
create policy "exp_series_select_own" on public.boss_experience_series as PERMISSIVE for SELECT to public using ((user_id = auth.uid()));
create policy "exp_series_update_own" on public.boss_experience_series as PERMISSIVE for UPDATE to public using ((user_id = auth.uid())) with check ((user_id = auth.uid()));
create policy "own deps delete" on public.boss_job_dependencies as PERMISSIVE for DELETE to authenticated using ((auth.uid() = user_id));
create policy "own deps insert" on public.boss_job_dependencies as PERMISSIVE for INSERT to authenticated with check ((auth.uid() = user_id));
create policy "own deps select" on public.boss_job_dependencies as PERMISSIVE for SELECT to authenticated using ((auth.uid() = user_id));
create policy "own job history select" on public.boss_job_history as PERMISSIVE for SELECT to authenticated using ((auth.uid() = user_id));
create policy "own proposals select" on public.boss_job_proposals as PERMISSIVE for SELECT to public using ((auth.uid() = user_id));
create policy "own jobs insert" on public.boss_jobs as PERMISSIVE for INSERT to authenticated with check ((auth.uid() = user_id));
create policy "own jobs select" on public.boss_jobs as PERMISSIVE for SELECT to authenticated using ((auth.uid() = user_id));
create policy "own jobs update" on public.boss_jobs as PERMISSIVE for UPDATE to authenticated using ((auth.uid() = user_id)) with check ((auth.uid() = user_id));
create policy "own preauthorizations select" on public.boss_preauthorizations as PERMISSIVE for SELECT to public using ((auth.uid() = user_id));
create policy "readiness_delete_own" on public.boss_readiness_answers as PERMISSIVE for DELETE to public using ((auth.uid() = user_id));
create policy "readiness_insert_own" on public.boss_readiness_answers as PERMISSIVE for INSERT to public with check ((auth.uid() = user_id));
create policy "readiness_select_own" on public.boss_readiness_answers as PERMISSIVE for SELECT to public using ((auth.uid() = user_id));
create policy "readiness_update_own" on public.boss_readiness_answers as PERMISSIVE for UPDATE to public using ((auth.uid() = user_id)) with check ((auth.uid() = user_id));
create policy "own team insert" on public.boss_team_members as PERMISSIVE for INSERT to authenticated with check ((auth.uid() = user_id));
create policy "own team select" on public.boss_team_members as PERMISSIVE for SELECT to authenticated using ((auth.uid() = user_id));
create policy "own team update" on public.boss_team_members as PERMISSIVE for UPDATE to authenticated using ((auth.uid() = user_id)) with check ((auth.uid() = user_id));
create policy "users_can_delete_own_business_context_profile" on public.business_context_profiles as PERMISSIVE for DELETE to public using ((auth.uid() = user_id));
create policy "users_can_insert_own_business_context_profile" on public.business_context_profiles as PERMISSIVE for INSERT to public with check ((auth.uid() = user_id));
create policy "users_can_update_own_business_context_profile" on public.business_context_profiles as PERMISSIVE for UPDATE to public using ((auth.uid() = user_id)) with check ((auth.uid() = user_id));
create policy "users_can_view_own_business_context_profile" on public.business_context_profiles as PERMISSIVE for SELECT to public using ((auth.uid() = user_id));
create policy "own documents insert" on public.business_profile_documents as PERMISSIVE for INSERT to authenticated with check ((auth.uid() = user_id));
create policy "own documents select" on public.business_profile_documents as PERMISSIVE for SELECT to authenticated using ((auth.uid() = user_id));
create policy "own documents update" on public.business_profile_documents as PERMISSIVE for UPDATE to authenticated using ((auth.uid() = user_id)) with check ((auth.uid() = user_id));
create policy "own fact history select" on public.business_profile_fact_history as PERMISSIVE for SELECT to authenticated using ((auth.uid() = user_id));
create policy "own facts insert" on public.business_profile_facts as PERMISSIVE for INSERT to authenticated with check ((auth.uid() = user_id));
create policy "own facts select" on public.business_profile_facts as PERMISSIVE for SELECT to authenticated using ((auth.uid() = user_id));
create policy "own facts update" on public.business_profile_facts as PERMISSIVE for UPDATE to authenticated using ((auth.uid() = user_id)) with check ((auth.uid() = user_id));
create policy "own import insert" on public.ceo_workday_browser_imports as PERMISSIVE for INSERT to public with check ((auth.uid() = user_id));
create policy "own import select" on public.ceo_workday_browser_imports as PERMISSIVE for SELECT to public using ((auth.uid() = user_id));
create policy "ceo_workday_checkins_owner" on public.ceo_workday_checkins as PERMISSIVE for ALL to public using ((auth.uid() = user_id)) with check ((auth.uid() = user_id));
create policy "own day state insert" on public.ceo_workday_day_state as PERMISSIVE for INSERT to public with check ((auth.uid() = user_id));
create policy "own day state select" on public.ceo_workday_day_state as PERMISSIVE for SELECT to public using ((auth.uid() = user_id));
create policy "own day state update" on public.ceo_workday_day_state as PERMISSIVE for UPDATE to public using ((auth.uid() = user_id)) with check ((auth.uid() = user_id));
create policy "ceo_workday_plan_items_owner" on public.ceo_workday_plan_items as PERMISSIVE for ALL to public using ((auth.uid() = user_id)) with check ((auth.uid() = user_id));
create policy "ceo_workday_plans_owner" on public.ceo_workday_plans as PERMISSIVE for ALL to public using ((auth.uid() = user_id)) with check ((auth.uid() = user_id));
create policy "member_entitlements_select_own" on public.member_entitlements as PERMISSIVE for SELECT to public using ((auth.uid() = user_id));
create policy "segment_access_audit_admin" on public.segment_access_audit as PERMISSIVE for ALL to public using ((EXISTS ( SELECT 1
   FROM user_profiles up
  WHERE ((up.id = auth.uid()) AND (up.role = 'platform_admin'::text))))) with check ((EXISTS ( SELECT 1
   FROM user_profiles up
  WHERE ((up.id = auth.uid()) AND (up.role = 'platform_admin'::text)))));
create policy "segment_access_overrides_admin_write" on public.segment_access_overrides as PERMISSIVE for ALL to public using ((EXISTS ( SELECT 1
   FROM user_profiles up
  WHERE ((up.id = auth.uid()) AND (up.role = 'platform_admin'::text))))) with check ((EXISTS ( SELECT 1
   FROM user_profiles up
  WHERE ((up.id = auth.uid()) AND (up.role = 'platform_admin'::text)))));
create policy "segment_access_overrides_select" on public.segment_access_overrides as PERMISSIVE for SELECT to public using ((auth.role() = 'authenticated'::text));
create policy "Members can manage their own completions" on public.segment_completions as PERMISSIVE for ALL to authenticated using ((( SELECT auth.uid() AS uid) = user_id)) with check ((( SELECT auth.uid() AS uid) = user_id));
create policy "service_role_can_insert_profiles" on public.user_profiles as PERMISSIVE for INSERT to service_role with check (true);
create policy "users_can_insert_own_profile" on public.user_profiles as PERMISSIVE for INSERT to public with check ((auth.uid() = id));
create policy "users_can_update_own_profile" on public.user_profiles as PERMISSIVE for UPDATE to public using ((auth.uid() = id));
create policy "users_can_view_own_profile" on public.user_profiles as PERMISSIVE for SELECT to public using ((auth.uid() = id));

drop trigger if exists on_auth_user_created on auth.users;
CREATE TRIGGER on_auth_user_created AFTER INSERT ON auth.users FOR EACH ROW EXECUTE FUNCTION handle_new_user();
CREATE TRIGGER handle_user_profiles_updated_at BEFORE UPDATE ON public.user_profiles FOR EACH ROW EXECUTE FUNCTION handle_updated_at();
CREATE TRIGGER ceo_workday_plans_set_updated_at BEFORE UPDATE ON public.ceo_workday_plans FOR EACH ROW EXECUTE FUNCTION set_ceo_workday_updated_at();
CREATE TRIGGER ceo_workday_plan_items_set_updated_at BEFORE UPDATE ON public.ceo_workday_plan_items FOR EACH ROW EXECUTE FUNCTION set_ceo_workday_updated_at();
CREATE TRIGGER business_profile_facts_enforce BEFORE INSERT OR UPDATE ON public.business_profile_facts FOR EACH ROW EXECUTE FUNCTION business_profile_facts_enforce();
CREATE TRIGGER business_profile_facts_log AFTER INSERT OR UPDATE ON public.business_profile_facts FOR EACH ROW EXECUTE FUNCTION business_profile_facts_log();
CREATE TRIGGER boss_team_members_enforce BEFORE INSERT OR UPDATE ON public.boss_team_members FOR EACH ROW EXECUTE FUNCTION boss_team_members_enforce();
CREATE TRIGGER boss_jobs_enforce BEFORE INSERT OR UPDATE ON public.boss_jobs FOR EACH ROW EXECUTE FUNCTION boss_jobs_enforce();
CREATE TRIGGER boss_jobs_log AFTER INSERT OR UPDATE ON public.boss_jobs FOR EACH ROW EXECUTE FUNCTION boss_jobs_log();
CREATE TRIGGER boss_job_dependencies_enforce BEFORE INSERT OR DELETE ON public.boss_job_dependencies FOR EACH ROW EXECUTE FUNCTION boss_job_dependencies_enforce();
CREATE TRIGGER ceo_workday_item_job_owner BEFORE INSERT OR UPDATE OF job_id, user_id ON public.ceo_workday_plan_items FOR EACH ROW EXECUTE FUNCTION ceo_workday_item_job_owner();
CREATE TRIGGER boss_job_history_immutable BEFORE DELETE OR UPDATE ON public.boss_job_history FOR EACH ROW EXECUTE FUNCTION boss_job_history_immutable();
CREATE TRIGGER boss_job_proposals_immutable BEFORE UPDATE ON public.boss_job_proposals FOR EACH ROW EXECUTE FUNCTION boss_job_proposals_immutable();
CREATE TRIGGER ceo_plan_item_occurrence_owner BEFORE INSERT OR UPDATE OF experience_occurrence_id, user_id ON public.ceo_workday_plan_items FOR EACH ROW EXECUTE FUNCTION ceo_plan_item_occurrence_owner_check();
CREATE TRIGGER ceo_plan_item_completion_basis_guard BEFORE INSERT OR UPDATE OF completion_basis ON public.ceo_workday_plan_items FOR EACH ROW EXECUTE FUNCTION ceo_plan_item_completion_basis_guard();
