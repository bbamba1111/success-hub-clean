-- 022: My 4-Hour CEO Workday Declaration™ on weekly_commitments
-- Additive only. The three weekly priorities are woven into one first-person
-- declaration built in Decide & Design™ and read at the top of the live
-- CEO Workday™ each day of the week.

alter table public.weekly_commitments
  add column if not exists workday_declaration text,
  add column if not exists workday_declaration_variant integer not null default 0,
  add column if not exists workday_declaration_edited boolean not null default false,
  add column if not exists workday_declaration_built_at timestamptz;
