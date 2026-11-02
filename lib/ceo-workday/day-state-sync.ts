"use client"

/**
 * CEO Workday™ day state — account sync.
 * ---------------------------------------------------------------------------
 * The Today's Work™ queue, hourly work statements, and hour assignments keep
 * their existing synchronous localStorage APIs (so every screen behaves
 * exactly as before), and this module mirrors them to the founder's account:
 *
 *   - Every local write is pushed to /api/ceo-workday/day-state (debounced).
 *   - On load / refocus, the account copy is pulled and written into the
 *     local cache, so the same founder sees the same workday on any device.
 *   - The first time a founder loads with this version, whatever is in their
 *     browser is imported once. The import never overwrites account data.
 */

import useSWR from "swr"
import { getDateKey } from "@/lib/daily-plan/storage"

export const TODAYS_WORK_STORAGE_KEY = "hl:ceo-workday:todays-work:v1"
export const TODAYS_WORK_CHANGED_EVENT = "hl:ceo-workday:todays-work:changed"
export const HOURLY_WORK_STORAGE_KEY = "hl:ceo-workday:hourly-work:v1"
export const HOURLY_WORK_CHANGED_EVENT = "hl:ceo-workday:hourly-work:changed"
export const HOUR_OVERRIDES_PREFIX = "ceo-workday-hour-overrides:"
export const HOUR_OVERRIDES_CHANGED_EVENT = "ceo-workday-hour-overrides-changed"

export type DayStateKind = "todays_work" | "hourly_work" | "hour_overrides"

interface DayStateEntry {
  date: string
  kind: DayStateKind
  payload: Record<string, unknown>
}

interface DayStateRow {
  state_date: string
  kind: DayStateKind
  payload: Record<string, unknown>
}

const ENDPOINT = "/api/ceo-workday/day-state"
const PUSH_DELAY_MS = 600
const DATE_RE = /^\d{4}-\d{2}-\d{2}$/

const pending = new Map<string, { entry: DayStateEntry; timer: ReturnType<typeof setTimeout> }>()
let applyingServerState = false

async function send(entry: DayStateEntry): Promise<void> {
  try {
    const res = await fetch(ENDPOINT, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(entry),
      keepalive: true,
    })
    if (!res.ok && res.status !== 401) console.error("[DayStateSync] save failed:", res.status)
  } catch (error) {
    console.error("[DayStateSync] save failed:", error)
  }
}

/** Called by the local stores after each write. No-op while applying account data. */
export function queueDayStatePush(kind: DayStateKind, date: string, payload: Record<string, unknown>): void {
  if (typeof window === "undefined" || applyingServerState || !DATE_RE.test(date)) return
  const key = `${kind}:${date}`
  const existing = pending.get(key)
  if (existing) clearTimeout(existing.timer)
  const entry = { kind, date, payload }
  const timer = setTimeout(() => {
    pending.delete(key)
    void send(entry)
  }, PUSH_DELAY_MS)
  pending.set(key, { entry, timer })
}

async function flushPending(): Promise<void> {
  const entries = Array.from(pending.values())
  pending.clear()
  await Promise.all(
    entries.map(({ entry, timer }) => {
      clearTimeout(timer)
      return send(entry)
    }),
  )
}

function readJson(key: string): unknown {
  try {
    const raw = localStorage.getItem(key)
    return raw ? JSON.parse(raw) : null
  } catch {
    return null
  }
}

/** Everything currently in this browser, in account-row form, for the one-time import. */
function collectBrowserEntries(): DayStateEntry[] {
  const entries: DayStateEntry[] = []

  const todays = readJson(TODAYS_WORK_STORAGE_KEY) as { date?: string; items?: unknown[] } | null
  if (todays?.date && DATE_RE.test(todays.date) && Array.isArray(todays.items) && todays.items.length > 0) {
    entries.push({ kind: "todays_work", date: todays.date, payload: { items: todays.items } })
  }

  const hourly = readJson(HOURLY_WORK_STORAGE_KEY) as { date?: string; hours?: Record<string, unknown> } | null
  if (hourly?.date && DATE_RE.test(hourly.date) && hourly.hours && typeof hourly.hours === "object") {
    entries.push({ kind: "hourly_work", date: hourly.date, payload: { hours: hourly.hours } })
  }

  for (let i = 0; i < localStorage.length; i++) {
    const key = localStorage.key(i)
    if (!key?.startsWith(HOUR_OVERRIDES_PREFIX)) continue
    const date = key.slice(HOUR_OVERRIDES_PREFIX.length)
    const overrides = readJson(key)
    if (DATE_RE.test(date) && overrides && typeof overrides === "object" && Object.keys(overrides).length > 0) {
      entries.push({ kind: "hour_overrides", date, payload: overrides as Record<string, unknown> })
    }
  }

  return entries
}

function applyRow(row: DayStateRow): void {
  if (row.kind === "todays_work") {
    localStorage.setItem(
      TODAYS_WORK_STORAGE_KEY,
      JSON.stringify({ date: row.state_date, items: Array.isArray(row.payload.items) ? row.payload.items : [] }),
    )
    window.dispatchEvent(new CustomEvent(TODAYS_WORK_CHANGED_EVENT))
  } else if (row.kind === "hourly_work") {
    localStorage.setItem(HOURLY_WORK_STORAGE_KEY, JSON.stringify({ date: row.state_date, hours: row.payload.hours }))
    window.dispatchEvent(new CustomEvent(HOURLY_WORK_CHANGED_EVENT))
  } else {
    localStorage.setItem(`${HOUR_OVERRIDES_PREFIX}${row.state_date}`, JSON.stringify(row.payload))
    window.dispatchEvent(new Event(HOUR_OVERRIDES_CHANGED_EVENT))
  }
}

async function fetchRows(dates: string[]): Promise<{ rows: DayStateRow[]; imported: boolean } | null> {
  const res = await fetch(`${ENDPOINT}?dates=${dates.join(",")}`, { cache: "no-store" })
  if (res.status === 401) return null
  if (!res.ok) throw new Error(`Could not load workday (${res.status})`)
  return res.json()
}

async function syncDayState(dates: string[]): Promise<{ imported: boolean; rows: number }> {
  await flushPending()

  let result = await fetchRows(dates)
  if (!result) return { imported: false, rows: 0 }

  if (!result.imported) {
    const res = await fetch(ENDPOINT, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ entries: collectBrowserEntries() }),
    })
    if (!res.ok) throw new Error(`Browser import failed (${res.status})`)
    result = (await fetchRows(dates)) ?? result
  }

  applyingServerState = true
  try {
    for (const row of result.rows) applyRow(row)
  } finally {
    applyingServerState = false
  }
  return { imported: true, rows: result.rows.length }
}

/**
 * Keeps this browser's workday in step with the founder's account. Safe to
 * call from several CEO Workday™ components — SWR dedupes to one sync.
 */
export function useDayStateSync() {
  const utcToday = new Date().toISOString().slice(0, 10)
  const localToday = getDateKey()
  const dates = utcToday === localToday ? [utcToday] : [utcToday, localToday]
  return useSWR(["ceo-workday-day-state", ...dates], () => syncDayState(dates), {
    revalidateOnFocus: true,
    dedupingInterval: 5_000,
    shouldRetryOnError: false,
  })
}
