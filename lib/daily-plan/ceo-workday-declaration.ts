"use client"

/**
 * CEO Workday Declaration™ local mirror — bridges "Design My 4-Hour CEO
 * Workday™" (inside Decide & Design™) to the live FounderGpsWorkspace at
 * 1 PM, exactly like movement-declaration.ts does for the Movement Window™.
 *
 * The Supabase plan (`ceo_workday_plans`) is the source of truth. This tiny
 * localStorage record only exists so the live workspace can paint the
 * declaration + "ready" banner instantly, before the server round-trip, and
 * so the one-time glass reveal can be gated with `builtAt`.
 */

import { getDateKey } from "./storage"

export interface CeoWorkdayDeclaration {
  dateKey: string
  /** Supabase ceo_workday_plans.id */
  planId: string
  identityStatement: string | null
  declaration: string
  plannedMinutes: number
  itemCount: number
  builtAt: string
}

const KEY = "ceo_workday_declaration_v1"
const SEEN_KEY = "ceo_workday_declaration_seen_v1"

export const CEO_WORKDAY_DECLARATION_EVENT = "hl:ceo-workday-declaration:changed"

export function saveCeoWorkdayDeclaration(
  input: Omit<CeoWorkdayDeclaration, "dateKey" | "builtAt">,
): CeoWorkdayDeclaration {
  const record: CeoWorkdayDeclaration = { ...input, dateKey: getDateKey(), builtAt: new Date().toISOString() }
  if (typeof window !== "undefined") {
    localStorage.setItem(KEY, JSON.stringify(record))
    localStorage.removeItem(SEEN_KEY)
    window.dispatchEvent(new Event(CEO_WORKDAY_DECLARATION_EVENT))
  }
  return record
}

export function loadCeoWorkdayDeclaration(dateKey: string = getDateKey()): CeoWorkdayDeclaration | null {
  if (typeof window === "undefined") return null
  try {
    const raw = localStorage.getItem(KEY)
    if (!raw) return null
    const parsed = JSON.parse(raw) as CeoWorkdayDeclaration
    return parsed.dateKey === dateKey ? parsed : null
  } catch {
    return null
  }
}

export function clearCeoWorkdayDeclaration() {
  if (typeof window === "undefined") return
  localStorage.removeItem(KEY)
  localStorage.removeItem(SEEN_KEY)
  window.dispatchEvent(new Event(CEO_WORKDAY_DECLARATION_EVENT))
}

export function hasSeenCeoWorkdayDeclaration(builtAt: string): boolean {
  if (typeof window === "undefined") return true
  return localStorage.getItem(SEEN_KEY) === builtAt
}

export function markCeoWorkdayDeclarationSeen(builtAt: string) {
  if (typeof window === "undefined") return
  localStorage.setItem(SEEN_KEY, builtAt)
}
