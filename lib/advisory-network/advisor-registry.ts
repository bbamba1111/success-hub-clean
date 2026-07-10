/**
 * The Professional Advisory Network™ — Registry (Phase 5.2)
 * ---------------------------------------------------------------------------
 * The SINGLE SOURCE OF TRUTH for the Harmony Lane™ Operating System's advisory
 * architecture.
 *
 * Advisors are NOT executives. The distinction is deliberate:
 *   - The Executive Leadership Team™ (see lib/executive-team) RUNS the business.
 *   - The Professional Advisory Network™ PROTECTS the business.
 *
 * Advisors are trusted specialists Cherry Blossom™ and the executives bring into
 * a situation when legal, financial, compliance, funding, or risk expertise is
 * needed. Members do NOT browse advisors during normal workflow — Cherry
 * Blossom™ introduces them contextually.
 *
 * These are NOT AI chatbots. This registry is intentionally data-only. Future
 * phases (AI conversations, the Deliverable Engine™, Business Stage™/
 * Comprehension™ adaptation) plug into these definitions WITHOUT a redesign —
 * every advisor already declares its mission, responsibilities, deliverables,
 * professional review notice, recommendation triggers, related executives, and a
 * reserved `futureAiEndpoint`.
 */

/**
 * Lifecycle of an advisor within the architecture.
 *   - "architecture" → defined and presented; AI conversations arrive later.
 */
export type AdvisorStatus = "architecture"

/** The area of protection an advisor covers. */
export type AdvisorCategory = "Legal" | "Tax" | "Funding & Credit" | "Insurance & Risk" | "Compliance"

export interface Advisor {
  /** Stable identifier — safe for routing, storage, and future AI endpoints. */
  id: string
  /** Advisor brand name (e.g. "AI Legal Advisor™"). */
  name: string
  /** Formal advisory title. */
  advisorTitle: string
  /** The protection category this advisor covers. */
  category: AdvisorCategory
  /** One-line description for cards and summaries. */
  description: string
  /** The advisor's guiding purpose. */
  mission: string
  /** The core areas this advisor supports. */
  primaryResponsibilities: string[]
  /** Representative questions a founder brings to this advisor. */
  typicalFounderQuestions: string[]
  /** Example outputs this advisor will produce (future Deliverable Engine™). */
  availableDeliverables: string[]
  /**
   * The professional-review disclaimer that MUST accompany every output. This is
   * a protection layer: advisors provide education & drafting assistance, never
   * licensed professional advice.
   */
  professionalReviewNotice: string
  /**
   * Harmony Context™ signals that would lead Cherry Blossom™ to bring in this
   * advisor. Recommendation LOGIC is out of scope this phase — these are the
   * declared hooks a future phase will match against founder context.
   */
  recommendationTriggers: string[]
  /**
   * The executive functions this advisor supports. Advisors are brought in BY
   * the executives; these ids reference lib/executive-team/executive-registry.
   */
  relatedExecutives: string[]
  /** Reserved endpoint for future AI conversations. Not wired this phase. */
  futureAiEndpoint: string
  /** Lifecycle status within the architecture. */
  status: AdvisorStatus
}

/**
 * ADVISORY_NETWORK — the permanent advisory roster.
 * Order reflects the natural protection arc a founder-led business encounters:
 * legal foundation → tax → funding readiness → insurance/risk → compliance.
 */
export const ADVISORY_NETWORK: Advisor[] = [
  {
    id: "legal",
    name: "AI Legal Advisor™",
    advisorTitle: "Legal Education & Drafting Advisor",
    category: "Legal",
    description:
      "Helps founders understand legal concepts, prepare draft documents, identify legal risks, and know when professional legal review is appropriate.",
    mission:
      "Help founders understand legal concepts, prepare draft documents, identify legal risks, and know when professional legal review is appropriate.",
    primaryResponsibilities: [
      "Business entity education",
      "Contract drafting assistance",
      "Contract review summaries",
      "Intellectual property education",
      "Trademark process guidance",
      "Copyright guidance",
      "Website legal documents",
      "Independent contractor templates",
      "Client agreement templates",
      "Risk identification",
    ],
    typicalFounderQuestions: [
      "What kind of agreement do I need for this client?",
      "How do I start protecting my brand name?",
      "What legal documents does my website need?",
    ],
    availableDeliverables: [
      "Service Agreement (draft)",
      "NDA (template)",
      "Website Legal Checklist",
      "Privacy Policy Checklist",
      "Contract Review Summary",
      "Trademark Readiness Checklist",
    ],
    professionalReviewNotice:
      "All legal outputs are educational or drafting assistance and should be reviewed by a licensed attorney before implementation.",
    recommendationTriggers: ["contract", "agreement", "trademark", "intellectual-property", "hiring", "website-legal", "risk"],
    relatedExecutives: ["people-culture", "operations", "strategy"],
    futureAiEndpoint: "/api/advisors/legal",
    status: "architecture",
  },
  {
    id: "tax",
    name: "Tax Advisor™",
    advisorTitle: "Tax Education & Readiness Advisor",
    category: "Tax",
    description:
      "Helps founders understand business taxes, plan for what they owe, and stay organized and ready for their tax professional.",
    mission:
      "Help founders understand their tax obligations, plan ahead, and stay organized and ready for a qualified tax professional.",
    primaryResponsibilities: [
      "Business tax education",
      "Estimated tax planning",
      "Bookkeeping guidance",
      "Payroll tax education",
      "Deduction education",
      "Tax readiness",
    ],
    typicalFounderQuestions: [
      "How much should I set aside for taxes?",
      "Which expenses can I actually deduct?",
      "How do I keep my books ready for tax time?",
    ],
    availableDeliverables: [
      "Tax Preparation Checklist",
      "Estimated Tax Calendar",
      "Bookkeeping Workflow",
      "Deduction Tracker",
    ],
    professionalReviewNotice:
      "Tax guidance is educational and should be reviewed by a qualified tax professional.",
    recommendationTriggers: ["taxes", "estimated-tax", "bookkeeping", "payroll", "deductions", "tax-readiness"],
    relatedExecutives: ["finance"],
    futureAiEndpoint: "/api/advisors/tax",
    status: "architecture",
  },
  {
    id: "business-credit",
    name: "Business Credit Advisor™",
    advisorTitle: "Credit & Funding Readiness Advisor",
    category: "Funding & Credit",
    description: "Supports founders in building business credit responsibly and preparing for funding.",
    mission: "Support founders in building business credit responsibly and preparing for funding.",
    primaryResponsibilities: [
      "Business credit readiness",
      "EIN guidance",
      "D-U-N-S guidance",
      "Vendor credit education",
      "Business banking",
      "Funding readiness",
      "Capital preparation",
      "Credit-building roadmap",
    ],
    typicalFounderQuestions: [
      "How do I start building business credit?",
      "What do lenders look for before I apply?",
      "Am I ready to seek funding for my business?",
    ],
    availableDeliverables: [
      "Business Credit Readiness Assessment",
      "90-Day Credit Building Plan",
      "Banking Checklist",
      "Funding Readiness Roadmap",
    ],
    professionalReviewNotice:
      "Recommendations are educational and should be verified with lenders or qualified advisors before making financial commitments.",
    recommendationTriggers: ["business-credit", "funding", "capital", "banking", "ein", "duns", "vendor-credit"],
    relatedExecutives: ["finance", "strategy"],
    futureAiEndpoint: "/api/advisors/business-credit",
    status: "architecture",
  },
  {
    id: "insurance",
    name: "Insurance Advisor™",
    advisorTitle: "Coverage & Risk Advisor",
    category: "Insurance & Risk",
    description: "Helps founders understand business insurance and manage risk with appropriate coverage.",
    mission: "Help founders understand business insurance and manage risk with appropriate coverage.",
    primaryResponsibilities: [
      "Business insurance education",
      "Risk management",
      "Professional liability",
      "Cyber insurance",
      "Workers' compensation education",
    ],
    typicalFounderQuestions: [
      "What insurance does my business actually need?",
      "How do I protect against professional liability?",
      "Do I need cyber insurance at my stage?",
    ],
    availableDeliverables: [
      "Coverage Checklist",
      "Risk Assessment Worksheet",
      "Insurance Comparison Guide",
    ],
    professionalReviewNotice:
      "Insurance recommendations should be confirmed with licensed insurance professionals.",
    recommendationTriggers: ["insurance", "liability", "risk-management", "cyber", "workers-comp", "coverage"],
    relatedExecutives: ["operations", "finance"],
    futureAiEndpoint: "/api/advisors/insurance",
    status: "architecture",
  },
  {
    id: "compliance",
    name: "Compliance Advisor™",
    advisorTitle: "Governance & Compliance Advisor",
    category: "Compliance",
    description: "Helps founders understand and prepare for compliance across HR, privacy, accessibility, and AI governance.",
    mission:
      "Help founders understand and prepare for compliance across HR, privacy, accessibility, AI governance, and industry regulations.",
    primaryResponsibilities: [
      "HR compliance",
      "Privacy",
      "Accessibility",
      "AI governance",
      "Industry regulations",
      "Internal policy guidance",
    ],
    typicalFounderQuestions: [
      "What compliance basics am I missing?",
      "How do I use AI responsibly and on the record?",
      "Is my website accessible and privacy-ready?",
    ],
    availableDeliverables: [
      "Compliance Checklist",
      "AI Governance Checklist",
      "Privacy Readiness Checklist",
      "Accessibility Checklist",
    ],
    professionalReviewNotice:
      "Compliance requirements vary by jurisdiction and industry and should be verified before implementation.",
    recommendationTriggers: ["compliance", "privacy", "accessibility", "ai-governance", "hr-policy", "regulations"],
    relatedExecutives: ["people-culture", "operations"],
    futureAiEndpoint: "/api/advisors/compliance",
    status: "architecture",
  },
]

/** Look up any advisor by id. */
export function getAdvisor(id: string): Advisor | undefined {
  return ADVISORY_NETWORK.find((a) => a.id === id)
}
