/**
 * CEO Workday™ — Category Taxonomy
 * ---------------------------------------------------------------------------
 * The 12 top-level categories of CEO work. These are work MODES available
 * inside ONE CEO Workday™ — not 12 separate assessments and not 12 separate
 * full builders. Only BUILD has a real backing workflow this phase (see
 * `workflow-registry.ts`); the other 11 exist in the architecture now so
 * they can plug in a real workflow later without a redesign.
 *
 * Sub-actions (Follow Up, Review, Plan, Improve, Train, Clear, Thought
 * Leadership, Get the Word Out) are intentionally NOT categories — they are
 * documented here only as a comment so nobody re-adds them as top-level
 * entries by mistake:
 *
 *   - Thought Leadership  → lives under COMMUNICATE
 *   - Get the Word Out    → lives under MARKET
 *   - Follow Up           → sub-action of SELL / CONNECT / DELIVER
 *   - Review               → supporting activity, leads into DECIDE/SELL/DELEGATE
 *   - Plan                 → sub-action of DESIGN
 *   - Improve               → sub-action of BUILD / SOLVE / SYSTEMIZE / DESIGN
 *   - Train                 → supporting capability of DELEGATE / DESIGN / COMMUNICATE
 *   - Clear                 → sub-action of SOLVE / DELIVER, never its own category
 */

export type CeoWorkCategoryId =
  | "BUILD"
  | "DESIGN"
  | "DECIDE"
  | "SOLVE"
  | "SYSTEMIZE"
  | "DELEGATE"
  | "AUGMENT"
  | "SELL"
  | "MARKET"
  | "CONNECT"
  | "DELIVER"
  | "COMMUNICATE"

export interface CeoWorkCategory {
  id: CeoWorkCategoryId
  /** Short label for the dropdown row, e.g. "BUILD". */
  label: string
  /** One-line definition, from the CEO Workday™ spec. */
  definition: string
  /** The tangible outcome this category is meant to produce. */
  tangibleOutcome: string
}

export const CEO_WORK_CATEGORIES: CeoWorkCategory[] = [
  {
    id: "BUILD",
    label: "Build",
    definition: "Create a Business Asset™ or other durable business capability.",
    tangibleOutcome: "Business Asset™",
  },
  {
    id: "DESIGN",
    label: "Design",
    definition: "Create/adapt an operating rule, structure, plan, or business design.",
    tangibleOutcome: "Business Operating Rule™ / Design Artifact",
  },
  {
    id: "DECIDE",
    label: "Decide",
    definition: "Make a decision that is blocking or materially affecting the business.",
    tangibleOutcome: "Decision Record / Decision made",
  },
  {
    id: "SOLVE",
    label: "Solve",
    definition: "Resolve a bottleneck, recurring fire, constraint, or business problem.",
    tangibleOutcome: "Resolved problem / corrective change",
  },
  {
    id: "SYSTEMIZE",
    label: "Systemize",
    definition: "Turn recurring work into a repeatable process, SOP, workflow, or playbook.",
    tangibleOutcome: "SOP / Playbook / Workflow",
  },
  {
    id: "DELEGATE",
    label: "Delegate",
    definition: "Transfer responsibility/ownership to another person or role.",
    tangibleOutcome: "Ownership transfer / Delegation Artifact",
  },
  {
    id: "AUGMENT",
    label: "Augment",
    definition: "Identify work that can be improved or supported with AI.",
    tangibleOutcome: "AI Augmentation Specification",
  },
  {
    id: "SELL",
    label: "Sell",
    definition: "Advance a revenue opportunity, sales conversation, proposal, or ask.",
    tangibleOutcome: "Sales / Revenue Outcome",
  },
  {
    id: "MARKET",
    label: "Market",
    definition: "Increase appropriate visibility, awareness, demand, or promotion.",
    tangibleOutcome: "Marketing / Visibility Asset",
  },
  {
    id: "CONNECT",
    label: "Connect",
    definition: "Strengthen a meaningful client, team, partner, referral, or stakeholder relationship.",
    tangibleOutcome: "Relationship / Client / Partner outcome",
  },
  {
    id: "DELIVER",
    label: "Deliver",
    definition: "Complete a client/service/project outcome.",
    tangibleOutcome: "Client / Service Outcome",
  },
  {
    id: "COMMUNICATE",
    label: "Communicate",
    definition: "Explain, persuade, propose, announce, teach, publish, or communicate an important idea.",
    tangibleOutcome: "Communication / Thought Leadership Asset",
  },
]

export function getCeoWorkCategory(id: CeoWorkCategoryId): CeoWorkCategory {
  const category = CEO_WORK_CATEGORIES.find((c) => c.id === id)
  if (!category) throw new Error(`Unknown CEO Work category: ${id}`)
  return category
}
