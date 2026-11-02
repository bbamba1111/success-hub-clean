-- 026: One accepted assignment per (founder, occurrence, work option).
-- Additive only. Scoped to occurrence-linked rows so other assignment_key
-- uses (and historical rows whose occurrence was deleted -> NULL) are untouched.
-- Verified before applying: no existing duplicates.

create unique index if not exists ceo_workday_plan_items_occurrence_assignment_uniq
  on public.ceo_workday_plan_items (user_id, experience_occurrence_id, assignment_key)
  where experience_occurrence_id is not null and assignment_key is not null;
