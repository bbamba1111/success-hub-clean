/**
 * Excellence Intelligence Engine™ — Registry (Phase 5.8)
 * ---------------------------------------------------------------------------
 * The CANONICAL KNOWLEDGE LAYER™ of the Harmony Lane™ Operating System — the
 * single source from which every other system learns.
 *
 * It is NOT an AI engine, a search engine, or a content library. It is the
 * canonical body of executive business knowledge that powers Cherry Blossom™,
 * the Executive Leadership Team™, the Professional Advisory Network™, Harmony
 * Business Academy™, Deliverables™, the AI Augmentation Hour™, and every future
 * AI capability.
 *
 * Core philosophy — Harmony Lane™ does not teach personalities; it teaches
 * enduring business principles. The Engine synthesizes evidence-based research,
 * enduring principles, executive practice patterns, and the proprietary Harmony
 * Lane™ Methodology™ into guidance every founder can apply — regardless of
 * industry, Business Stage™, size, Business Comprehension™, language, or
 * location. The PRINCIPLE stays constant; the Harmony Context Engine™ adapts how
 * it is explained.
 *
 * This module is intentionally data-only and architecture-only. There is NO AI
 * reasoning, no recommendation logic, no search, and no editing this phase.
 * Every knowledge object declares the cross-references (Business Concepts™,
 * Executives™, Advisors™, Academy™, Deliverables™, Operating Segments™) and the
 * Harmony Context™ signals (Business Stage™, Business Comprehension™, Preferred
 * Language™) that future phases plug into WITHOUT a redesign. Knowledge is NEVER
 * duplicated — concept definitions always reference the Business Concepts
 * Registry™ (lib/business-concepts/business-concepts-registry).
 */

import { ALL_BUSINESS_STAGES, type BusinessStage } from "@/lib/business-stage/business-stage"
import { ALL_COMMUNICATION_STYLES, type CommunicationStyle } from "@/lib/business-comprehension/business-comprehension"
import { SUPPORTED_LANGUAGES, type LanguageCode } from "@/lib/i18n/language"

/** All Preferred Language™ codes — derived so the two never drift. */
export const ALL_LANGUAGE_CODES: LanguageCode[] = SUPPORTED_LANGUAGES.map((l) => l.code)

/** Lifecycle of every Engine object this phase. */
export type ExcellenceStatus = "architecture"

/* ===========================================================================
 * The Four Knowledge Domains™
 * ---------------------------------------------------------------------------
 * The Engine is permanently organized into four domains. Every knowledge object
 * belongs to exactly one.
 * ======================================================================== */

export type KnowledgeDomainId =
  | "evidence-based-research"
  | "enduring-business-principles"
  | "executive-practice-patterns"
  | "harmony-lane-methodology"

export interface KnowledgeDomain {
  /** Stable identifier — safe for routing, storage, and cross-references. */
  id: KnowledgeDomainId
  /** Brand name (e.g. "Evidence-Based Research™"). */
  name: string
  /** A short, calm positioning line. */
  tagline: string
  /** A fuller description of what this domain contributes. */
  description: string
  /** The purpose this domain serves inside the Engine. */
  purpose: string
  /** Representative disciplines / examples (illustrative, not exhaustive). */
  examples: string[]
  status: ExcellenceStatus
}

export const KNOWLEDGE_DOMAINS: KnowledgeDomain[] = [
  {
    id: "evidence-based-research",
    name: "Evidence-Based Research™",
    tagline: "Guidance grounded in credible disciplines.",
    description:
      "Knowledge synthesized from credible fields of study so recommendations rest on research, not opinion or trend.",
    purpose: "Provide research-supported foundations for every recommendation.",
    examples: [
      "Management Science",
      "Organizational Psychology",
      "Leadership Research",
      "Human Performance",
      "Behavioral Science",
      "Decision Science",
      "Systems Thinking",
      "Neuroscience",
      "Change Management",
    ],
    status: "architecture",
  },
  {
    id: "enduring-business-principles",
    name: "Enduring Business Principles™",
    tagline: "Timeless truths that appear across healthy organizations.",
    description:
      "Principles that consistently prove valuable across industries, eras, and business sizes — the durable fundamentals beneath every trend.",
    purpose: "Teach principles that remain valuable regardless of industry or fashion.",
    examples: [
      "Pareto Principle (80/20)",
      "Continuous Improvement",
      "Systems Thinking",
      "Customer-Centered Design",
      "Strategic Focus",
      "Capacity Planning",
      "Delegation",
      "Financial Discipline",
      "Progress Over Perfection",
      "Decision Frameworks",
      "Operating Rhythm",
    ],
    status: "architecture",
  },
  {
    id: "executive-practice-patterns",
    name: "Executive Practice Patterns™",
    tagline: "Patterns observed among healthy, high-performing founder-led businesses.",
    description:
      "Synthesized patterns consistently observed among healthy, high-performing founder-led businesses and executive leadership teams. These are patterns — never copies of any individual founder or celebrity habits.",
    purpose: "Show how enduring principles are actually practiced by strong operators.",
    examples: [
      "Protecting strategic thinking time",
      "Designing intentional operating rhythms",
      "Delegating repeatable work",
      "Building systems before adding complexity",
      "Measuring leading and lagging indicators",
      "Reviewing priorities consistently",
      "Investing in leadership development",
      "Protecting founder capacity",
      "Creating repeatable decision frameworks",
      "Balancing execution with recovery",
    ],
    status: "architecture",
  },
  {
    id: "harmony-lane-methodology",
    name: "Harmony Lane™ Methodology™",
    tagline: "The proprietary Harmony Lane™ contribution to founder success.",
    description:
      "Harmony Lane's own intellectual property — the frameworks, rituals, and standards unique to the Operating System that unite success with Human Sustainability™.",
    purpose: "Represent the unique Harmony Lane™ contribution to founder success.",
    examples: [
      "Harmony Lane™",
      "Sunday Design Day™",
      "Human Sustainability™",
      "Work-Life Balance Business Day™",
      "Operating Rules™",
      "Daily Non-Negotiables™",
      "AI Augmentation Hour™",
      "Human Zone of Genius™",
      "Progress Principle™",
      "GIV•EN™",
      "Work-Life Balance Audit™",
    ],
    status: "architecture",
  },
]

/** O(1) lookup of a domain by id. */
const DOMAIN_BY_ID = new Map<KnowledgeDomainId, KnowledgeDomain>(KNOWLEDGE_DOMAINS.map((d) => [d.id, d]))

export function getKnowledgeDomain(id: KnowledgeDomainId): KnowledgeDomain | undefined {
  return DOMAIN_BY_ID.get(id)
}

/* ===========================================================================
 * Knowledge Object shape
 * ---------------------------------------------------------------------------
 * Each object is a unit of canonical executive knowledge. It never contains
 * concept DEFINITIONS (those live in the Business Concepts Registry™) — it
 * references them by id, alongside every other system it informs.
 * ======================================================================== */

/** Where a knowledge object's authority comes from. */
export type KnowledgeSourceType =
  | "research-synthesis"
  | "enduring-principle"
  | "practice-pattern"
  | "harmony-methodology"

/** A qualitative signal of how well-supported the knowledge is (display only). */
export type EvidenceLevel = "foundational" | "well-established" | "emerging" | "proprietary"

export interface KnowledgeObject {
  /** Stable identifier — safe for routing, storage, and cross-references. */
  id: string
  /** Human title (e.g. "The 80/20 Principle in Practice"). */
  title: string
  /** The domain this object belongs to. */
  knowledgeDomain: KnowledgeDomainId
  /** A short positioning line. */
  description: string
  /** A fuller synthesis — what the founder takes away. */
  summary: string
  /** Where this knowledge's authority comes from. */
  sourceType: KnowledgeSourceType
  /** Qualitative strength of support (display only, never a score). */
  evidenceLevel: EvidenceLevel
  /** The durable principles this object teaches. */
  keyPrinciples: string[]

  /* -- Cross-references (ids only — knowledge is never duplicated) ------- */
  /** Business Concepts Registry™ ids this object draws on. */
  businessConcepts: string[]
  /** Executive Leadership Team™ ids this object informs. */
  relatedExecutives: string[]
  /** Professional Advisory Network™ ids this object informs. */
  relatedAdvisors: string[]
  /** Harmony Business Academy™ item ids that teach this object. */
  relatedAcademyItems: string[]
  /** Deliverable Output Architecture™ ids this object grounds. */
  relatedDeliverables: string[]
  /** Operating Segment™ ids (Sunday Design Day™) this object supports. */
  relatedOperatingSegments: string[]

  /* -- Harmony Context™ signals (architecture hooks) --------------------- */
  /** Business Stages™ this object serves (all, unless truly stage-specific). */
  businessStages: BusinessStage[]
  /** Communication Styles™ this object can be explained in (always all five). */
  communicationStyles: CommunicationStyle[]
  /** Preferred Languages™ this object can be presented in (always all). */
  supportedLanguages: LanguageCode[]

  /** Reserved: future citations / source references (none rendered yet). */
  futureReferences: string[]
  status: ExcellenceStatus
}

/* ===========================================================================
 * The canonical knowledge objects
 * ---------------------------------------------------------------------------
 * A representative, well-connected seed set across all four domains. Every
 * object references only ids that exist in the connected registries.
 * ======================================================================== */

export const KNOWLEDGE_OBJECTS: KnowledgeObject[] = [
  /* --- Evidence-Based Research™ --------------------------------------- */
  {
    id: "research-cognitive-load-and-delegation",
    title: "Cognitive Load & the Case for Delegation",
    knowledgeDomain: "evidence-based-research",
    description: "Why founders who protect attention outperform founders who hoard tasks.",
    summary:
      "Decision science and human-performance research show that finite attention degrades judgment as load rises. Delegating repeatable work is not abdication — it protects the founder's highest-value decisions and sustains performance over time.",
    sourceType: "research-synthesis",
    evidenceLevel: "well-established",
    keyPrinciples: ["Attention is finite", "Protect high-value decisions", "Delegate repeatable work early"],
    businessConcepts: ["delegation", "human-zone-of-genius", "capacity-planning"],
    relatedExecutives: ["operations", "people-culture"],
    relatedAdvisors: [],
    relatedAcademyItems: ["insight-delegation"],
    relatedDeliverables: ["job-description", "onboarding-checklist"],
    relatedOperatingSegments: ["ceo-workday", "download-delegate"],
    businessStages: ALL_BUSINESS_STAGES,
    communicationStyles: ALL_COMMUNICATION_STYLES,
    supportedLanguages: ALL_LANGUAGE_CODES,
    futureReferences: [],
    status: "architecture",
  },
  {
    id: "research-progress-principle",
    title: "The Progress Principle & Founder Motivation",
    knowledgeDomain: "evidence-based-research",
    description: "Small, visible progress is the strongest daily driver of motivation.",
    summary:
      "Organizational-psychology research finds that the single most powerful driver of positive inner work life is making meaningful progress — however small. Designing the day around visible progress sustains momentum better than pressure or willpower.",
    sourceType: "research-synthesis",
    evidenceLevel: "well-established",
    keyPrinciples: ["Small wins compound", "Progress over perfection", "Design for visible momentum"],
    businessConcepts: ["capacity-planning"],
    relatedExecutives: ["people-culture", "strategy"],
    relatedAdvisors: [],
    relatedAcademyItems: ["insight-human-sustainability-basics"],
    relatedDeliverables: ["strategic-plan"],
    relatedOperatingSegments: ["design-tomorrow", "ceo-workday"],
    businessStages: ALL_BUSINESS_STAGES,
    communicationStyles: ALL_COMMUNICATION_STYLES,
    supportedLanguages: ALL_LANGUAGE_CODES,
    futureReferences: [],
    status: "architecture",
  },

  /* --- Enduring Business Principles™ ---------------------------------- */
  {
    id: "principle-pareto-8020",
    title: "The 80/20 Principle in Practice",
    knowledgeDomain: "enduring-business-principles",
    description: "A small share of inputs produces most of the results.",
    summary:
      "The Pareto Principle holds that roughly 80% of outcomes flow from 20% of causes. For founders it becomes a discipline: find the vital few customers, offers, and activities that create most of the value, and protect them from the trivial many.",
    sourceType: "enduring-principle",
    evidenceLevel: "foundational",
    keyPrinciples: ["Identify the vital few", "Concentrate resources", "Prune the trivial many"],
    businessConcepts: ["margin", "gross-profit", "customer-lifetime-value"],
    relatedExecutives: ["strategy", "finance"],
    relatedAdvisors: [],
    relatedAcademyItems: ["insight-pricing-fundamentals", "insight-understanding-margin"],
    relatedDeliverables: ["strategic-plan", "annual-budget"],
    relatedOperatingSegments: ["ceo-workday"],
    businessStages: ALL_BUSINESS_STAGES,
    communicationStyles: ALL_COMMUNICATION_STYLES,
    supportedLanguages: ALL_LANGUAGE_CODES,
    futureReferences: [],
    status: "architecture",
  },
  {
    id: "principle-financial-discipline",
    title: "Financial Discipline & Cash Flow Health",
    knowledgeDomain: "enduring-business-principles",
    description: "Profit is opinion; cash is fact.",
    summary:
      "Durable businesses respect cash. Understanding margin, gross profit, burn rate, and cash flow — and reviewing them on a rhythm — keeps a company solvent through growth and downturn alike. Discipline here compounds quietly into resilience.",
    sourceType: "enduring-principle",
    evidenceLevel: "foundational",
    keyPrinciples: ["Cash is survival", "Know your numbers", "Review on a rhythm"],
    businessConcepts: ["cash-flow", "margin", "gross-profit", "burn-rate"],
    relatedExecutives: ["finance", "strategy"],
    relatedAdvisors: ["tax"],
    relatedAcademyItems: ["insight-understanding-margin"],
    relatedDeliverables: ["annual-budget", "tax-prep-checklist"],
    relatedOperatingSegments: ["ceo-workday"],
    businessStages: ALL_BUSINESS_STAGES,
    communicationStyles: ALL_COMMUNICATION_STYLES,
    supportedLanguages: ALL_LANGUAGE_CODES,
    futureReferences: [],
    status: "architecture",
  },
  {
    id: "principle-systems-before-complexity",
    title: "Build Systems Before Adding Complexity",
    knowledgeDomain: "enduring-business-principles",
    description: "Repeatable work deserves a repeatable system.",
    summary:
      "Before hiring more, selling more, or launching more, healthy operators codify how the work is done. Standard operating procedures and operating rules turn heroics into systems, so growth adds leverage instead of chaos.",
    sourceType: "enduring-principle",
    evidenceLevel: "well-established",
    keyPrinciples: ["Systematize the repeatable", "Document before you scale", "Simplicity precedes growth"],
    businessConcepts: ["sop", "operating-rule", "capacity-planning"],
    relatedExecutives: ["operations"],
    relatedAdvisors: ["compliance"],
    relatedAcademyItems: ["insight-designing-meetings"],
    relatedDeliverables: ["meeting-rules", "onboarding-checklist", "compliance-checklist"],
    relatedOperatingSegments: ["download-delegate", "ceo-workday"],
    businessStages: ALL_BUSINESS_STAGES,
    communicationStyles: ALL_COMMUNICATION_STYLES,
    supportedLanguages: ALL_LANGUAGE_CODES,
    futureReferences: [],
    status: "architecture",
  },

  /* --- Executive Practice Patterns™ ----------------------------------- */
  {
    id: "pattern-protected-strategic-time",
    title: "Protecting Strategic Thinking Time",
    knowledgeDomain: "executive-practice-patterns",
    description: "Strong operators defend time to think, not just to do.",
    summary:
      "A pattern observed across healthy founder-led businesses: strategic thinking is scheduled and protected, not left to whatever time remains. The CEO Workday™ exists to guarantee the founder's judgment gets the best of their attention.",
    sourceType: "practice-pattern",
    evidenceLevel: "well-established",
    keyPrinciples: ["Schedule thinking time", "Protect it like a meeting", "Judgment needs space"],
    businessConcepts: ["human-zone-of-genius", "operating-rule"],
    relatedExecutives: ["strategy", "people-culture"],
    relatedAdvisors: [],
    relatedAcademyItems: ["insight-human-sustainability-basics"],
    relatedDeliverables: ["strategic-plan"],
    relatedOperatingSegments: ["ceo-workday", "design-tomorrow"],
    businessStages: ALL_BUSINESS_STAGES,
    communicationStyles: ALL_COMMUNICATION_STYLES,
    supportedLanguages: ALL_LANGUAGE_CODES,
    futureReferences: [],
    status: "architecture",
  },
  {
    id: "pattern-operating-rhythm",
    title: "Designing an Intentional Operating Rhythm",
    knowledgeDomain: "executive-practice-patterns",
    description: "Cadence beats intensity.",
    summary:
      "High-performing teams run on rhythm: predictable reviews, decision points, and rituals. A designed operating rhythm — weekly, daily — replaces reactive scrambling with calm, repeatable execution and consistent priority review.",
    sourceType: "practice-pattern",
    evidenceLevel: "well-established",
    keyPrinciples: ["Cadence over crisis", "Review priorities consistently", "Rituals create reliability"],
    businessConcepts: ["operating-rule", "capacity-planning"],
    relatedExecutives: ["operations", "strategy"],
    relatedAdvisors: [],
    relatedAcademyItems: ["insight-designing-meetings"],
    relatedDeliverables: ["meeting-rules"],
    relatedOperatingSegments: ["reality-check", "design-tomorrow", "commit-prepare"],
    businessStages: ALL_BUSINESS_STAGES,
    communicationStyles: ALL_COMMUNICATION_STYLES,
    supportedLanguages: ALL_LANGUAGE_CODES,
    futureReferences: [],
    status: "architecture",
  },
  {
    id: "pattern-leading-and-lagging-indicators",
    title: "Measuring Leading & Lagging Indicators",
    knowledgeDomain: "executive-practice-patterns",
    description: "Watch the inputs, not only the scoreboard.",
    summary:
      "Strong operators pair lagging indicators (revenue, profit) with leading indicators (pipeline, activity, capacity). Leading indicators are steerable today; lagging ones only confirm yesterday. Measuring both turns strategy into feedback.",
    sourceType: "practice-pattern",
    evidenceLevel: "well-established",
    keyPrinciples: ["Pair leading with lagging", "Steer with inputs", "Measure what you can act on"],
    businessConcepts: ["cash-flow", "customer-lifetime-value", "burn-rate"],
    relatedExecutives: ["finance", "sales", "growth"],
    relatedAdvisors: [],
    relatedAcademyItems: ["insight-pricing-fundamentals"],
    relatedDeliverables: ["annual-budget", "strategic-plan"],
    relatedOperatingSegments: ["ceo-workday", "reality-check"],
    businessStages: ALL_BUSINESS_STAGES,
    communicationStyles: ALL_COMMUNICATION_STYLES,
    supportedLanguages: ALL_LANGUAGE_CODES,
    futureReferences: [],
    status: "architecture",
  },

  /* --- Harmony Lane™ Methodology™ ------------------------------------- */
  {
    id: "methodology-sunday-design-day",
    title: "Sunday Design Day™",
    knowledgeDomain: "harmony-lane-methodology",
    description: "Designing the week before living it.",
    summary:
      "The founding ritual of Harmony Lane™: before the week begins, the founder reviews reality, downloads and delegates, designs tomorrow, and commits. Design Day™ converts intention into an installed, livable operating week.",
    sourceType: "harmony-methodology",
    evidenceLevel: "proprietary",
    keyPrinciples: ["Design before you live it", "Review, delegate, design, commit", "Intention becomes structure"],
    businessConcepts: ["operating-rule", "delegation", "capacity-planning"],
    relatedExecutives: ["strategy", "operations", "people-culture"],
    relatedAdvisors: [],
    relatedAcademyItems: ["insight-human-sustainability-basics", "insight-delegation"],
    relatedDeliverables: ["strategic-plan"],
    relatedOperatingSegments: ["reality-check", "download-delegate", "design-tomorrow", "commit-prepare"],
    businessStages: ALL_BUSINESS_STAGES,
    communicationStyles: ALL_COMMUNICATION_STYLES,
    supportedLanguages: ALL_LANGUAGE_CODES,
    futureReferences: [],
    status: "architecture",
  },
  {
    id: "methodology-human-sustainability",
    title: "Human Sustainability™",
    knowledgeDomain: "harmony-lane-methodology",
    description: "Success that does not cost the founder themselves.",
    summary:
      "Harmony Lane™ holds that a business must sustain the human building it. Human Sustainability™ weaves energy, balance, and wellness into the operating model — so growth and the founder's life reinforce each other rather than compete.",
    sourceType: "harmony-methodology",
    evidenceLevel: "proprietary",
    keyPrinciples: ["The business sustains the human", "Balance is designed, not hoped for", "Recovery fuels execution"],
    businessConcepts: ["human-zone-of-genius", "capacity-planning"],
    relatedExecutives: ["people-culture", "client-success"],
    relatedAdvisors: ["insurance"],
    relatedAcademyItems: ["insight-human-sustainability-basics"],
    relatedDeliverables: [],
    relatedOperatingSegments: ["morning-given", "movement", "lunch", "time-freedom", "power-down"],
    businessStages: ALL_BUSINESS_STAGES,
    communicationStyles: ALL_COMMUNICATION_STYLES,
    supportedLanguages: ALL_LANGUAGE_CODES,
    futureReferences: [],
    status: "architecture",
  },
  {
    id: "methodology-ai-augmentation-hour",
    title: "AI Augmentation Hour™",
    knowledgeDomain: "harmony-lane-methodology",
    description: "Partnering with AI on the founder's highest-leverage work.",
    summary:
      "A dedicated segment where the founder pairs with AI to accelerate their most valuable work — never to replace judgment, always to extend it. The Human Zone of Genius™ leads; AI amplifies. This is Harmony Lane's model for governed, human-first leverage.",
    sourceType: "harmony-methodology",
    evidenceLevel: "proprietary",
    keyPrinciples: ["Human judgment leads", "AI amplifies leverage", "Governed, intentional augmentation"],
    businessConcepts: ["human-zone-of-genius", "delegation"],
    relatedExecutives: ["innovation", "operations"],
    relatedAdvisors: [],
    relatedAcademyItems: ["insight-ai-fundamentals"],
    relatedDeliverables: [],
    relatedOperatingSegments: ["ai-augmentation-hour", "ceo-workday"],
    businessStages: ALL_BUSINESS_STAGES,
    communicationStyles: ALL_COMMUNICATION_STYLES,
    supportedLanguages: ALL_LANGUAGE_CODES,
    futureReferences: [],
    status: "architecture",
  },
]

/** O(1) lookup of a knowledge object by id. */
const OBJECT_BY_ID = new Map<string, KnowledgeObject>(KNOWLEDGE_OBJECTS.map((o) => [o.id, o]))

export function getKnowledgeObject(id: string): KnowledgeObject | undefined {
  return OBJECT_BY_ID.get(id)
}

/** All knowledge objects belonging to a given domain, in registry order. */
export function getKnowledgeObjectsByDomain(domain: KnowledgeDomainId): KnowledgeObject[] {
  return KNOWLEDGE_OBJECTS.filter((o) => o.knowledgeDomain === domain)
}

/* ===========================================================================
 * Cherry Blossom™ Reasoning Hierarchy™ (architecture only)
 * ---------------------------------------------------------------------------
 * The documented order in which Cherry Blossom™ will EVENTUALLY reason. No
 * reasoning is implemented this phase — this establishes the architecture so
 * future intelligence phases have a canonical sequence to follow.
 * ======================================================================== */

export interface ReasoningLayer {
  /** 1-based position in the reasoning sequence. */
  order: number
  /** Brand name of the system consulted at this layer. */
  system: string
  /** What this layer contributes to the final recommendation. */
  role: string
}

export const CHERRY_BLOSSOM_REASONING_HIERARCHY: ReasoningLayer[] = [
  { order: 1, system: "Harmony Context Engine™", role: "Who the founder is and where they are right now." },
  { order: 2, system: "Excellence Intelligence Engine™", role: "The canonical body of enduring business knowledge." },
  { order: 3, system: "Business Concepts Registry™", role: "The shared definitions and one business language." },
  { order: 4, system: "Executive Leadership Team™", role: "The functional lens that owns the guidance." },
  { order: 5, system: "Professional Advisory Network™", role: "Specialized professional judgment when needed." },
  { order: 6, system: "Harmony Business Academy™", role: "The learning that prepares the founder to execute." },
  { order: 7, system: "Deliverables™", role: "The concrete output the founder can put to work." },
  { order: 8, system: "AI Augmentation Hour™", role: "Where human judgment and AI leverage combine." },
  { order: 9, system: "Founder Recommendation", role: "The single, contextualized next step for the founder." },
]
