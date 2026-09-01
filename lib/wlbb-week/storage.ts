"use client"

import type { BusinessOutcome, DailyEntry, LifeIntention, WlbbDayKey, WlbbWeekState } from "./types"

/**
 * Monday-start week key — same convention as `components/weekly-reality-check.tsx`.
 * Returns e.g. "2026-08-10" for the Monday of the current week.
 */
export function getWeekKey(date: Date = new Date()): string {
  const d = new Date(date)
  const day = d.getDay() // 0 = Sunday, 1 = Monday, ...
  const diff = (day + 6) % 7 // days since Monday
  d.setDate(d.getDate() - diff)
  d.setHours(0, 0, 0, 0)
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`
}

/** Maps JS getDay() (0=Sun..6=Sat) to a WLBB day key. Fri/Sat/Sun have no CEO Workday entry. */
export function getWlbbDayKey(date: Date = new Date()): WlbbDayKey | null {
  const map: Record<number, WlbbDayKey | null> = {
    0: null,
    1: "monday",
    2: "tuesday",
    3: "wednesday",
    4: "thursday",
    5: null,
    6: null,
  }
  return map[date.getDay()]
}

const KEY_PREFIX = "wlbbWeek:"

function keyFor(weekKey: string): string {
  return `${KEY_PREFIX}${weekKey}`
}

function emptyWeek(weekKey: string): WlbbWeekState {
  const now = new Date().toISOString()
  return {
    weekKey,
    life: { intentions: [] },
    business: { businessAreaId: null, outcomes: [], humanZoneOfGeniusPracticeTitle: null, bottleneckEgaEntryIds: [] },
    gpsRecommendation: null,
    debriefCompletedAt: null,
    daily: {},
    updatedAt: now,
  }
}

/**
 * Loads this week's WLBB state, creating a fresh (empty) record if this is
 * the first visit of a new Monday. Prior weeks are never touched — each
 * week lives under its own `wlbbWeek:{weekKey}` localStorage key, so a
 * founder's history is preserved automatically.
 */
export function loadWeek(weekKey: string = getWeekKey()): WlbbWeekState {
  if (typeof window === "undefined") return emptyWeek(weekKey)
  try {
    const raw = localStorage.getItem(keyFor(weekKey))
    if (raw) {
      const parsed = JSON.parse(raw) as WlbbWeekState
      // Defensive merge in case the shape grows over time. `business` is
      // merged one level deeper so a week saved before a new business.*
      // field existed (e.g. bottleneckEgaEntryIds) still gets that field's
      // default instead of losing it to the shallow top-level spread.
      const base = emptyWeek(weekKey)
      return { ...base, ...parsed, business: { ...base.business, ...parsed.business } }
    }
  } catch {
    // ignore malformed storage
  }
  return emptyWeek(weekKey)
}

export function saveWeek(state: WlbbWeekState): void {
  if (typeof window === "undefined") return
  try {
    const next: WlbbWeekState = { ...state, updatedAt: new Date().toISOString() }
    localStorage.setItem(keyFor(state.weekKey), JSON.stringify(next))
  } catch {
    // ignore storage failures (private browsing, quota, etc.)
  }
}

export function addLifeIntention(state: WlbbWeekState, intention: LifeIntention): WlbbWeekState {
  const next: WlbbWeekState = {
    ...state,
    life: { intentions: [...state.life.intentions, intention] },
  }
  saveWeek(next)
  return next
}

export function removeLifeIntention(state: WlbbWeekState, id: string): WlbbWeekState {
  const next: WlbbWeekState = {
    ...state,
    life: { intentions: state.life.intentions.filter((i) => i.id !== id) },
  }
  saveWeek(next)
  return next
}

export function setBusinessArea(state: WlbbWeekState, areaId: string | null): WlbbWeekState {
  const next: WlbbWeekState = { ...state, business: { ...state.business, businessAreaId: areaId } }
  saveWeek(next)
  return next
}

export function setOutcomes(state: WlbbWeekState, outcomes: BusinessOutcome[]): WlbbWeekState {
  const next: WlbbWeekState = { ...state, business: { ...state.business, outcomes } }
  saveWeek(next)
  return next
}

export function setBottlenecks(state: WlbbWeekState, egaEntryIds: string[]): WlbbWeekState {
  const next: WlbbWeekState = {
    ...state,
    business: { ...state.business, bottleneckEgaEntryIds: egaEntryIds },
  }
  saveWeek(next)
  return next
}

export function setHumanZoneOfGeniusPractice(state: WlbbWeekState, title: string | null): WlbbWeekState {
  const next: WlbbWeekState = {
    ...state,
    business: { ...state.business, humanZoneOfGeniusPracticeTitle: title },
  }
  saveWeek(next)
  return next
}

export function setGpsRecommendation(state: WlbbWeekState, gpsRecommendation: string | null): WlbbWeekState {
  const next: WlbbWeekState = { ...state, gpsRecommendation }
  saveWeek(next)
  return next
}

export function markDebriefComplete(state: WlbbWeekState): WlbbWeekState {
  const next: WlbbWeekState = { ...state, debriefCompletedAt: new Date().toISOString() }
  saveWeek(next)
  return next
}

export function getDailyEntry(state: WlbbWeekState, day: WlbbDayKey): DailyEntry {
  return (
    state.daily[day] ?? {
      selectedOutcomeIds: [],
      completedOutcomeIds: [],
      carriedForwardOutcomeIds: [],
      ceoWorkspaceEntered: false,
      updatedAt: new Date().toISOString(),
    }
  )
}

export function updateDailyEntry(
  state: WlbbWeekState,
  day: WlbbDayKey,
  patch: Partial<DailyEntry>,
): WlbbWeekState {
  const current = getDailyEntry(state, day)
  const updated: DailyEntry = { ...current, ...patch, updatedAt: new Date().toISOString() }
  const next: WlbbWeekState = { ...state, daily: { ...state.daily, [day]: updated } }
  saveWeek(next)
  return next
}
