-- Phase 2: add the seventh business function, "Thought Leadership & Intellectual Property".
-- Widen-only: every existing value (including legacy Own Work) stays valid and no rows are reclassified.
-- BO$$ tables use `thought_leadership`; CEO Workday tables use `thought-leadership` (hyphen style).

alter table public.boss_jobs drop constraint if exists boss_jobs_business_function_check;
alter table public.boss_jobs add constraint boss_jobs_business_function_check
  check (business_function = any (array['attraction','sales','delivery','operations','design','experiences','thought_leadership','own_work']));

alter table public.boss_team_members drop constraint if exists boss_team_members_business_functions_check;
alter table public.boss_team_members add constraint boss_team_members_business_functions_check
  check (business_functions <@ array['attraction','sales','delivery','operations','design','experiences','thought_leadership','own_work']);

alter table public.ceo_workday_plan_items drop constraint if exists ceo_workday_plan_items_business_function_check;
alter table public.ceo_workday_plan_items add constraint ceo_workday_plan_items_business_function_check
  check (business_function = any (array[
    'client-attraction','sales-conversion','delivery','operations','operations-design','trust-experiences','thought-leadership','own-work',
    'build','decide','own','delegate','systemize','augment-automate-ai','connect','communicate','sell','market','deliver','solve'
  ]));
