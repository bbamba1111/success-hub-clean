/**
 * Executive Memory Store™ — Phase 10.3
 * ---------------------------------------------------------------------------
 * localStorage store for per-executive previous findings. Enables continuity:
 * "Previously recommended X. Completed. Next: Y."
 *
 * PURE MODULE — no React coupling. Emits EXECUTIVE_MEMORY_EVENT on every write.
 * Maximum 7 days of history per executive.
 */

import type { ExecutiveFinding } from "@/lib/executive-office/types"

export const EXECUTIVE_MEMORY_EVENT = "EXECUTIVE_MEMORY_UPDATED"

const STORE_KEY = "hl_executive_memory_v1"
const MAX_DAYS = 7

export interface ExecutiveMemoryEntry {
  executiveId: string
  date: string                  // ISO date (YYYY-MM-DD)
  timestamp: string             // ISO datetime
  finding: ExecutiveFinding
  outcome: "surfaced" | "actioned" | "deferred" | "not-selected"
}

export interface ExecutiveMemoryStore {
  entries: ExecutiveMemoryEntry[]
  lastUpdated: string
}

// ─── Read ─────────────────────────────────────────────────────────────────────

export function getExecutiveMemory(): ExecutiveMemoryStore {
  if (typeof window === "undefined") return { entries: [], lastUpdated: "" }
  try {
    const raw = localStorage.getItem(STORE_KEY)
    if (!raw) return { entries: [], lastUpdated: "" }
    return JSON.parse(raw) as ExecutiveMemoryStore
  } catch {
    return { entries: [], lastUpdated: "" }
  }
}

export function getExecutiveHistory(executiveId: string): ExecutiveMemoryEntry[] {
  const store = getExecutiveMemory()
  return store.entries
    .filter((e) => e.executiveId === executiveId)
    .sort((a, b) => b.timestamp.localeCompare(a.timestamp))
}

/** Most recent finding for a given executive, or null if no history. */
export function getPreviousFinding(executiveId: string): ExecutiveFinding | null {
  const history = getExecutiveHistory(executiveId)
  return history[0]?.finding ?? null
}

/** Returns the most recent completed (actioned) finding for a given executive. */
export function getLastActionedFinding(executiveId: string): ExecutiveFinding | null {
  const history = getExecutiveHistory(executiveId)
  const actioned = history.find((e) => e.outcome === "actioned")
  return actioned?.finding ?? null
}

// ─── Write ────────────────────────────────────────────────────────────────────

export function recordExecutiveFinding(
  finding: ExecutiveFinding,
  outcome: ExecutiveMemoryEntry["outcome"],
): void {
  if (typeof window === "undefined") return

  const store = getExecutiveMemory()
  const now = new Date()
  const cutoff = new Date()
  cutoff.setDate(cutoff.getDate() - MAX_DAYS)

  // Prune entries older than MAX_DAYS
  const pruned = store.entries.filter(
    (e) => new Date(e.date) >= cutoff,
  )

  pruned.push({
    executiveId: finding.executiveId,
    date: now.toISOString().split("T")[0],
    timestamp: now.toISOString(),
    finding,
    outcome,
  })

  const updated: ExecutiveMemoryStore = {
    entries: pruned,
    lastUpdated: now.toISOString(),
  }

  try {
    localStorage.setItem(STORE_KEY, JSON.stringify(updated))
    window.dispatchEvent(new CustomEvent(EXECUTIVE_MEMORY_EVENT, { detail: updated }))
  } catch {
    // Storage unavailable — degrade silently
  }
}

export function recordBrief(
  winningId: string,
  allFindings: ExecutiveFinding[],
): void {
  allFindings.forEach((f) => {
    const outcome: ExecutiveMemoryEntry["outcome"] =
      f.executiveId === winningId ? "surfaced" : "not-selected"
    recordExecutiveFinding(f, outcome)
  })
}
