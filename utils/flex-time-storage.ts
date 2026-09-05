import { createClient } from "@/lib/supabase/client"

/**
 * Flex Time & Preparation™ accountability persistence layer.
 *
 * Guiding principle: Flex Time™ creates flexibility — it does not create
 * another obligation to squeeze everything into the day. There is ONE living
 * record per member per calendar day, keyed by (user_id, day_key). It starts
 * with what the member said they'd do (the Guided Moments™ selections), and
 * is enriched once at the 8:55 check-in with what actually got done, what's
 * outstanding, and how the member chose to handle it (borrow time from an
 * eligible segment, or intentionally defer to tomorrow's Flex Time™).
 *
 * localStorage remains the source of truth for instant UX (and for anonymous
 * preview sessions). These functions mirror completed data to Supabase, best
 * effort, so "My Flex Time™ History" survives across devices for signed-in
 * members. All writes are best-effort: if the member is not signed in nothing
 * is written to Supabase and the app continues normally on localStorage alone.
 */

const STORAGE_KEY = "flex-time-days"

export type BorrowSource = "morning-given" | "healthy-hybrid-lunch"
export type DayResolution = "complete" | "borrowed" | "deferred"

export interface FlexTimeDayRecord {
  dayKey: string // YYYY-MM-DD, local date
  intended: string[]
  completed: string[]
  outstanding: string[]
  resolution: DayResolution | null
  borrowedFrom: BorrowSource | null
  borrowedItems: string[]
  deferredItems: string[]
  checkedInAt: string | null
}

/** Returns today's local date as YYYY-MM-DD. */
export function getDayKey(date = new Date()): string {
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`
}

/** Mon=1 ... Sun=0, matching Date#getDay(). */
export function getDayOfWeek(date = new Date()): number {
  return date.getDay()
}

function readAllLocal(): Record<string, FlexTimeDayRecord> {
  if (typeof window === "undefined") return {}
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY)
    return raw ? JSON.parse(raw) : {}
  } catch {
    return {}
  }
}

function writeAllLocal(all: Record<string, FlexTimeDayRecord>) {
  if (typeof window === "undefined") return
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(all))
  } catch {
    // Storage full/unavailable — the in-memory app state still works this session.
  }
}

/** Reads today's (or any day_key's) record from localStorage. */
export function getLocalDay(dayKey: string): FlexTimeDayRecord | null {
  return readAllLocal()[dayKey] ?? null
}

/** Reads every stored day, most recent first. */
export function getAllLocalDays(): FlexTimeDayRecord[] {
  return Object.values(readAllLocal()).sort((a, b) => (a.dayKey < b.dayKey ? 1 : -1))
}

/** Merges a partial update into today's (or any day_key's) local record. */
export function saveLocalDay(dayKey: string, patch: Partial<FlexTimeDayRecord>): FlexTimeDayRecord {
  const all = readAllLocal()
  const existing: FlexTimeDayRecord = all[dayKey] ?? {
    dayKey,
    intended: [],
    completed: [],
    outstanding: [],
    resolution: null,
    borrowedFrom: null,
    borrowedItems: [],
    deferredItems: [],
    checkedInAt: null,
  }
  const next: FlexTimeDayRecord = { ...existing, ...patch, dayKey }
  all[dayKey] = next
  writeAllLocal(all)
  return next
}

/**
 * Resolves the current signed-in user id, or null if anonymous.
 * Never throws — callers treat null as "skip Supabase persistence".
 */
async function getUserId(): Promise<string | null> {
  try {
    const supabase = createClient()
    const {
      data: { user },
    } = await supabase.auth.getUser()
    return user?.id ?? null
  } catch {
    return null
  }
}

/**
 * Mirrors a day's record to Supabase, best-effort. Safe to call repeatedly —
 * upserts on (user_id, day_key) so there is never a duplicate row for the day.
 */
export async function syncFlexTimeDay(record: FlexTimeDayRecord): Promise<void> {
  const userId = await getUserId()
  if (!userId) return // anonymous — localStorage still holds the data

  try {
    const supabase = createClient()
    await supabase.from("flex_time_days").upsert(
      {
        user_id: userId,
        day_key: record.dayKey,
        intended: record.intended,
        completed: record.completed,
        outstanding: record.outstanding,
        resolution: record.resolution,
        borrowed_from: record.borrowedFrom,
        borrowed_items: record.borrowedItems,
        deferred_items: record.deferredItems,
        checked_in_at: record.checkedInAt,
        updated_at: new Date().toISOString(),
      },
      { onConflict: "user_id,day_key" },
    )
  } catch (error) {
    console.log("[v0] syncFlexTimeDay skipped:", (error as Error)?.message)
  }
}

interface FlexTimeDayRow {
  day_key: string
  intended: string[] | null
  completed: string[] | null
  outstanding: string[] | null
  resolution: DayResolution | null
  borrowed_from: BorrowSource | null
  borrowed_items: string[] | null
  deferred_items: string[] | null
  checked_in_at: string | null
}

function rowToRecord(row: FlexTimeDayRow): FlexTimeDayRecord {
  return {
    dayKey: row.day_key,
    intended: row.intended ?? [],
    completed: row.completed ?? [],
    outstanding: row.outstanding ?? [],
    resolution: row.resolution,
    borrowedFrom: row.borrowed_from,
    borrowedItems: row.borrowed_items ?? [],
    deferredItems: row.deferred_items ?? [],
    checkedInAt: row.checked_in_at,
  }
}

/**
 * Loads the member's Flex Time™ History from Supabase (most recent first).
 * Falls back to the local cache for anonymous sessions or on any failure, so
 * "My Flex Time™ History" always has something sensible to render.
 */
export async function getFlexTimeHistory(limit = 30): Promise<FlexTimeDayRecord[]> {
  const userId = await getUserId()
  if (!userId) return getAllLocalDays()

  try {
    const supabase = createClient()
    const { data } = await supabase
      .from("flex_time_days")
      .select("day_key, intended, completed, outstanding, resolution, borrowed_from, borrowed_items, deferred_items, checked_in_at")
      .eq("user_id", userId)
      .order("day_key", { ascending: false })
      .limit(limit)

    if (!data) return getAllLocalDays()
    return (data as FlexTimeDayRow[]).map(rowToRecord)
  } catch (error) {
    console.log("[v0] getFlexTimeHistory skipped:", (error as Error)?.message)
    return getAllLocalDays()
  }
}
