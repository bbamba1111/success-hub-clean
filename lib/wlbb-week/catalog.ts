/**
 * The Business Outcome catalog — Business Area → Outcomes → Operating
 * Behaviors, each outcome pre-mapped to the AI Executive function(s)
 * (from `components/founder-os/ai-executive-leadership-team.tsx`'s
 * canonical `FUNCTIONS`) that would support it. This mirrors the 8
 * executive functions but groups them into 7 founder-facing Business
 * Areas for the Weekly WLBB Debrief™.
 *
 * This is intentionally a small, deterministic catalog — not an AI call —
 * so outcome → executive assignment is instant and explainable.
 */

export interface CatalogOutcome {
  id: string
  text: string
  primaryExecutiveIds: string[]
  supportingExecutiveIds: string[]
}

export interface CatalogArea {
  id: string
  name: string
  /** Mirrors the executive function id(s) this Business Area draws on for its "Assigned AI Executive(s)" card. */
  executiveIds: string[]
  outcomes: CatalogOutcome[]
  operatingBehaviors: string[]
}

export const BUSINESS_AREAS: CatalogArea[] = [
  {
    id: "growth-innovation",
    name: "Growth & Innovation",
    executiveIds: ["growth", "creative"],
    outcomes: [
      { id: "signature-keynote", text: "Draft my Signature Keynote outline", primaryExecutiveIds: ["authority"], supportingExecutiveIds: ["growth", "creative"] },
      { id: "visibility-strategy", text: "Build a 90-day Visibility Strategy", primaryExecutiveIds: ["growth"], supportingExecutiveIds: ["creative"] },
      { id: "content-calendar", text: "Plan next month's content calendar", primaryExecutiveIds: ["growth"], supportingExecutiveIds: [] },
    ],
    operatingBehaviors: ["Publish one piece of content", "Post consistently", "Test one new visibility channel"],
  },
  {
    id: "sales-revenue",
    name: "Sales & Revenue",
    executiveIds: ["revenue"],
    outcomes: [
      { id: "sales-conversation-guide", text: "Build a repeatable sales conversation guide", primaryExecutiveIds: ["revenue"], supportingExecutiveIds: [] },
      { id: "pipeline-review", text: "Review and clean up my pipeline", primaryExecutiveIds: ["revenue"], supportingExecutiveIds: ["finance"] },
      { id: "follow-up-sequence", text: "Write a follow-up sequence for warm leads", primaryExecutiveIds: ["revenue"], supportingExecutiveIds: [] },
    ],
    operatingBehaviors: ["Follow up with every warm lead", "Track every conversation", "Ask for the close"],
  },
  {
    id: "operations",
    name: "Operations",
    executiveIds: ["operations"],
    outcomes: [
      { id: "client-onboarding-sop", text: "Write my Client Onboarding SOP", primaryExecutiveIds: ["operations"], supportingExecutiveIds: ["customer-success"] },
      { id: "workflow-map", text: "Map one recurring workflow end-to-end", primaryExecutiveIds: ["operations"], supportingExecutiveIds: [] },
      { id: "weekly-ops-checklist", text: "Create a weekly operations checklist", primaryExecutiveIds: ["operations"], supportingExecutiveIds: [] },
    ],
    operatingBehaviors: ["Document as I go", "Delegate one task this week", "Review one bottleneck"],
  },
  {
    id: "client-experience",
    name: "Client Experience",
    executiveIds: ["customer-success"],
    outcomes: [
      { id: "client-retention-playbook", text: "Build a Client Retention playbook", primaryExecutiveIds: ["customer-success"], supportingExecutiveIds: [] },
      { id: "check-in-cadence", text: "Set a client check-in cadence", primaryExecutiveIds: ["customer-success"], supportingExecutiveIds: [] },
      { id: "testimonial-requests", text: "Ask 3 clients for a testimonial", primaryExecutiveIds: ["customer-success"], supportingExecutiveIds: ["authority"] },
    ],
    operatingBehaviors: ["Check in with one client proactively", "Ask for feedback", "Celebrate a client win publicly"],
  },
  {
    id: "authority",
    name: "Authority",
    executiveIds: ["authority"],
    outcomes: [
      { id: "podcast-pitch-list", text: "Build a podcast pitch list", primaryExecutiveIds: ["authority"], supportingExecutiveIds: [] },
      { id: "pr-angle-ideas", text: "Draft 3 PR angle ideas", primaryExecutiveIds: ["authority"], supportingExecutiveIds: ["growth"] },
      { id: "book-chapter-map", text: "Map one book/chapter outline", primaryExecutiveIds: ["authority"], supportingExecutiveIds: ["creative"] },
    ],
    operatingBehaviors: ["Pitch one opportunity", "Share one authority-building story", "Follow up on one PR lead"],
  },
  {
    id: "finance",
    name: "Finance",
    executiveIds: ["finance"],
    outcomes: [
      { id: "pricing-profitability", text: "Review Pricing & Profitability across offers", primaryExecutiveIds: ["finance"], supportingExecutiveIds: [] },
      { id: "cash-flow-overview", text: "Build a simple cash-flow overview", primaryExecutiveIds: ["finance"], supportingExecutiveIds: [] },
      { id: "offer-profitability-map", text: "Map profitability by offer", primaryExecutiveIds: ["finance"], supportingExecutiveIds: ["revenue"] },
    ],
    operatingBehaviors: ["Review numbers weekly", "Question one recurring expense", "Reprice one underpriced offer"],
  },
  {
    id: "ai-automation",
    name: "AI & Automation",
    executiveIds: ["ai-transformation"],
    outcomes: [
      { id: "ai-workflow", text: "Automate one recurring AI Workflow", primaryExecutiveIds: ["ai-transformation"], supportingExecutiveIds: ["operations"] },
      { id: "adoption-roadmap", text: "Build a simple AI adoption roadmap", primaryExecutiveIds: ["ai-transformation"], supportingExecutiveIds: [] },
      { id: "tool-recommendations", text: "Pick one new AI tool to trial", primaryExecutiveIds: ["ai-transformation"], supportingExecutiveIds: [] },
    ],
    operatingBehaviors: ["Trial one AI tool", "Automate one repetitive task", "Protect the work only I should do"],
  },
]

export function getAreaById(areaId: string | null): CatalogArea | undefined {
  return BUSINESS_AREAS.find((a) => a.id === areaId)
}

export function getOutcomeCatalogEntry(areaId: string, outcomeId: string): CatalogOutcome | undefined {
  return getAreaById(areaId)?.outcomes.find((o) => o.id === outcomeId)
}
