/**
 * Cherry Blossom™ Time-Aware Greeting Helper
 * -----------------------------------------------
 * Pure, zero-dependency function that maps minutes-since-midnight to a
 * fully-formed greeting object. The member engine delegates here so the
 * "Good Night" wind-down message appears at 10 PM+ without any component
 * changes — every greeting site already reads `experience.member.greeting`.
 */
import type { GreetingPeriod } from "@/operating-engine/types"

export interface GreetingResult {
  period: GreetingPeriod
  greeting: string
  emoji: string
  /** Optional supporting message shown beneath the greeting on Night period. */
  supportingMessage?: string
}

/**
 * Returns the greeting details for the given time.
 * Boundaries (minutes-since-midnight, inclusive start / exclusive end):
 *   Morning   05:00 – 11:59  (300–719)
 *   Afternoon 12:00 – 16:59  (720–1019)
 *   Evening   17:00 – 21:59  (1020–1319)
 *   Night     22:00 – 04:59  (1320–1439, 0–299)
 *
 * @param minutesSinceMidnight  0–1439
 * @param firstName             Personalised first name (default: "Friend")
 */
export function getGreetingByTime(
  minutesSinceMidnight: number,
  firstName = "Friend",
): GreetingResult {
  const m = minutesSinceMidnight

  // Night: 22:00–04:59 (wraps past midnight)
  if (m >= 22 * 60 || m < 5 * 60) {
    return {
      period: "Night",
      greeting: `Good Night, ${firstName}`,
      emoji: "🌙",
      supportingMessage:
        "Rest well. Your tomorrow begins with the sleep you give yourself tonight.",
    }
  }

  // Morning: 05:00–11:59
  if (m < 12 * 60) {
    return {
      period: "Morning",
      greeting: `Good Morning, ${firstName}`,
      emoji: "🌸",
    }
  }

  // Afternoon: 12:00–16:59
  if (m < 17 * 60) {
    return {
      period: "Afternoon",
      greeting: `Good Afternoon, ${firstName}`,
      emoji: "🌿",
    }
  }

  // Evening: 17:00–21:59
  return {
    period: "Evening",
    greeting: `Good Evening, ${firstName}`,
    emoji: "🌙",
  }
}
