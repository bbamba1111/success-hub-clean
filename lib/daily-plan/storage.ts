"use client"

import type { TodaysPlanRecord } from "./types"

/** Local calendar date key, e.g. "2026-08-18". Mirrors `lib/daily-identity/storage.ts`. */
export function getDateKey(date: Date = new Date()): string {
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`
}

const KEY_PREFIX = "todaysPlan:"

/** Fired on window after a save so any live listeners (other Today's cards) can refresh. */
export const TODAYS_PLAN_EVENT = "hl:todays-plan:changed"

function keyFor(dateKey: string): string {
  return `${KEY_PREFIX}${dateKey}`
}

function emptyRecord(dateKey: string): TodaysPlanRecord {
  return {
    dateKey,
    movement: null,
    lunch: [],
    ceoActivities: [],
    timeFreedom: [],
    powerDown: { release: "", tomorrowNote: "", windDownActivity: "" },
    updatedAt: new Date().toISOString(),
  }
}

/** Loads today's (or a given date's) plan, creating an empty one if none exists yet. */
export function loadTodaysPlan(dateKey: string = getDateKey()): TodaysPlanRecord {
  if (typeof window === "undefined") return emptyRecord(dateKey)
  try {
    const raw = localStorage.getItem(keyFor(dateKey))
    if (raw) {
      const parsed = JSON.parse(raw) as TodaysPlanRecord
      // Defensive merge in case the shape grows over time.
      return { ...emptyRecord(dateKey), ...parsed }
    }
  } catch {
    // ignore malformed storage
  }
  return emptyRecord(dateKey)
}

export function saveTodaysPlan(record: TodaysPlanRecord): void {
  if (typeof window === "undefined") return
  try {
    const next: TodaysPlanRecord = { ...record, updatedAt: new Date().toISOString() }
    localStorage.setItem(keyFor(record.dateKey), JSON.stringify(next))
    window.dispatchEvent(new CustomEvent(TODAYS_PLAN_EVENT))
  } catch {
    // ignore storage failures (private browsing, quota, etc.)
  }
}

/** Patches and persists today's (or a given date's) plan. Returns the updated record. */
export function updateTodaysPlan(
  patch: Partial<Omit<TodaysPlanRecord, "dateKey">>,
  dateKey: string = getDateKey(),
): TodaysPlanRecord {
  const current = loadTodaysPlan(dateKey)
  const next: TodaysPlanRecord = { ...current, ...patch, dateKey, updatedAt: new Date().toISOString() }
  saveTodaysPlan(next)
  return next
}
