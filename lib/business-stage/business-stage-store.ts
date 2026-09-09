/**
 * Business Stage™ — session-only override store (Phase 5.4; Phase 1 of the
 * canonical Business Stage architecture).
 *
 * The founder's current Business Stage™ for this browser session. Mirrors the
 * installed-week pattern (lib/sunday-design-day/installed-week.ts): client-side
 * sessionStorage now, swappable to Supabase later WITHOUT changing this
 * contract — the Harmony Context Engine™ and every consumer stay the same.
 *
 * The founder is always in control: if they have manually chosen a stage this
 * session, that choice always wins (unchanged behavior). When they haven't,
 * this now derives the stage from their real, persisted Business Context
 * Profile™ (lib/business-context) instead of silently defaulting to
 * "launch" for every founder — see deriveBusinessStage() in ./business-stage.
 */

import {
  DEFAULT_BUSINESS_STAGE,
  deriveBusinessStage,
  isBusinessStage,
  type BusinessStage,
} from "./business-stage"
import { getBusinessContext } from "@/lib/business-context/business-context-store"

const STORAGE_KEY = "hl:business-stage:v1"

/** Fired on the window when the stage changes, so live views can re-read it. */
export const BUSINESS_STAGE_EVENT = "hl:business-stage:changed"

/**
 * Read the member's current stage for this session: a manual override if
 * one was set, otherwise derived from their persisted Business Context
 * Profile™, otherwise the default.
 */
export function getBusinessStage(): BusinessStage {
  if (typeof window === "undefined") return DEFAULT_BUSINESS_STAGE
  try {
    const raw = window.sessionStorage.getItem(STORAGE_KEY)
    if (isBusinessStage(raw)) return raw
  } catch {
    // sessionStorage unavailable (private mode, etc.) — fall through to derivation.
  }
  try {
    return deriveBusinessStage(getBusinessContext())
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
