/**
 * Harmony Lane™ Events — Type Definitions
 * -----------------------------------------
 * Pure types for the community events catalog. No React, no framework imports.
 */

/** The six event categories on the platform. */
export type EventCategory =
  | "live-co-working"
  | "monday-sync"
  | "office-hours"
  | "founder-circle"
  | "workshop"
  | "special"

/** Recurring cadence for scheduled events. */
export type RecurringPattern =
  | "daily"
  | "weekdays"
  | "weekly"
  | "bi-weekly"
  | "monthly"
  | "one-time"

/** A single scheduled occurrence of an event. */
export interface EventSchedule {
  /** Human-readable schedule label, e.g. "Mon–Thu, 1:00–5:00 PM ET". */
  label: string
  pattern: RecurringPattern
  /** Day(s) of week label, e.g. "Monday–Thursday". */
  days: string
  /** Time range in platform tz, e.g. "1:00–5:00 PM ET". */
  timeRange: string
  /** Next formatted session date/time label for the card, e.g. "Today · 1:00 PM". */
  nextSessionLabel: string
}

/** Host details shown on the event card and detail panel. */
export interface EventHost {
  name: string
  role: string
  /** Optional headshot URL (from /public). */
  avatarUrl?: string
}

/** A single item in the recommended preparation list. */
export interface PrepItem {
  label: string
  description: string
}

/** A complete Harmony Lane™ event entry. */
export interface HarmonyEvent {
  id: string
  category: EventCategory
  /** Short display name, e.g. "Live Co-Working™". */
  title: string
  /** One-line tagline for the card header. */
  tagline: string
  /** 2–3 sentence description for the detail panel. */
  description: string
  schedule: EventSchedule
  /** Duration label, e.g. "4 Hours". */
  duration: string
  host: EventHost
  /** Available seats or "Open" for unlimited sessions. */
  seats: string | number
  /** Direct join link. */
  joinHref: string
  /** Calendar ICS or link for "Add to Calendar". */
  calendarHref?: string
  /** Accent hex color for the category (used for left-border + chip). */
  accentColor: string
  /** Space-separated RGB for the very-light tinted background, e.g. "252 241 239". */
  tintRgb: string
  /** Cherry Blossom pre-session guidance message (shown on Live Co-Working card). */
  cherryBlossomMessage?: string
  /** Whether this event is currently live right now (driven by clock). */
  isLiveNow?: boolean
  /** Whether registration is required. */
  requiresRegistration: boolean
  /** Curated preparation steps shown in the detail panel. */
  prepItems: PrepItem[]
}
