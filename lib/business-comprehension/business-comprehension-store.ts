/**
 * Business Comprehension™ — session-only store (Phase 5.6).
 *
 * The founder's current Communication Style™ for this browser session. Mirrors
 * the Business Stage™ store (lib/business-stage/business-stage-store.ts):
 * client-side sessionStorage now, swappable to Supabase later WITHOUT changing
 * this contract — the Harmony Context Engine™ and every consumer stay the same.
 *
 * The founder is always in control: the value only changes when the member
 * chooses it. There is no automatic comprehension detection this phase.
 */

import {
  DEFAULT_COMMUNICATION_STYLE,
  isCommunicationStyle,
  type CommunicationStyle,
} from "./business-comprehension"

const STORAGE_KEY = "hl:business-comprehension:v1"

/** Fired on the window when the style changes, so live views can re-read it. */
export const BUSINESS_COMPREHENSION_EVENT = "hl:business-comprehension:changed"

/** Read the member's current Communication Style™ for this session, or the default. */
export function getCommunicationStyle(): CommunicationStyle {
  if (typeof window === "undefined") return DEFAULT_COMMUNICATION_STYLE
  try {
    const raw = window.sessionStorage.getItem(STORAGE_KEY)
    return isCommunicationStyle(raw) ? raw : DEFAULT_COMMUNICATION_STYLE
  } catch {
    return DEFAULT_COMMUNICATION_STYLE
  }
}

/** Persist the member's chosen style and notify listeners in this tab. */
export function setCommunicationStyle(style: CommunicationStyle): void {
  if (typeof window === "undefined") return
  try {
    window.sessionStorage.setItem(STORAGE_KEY, style)
    window.dispatchEvent(new CustomEvent(BUSINESS_COMPREHENSION_EVENT, { detail: style }))
  } catch {
    /* no-op: storage unavailable (private mode, etc.) */
  }
}
