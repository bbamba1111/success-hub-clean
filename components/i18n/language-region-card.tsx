"use client"

/**
 * Language & Region Card (Phase 5.5A — Global Language Architecture™).
 *
 * The member-facing surface for Preferred Language™ + Localization. It lets a
 * founder choose the language they work in AND, independently, how information
 * is presented (date/time/number formats, currency, measurement). It reads/
 * writes the session store directly (lib/i18n/locale-preferences-store), which
 * dispatches LOCALE_PREFERENCES_EVENT so the Harmony Context Engine™ and any
 * other live view stay in sync.
 *
 * Architecture only: the interface is not translated yet (English stays the
 * working language). Choosing a not-yet-translated language keeps the UI in
 * English but STILL applies the member's region settings immediately.
 */

import { useEffect, useMemo, useState } from "react"
import { Languages, RotateCcw } from "lucide-react"
import {
  SUPPORTED_LANGUAGES,
  getLanguage,
  type LanguageCode,
} from "@/lib/i18n/language"
import {
  CURRENCIES,
  DATE_FORMAT_OPTIONS,
  MEASUREMENT_OPTIONS,
  NUMBER_FORMAT_OPTIONS,
  TIME_FORMAT_OPTIONS,
  formatCurrency,
  formatDate,
  formatNumber,
  formatTime,
  resolveLocalization,
  type DateFormat,
  type MeasurementSystem,
  type NumberFormat,
  type TimeFormat,
} from "@/lib/i18n/localization"
import {
  LOCALE_PREFERENCES_EVENT,
  getLocalePreferences,
  resetLocalization,
  setLocalizationOverrides,
  setPreferredLanguage,
  type LocalePreferences,
} from "@/lib/i18n/locale-preferences-store"

const DEFAULT_PREFS: LocalePreferences = { language: "en-US", localization: {} }

export function LanguageRegionCard() {
  const [prefs, setPrefs] = useState<LocalePreferences>(DEFAULT_PREFS)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setPrefs(getLocalePreferences())
    setMounted(true)
    const onChange = () => setPrefs(getLocalePreferences())
    window.addEventListener(LOCALE_PREFERENCES_EVENT, onChange)
    return () => window.removeEventListener(LOCALE_PREFERENCES_EVENT, onChange)
  }, [])

  const languageDef = getLanguage(prefs.language)
  const resolved = useMemo(
    () => resolveLocalization(prefs.language, prefs.localization),
    [prefs],
  )
  const hasOverrides = mounted && Object.keys(prefs.localization).length > 0
  const isPlanned = languageDef.translationStatus !== "active"

  // Live preview uses a fixed reference moment so it's deterministic.
  const preview = useMemo(() => {
    const ref = new Date(2026, 6, 10, 15, 30) // 10 Jul 2026, 3:30 PM
    return {
      date: formatDate(ref, resolved),
      time: formatTime(ref, resolved),
      number: formatNumber(1000.5, resolved),
      currency: formatCurrency(1000, resolved),
      units: MEASUREMENT_OPTIONS.find((m) => m.value === resolved.measurementSystem)?.example ?? "",
    }
  }, [resolved])

  return (
    <div className="harmony-panel p-6 sm:p-8" aria-labelledby="language-region-heading">
      {/* Header */}
      <div className="flex items-start gap-4">
        <span className="inline-flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-brand-green/10">
          <Languages className="h-6 w-6 text-brand-green" aria-hidden />
        </span>
        <div>
          <p className="ds-eyebrow">Preferred Language™ &amp; Region</p>
          <h3
            id="language-region-heading"
            className="mt-1 font-display text-2xl font-semibold tracking-tight text-brand-ink"
          >
            Language &amp; Region
          </h3>
          <p className="mt-1 text-sm leading-relaxed text-brand-ink-soft">
            Choose the language you work in and, separately, how information is presented. You&apos;re always in
            control.
          </p>
        </div>
      </div>

      {/* Language */}
      <div className="mt-6">
        <label htmlFor="preferred-language" className="text-xs font-semibold uppercase tracking-[0.12em] text-brand-ink-soft">
          Language
        </label>
        <select
          id="preferred-language"
          value={mounted ? prefs.language : "en-US"}
          onChange={(e) => setPreferredLanguage(e.target.value as LanguageCode)}
          className="mt-2 w-full rounded-xl border border-black/[0.08] bg-white px-4 py-3 text-sm text-brand-ink outline-none transition-colors focus-visible:border-brand-green focus-visible:ring-2 focus-visible:ring-brand-green/30"
          dir={languageDef.direction}
        >
          {SUPPORTED_LANGUAGES.map((l) => (
            <option key={l.code} value={l.code}>
              {l.nativeName}
              {l.englishName !== l.nativeName ? ` — ${l.englishName}` : ""}
            </option>
          ))}
        </select>

        {isPlanned ? (
          <p className="mt-3 rounded-xl border border-brand-coral/20 bg-brand-coral/5 px-4 py-3 text-sm leading-relaxed text-brand-ink">
            <span className="font-semibold">Coming soon:</span> {languageDef.englishName} isn&apos;t fully translated
            yet, so the interface stays in English for now. Your region settings below still apply immediately.
          </p>
        ) : null}
      </div>

      {/* Localization — presented independently from language */}
      <fieldset className="mt-8 border-t border-black/[0.06] pt-6">
        <legend className="text-xs font-semibold uppercase tracking-[0.12em] text-brand-ink-soft">
          How information is presented
        </legend>

        <div className="mt-4 grid gap-4 sm:grid-cols-2">
          <SelectField
            id="date-format"
            label="Date format"
            value={resolved.dateFormat}
            onChange={(v) => setLocalizationOverrides({ dateFormat: v as DateFormat })}
            options={DATE_FORMAT_OPTIONS.map((o) => ({ value: o.value, label: `${o.label} · ${o.example}` }))}
          />
          <SelectField
            id="time-format"
            label="Time format"
            value={resolved.timeFormat}
            onChange={(v) => setLocalizationOverrides({ timeFormat: v as TimeFormat })}
            options={TIME_FORMAT_OPTIONS.map((o) => ({ value: o.value, label: `${o.label} · ${o.example}` }))}
          />
          <SelectField
            id="number-format"
            label="Number format"
            value={resolved.numberFormat}
            onChange={(v) => setLocalizationOverrides({ numberFormat: v as NumberFormat })}
            options={NUMBER_FORMAT_OPTIONS.map((o) => ({ value: o.value, label: o.label }))}
          />
          <SelectField
            id="currency"
            label="Currency"
            value={resolved.currency}
            onChange={(v) => setLocalizationOverrides({ currency: v })}
            options={CURRENCIES.map((c) => ({ value: c.code, label: `${c.code} · ${c.name}` }))}
          />
          <SelectField
            id="measurement"
            label="Measurement"
            value={resolved.measurementSystem}
            onChange={(v) => setLocalizationOverrides({ measurementSystem: v as MeasurementSystem })}
            options={MEASUREMENT_OPTIONS.map((o) => ({ value: o.value, label: o.label }))}
          />
        </div>

        {hasOverrides ? (
          <button
            type="button"
            onClick={() => resetLocalization()}
            className="mt-4 inline-flex items-center gap-2 text-sm font-medium text-brand-green transition-colors hover:text-brand-green-dark"
          >
            <RotateCcw className="h-4 w-4" aria-hidden />
            Reset to {languageDef.englishName} defaults
          </button>
        ) : null}
      </fieldset>

      {/* Live preview */}
      <div className="mt-8 rounded-2xl border border-black/[0.06] bg-brand-green/[0.04] p-5">
        <p className="text-xs font-semibold uppercase tracking-[0.12em] text-brand-ink-soft">Preview</p>
        <dl className="mt-3 grid grid-cols-2 gap-x-6 gap-y-3 sm:grid-cols-3" suppressHydrationWarning>
          <PreviewItem term="Date" value={preview.date} />
          <PreviewItem term="Time" value={preview.time} />
          <PreviewItem term="Number" value={preview.number} />
          <PreviewItem term="Currency" value={preview.currency} />
          <PreviewItem term="Units" value={preview.units} />
        </dl>
      </div>
    </div>
  )
}

function SelectField({
  id,
  label,
  value,
  onChange,
  options,
}: {
  id: string
  label: string
  value: string
  onChange: (value: string) => void
  options: { value: string; label: string }[]
}) {
  return (
    <div>
      <label htmlFor={id} className="text-xs font-medium text-brand-ink-soft">
        {label}
      </label>
      <select
        id={id}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="mt-1.5 w-full rounded-xl border border-black/[0.08] bg-white px-3 py-2.5 text-sm text-brand-ink outline-none transition-colors focus-visible:border-brand-green focus-visible:ring-2 focus-visible:ring-brand-green/30"
        suppressHydrationWarning
      >
        {options.map((o) => (
          <option key={o.value} value={o.value}>
            {o.label}
          </option>
        ))}
      </select>
    </div>
  )
}

function PreviewItem({ term, value }: { term: string; value: string }) {
  return (
    <div>
      <dt className="text-[0.7rem] font-semibold uppercase tracking-[0.1em] text-brand-ink-soft">{term}</dt>
      <dd className="mt-0.5 font-display text-base text-brand-ink">{value}</dd>
    </div>
  )
}
