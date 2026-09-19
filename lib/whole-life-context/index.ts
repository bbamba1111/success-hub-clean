/**
 * Whole-Life Context™ — Public API (Phase 6.1)
 * ---------------------------------------------------------------------------
 * Single import point for all Whole-Life Context™ types and storage.
 *
 * Usage:
 *   import type { RelationshipPerson, LifeEvent } from "@/lib/whole-life-context"
 *   import { getRelationships, upsertLifeEvent } from "@/lib/whole-life-context"
 */

// Types
export type {
  FounderProfile,
  FounderGenderIdentity,
  RelationshipPerson,
  RelationshipType,
  LoveLanguage,
  ImportantDate,
  LifeEvent,
  LifeEventType,
  LifeEventSignificance,
  LifeCommitment,
  LifeCommitmentCategory,
  CommitmentFrequency,
  DayOfWeek,
  PersonalGoal,
  PersonalGoalDomain,
  PersonalGoalStatus,
  GoalMilestone,
  WholeLifeContext,
  ProactiveSignal,
  ProactiveSignalType,
  ProactiveSignalUrgency,
} from "./types"

// Constants
export {
  EMPTY_WHOLE_LIFE_CONTEXT,
  RELATIONSHIP_TYPE_LABELS,
  LOVE_LANGUAGE_LABELS,
  LIFE_COMMITMENT_CATEGORY_LABELS,
  PERSONAL_GOAL_DOMAIN_LABELS,
  LIFE_EVENT_TYPE_LABELS,
  LIFE_EVENT_SIGNIFICANCE_LABELS,
  DEFAULT_AWARENESS_WINDOWS,
} from "./types"

// Phase 9.0 — Bridge: converts LifeEvent[] to the UpcomingLifeEvent[] shape
// that cherry-blossom-guidance.ts accepts for proactive awareness signals.
export { deriveUpcomingCherryBlossomEvents } from "./bridge"

// Storage
export {
  getFounderProfile,
  saveFounderProfile,
  clearFounderProfile,
  getRelationships,
  saveRelationships,
  upsertRelationship,
  removeRelationship,
  getLifeEvents,
  saveLifeEvents,
  upsertLifeEvent,
  removeLifeEvent,
  getUpcomingLifeEvents,
  getLifeCommitments,
  saveLifeCommitments,
  upsertLifeCommitment,
  removeLifeCommitment,
  getActiveLifeCommitments,
  getNonNegotiableCommitments,
  getPersonalGoals,
  savePersonalGoals,
  upsertPersonalGoal,
  removePersonalGoal,
  getActivePersonalGoals,
  getProactiveSignals,
  saveProactiveSignals,
  getWholeLifeContext,
  clearWholeLifeContext,
} from "./storage"
