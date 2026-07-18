/**
 * Executive Reviews Store™ — Phase 14.0
 * ---------------------------------------------------------------------------
 * localStorage persistence for WeeklyReview[], MonthlyReview[], QuarterlyReview[].
 * Storage key: hl:executive-reviews:v1
 * Client-safe: all localStorage calls are guarded.
 */

import type { ExecutiveReviewsStore, WeeklyReview, MonthlyReview, QuarterlyReview } from "./types"

const STORAGE_KEY = "hl:executive-reviews:v1"
export const EXECUTIVE_REVIEWS_UPDATED = "EXECUTIVE_REVIEWS_UPDATED"

function isBrowser(): boolean {
  return typeof window !== "undefined"
}

const EMPTY: ExecutiveReviewsStore = {
  weekly: [],
  monthly: [],
  quarterly: [],
  lastGeneratedAt: null,
}

export function getExecutiveReviews(): ExecutiveReviewsStore {
  if (!isBrowser()) return { ...EMPTY }
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return { ...EMPTY }
    const parsed = JSON.parse(raw) as ExecutiveReviewsStore
    return {
      weekly: Array.isArray(parsed.weekly) ? parsed.weekly : [],
      monthly: Array.isArray(parsed.monthly) ? parsed.monthly : [],
      quarterly: Array.isArray(parsed.quarterly) ? parsed.quarterly : [],
      lastGeneratedAt: parsed.lastGeneratedAt ?? null,
    }
  } catch {
    return { ...EMPTY }
  }
}

function save(store: ExecutiveReviewsStore): void {
  if (!isBrowser()) return
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(store))
    window.dispatchEvent(new CustomEvent(EXECUTIVE_REVIEWS_UPDATED))
  } catch {
    // no-op
  }
}

export function saveWeeklyReview(review: WeeklyReview): void {
  const store = getExecutiveReviews()
  // Upsert by id
  const idx = store.weekly.findIndex((r) => r.id === review.id)
  if (idx >= 0) {
    store.weekly[idx] = review
  } else {
    store.weekly.unshift(review)
  }
  // Keep max 52 (1 year of weekly reviews)
  store.weekly = store.weekly.slice(0, 52)
  store.lastGeneratedAt = new Date().toISOString()
  save(store)
}

export function saveMonthlyReview(review: MonthlyReview): void {
  const store = getExecutiveReviews()
  const idx = store.monthly.findIndex((r) => r.id === review.id)
  if (idx >= 0) {
    store.monthly[idx] = review
  } else {
    store.monthly.unshift(review)
  }
  store.monthly = store.monthly.slice(0, 24) // 2 years
  store.lastGeneratedAt = new Date().toISOString()
  save(store)
}

export function saveQuarterlyReview(review: QuarterlyReview): void {
  const store = getExecutiveReviews()
  const idx = store.quarterly.findIndex((r) => r.id === review.id)
  if (idx >= 0) {
    store.quarterly[idx] = review
  } else {
    store.quarterly.unshift(review)
  }
  store.quarterly = store.quarterly.slice(0, 12) // 3 years
  store.lastGeneratedAt = new Date().toISOString()
  save(store)
}

export function getLatestWeeklyReview(): WeeklyReview | null {
  return getExecutiveReviews().weekly[0] ?? null
}

export function getLatestMonthlyReview(): MonthlyReview | null {
  return getExecutiveReviews().monthly[0] ?? null
}

export function getLatestQuarterlyReview(): QuarterlyReview | null {
  return getExecutiveReviews().quarterly[0] ?? null
}

export function clearExecutiveReviews(): void {
  if (!isBrowser()) return
  try {
    localStorage.removeItem(STORAGE_KEY)
    window.dispatchEvent(new CustomEvent(EXECUTIVE_REVIEWS_UPDATED))
  } catch {
    // no-op
  }
}
