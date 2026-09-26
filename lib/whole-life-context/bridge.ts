/**
 * Whole-Life Context™ Bridge — Phase 9.0
 * ---------------------------------------------------------------------------
 * Converts the rich LifeEvent[] from the Whole-Life Context™ storage layer
 * into the lightweight UpcomingLifeEvent[] shape that
 * cherry-blossom-guidance.ts uses for proactive awareness signals.
 *
 * This separation preserves the PURE principle of cherry-blossom-guidance.ts
 * (no direct storage imports) while making the connection available to any
 * component that wants to pass life events into Cherry Blossom's voice.
 *
 * PURE: no React. Safe to call from any context (server or client).
 * Reads from localStorage via getUpcomingLifeEvents — call client-side only.
 */

import { getUpcomingLifeEvents } from "./storage"
import type { UpcomingLifeEvent } from "@/lib/harmony-context/cherry-blossom-guidance"

/**
 * Returns the upcoming life events within the specified awareness window,
 * mapped to the UpcomingLifeEvent[] shape Cherry Blossom™ reads.
 *
 * @param withinDays - how many days ahead to look (default: 14)
 */
export function deriveUpcomingCherryBlossomEvents(
  withinDays = 14,
): UpcomingLifeEvent[] {
  if (typeof window === "undefined") return []

  const events = getUpcomingLifeEvents(withinDays)
  const now = new Date()
  const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate())

  return events.map((e) => {
    const eventDate = new Date(e.date)
    const startOfEvent = new Date(eventDate.getFullYear(), eventDate.getMonth(), eventDate.getDate())
    const diffMs = startOfEvent.getTime() - startOfToday.getTime()
    const daysUntil = Math.max(0, Math.round(diffMs / (1000 * 60 * 60 * 24)))

    return {
      label: e.title,
      daysUntil,
      requiresProtection:
        e.significance === "life-defining" ||
        e.significance === "high" ||
        e.requiresPreparation === true,
    }
  })
}
