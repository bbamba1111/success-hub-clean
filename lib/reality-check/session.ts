/**
 * The Weekly Work-Life Balance Reality Check™ runs every Sunday, live online.
 * Start time confirmed by the founder: 3:00 PM America/New_York.
 * Duration (90 minutes) is the recommended setting from the campaign brief.
 */
export const SESSION_TIME_ZONE = "America/New_York"
export const SESSION_START_HOUR = 15
export const SESSION_DURATION_MINUTES = 90
export const SESSION_TIME_LABEL = "3:00 PM ET"
export const SESSION_DURATION_LABEL = "90 minutes"

const FOUNDER_PRICING_DEADLINE_ISO = "2026-12-31"
export const FOUNDER_PRICING_DEADLINE = "December 31"

function easternParts(date: Date) {
  const parts = new Intl.DateTimeFormat("en-US", {
    timeZone: SESSION_TIME_ZONE,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    weekday: "short",
    hour: "2-digit",
    minute: "2-digit",
    hourCycle: "h23",
  }).formatToParts(date)
  const get = (type: string) => parts.find((p) => p.type === type)?.value ?? ""
  const weekdays = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"]
  return {
    year: Number(get("year")),
    month: Number(get("month")),
    day: Number(get("day")),
    weekday: weekdays.indexOf(get("weekday")),
    hour: Number(get("hour")),
  }
}

/**
 * ISO date (YYYY-MM-DD) of the upcoming Sunday session in Eastern time.
 * On Sunday, today's session counts until it starts at 3:00 PM ET; after that
 * the following Sunday is returned.
 */
export function nextSessionDate(now: Date = new Date()): string {
  const { year, month, day, weekday, hour } = easternParts(now)
  let offset = (7 - weekday) % 7
  if (offset === 0 && hour >= SESSION_START_HOUR) offset = 7
  return new Date(Date.UTC(year, month - 1, day + offset)).toISOString().slice(0, 10)
}

/** UTC instant when the session on `isoDate` starts (3:00 PM ET, DST-aware). */
export function sessionStartsAt(isoDate: string): Date {
  const [y, m, d] = isoDate.split("-").map(Number)
  for (const utcHour of [SESSION_START_HOUR + 4, SESSION_START_HOUR + 5]) {
    const candidate = new Date(Date.UTC(y, m - 1, d, utcHour))
    if (easternParts(candidate).hour === SESSION_START_HOUR) return candidate
  }
  return new Date(Date.UTC(y, m - 1, d, SESSION_START_HOUR + 5))
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

/** True while founder pricing is still open (through Dec 31, 2026, Eastern). */
export function isFounderPricingOpen(now: Date = new Date()): boolean {
  const { year, month, day } = easternParts(now)
  const today = `${year}-${String(month).padStart(2, "0")}-${String(day).padStart(2, "0")}`
  return today <= FOUNDER_PRICING_DEADLINE_ISO
}
