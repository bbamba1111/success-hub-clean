/**
 * Global Language Architecture™ — Locale Preferences Store (Phase 5.5A)
 * ---------------------------------------------------------------------------
 * The member's Preferred Language™ + Localization overrides for this browser
 * session. Mirrors the Business Stage™ store (lib/business-stage/
 * business-stage-store.ts): client-side sessionStorage now, swappable to
 * Supabase later WITHOUT changing this contract — the Harmony Context Engine™
 * and every consumer stay the same.
 *
 * The member is always in control. Language and Localization are stored
 * separately (per the architectural separation): changing language updates the
 * language code only; localization defaults are DERIVED at read time and layered
 * with any explicit per-dimension overrides the member has set.
 */

import { DEFAULT_LANGUAGE, isLanguageCode, type LanguageCode } from "./language"
import type { LocalizationOverrides } from "./localization"

/** What we persist: the chosen language + only the dimensions the member changed. */
export interface LocalePreferences {
  language: LanguageCode
  /** Explicit overrides on top of the language's localization defaults. */
  localization: LocalizationOverrides
}

const STORAGE_KEY = "hl:locale-prefs:v1"

/** Fired on the window when preferences change, so live views can re-read them. */
export const LOCALE_PREFERENCES_EVENT = "hl:locale-prefs:changed"

const DEFAULT_PREFERENCES: LocalePreferences = {
  language: DEFAULT_LANGUAGE,
  localization: {},
}

/** Read the member's current locale preferences for this session. */
export function getLocalePreferences(): LocalePreferences {
  if (typeof window === "undefined") return DEFAULT_PREFERENCES
  try {
    const raw = window.sessionStorage.getItem(STORAGE_KEY)
    if (!raw) return DEFAULT_PREFERENCES
    const parsed = JSON.parse(raw) as Partial<LocalePreferences>
    const language = isLanguageCode(parsed.language) ? parsed.language : DEFAULT_LANGUAGE
    const localization = (parsed.localization && typeof parsed.localization === "object"
      ? parsed.localization
      : {}) as LocalizationOverrides
    return { language, localization }
  } catch {
    return DEFAULT_PREFERENCES
  }
}

function write(next: LocalePreferences): void {
  if (typeof window === "undefined") return
  try {
    window.sessionStorage.setItem(STORAGE_KEY, JSON.stringify(next))
    window.dispatchEvent(new CustomEvent(LOCALE_PREFERENCES_EVENT, { detail: next }))
  } catch {
    /* no-op: storage unavailable (private mode, etc.) */
  }
}

/**
 * Set the member's Preferred Language™. Because localization defaults are
 * derived from language, changing language also CLEARS prior overrides so the
 * member gets the new language's sensible defaults (they can re-customize).
 */
export function setPreferredLanguage(language: LanguageCode): void {
  write({ language, localization: {} })
}

/** Merge in one or more Localization overrides (date format, currency, etc.). */
export function setLocalizationOverrides(overrides: LocalizationOverrides): void {
  const current = getLocalePreferences()
  write({ ...current, localization: { ...current.localization, ...overrides } })
}

/** Clear all Localization overrides, returning to the language's defaults. */
export function resetLocalization(): void {
  const current = getLocalePreferences()
  write({ ...current, localization: {} })
}
