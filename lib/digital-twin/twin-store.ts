/**
 * Founder Digital Twin™ — Twin Store (Phase 11.0)
 * ---------------------------------------------------------------------------
 * localStorage cache for FounderTwinProfile with 24h TTL.
 * Storage key: harmony:twin:v1
 * Invalidated when HARMONY_MEMORY_UPDATED or ADAPTATION_HISTORY_UPDATED fires.
 */

import type { FounderTwinProfile } from "@/lib/digital-twin/types"

const STORAGE_KEY = "harmony:twin:v1"
const TTL_MS = 24 * 60 * 60 * 1000 // 24 hours

interface CachedTwin {
  profile: FounderTwinProfile
  cachedAt: string // ISO timestamp
}

function isBrowser(): boolean {
  return typeof window !== "undefined"
}

/* ===========================================================================
 * Read
 * ======================================================================== */

export function getCachedTwinProfile(): FounderTwinProfile | null {
  if (!isBrowser()) return null
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return null
    const cached: CachedTwin = JSON.parse(raw)
    const age = Date.now() - new Date(cached.cachedAt).getTime()
    if (age > TTL_MS) {
      localStorage.removeItem(STORAGE_KEY)
      return null
    }
    return cached.profile
  } catch {
    return null
  }
}

/* ===========================================================================
 * Write
 * ======================================================================== */

export function cacheTwinProfile(profile: FounderTwinProfile): void {
  if (!isBrowser()) return
  try {
    const cached: CachedTwin = { profile, cachedAt: new Date().toISOString() }
    localStorage.setItem(STORAGE_KEY, JSON.stringify(cached))
  } catch {
    // Silent
  }
}

export function invalidateTwinCache(): void {
  if (!isBrowser()) return
  try {
    localStorage.removeItem(STORAGE_KEY)
  } catch {
    // Silent
  }
}

/* ===========================================================================
 * Auto-invalidation on store changes
 * ======================================================================== */

export function registerTwinCacheInvalidation(): void {
  if (!isBrowser()) return
  const events = [
    "hl:harmony-memory-updated",
    "hl:adaptation-history-updated",
    "hl:capability-memory-updated",
    "harmony:gps-history-changed",
  ]
  for (const event of events) {
    window.addEventListener(event, invalidateTwinCache, { passive: true })
  }
}
