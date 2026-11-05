-- Independent delivery tracking for the two weekly Reality Check™ reminders:
--   reminder_1 = Saturday 3:00 PM ET planning reminder
--   reminder_2 = Sunday 1:00 PM ET preparation reminder
-- Additive only. Legacy columns (reminder_sent_at/reminder_error, and the
-- reminder_3_* columns if an earlier three-reminder draft created them) are
-- intentionally left in place and are no longer written.
alter table public.reality_check_registrations
  add column if not exists reminder_1_sent_at timestamptz,
  add column if not exists reminder_1_error text,
  add column if not exists reminder_2_sent_at timestamptz,
  add column if not exists reminder_2_error text;

create index if not exists reality_check_registrations_session_reminder_1_idx
  on public.reality_check_registrations (session_date)
  where reminder_1_sent_at is null;

create index if not exists reality_check_registrations_session_reminder_2_idx
  on public.reality_check_registrations (session_date)
  where reminder_2_sent_at is null;
