import type { SupabaseClient } from "@supabase/supabase-js"

/**
 * Cherry Blossom's Memory Vault™ — long-term, structured member memory.
 *
 * This module is the single source of truth for reading and writing the
 * `member_memory` table. It is deliberately storage-only + formatting helpers
 * so both the chat route (read) and the extraction endpoint (write) can share
 * the exact same logic. RLS on the table scopes every row to its owner.
 */

export type MemoryType =
  | "relationship"
  | "important_date"
  | "lifestyle_preference"
  | "planning_preference"
  | "work_life_preference"
  | "ai_learning"
  | "system"

export type MemoryConfidence = "low" | "medium" | "high"

export type MemorySource = "conversation" | "monthly_checkin" | "planning_choice" | "reality_check"

export interface MemoryInput {
  memory_type: MemoryType
  memory_key: string
  memory_value: string
  confidence?: MemoryConfidence
  source?: MemorySource
  /** 1-12, only for important_date rows so reminders can be computed. */
  event_month?: number | null
  /** 1-31, only for important_date rows. */
  event_day?: number | null
}

export interface MemoryRow extends MemoryInput {
  id: string
  user_id: string
  created_at: string
  updated_at: string
}

/** The seven Work-Life Balance Business Day™ experiences that support planning. */
export const PLANNING_ACTIVITIES = [
  "morning-given",
  "lunch",
  "ceo-workday",
  "time-freedom",
  "power-down",
  "digital-detox",
  "reality-check",
] as const

const MONTHLY_CHECKIN_KEY = "last_monthly_checkin"

/**
 * Human-readable labels for memory types, used when formatting the Vault into a
 * system-prompt block.
 */
const TYPE_LABELS: Record<MemoryType, string> = {
  relationship: "Relationships",
  important_date: "Important Dates",
  lifestyle_preference: "Lifestyle Preferences",
  planning_preference: "Planning Preferences (preferred coaching style per activity)",
  work_life_preference: "Work-Life Preferences",
  ai_learning: "Things You've Learned About Them",
  system: "System",
}

/**
 * Loads every memory row for a user, newest first. Returns [] on any failure so
 * the chat experience never breaks because of memory.
 */
export async function loadMemories(supabase: SupabaseClient, userId: string): Promise<MemoryRow[]> {
  try {
    const { data, error } = await supabase
      .from("member_memory")
      .select(
        "id, user_id, memory_type, memory_key, memory_value, confidence, source, event_month, event_day, created_at, updated_at",
      )
      .eq("user_id", userId)
      .order("updated_at", { ascending: false })

    if (error) {
      console.log("[v0] loadMemories error:", error.message)
      return []
    }
    return (data ?? []) as MemoryRow[]
  } catch (error) {
    console.log("[v0] loadMemories skipped:", (error as Error)?.message)
    return []
  }
}

/**
 * Formats the Memory Vault into a natural system-prompt block. Excludes the
 * internal `system` bookkeeping rows. Returns "" when there's nothing to share.
 */
export function formatMemoryVault(memories: MemoryRow[]): string {
  const shareable = memories.filter((m) => m.memory_type !== "system")
  if (shareable.length === 0) return ""

  const grouped = new Map<MemoryType, MemoryRow[]>()
  for (const m of shareable) {
    const list = grouped.get(m.memory_type) ?? []
    list.push(m)
    grouped.set(m.memory_type, list)
  }

  const lines: string[] = [
    "CHERRY BLOSSOM'S MEMORY VAULT™ — MEANINGFUL DETAILS YOU'VE LEARNED ABOUT THIS MEMBER OVER TIME.",
    "Use these naturally, like a wise guide who genuinely remembers them. Never read them back as a list and never ask them to repeat what you already know.",
  ]

  // Order the sections intentionally, most personal first.
  const order: MemoryType[] = [
    "relationship",
    "important_date",
    "work_life_preference",
    "lifestyle_preference",
    "planning_preference",
    "ai_learning",
  ]

  for (const type of order) {
    const rows = grouped.get(type)
    if (!rows || rows.length === 0) continue
    lines.push("")
    lines.push(`${TYPE_LABELS[type]}:`)
    for (const row of rows) {
      if (type === "important_date" && row.event_month && row.event_day) {
        lines.push(`- ${row.memory_key}: ${row.memory_value} (${row.event_month}/${row.event_day})`)
      } else {
        lines.push(`- ${row.memory_key}: ${row.memory_value}`)
      }
    }
  }

  return lines.join("\n")
}

/** Number of whole days from today (local) until the next occurrence of month/day. */
function daysUntil(month: number, day: number, today: Date): number {
  const startOfToday = new Date(today.getFullYear(), today.getMonth(), today.getDate())
  let next = new Date(today.getFullYear(), month - 1, day)
  const nextMidnight = new Date(next.getFullYear(), next.getMonth(), next.getDate())
  if (nextMidnight.getTime() < startOfToday.getTime()) {
    next = new Date(today.getFullYear() + 1, month - 1, day)
  }
  const diffMs =
    new Date(next.getFullYear(), next.getMonth(), next.getDate()).getTime() - startOfToday.getTime()
  return Math.round(diffMs / (1000 * 60 * 60 * 24))
}

/**
 * Returns a prompt block describing important dates within the next `windowDays`
 * so Cherry Blossom can gently mention them and offer to help plan. Returns ""
 * when nothing is upcoming.
 */
export function formatUpcomingReminders(memories: MemoryRow[], windowDays = 14, now = new Date()): string {
  const upcoming = memories
    .filter((m) => m.memory_type === "important_date" && m.event_month && m.event_day)
    .map((m) => ({
      label: m.memory_key,
      detail: m.memory_value,
      days: daysUntil(m.event_month as number, m.event_day as number, now),
    }))
    .filter((e) => e.days >= 0 && e.days <= windowDays)
    .sort((a, b) => a.days - b.days)

  if (upcoming.length === 0) return ""

  const lines: string[] = [
    "UPCOMING DATES — gently and warmly bring these up when it fits the conversation, then offer to help plan something special. Do not force it.",
  ]
  for (const e of upcoming) {
    const whenLabel =
      e.days === 0 ? "today" : e.days === 1 ? "tomorrow" : `in ${e.days} days`
    lines.push(`- ${e.label} (${e.detail}) is ${whenLabel}.`)
  }
  return lines.join("\n")
}

/**
 * Whether the monthly check-in should be offered. True when there is no
 * `system/last_monthly_checkin` row for the current calendar month.
 */
export function shouldAskMonthlyCheckin(memories: MemoryRow[], now = new Date()): boolean {
  const row = memories.find((m) => m.memory_type === "system" && m.memory_key === MONTHLY_CHECKIN_KEY)
  if (!row) return true
  const currentTag = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}`
  return row.memory_value !== currentTag
}

/**
 * Upserts a batch of memories. Conflicts on (user_id, memory_type, memory_key)
 * are updated in place so a member's evolving profile stays current rather than
 * accumulating duplicates.
 */
export async function upsertMemories(
  supabase: SupabaseClient,
  userId: string,
  memories: MemoryInput[],
): Promise<number> {
  const clean = memories
    .filter((m) => m.memory_type && m.memory_key?.trim() && m.memory_value?.trim())
    .map((m) => ({
      user_id: userId,
      memory_type: m.memory_type,
      memory_key: m.memory_key.trim().slice(0, 120),
      memory_value: m.memory_value.trim().slice(0, 500),
      confidence: m.confidence ?? "medium",
      source: m.source ?? "conversation",
      event_month: m.event_month ?? null,
      event_day: m.event_day ?? null,
      updated_at: new Date().toISOString(),
    }))

  if (clean.length === 0) return 0

  const { error } = await supabase
    .from("member_memory")
    .upsert(clean, { onConflict: "user_id,memory_type,memory_key" })

  if (error) {
    console.log("[v0] upsertMemories error:", error.message)
    return 0
  }
  return clean.length
}

/**
 * Records the member's preferred planning style for a specific activity
 * (e.g. "lunch" → "Let's Plan Together"). Personalizes defaults without ever
 * removing choice.
 */
export async function savePlanningPreference(
  supabase: SupabaseClient,
  userId: string,
  activity: string,
  style: string,
): Promise<void> {
  await upsertMemories(supabase, userId, [
    {
      memory_type: "planning_preference",
      memory_key: activity,
      memory_value: style,
      confidence: "high",
      source: "planning_choice",
    },
  ])
}

/** Stamps the current calendar month so the monthly check-in isn't re-asked. */
export async function markMonthlyCheckin(supabase: SupabaseClient, userId: string, now = new Date()): Promise<void> {
  const tag = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}`
  await upsertMemories(supabase, userId, [
    {
      memory_type: "system",
      memory_key: MONTHLY_CHECKIN_KEY,
      memory_value: tag,
      confidence: "high",
      source: "monthly_checkin",
    },
  ])
}
