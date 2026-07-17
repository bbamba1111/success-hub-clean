/**
 * Harmony Memory Store™ — Phase 10.5
 * ---------------------------------------------------------------------------
 * Unified localStorage store aggregating all Harmony Lane™ memory signals.
 * Storage key: harmony:memory:v1
 * Max 500 entries, rolling 90-day window. Emits HARMONY_MEMORY_UPDATED on write.
 */

import type {
  HarmonyMemoryEntry,
  HarmonyMemoryStore,
} from "@/lib/harmony-memory/types"

const STORAGE_KEY = "harmony:memory:v1"
const MAX_ENTRIES = 500
const RETENTION_DAYS = 90
export const HARMONY_MEMORY_UPDATED = "harmony:memory-updated"

// ─── Guard ────────────────────────────────────────────────────────────────────

function isBrowser(): boolean {
  return typeof window !== "undefined"
}

// ─── Default store ────────────────────────────────────────────────────────────

function emptyStore(): HarmonyMemoryStore {
  return {
    version: 1,
    entries: [],
    patternsLastAnalyzed: null,
    insightsLastGenerated: null,
  }
}

// ─── Read ─────────────────────────────────────────────────────────────────────

export function getHarmonyMemory(): HarmonyMemoryStore {
  if (!isBrowser()) return emptyStore()
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return emptyStore()
    const parsed = JSON.parse(raw) as HarmonyMemoryStore
    return parsed.version === 1 ? parsed : emptyStore()
  } catch {
    return emptyStore()
  }
}

/**
 * Returns all entries, optionally filtered by type and/or date range.
 */
export function getMemory(filter?: {
  type?: HarmonyMemoryEntry["type"]
  fromDate?: string
  toDate?: string
}): HarmonyMemoryEntry[] {
  const store = getHarmonyMemory()
  let entries = store.entries

  if (filter?.type) {
    entries = entries.filter((e) => e.type === filter.type)
  }
  if (filter?.fromDate) {
    entries = entries.filter((e) => e.date >= filter.fromDate!)
  }
  if (filter?.toDate) {
    entries = entries.filter((e) => e.date <= filter.toDate!)
  }

  return entries
}

/**
 * Returns entries by type — shortcut.
 */
export function getMemoryByType<T extends HarmonyMemoryEntry>(
  type: T["type"],
): T[] {
  return getMemory({ type }) as T[]
}

// ─── Write ────────────────────────────────────────────────────────────────────

/**
 * Appends a new memory entry.
 * Auto-prunes entries older than RETENTION_DAYS and enforces MAX_ENTRIES.
 */
export function appendMemory(entry: HarmonyMemoryEntry): void {
  if (!isBrowser()) return
  try {
    const store = getHarmonyMemory()

    // Prune by age
    const cutoff = new Date()
    cutoff.setDate(cutoff.getDate() - RETENTION_DAYS)
    const cutoffIso = cutoff.toISOString().slice(0, 10)
    const pruned = store.entries.filter((e) => e.date >= cutoffIso)

    // Append + enforce max
    pruned.push(entry)
    const trimmed = pruned.length > MAX_ENTRIES
      ? pruned.slice(pruned.length - MAX_ENTRIES)
      : pruned

    const updated: HarmonyMemoryStore = {
      ...store,
      entries: trimmed,
    }

    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated))
    window.dispatchEvent(new CustomEvent(HARMONY_MEMORY_UPDATED, { detail: { entry } }))
  } catch {
    // Silent — memory is non-critical
  }
}

/**
 * Updates meta timestamps (patternsLastAnalyzed / insightsLastGenerated).
 */
export function updateMemoryMeta(
  updates: Partial<Pick<HarmonyMemoryStore, "patternsLastAnalyzed" | "insightsLastGenerated">>,
): void {
  if (!isBrowser()) return
  try {
    const store = getHarmonyMemory()
    const updated: HarmonyMemoryStore = { ...store, ...updates }
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated))
  } catch {
    // Silent
  }
}

export function clearMemory(): void {
  if (!isBrowser()) return
  try {
    localStorage.removeItem(STORAGE_KEY)
    window.dispatchEvent(new CustomEvent(HARMONY_MEMORY_UPDATED))
  } catch {
    // Silent
  }
}
