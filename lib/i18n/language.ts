/**
 * Global Language Architecture™ — Language Registry (Phase 5.5A)
 * ---------------------------------------------------------------------------
 * The SINGLE SOURCE OF TRUTH for the languages Harmony Lane™ can communicate in.
 *
 * A core goal of the Operating System™ is accessibility: "Every entrepreneur,
 * everywhere, should be able to use Harmony Lane™." Language is therefore not a
 * feature — it is part of accessibility. This phase makes the platform
 * LANGUAGE-READY without translating the whole UI yet (English stays the working
 * language during active development; translation happens once V1 copy
 * stabilizes).
 *
 * ARCHITECTURAL SEPARATION (important):
 *   • Language      → "What language should I communicate in?"  (this module)
 *   • Localization  → "How should information be presented?"    (localization.ts)
 * They are modeled independently so a member can, e.g., read Spanish while still
 * seeing USD and imperial units — or English (UK) with metric and DD/MM/YYYY.
 *
 * Data-only. No translation content lives here (see /locales); no logic consumes
 * these definitions for behavior yet. Every future system (Cherry Blossom™,
 * Business Comprehension™, Deliverables™, Harmony Business Academy™) plugs into
 * this registry WITHOUT a redesign.
 */

/**
 * Supported language codes. These are the identifiers members choose from.
 * BCP-47-style codes so they map cleanly to Intl APIs and future translation
 * resource files. English is offered as US/UK because members expect it in the
 * selector — the actual spelling/format differences are handled by Localization.
 */
export type LanguageCode =
  | "en-US"
  | "en-GB"
  | "es"
  | "fr"
  | "pt"
  | "de"
  | "it"
  | "ja"
  | "ko"
  | "zh-CN"
  | "zh-TW"
  | "ar"
  | "hi"

/** Text direction. Only Arabic is right-to-left in the current set. */
export type TextDirection = "ltr" | "rtl"

export interface LanguageDefinition {
  /** Stable identifier — safe for storage, routing, and Intl/resource lookups. */
  code: LanguageCode
  /** Name in English (for the selector when shown to English speakers). */
  englishName: string
  /** Endonym — the language's own name, always shown so it's self-identifying. */
  nativeName: string
  /** Reading direction; drives future `dir` attribute + layout mirroring. */
  direction: TextDirection
  /**
   * The BCP-47 locale used as the SENSIBLE DEFAULT for this language's
   * Localization (date/number/currency/etc.). Members can override every part
   * independently — this is only the starting point. See localization.ts.
   */
  defaultLocale: string
  /**
   * Translation readiness. Only the working language is "active" this phase;
   * everything else is "planned" and falls back to English at runtime.
   */
  translationStatus: "active" | "planned"
}

/**
 * SUPPORTED_LANGUAGES — the languages a founder can choose. Ordered with the
 * working language first, then by rough global reach. Adding a language later is
 * a one-line append plus a resource file; nothing else needs to change.
 */
export const SUPPORTED_LANGUAGES: LanguageDefinition[] = [
  {
    code: "en-US",
    englishName: "English (US)",
    nativeName: "English (US)",
    direction: "ltr",
    defaultLocale: "en-US",
    translationStatus: "active",
  },
  {
    code: "en-GB",
    englishName: "English (UK)",
    nativeName: "English (UK)",
    direction: "ltr",
    defaultLocale: "en-GB",
    translationStatus: "active",
  },
  {
    code: "es",
    englishName: "Spanish",
    nativeName: "Español",
    direction: "ltr",
    defaultLocale: "es-ES",
    translationStatus: "planned",
  },
  {
    code: "fr",
    englishName: "French",
    nativeName: "Français",
    direction: "ltr",
    defaultLocale: "fr-FR",
    translationStatus: "planned",
  },
  {
    code: "pt",
    englishName: "Portuguese",
    nativeName: "Português",
    direction: "ltr",
    defaultLocale: "pt-BR",
    translationStatus: "planned",
  },
  {
    code: "de",
    englishName: "German",
    nativeName: "Deutsch",
    direction: "ltr",
    defaultLocale: "de-DE",
    translationStatus: "planned",
  },
  {
    code: "it",
    englishName: "Italian",
    nativeName: "Italiano",
    direction: "ltr",
    defaultLocale: "it-IT",
    translationStatus: "planned",
  },
  {
    code: "ja",
    englishName: "Japanese",
    nativeName: "日本語",
    direction: "ltr",
    defaultLocale: "ja-JP",
    translationStatus: "planned",
  },
  {
    code: "ko",
    englishName: "Korean",
    nativeName: "한국어",
    direction: "ltr",
    defaultLocale: "ko-KR",
    translationStatus: "planned",
  },
  {
    code: "zh-CN",
    englishName: "Simplified Chinese",
    nativeName: "简体中文",
    direction: "ltr",
    defaultLocale: "zh-CN",
    translationStatus: "planned",
  },
  {
    code: "zh-TW",
    englishName: "Traditional Chinese",
    nativeName: "繁體中文",
    direction: "ltr",
    defaultLocale: "zh-TW",
    translationStatus: "planned",
  },
  {
    code: "ar",
    englishName: "Arabic",
    nativeName: "العربية",
    direction: "rtl",
    defaultLocale: "ar-SA",
    translationStatus: "planned",
  },
  {
    code: "hi",
    englishName: "Hindi",
    nativeName: "हिन्दी",
    direction: "ltr",
    defaultLocale: "hi-IN",
    translationStatus: "planned",
  },
]

/** The working language during development. Everything falls back to this. */
export const DEFAULT_LANGUAGE: LanguageCode = "en-US"

/** Look up a language definition by code. Falls back to the default language. */
export function getLanguage(code: LanguageCode | string | null | undefined): LanguageDefinition {
  return SUPPORTED_LANGUAGES.find((l) => l.code === code) ?? SUPPORTED_LANGUAGES[0]
}

/** Type guard for a supported language code. */
export function isLanguageCode(value: unknown): value is LanguageCode {
  return typeof value === "string" && SUPPORTED_LANGUAGES.some((l) => l.code === value)
}
