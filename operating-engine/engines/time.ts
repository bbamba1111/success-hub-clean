/**
 * Time Engine
 * The one place timezone math happens. Everything downstream consumes
 * the resolved TimeContext instead of calling `new Date()` itself.
 */
import type { Countdown, Season, TimeContext } from "../types"
import { PLATFORM_TIMEZONE } from "../config/schedule"

const DAY_NAMES = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"]

/** Day-of-year (1–366), stable for a calendar day — used for daily content rotation. */
function dayOfYear(d: Date): number {
  const start = new Date(d.getFullYear(), 0, 0)
  const diff = d.getTime() - start.getTime()
  return Math.floor(diff / 86_400_000)
}

/** Northern-hemisphere season from month index (0–11). */
function seasonFromMonth(month: number): Season {
  if (month >= 2 && month <= 4) return "spring"
  if (month >= 5 && month <= 7) return "summer"
  if (month >= 8 && month <= 10) return "fall"
  return "winter"
}

/**
 * Resolve a full TimeContext for a given instant in the platform timezone.
 * @param now The instant to evaluate (defaults to current time).
 * @param timeZone IANA timezone (defaults to the platform timezone).
 */
export function getTimeContext(now: Date = new Date(), timeZone: string = PLATFORM_TIMEZONE): TimeContext {
  // Project `now` into the platform timezone's wall-clock fields.
  const zoned = new Date(now.toLocaleString("en-US", { timeZone }))
  const hour = zoned.getHours()
  const minute = zoned.getMinutes()

  return {
    now,
    timeZone,
    hour,
    minute,
    minutesSinceMidnight: hour * 60 + minute,
    dayOfWeek: zoned.getDay(),
    dayName: DAY_NAMES[zoned.getDay()],
    isWeekend: zoned.getDay() === 0 || zoned.getDay() === 6,
    dayOfYear: dayOfYear(zoned),
    season: seasonFromMonth(zoned.getMonth()),
  }
}

/** Build a Countdown from a raw minute total. */
export function buildCountdown(totalMinutes: number): Countdown {
  const safe = Math.max(0, Math.round(totalMinutes))
  const hours = Math.floor(safe / 60)
  const minutes = safe % 60
  const label = hours > 0 ? `${hours}h ${minutes}m` : `${minutes}m`
  return { totalMinutes: safe, hours, minutes, label }
}

/** Pick an item from a list by day-of-year so it stays stable for the day. */
export function pickDaily<T>(items: readonly T[], dayOfYearValue: number, fallback: T): T {
  if (!items.length) return fallback
  return items[dayOfYearValue % items.length]
}
