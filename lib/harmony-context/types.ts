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
}
