/**
 * Business Stage™ — session-only store (Phase 5.4).
 *
 * The founder's current Business Stage™ for this browser session. Mirrors the
 * installed-week pattern (lib/sunday-design-day/installed-week.ts): client-side
 * sessionStorage now, swappable to Supabase later WITHOUT changing this
 * contract — the Harmony Context Engine™ and every consumer stay the same.
 *
 * The founder is always in control: the value only changes when the member
 * chooses it (there is no automatic detection this phase, or planned soon).
 */

import {
  DEFAULT_BUSINESS_STAGE,
  isBusinessStage,
  type BusinessStage,
} from "./business-stage"

const STORAGE_KEY = "hl:business-stage:v1"

/** Fired on the window when the stage changes, so live views can re-read it. */
export const BUSINESS_STAGE_EVENT = "hl:business-stage:changed"

/** Read the member's current stage for this session, or the default. */
export function getBusinessStage(): BusinessStage {
  if (typeof window === "undefined") return DEFAULT_BUSINESS_STAGE
  try {
    const raw = window.sessionStorage.getItem(STORAGE_KEY)
    return isBusinessStage(raw) ? raw : DEFAULT_BUSINESS_STAGE
  } catch {
    return DEFAULT_BUSINESS_STAGE
  }
}

/** Persist the member's chosen stage and notify listeners in this tab. */
export function setBusinessStage(stage: BusinessStage): void {
  if (typeof window === "undefined") return
  try {
    window.sessionStorage.setItem(STORAGE_KEY, stage)
    window.dispatchEvent(new CustomEvent(BUSINESS_STAGE_EVENT, { detail: stage }))
  } catch {
    /* no-op: storage unavailable (private mode, etc.) */
  }
}
