/**
 * Global Language Architecture™ — Base Dictionary (Phase 5.5A)
 * ---------------------------------------------------------------------------
 * The WORKING-LANGUAGE resource file (English, US). This is the source of truth
 * for interface copy that has been migrated off hardcoded strings.
 *
 * Strategy this phase: establish the i18n CONVENTION and structure, not a full
 * translation. English stays the working language during active development
 * (copy is still changing constantly, so translating now would be wasteful).
 * When V1 copy stabilizes, sibling files (es.ts, fr.ts, …) are added with the
 * same keys and wired into locales/index.ts — no consumer changes required.
 *
 * Keys are namespaced by area ("nav.liveToday") so the dictionary stays
 * organized as coverage grows. `t()` (see index.ts) resolves a dotted key and
 * falls back to English when a translation is missing.
 */

export type Dictionary = Record<string, string>

/**
 * BASE_DICTIONARY — a representative, growing set of platform strings. New
 * surfaces add their keys here first, then reference them via `t()`.
 */
export const enUS: Dictionary = {
  // Navigation
  "nav.liveToday": "Live Today",
  "nav.sundayDesignDay": "Sunday Design Day",
  "nav.executiveTeam": "Executive Leadership Team",
  "nav.advisoryNetwork": "Professional Advisory Network",
  "nav.outputArchitecture": "Output Architecture",
  "nav.memberProfile": "Member Profile",
  "nav.myHarmony": "My Harmony",

  // Common actions
  "common.save": "Save",
  "common.cancel": "Cancel",
  "common.back": "Back",
  "common.close": "Close",
  "common.change": "Change",
  "common.done": "Done",

  // Member Profile · Language & Region
  "profile.language.title": "Language & Region",
  "profile.language.eyebrow": "Preferred Language™",
  "profile.language.description":
    "Choose the language you'd like to work in and how information is presented. You're always in control.",
  "profile.language.chooseLanguage": "Language",
  "profile.language.localizationHeading": "How information is presented",
  "profile.language.dateFormat": "Date format",
  "profile.language.timeFormat": "Time format",
  "profile.language.numberFormat": "Number format",
  "profile.language.currency": "Currency",
  "profile.language.measurement": "Measurement",
  "profile.language.preview": "Preview",
  "profile.language.resetLocalization": "Reset to language defaults",
  "profile.language.plannedNotice":
    "This language isn't fully translated yet — the interface will stay in English until translation is complete. Your region settings still apply now.",
}
