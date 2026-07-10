/**
 * Business Stage™ — Registry & Foundation (Phase 5.4)
 * ---------------------------------------------------------------------------
 * The SINGLE SOURCE OF TRUTH for the Harmony Lane™ Operating System's
 * Business Stage™ concept.
 *
 * Business Stage™ is a CONTEXTUAL SIGNAL, not a pricing tier, membership level,
 * or measure of success. Every founder uses the SAME Operating System™ — what
 * changes is the guidance, never the platform. It lets Cherry Blossom™, the
 * Executive Leadership Team™, the Professional Advisory Network™, the
 * Deliverable Engine™, and Harmony Business Academy™ provide more relevant
 * guidance based on WHERE a founder is in their journey.
 *
 * This module is intentionally data-only. NO recommendation logic, automatic
 * detection, or adaptive behavior is implemented this phase. Every registry
 * plugs into these definitions WITHOUT a redesign — each stage already declares
 * its focus, priorities, challenges, and the executives/advisors/focus areas a
 * future phase will surface.
 */

/** The four Business Stages™. Stable ids — safe for storage and future logic. */
export type BusinessStage = "launch" | "growth" | "scale" | "legacy"

/** Every stage, in natural journey order. Stages are contextual, NOT hierarchical. */
export const ALL_BUSINESS_STAGES: BusinessStage[] = ["launch", "growth", "scale", "legacy"]

export interface BusinessStageDefinition {
  /** Stable identifier — safe for routing, storage, and future logic. */
  id: BusinessStage
  /** Brand name (e.g. "Launch™"). */
  name: string
  /** A short, calm positioning line for cards and summaries. */
  tagline: string
  /** A fuller description of who this stage is for. */
  description: string
  /** "For founders who are…" — the situations that define this stage. */
  situations: string[]
  /** What guidance tends to focus on at this stage. */
  focus: string[]
  /** Typical priorities a founder holds at this stage (UX card). */
  typicalPriorities: string[]
  /** Typical challenges a founder faces at this stage (UX card). */
  typicalChallenges: string[]
  /**
   * Priority Focus Area™ ids most relevant at this stage. References
   * FOCUS_AREA_OPTIONS in components/sunday-design-day/sdd-config.ts. Declared
   * as an architecture hook — no logic reads this yet.
   */
  recommendedFocusAreas: string[]
  /**
   * Executive ids a future phase may surface first at this stage. References
   * lib/executive-team/executive-registry. EVERY executive still supports every
   * stage — this is only an emphasis hint. No logic reads this yet.
   */
  recommendedExecutives: string[]
  /**
   * Advisor ids a future phase may surface first at this stage. References
   * lib/advisory-network/advisor-registry. No logic reads this yet.
   */
  recommendedAdvisors: string[]
}

/**
 * BUSINESS_STAGES — the four stages of the founder journey. Contextual, not
 * hierarchical: moving between stages is not "better," it reflects different
 * business needs.
 */
export const BUSINESS_STAGES: BusinessStageDefinition[] = [
  {
    id: "launch",
    name: "Launch™",
    tagline: "Validating the idea and building the foundation.",
    description:
      "For founders starting a business — validating an idea, building a first offer, setting up operations, and acquiring their first clients.",
    situations: [
      "Validating an idea",
      "Starting a business",
      "Building their first offer",
      "Setting up operations",
      "Acquiring first clients",
    ],
    focus: [
      "Business formation",
      "Validation",
      "Pricing",
      "Business credit",
      "Marketing basics",
      "Sales basics",
      "Work-Life Balance Business Day™ installation",
    ],
    typicalPriorities: [
      "Validate the offer with real clients",
      "Establish the business and its foundations",
      "Set pricing that reflects real value",
      "Install a sustainable daily rhythm from day one",
    ],
    typicalChallenges: [
      "Wearing every hat at once",
      "Uncertainty about what to focus on first",
      "Building credibility and first revenue",
    ],
    recommendedFocusAreas: ["revenue", "systems"],
    recommendedExecutives: ["strategy", "marketing-brand", "sales", "finance"],
    recommendedAdvisors: ["business-credit", "legal"],
  },
  {
    id: "growth",
    name: "Growth™",
    tagline: "Building systems on consistent revenue.",
    description:
      "For founders generating consistent revenue who are building systems and expanding capacity beyond themselves.",
    situations: ["Generating consistent revenue", "Building systems", "Expanding capacity"],
    focus: [
      "Marketing systems",
      "Sales systems",
      "Delegation",
      "AI workflows",
      "Operations",
      "Client success",
    ],
    typicalPriorities: [
      "Turn what works into repeatable systems",
      "Delegate and automate the founder's overload",
      "Deepen client success and retention",
      "Expand capacity without losing balance",
    ],
    typicalChallenges: [
      "Moving from doing to designing",
      "Letting go of tasks through delegation",
      "Keeping quality consistent while scaling output",
    ],
    recommendedFocusAreas: ["systems", "delegation", "revenue"],
    recommendedExecutives: ["marketing-brand", "sales", "operations", "client-success", "innovation"],
    recommendedAdvisors: ["business-credit", "tax", "legal"],
  },
  {
    id: "scale",
    name: "Scale™",
    tagline: "Leading teams and managing complexity.",
    description:
      "For founders building teams, managing leaders, and navigating increasing operational complexity.",
    situations: ["Building teams", "Managing leaders", "Increasing operational complexity"],
    focus: [
      "Leadership",
      "Organizational design",
      "People & Culture",
      "KPIs",
      "Executive management",
      "AI workforce",
    ],
    typicalPriorities: [
      "Build and develop a healthy team",
      "Design the organization and its operating rules",
      "Lead through KPIs and executive rhythm",
      "Protect Human Sustainability™ at scale",
    ],
    typicalChallenges: [
      "Shifting from manager to leader of leaders",
      "Maintaining culture as the team grows",
      "Managing complexity without burning out",
    ],
    recommendedFocusAreas: ["leadership", "delegation", "systems"],
    recommendedExecutives: ["people-culture", "operations", "finance", "growth", "innovation"],
    recommendedAdvisors: ["compliance", "insurance", "legal"],
  },
  {
    id: "legacy",
    name: "Legacy™",
    tagline: "Expanding influence and creating lasting wealth.",
    description:
      "For founders expanding influence — licensing, speaking, publishing, succession planning, and long-term wealth creation.",
    situations: [
      "Expanding influence",
      "Licensing",
      "Speaking",
      "Publishing",
      "Succession planning",
      "Long-term wealth creation",
    ],
    focus: [
      "Thought leadership",
      "Intellectual property",
      "Licensing",
      "Exit planning",
      "Board governance",
      "Investments",
      "Philanthropy",
    ],
    typicalPriorities: [
      "Grow influence and thought leadership",
      "Protect and license intellectual property",
      "Plan succession and long-term wealth",
      "Establish governance and stewardship",
    ],
    typicalChallenges: [
      "Building something that outlasts the founder",
      "Balancing influence with focus",
      "Navigating governance, exit, and legacy decisions",
    ],
    recommendedFocusAreas: ["leadership", "systems"],
    recommendedExecutives: ["growth", "strategy", "finance", "people-culture"],
    recommendedAdvisors: ["legal", "tax", "compliance", "insurance"],
  },
]

/** The default stage for a founder who hasn't chosen one. */
export const DEFAULT_BUSINESS_STAGE: BusinessStage = "launch"

/** Look up a stage definition by id. Falls back to the default stage. */
export function getBusinessStage(id: BusinessStage | string | null | undefined): BusinessStageDefinition {
  return BUSINESS_STAGES.find((s) => s.id === id) ?? BUSINESS_STAGES[0]
}

/** Type guard for a valid Business Stage™ id. */
export function isBusinessStage(value: unknown): value is BusinessStage {
  return typeof value === "string" && ALL_BUSINESS_STAGES.includes(value as BusinessStage)
}
