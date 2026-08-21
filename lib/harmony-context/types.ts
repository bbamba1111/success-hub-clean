/**
 * Harmony Context Engine™ — shared types (Phase 4B.2).
 *
 * The single normalized shape every workspace reads to answer:
 * "Where is this member inside the Operating System right now, and what did
 * they intentionally design?" It composes two existing sources of truth:
 *   1. The Operating Engine (operating-engine/) → time, day, current segment.
 *   2. The installed week from Sunday Design Day™ → intention, rules, etc.
 *
 * SESSION-ONLY this pass. In later phases the provider will swap its data
 * source from sessionStorage to Supabase without changing this contract — so
 * consumers (Cherry Blossom, Live Today™, My Harmony™, the AI Executive
 * Leadership Team™) never need to be refactored.
 */

import type { BusinessStage } from "@/lib/business-stage/business-stage"
import type { CommunicationStyle } from "@/lib/business-comprehension/business-comprehension"
import type { BusinessContextProfile } from "@/lib/business-context/types"
 import type { FounderLearningProfile } from "@/lib/founder-learning/types"
 import type { FounderDestinationData } from "@/utils/founder-destination-storage"
import type { LanguageCode, TextDirection } from "@/lib/i18n/language"
import type {
  DateFormat,
  LocalizationOverrides,
  LocalizationPreference,
  MeasurementSystem,
  NumberFormat,
  TimeFormat,
} from "@/lib/i18n/localization"

export type TimeOfDay = "Morning" | "Afternoon" | "Evening" | "Night"

/** A single operating segment, resolved to the member's designed values. */
export interface HarmonySegment {
  /** Sunday Design Day™ segment id (see sdd-config.ts). */
  id: string
  title: string
  /** Operating Rule™ — the strategic standard ("how will I operate?"). */
  rule: string
  /** Daily Non-Negotiable™ — the commitment lived today ("what will I honor?"). */
  nonNegotiable: string
  /**
   * Intention Declaration™ — the identity-based present-tense statement Cherry
   * Blossom™ generated from the founder's commitment during Design My Week™.
   * Shown as the Practice™ cue when the founder enters this segment in Live Today™.
   */
  declaration?: string
}

/** CEO Workday™ context designed on Sunday. */
export interface HarmonyCeoContext {
  priorities: string
  aiAugmentation: string
  businessOperatingRule: string
  humanZoneOfGenius: string
  executionFriction: string
}

/** The complete operating-context snapshot shared across the platform. */
export interface HarmonyContextValue {
  /** True once the client has mounted and the engine has produced a snapshot. */
  ready: boolean
  /** Whether the member has installed a week via Sunday Design Day™. */
  hasDesignedWeek: boolean

  /* -- Time context (from the Operating Engine) ------------------------- */
  /** e.g. "Tuesday". */
  dayName: string
  timeOfDay: TimeOfDay
  /** e.g. "Good Morning". */
  greeting: string
  firstName: string | null

  /* -- Current operating segment (engine block → designed segment) ------ */
  /** The designed segment for the current moment, or null (e.g. overnight). */
  currentSegment: HarmonySegment | null
  /** The engine's current block title, always present (even when undesigned). */
  currentBlockTitle: string

  /* -- Weekly context (from the installed week) ------------------------- */
  weeklyIntention: string
  weeklyDeclaration: string
  /** Human-readable Priority Focus Area™ labels. */
  focusAreas: string[]
  /** All designed segments, in canonical lived order. */
  segments: HarmonySegment[]

  /* -- CEO context ------------------------------------------------------ */
  ceo: HarmonyCeoContext

  /* -- Business Stage™ (Phase 5.4) -------------------------------------- */
  /**
   * The founder's current Business Stage™ — a CONTEXTUAL signal, not a tier.
   * The founder is always in control (changed only via setBusinessStage).
   * No recommendation logic reads these yet; they are architecture hooks.
   */
  businessStage: BusinessStage
  /** Human-readable description of the current stage. */
  businessStageDescription: string
  /** Priority Focus Area™ labels emphasized at this stage. */
  recommendedFocusAreas: string[]
  /** Executive ids a future phase may surface first at this stage. */
  recommendedExecutives: string[]
  /** Advisor ids a future phase may surface first at this stage. */
  recommendedAdvisors: string[]
  /** Update the founder's stage (session-only this phase). */
  setBusinessStage: (stage: BusinessStage) => void

  /* -- Business Comprehension™ (Phase 5.6) ------------------------------ */
  /**
   * How the founder prefers business concepts to be EXPLAINED — a communication
   * preference, NOT an assessment, education level, or measure of intelligence.
   * It is independent of Business Stage™. Adapting the explanation never changes
   * the underlying recommendation. Architecture hook: no adaptive logic reads
   * this yet; the founder is always in control (changed only via
   * setCommunicationStyle).
   */
  communicationStyle: CommunicationStyle
  /** Brand name of the current style (e.g. "Business Builder™"). */
  communicationStyleName: string
  /** Human-readable description of the current communication style. */
  communicationStyleDescription: string
  /** The kind of examples this style favors (architecture hook). */
  preferredExamples: string
  /** The vocabulary register this style uses (architecture hook). */
  preferredVocabulary: string
  /** Update the founder's Communication Style™ (session-only this phase). */
  setCommunicationStyle: (style: CommunicationStyle) => void

  /* -- Global Language Architecture™ (Phase 5.5A) ----------------------- */
  /**
   * Language answers "what language should I communicate in?"; Localization
   * answers "how should information be presented?" — modeled separately so a
   * member can, e.g., read Spanish while seeing USD + imperial units. These are
   * architecture hooks: the UI is not translated yet (English stays the working
   * language), but every surface can already READ the member's preferences.
   */
  /** The member's Preferred Language™ code (e.g. "en-US", "es"). */
  preferredLanguage: LanguageCode
  /** The language's own name (endonym), for display. */
  languageName: string
  /** Reading direction — drives future `dir`/layout mirroring (rtl for Arabic). */
  textDirection: TextDirection
  /** Whether the chosen language is fully translated yet (else English fallback). */
  isTranslationActive: boolean

  /** The fully-resolved presentation preference (language defaults + overrides). */
  localization: LocalizationPreference
  preferredLocale: string
  preferredDateFormat: DateFormat
  preferredTimeFormat: TimeFormat
  preferredNumberFormat: NumberFormat
  preferredCurrency: string
  preferredMeasurementSystem: MeasurementSystem
  preferredTimeZone: string

  /** Set the Preferred Language™ (resets localization to the new defaults). */
  setPreferredLanguage: (language: LanguageCode) => void
  /** Override one or more presentation dimensions independently. */
  setLocalizationOverrides: (overrides: LocalizationOverrides) => void
  /** Clear localization overrides, returning to the language defaults. */
  resetLocalization: () => void

  /* -- Business Context Profile™ (Phase 10.1) -------------------------- */
  /**
   * The founder's Business Context Profile™ — collected during onboarding.
   * Null until the founder completes the Business Context Profile™ wizard.
   * Architecture hook: surfaces business personalisation data to all consumers.
   */
  businessContext: BusinessContextProfile | null

  /* -- Founder Learning Profile™ (Phase 10.1) -------------------------- */
  /**
   * The founder's Founder Learning Profile™ — collected alongside the
   * Business Context Profile™. Null until the wizard is completed.
   * Drives Learn Before You Launch™ curriculum prioritization.
   */
  founderLearning: FounderLearningProfile | null

  /* -- Founder Profile™ -------------------------------------------------- */
  /**
   * The founder's Founder Profile™ — identity, family, and lifestyle context
   * collected on the required onboarding on-ramp. Null until the founder
   * completes the Founder Profile™ form. Loosely typed (mirrors the real
   * form's `FormData` shape) since this engine only passes it through to
   * consumers like Cherry Blossom™ — it does not interpret individual fields.
   */
  founderProfile: Record<string, unknown> | null

  /* -- Founder Destination™ (Phase 2) ------------------------------------ */
  /**
   * The founder's Founder Destination™ — where they want their business,
   * their own role, their life, and their future workplace to end up. Null
   * until the founder saves at least one field of the Founder Destination™
   * form. This engine only passes it through to consumers (Founder GPS™,
   * Cherry Blossom™, the Executive Team) — it does not interpret fields.
   */
  founderDestination: FounderDestinationData | null
}
