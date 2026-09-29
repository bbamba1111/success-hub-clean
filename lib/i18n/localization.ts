/**
 * Global Language Architecture™ — Localization Registry (Phase 5.5A)
 * ---------------------------------------------------------------------------
 * The SINGLE SOURCE OF TRUTH for HOW information is presented to a member —
 * independent from WHICH language it's written in (see language.ts).
 *
 * Modeling localization separately now lets Harmony Lane™ become a truly global
 * Founder Operating System™ without a later redesign. A member can read Spanish
 * with USD + imperial units, or English (UK) with metric + DD/MM/YYYY — every
 * dimension is independently overridable.
 *
 * Dimensions covered this phase:
 *   • Locale                (BCP-47 tag used by Intl)
 *   • Date format           (MM/DD/YYYY · DD/MM/YYYY · YYYY/MM/DD)
 *   • Time format           (12-hour · 24-hour)
 *   • Number format         (1,000.00 · 1.000,00 · 1 000,00)
 *   • Currency              (USD, EUR, GBP, JPY, …)
 *   • Measurement system    (imperial · metric)
 *   • Time zone             (already relevant to the live co-working rhythm)
 *
 * The formatter helpers are pure and dependency-free (built on the platform Intl
 * API). They READ a resolved preference; they do not store anything. Regional
 * holidays are noted as future and intentionally NOT modeled yet.
 */

import { getLanguage, type LanguageCode } from "./language"

export type DateFormat = "MDY" | "DMY" | "YMD"
export type TimeFormat = "12h" | "24h"
/** How thousands/decimals are grouped. */
export type NumberFormat = "comma-dot" | "dot-comma" | "space-comma"
export type MeasurementSystem = "imperial" | "metric"

/** A fully-resolved presentation preference. Every field has a concrete value. */
export interface LocalizationPreference {
  /** BCP-47 locale tag (e.g. "en-GB"), used directly by Intl formatters. */
  locale: string
  dateFormat: DateFormat
  timeFormat: TimeFormat
  numberFormat: NumberFormat
  /** ISO 4217 currency code (e.g. "USD"). */
  currency: string
  measurementSystem: MeasurementSystem
  /**
   * IANA time zone (e.g. "America/New_York") or "auto" to follow the browser.
   * Kept as a preference because it drives the live co-working rhythm.
   */
  timeZone: string
}

/** The dimensions a member can override on top of their language defaults. */
export type LocalizationOverrides = Partial<LocalizationPreference>

/* -- Option metadata (for building selectors + previews) ------------------- */

export interface OptionMeta<T extends string> {
  value: T
  label: string
  example: string
}

export const DATE_FORMAT_OPTIONS: OptionMeta<DateFormat>[] = [
  { value: "MDY", label: "Month / Day / Year", example: "07/10/2026" },
  { value: "DMY", label: "Day / Month / Year", example: "10/07/2026" },
  { value: "YMD", label: "Year / Month / Day", example: "2026/07/10" },
]

export const TIME_FORMAT_OPTIONS: OptionMeta<TimeFormat>[] = [
  { value: "12h", label: "12-hour", example: "3:30 PM" },
  { value: "24h", label: "24-hour", example: "15:30" },
]

export const NUMBER_FORMAT_OPTIONS: OptionMeta<NumberFormat>[] = [
  { value: "comma-dot", label: "1,000.00", example: "1,000.00" },
  { value: "dot-comma", label: "1.000,00", example: "1.000,00" },
  { value: "space-comma", label: "1 000,00", example: "1 000,00" },
]

export const MEASUREMENT_OPTIONS: OptionMeta<MeasurementSystem>[] = [
  { value: "imperial", label: "Imperial", example: "miles · pounds · °F" },
  { value: "metric", label: "Metric", example: "kilometers · kilograms · °C" },
]

/** Curated currency list — the codes most relevant to the supported languages. */
export interface CurrencyMeta {
  code: string
  symbol: string
  name: string
}

export const CURRENCIES: CurrencyMeta[] = [
  { code: "USD", symbol: "$", name: "US Dollar" },
  { code: "EUR", symbol: "€", name: "Euro" },
  { code: "GBP", symbol: "£", name: "British Pound" },
  { code: "JPY", symbol: "¥", name: "Japanese Yen" },
  { code: "KRW", symbol: "₩", name: "South Korean Won" },
  { code: "CNY", symbol: "¥", name: "Chinese Yuan" },
  { code: "TWD", symbol: "NT$", name: "New Taiwan Dollar" },
  { code: "INR", symbol: "₹", name: "Indian Rupee" },
  { code: "BRL", symbol: "R$", name: "Brazilian Real" },
  { code: "CAD", symbol: "CA$", name: "Canadian Dollar" },
  { code: "AUD", symbol: "A$", name: "Australian Dollar" },
  { code: "CHF", symbol: "CHF", name: "Swiss Franc" },
  { code: "AED", symbol: "د.إ", name: "UAE Dirham" },
]

/**
 * LOCALIZATION_DEFAULTS — sensible presentation defaults per language. These are
 * ONLY starting points; the member overrides any dimension independently. Keyed
 * by LanguageCode so language and localization stay decoupled but coordinated.
 */
export const LOCALIZATION_DEFAULTS: Record<LanguageCode, LocalizationPreference> = {
  "en-US": { locale: "en-US", dateFormat: "MDY", timeFormat: "12h", numberFormat: "comma-dot", currency: "USD", measurementSystem: "imperial", timeZone: "auto" },
  "en-GB": { locale: "en-GB", dateFormat: "DMY", timeFormat: "24h", numberFormat: "comma-dot", currency: "GBP", measurementSystem: "metric", timeZone: "auto" },
  es: { locale: "es-ES", dateFormat: "DMY", timeFormat: "24h", numberFormat: "dot-comma", currency: "EUR", measurementSystem: "metric", timeZone: "auto" },
  fr: { locale: "fr-FR", dateFormat: "DMY", timeFormat: "24h", numberFormat: "space-comma", currency: "EUR", measurementSystem: "metric", timeZone: "auto" },
  pt: { locale: "pt-BR", dateFormat: "DMY", timeFormat: "24h", numberFormat: "dot-comma", currency: "BRL", measurementSystem: "metric", timeZone: "auto" },
  de: { locale: "de-DE", dateFormat: "DMY", timeFormat: "24h", numberFormat: "dot-comma", currency: "EUR", measurementSystem: "metric", timeZone: "auto" },
  it: { locale: "it-IT", dateFormat: "DMY", timeFormat: "24h", numberFormat: "dot-comma", currency: "EUR", measurementSystem: "metric", timeZone: "auto" },
  ja: { locale: "ja-JP", dateFormat: "YMD", timeFormat: "24h", numberFormat: "comma-dot", currency: "JPY", measurementSystem: "metric", timeZone: "auto" },
  ko: { locale: "ko-KR", dateFormat: "YMD", timeFormat: "12h", numberFormat: "comma-dot", currency: "KRW", measurementSystem: "metric", timeZone: "auto" },
  "zh-CN": { locale: "zh-CN", dateFormat: "YMD", timeFormat: "24h", numberFormat: "comma-dot", currency: "CNY", measurementSystem: "metric", timeZone: "auto" },
  "zh-TW": { locale: "zh-TW", dateFormat: "YMD", timeFormat: "24h", numberFormat: "comma-dot", currency: "TWD", measurementSystem: "metric", timeZone: "auto" },
  ar: { locale: "ar-SA", dateFormat: "DMY", timeFormat: "12h", numberFormat: "comma-dot", currency: "AED", measurementSystem: "metric", timeZone: "auto" },
  hi: { locale: "hi-IN", dateFormat: "DMY", timeFormat: "24h", numberFormat: "comma-dot", currency: "INR", measurementSystem: "metric", timeZone: "auto" },
}

/** Get the default presentation preference for a language. */
export function getLocalizationDefaults(language: LanguageCode): LocalizationPreference {
  return LOCALIZATION_DEFAULTS[language] ?? LOCALIZATION_DEFAULTS[getLanguage(language).code]
}

/**
 * Resolve a member's full presentation preference by layering their overrides on
 * top of the language defaults. This is the value the whole platform reads.
 */
export function resolveLocalization(
  language: LanguageCode,
  overrides?: LocalizationOverrides,
): LocalizationPreference {
  return { ...getLocalizationDefaults(language), ...(overrides ?? {}) }
}

/* -- Pure formatter helpers (Intl-based, no side effects) ------------------ */

/** Map our simple number-format enum to an Intl-usable locale for grouping. */
const NUMBER_LOCALE: Record<NumberFormat, string> = {
  "comma-dot": "en-US",
  "dot-comma": "de-DE",
  "space-comma": "fr-FR",
}

/** Format a number per the member's number-format preference. */
export function formatNumber(value: number, pref: LocalizationPreference): string {
  try {
    return new Intl.NumberFormat(NUMBER_LOCALE[pref.numberFormat]).format(value)
  } catch {
    return String(value)
  }
}

/** Format a currency amount per the member's currency + number preferences. */
export function formatCurrency(value: number, pref: LocalizationPreference): string {
  try {
    return new Intl.NumberFormat(NUMBER_LOCALE[pref.numberFormat], {
      style: "currency",
      currency: pref.currency,
    }).format(value)
  } catch {
    return `${pref.currency} ${value}`
  }
}

/** Format a date per the member's date-format preference. */
export function formatDate(date: Date, pref: LocalizationPreference): string {
  const y = date.getFullYear()
  const m = String(date.getMonth() + 1).padStart(2, "0")
  const d = String(date.getDate()).padStart(2, "0")
  switch (pref.dateFormat) {
    case "DMY":
      return `${d}/${m}/${y}`
    case "YMD":
      return `${y}/${m}/${d}`
    case "MDY":
    default:
      return `${m}/${d}/${y}`
  }
}

/** Format a time per the member's time-format preference. */
export function formatTime(date: Date, pref: LocalizationPreference): string {
  try {
    return new Intl.DateTimeFormat(pref.locale, {
      hour: "numeric",
      minute: "2-digit",
      hour12: pref.timeFormat === "12h",
    }).format(date)
  } catch {
    return date.toISOString()
  }
}
