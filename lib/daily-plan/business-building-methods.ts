/**
 * Starter Business-Building Methods™ — a small, explicitly-labeled STARTER
 * list, not the full 6-category Best-Practice Mechanism Library from the
 * original spec. Per user direction: ~10-12 items across
 * Demand/Sales/Operations/Customer, offered as an optional tag a founder
 * can attach to today's Design step. Metadata only — no matching or
 * recommendation logic is built around this list.
 */

export type BusinessBuildingMethodCategory = "demand" | "sales" | "operations" | "customer"

export interface BusinessBuildingMethod {
  id: string
  category: BusinessBuildingMethodCategory
  label: string
}

/** STARTER list — intentionally small. Not a complete library. */
export const STARTER_BUSINESS_BUILDING_METHODS: BusinessBuildingMethod[] = [
  { id: "content-engine", category: "demand", label: "Content Engine" },
  { id: "lead-magnet", category: "demand", label: "Lead Magnet" },
  { id: "referral-loop", category: "demand", label: "Referral Loop" },
  { id: "sales-page", category: "sales", label: "Sales Page" },
  { id: "pricing-offer", category: "sales", label: "Pricing & Offer" },
  { id: "sales-script", category: "sales", label: "Sales Call Script" },
  { id: "sop", category: "operations", label: "Standard Operating Procedure" },
  { id: "automation", category: "operations", label: "Automation" },
  { id: "delegation-plan", category: "operations", label: "Delegation Plan" },
  { id: "onboarding-flow", category: "customer", label: "Onboarding Flow" },
  { id: "retention-touchpoint", category: "customer", label: "Retention Touchpoint" },
  { id: "feedback-loop", category: "customer", label: "Feedback Loop" },
]
