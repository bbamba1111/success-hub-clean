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
  updated_at: string
}

export type SaveProblem =
  | { type: "failed"; key: string; entry: DayStateEntry; signedOut: boolean }
  | { type: "conflict"; key: string; entry: DayStateEntry; current: DayStateRow | null }

const ENDPOINT = "/api/ceo-workday/day-state"
const PUSH_DELAY_MS = 600
const DATE_RE = /^\d{4}-\d{2}-\d{2}$/

const pending = new Map<string, { entry: DayStateEntry; timer: ReturnType<typeof setTimeout> }>()
const inFlight = new Set<string>()
/** The account version (updated_at) each key was last loaded/saved at; null = known absent. */
const versions = new Map<string, string | null>()
let versionsLoaded = false
let applyingServerState = false

/* -------------------- save problems (failed saves / conflicts) -------------------- */

const problems = new Map<string, SaveProblem>()
let problemsSnapshot: SaveProblem[] = []
const problemListeners = new Set<() => void>()

function setProblem(key: string, problem: SaveProblem | null) {
  if (problem) problems.set(key, problem)
  else if (!problems.delete(key)) return
  problemsSnapshot = Array.from(problems.values())
  problemListeners.forEach((l) => l())
}

export function subscribeSaveProblems(listener: () => void) {
  problemListeners.add(listener)
  return () => problemListeners.delete(listener)
}
export const getSaveProblems = () => problemsSnapshot
export const getServerSaveProblems = (): SaveProblem[] => []

export function hasUnsavedDayState(): boolean {
  return pending.size > 0 || inFlight.size > 0 || problems.size > 0
}

const keyOf = (kind: DayStateKind, date: string) => `${kind}:${date}`

async function send(entry: DayStateEntry, force = false): Promise<void> {
  const key = keyOf(entry.kind, entry.date)
  inFlight.add(key)
  try {
    const base = versionsLoaded || versions.has(key) ? (versions.get(key) ?? null) : null
    const res = await fetch(ENDPOINT, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...entry, baseUpdatedAt: base, force }),
      keepalive: true,
    })
    if (res.ok) {
      const { updated_at } = (await res.json()) as { updated_at: string }
      versions.set(key, updated_at)
      setProblem(key, null)
    } else if (res.status === 409) {
      const { current } = (await res.json().catch(() => ({}))) as { current?: DayStateRow | null }
      setProblem(key, { type: "conflict", key, entry, current: current ?? null })
    } else {
      setProblem(key, { type: "failed", key, entry, signedOut: res.status === 401 })
    }
  } catch {
    setProblem(key, { type: "failed", key, entry, signedOut: false })
  } finally {
    inFlight.delete(key)
  }
}

/** Called by the local stores after each write. No-op while applying account data. */
export function queueDayStatePush(kind: DayStateKind, date: string, payload: Record<string, unknown>): void {
  if (typeof window === "undefined" || applyingServerState || !DATE_RE.test(date)) return
  const key = keyOf(kind, date)
  const existing = pending.get(key)
  if (existing) clearTimeout(existing.timer)
  const entry = { kind, date, payload }
  // While a conflict is open, keep collecting the founder's edits but don't
  // send them until they choose which version to keep.
  const problem = problems.get(key)
  if (problem?.type === "conflict") {
    setProblem(key, { ...problem, entry })
    return
  }
  const timer = setTimeout(() => {
    pending.delete(key)
    void send(entry)
  }, PUSH_DELAY_MS)
  pending.set(key, { entry, timer })
}

async function flushPending(): Promise<void> {
  const entries = Array.from(pending.values())
  pending.clear()
  const retries = problemsSnapshot.filter((p) => p.type === "failed").map((p) => p.entry)
  await Promise.all([
    ...entries.map(({ entry, timer }) => {
      clearTimeout(timer)
      return send(entry)
    }),
    ...retries.map((entry) => send(entry)),
  ])
}

/** Retry every failed save now. */
export function retryFailedSaves(): Promise<void> {
  return Promise.all(problemsSnapshot.filter((p) => p.type === "failed").map((p) => send(p.entry))).then(() => {})
}

/** Conflict resolution: overwrite the account copy with this device's version. */
export function keepMyVersion(key: string): Promise<void> {
  const problem = problems.get(key)
  return problem ? send(problem.entry, true) : Promise.resolve()
}

/** Conflict resolution: discard this device's edits and load the newer account copy. */
export function acceptNewerVersion(key: string): void {
  const problem = problems.get(key)
  if (problem?.type !== "conflict") return
  setProblem(key, null)
  if (problem.current) {
    applyingServerState = true
    try {
      applyRow(problem.current)
    } finally {
      applyingServerState = false
    }
  } else {
    versions.set(key, null)
  }
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

  const kinds: DayStateKind[] = ["todays_work", "hourly_work", "hour_overrides"]
  const unsaved = (key: string) => pending.has(key) || inFlight.has(key) || problems.has(key)
  for (const date of dates) {
    for (const kind of kinds) {
      const key = keyOf(kind, date)
      if (!unsaved(key)) versions.set(key, null)
    }
  }

  applyingServerState = true
  try {
    for (const row of result.rows) {
      const key = keyOf(row.kind, row.state_date)
      // Never replace this device's unsaved or conflicting edits with the
      // account copy; the founder resolves those explicitly.
      if (unsaved(key)) continue
      versions.set(key, row.updated_at)
      applyRow(row)
    }
  } finally {
    applyingServerState = false
  }
  versionsLoaded = true
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
