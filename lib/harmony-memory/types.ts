/**
 * Harmony Memory™ — Type Surface (Phase 10.5)
 * ---------------------------------------------------------------------------
 * Complete type contracts for the Harmony Memory™ system. Pure types only —
 * no React, no I/O.
 */

/* ===========================================================================
 * Core memory entry — discriminated union
 * ======================================================================== */

export type HarmonyMemoryEntryType =
  | "founder-memory"
  | "business-memory"
  | "executive-memory"
  | "learning-memory"
  | "asset-memory"
  | "life-memory"

interface BaseMemoryEntry {
  id: string
  type: HarmonyMemoryEntryType
  /** ISO timestamp */
  timestamp: string
  /** ISO date (YYYY-MM-DD) */
  date: string
  title: string
  summary: string
}

export interface FounderMemoryEntry extends BaseMemoryEntry {
  type: "founder-memory"
  segmentId: string
  outcome: "accepted" | "deferred" | "skipped" | "completed"
  skipReason?: string
  businessAssetCreated?: string
}

export interface BusinessMemoryEntry extends BaseMemoryEntry {
  type: "business-memory"
  changeType: "stage-change" | "context-update" | "goal-set" | "revenue-milestone"
  previousValue?: string
  newValue?: string
}

export interface ExecutiveMemoryEntryHM extends BaseMemoryEntry {
  type: "executive-memory"
  executiveId: string
  headline: string
  outcome: "surfaced" | "actioned" | "deferred" | "not-selected"
}

export interface LearningMemoryEntry extends BaseMemoryEntry {
  type: "learning-memory"
  topicId: string
  dimension: string
  briefingOutcome: "completed" | "deferred" | "skipped"
  communicationLevel: string
}

export interface AssetMemoryEntry extends BaseMemoryEntry {
  type: "asset-memory"
  assetId: string
  assetName: string
  assetCategory: string
}

export interface LifeMemoryEntry extends BaseMemoryEntry {
  type: "life-memory"
  eventType: "life-event" | "non-negotiable" | "personal-goal" | "relationship"
  eventName: string
}

export type HarmonyMemoryEntry =
  | FounderMemoryEntry
  | BusinessMemoryEntry
  | ExecutiveMemoryEntryHM
  | LearningMemoryEntry
  | AssetMemoryEntry
  | LifeMemoryEntry

/* ===========================================================================
 * Harmony Memory Store
 * ======================================================================== */

export interface HarmonyMemoryStore {
  version: 1
  entries: HarmonyMemoryEntry[]
  patternsLastAnalyzed: string | null
  insightsLastGenerated: string | null
}

/* ===========================================================================
 * Pattern Recognition™
 * ======================================================================== */

export type PatternStrength = "emerging" | "confirmed" | "strong"

export type PatternCategory =
  | "completion-cadence"
  | "skip-pattern"
  | "executive-win"
  | "capability-growth"
  | "asset-creation"
  | "life-event-impact"

export interface PatternSignal {
  id: string
  category: PatternCategory
  description: string
  /** How many data points support this pattern */
  evidenceCount: number
  /** ISO date */
  firstObserved: string
  /** ISO date */
  lastObserved: string
  strength: PatternStrength
  /** Optional segment/day-of-week context */
  contextHint?: string
}

/* ===========================================================================
 * Predictive Intelligence™
 * ======================================================================== */

export type PredictiveInsightType =
  | "capacity-threshold"
  | "asset-completion-forecast"
  | "seasonal-focus-risk"
  | "ceo-workday-protection"
  | "business-stage-transition"

export interface PredictiveInsight {
  id: string
  type: PredictiveInsightType
  headline: string
  rationale: string
  /** 0.0 – 1.0 */
  confidence: number
  /** ISO date — optional, relevant for time-bound predictions */
  relevantDate?: string
  actionSuggestion?: string
  actionHref?: string
}

/* ===========================================================================
 * Executive Milestones™
 * ======================================================================== */

export type MilestoneCategory =
  | "first-action"
  | "streak"
  | "volume"
  | "learning"
  | "recovery"
  | "executive-workday"

export interface ExecutiveMilestone {
  id: string
  /** ISO timestamp of achievement */
  achievedAt: string | null
  label: string
  category: MilestoneCategory
  /** Human-readable celebration note shown on achievement */
  celebrationNote: string
  earned: boolean
}

/* ===========================================================================
 * Executive Timeline™
 * ======================================================================== */

export type TimelineEntryType =
  | "gps-completion"
  | "briefing-mastered"
  | "asset-created"
  | "milestone-earned"
  | "life-event"
  | "business-change"
  | "executive-win"

export interface TimelineEntry {
  id: string
  /** ISO date (YYYY-MM-DD) */
  date: string
  type: TimelineEntryType
  title: string
  summary: string
  linkedMemoryIds: string[]
  badge?: string
}

/* ===========================================================================
 * Executive Insight™
 * ======================================================================== */

export type ExecutiveInsightPeriod = "weekly" | "monthly" | "quarterly"

export interface ExecutiveInsight {
  period: ExecutiveInsightPeriod
  /** ISO timestamp */
  generatedAt: string
  wins: string[]
  trends: string[]
  risks: string[]
  opportunities: string[]
  /** 2–3 sentence identity-narrative synthesis */
  narrative: string
}
