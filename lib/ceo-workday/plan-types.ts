/**
 * CEO Workday™ Plan — shared types
 * ---------------------------------------------------------------------------
 * The designed plan (Decide & Design) → its work items → hourly 5-Minute
 * Check-In™ evidence. Source of truth lives in Supabase
 * (`ceo_workday_plans`, `ceo_workday_plan_items`, `ceo_workday_checkins`);
 * the live FounderGpsWorkspace is the execution layer for the SAME plan.
 *
 * Business Asset™ vs Business Building Assignment™:
 *   - an asset is the durable thing the business owns (Asset Library)
 *   - a plan item is the temporary work performed on / in relation to it
 *   A plan item only ever REFERENCES an asset (`relatedAssetId`).
 */

import type { CeoWorkCategoryId } from "./categories"

// ── Vocabulary ──────────────────────────────────────────────────────────────

/** Treatment hierarchy — what the business is actually ready for. Ordered. */
export type CeoTreatment =
  | "build-change"
  | "implement-operate"
  | "practice-develop"
  | "delegate-transfer"
  | "systemize-augment-automate-ai"

export const CEO_TREATMENT_LABEL: Record<CeoTreatment, string> = {
  "build-change": "BUILD / CHANGE",
  "implement-operate": "IMPLEMENT / OPERATE",
  "practice-develop": "PRACTICE / DEVELOP",
  "delegate-transfer": "DELEGATE / TRANSFER",
  "systemize-augment-automate-ai": "SYSTEMIZE / AUGMENT / AUTOMATE / AI",
}

/** The CEO business function through which the intervention happens. */
export type CeoBusinessFunction =
  | "client-attraction"
  | "sales-conversion"
  | "delivery"
  | "operations"
  | "operations-design"
  | "trust-experiences"
  | "own-work"
  // Legacy values kept so previously saved plan items still render.
  | "build"
  | "decide"
  | "own"
  | "delegate"
  | "systemize"
  | "augment-automate-ai"
  | "connect"
  | "communicate"
  | "sell"
  | "market"
  | "deliver"
  | "solve"

export const CEO_FUNCTION_LABEL: Record<CeoBusinessFunction, string> = {
  "client-attraction": "Client Attraction",
  "sales-conversion": "Sales & Conversion",
  delivery: "Service or Product Delivery",
  operations: "Business Operations",
  "operations-design": "Business Operations Design & Redesign",
  "trust-experiences": "Workshops & Webinars",
  "own-work": "Own Work",
  build: "Build",
  decide: "Decide",
  own: "OWN",
  delegate: "DELEGATE",
  systemize: "SYSTEMIZE",
  "augment-automate-ai": "AUGMENT / AUTOMATE AI",
  connect: "CONNECT",
  communicate: "COMMUNICATE",
  sell: "SELL",
  market: "MARKET",
  deliver: "DELIVER",
  solve: "SOLVE",
}

/** Official name of the sixth function; the UI uses the short label above. */
export const TRUST_EXPERIENCES_OFFICIAL_NAME = "Workshops, Webinars & Trust-Building Experiences"

/** Official name of the seventh function; the UI uses the short label "Own Work". */
export const OWN_WORK_OFFICIAL_NAME = "Other — Bring & Create Your Own Work"

/** The Seven Business Functions — the only top-level work categories in the planner. */
export const BUSINESS_FUNCTIONS: CeoBusinessFunction[] = [
  "client-attraction",
  "sales-conversion",
  "delivery",
  "operations",
  "operations-design",
  "trust-experiences",
  "own-work",
]

/** @deprecated Kept for existing imports; now includes all seven functions. */
export const FIVE_BUSINESS_FUNCTIONS = BUSINESS_FUNCTIONS

/** How an assignment's outcome is known. Only `system-verified` may say "Verified". */
export type CeoCompletionBasis = "internal" | "founder-reported" | "system-verified"

export function completionBasisLabel(basis: CeoCompletionBasis | null | undefined, detail?: string | null): string | null {
  if (basis === "internal") return "Ready"
  if (basis === "founder-reported") return detail ? `You confirmed: ${detail}` : "You confirmed"
  if (basis === "system-verified") return detail ? `Verified: ${detail}` : "Verified"
  return null
}

/** Functions that contextually activate Business Articulation™. */
export const ARTICULATION_FUNCTIONS: ReadonlySet<CeoBusinessFunction> = new Set<CeoBusinessFunction>([
  "client-attraction",
  "sales-conversion",
  "communicate",
  "sell",
  "connect",
])

export type CeoPlanItemRole = "primary" | "supporting" | "validate" | "continue" | "founder-added"

export type CeoFounderDecision = "keep" | "edit" | "replace" | "save-for-later" | "delegate" | "remove" | "added"

export type CeoPlanItemStatus =
  | "planned"
  | "in-progress"
  | "completed"
  | "saved-for-later"
  | "delegated"
  | "eliminated"
  | "blocked"
  | "other"

export type CeoNextAction =
  | "continue-next-hour"
  | "move-segment"
  | "save-for-later"
  | "delegate"
  | "eliminate"
  | "need-help"
  | "other"

/** The only three end-of-hour outcomes a founder chooses between. */
export type CeoHourOutcome = "complete" | "continue-next-hour" | "save-for-later"

export const CEO_NEXT_ACTION_LABEL: Record<CeoNextAction, string> = {
  "continue-next-hour": "Continue next hour",
  "move-segment": "Move to another segment",
  "save-for-later": "Save for later",
  delegate: "Delegate it",
  eliminate: "Eliminate it",
  "need-help": "I need help",
  other: "Other",
}

export const CEO_ITEM_STATUS_LABEL: Record<CeoPlanItemStatus, string> = {
  planned: "Planned",
  "in-progress": "Still in progress",
  completed: "Completed",
  "saved-for-later": "Saved for later",
  delegated: "Delegated",
  eliminated: "Eliminated",
  blocked: "Blocked",
  other: "Other",
}

export type CeoPlanStatus = "designed" | "entered" | "adjusted" | "declared" | "in-progress" | "closed"

// ── Work item ───────────────────────────────────────────────────────────────

/** What GPS originally proposed — frozen so founder changes are measurable. */
export interface CeoGpsOriginal {
  title: string
  purpose: string
  expectedEvidence: string
  treatment: CeoTreatment
  businessFunction: CeoBusinessFunction
  role: CeoPlanItemRole
  estimatedMinutes: number
  relatedAssetId?: string | null
}

export interface CeoPlanItem {
  id: string
  planId?: string
  position: number
  title: string
  purpose: string
  expectedEvidence: string
  treatment: CeoTreatment
  businessFunction: CeoBusinessFunction
  role: CeoPlanItemRole
  estimatedMinutes: number
  relatedAssetId?: string | null
  relatedAssetTitle?: string | null
  relatedAssignmentRef?: string | null
  ceoWorkCategory?: CeoWorkCategoryId | null
  gpsOriginal?: CeoGpsOriginal | null
  founderDecision: CeoFounderDecision
  status: CeoPlanItemStatus
  nextAction?: CeoNextAction | null
  /** id of the mirrored Today's Work™ queue item (localStorage). */
  localWorkItemId?: string | null
  /** The persistent BO$$ job this item is carried by (Phase 3 job system). */
  jobId?: string | null
  /** Who delegated work is handed to. */
  delegateTo?: string | null
  /** Handoff instructions for delegated work, or a note to future you for saved work. */
  handoffNote?: string | null
  /** Stable assignment id (e.g. `authority.speaking.pitch`) — prevents re-proposing finished work. */
  assignmentKey?: string | null
  strategicObjective?: string | null
  readiness?: "ready" | "ready_after_prep" | "blocked" | "info_needed" | null
  assetRequirement?: "none" | "suggested" | "required" | null
  assetReason?: string | null
  /** Design-time only: assignment keys that must finish first (persisted as job dependencies). */
  prerequisiteKeys?: string[]
  /** Design-time only: what is still unknown/missing for this assignment. */
  gaps?: string[]
  aiHint?: string | null
  /** Workshops & Webinars: the dated experience occurrence this work serves. */
  experienceOccurrenceId?: string | null
  completionBasis?: CeoCompletionBasis | null
}

// ── Plan ─���──────────────────────────────────────────────────────────────────

export interface CeoWorkdayPlan {
  id: string
  planDate: string // YYYY-MM-DD
  weekKey: string
  businessAreaId?: string | null
  bottleneckEgaEntryIds: string[]
  primaryAssignmentRef?: string | null
  primaryAssetId?: string | null
  constraintSummary?: string | null
  interventionSummary?: string | null
  identityStatement?: string | null
  declaration?: string | null
  plannedMinutes: number
  status: CeoPlanStatus
  enteredAt?: string | null
  closedAt?: string | null
  items: CeoPlanItem[]
}

// ── Check-in evidence ───────────────────────────────────────────────────────

export interface CeoCheckinRecord {
  id?: string
  planId: string
  itemId?: string | null
  hourBlock: 1 | 2 | 3 | 4
  scheduledAt: string
  openedAt?: string | null
  savedAt?: string | null
  workingOnDeclaration?: string | null
  actualStatus?: CeoPlanItemStatus | null
  actualMinutes?: number | null
  blocker?: string | null
  reflection?: string | null
  nextAction?: CeoNextAction | null
}

/** Compact, intelligence-facing summary derived from plan + check-ins. */
export interface CeoWorkdayEvidenceSummary {
  planDate: string
  planStatus: CeoPlanStatus
  businessAreaId?: string | null
  plannedMinutes: number
  itemCount: number
  completedCount: number
  inProgressCount: number
  savedForLaterCount: number
  delegatedCount: number
  eliminatedCount: number
  blockedCount: number
  /** Founder changed GPS proposals (edit/replace/remove/save-for-later/delegate). */
  founderChangedCount: number
  /** Items the founder decided to continue later (for Cherry Blossom). */
  carryForward: Array<{ itemId: string; title: string; nextAction: CeoNextAction }>
  hoursCheckedIn: number
}
