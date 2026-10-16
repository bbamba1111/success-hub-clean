/**
 * Business Operating Fingerprint™ — types (Phase 9A)
 * ---------------------------------------------------------------------------
 * The Business Operating Fingerprint™ is a DERIVED, read-only snapshot of a
 * founder's current operating reality. It is NOT a new data source and NOT
 * an assessment — it is assembled purely from data that already exists:
 *
 *   - Business Context Profile™ (`lib/business-context/types.ts`)        —
 *     current business identity, model, team, revenue, goals/challenges.
 *   - Business Stage™ (`lib/business-stage/business-stage.ts`)           —
 *     the canonical stage, already reconciled by `deriveBusinessStage()`.
 *   - Founder Destination™ (`lib/founder-destination/types.ts`)          —
 *     where the founder wants the business, their role, and their life to
 *     end up.
 *   - Business Model Profile™ (`lib/business-model-classification/types.ts`,
 *     Phase 9B) — the classified archetype and operating characteristics.
 *
 * Fields are grouped into five sections mirroring those four sources:
 * BUSINESS, OPERATING MODEL, GROWTH, DESTINATION, and FUTURE WORKPLACE.
 *
 * Every field is `T | "unknown"` — "unknown" means the underlying signal was
 * never captured (progressive disclosure, no guessing). This is distinct
 * from a founder-selected `"undecided"` value, which is a real, informative
 * answer and is passed through unchanged.
 */

import type {
  CapitalStrategyOption,
  ChallengeOption,
  ExitVisionOption,
  FounderRoleOption,
  GoalOption,
  GrowthVisionOption,
  RevenueStagOption,
  TeamSizeOption,
} from "@/lib/business-context/types"
import type { BusinessStage } from "@/lib/business-stage/business-stage"
import type { BusinessModelId } from "@/lib/entrepreneur-success/types"
import type {
  AcquisitionModelId,
  CustomerModelId,
  DeliveryModelId,
  FounderDependencyLevel,
  RevenueModelId,
  ScaleMechanismId,
} from "@/lib/business-model-classification/types"
import type {
  DesiredFounderIndependenceOption,
  DesiredFounderInvolvementOption,
  DesiredFounderRoleOption,
  DesiredAiHumanRelationshipOption,
  DesiredHumanSustainabilityStandardOption,
  DesiredTeamSizeOption,
  DesiredWorkplaceTypeOption,
  RevenueAmbitionOption,
} from "@/lib/founder-destination/types"

export interface BusinessOperatingFingerprint {
  /** ISO timestamp — when this fingerprint was computed, not stored. */
  generatedAt: string

  // ─── BUSINESS (Business Context Profile™ + Business Stage™) ──────────────
  /** Canonical stage, already reconciled — always known, never "unknown". */
  businessStage: BusinessStage
  businessName: string | "unknown"
  industry: string | "unknown"
  founderRole: FounderRoleOption | "unknown"
  teamSize: TeamSizeOption | "unknown"
  revenueStage: RevenueStagOption | "unknown"

  // ─── OPERATING MODEL (Business Model Profile™, Phase 9B) ─────────────────
  primaryArchetype: BusinessModelId | "unknown"
  secondaryArchetypes: BusinessModelId[]
  customerModel: CustomerModelId[] | "unknown"
  revenueModel: RevenueModelId[] | "unknown"
  deliveryModel: DeliveryModelId[] | "unknown"
  acquisitionModel: AcquisitionModelId[] | "unknown"
  scaleMechanism: ScaleMechanismId[] | "unknown"
  founderDependency: FounderDependencyLevel | "unknown"

  // ─── GROWTH (Business Context Profile™ — Growth & Capital™) ──────────────
  biggestGoals: GoalOption[] | "unknown"
  biggestChallenges: ChallengeOption[] | "unknown"
  capitalStrategy: CapitalStrategyOption[] | "unknown"
  growthVision: GrowthVisionOption | "unknown"
  exitVision: ExitVisionOption | "unknown"

  // ─── DESTINATION (Founder Destination™ — Business & Founder Destination™) ─
  desiredFounderRole: DesiredFounderRoleOption | "unknown"
  desiredFounderIndependence: DesiredFounderIndependenceOption | "unknown"
  desiredFounderInvolvement: DesiredFounderInvolvementOption | "unknown"
  revenueAmbition: RevenueAmbitionOption | "unknown"
  desiredTeamSize: DesiredTeamSizeOption | "unknown"
  /**
   * True when the founder has signaled business ambition beyond a bare
   * minimum. Reused as-is from `lib/excellence-intelligence/readiness.ts`'s
   * `hasBusinessAmbitionSignal()` — not re-derived here.
   */
  hasBusinessAmbitionSignal: boolean

  // ─── FUTURE WORKPLACE (Founder Destination™ — Future Workplace Destination™) ─
  desiredWorkplaceType: DesiredWorkplaceTypeOption | "unknown"
  desiredAiHumanRelationship: DesiredAiHumanRelationshipOption | "unknown"
  desiredHumanSustainabilityStandard: DesiredHumanSustainabilityStandardOption | "unknown"
  /**
   * True when the founder has signaled Future Workplace™ intent. Reused as-is
   * from `lib/excellence-intelligence/readiness.ts`'s
   * `hasFutureWorkplaceSignal()` — not re-derived here.
   */
  hasFutureWorkplaceSignal: boolean
}
