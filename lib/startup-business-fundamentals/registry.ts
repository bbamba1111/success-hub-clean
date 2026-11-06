/**
 * Startup Business Fundamentals™ — Universal Founder Library
 * ---------------------------------------------------------------------------
 * Canonical, data-only definition of the eight business fundamentals.
 *
 * UNIVERSAL ACCESS: every founder can use these fundamentals regardless of
 * business stage, tenure, revenue, team size, or startup/pivoting pathway.
 *
 * This registry reuses the existing Seven Business Functions™ job keys and
 * Executive registry IDs. It does not create a new business function, a
 * readiness engine, a next-step engine, or runtime AI behavior.
 */

export type FundamentalWorkMode = "build" | "improve" | "validate" | "redesign"

export interface BusinessFundamental {
  /** Stable ID for links and future persistence. */
  id: string
  /** Founder-facing title. */
  title: string
  /** Plain-language explanation of the fundamental. */
  summary: string
  /** What a founder should be able to establish or strengthen. */
  outcomes: string[]
  /** Existing Seven Business Functions™ job keys. */
  businessFunctionKeys: readonly string[]
  /** Existing Executive Leadership Team™ IDs. */
  leadExecutiveIds: readonly string[]
  /** Additional existing Executive IDs that may support the work. */
  supportingExecutiveIds: readonly string[]
  /** The four supported ways a founder may work on this fundamental. */
  workModes: readonly FundamentalWorkMode[]
}

export const STARTUP_BUSINESS_FUNDAMENTALS: readonly BusinessFundamental[] = [
  {
    id: "business-identity-direction",
    title: "Business Identity & Direction",
    summary: "Get clear about the business you are building, who it serves, and the problem it exists to solve.",
    outcomes: [
      "Business concept and purpose",
      "Problem or opportunity definition",
      "Business model hypothesis",
      "Founder strengths and strategic direction",
      "Goals and decisions requiring validation",
    ],
    businessFunctionKeys: ["design", "thought_leadership"],
    leadExecutiveIds: ["strategy"],
    supportingExecutiveIds: ["innovation", "growth"],
    workModes: ["build", "improve", "validate", "redesign"],
  },
  {
    id: "ideal-client-market",
    title: "Ideal Client & Market Understanding",
    summary: "Understand the people or organizations you serve, the problems they need solved, and the market you operate in.",
    outcomes: [
      "Ideal Client Profile™",
      "Market research brief",
      "Customer discovery questions",
      "Assumptions and validation evidence",
    ],
    businessFunctionKeys: ["attraction", "thought_leadership", "sales"],
    leadExecutiveIds: ["marketing-brand"],
    supportingExecutiveIds: ["strategy", "innovation", "sales"],
    workModes: ["build", "improve", "validate", "redesign"],
  },
  {
    id: "message-pitch",
    title: "Business Message & 30-Second Pitch",
    summary: "Explain clearly what your business does, who it helps, and why the right person should care.",
    outcomes: [
      "Positioning and value proposition",
      "Core business message",
      "30-Second Business Introduction™",
      "Conversational and practice versions",
    ],
    businessFunctionKeys: ["attraction", "sales", "thought_leadership"],
    leadExecutiveIds: ["marketing-brand"],
    supportingExecutiveIds: ["strategy", "sales", "growth"],
    workModes: ["build", "improve", "validate", "redesign"],
  },
  {
    id: "offer-delivery",
    title: "Product, Service & Offer Development",
    summary: "Define what customers buy, what they receive, and how the promised experience is delivered.",
    outcomes: [
      "Offer Blueprint™",
      "Scope, inclusions, and exclusions",
      "Delivery method and workflow",
      "Customer responsibilities and experience",
    ],
    businessFunctionKeys: ["sales", "delivery", "operations"],
    leadExecutiveIds: ["strategy"],
    supportingExecutiveIds: ["client-success", "finance", "operations"],
    workModes: ["build", "improve", "validate", "redesign"],
  },
  {
    id: "pricing-revenue",
    title: "Pricing & Revenue Model",
    summary: "Understand how the business earns money and whether pricing supports delivery costs, capacity, and profitability.",
    outcomes: [
      "Pricing and payment assumptions",
      "Revenue model",
      "Cost-to-deliver analysis",
      "Margin and revenue scenarios",
    ],
    businessFunctionKeys: ["sales", "operations"],
    leadExecutiveIds: ["finance"],
    supportingExecutiveIds: ["strategy", "operations"],
    workModes: ["build", "improve", "validate", "redesign"],
  },
  {
    id: "marketing-sales",
    title: "Marketing, Client Attraction & Sales",
    summary: "Create a practical way for the right people to discover the business, understand its value, and become customers.",
    outcomes: [
      "Client attraction plan",
      "Marketing channel and message plan",
      "Lead-generation approach",
      "Sales pathway and follow-up process",
    ],
    businessFunctionKeys: ["attraction", "sales", "experiences", "thought_leadership"],
    leadExecutiveIds: ["marketing-brand", "sales"],
    supportingExecutiveIds: ["growth", "innovation"],
    workModes: ["build", "improve", "validate", "redesign"],
  },
  {
    id: "operations-technology",
    title: "Operations, Delivery & Technology",
    summary: "Design the systems, workflows, tools, and capacity that let the business operate without relying on constant founder effort.",
    outcomes: [
      "Core operating workflows",
      "SOPs and role/ownership clarity",
      "Technology and AI support plan",
      "Delegation and automation opportunities",
      "Capacity and delivery quality practices",
    ],
    businessFunctionKeys: ["delivery", "operations", "design"],
    leadExecutiveIds: ["operations"],
    supportingExecutiveIds: ["client-success", "people-culture", "innovation"],
    workModes: ["build", "improve", "validate", "redesign"],
  },
  {
    id: "administration-finances",
    title: "Business Administration & Financial Foundations",
    summary: "Establish the records, routines, and financial visibility needed to manage the business responsibly.",
    outcomes: [
      "Administrative responsibility checklist",
      "Financial recordkeeping practices",
      "Cash-flow visibility and basic reporting",
      "Open legal, tax, accounting, or compliance questions for qualified professionals",
    ],
    businessFunctionKeys: ["operations", "design"],
    leadExecutiveIds: ["finance", "operations"],
    supportingExecutiveIds: ["strategy"],
    workModes: ["build", "improve", "validate", "redesign"],
  },
] as const

export function getBusinessFundamental(id: string): BusinessFundamental | undefined {
  return STARTUP_BUSINESS_FUNDAMENTALS.find((fundamental) => fundamental.id === id)
}

export function getFundamentalsForBusinessFunction(jobKey: string): BusinessFundamental[] {
  return STARTUP_BUSINESS_FUNDAMENTALS.filter((fundamental) =>
    fundamental.businessFunctionKeys.includes(jobKey),
  )
}
