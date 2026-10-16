"use client"

import type { DailyIdentityRecord, IdentityCheckIn } from "./types"

/** Local calendar date key, e.g. "2026-08-18". Mirrors the convention in `lib/wlbb-week/storage.ts`. */
export function getDateKey(date: Date = new Date()): string {
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`
}

const KEY_PREFIX = "dailyIdentity:"

function keyFor(dateKey: string): string {
  return `${KEY_PREFIX}${dateKey}`
}

function emptyRecord(dateKey: string): DailyIdentityRecord {
  return {
    dateKey,
    identityStatement: "",
    boundaryStatement: "",
    ceoOutcomeIds: [],
    checkIn: undefined,
    updatedAt: new Date().toISOString(),
  }
}

/** Loads today's (or a given date's) identity record, creating an empty one if none exists yet. */
export function loadDailyIdentity(dateKey: string = getDateKey()): DailyIdentityRecord {
  if (typeof window === "undefined") return emptyRecord(dateKey)
  try {
    const raw = localStorage.getItem(keyFor(dateKey))
    if (raw) {
      const parsed = JSON.parse(raw) as DailyIdentityRecord
      // Defensive merge in case the shape grows over time.
      return { ...emptyRecord(dateKey), ...parsed }
    }
  } catch {
    // ignore malformed storage
  }
  return emptyRecord(dateKey)
}

/** Same-tab change notification (the native `storage` event only fires in other tabs). */
export const DAILY_IDENTITY_CHANGED_EVENT = "daily-identity:changed"

export function saveDailyIdentity(record: DailyIdentityRecord): void {
  if (typeof window === "undefined") return
  try {
    const next: DailyIdentityRecord = { ...record, updatedAt: new Date().toISOString() }
    localStorage.setItem(keyFor(record.dateKey), JSON.stringify(next))
    window.dispatchEvent(new CustomEvent(DAILY_IDENTITY_CHANGED_EVENT, { detail: { dateKey: record.dateKey } }))
  } catch {
    // ignore storage failures (private browsing, quota, etc.)
  }
}

/** Patches and persists today's (or a given date's) identity record. Returns the updated record. */
export function updateDailyIdentity(
  dateKey: string,
  patch: Partial<Omit<DailyIdentityRecord, "dateKey">>,
): DailyIdentityRecord {
  const current = loadDailyIdentity(dateKey)
  const next: DailyIdentityRecord = { ...current, ...patch, dateKey, updatedAt: new Date().toISOString() }
  saveDailyIdentity(next)
  return next
}

export function recordIdentityCheckIn(dateKey: string, checkIn: IdentityCheckIn): DailyIdentityRecord {
  return updateDailyIdentity(dateKey, { checkIn })
}
