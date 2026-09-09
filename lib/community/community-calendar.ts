/**
 * Harmony Lane™ Community Calendar Adapter — Phase 16.1
 * --------------------------------------------------------
 * Wraps EVENTS_CATALOG from lib/events with a flat calendar-entry shape
 * that the Community page calendar section can render without importing
 * the full HarmonyEvent type.
 */

import { EVENTS_CATALOG } from "@/lib/events/events-data"
import type { HarmonyEvent } from "@/lib/events/types"

/** A simplified calendar entry for display. */
export interface CalendarEntry {
  id: string
  title: string
  scheduleLabel: string
  timeRange: string
  days: string
  joinHref: string
  accentColor: string
  nextSessionLabel: string
  isLiveCoWorking: boolean
}

export function toCalendarEntries(): CalendarEntry[] {
  return EVENTS_CATALOG.map((event: HarmonyEvent) => ({
    id: event.id,
    title: event.title,
    scheduleLabel: event.schedule.label,
    timeRange: event.schedule.timeRange,
    days: event.schedule.days,
    joinHref: event.joinHref,
    accentColor: event.accentColor,
    nextSessionLabel: event.schedule.nextSessionLabel,
    isLiveCoWorking: event.category === "live-co-working",
  }))
}

export { EVENTS_CATALOG }
