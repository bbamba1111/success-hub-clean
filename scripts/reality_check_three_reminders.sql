-- Independent delivery tracking for the three weekly Reality Check™ reminders.
-- Keep the legacy reminder_sent_at/reminder_error columns for compatibility.
alter table public.reality_check_registrations
  add column if not exists reminder_1_sent_at timestamptz,
  add column if not exists reminder_1_error text,
  add column if not exists reminder_2_sent_at timestamptz,
  add column if not exists reminder_2_error text,
  add column if not exists reminder_3_sent_at timestamptz,
  add column if not exists reminder_3_error text;

create index if not exists reality_check_registrations_session_reminder_1_idx
  on public.reality_check_registrations (session_date)
  where reminder_1_sent_at is null;

create index if not exists reality_check_registrations_session_reminder_2_idx
  on public.reality_check_registrations (session_date)
  where reminder_2_sent_at is null;

create index if not exists reality_check_registrations_session_reminder_3_idx
  on public.reality_check_registrations (session_date)
  where reminder_3_sent_at is null;
