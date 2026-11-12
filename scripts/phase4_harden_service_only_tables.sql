-- Phase 4 hardening: app settings and AI usage events are server/service-role only.
-- RLS remains enabled and intentionally has no end-user policies.
begin;

revoke all privileges on table public.app_settings from public, anon, authenticated;
revoke all privileges on table public.ai_usage_events from public, anon, authenticated;

grant all privileges on table public.app_settings to service_role;
grant all privileges on table public.ai_usage_events to service_role;
grant usage, select on sequence public.ai_usage_events_id_seq to service_role;

commit;
