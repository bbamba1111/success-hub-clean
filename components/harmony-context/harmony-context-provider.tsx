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
import {
  BUSINESS_CONTEXT_EVENT,
  getBusinessContext,
  saveBusinessContext,
} from "@/lib/business-context/business-context-store"
import {
  FOUNDER_LEARNING_EVENT,
  getFounderLearning,
} from "@/lib/founder-learning/founder-learning-store"
import {
  FOUNDER_PROFILE_EVENT,
  getFounderProfile,
  saveFounderProfile,
} from "@/lib/founder-profile/founder-profile-store"
import {
  FOUNDER_DESTINATION_EVENT,
  getFounderDestination,
  saveFounderDestination,
} from "@/lib/founder-destination/founder-destination-store"
import { getBusinessContextFromDb } from "@/utils/business-context-storage"
import { getFounderProfileFromDb } from "@/utils/founder-profile-storage"
import { getFounderDestinationFromDb } from "@/utils/founder-destination-storage"
import type { BusinessContextProfile } from "@/lib/business-context/types"
import type { FounderLearningProfile } from "@/lib/founder-learning/types"
import type { FounderDestinationProfile } from "@/lib/founder-destination/types"
import { getEsaResults } from "@/lib/entrepreneur-success/esa-storage"
import { getAuditResults } from "@/utils/audit-storage"
import { getWholeLifeContext } from "@/lib/whole-life-context/storage"
import type { WholeLifeContext } from "@/lib/whole-life-context/types"
import { EMPTY_WHOLE_LIFE_CONTEXT } from "@/lib/whole-life-context/types"
import { getLatestRealityCheck } from "@/utils/reality-check-storage"
import { getOperatingHistorySummary } from "@/lib/harmony-context/operating-history"
import {
  assembleHarmonySnapshot,
  EMPTY_HARMONY_SNAPSHOT,
  type HarmonyContextSnapshot,
  type RealityCheckInput,
  type OperatingHistorySummary,
} from "@/lib/harmony-context/engine"
import type { EsaResults } from "@/lib/entrepreneur-success/types"
import { createClient } from "@/lib/supabase/client"
import { getBbaSignalSummary, type BbaSignalSummary } from "@/lib/founder-gps/context/bba-context-aggregator"
import { getCeoWorkdayEvidence } from "@/lib/ceo-workday/plan-server"
import type { CeoWorkdayEvidenceSummary } from "@/lib/ceo-workday/plan-types"

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

  // Business Context Profile™ + Founder Learning Profile™ + Founder Profile™
  // — hydrated from the localStorage cache instantly on mount for paint, then
  // reconciled against the database (the account's canonical source of
  // truth) so every consumer downstream of this engine (Cherry Blossom™,
  // Founder GPS™, the Blueprint, etc.) sees real cross-device persistence
  // without needing to know persistence changed under them.
  const [businessContext, setBusinessContext] = useState<BusinessContextProfile | null>(null)
  const [founderLearning, setFounderLearning] = useState<FounderLearningProfile | null>(null)
  const [founderProfile, setFounderProfile] = useState<Record<string, unknown> | null>(null)
  const [founderDestination, setFounderDestination] = useState<FounderDestinationProfile | null>(null)

  // Harmony Context Snapshot™ inputs (Phase 6.2) — instant-local where a
  // localStorage cache exists (ESA, Audit, Whole-Life Context™), best-effort
  // real data otherwise (Reality Check™, Operating History™). None of these
  // block first paint; `snapshot.ready` reflects whether the initial load
  // has settled.
  const [esaResults, setEsaResults] = useState<EsaResults | null>(null)
  const [auditScore, setAuditScore] = useState<number | null>(null)
  const [wholeLife, setWholeLife] = useState<WholeLifeContext>(EMPTY_WHOLE_LIFE_CONTEXT)
  const [realityCheck, setRealityCheck] = useState<RealityCheckInput | null>(null)
  const [operatingHistory, setOperatingHistory] = useState<OperatingHistorySummary | null>(null)
  const [userId, setUserId] = useState<string | null>(null)
  // Business Bottleneck Audit™ (BBA™) signal summary — server-only data,
  // fetched via the `getBbaSignalSummary()` Server Action once `userId`
  // resolves. Stays `null` (never a false "no BBA data" signal) until the
  // fetch settles — see bba-context-aggregator.ts's degrades-gracefully
  // contract for why this distinction matters.
  const [bbaSignalSummary, setBbaSignalSummary] = useState<BbaSignalSummary | null>(null)
  // CEO Workday™ evidence — designed vs done vs decided-next from the most
  // recent plan. Same contract as BBA: null until fetched, never a false default.
  const [ceoWorkdayEvidence, setCeoWorkdayEvidence] = useState<CeoWorkdayEvidenceSummary | null>(null)

  useEffect(() => {
    setInstalled(getInstalledWeek())
    setStage(readBusinessStage())
    setStyle(readCommunicationStyle())
    setLocalePrefs(getLocalePreferences())
    setBusinessContext(getBusinessContext())
    setFounderLearning(getFounderLearning())
    setFounderProfile(getFounderProfile())
    setFounderDestination(getFounderDestination())
    // Harmony Context Snapshot™ inputs — instant-local cache first.
    setEsaResults(getEsaResults())
    setAuditScore(getAuditResults()?.overallScore ?? null)
    setWholeLife(getWholeLifeContext())
    setLoaded(true)

    // Best-effort real data — anonymous sessions resolve to null/empty and
    // the snapshot still assembles cleanly (never blocks paint or throws).
    createClient()
      .auth.getUser()
      .then(({ data }) => {
        const id = data.user?.id ?? null
        setUserId(id)
        // BBA signals require a signed-in founder — anonymous sessions
        // simply never populate bbaSignalSummary (never a false "no BBA
        // data" default; see bba-context-aggregator.ts).
        if (id) {
          getBbaSignalSummary(id).then(setBbaSignalSummary).catch(() => setBbaSignalSummary(null))
          getCeoWorkdayEvidence(id).then(setCeoWorkdayEvidence).catch(() => setCeoWorkdayEvidence(null))
        }
      })
      .catch(() => setUserId(null))
    getLatestRealityCheck().then((record) => {
      if (!record) return
      setRealityCheck({
        week_key: record.week_key,
        overall_score: record.overall_score,
        selected_priority_areas: record.selected_priority_areas,
      })
    })
    getOperatingHistorySummary().then(setOperatingHistory)

    // Database is authoritative — reconcile the cache-first paint above with
    // the account's real record once it resolves. Best-effort: no-ops when
    // signed out, leaving the local cache (or null) in place.
    getBusinessContextFromDb().then((record) => {
      if (!record) return
      const { updatedAt: _updatedAt, ...profile } = record
      setBusinessContext(profile)
      saveBusinessContext(profile)
    })
    getFounderProfileFromDb().then((record) => {
      if (!record) return
      const { completedAt: _completedAt, updatedAt: _updatedAt, ...profile } = record
      setFounderProfile(profile)
      saveFounderProfile(profile as unknown as Record<string, unknown>)
    })
    getFounderDestinationFromDb().then((record) => {
      if (!record) return
      const { completedAt: _completedAt, ...destination } = record
      setFounderDestination(destination)
      saveFounderDestination(destination)
    })

    // Keep in sync if any signal changes elsewhere in this tab.
    const onStageChange = () => setStage(readBusinessStage())
    const onStyleChange = () => setStyle(readCommunicationStyle())
    const onLocaleChange = () => setLocalePrefs(getLocalePreferences())
    const onBcChange = () => setBusinessContext(getBusinessContext())
    const onFlChange = () => setFounderLearning(getFounderLearning())
    const onFpChange = () => setFounderProfile(getFounderProfile())
    const onFdChange = () => setFounderDestination(getFounderDestination())
    window.addEventListener(BUSINESS_STAGE_EVENT, onStageChange)
    window.addEventListener(BUSINESS_COMPREHENSION_EVENT, onStyleChange)
    window.addEventListener(LOCALE_PREFERENCES_EVENT, onLocaleChange)
    window.addEventListener(BUSINESS_CONTEXT_EVENT, onBcChange)
    window.addEventListener(FOUNDER_LEARNING_EVENT, onFlChange)
    window.addEventListener(FOUNDER_PROFILE_EVENT, onFpChange)
    window.addEventListener(FOUNDER_DESTINATION_EVENT, onFdChange)
    return () => {
      window.removeEventListener(BUSINESS_STAGE_EVENT, onStageChange)
      window.removeEventListener(BUSINESS_COMPREHENSION_EVENT, onStyleChange)
      window.removeEventListener(LOCALE_PREFERENCES_EVENT, onLocaleChange)
      window.removeEventListener(BUSINESS_CONTEXT_EVENT, onBcChange)
      window.removeEventListener(FOUNDER_LEARNING_EVENT, onFlChange)
      window.removeEventListener(FOUNDER_PROFILE_EVENT, onFpChange)
      window.removeEventListener(FOUNDER_DESTINATION_EVENT, onFdChange)
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

    const withoutSnapshot: Omit<HarmonyContextValue, "snapshot"> = {
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
      // Business Context Profile™ + Founder Learning Profile™ + Founder Profile™
      businessContext,
      founderLearning,
      founderProfile,
      founderDestination,
    }

    // Harmony Context Snapshot™ (Phase 6.2) — assembled from every signal
    // this provider already loads. `harmonyContext` here only reads fields
    // already computed above (firstName, businessStage, dayName, etc.), so
    // this has no circular dependency on the `snapshot` field itself.
    const snapshot: HarmonyContextSnapshot = ready
      ? assembleHarmonySnapshot({
          userId,
          harmonyContext: withoutSnapshot as HarmonyContextValue,
          wholeLife,
          esaResults,
          auditScore,
          founderDestination,
          realityCheck,
          operatingHistory,
          bbaSignalSummary,
          ceoWorkdayEvidence,
        })
      : EMPTY_HARMONY_SNAPSHOT

    return { ...withoutSnapshot, snapshot }
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
    businessContext,
    founderLearning,
    founderProfile,
    founderDestination,
    userId,
    wholeLife,
    esaResults,
    auditScore,
    realityCheck,
    operatingHistory,
    bbaSignalSummary,
    ceoWorkdayEvidence,
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
