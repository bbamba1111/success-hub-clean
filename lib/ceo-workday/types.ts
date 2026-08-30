/**
 * CEO Workday™ — Generic Work Item Model
 * ---------------------------------------------------------------------------
 * One reusable shape for anything a founder is working on inside the
 * protected 4-Hour Focused CEO Workday™, across all 12 categories. This is
 * the plug-in contract for GPS-recommended, Barbara-assigned, and
 * founder-selected work to eventually share one queue and one authority
 * model:
 *
 *   GPS     → RECOMMENDS
 *   Barbara → CONTROLS
 *   Founder → EXECUTES
 *
 * This phase only implements founder-selected and GPS-recommended items.
 * Barbara-assigned items and the full permission console are NOT built now
 * — the `source` field and `FounderSelfSelectionState` exist so that later
 * work slots into this same model without a data migration.
 */

import type { CeoWorkCategoryId } from "./categories"
import type { WorkflowAvailability } from "./workflow-registry"

export type CeoWorkItemSource = "gps" | "barbara" | "founder"

export type CeoWorkItemStatus = "not-started" | "in-progress" | "completed" | "blocked" | "deferred"

/**
 * Placeholder for the future permission model. Hardcoded to "enabled" this
 * phase — no permissions UI exists yet, per the CEO Workday™ phased spec.
 */
export type FounderSelfSelectionState = "enabled" | "disabled"
export const FOUNDER_SELF_SELECTION_STATE: FounderSelfSelectionState = "enabled"

export interface CeoWorkItem {
  id: string
  founderId?: string
  /** ISO date (YYYY-MM-DD) of the CEO Workday this item belongs to. */
  workdayDate: string
  category: CeoWorkCategoryId
  /** Human-readable label for the selected option, e.g. "Client Onboarding Asset™". */
  selectedOptionLabel: string
  workflowId: string
  availability: WorkflowAvailability
  source: CeoWorkItemSource
  /** Optional finer-grained source description, e.g. "Founder GPS™ Next Best Move". */
  sourceDetail?: string
  priority?: "high" | "medium" | "low"
  status: CeoWorkItemStatus
  relatedGapId?: string
  relatedSolutionId?: string
  /** Business Asset™ id, when this item's workflow is the Business Asset Builder. */
  relatedAssetId?: string
  timeHorizon?: string
  businessStage?: string
  ceoWorkdayAction?: string
  tangibleOutcome?: string
  /** Reference to the produced outcome once the item is completed (asset id, rule id, etc). */
  outcomeRef?: string
  createdAt: string
  updatedAt: string
}

export type NewCeoWorkItem = Omit<CeoWorkItem, "id" | "createdAt" | "updatedAt" | "status" | "workdayDate"> & {
  status?: CeoWorkItemStatus
  workdayDate?: string
}
