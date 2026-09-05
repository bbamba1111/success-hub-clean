-- Splits the combined "ask" field on morning_given_days into two separate
-- entries — Invitation and Intention — matching the updated Morning GIV•EN™
-- flow (components/guided-moments/morning-given-experience.tsx).
--
-- `intention` is the founder's own words; `intention_declaration` is Cherry
-- Blossom's™ identity-based rewrite of it (same technology/tables used by
-- the Identity Installation System™: /api/identity/intention +
-- /api/identity/declaration, segment_id "morning-given"), kept here as a
-- local copy for the Morning GIV•EN™ summary card.

alter table public.morning_given_days
  add column if not exists invitation text,
  add column if not exists intention text,
  add column if not exists intention_declaration text;

-- Best-effort backfill: existing combined "ask" text becomes the Intention
-- entry so no in-progress or completed day loses its content.
update public.morning_given_days
  set intention = ask
  where ask is not null and intention is null;

alter table public.morning_given_days
  drop column if exists ask;
