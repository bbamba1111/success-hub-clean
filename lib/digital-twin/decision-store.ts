/**
 * Founder Digital Twin™ — Decision Store (Phase 11.0)
 * ---------------------------------------------------------------------------
 * localStorage persistence for DecisionRecord entries.
 * Storage key: harmony:decisions:v1
 * Cap: 200 entries (oldest removed first).
 * Dispatches DECISION_HISTORY_UPDATED CustomEvent on every write.
 */

import type { DecisionRecord, DecisionOutcome } from "@/lib/digital-twin/types"

export const DECISION_HISTORY_UPDATED = "harmony:decision-history-updated"

const STORAGE_KEY = "harmony:decisions:v1"
const MAX_ENTRIES = 200

function isBrowser(): boolean {
  return typeof window !== "undefined"
}

/* ===========================================================================
 * Read
 * ======================================================================== */

export function getDecisionHistory(): DecisionRecord[] {
  if (!isBrowser()) return []
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return []
    const parsed = JSON.parse(raw)
    return Array.isArray(parsed) ? parsed : []
  } catch {
    return []
  }
}

export function getDecisionById(id: string): DecisionRecord | null {
  return getDecisionHistory().find((d) => d.id === id) ?? null
}

/* ===========================================================================
 * Write
 * ======================================================================== */

function persist(records: DecisionRecord[]): void {
  if (!isBrowser()) return
  try {
    // Enforce cap — keep most recent
    const capped = records.length > MAX_ENTRIES
      ? records.slice(records.length - MAX_ENTRIES)
      : records
    localStorage.setItem(STORAGE_KEY, JSON.stringify(capped))
    window.dispatchEvent(new CustomEvent(DECISION_HISTORY_UPDATED))
  } catch {
    // Storage unavailable — silent fail
  }
}

export function recordDecision(
  entry: Omit<DecisionRecord, "id" | "decidedAt" | "status" | "actualOutcome" | "lessonsLearned" | "unexpectedVariables" | "businessImpact" | "wholeLifeImpact" | "reflection" | "reviewedAt">,
): DecisionRecord {
  const record: DecisionRecord = {
    ...entry,
    id: `decision-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
    decidedAt: new Date().toISOString(),
    status: "committed",
    actualOutcome: null,
    lessonsLearned: null,
    unexpectedVariables: null,
    businessImpact: null,
    wholeLifeImpact: null,
    reflection: null,
    reviewedAt: null,
  }
  const history = getDecisionHistory()
  history.push(record)
  persist(history)
  return record
}

export function updateDecisionOutcome(
  id: string,
  update: Partial<Pick<
    DecisionRecord,
    "actualOutcome" | "lessonsLearned" | "unexpectedVariables" | "businessImpact" | "wholeLifeImpact" | "reflection" | "status"
  >>,
): void {
  const history = getDecisionHistory()
  const idx = history.findIndex((d) => d.id === id)
  if (idx === -1) return
  history[idx] = {
    ...history[idx],
    ...update,
    reviewedAt: new Date().toISOString(),
  }
  persist(history)
}

export function updateDecisionStatus(id: string, status: DecisionOutcome): void {
  updateDecisionOutcome(id, { status })
}

export function clearDecisionHistory(): void {
  if (!isBrowser()) return
  try {
    localStorage.removeItem(STORAGE_KEY)
    window.dispatchEvent(new CustomEvent(DECISION_HISTORY_UPDATED))
  } catch {
    // Silent
  }
}
