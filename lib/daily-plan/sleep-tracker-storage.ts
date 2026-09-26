/**
 * Sleep Tracker™ — deferred next-morning completion state.
 * ---------------------------------------------------------------------------
 * The Sleep Tracker™ is unlike every other 5-Minute Check-In™: the founder
 * cannot report the night's actual sleep at 10:55 PM when Power Down™ ends. So
 * the sleep INTENTION (target / bedtime / wake / declaration) is set in the
 * evening during Power Down™, but the ACTUAL sleep is recorded the FOLLOWING
 * MORNING during Flex Time™, before Morning GIV•EN™ begins.
 *
 * This module holds only the small "pending intention" record that bridges the
 * two moments. The completed sleep record itself still lives in the existing
 * `sleepEntries_v2` history (owned by SleepTrackerWidget); we do not duplicate
 * that model here.
 *
 * A pending intention is associated with the WAKE date (the morning it should
 * be logged), so a Monday-night intention set in the evening is logged on
 * Tuesday morning and associated with Tuesday's date.
 */

export interface PendingSleepIntention {
  /** YYYY-MM-DD (local) of the morning this sleep should be logged — the wake date. */
  nightKey: string
  targetHours: number
  bedtime: string
  wakeTime: string
  declaration: string
  /** ISO timestamp of when the intention was set (the evening before). */
  setAt: string
}

const PENDING_KEY = "sleepPendingIntention_v1"

/** Local YYYY-MM-DD for a date (no timezone conversion — uses the device's day). */
export function localDateKey(d: Date = new Date()): string {
  const y = d.getFullYear()
  const m = String(d.getMonth() + 1).padStart(2, "0")
  const day = String(d.getDate()).padStart(2, "0")
  return `${y}-${m}-${day}`
}

/**
 * The wake date an intention set "now" belongs to:
 *   • evening / night (>= 6 PM) → tomorrow morning
 *   • late night / pre-dawn (< 12 PM) → today (this morning)
 *   • afternoon → tomorrow morning
 * This keeps the sleep record attached to the correct night's morning.
 */
export function computeSleepNightKey(now: Date = new Date()): string {
  const hour = now.getHours()
  const target = new Date(now)
  if (hour >= 12) {
    // Set in the afternoon/evening → the sleep happens tonight, logged tomorrow.
    target.setDate(target.getDate() + 1)
  }
  // Set before noon → this morning (log today).
  return localDateKey(target)
}

function isBrowser(): boolean {
  return typeof window !== "undefined"
}

/** Persist the evening intention as the single outstanding pending record. */
export function saveSleepIntention(data: Omit<PendingSleepIntention, "setAt"> & { setAt?: string }): PendingSleepIntention {
  const record: PendingSleepIntention = {
    nightKey: data.nightKey,
    targetHours: data.targetHours,
    bedtime: data.bedtime,
    wakeTime: data.wakeTime,
    declaration: data.declaration,
    setAt: data.setAt ?? new Date().toISOString(),
  }
  if (isBrowser()) {
    try {
      window.localStorage.setItem(PENDING_KEY, JSON.stringify(record))
    } catch {
      // storage unavailable — fail silently
    }
  }
  return record
}

/** The outstanding pending intention, or null if none is awaiting completion. */
export function getPendingSleepIntention(): PendingSleepIntention | null {
  if (!isBrowser()) return null
  try {
    const raw = window.localStorage.getItem(PENDING_KEY)
    if (!raw) return null
    const parsed = JSON.parse(raw) as PendingSleepIntention
    if (!parsed || typeof parsed.nightKey !== "string") return null
    return parsed
  } catch {
    return null
  }
}

/** Clear the pending record once the morning completion has been logged. */
export function clearPendingSleepIntention(): void {
  if (!isBrowser()) return
  try {
    window.localStorage.removeItem(PENDING_KEY)
  } catch {
    // ignore
  }
}

/**
 * True when a pending intention is ready to be COMPLETED — its morning has
 * arrived (today's date has reached the wake date). Before then the intention
 * is set but deferred ("complete tomorrow morning").
 */
export function isSleepIntentionActionable(pending: PendingSleepIntention, now: Date = new Date()): boolean {
  return localDateKey(now) >= pending.nightKey
}
