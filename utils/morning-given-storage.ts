import { createClient } from "@/lib/supabase/client"

/**
 * Morning GIV•EN™ persistence layer.
 *
 * Guiding principle: GIV•EN™ is the input layer for the member's Work-Life
 * Balance Business Day™ — not a disposable journaling exercise. There is ONE
 * living record per member per calendar day, keyed by (user_id, day_key),
 * saved progressively as the member moves through each step (Gratitude →
 * Invitation + Intention → Five-Sense Vision → Embody → Nurture) rather than
 * only at the end.
 *
 * localStorage remains the source of truth for instant UX (and anonymous
 * preview sessions). These functions mirror the record to Supabase, best
 * effort, so today's alignment survives across devices for signed-in
 * members and can be read by other parts of the day later. All writes are
 * best-effort: if the member is not signed in, nothing is written to
 * Supabase and the app continues normally on localStorage alone.
 */

const STORAGE_KEY = "morning-given-days"

export type MorningGivenStep = "gratitude" | "ask" | "vision" | "embody" | "nurture" | "complete"

export interface MorningGivenDayRecord {
  dayKey: string // YYYY-MM-DD, local date
  gratitude: string
  ask: string // Invitation + Intention
  visionSee: string
  visionHear: string
  visionFeel: string
  visionSmell: string
  visionTaste: string
  embody: string[]
  nurture: string[]
  stepCompleted: MorningGivenStep
  completedAt: string | null
}

function emptyRecord(dayKey: string): MorningGivenDayRecord {
  return {
    dayKey,
    gratitude: "",
    ask: "",
    visionSee: "",
    visionHear: "",
    visionFeel: "",
    visionSmell: "",
    visionTaste: "",
    embody: [],
    nurture: [],
    stepCompleted: "gratitude",
    completedAt: null,
  }
}

/** Returns today's local date as YYYY-MM-DD. */
export function getDayKey(date = new Date()): string {
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`
}

function readAllLocal(): Record<string, MorningGivenDayRecord> {
  if (typeof window === "undefined") return {}
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY)
    return raw ? JSON.parse(raw) : {}
  } catch {
    return {}
  }
}

function writeAllLocal(all: Record<string, MorningGivenDayRecord>) {
  if (typeof window === "undefined") return
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(all))
  } catch {
    // Storage full/unavailable — the in-memory app state still works this session.
  }
}

/** Reads today's (or any day_key's) record from localStorage. */
export function getLocalMorningGivenDay(dayKey: string): MorningGivenDayRecord | null {
  return readAllLocal()[dayKey] ?? null
}

/** Merges a partial update into today's (or any day_key's) local record. */
export function saveLocalMorningGivenDay(
  dayKey: string,
  patch: Partial<MorningGivenDayRecord>,
): MorningGivenDayRecord {
  const all = readAllLocal()
  const existing = all[dayKey] ?? emptyRecord(dayKey)
  const next: MorningGivenDayRecord = { ...existing, ...patch, dayKey }
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
export async function syncMorningGivenDay(record: MorningGivenDayRecord): Promise<void> {
  const userId = await getUserId()
  if (!userId) return // anonymous — localStorage still holds the data

  try {
    const supabase = createClient()
    await supabase.from("morning_given_days").upsert(
      {
        user_id: userId,
        day_key: record.dayKey,
        gratitude: record.gratitude,
        ask: record.ask,
        vision_see: record.visionSee,
        vision_hear: record.visionHear,
        vision_feel: record.visionFeel,
        vision_smell: record.visionSmell,
        vision_taste: record.visionTaste,
        embody: record.embody,
        nurture: record.nurture,
        step_completed: record.stepCompleted,
        completed_at: record.completedAt,
        updated_at: new Date().toISOString(),
      },
      { onConflict: "user_id,day_key" },
    )
  } catch (error) {
    console.log("[v0] syncMorningGivenDay skipped:", (error as Error)?.message)
  }
}

interface MorningGivenDayRow {
  day_key: string
  gratitude: string | null
  ask: string | null
  vision_see: string | null
  vision_hear: string | null
  vision_feel: string | null
  vision_smell: string | null
  vision_taste: string | null
  embody: string[] | null
  nurture: string[] | null
  step_completed: MorningGivenStep | null
  completed_at: string | null
}

function rowToRecord(row: MorningGivenDayRow): MorningGivenDayRecord {
  return {
    dayKey: row.day_key,
    gratitude: row.gratitude ?? "",
    ask: row.ask ?? "",
    visionSee: row.vision_see ?? "",
    visionHear: row.vision_hear ?? "",
    visionFeel: row.vision_feel ?? "",
    visionSmell: row.vision_smell ?? "",
    visionTaste: row.vision_taste ?? "",
    embody: row.embody ?? [],
    nurture: row.nurture ?? [],
    stepCompleted: row.step_completed ?? "gratitude",
    completedAt: row.completed_at,
  }
}

/**
 * Loads today's alignment record, preferring Supabase for signed-in members
 * (so it's consistent across devices) and falling back to localStorage for
 * anonymous sessions or on any failure.
 */
export async function getTodaysAlignment(dayKey = getDayKey()): Promise<MorningGivenDayRecord | null> {
  const userId = await getUserId()
  if (!userId) return getLocalMorningGivenDay(dayKey)

  try {
    const supabase = createClient()
    const { data } = await supabase
      .from("morning_given_days")
      .select(
        "day_key, gratitude, ask, vision_see, vision_hear, vision_feel, vision_smell, vision_taste, embody, nurture, step_completed, completed_at",
      )
      .eq("user_id", userId)
      .eq("day_key", dayKey)
      .maybeSingle()

    if (!data) return getLocalMorningGivenDay(dayKey)
    return rowToRecord(data as MorningGivenDayRow)
  } catch (error) {
    console.log("[v0] getTodaysAlignment skipped:", (error as Error)?.message)
    return getLocalMorningGivenDay(dayKey)
  }
}
