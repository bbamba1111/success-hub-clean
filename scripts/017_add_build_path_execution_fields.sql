-- Phase 11 — Build Path Execution™ additive columns on build_records.
-- Purely additive: no existing column is renamed, dropped, or repurposed.
-- Turns the Phase 10 lifecycle into a true execution loop — recommended-vs-
-- selected Build Path™, a QA gate before ready-to-install, LIVE evidence
-- before installed, a founder-confirmed INSTALLED checklist, a plain
-- activity log, and generate-then-approve communication packages. Matches
-- this table's existing JSONB-for-structured-fields convention.

alter table public.build_records
  add column if not exists recommended_build_path text,
  add column if not exists recommended_build_path_reason text,
  add column if not exists path_selection_reason text,
  add column if not exists qa_gate jsonb not null default '{"items": [], "notes": null}'::jsonb,
  add column if not exists live_evidence jsonb not null default '{"note": null, "confirmedAt": null}'::jsonb,
  add column if not exists installed_checklist jsonb not null default '{"items": []}'::jsonb,
  add column if not exists activity_log jsonb not null default '[]'::jsonb,
  add column if not exists communication_packages jsonb not null default '[]'::jsonb;
