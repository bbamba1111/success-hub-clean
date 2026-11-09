/**
 * Business Bottleneck Audit™ (BBA™) — Shared Type Surface
 * ---------------------------------------------------------------------------
 * BBA™ replaces the Entrepreneur Success Assessment™ (ESA) as the active
 * business diagnostic at /entrepreneur-success-assessment. Where the ESA was
 * a 5-point Likert scale retaken in full every Monday, BBA™ is:
 *
 *   - a ONE-TIME (or manually-refreshed) baseline diagnostic across 15
 *     business categories, using checkbox/select responses + conditional
 *     branches instead of a Likert scale, and
 *   - paired with a lightweight Monday weekly measurement layer (see
 *     bba-weekly-registry.ts) that does NOT repeat the full baseline.
 *
 * Architecture rules (mirrors lib/entrepreneur-success/types.ts):
 *   - NEVER hardcode business-model-specific assumptions in these types.
 *   - Adding a question later is ONE new object in bba-registry.ts — no
 *     schema redesign, no engine change. `showIf` conditional branches are
 *     expressed generically so new branches don't require new UI code.
 *   - Every id is stable — safe for routing, storage, and GPS signal hooks.
 *
 * The old ESA registry/storage/scoring files are left completely intact and
 * unrouted for historical reference — this file does not replace them.
 */

/* ===========================================================================
 * Categories — the 15 approved BBA Business Areas™
 * ======================================================================== */

export type BbaCategoryId =
  | "offer-product-service"
  | "marketing"
  | "sales"
  | "client-delivery"
  | "team-employees"
  | "founder-role-hats"
  | "systems-processes"
  | "ai-technology"
  | "communication-leadership"
  | "financial-economics"
  | "business-model-structure"
  | "persistent-problems"
  | "day-at-a-glance"
  | "week-at-a-glance"
  | "stakeholders-investors-reporting"

export interface BbaCategory {
  id: BbaCategoryId
  /** Brand name shown as the category heading, e.g. "Offer / Product / Service". */
  name: string
  /** Display order in the baseline wizard. */
  order: number
  /** Whether this category renders the shared "who currently owns this" question. */
  hasOwnershipQuestion: boolean
}

/* ===========================================================================
 * Question schema — generic enough that new questions never require a
 * registry/engine redesign, only a new BbaQuestion entry.
 * ======================================================================== */

export type BbaQuestionKind = "single-select" | "multi-select" | "text" | "number" | "time"

export interface BbaOption {
  id: string
  label: string
  /** Renders an inline text field when this option is selected (the "Other: ____" pattern). */
  allowOtherText?: boolean
}

export interface BbaQuestion {
  /** Stable id — e.g. "offer.hasOffer". Safe for storage keys and GPS signal hooks. */
  id: string
  categoryId: BbaCategoryId
  kind: BbaQuestionKind
  /** The question/statement text shown to the founder, verbatim from the approved BBA spec. */
  prompt: string
  /** Optional short helper copy shown below the prompt — used sparingly per the spec's UX guidance. */
  helperText?: string
  /** Options for single-select / multi-select kinds. */
  options?: BbaOption[]
  /**
   * Conditional branch — this question only renders when the referenced
   * question's response includes ANY of `equalsAny`. Generic so future
   * conditional questions never require new UI logic.
   */
  showIf?: { questionId: string; equalsAny: string[] }
  /** Display order within the category. */
  order: number
  status: "active" | "architecture"
}

/* ===========================================================================
 * Shared ownership option set — every category's "Who currently owns X"
 * question reuses this exact set per the approved spec.
 * ======================================================================== */

export const BBA_OWNERSHIP_OPTIONS: BbaOption[] = [
  { id: "i-own-it", label: "I own it" },
  { id: "team-member-owns-it", label: "Someone on my team owns it" },
  { id: "multiple-people-own-it", label: "Multiple people own it" },
  { id: "no-one-owns-it", label: "No one clearly owns it" },
  { id: "other", label: "Other", allowOtherText: true },
]

/* ===========================================================================
 * Baseline responses — the flat shape persisted to Supabase.
 * ======================================================================== */

export type BbaResponseValue = string | string[] | number

export interface BbaBaselineResponses {
  [questionId: string]: BbaResponseValue
}

export interface BbaBaselineRecord {
  version: number
  responses: BbaBaselineResponses
  /** questionId → free-text value for every selected "Other" option. */
  otherText: Record<string, string>
  completedAt: string
}

/* ===========================================================================
 * Monday Weekly Business Measurement™ — the lightweight layer that runs
 * AFTER a baseline exists. Deliberately NOT a full re-take of the BBA.
 * ======================================================================== */

/** One business asset the founder reports on this week, referencing the Business Asset Library™ registry by id. */
export interface BbaWeeklyAssetEntry {
  assetId: string
  /** Which of the three states apply this week — created / communicated / in-use (spec requires all three be distinguishable). */
  states: Array<"created" | "communicated" | "in-use">
}

/** One stakeholder/investor/reporting obligation the founder is tracking this week. */
export interface BbaStakeholderDeadline {
  id: string
  stakeholderName: string
  obligation: string
  dueDate?: string
  status: "upcoming" | "met" | "missed"
}

export interface BbaWeeklyCheckinRecord {
  weekKey: string
  lifeImprovement: { selectedIds: string[]; otherText?: string }
  businessImprovement: { selectedIds: string[]; otherText?: string }
  bottlenecksClearedCount: number | null
  businessAssets: BbaWeeklyAssetEntry[]
  assignmentStatus: string | null
  assignmentProblems: { selectedIds: string[]; otherText?: string }
  stakeholderDeadlines: BbaStakeholderDeadline[]
  completedAt: string | null
}
