/**
 * Executive Capability Intelligence™ — types (Phase 10.4)
 * ---------------------------------------------------------------------------
 * Defines the type contracts for the Executive Briefing system: topics,
 * briefing sections, resolved briefings, capability dimensions, and outcome
 * tracking. Pure types — no runtime logic.
 */

import type { CommunicationLevel } from "@/lib/founder-learning/types"

/* ===========================================================================
 * Briefing Topic IDs
 * ======================================================================== */

export type ExecutiveBriefingTopicId =
  | "business-credit"
  | "delegation"
  | "hiring"
  | "capital-strategy"
  | "pricing"
  | "recurring-revenue"
  | "customer-lifetime-value"
  | "operating-rules"
  | "sops"
  | "ai-delegation"
  | "cash-flow"
  | "profit-margins"
  | "business-banking"
  | "exit-planning"
  | "wealth-building"

/* ===========================================================================
 * Briefing Content
 * ======================================================================== */

export interface ExecutiveBriefingSection {
  /** Plain language definition. */
  whatIsIt: string
  /** Why this concept matters for business success. */
  whyItMatters: string
  /** Why the timing of learning this is important right now (set at runtime). */
  whyNow: string
  /** 3-5 mistakes founders commonly make in this area. */
  commonMistakes: string[]
  /** One-paragraph executive-level framing from the executive who owns this domain. */
  executivePerspective: string
  /** The single most important thing to understand and act on. */
  fiveMinuteTakeaway: string
  /** Titles of related Academy content to explore later. */
  exploreFurther: string[]
}

/** One topic definition contains one section per CommunicationLevel. */
export type ExecutiveBriefing = Record<CommunicationLevel, ExecutiveBriefingSection>

/** The fully resolved briefing ready to render — topic + correct level already selected. */
export interface ResolvedBriefing {
  topicId: ExecutiveBriefingTopicId
  topicTitle: string
  /** Executive domain owner (e.g. "Finance Executive™"). */
  executiveOwner: string
  /** Single sentence of context explaining why this briefing surfaced. */
  triggerContext: string
  /** The pre-selected section for the founder's communication level. */
  section: ExecutiveBriefingSection
  communicationLevel: CommunicationLevel
}

/* ===========================================================================
 * Capability Dimensions
 * ======================================================================== */

export type CapabilityDimensionId =
  | "strategic-thinking"
  | "financial-capability"
  | "marketing-capability"
  | "operational-excellence"
  | "leadership"
  | "decision-making"
  | "ai-leverage"
  | "customer-experience"
  | "business-asset-thinking"

export interface CapabilityDimension {
  id: CapabilityDimensionId
  label: string
  /** e.g. "strategy", "finance", "marketing" — maps to ExecutiveTeamCard.executiveId */
  executiveOwner: string
  /** Which briefing topics contribute points to this dimension. */
  briefingTopics: ExecutiveBriefingTopicId[]
}

/* ===========================================================================
 * Capability Profile (stored in localStorage)
 * ======================================================================== */

export interface CapabilityProfile {
  /** 0–100 score per dimension. */
  dimensions: Record<CapabilityDimensionId, number>
  topicsMastered: ExecutiveBriefingTopicId[]
  topicsInProgress: ExecutiveBriefingTopicId[]
  topicsDeferred: ExecutiveBriefingTopicId[]
  topicsSkipped: ExecutiveBriefingTopicId[]
  /** "<topicId>:<level>" — one entry per completed briefing. */
  completedBriefingIds: string[]
  lastUpdated: string
}

export type BriefingOutcome = "completed" | "deferred" | "skipped"

/* ===========================================================================
 * Topic Metadata (static per topic — not level-specific)
 * ======================================================================== */

export interface ExecutiveBriefingTopicMeta {
  id: ExecutiveBriefingTopicId
  title: string
  /** Short phrase (3-7 words) describing the capability unlock. */
  capabilityUnlock: string
  executiveOwner: string
  capabilityDimension: CapabilityDimensionId
  /** How many capability points this topic awards when completed. */
  pointValue: number
}
