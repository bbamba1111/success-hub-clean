/**
 * Global Language Architecture™ — Translation Registry & Resolver (Phase 5.5A)
 * ---------------------------------------------------------------------------
 * Central registry of language dictionaries + the `t()` resolver every future
 * UI string will read through. This is the seam that makes the platform
 * language-ready: swap the active language and translated copy flows through
 * without touching components.
 *
 * Only the working language (English, US) has content this phase. Every other
 * supported language maps to an empty dictionary and FALLS BACK to English at
 * runtime, so the app is fully functional in all languages today while
 * translation is deferred until V1 copy stabilizes. English (UK) shares the US
 * base this phase (spelling variants arrive with the translation pass).
 */

import type { LanguageCode } from "@/lib/i18n/language"
import { DEFAULT_LANGUAGE } from "@/lib/i18n/language"
import { enUS, type Dictionary } from "./en-US"

/**
 * DICTIONARIES — language code → resource map. Planned languages are reserved
 * with empty dictionaries so adding real translations later is a drop-in.
 */
export const DICTIONARIES: Record<LanguageCode, Dictionary> = {
  "en-US": enUS,
  "en-GB": enUS, // shares US base until the translation pass adds UK spellings
  es: {},
  fr: {},
  pt: {},
  de: {},
  it: {},
  ja: {},
  ko: {},
  "zh-CN": {},
  "zh-TW": {},
  ar: {},
  hi: {},
}

/**
 * Resolve a namespaced key (e.g. "nav.liveToday") for a language, falling back
 * to English and finally to the key itself so the UI never renders blank.
 */
export function t(key: string, language: LanguageCode = DEFAULT_LANGUAGE): string {
  const dict = DICTIONARIES[language] ?? DICTIONARIES[DEFAULT_LANGUAGE]
  return dict[key] ?? DICTIONARIES[DEFAULT_LANGUAGE][key] ?? key
}

/** Build a bound translator for a language: `const tr = translator("es")`. */
export function translator(language: LanguageCode): (key: string) => string {
  return (key: string) => t(key, language)
}
