/**
 * CEO Workday™ — Category Taxonomy
 * ---------------------------------------------------------------------------
 * Current: the Seven Business Functions (CEO_WORK_CATEGORIES). The notes
 * below describe the legacy 12 work modes (LEGACY_CEO_WORK_CATEGORIES).
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

import type { LegacyJobKey, StandardJobKey } from "@/lib/business-functions"

/**
 * The Seven Business Functions are the ONLY top-level categories shown in the
 * CEO Workday™ planner. The older 12 work modes remain in the union only so
 * work items saved before this change still render.
 */
export type BusinessFunctionCategoryId =
  | "CLIENT_ATTRACTION"
  | "SALES_CONVERSION"
  | "DELIVERY"
  | "OPERATIONS"
  | "OPERATIONS_DESIGN"
  | "TRUST_EXPERIENCES"
  | "THOUGHT_LEADERSHIP"
  // Earlier seventh function; kept so saved items still display.
  | "OWN_WORK"

export type CeoWorkCategoryId =
  | BusinessFunctionCategoryId
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
  /** Plain-language examples of work in this function. */
  examples?: string[]
  /** Matching BO$$ business function id, used to open the Business Work Queue filtered. */
  bossFunction?: StandardJobKey | LegacyJobKey
}

export const CEO_WORK_CATEGORIES: CeoWorkCategory[] = [
  {
    id: "CLIENT_ATTRACTION",
    label: "Client Attraction",
    definition: "Help the right people find the business and connect with it.",
    tangibleOutcome: "Visibility, interest, or a new connection",
    examples: ["Visibility & content", "Marketing", "Referrals & partnerships", "Networking", "Speaking, publicity & media"],
    bossFunction: "attraction",
  },
  {
    id: "SALES_CONVERSION",
    label: "Sales & Conversion",
    definition: "Help interested people decide to buy and become paying clients or customers.",
    tangibleOutcome: "A sale, enrollment, or next step toward one",
    examples: ["Sales conversations", "Qualification", "Follow-up", "Proposals", "Enrollment & payment"],
    bossFunction: "sales",
  },
  {
    id: "DELIVERY",
    label: "Service or Product Delivery",
    definition: "Give clients and customers what the business promised.",
    tangibleOutcome: "A delivered client or customer outcome",
    examples: ["Onboarding", "Client work", "Delivery steps", "Customer experience", "Fulfillment"],
    bossFunction: "delivery",
  },
  {
    id: "OPERATIONS",
    label: "Business Operations",
    definition: "Run the business day to day.",
    tangibleOutcome: "Work that keeps the business running",
    examples: ["Money tasks", "Records", "Scheduling", "Systems", "Administration", "Team coordination"],
    bossFunction: "operations",
  },
  {
    id: "OPERATIONS_DESIGN",
    label: "Business Operations Design & Redesign",
    definition:
      "Examine how the business operates and decide what to keep, repair, replace, redesign, document, automate, delegate, or eliminate.",
    tangibleOutcome: "A better way the business operates",
    examples: ["Keep or repair", "Replace or redesign", "Document", "Automate", "Delegate", "Eliminate"],
    bossFunction: "design",
  },
  {
    id: "TRUST_EXPERIENCES",
    label: "Programs, Events & Experiences",
    definition:
      "Design, host, follow up on and improve programs, events and live experiences that build trust and invite people into the next step.",
    tangibleOutcome: "A held experience with follow-up and one chosen improvement",
    examples: ["Monday Redesigned™", "Reality Check™ (live)", "Weekly workshop / webinar", "Masterclass", "Retreat or program"],
    bossFunction: "experiences",
  },
  {
    id: "THOUGHT_LEADERSHIP",
    label: "Thought Leadership & Intellectual Property",
    definition:
      "Share your point of view and build the ideas, methods and content you own — articles, talks, books, podcasts, frameworks and courses.",
    tangibleOutcome: "A published idea or a piece of intellectual property that moves forward",
    examples: ["Articles & posts", "Podcasts & interviews", "Speaking", "Books", "Frameworks & methods", "Courses"],
    bossFunction: "thought_leadership",
  },
]

/** Pre–Five Functions work modes. Kept only so previously saved items still display. */
export const LEGACY_CEO_WORK_CATEGORIES: CeoWorkCategory[] = [
  {
    id: "OWN_WORK",
    label: "Own Work",
    definition:
      "Other — Bring & Create Your Own Work: projects and ideas you bring or invent yourself, done your way.",
    tangibleOutcome: "A project that moves forward by one clear step",
    examples: ["A course or program", "A book", "A launch", "A cleanup", "Any idea of your own"],
    bossFunction: "own_work",
  },
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
  const category =
    CEO_WORK_CATEGORIES.find((c) => c.id === id) ?? LEGACY_CEO_WORK_CATEGORIES.find((c) => c.id === id)
  return category ?? { id, label: id, definition: "", tangibleOutcome: "" }
}
