-- Phase 1: Decide -> Embody -> Execute -> Check
-- Additive-only columns. No new tables. Existing RLS ("auth.uid() = user_id")
-- already covers all three tables and needs no changes.

-- segment_intentions: carry the opportunity signal that prompted this decision,
-- when the founder started from the "Where do I need to focus today?" picker.
alter table public.segment_intentions
  add column if not exists opportunity_source text,
  add column if not exists opportunity_area text,
  add column if not exists opportunity_score integer;

-- segment_declarations: the educational companion to the embodiment statement.
alter table public.segment_declarations
  add column if not exists why_it_matters text;

-- segment_completions: preserve the raw 4-state founder-facing check-in value
-- (done | partial | not-yet | changed) alongside the existing 3-state
-- completion_status ("honored" | "modified" | "not-completed") that the
-- existing reflection prompts expect.
alter table public.segment_completions
  add column if not exists founder_check_in_status text;
