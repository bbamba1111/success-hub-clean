/**
 * The Executive Leadership Team™ — Registry (Phase 5.1)
 * ---------------------------------------------------------------------------
 * The SINGLE SOURCE OF TRUTH for the Harmony Lane™ Operating System's executive
 * leadership architecture.
 *
 * These are NOT AI chatbots or personalities. They represent the permanent
 * executive FUNCTIONS within a founder-led business. Cherry Blossom™ — the
 * Chief of Staff & Executive Conductor™ — remains the member's only primary
 * guide; she coordinates the team and, in a future phase, will recommend the
 * appropriate executive based on Harmony Context™.
 *
 * This registry is intentionally data-only. Future phases (AI conversations,
 * the Deliverable Engine™, the Specialist & Advisory Networks™, Business
 * Stage™/Comprehension™ adaptation) plug into these definitions WITHOUT
 * requiring a redesign — every executive already declares its mission,
 * responsibilities, deliverables, recommendation triggers, related specialists,
 * and a reserved `futureAiEndpoint`.
 */

/**
 * Lifecycle of an executive within the architecture.
 *   - "conductor"    → Cherry Blossom™: live, primary, never replaced or hidden.
 *   - "architecture" → defined and presented; AI conversations arrive later.
 */
export type ExecutiveStatus = "conductor" | "architecture"

export interface Executive {
  /** Stable identifier — safe for routing, storage, and future AI endpoints. */
  id: string
  /** Executive brand name (e.g. "Strategy Executive™"). */
  name: string
  /** Formal C-suite title (e.g. "Chief Strategy Officer (CSO)"). */
  executiveTitle: string
  /** The function/department this executive owns. */
  department: string
  /** One-line description for cards and summaries. */
  description: string
  /** The executive's guiding purpose. */
  mission: string
  /** The core areas this executive is accountable for. */
  primaryResponsibilities: string[]
  /** Representative questions a founder brings to this executive. */
  typicalFounderQuestions: string[]
  /** Example outputs this executive will produce (future Deliverable Engine™). */
  availableDeliverables: string[]
  /**
   * Harmony Context™ signals that would lead Cherry Blossom™ to recommend this
   * executive. Recommendation LOGIC is out of scope this phase — these are the
   * declared hooks a future phase will match against CEO priorities & context.
   */
  recommendationTriggers: string[]
  /** Future Specialist Network™ roles that report into this executive. */
  relatedSpecialists: string[]
  /** Reserved endpoint for future AI conversations. Not wired this phase. */
  futureAiEndpoint: string
  /** Lifecycle status within the architecture. */
  status: ExecutiveStatus
}

/**
 * Cherry Blossom™ — Chief of Staff & Executive Conductor™.
 * Held separately from the executive roster: she is the member's only primary
 * guide and the orchestrator of the entire team, not one option among many.
 */
export const CHERRY_BLOSSOM: Executive = {
  id: "cherry-blossom",
  name: "Cherry Blossom™",
  executiveTitle: "Chief of Staff & Executive Conductor™",
  department: "Executive Coordination",
  description:
    "Your only primary guide. Cherry Blossom coordinates the entire Operating System and brings in the right executive at the right moment.",
  mission:
    "Coordinate the entire Harmony Lane™ Operating System so the founder is guided by one calm, trusted intelligence — never asked to browse or manage a directory of assistants.",
  primaryResponsibilities: [
    "Coordinate the full Executive Leadership Team™",
    "Read Harmony Context™ to understand where the founder is right now",
    "Introduce the appropriate executive at the appropriate moment",
    "Protect the founder's focus, energy, and Operating Rules™",
    "Maintain continuity across Sunday Design Day™ and Live Today™",
  ],
  typicalFounderQuestions: [
    "What should I focus on today?",
    "Who on my executive team can help with this?",
    "How does this fit the week I designed on Sunday?",
  ],
  availableDeliverables: [
    "Daily operating guidance",
    "Executive introductions & hand-offs",
    "Context-aware focus recommendations",
  ],
  recommendationTriggers: ["always-present"],
  relatedSpecialists: [],
  futureAiEndpoint: "/api/executives/cherry-blossom",
  status: "conductor",
}

/**
 * EXECUTIVE_TEAM — the permanent executive roster Cherry Blossom™ conducts.
 * Order reflects the natural build-a-business arc: strategy → visibility →
 * revenue → operations → finance → people → clients → innovation → growth.
 */
export const EXECUTIVE_TEAM: Executive[] = [
  {
    id: "strategy",
    name: "Strategy Executive™",
    executiveTitle: "Chief Strategy Officer (CSO)",
    department: "Strategy & Vision",
    description: "Helps founders make better business decisions with clarity and long-term perspective.",
    mission: "Help founders make better business decisions.",
    primaryResponsibilities: [
      "Business model",
      "Vision",
      "Offers",
      "Positioning",
      "Decision making",
      "Human Zone of Genius™",
      "Long-term strategy",
    ],
    typicalFounderQuestions: [
      "Is this the right offer to lead with?",
      "How should I position myself in the market?",
      "Which opportunity deserves my focus this quarter?",
    ],
    availableDeliverables: [
      "Business Strategy",
      "Offer Framework",
      "Quarterly Plan",
      "SWOT",
      "Decision Matrix",
    ],
    recommendationTriggers: ["strategy", "vision", "positioning", "offer", "decision", "quarterly-planning"],
    relatedSpecialists: ["Positioning Specialist™", "Offer Design Specialist™", "Decision Support Specialist™"],
    futureAiEndpoint: "/api/executives/strategy",
    status: "architecture",
  },
  {
    id: "marketing-brand",
    name: "Marketing & Brand Executive™",
    executiveTitle: "Chief Marketing Officer (CMO)",
    department: "Marketing & Brand",
    description: "Helps founders become visible and attract their ideal clients.",
    mission: "Help founders become visible and attract ideal clients.",
    primaryResponsibilities: [
      "Branding",
      "Marketing",
      "Personal Brand",
      "PR",
      "Media",
      "Social",
      "Website",
      "Content",
      "Launches",
    ],
    typicalFounderQuestions: [
      "How do I get in front of more ideal clients?",
      "What should my brand say about me?",
      "How do I plan a launch that doesn't overwhelm me?",
    ],
    availableDeliverables: [
      "Marketing Plan",
      "Press Release",
      "Media Kit",
      "Speaker One Sheet",
      "Website Messaging",
      "Content Calendar",
    ],
    recommendationTriggers: ["marketing", "brand", "visibility", "content", "launch", "pr", "social", "website"],
    relatedSpecialists: ["Content Specialist™", "PR & Media Specialist™", "Personal Brand Specialist™"],
    futureAiEndpoint: "/api/executives/marketing-brand",
    status: "architecture",
  },
  {
    id: "sales",
    name: "Sales Executive™",
    executiveTitle: "Chief Revenue Officer (CRO)",
    department: "Revenue & Sales",
    description: "Creates predictable revenue through aligned, human sales systems.",
    mission: "Create predictable revenue.",
    primaryResponsibilities: [
      "Sales",
      "Partnerships",
      "Networking",
      "Conversion",
      "Client acquisition",
    ],
    typicalFounderQuestions: [
      "How do I make my revenue more predictable?",
      "What should I say on a discovery call?",
      "Which partnerships are worth pursuing?",
    ],
    availableDeliverables: [
      "Sales Scripts",
      "Proposal",
      "Partnership Strategy",
      "Discovery Framework",
    ],
    recommendationTriggers: ["sales", "revenue", "conversion", "proposal", "partnership", "client-acquisition"],
    relatedSpecialists: ["Sales Copy Specialist™", "Partnership Specialist™", "Proposal Specialist™"],
    futureAiEndpoint: "/api/executives/sales",
    status: "architecture",
  },
  {
    id: "operations",
    name: "Operations Executive™",
    executiveTitle: "Chief Operating Officer (COO)",
    department: "Operations & Systems",
    description: "Increases execution while reducing founder overload.",
    mission: "Increase execution while reducing founder overload.",
    primaryResponsibilities: [
      "SOPs",
      "Delegation",
      "Automation",
      "AI Implementation",
      "Workflows",
      "Technology",
      "Efficiency",
    ],
    typicalFounderQuestions: [
      "What should I delegate or automate first?",
      "How do I document this so I stop doing it?",
      "Where is my time leaking each week?",
    ],
    availableDeliverables: [
      "SOP",
      "Workflow",
      "Delegation Matrix",
      "AI Workflow",
      "Operations Dashboard",
    ],
    recommendationTriggers: ["operations", "delegation", "automation", "sop", "workflow", "efficiency", "overload"],
    relatedSpecialists: ["Automation Specialist™", "SOP Specialist™", "Systems Specialist™"],
    futureAiEndpoint: "/api/executives/operations",
    status: "architecture",
  },
  {
    id: "finance",
    name: "Finance Executive™",
    executiveTitle: "Chief Financial Officer (CFO)",
    department: "Finance & Profitability",
    description: "Improves financial clarity and profitability.",
    mission: "Improve financial clarity and profitability.",
    primaryResponsibilities: [
      "Pricing",
      "Cash Flow",
      "KPIs",
      "Forecasting",
      "Budgeting",
    ],
    typicalFounderQuestions: [
      "Am I pricing my offers correctly?",
      "What do my numbers say about next quarter?",
      "Where is my profit actually coming from?",
    ],
    availableDeliverables: [
      "Budget",
      "Forecast",
      "Pricing Strategy",
      "Financial Dashboard",
    ],
    recommendationTriggers: ["finance", "pricing", "cash-flow", "profit", "forecast", "budget", "kpi"],
    relatedSpecialists: ["Pricing Specialist™", "Bookkeeping Specialist™", "Forecasting Specialist™"],
    futureAiEndpoint: "/api/executives/finance",
    status: "architecture",
  },
  {
    id: "people-culture",
    name: "People & Culture Executive™",
    executiveTitle: "Chief People & Culture Officer (CPCO)",
    department: "People & Culture",
    description: "Builds healthy founder-led organizations grounded in Human Sustainability™.",
    mission: "Build healthy founder-led organizations grounded in Human Sustainability™.",
    primaryResponsibilities: [
      "Hiring",
      "Team Development",
      "Organizational Design",
      "Human Sustainability™",
      "Team Operating Rules™",
      "Leadership",
      "Communication",
      "Burnout Prevention",
      "Capacity Planning",
    ],
    typicalFounderQuestions: [
      "Who should I hire next, and how?",
      "How do I build a team without burning out?",
      "What operating rules should my team live by?",
    ],
    availableDeliverables: [
      "Job Description",
      "Employee Handbook",
      "Team Operating Rules™",
      "Hiring Plan",
      "Team Capacity Plan",
      "Meeting Playbook",
    ],
    recommendationTriggers: ["hiring", "team", "culture", "burnout", "capacity", "leadership", "organizational-design"],
    relatedSpecialists: ["Hiring Specialist™", "Team Ops Specialist™", "Culture Specialist™"],
    futureAiEndpoint: "/api/executives/people-culture",
    status: "architecture",
  },
  {
    id: "client-success",
    name: "Client Success Executive™",
    executiveTitle: "Chief Experience Officer (CXO)",
    department: "Client Experience",
    description: "Creates remarkable client experiences that retain and refer.",
    mission: "Create remarkable client experiences.",
    primaryResponsibilities: [
      "Onboarding",
      "Retention",
      "Community",
      "Customer Journey",
      "Testimonials",
    ],
    typicalFounderQuestions: [
      "How do I onboard clients so they succeed early?",
      "How do I improve retention and referrals?",
      "What does a remarkable client journey look like?",
    ],
    availableDeliverables: [
      "Client Journey",
      "Welcome Packet",
      "Onboarding Checklist",
      "Feedback Survey",
    ],
    recommendationTriggers: ["client-success", "onboarding", "retention", "community", "experience", "testimonials"],
    relatedSpecialists: ["Onboarding Specialist™", "Community Specialist™", "Retention Specialist™"],
    futureAiEndpoint: "/api/executives/client-success",
    status: "architecture",
  },
  {
    id: "innovation",
    name: "Innovation Executive™",
    executiveTitle: "Chief Innovation & AI Officer",
    department: "Innovation & AI",
    description: "Helps founders responsibly leverage AI and emerging technology.",
    mission: "Help founders responsibly leverage AI and emerging technology.",
    primaryResponsibilities: [
      "AI Strategy",
      "AI Adoption",
      "Research",
      "Emerging Technology",
      "AI Education",
    ],
    typicalFounderQuestions: [
      "Where should AI fit in my business first?",
      "Which tools are worth adopting right now?",
      "How do I use AI responsibly and stay human-led?",
    ],
    availableDeliverables: [
      "AI Roadmap",
      "AI Tool Recommendations",
      "Automation Opportunities",
      "Prompt Library",
    ],
    recommendationTriggers: ["ai-strategy", "ai-adoption", "research", "emerging-tech", "tools", "automation"],
    relatedSpecialists: ["AI Tools Specialist™", "Prompt Specialist™", "Research Specialist™"],
    futureAiEndpoint: "/api/executives/innovation",
    status: "architecture",
  },
  {
    id: "growth",
    name: "Growth Executive™",
    executiveTitle: "Chief Growth & Leadership Officer",
    department: "Growth & Leadership",
    description: "Develops founders into exceptional leaders and thought leaders.",
    mission: "Develop founders into exceptional leaders.",
    primaryResponsibilities: [
      "Leadership",
      "Communication",
      "Publishing",
      "Speaking",
      "Courses",
      "Personal Brand Development",
      "Learning",
    ],
    typicalFounderQuestions: [
      "How do I grow as a leader and communicator?",
      "Should I write a book or build a signature talk?",
      "How do I turn my expertise into thought leadership?",
    ],
    availableDeliverables: [
      "Book Outline",
      "Signature Talk",
      "Leadership Plan",
      "Thought Leadership Roadmap",
      "Course Outline",
    ],
    recommendationTriggers: ["growth", "leadership", "speaking", "publishing", "course", "thought-leadership"],
    relatedSpecialists: ["Publishing Specialist™", "Speaking Specialist™", "Course Design Specialist™"],
    futureAiEndpoint: "/api/executives/growth",
    status: "architecture",
  },
]

/** Every executive including the Conductor — the complete team. */
export const FULL_LEADERSHIP_TEAM: Executive[] = [CHERRY_BLOSSOM, ...EXECUTIVE_TEAM]

/** Look up any executive (including Cherry Blossom™) by id. */
export function getExecutive(id: string): Executive | undefined {
  return FULL_LEADERSHIP_TEAM.find((e) => e.id === id)
}
