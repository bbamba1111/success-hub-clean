/**
 * Founder Memory™ Store — Phase 16.0
 * ---------------------------------------------------------------------------
 * localStorage persistence for FounderMemory[].
 * Key: hl:founder-memory:v1
 * Client-safe: all localStorage calls are guarded.
 * Cap: 500 entries newest-first. Upsert by id.
 */

import type { FounderMemory, FounderMemoryStoreShape, MemoryCategory } from "./types"

const STORAGE_KEY = "hl:founder-memory:v1"
const MAX_MEMORIES = 500

export const FOUNDER_MEMORY_UPDATED = "hl:founder-memory:updated"

function isBrowser(): boolean {
  return typeof window !== "undefined"
}

const EMPTY_STORE: FounderMemoryStoreShape = {
  memories: [],
  lastUpdatedAt: null,
}

// ─── Read ─────────────────────────────────────────────────────────────────────

export function getMemoryStore(): FounderMemoryStoreShape {
  if (!isBrowser()) return { ...EMPTY_STORE }
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return { ...EMPTY_STORE }
    const parsed = JSON.parse(raw) as FounderMemoryStoreShape
    return {
      memories: Array.isArray(parsed.memories) ? parsed.memories : [],
      lastUpdatedAt: parsed.lastUpdatedAt ?? null,
    }
  } catch {
    return { ...EMPTY_STORE }
  }
}

export function getRecentMemories(n: number = 10): FounderMemory[] {
  return getMemoryStore().memories.slice(0, n)
}

export function getMemoriesByCategory(category: MemoryCategory): FounderMemory[] {
  return getMemoryStore().memories.filter((m) => m.category === category)
}

export function getLatestMilestone(): FounderMemory | null {
  return getMemoryStore().memories.find((m) => m.category === "milestone") ?? null
}

export function getLatestMemoryOfCategory(category: MemoryCategory): FounderMemory | null {
  return getMemoryStore().memories.find((m) => m.category === category) ?? null
}

// ─── Write ────────────────────────────────────────────────────────────────────

function persist(store: FounderMemoryStoreShape): void {
  if (!isBrowser()) return
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(store))
    window.dispatchEvent(new CustomEvent(FOUNDER_MEMORY_UPDATED))
  } catch {
    // localStorage unavailable
  }
}

/**
 * Records a memory. Upserts by id so the same event can be re-recorded
 * (e.g. review regenerated) without creating duplicates.
 * Newest entries are always at index 0. Cap at MAX_MEMORIES.
 */
export function recordMemory(entry: FounderMemory): void {
  if (!isBrowser()) return
  const store = getMemoryStore()
  const idx = store.memories.findIndex((m) => m.id === entry.id)
  if (idx >= 0) {
    // Upsert — update in place
    store.memories[idx] = entry
  } else {
    // Prepend — newest first
    store.memories.unshift(entry)
  }
  store.memories = store.memories.slice(0, MAX_MEMORIES)
  store.lastUpdatedAt = new Date().toISOString()
  persist(store)
}

/**
 * Records multiple memories in a single write (used by the seeder).
 */
export function recordMemories(entries: FounderMemory[]): void {
  if (!isBrowser() || entries.length === 0) return
  const store = getMemoryStore()
  for (const entry of entries) {
    const idx = store.memories.findIndex((m) => m.id === entry.id)
    if (idx >= 0) {
      store.memories[idx] = entry
    } else {
      store.memories.unshift(entry)
    }
  }
  // Sort newest-first by timestamp after bulk insert
  store.memories.sort((a, b) => b.timestamp.localeCompare(a.timestamp))
  store.memories = store.memories.slice(0, MAX_MEMORIES)
  store.lastUpdatedAt = new Date().toISOString()
  persist(store)
}

export function clearMemoryStore(): void {
  if (!isBrowser()) return
  try {
    localStorage.removeItem(STORAGE_KEY)
    window.dispatchEvent(new CustomEvent(FOUNDER_MEMORY_UPDATED))
  } catch {
    // no-op
  }
}
