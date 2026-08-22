/**
 * Build Record™ + Build Command Center™ — types (Phase 10)
 * ---------------------------------------------------------------------------
 * Build Blueprint™ (Phase 9F) is a PLAN: the founder picks a Build Path™ and
 * gets an adapted blueprint. Build Record™ is what tracks that plan actually
 * getting DONE — the cross-session execution state for one capability build.
 *
 * Still explicitly NOT:
 *   - A full project-management application (no normalized child tables, no
 *     assignee accounts, no comments/attachments — a JSONB milestones/tasks
 *     shape on one row, matching this codebase's `business_foundations`
 *     convention).
 *   - Autonomous execution (nothing here hires, procures, or contracts on
 *     the founder's behalf — see Business Resource Intelligence™ instead).
 *   - A second recommendation engine (Founder GPS™ remains the only place
 *     "what's next" is decided; Build Record only reports status back to it).
 *
 * One `BuildRecord` per (founder, Readiness Capability™) — created the
 * moment a founder selects a Build Path™ in the Phase 9F `BuildPathPicker`,
 * and carried through to `"installed"`.
 */

import type { BuildBlueprint, BuildPathId } from "@/lib/build-strategy/types"

/**
 * The full Build Record™ lifecycle — the phase's own 17-value vocabulary.
 * No invented alternate states, no collapsing of adjacent ones.
 */
export type BuildLifecycleStatus =
  | "recommended" // Founder GPS™ named it; no Build Path™ chosen yet.
  | "path-selected" // Build Path™ chosen, Blueprint generated; work not started.
  | "accepted" // Founder has committed to building this now.
  | "in-progress" // Active work underway.
  | "briefed" // Delegate/hire/outsource/partner has been briefed.
  | "awaiting-external" // Waiting on a team member, hire, contractor, or partner.
  | "blocked" // Cannot proceed — a dependency or blocker is unresolved.
  | "paused" // Deliberately put on hold by the founder.
  | "review" // Work delivered; founder is reviewing before acceptance.
  | "revision-requested" // Founder reviewed and asked for changes.
  | "ready-to-install" // Reviewed and approved; not yet switched on.
  | "installing" // Being switched into live operating use.
  | "installed" // Live, in use — feeds back into Founder GPS™ as "already-installed".
  | "measuring" // Installed; founder is tracking whether it's working.
  | "cancelled" // Abandoned before completion.
  | "superseded" // Replaced by a different capability or a redone build.
  | "not-started" // Default row state before any of the above applies.

/** Terminal states — a build in one of these never re-surfaces as "next". */
export const TERMINAL_BUILD_STATUSES: BuildLifecycleStatus[] = ["cancelled", "superseded"]

/** States Founder GPS™ treats as "already spoken for" — do not re-recommend. */
export const ACTIVE_BUILD_STATUSES: BuildLifecycleStatus[] = [
  "path-selected",
  "accepted",
  "in-progress",
  "briefed",
  "awaiting-external",
  "blocked",
  "paused",
  "review",
  "revision-requested",
  "ready-to-install",
  "installing",
  "measuring",
]

/**
 * Founder Attention State™ — the derived, at-a-glance signal shown on every
 * Build Record™ card. Never stored redundantly; always recomputed from
 * `status` + `blockedByCapabilityIds` + `tasks` by `deriveFounderAttention()`.
 * 🟢 on-track · 🟡 attention-needed · 🔴 blocked · 🔵 awaiting-external ·
 * ⚪ review · ✅ installed
 */
export type FounderAttentionState =
  | "on-track"
  | "attention-needed"
  | "blocked"
  | "awaiting-external"
  | "review"
  | "installed"

export type BuildTaskStatus = "not-started" | "in-progress" | "done" | "blocked"

/** One task inside a Build Record™ — intentionally minimal, no sub-app. */
export interface BuildTask {
  id: string
  title: string
  /** Plain-language owner — "founder", a team member's name/role, or the Build Path™ executor. Never invented. */
  owner: string
  status: BuildTaskStatus
  /** ISO date string, or `null` when no real due-date signal exists — never invented. */
  dueDate: string | null
  /** Task id this one depends on, or `null`. */
  dependsOnTaskId: string | null
  /** What "done" looks like for this specific task. */
  completionCriteria: string
  /** True when this task is the reason the record needs founder attention right now. */
  founderAttentionFlag: boolean
}

/** One milestone — a small ordered group of tasks with its own definition of done. */
export interface BuildMilestone {
  id: string
  title: string
  /** What completing this milestone means. */
  definitionOfDone: string
  taskIds: string[]
  status: BuildTaskStatus
  /** ISO date string, or `null` when no real target-date signal exists. */
  targetDate: string | null
}

/**
 * BUILD PATH EXECUTION — the per-path fields a `BuildRecord` carries once a
 * path is chosen. Only the block matching `buildPath` is populated; every
 * other block stays `undefined`. One record type, one shape per path — not
 * eight separate engines.
 */
export interface FounderBuildExecution {
  kind: "founder-build" | "co-build"
  /** Steps carried through from the Blueprint, with per-step completion tracked here (not re-derived). */
  completedStepNumbers: number[]
}

export interface AiBuildExecution {
  kind: "ai-build"
  /** Which of the Blueprint's `aiProducibleOutputs` have actually been generated in-app. */
  generatedOutputs: string[]
  /** Which `remainingHumanActions` the founder has confirmed as done. */
  completedHumanActions: string[]
}

export interface DelegateExecution {
  kind: "delegate"
  /** Name/role of the team member this was handed to — never invented if unknown. */
  assignedTo: string | null
  briefedAt: string | null
  handoffAcceptedAt: string | null
}

export interface HireExecution {
  kind: "hire"
  /** Whether a hiring requisition/posting has been marked as started by the founder — never automated. */
  requisitionStarted: boolean
  candidateSelected: boolean
  startDate: string | null
}

export interface OutsourceExecution {
  kind: "outsource"
  contractorEngaged: boolean
  /** Founder-entered name/agency — never sourced or fabricated. */
  contractorName: string | null
  scopeConfirmedAt: string | null
}

export interface BuyExecution {
  kind: "buy"
  purchaseDecisionMade: boolean
  /** Founder-entered product/service name — never sourced or fabricated. */
  selectedProduct: string | null
  purchasedAt: string | null
}

export interface PartnerExecution {
  kind: "partner"
  partnerEngaged: boolean
  /** Founder-entered partner/agency name — never sourced or fabricated. */
  partnerName: string | null
  agreementConfirmedAt: string | null
}

export type BuildPathExecution =
  | FounderBuildExecution
  | AiBuildExecution
  | DelegateExecution
  | HireExecution
  | OutsourceExecution
  | BuyExecution
  | PartnerExecution

/**
 * BuildRecord — the canonical execution contract for one capability build.
 * Stable id, linked back to the Readiness Capability™/Next Best Move™ it
 * fulfills, and to the Build Path™ + Build Blueprint™ (Phase 9F) chosen for
 * it. Dependencies reuse the SAME registry ids as
 * `prerequisiteCapabilityIds`/`enablesCapabilityIds` — no new graph.
 */
export interface BuildRecord {
  id: string
  /** The `RelevantReadinessCapability.id` / `GpsRecommendation.readinessCapabilityId` this fulfills. */
  readinessCapabilityId: string
  title: string
  summary: string

  buildPath: BuildPathId
  blueprint: BuildBlueprint
  execution: BuildPathExecution

  status: BuildLifecycleStatus
  milestones: BuildMilestone[]
  tasks: BuildTask[]

  /** Same-stage prerequisites that must be `"installed"` first (registry ids, not re-derived). */
  prerequisiteCapabilityIds: string[]
  /** Capability ids currently blocking progress (a subset of `prerequisiteCapabilityIds`, or an explicit blocker). */
  blockedByCapabilityIds: string[]
  /** Plain-language blocker note when `status === "blocked"` and the reason isn't a capability dependency. */
  blockerNote: string | null

  ownerSummary: string
  /** Founder-entered free text describing who is actually doing the work day to day. */
  executor: string | null

  createdAt: string
  startedAt: string | null
  completedAt: string | null
  installedAt: string | null
  updatedAt: string
}

/** What `deriveBuildRecord()` needs beyond the Blueprint itself. */
export interface BuildRecordContext {
  prerequisiteCapabilityIds?: string[]
}

/** The list-view filters Build Command Center™ supports — no invented ones. */
export type BuildCommandCenterFilter = "all" | "needs-attention" | "in-progress" | "awaiting-external" | "installed"
