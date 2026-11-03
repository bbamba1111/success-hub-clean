/**
 * The Work-Life Balance Reality Check™ runs every Sunday, live online.
 * Dates are computed in US Eastern time so the "next session" flips over
 * at midnight ET Sunday night, not at the server's UTC midnight.
 */
export const SESSION_TIME_LABEL = "Time & time zone in your confirmation"
export const FOUNDER_PRICING_DEADLINE = "December 31"

function easternParts(date: Date) {
  const parts = new Intl.DateTimeFormat("en-US", {
    timeZone: "America/New_York",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    weekday: "short",
  }).formatToParts(date)
  const get = (type: string) => parts.find((p) => p.type === type)?.value ?? ""
  const weekdays = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"]
  return {
    year: Number(get("year")),
    month: Number(get("month")),
    day: Number(get("day")),
    weekday: weekdays.indexOf(get("weekday")),
  }
}

/** ISO date (YYYY-MM-DD) of the upcoming Sunday session — today if it is Sunday in ET. */
export function nextSessionDate(now: Date = new Date()): string {
  const { year, month, day, weekday } = easternParts(now)
  const offset = (7 - weekday) % 7
  const target = new Date(Date.UTC(year, month - 1, day + offset))
  return target.toISOString().slice(0, 10)
}

export function formatSessionDate(isoDate: string): string {
  const [y, m, d] = isoDate.split("-").map(Number)
  return new Intl.DateTimeFormat("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
    timeZone: "UTC",
  }).format(new Date(Date.UTC(y, m - 1, d)))
}
