/**
 * Harmony Lane™ Community Store — Phase 16.1
 * ---------------------------------------------------------------------------
 * localStorage persistence for check-ins and wins.
 * Key: hl:community:v1
 * Client-safe: all localStorage calls are guarded behind isBrowser().
 */

import type { CommunityStore, CheckIn, FounderWin } from "./types"

const STORAGE_KEY = "hl:community:v1"
const MAX_CHECKINS = 200
const MAX_WINS = 100

export const COMMUNITY_UPDATED = "hl:community:updated"

function isBrowser(): boolean {
  return typeof window !== "undefined"
}

const EMPTY: CommunityStore = {
  checkIns: [],
  wins: [],
  lastCheckInDate: null,
  lastUpdatedAt: null,
}

// ─── Read ─────────────────────────────────────────────────────────────────────

export function getCommunityStore(): CommunityStore {
  if (!isBrowser()) return { ...EMPTY }
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return { ...EMPTY }
    const parsed = JSON.parse(raw) as CommunityStore
    return {
      checkIns: Array.isArray(parsed.checkIns) ? parsed.checkIns : [],
      wins: Array.isArray(parsed.wins) ? parsed.wins : [],
      lastCheckInDate: parsed.lastCheckInDate ?? null,
      lastUpdatedAt: parsed.lastUpdatedAt ?? null,
    }
  } catch {
    return { ...EMPTY }
  }
}

export function getRecentCheckIns(n: number = 10): CheckIn[] {
  return getCommunityStore().checkIns.slice(0, n)
}

export function getRecentWins(n: number = 10): FounderWin[] {
  return getCommunityStore().wins.slice(0, n)
}

export function getTodayCheckIn(type: CheckIn["type"]): CheckIn | null {
  const today = new Date().toISOString().slice(0, 10)
  return (
    getCommunityStore().checkIns.find(
      (c) => c.type === type && c.date === today,
    ) ?? null
  )
}

// ─── Write ────────────────────────────────────────────────────────────────────

function persist(store: CommunityStore): void {
  if (!isBrowser()) return
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(store))
    window.dispatchEvent(new CustomEvent(COMMUNITY_UPDATED))
  } catch {
    // localStorage unavailable
  }
}

/**
 * Saves a check-in. Upserts by id (same id = update). Newest-first. Cap 200.
 */
export function saveCheckIn(checkIn: CheckIn): void {
  const store = getCommunityStore()
  const idx = store.checkIns.findIndex((c) => c.id === checkIn.id)
  if (idx >= 0) {
    store.checkIns[idx] = checkIn
  } else {
    store.checkIns.unshift(checkIn)
  }
  store.checkIns = store.checkIns.slice(0, MAX_CHECKINS)
  store.lastCheckInDate = checkIn.date
  store.lastUpdatedAt = new Date().toISOString()
  persist(store)
}

/**
 * Saves a founder win. Upserts by id. Newest-first. Cap 100.
 */
export function saveWin(win: FounderWin): void {
  const store = getCommunityStore()
  const idx = store.wins.findIndex((w) => w.id === win.id)
  if (idx >= 0) {
    store.wins[idx] = win
  } else {
    store.wins.unshift(win)
  }
  store.wins = store.wins.slice(0, MAX_WINS)
  store.lastUpdatedAt = new Date().toISOString()
  persist(store)
}
