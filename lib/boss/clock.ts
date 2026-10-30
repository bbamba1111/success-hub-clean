import { WORKDAY_END, WORKDAY_START } from "./constants"
import type { ClockMode } from "./types"

export type DayPhase = "planning" | "workday" | "after_hours" | "protected_weekend"

export interface ClockReading {
  mode: ClockMode
  isPreview: boolean
  phase: DayPhase
  /** ISO yyyy-mm-dd for the business day being viewed. */
  dateISO: string
  weekday: number
  minutes: number
}

const WEEKDAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"]

export function etNow(now = new Date()) {
  const parts = new Intl.DateTimeFormat("en-US", {
    timeZone: "America/New_York",
    weekday: "short",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    hourCycle: "h23",
  }).formatToParts(now)
  const get = (t: string) => parts.find((p) => p.type === t)?.value ?? ""
  return {
    dateISO: `${get("year")}-${get("month")}-${get("day")}`,
    weekday: WEEKDAYS.indexOf(get("weekday")),
    minutes: Number(get("hour")) * 60 + Number(get("minute")),
  }
}

export function phaseFor(weekday: number, minutes: number): DayPhase {
  const isWorkWeekday = weekday >= 1 && weekday <= 4
  if (isWorkWeekday) {
    if (minutes < WORKDAY_START) return "planning"
    if (minutes < WORKDAY_END) return "workday"
    return weekday === 4 ? "protected_weekend" : "after_hours"
  }
  if (weekday === 0 && minutes >= 22 * 60) return "after_hours"
  return "protected_weekend"
}

export function addDays(dateISO: string, days: number) {
  const d = new Date(`${dateISO}T12:00:00Z`)
  d.setUTCDate(d.getUTCDate() + days)
  return d.toISOString().slice(0, 10)
}

export function weekdayOf(dateISO: string) {
  return new Date(`${dateISO}T12:00:00Z`).getUTCDay()
}

/** Next Monday–Thursday business date strictly after the given date. */
export function nextBusinessDate(dateISO: string) {
  let d = addDays(dateISO, 1)
  while (weekdayOf(d) < 1 || weekdayOf(d) > 4) d = addDays(d, 1)
  return d
}

/** The given date if it is Monday–Thursday, otherwise the next business date. */
export function currentOrNextBusinessDate(dateISO: string) {
  const w = weekdayOf(dateISO)
  return w >= 1 && w <= 4 ? dateISO : nextBusinessDate(dateISO)
}

const PREVIEW_MINUTES: Record<Exclude<ClockMode, "live">, number> = {
  planning: 9 * 60,
  workday: 14 * 60 + 15,
  closeout: WORKDAY_END,
  protected: 12 * 60,
}

export function readClock(mode: ClockMode, businessDate: string, now = new Date()): ClockReading {
  if (mode === "live") {
    const et = etNow(now)
    return { mode, isPreview: false, phase: phaseFor(et.weekday, et.minutes), ...et }
  }
  const minutes = PREVIEW_MINUTES[mode]
  const phase: DayPhase =
    mode === "planning"
      ? "planning"
      : mode === "workday"
        ? "workday"
        : mode === "closeout"
          ? "after_hours"
          : "protected_weekend"
  return { mode, isPreview: true, phase, dateISO: businessDate, weekday: weekdayOf(businessDate), minutes }
}

export function formatMinutes(mins: number) {
  const h = Math.floor(mins / 60)
  const m = mins % 60
  const suffix = h >= 12 ? "PM" : "AM"
  const h12 = h % 12 === 0 ? 12 : h % 12
  return `${h12}:${m.toString().padStart(2, "0")} ${suffix}`
}

export function formatDate(dateISO: string, opts: Intl.DateTimeFormatOptions = { weekday: "long", month: "long", day: "numeric" }) {
  return new Date(`${dateISO}T12:00:00Z`).toLocaleDateString("en-US", { ...opts, timeZone: "UTC" })
}

export function formatDuration(mins: number) {
  if (mins <= 0) return "0m"
  const h = Math.floor(mins / 60)
  const m = mins % 60
  return h ? `${h}h${m ? ` ${m}m` : ""}` : `${m}m`
}

export function formatStamp(iso: string) {
  return new Date(iso).toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
    timeZone: "America/New_York",
  })
}
