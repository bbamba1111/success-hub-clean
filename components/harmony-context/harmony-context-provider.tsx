"use client"

/**
 * Harmony Context Engine™ — React boundary (Phase 4B.2).
 *
 * The single context layer every workspace reads to know where the member is
 * inside the Operating System and what they designed on Sunday. It composes
 * two existing sources of truth (it never re-implements either):
 *
 *   1. The Operating Engine snapshot (useOperatingEngine) — current day,
 *      current segment, time of day. MUST be nested inside
 *      <OperatingEngineProvider>.
 *   2. The installed week (getInstalledWeek) — Weekly Intention™, Operating
 *      Rules™, Daily Non-Negotiables™, Priority Focus Areas™, CEO context.
 *
 * SESSION-ONLY this pass. When persistence arrives, only this provider changes
 * its data source (sessionStorage → Supabase) — the HarmonyContextValue
 * contract, and therefore every consumer, stays exactly the same.
 */

import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from "react"
import { useOperatingEngine } from "@/components/operating-engine-provider"
import { getInstalledWeek, type InstalledWeek } from "@/lib/sunday-design-day/installed-week"
import { DESIGN_SEGMENTS, FOCUS_AREA_OPTIONS } from "@/components/sunday-design-day/sdd-config"
import { sddSegmentIdFor } from "@/lib/harmony-context/segment-map"
import {
  DEFAULT_BUSINESS_STAGE,
  getBusinessStage as getBusinessStageDef,
  type BusinessStage,
} from "@/lib/business-stage/business-stage"
import {
  BUSINESS_STAGE_EVENT,
  getBusinessStage as readBusinessStage,
  setBusinessStage as writeBusinessStage,
} from "@/lib/business-stage/business-stage-store"
import {
  DEFAULT_COMMUNICATION_STYLE,
  getCommunicationStyle as getCommunicationStyleDef,
  type CommunicationStyle,
} from "@/lib/business-comprehension/business-comprehension"
import {
  BUSINESS_COMPREHENSION_EVENT,
  getCommunicationStyle as readCommunicationStyle,
  setCommunicationStyle as writeCommunicationStyle,
} from "@/lib/business-comprehension/business-comprehension-store"
import { DEFAULT_LANGUAGE, getLanguage, type LanguageCode } from "@/lib/i18n/language"
import { resolveLocalization, type LocalizationOverrides } from "@/lib/i18n/localization"
import {
  LOCALE_PREFERENCES_EVENT,
  getLocalePreferences,
  resetLocalization as writeResetLocalization,
  setLocalizationOverrides as writeLocalizationOverrides,
  setPreferredLanguage as writePreferredLanguage,
  type LocalePreferences,
} from "@/lib/i18n/locale-preferences-store"
import type { HarmonyContextValue, HarmonySegment, TimeOfDay } from "@/lib/harmony-context/types"

/** id → human label / config lookups (built once). */
const FOCUS_LABEL = new Map(FOCUS_AREA_OPTIONS.map((o) => [o.id, o.label]))
const SEGMENT_CFG = new Map(DESIGN_SEGMENTS.map((s) => [s.id, s]))

const EMPTY_CEO = {
  priorities: "",
  aiAugmentation: "",
  businessOperatingRule: "",
  humanZoneOfGenius: "",
  executionFriction: "",
}

/** Four-way time-of-day split (adds "Night" beyond the engine's greeting period). */
function timeParts(hour: number): { timeOfDay: TimeOfDay; greeting: string } {
  if (hour < 12) return { timeOfDay: "Morning", greeting: "Good Morning" }
  if (hour < 17) return { timeOfDay: "Afternoon", greeting: "Good Afternoon" }
  if (hour < 21) return { timeOfDay: "Evening", greeting: "Good Evening" }
  return { timeOfDay: "Night", greeting: "Good Night" }
}

const HarmonyContext = createContext<HarmonyContextValue | null>(null)

export function HarmonyProvider({ children }: { children: ReactNode }) {
  const engine = useOperatingEngine()

  // Installed week is browser session state — read after mount to keep SSR
  // markup stable and avoid hydration mismatch.
  const [installed, setInstalled] = useState<InstalledWeek | null>(null)
  const [loaded, setLoaded] = useState(false)

  // Business Stage™ is session state too — default until the member chooses.
  // The founder is always in control; this only changes via setBusinessStage.
  const [businessStage, setStage] = useState<BusinessStage>(DEFAULT_BUSINESS_STAGE)

  // Business Comprehension™ (Communication Style™) — session state. A
  // communication preference, independent of Business Stage™; changed only by
  // the member via setCommunicationStyle.
  const [communicationStyle, setStyle] = useState<CommunicationStyle>(DEFAULT_COMMUNICATION_STYLE)

  // Locale preferences (language + localization overrides) — session state.
  const [localePrefs, setLocalePrefs] = useState<LocalePreferences>({
    language: DEFAULT_LANGUAGE,
    localization: {},
  })

  useEffect(() => {
    setInstalled(getInstalledWeek())
    setStage(readBusinessStage())
    setStyle(readCommunicationStyle())
    setLocalePrefs(getLocalePreferences())
    setLoaded(true)

    // Keep in sync if any signal changes elsewhere in this tab.
    const onStageChange = () => setStage(readBusinessStage())
    const onStyleChange = () => setStyle(readCommunicationStyle())
    const onLocaleChange = () => setLocalePrefs(getLocalePreferences())
    window.addEventListener(BUSINESS_STAGE_EVENT, onStageChange)
    window.addEventListener(BUSINESS_COMPREHENSION_EVENT, onStyleChange)
    window.addEventListener(LOCALE_PREFERENCES_EVENT, onLocaleChange)
    return () => {
      window.removeEventListener(BUSINESS_STAGE_EVENT, onStageChange)
      window.removeEventListener(BUSINESS_COMPREHENSION_EVENT, onStyleChange)
      window.removeEventListener(LOCALE_PREFERENCES_EVENT, onLocaleChange)
    }
  }, [])

  const setBusinessStage = useCallback((stage: BusinessStage) => {
    writeBusinessStage(stage)
    setStage(stage)
  }, [])

  const setCommunicationStyle = useCallback((style: CommunicationStyle) => {
    writeCommunicationStyle(style)
    setStyle(style)
  }, [])

  const setPreferredLanguage = useCallback((language: LanguageCode) => {
    writePreferredLanguage(language)
    setLocalePrefs(getLocalePreferences())
  }, [])

  const setLocalizationOverrides = useCallback((overrides: LocalizationOverrides) => {
    writeLocalizationOverrides(overrides)
    setLocalePrefs(getLocalePreferences())
  }, [])

  const resetLocalization = useCallback(() => {
    writeResetLocalization()
    setLocalePrefs(getLocalePreferences())
  }, [])

  const value = useMemo<HarmonyContextValue>(() => {
    const ready = Boolean(engine) && loaded
    const { timeOfDay, greeting } = timeParts(engine?.time.hour ?? 0)
    const currentBlock = engine?.businessDay.current

    const rawName = engine?.member.firstName
    const firstName = rawName && rawName !== "Friend" ? rawName : null

    // All designed segments with a rule, in canonical lived order. Falls back to
    // the suggested Non-Negotiable™ when the member left one blank.
    const installedById = new Map((installed?.segments ?? []).map((s) => [s.id, s]))
    const segments: HarmonySegment[] = DESIGN_SEGMENTS.flatMap((cfg) => {
      const s = installedById.get(cfg.id)
      if (!s || !s.rule) return []
      return [
        {
          id: cfg.id,
          title: cfg.title,
          rule: s.rule,
          nonNegotiable: s.nonNegotiable || cfg.defaultNonNegotiable,
          declaration: s.declaration || undefined,
        },
      ]
    })

    // Resolve the current designed segment via the engine block → SDD mapping.
    let currentSegment: HarmonySegment | null = null
    if (currentBlock) {
      const sddId = sddSegmentIdFor(currentBlock.id)
      if (sddId) currentSegment = segments.find((s) => s.id === sddId) ?? null
    }

    const focusAreas = (installed?.focusAreas ?? []).map((id) => FOCUS_LABEL.get(id) ?? id)

    // Business Stage™ derivations (architecture hooks — no logic reads these yet).
    const stageDef = getBusinessStageDef(businessStage)
    const recommendedFocusAreas = stageDef.recommendedFocusAreas.map((id) => FOCUS_LABEL.get(id) ?? id)

    // Business Comprehension™ derivations (architecture hook — no adaptive logic
    // reads these yet). Independent of Business Stage™.
    const styleDef = getCommunicationStyleDef(communicationStyle)

    // Global Language Architecture™ derivations. Language and localization are
    // resolved separately, then localization is layered defaults + overrides.
    const languageDef = getLanguage(localePrefs.language)
    const localization = resolveLocalization(localePrefs.language, localePrefs.localization)

    return {
      ready,
      hasDesignedWeek: Boolean(installed),
      dayName: engine?.time.dayName ?? "",
      timeOfDay,
      greeting,
      firstName,
      currentSegment,
      currentBlockTitle: currentBlock?.title ?? "",
      weeklyIntention: installed?.intention ?? "",
      weeklyDeclaration: installed?.declaration ?? "",
      focusAreas,
      segments,
      ceo: installed?.ceo ?? EMPTY_CEO,
      businessStage,
      businessStageDescription: stageDef.description,
      recommendedFocusAreas,
      recommendedExecutives: stageDef.recommendedExecutives,
      recommendedAdvisors: stageDef.recommendedAdvisors,
      setBusinessStage,
      // Business Comprehension™
      communicationStyle,
      communicationStyleName: styleDef.name,
      communicationStyleDescription: styleDef.description,
      preferredExamples: styleDef.preferredExamples,
      preferredVocabulary: styleDef.preferredVocabulary,
      setCommunicationStyle,
      // Global Language Architecture™
      preferredLanguage: localePrefs.language,
      languageName: languageDef.nativeName,
      textDirection: languageDef.direction,
      isTranslationActive: languageDef.translationStatus === "active",
      localization,
      preferredLocale: localization.locale,
      preferredDateFormat: localization.dateFormat,
      preferredTimeFormat: localization.timeFormat,
      preferredNumberFormat: localization.numberFormat,
      preferredCurrency: localization.currency,
      preferredMeasurementSystem: localization.measurementSystem,
      preferredTimeZone: localization.timeZone,
      setPreferredLanguage,
      setLocalizationOverrides,
      resetLocalization,
    }
  }, [
    engine,
    installed,
    loaded,
    businessStage,
    setBusinessStage,
    communicationStyle,
    setCommunicationStyle,
    localePrefs,
    setPreferredLanguage,
    setLocalizationOverrides,
    resetLocalization,
  ])

  return <HarmonyContext.Provider value={value}>{children}</HarmonyContext.Provider>
}

/**
 * Read the shared Harmony Context Engine™ snapshot. Must be called inside
 * <HarmonyProvider> (which itself must be inside <OperatingEngineProvider>).
 */
export function useHarmonyContext(): HarmonyContextValue {
  const ctx = useContext(HarmonyContext)
  if (!ctx) throw new Error("useHarmonyContext must be used within HarmonyProvider")
  return ctx
}

/** Non-throwing variant for optional consumers. Returns null outside a provider. */
export function useHarmonyContextOptional(): HarmonyContextValue | null {
  return useContext(HarmonyContext)
}
