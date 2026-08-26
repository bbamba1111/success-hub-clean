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
import type { BusinessModelId } from "@/lib/entrepreneur-success/types"
import type { LeverageClassId } from "@/lib/executive-decision-engine/types"
import type {
  AcquisitionModelId,
  CustomerModelId,
  DeliveryModelId,
  RevenueModelId,
} from "@/lib/business-model-classification/types"

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
  /**
   * Knowledge independently synthesized from EXTERNAL practice research (see
   * `ExternalSourceAttribution` below) — distinct from Harmony Lane's own
   * methodology. Populated sparingly and only with generic, non-attributed
   * source categories (never a named course, operator, or copyrighted work).
   */
  | "external-practice-synthesis"

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

/* ===========================================================================
 * Proactive Start, Growth & Scale Readiness™ (Phase 3)
 * ---------------------------------------------------------------------------
 * A structured answer to a question the Engine did not yet ask: "what must
 * exist BEFORE the next Business Stage™, not just what helps at the current
 * one?" This is additive architecture inside the existing Excellence
 * Intelligence Engine™ — not a new engine, not a scoring system, not AI.
 *
 * Every Readiness Capability™ below is a KNOWLEDGE unit, in the same spirit
 * as `KnowledgeObject` — it never duplicates definitions (Business Concepts™
 * Registry) or ownership (Executive Leadership Team™, Deliverables™); it only
 * references them and adds the one thing those registries do not express:
 * SEQUENCE — what should exist before what, and why.
 * ======================================================================== */

/** The four Readiness domains™. Every Readiness Capability™ belongs to exactly one. */
export type ReadinessDomainId =
  | "start-readiness"
  | "growth-readiness"
  | "scale-readiness"
  | "future-workplace-readiness"

export interface ReadinessDomain {
  id: ReadinessDomainId
  /** Brand name (e.g. "Start Readiness™"). */
  name: string
  tagline: string
  description: string
  purpose: string
  examples: string[]
  status: ExcellenceStatus
}

export const READINESS_DOMAINS: ReadinessDomain[] = [
  {
    id: "start-readiness",
    name: "Start Readiness™",
    tagline: "What must exist before Growth™ — not just what helps at Launch™.",
    description:
      "The foundational clarity a business needs installed during Launch™ so that Growth™ adds leverage instead of chaos: who the customer is, what the offer is, what it costs, and what rhythm the founder runs on.",
    purpose: "Prepare a Launch™-stage founder for the transition into Growth™, proactively.",
    examples: ["Customer clarity", "Offer clarity", "Pricing clarity", "A foundational operating rhythm"],
    status: "architecture",
  },
  {
    id: "growth-readiness",
    name: "Growth Readiness™",
    tagline: "What must exist before Scale™ — not just what helps at Growth™.",
    description:
      "The systems, delegation, and early leverage a business needs installed during Growth™ so that Scale™ adds people and complexity onto a foundation, not into a vacuum.",
    purpose: "Prepare a Growth™-stage founder for the transition into Scale™, proactively.",
    examples: ["Systems before hiring", "Delegation capacity", "Governed AI workflows", "Financial visibility"],
    status: "architecture",
  },
  {
    id: "scale-readiness",
    name: "Scale Readiness™",
    tagline: "What must exist before Legacy™ — not just what helps at Scale™.",
    description:
      "The leadership depth, organizational design, and executive rhythm a business needs installed during Scale™ so that Legacy™ inherits a company that can outlast the founder, not one that depends on them.",
    purpose: "Prepare a Scale™-stage founder for the transition into Legacy™, proactively.",
    examples: ["Leadership depth", "Organizational design", "Executive rhythm & KPI discipline", "Exit-readiness foundations"],
    status: "architecture",
  },
  {
    id: "future-workplace-readiness",
    name: "Future Workplace Readiness™",
    tagline: "The workplace a founder is proactively building, not just the business.",
    description:
      "A cross-cutting readiness domain that extends the founder's own Human Sustainability™ and AI-human collaboration standards into an organizational design — so the workplace the founder builds reflects the life they intended, at every level of the team.",
    purpose: "Prepare a Scale™ or Legacy™-stage founder to design a workplace, not only a business.",
    examples: [
      "Organizational Human Sustainability™ standards",
      "Governed AI-human collaboration at team scale",
      "Work design",
      "People & culture at scale",
    ],
    status: "architecture",
  },
]

const READINESS_DOMAIN_BY_ID = new Map<ReadinessDomainId, ReadinessDomain>(READINESS_DOMAINS.map((d) => [d.id, d]))

export function getReadinessDomain(id: ReadinessDomainId): ReadinessDomain | undefined {
  return READINESS_DOMAIN_BY_ID.get(id)
}

/**
 * Structured attribution for knowledge synthesized from EXTERNAL practice
 * research (as opposed to Harmony Lane's own methodology). Deliberately
 * generic — a source CATEGORY and a plain description, never a named course,
 * operator, guru, or copyrighted framework.
 */
export interface ExternalSourceAttribution {
  sourceCategory: "operator-practice-research" | "academic-research" | "industry-body-research"
  /** A plain, generic description of the kind of source (never a proper name). */
  sourceDescriptor: string
  /** The single principle retrieved and generalized from that source category. */
  retrievedPrinciple: string
}

/**
 * A Readiness Capability™ — a single "what must exist before the next stage"
 * knowledge unit. Mirrors `KnowledgeObject`'s cross-reference discipline:
 * knowledge is never duplicated, only referenced by id.
 */
export interface ReadinessCapability {
  /** Stable identifier — safe for routing, storage, and cross-references. */
  id: string
  /** Human title (e.g. "Customer Clarity Before Scale"). */
  title: string
  readinessDomain: ReadinessDomainId
  /** Cross-reference into the Four Knowledge Domains™ this capability draws on. */
  knowledgeDomain: KnowledgeDomainId
  /** The enduring truth beneath the capability. */
  principle: string
  /** The concrete capability the founder needs installed. */
  capability: string
  /** The situation that signals this capability is not yet installed. */
  appliesWhen: string
  /** A plain, testable rule for whether to install this now. */
  decisionRule: string
  /** Observable signals that this capability is (or isn't) in place. */
  leadingIndicators: string[]
  /** Business Stages™ during which this capability should be installed. */
  businessStages: BusinessStage[]
  /** The Business Stage™ this capability prepares the founder for. */
  nextReadinessStage: BusinessStage
  /** Ordered installation steps (illustrative, not exhaustive). */
  sequencing: string[]
  /** What becomes true once this capability is installed. */
  expectedOutcome: string
  evidenceLevel: EvidenceLevel
  sourceType: KnowledgeSourceType
  /** Present only when `sourceType` draws on external practice research. */
  externalSource?: ExternalSourceAttribution
  /** Known boundaries or caveats on this capability (display only). */
  limitations?: string[]
  /** Business Models™ this capability applies to (architecture hook). */
  businessModels: BusinessModelId[] | "all"
  /** Industries this capability applies to (architecture hook, freeform). */
  industries: string[] | "all"

  /* -- Cross-references (ids only — knowledge is never duplicated) ------- */
  businessConcepts: string[]
  relatedExecutives: string[]
  relatedAdvisors: string[]
  relatedAcademyItems: string[]
  relatedDeliverables: string[]
  relatedOperatingSegments: string[]
  /** Excellence Intelligence Engine™ `KnowledgeObject` ids this grounds in. */
  relatedKnowledgeObjects: string[]
  /** Other Readiness Capability™ ids this sequences with or follows. */
  relatedPractices: string[]

  status: ExcellenceStatus

  /* -- Business Capability Registry™ extension (Phase 9C, all optional) -
   * Additive only — every field below is optional so the seeded set above
   * keeps compiling untouched. Populated where the existing capability
   * content already implies an answer; left undefined where it would
   * otherwise be invented.
   * ----------------------------------------------------------------------- */

  /** The concrete installation objective — what "done" looks like, plainly stated. */
  installationObjective?: string
  /** The real decisions a founder must make to install this capability. */
  requiredDecisions?: string[]
  /** The concrete artifacts/assets that must exist once installed (documents, SOPs, dashboards, etc.). */
  requiredAssets?: string[]
  /**
   * Business Asset Outcome Registry™ ids (from asset-registry.ts) that
   * `requiredAssets` corresponds to, where a confident match exists.
   * `requiredAssets` stays free-text prose for display — this is the typed
   * cross-reference, populated only when unambiguous, left unset otherwise.
   */
  relatedBusinessAssetIds?: string[]
  /** The roles (founder, team, or otherwise) that must exist or act for this to be installed. */
  requiredRoles?: string[]
  /**
   * Who owns this capability day-to-day once installed. Reuses the
   * Executive Decision Engine's `LeverageClassId` — no parallel ownership
   * vocabulary.
   */
  ownership?: { founder: string; team?: string; ai?: string; leverageClass: LeverageClassId }
  /** Measurable outcomes that indicate the capability is working — distinct from `leadingIndicators`, which signals installation, not performance. */
  successMetrics?: string[]
  /** Common ways this capability fails or degrades even after installation. */
  failureModes?: string[]
  /** Conditions under which this capability should NOT be recommended. */
  contraindications?: string[]
  /**
   * The evidence-provenance axis: how this specific capability's content was
   * produced. Distinct from the existing display-only `evidenceLevel`, which
   * grades confidence, not origin.
   */
  evidenceClassification?: "established" | "adapted" | "generated" | "founder-specific"
  /** Readiness Capability™ ids that should be installed before this one. */
  prerequisiteCapabilityIds?: string[]
  /** Readiness Capability™ ids this capability unlocks or makes easier once installed. */
  enablesCapabilityIds?: string[]
  /**
   * Business Model Profile™ (Phase 9B) characteristics this capability is
   * especially relevant to. Optional — absence means the capability applies
   * regardless of operating characteristics, same as `businessModels: "all"`.
   */
  applicableCharacteristics?: Partial<{
    customerModel: CustomerModelId[]
    revenueModel: RevenueModelId[]
    deliveryModel: DeliveryModelId[]
    acquisitionModel: AcquisitionModelId[]
  }>
}

/* ===========================================================================
 * The canonical Readiness Capabilities™
 * ---------------------------------------------------------------------------
 * A representative, well-connected seed set — not an exhaustive checklist.
 * Every id referenced below already exists in a connected registry.
 * ======================================================================== */

export const READINESS_CAPABILITIES: ReadinessCapability[] = [
  /* --- Start Readiness™ (prepares Launch™ → Growth™) ------------------- */
  {
    id: "start-customer-clarity",
    title: "Customer Clarity Before Growth",
    readinessDomain: "start-readiness",
    knowledgeDomain: "enduring-business-principles",
    principle: "A business that knows exactly who it serves grows on purpose, not by accident.",
    capability: "A validated, specific description of the ideal customer the business is built for.",
    appliesWhen: "The founder cannot yet describe their best customer in one clear sentence.",
    decisionRule:
      "If the founder cannot name their top customer's three defining characteristics, install this before adding new offers or spend.",
    leadingIndicators: [
      "Can describe the ideal customer in one sentence",
      "A repeat referral pattern already exists",
    ],
    businessStages: ["launch"],
    nextReadinessStage: "growth",
    sequencing: [
      "Review the last five real clients",
      "Document what they shared in common",
      "Write one clear sentence describing the ideal customer",
    ],
    expectedOutcome: "Every future offer and message can be pointed at one clear customer, not a guess.",
    evidenceLevel: "well-established",
    sourceType: "enduring-principle",
    businessModels: "all",
    industries: "all",
    businessConcepts: ["customer-lifetime-value"],
    relatedExecutives: ["strategy", "sales"],
    relatedAdvisors: [],
    relatedAcademyItems: ["insight-pricing-fundamentals"],
    relatedDeliverables: ["strategic-plan"],
    relatedOperatingSegments: ["reality-check"],
    relatedKnowledgeObjects: ["principle-pareto-8020"],
    relatedPractices: ["start-offer-clarity"],
    status: "architecture",
    installationObjective: "A written, one-sentence description of the ideal customer that the founder can recite without checking notes.",
    requiredDecisions: ["Which of the last five real clients best represent who to build for going forward"],
    requiredAssets: ["A one-sentence ideal customer description"],
    requiredRoles: ["founder"],
    ownership: { founder: "Defines and maintains the ideal customer description.", leverageClass: "keep" },
    successMetrics: ["New offers and messages are written with a specific customer in mind, not a general audience"],
    failureModes: ["The description is written once and never revisited as the customer base evolves"],
    contraindications: ["The founder has fewer than five real clients — describe from direct conversations instead of inferring a pattern that doesn't exist yet"],
    evidenceClassification: "established",
    enablesCapabilityIds: ["start-offer-clarity"],
  },
  {
    id: "start-offer-clarity",
    title: "Offer Clarity Before Growth",
    readinessDomain: "start-readiness",
    knowledgeDomain: "enduring-business-principles",
    principle: "One offer, well understood, outperforms many offers vaguely explained.",
    capability: "A single core offer described simply enough to sell without lengthy explanation.",
    appliesWhen: "The founder is selling several variations of an idea rather than one clear offer.",
    decisionRule: "If a new customer needs more than one sentence to understand the offer, simplify before scaling it.",
    leadingIndicators: ["The offer can be explained in one sentence", "Customers repeat the offer's value back accurately"],
    businessStages: ["launch"],
    nextReadinessStage: "growth",
    sequencing: ["List every current variation of the offer", "Identify the version that sells fastest", "Retire or fold in the rest"],
    expectedOutcome: "A single, sellable offer that Growth™-stage systems can be built around.",
    evidenceLevel: "foundational",
    sourceType: "enduring-principle",
    businessModels: "all",
    industries: "all",
    businessConcepts: ["margin", "gross-profit"],
    relatedExecutives: ["strategy", "finance"],
    relatedAdvisors: [],
    relatedAcademyItems: ["insight-understanding-margin"],
    relatedDeliverables: ["strategic-plan"],
    relatedOperatingSegments: ["design-tomorrow"],
    relatedKnowledgeObjects: ["principle-pareto-8020", "principle-financial-discipline"],
    relatedPractices: ["start-customer-clarity", "start-pricing-clarity"],
    status: "architecture",
    installationObjective: "A single core offer that can be explained, and repeated back accurately, in one sentence.",
    requiredDecisions: ["Which current variation of the offer sells fastest and should become the single core offer"],
    requiredAssets: ["A one-sentence offer description"],
    requiredRoles: ["founder"],
    ownership: { founder: "Decides which offer variation to keep and retires the rest.", leverageClass: "keep" },
    successMetrics: ["Customers can repeat the offer's value back accurately without a lengthy explanation"],
    failureModes: ["Old variations quietly creep back in because they were never formally retired"],
    contraindications: [],
    evidenceClassification: "established",
    prerequisiteCapabilityIds: ["start-customer-clarity"],
    enablesCapabilityIds: ["start-pricing-clarity"],
  },
  {
    id: "start-pricing-clarity",
    title: "Pricing Clarity Before Volume",
    readinessDomain: "start-readiness",
    knowledgeDomain: "enduring-business-principles",
    principle: "Price is a statement of value, not a reaction to fear.",
    capability: "Pricing set from margin math, reviewed on a rhythm — not from anxiety or guesswork.",
    appliesWhen: "Prices were set once, early, and have not been revisited against real costs and margin.",
    decisionRule: "If margin has never been calculated for the core offer, resolve pricing before pursuing volume.",
    leadingIndicators: ["Margin is known and reviewed", "Price changes are deliberate, not reactive"],
    businessStages: ["launch"],
    nextReadinessStage: "growth",
    sequencing: ["Calculate true margin on the core offer", "Compare price against the value delivered", "Set a review rhythm for pricing"],
    expectedOutcome: "Pricing that can support Growth™-stage systems instead of eroding under volume.",
    evidenceLevel: "foundational",
    sourceType: "enduring-principle",
    businessModels: "all",
    industries: "all",
    businessConcepts: ["margin", "gross-profit"],
    relatedExecutives: ["finance"],
    relatedAdvisors: [],
    relatedAcademyItems: ["insight-pricing-fundamentals", "insight-understanding-margin"],
    relatedDeliverables: ["annual-budget"],
    relatedOperatingSegments: ["ceo-workday"],
    relatedKnowledgeObjects: ["principle-financial-discipline"],
    relatedPractices: ["start-offer-clarity"],
    status: "architecture",
    installationObjective: "Known, calculated margin on the core offer, with a set rhythm for reviewing price against it.",
    requiredDecisions: ["What the true margin is on the core offer", "How often price will be reviewed going forward"],
    requiredAssets: ["A margin calculation for the core offer", "A pricing review rhythm"],
    requiredRoles: ["founder"],
    ownership: { founder: "Sets and reviews pricing against real margin.", leverageClass: "keep" },
    successMetrics: ["Margin is known at all times, not recalculated from scratch under pressure"],
    failureModes: ["Pricing is changed reactively in response to a single lost sale rather than on the review rhythm"],
    contraindications: [],
    evidenceClassification: "established",
    prerequisiteCapabilityIds: ["start-offer-clarity"],
  },
  {
    id: "start-foundational-operating-rhythm",
    title: "A Foundational Operating Rhythm Before Delegation",
    readinessDomain: "start-readiness",
    knowledgeDomain: "executive-practice-patterns",
    principle: "Cadence beats intensity, even for a business of one.",
    capability: "A simple, installed weekly rhythm the business runs on — before anyone else is added to it.",
    appliesWhen: "The week is reactive rather than designed; there is no repeatable rhythm to hand to a future hire.",
    decisionRule: "If the founder's week has no repeatable structure, install one before delegating any part of it.",
    leadingIndicators: ["A weekly rhythm exists and is followed", "The founder can describe the rhythm without checking notes"],
    businessStages: ["launch"],
    nextReadinessStage: "growth",
    sequencing: ["Install Sunday Design Day™", "Run the designed week for four consecutive weeks", "Note what should be handed off next"],
    expectedOutcome: "A rhythm stable enough that Growth™-stage delegation has something real to hand off.",
    evidenceLevel: "well-established",
    sourceType: "practice-pattern",
    businessModels: "all",
    industries: "all",
    businessConcepts: ["operating-rule", "capacity-planning"],
    relatedExecutives: ["operations"],
    relatedAdvisors: [],
    relatedAcademyItems: ["insight-designing-meetings"],
    relatedDeliverables: ["meeting-rules"],
    relatedOperatingSegments: ["reality-check", "design-tomorrow", "commit-prepare"],
    relatedKnowledgeObjects: ["pattern-operating-rhythm", "methodology-sunday-design-day"],
    relatedPractices: ["growth-sop-before-hiring"],
    status: "architecture",
    installationObjective: "A repeatable weekly rhythm, run for four consecutive weeks, that the founder can describe without checking notes.",
    requiredDecisions: ["What Sunday Design Day™ will cover each week"],
    requiredAssets: ["A documented weekly rhythm"],
    requiredRoles: ["founder"],
    ownership: { founder: "Designs and runs the weekly rhythm.", leverageClass: "keep" },
    successMetrics: ["The rhythm runs for four consecutive weeks without being skipped"],
    failureModes: ["The rhythm is designed once but abandoned the first busy week"],
    contraindications: [],
    evidenceClassification: "established",
    enablesCapabilityIds: ["growth-sop-before-hiring"],
  },

  /* --- Growth Readiness™ (prepares Growth™ → Scale™) ------------------- */
  {
    id: "growth-sop-before-hiring",
    title: "Systems Before the Next Hire",
    readinessDomain: "growth-readiness",
    knowledgeDomain: "enduring-business-principles",
    principle: "Document the repeatable work before delegating it, or you delegate the confusion too.",
    capability: "Standard operating procedures exist for the top repeatable tasks before hiring for them.",
    appliesWhen: "A hire is being planned for work that has never been written down.",
    decisionRule: "If a task has no SOP, write it before posting the role that will own it.",
    leadingIndicators: ["Top repeatable tasks have a written SOP", "A new hire could follow the SOP without the founder present"],
    businessStages: ["growth"],
    nextReadinessStage: "scale",
    sequencing: ["List the top five repeatable tasks", "Write a simple SOP for each", "Test the SOP with someone unfamiliar with the task"],
    expectedOutcome: "New hires add leverage to a documented system instead of inheriting undocumented chaos.",
    evidenceLevel: "well-established",
    sourceType: "enduring-principle",
    businessModels: "all",
    industries: "all",
    businessConcepts: ["sop", "delegation"],
    relatedExecutives: ["operations"],
    relatedAdvisors: [],
    relatedAcademyItems: ["insight-delegation"],
    relatedDeliverables: ["onboarding-checklist", "job-description"],
    relatedOperatingSegments: ["download-delegate"],
    relatedKnowledgeObjects: ["principle-systems-before-complexity", "research-cognitive-load-and-delegation"],
    relatedPractices: ["start-foundational-operating-rhythm", "growth-delegation-capacity"],
    status: "architecture",
    installationObjective: "A written SOP for each of the top five repeatable tasks, tested by someone unfamiliar with the task.",
    requiredDecisions: ["Which five repeatable tasks to document first"],
  requiredAssets: ["Five written SOPs"],
  relatedBusinessAssetIds: ["standard-operating-procedure"],
  requiredRoles: ["founder", "a test reader unfamiliar with the task"],
    ownership: { founder: "Writes and validates each SOP before a hire is made.", team: "Follows the SOP once hired.", leverageClass: "delegate" },
    successMetrics: ["A new hire can follow the SOP without the founder present"],
    failureModes: ["SOPs are written but never tested with someone outside the task, so gaps surface only after hiring"],
    contraindications: [],
    evidenceClassification: "established",
    prerequisiteCapabilityIds: ["start-foundational-operating-rhythm"],
    enablesCapabilityIds: ["growth-delegation-capacity"],
  },
  {
    id: "growth-delegation-capacity",
    title: "Delegation Capacity Before Team Growth",
    readinessDomain: "growth-readiness",
    knowledgeDomain: "evidence-based-research",
    principle: "Attention is finite; protecting it is not abdication, it's leverage.",
    capability: "A clear map of what the founder keeps, and what gets handed off, before the team grows.",
    appliesWhen: "The founder is still personally doing work that a documented system could carry.",
    decisionRule: "If the founder cannot name what they will stop doing this quarter, delegation capacity is not yet ready.",
    leadingIndicators: ["The founder can name what they've stopped doing", "Handed-off work is still getting done to standard"],
    businessStages: ["growth"],
    nextReadinessStage: "scale",
    sequencing: ["List everything the founder does in a typical week", "Mark what only the founder can do", "Plan the handoff for everything else"],
    expectedOutcome: "The founder's capacity is protected for judgment work as the team grows around them.",
    evidenceLevel: "well-established",
    sourceType: "research-synthesis",
    businessModels: "all",
    industries: "all",
    businessConcepts: ["delegation", "human-zone-of-genius"],
    relatedExecutives: ["people-culture", "operations"],
    relatedAdvisors: [],
    relatedAcademyItems: ["insight-delegation"],
    relatedDeliverables: ["job-description", "onboarding-checklist"],
    relatedOperatingSegments: ["download-delegate", "ceo-workday"],
    relatedKnowledgeObjects: ["research-cognitive-load-and-delegation", "pattern-protected-strategic-time"],
    relatedPractices: ["growth-sop-before-hiring", "scale-leadership-depth"],
    status: "architecture",
    installationObjective: "A clear, written map of what the founder keeps versus hands off, with the handed-off work verified still done to standard.",
    requiredDecisions: ["What the founder will stop doing this quarter"],
    requiredAssets: ["A weekly time map split into keep / hand off"],
    requiredRoles: ["founder"],
    ownership: { founder: "Decides what to keep versus delegate.", team: "Owns handed-off work.", leverageClass: "delegate" },
    successMetrics: ["Handed-off work continues to meet standard without founder involvement"],
    failureModes: ["Work is handed off without a documented standard, so quality quietly slips"],
    contraindications: [],
    evidenceClassification: "established",
    prerequisiteCapabilityIds: ["growth-sop-before-hiring"],
    enablesCapabilityIds: ["scale-leadership-depth"],
  },
  {
    id: "growth-ai-workflow-adoption",
    title: "Governed AI Workflow Adoption Before Team Scale",
    readinessDomain: "growth-readiness",
    knowledgeDomain: "harmony-lane-methodology",
    principle: "Human judgment leads; AI amplifies leverage before headcount has to.",
    capability: "At least one AI-augmented workflow is installed, trusted, and governed by the founder.",
    appliesWhen: "Every new unit of output still requires a new hour of human time.",
    decisionRule: "If no workflow yet pairs the founder with AI, install one inside the AI Augmentation Hour™ before scaling headcount to solve the same problem.",
    leadingIndicators: ["At least one AI-augmented workflow runs weekly", "The founder trusts and reviews its output"],
    businessStages: ["growth"],
    nextReadinessStage: "scale",
    sequencing: ["Identify one high-volume, judgment-light task", "Pair it with AI inside the AI Augmentation Hour™", "Review and refine weekly"],
    expectedOutcome: "Capacity grows without every unit of growth requiring a new hire.",
    evidenceLevel: "proprietary",
    sourceType: "harmony-methodology",
    businessModels: "all",
    industries: "all",
    businessConcepts: ["human-zone-of-genius", "delegation"],
    relatedExecutives: ["innovation", "operations"],
    relatedAdvisors: [],
    relatedAcademyItems: ["insight-ai-fundamentals"],
    relatedDeliverables: [],
    relatedOperatingSegments: ["ai-augmentation-hour"],
    relatedKnowledgeObjects: ["methodology-ai-augmentation-hour"],
    relatedPractices: ["future-workplace-ai-human-collaboration"],
    status: "architecture",
    installationObjective: "At least one AI-augmented workflow running weekly, with founder review built into its rhythm.",
    requiredDecisions: ["Which single high-volume, judgment-light task to pair with AI first"],
    requiredAssets: ["A documented, running AI-augmented workflow"],
    requiredRoles: ["founder"],
    ownership: { founder: "Reviews and governs the workflow's output.", ai: "Executes the paired task.", leverageClass: "automate" },
    successMetrics: ["The workflow runs weekly without the founder rebuilding it each time"],
    failureModes: ["The workflow is installed once and never reviewed, so quality drifts unnoticed"],
    contraindications: ["No task exists yet that is both high-volume and judgment-light — install the operating rhythm first"],
    evidenceClassification: "founder-specific",
    enablesCapabilityIds: ["future-workplace-ai-human-collaboration"],
  },
  {
    id: "growth-financial-visibility",
    title: "Financial Visibility Before Scaling Spend",
    readinessDomain: "growth-readiness",
    knowledgeDomain: "enduring-business-principles",
    principle: "Profit is opinion; cash is fact — especially before spend increases.",
    capability: "A reviewed budget and cash-flow rhythm exists before growth spend accelerates.",
    appliesWhen: "Spend decisions are being made faster than the numbers are being reviewed.",
    decisionRule: "If cash flow has not been reviewed this month, review it before approving new recurring spend.",
    leadingIndicators: ["Cash flow is reviewed on a set rhythm", "Burn rate is a known number, not a guess"],
    businessStages: ["growth"],
    nextReadinessStage: "scale",
    sequencing: ["Build or refresh the annual budget", "Install a monthly cash-flow review", "Tie new spend decisions to that review"],
    expectedOutcome: "Growth spend is funded by visibility, not optimism.",
    evidenceLevel: "foundational",
    sourceType: "enduring-principle",
    businessModels: "all",
    industries: "all",
    businessConcepts: ["cash-flow", "burn-rate", "margin"],
    relatedExecutives: ["finance"],
    relatedAdvisors: ["tax"],
    relatedAcademyItems: ["insight-understanding-margin"],
    relatedDeliverables: ["annual-budget", "tax-prep-checklist"],
    relatedOperatingSegments: ["ceo-workday"],
    relatedKnowledgeObjects: ["principle-financial-discipline", "pattern-leading-and-lagging-indicators"],
    relatedPractices: ["scale-executive-rhythm"],
    status: "architecture",
    installationObjective: "A refreshed annual budget and a monthly cash-flow review that new spend decisions are tied to.",
    requiredDecisions: ["What the monthly cash-flow review rhythm will be"],
    requiredAssets: ["An annual budget", "A monthly cash-flow review"],
    requiredRoles: ["founder"],
    ownership: { founder: "Reviews cash flow and approves new spend.", leverageClass: "keep" },
    successMetrics: ["Burn rate is a known number, checked before approving new recurring spend"],
    failureModes: ["Spend is approved from optimism between reviews rather than from the reviewed number"],
    contraindications: [],
    evidenceClassification: "established",
    enablesCapabilityIds: ["scale-executive-rhythm"],
  },

  /* --- Scale Readiness™ (prepares Scale™ → Legacy™) -------------------- */
  {
    id: "scale-leadership-depth",
    title: "Leadership Depth Before Legacy",
    readinessDomain: "scale-readiness",
    knowledgeDomain: "evidence-based-research",
    principle: "A business that depends only on its founder cannot yet become a legacy.",
    capability: "At least one leader beyond the founder owns outcomes, not just assigned tasks.",
    appliesWhen: "Every significant decision still routes back through the founder personally.",
    decisionRule: "If no one besides the founder owns a full outcome end-to-end, install this before pursuing Legacy™-stage plans.",
    leadingIndicators: ["At least one leader owns a full outcome without founder sign-off", "Decisions are made at more than one level"],
    businessStages: ["scale"],
    nextReadinessStage: "legacy",
    sequencing: ["Identify one outcome to fully hand off", "Select and develop the leader to own it", "Remove the founder from routine sign-off on it"],
    expectedOutcome: "The business can make sound decisions in the founder's absence.",
    evidenceLevel: "well-established",
    sourceType: "research-synthesis",
    businessModels: "all",
    industries: "all",
    businessConcepts: ["delegation", "human-zone-of-genius"],
    relatedExecutives: ["people-culture", "operations"],
    relatedAdvisors: [],
    relatedAcademyItems: ["insight-delegation"],
    relatedDeliverables: ["job-description"],
    relatedOperatingSegments: ["download-delegate"],
    relatedKnowledgeObjects: ["research-cognitive-load-and-delegation"],
    relatedPractices: ["growth-delegation-capacity", "scale-org-design"],
    status: "architecture",
    installationObjective: "At least one leader beyond the founder who owns a full outcome end-to-end without routine sign-off.",
    requiredDecisions: ["Which single outcome to fully hand off first", "Who is selected and developed to own it"],
    requiredAssets: ["A documented outcome ownership handoff"],
    requiredRoles: ["founder", "at least one non-founder leader"],
    ownership: { founder: "Removes themselves from routine sign-off on the handed-off outcome.", team: "Owns the outcome end-to-end.", leverageClass: "delegate" },
    successMetrics: ["Decisions on that outcome are made without founder sign-off"],
    failureModes: ["The leader is given the title but the founder still quietly makes the real decisions"],
    contraindications: [],
    evidenceClassification: "established",
    prerequisiteCapabilityIds: ["growth-delegation-capacity"],
    enablesCapabilityIds: ["scale-org-design"],
  },
  {
    id: "scale-org-design",
    title: "Organizational Design Before Complexity Compounds",
    readinessDomain: "scale-readiness",
    knowledgeDomain: "enduring-business-principles",
    principle: "Structure should be designed on purpose, not discovered by accident.",
    capability: "A documented organizational design with clear roles, ownership, and reporting lines.",
    appliesWhen: "Roles and reporting lines have grown organically and are no longer clear to the team.",
    decisionRule: "If two team members would describe the reporting structure differently, redesign it before adding more people.",
    leadingIndicators: ["Roles and reporting lines are documented", "New hires understand structure without asking"],
    businessStages: ["scale"],
    nextReadinessStage: "legacy",
    sequencing: ["Document current roles and reporting lines as they actually are", "Redesign for clarity, not just history", "Communicate the design to the full team"],
    expectedOutcome: "Complexity is absorbed by intentional structure instead of accumulating as confusion.",
    evidenceLevel: "well-established",
    sourceType: "enduring-principle",
    businessModels: "all",
    industries: "all",
    businessConcepts: ["operating-rule", "sop"],
    relatedExecutives: ["operations", "people-culture"],
    relatedAdvisors: ["compliance"],
    relatedAcademyItems: ["insight-designing-meetings"],
    relatedDeliverables: ["meeting-rules", "compliance-checklist"],
    relatedOperatingSegments: ["reality-check"],
    relatedKnowledgeObjects: ["principle-systems-before-complexity"],
    relatedPractices: ["scale-leadership-depth", "future-workplace-human-sustainability-standard"],
    status: "architecture",
    installationObjective: "A documented organizational design that any two team members would describe the same way.",
    requiredDecisions: ["What the redesigned reporting structure should be, not just what it has organically become"],
    requiredAssets: ["A documented org design with roles, ownership, and reporting lines"],
    requiredRoles: ["founder", "the full team"],
    ownership: { founder: "Designs and communicates the structure.", team: "Operates within it.", leverageClass: "keep" },
    successMetrics: ["New hires understand the structure without asking"],
    failureModes: ["The design is documented once but never updated as the team grows, so it silently goes stale again"],
    contraindications: [],
    evidenceClassification: "established",
    prerequisiteCapabilityIds: ["scale-leadership-depth"],
    enablesCapabilityIds: ["future-workplace-human-sustainability-standard"],
  },
  {
    id: "scale-executive-rhythm",
    title: "Executive Rhythm & KPI Discipline",
    readinessDomain: "scale-readiness",
    knowledgeDomain: "executive-practice-patterns",
    principle: "Leading and lagging indicators, reviewed on a rhythm, turn strategy into feedback.",
    capability: "An installed KPI review rhythm shared across the leadership team, not just the founder.",
    appliesWhen: "Leadership meetings review outcomes only after the fact, with no shared leading indicators.",
    decisionRule: "If the leadership team cannot name the leading indicators they steer by, install a shared KPI rhythm before adding more leaders.",
    leadingIndicators: ["The leadership team reviews the same KPIs on a set cadence", "Leading indicators are tracked, not only lagging ones"],
    businessStages: ["scale"],
    nextReadinessStage: "legacy",
    sequencing: ["Select a small set of leading and lagging indicators", "Install a recurring leadership review", "Tie decisions to what the indicators show"],
    expectedOutcome: "Leadership steers by shared, current information instead of the founder's individual read.",
    evidenceLevel: "well-established",
    sourceType: "practice-pattern",
    businessModels: "all",
    industries: "all",
    businessConcepts: ["cash-flow", "customer-lifetime-value"],
    relatedExecutives: ["finance", "growth"],
    relatedAdvisors: [],
    relatedAcademyItems: ["insight-pricing-fundamentals"],
    relatedDeliverables: ["annual-budget", "strategic-plan"],
    relatedOperatingSegments: ["ceo-workday", "reality-check"],
    relatedKnowledgeObjects: ["pattern-leading-and-lagging-indicators"],
    relatedPractices: ["growth-financial-visibility", "scale-exit-readiness-foundations"],
    status: "architecture",
    installationObjective: "A recurring leadership KPI review shared across the leadership team, tracking leading and lagging indicators together.",
    requiredDecisions: ["Which small set of leading and lagging indicators the leadership team will steer by"],
  requiredAssets: ["A recurring leadership review with a shared KPI set"],
  relatedBusinessAssetIds: ["financial-dashboard"],
  requiredRoles: ["founder", "leadership team"],
    ownership: { founder: "Installs the rhythm.", team: "Shares accountability for the reviewed KPIs.", leverageClass: "delegate" },
    successMetrics: ["The leadership team reviews the same KPIs on a set cadence, not only after the fact"],
    failureModes: ["Only lagging indicators are tracked, so problems surface after they're already unrecoverable"],
    contraindications: [],
    evidenceClassification: "established",
    prerequisiteCapabilityIds: ["growth-financial-visibility"],
    enablesCapabilityIds: ["scale-exit-readiness-foundations"],
  },
  {
    id: "scale-exit-readiness-foundations",
    title: "Exit-Readiness Foundations",
    readinessDomain: "scale-readiness",
    knowledgeDomain: "enduring-business-principles",
    principle: "Optionality — to sell, to hand down, or to keep building — is built years before it is used.",
    capability: "Financials, contracts, and intellectual property clean enough to survive real due diligence.",
    appliesWhen: "Financial records, contracts, or IP ownership have never been reviewed with a future transaction in mind.",
    decisionRule: "If the business could not survive a due-diligence review today, begin cleaning up records now, regardless of exit timing.",
    leadingIndicators: ["Financial records are clean and current", "Key contracts and IP ownership are documented and clear"],
    businessStages: ["scale"],
    nextReadinessStage: "legacy",
    sequencing: ["Review financial records for completeness and accuracy", "Confirm contracts and IP ownership are documented", "Address gaps with legal and tax counsel"],
    expectedOutcome: "The founder keeps every option open — sale, succession, or continued ownership — instead of foreclosing them by neglect.",
    evidenceLevel: "well-established",
    sourceType: "enduring-principle",
    externalSource: {
      sourceCategory: "operator-practice-research",
      sourceDescriptor: "Publicly available small-business succession and exit-planning research literature.",
      retrievedPrinciple: "Businesses that maintain clean financial and legal records continuously face far fewer surprises when a transition — planned or unplanned — arrives.",
    },
    businessModels: "all",
    industries: "all",
    businessConcepts: ["margin", "gross-profit"],
    relatedExecutives: ["finance", "strategy"],
    relatedAdvisors: ["tax"],
    relatedAcademyItems: [],
    relatedDeliverables: ["annual-budget", "tax-prep-checklist"],
    relatedOperatingSegments: ["ceo-workday"],
    relatedKnowledgeObjects: ["principle-financial-discipline"],
    relatedPractices: ["scale-executive-rhythm"],
    status: "architecture",
    installationObjective: "Financial records, contracts, and IP ownership clean enough to survive a real due-diligence review today.",
    requiredDecisions: ["Which gaps in financial records, contracts, or IP ownership to address first"],
    requiredAssets: ["Clean, current financial records", "Documented contracts and IP ownership"],
    requiredRoles: ["founder", "legal counsel", "tax advisor"],
    ownership: { founder: "Initiates and oversees the cleanup.", leverageClass: "delegate" },
    successMetrics: ["The business could survive a due-diligence review at any time, not only when a transaction is imminent"],
    failureModes: ["Cleanup is deferred until a transaction is already underway, when there is no longer time to fix real gaps"],
    contraindications: [],
    evidenceClassification: "adapted",
    prerequisiteCapabilityIds: ["scale-executive-rhythm"],
  },

  /* --- Future Workplace Readiness™ (extends Scale™/Legacy™) ------------ */
  {
    id: "future-workplace-human-sustainability-standard",
    title: "Human Sustainability™ as an Organizational Standard",
    readinessDomain: "future-workplace-readiness",
    knowledgeDomain: "harmony-lane-methodology",
    principle: "The standard the founder lives by only becomes a legacy once the organization lives by it too.",
    capability: "Human Sustainability™ practices exist as organizational design, not only on the founder's own calendar.",
    appliesWhen: "Balance and recovery are things the founder practices personally but has not designed into the team's operating model.",
    decisionRule: "If Human Sustainability™ practices exist only for the founder, extend them into team design before Legacy™-stage planning.",
    leadingIndicators: ["Team members have designed recovery, not just the founder", "Wellbeing is reviewed as an operating metric, not an afterthought"],
    businessStages: ["scale", "legacy"],
    nextReadinessStage: "legacy",
    sequencing: ["Audit which Human Sustainability™ practices exist only for the founder", "Design an equivalent for the team", "Review it on the same rhythm as financial KPIs"],
    expectedOutcome: "A workplace that sustains the humans building it at every level, not just at the top.",
    evidenceLevel: "well-established",
    sourceType: "external-practice-synthesis",
    externalSource: {
      sourceCategory: "industry-body-research",
      sourceDescriptor: "Publicly published occupational-wellbeing and workplace-design research from established industry research bodies.",
      retrievedPrinciple: "Sustainable performance at an organizational level depends on designed recovery and boundaries, not individual willpower alone.",
    },
    limitations: ["Generalized from broad workplace-wellbeing research, not a clinical or individualized assessment."],
    businessModels: "all",
    industries: "all",
    businessConcepts: ["human-zone-of-genius", "capacity-planning"],
    relatedExecutives: ["people-culture", "client-success"],
    relatedAdvisors: [],
    relatedAcademyItems: ["insight-human-sustainability-basics"],
    relatedDeliverables: [],
    relatedOperatingSegments: ["morning-given", "movement", "lunch", "time-freedom", "power-down"],
    relatedKnowledgeObjects: ["methodology-human-sustainability", "research-progress-principle"],
    relatedPractices: ["scale-org-design", "future-workplace-ai-human-collaboration"],
    status: "architecture",
    installationObjective: "Human Sustainability™ practices designed for the team, reviewed on the same rhythm as financial KPIs.",
    requiredDecisions: ["Which founder-only Human Sustainability™ practices to extend into team design first"],
    requiredAssets: ["A documented team-level Human Sustainability™ standard"],
    requiredRoles: ["founder", "people & culture leadership"],
    ownership: { founder: "Sponsors the standard.", team: "Lives the standard day-to-day.", leverageClass: "delegate" },
    successMetrics: ["Wellbeing is reviewed as an operating metric alongside financial KPIs"],
    failureModes: ["The standard is announced but never reviewed, so it quietly reverts to founder-only practice"],
    contraindications: [],
    evidenceClassification: "adapted",
    prerequisiteCapabilityIds: ["scale-org-design"],
    enablesCapabilityIds: ["future-workplace-ai-human-collaboration"],
  },
  {
    id: "future-workplace-ai-human-collaboration",
    title: "Governed AI-Human Collaboration at Organizational Scale",
    readinessDomain: "future-workplace-readiness",
    knowledgeDomain: "harmony-lane-methodology",
    principle: "AI should extend every team member's Human Zone of Genius™, not only the founder's.",
    capability: "Documented governance for how the whole team — not only the founder — uses AI.",
    appliesWhen: "AI augmentation is something the founder practices personally but has not extended, or governed, across the team.",
    decisionRule: "If AI workflows exist only for the founder, design team-level governance before scaling headcount further.",
    leadingIndicators: ["More than one team member has a governed AI-augmented workflow", "AI use is reviewed the same way any operating practice is reviewed"],
    businessStages: ["scale", "legacy"],
    nextReadinessStage: "legacy",
    sequencing: ["Audit where AI augmentation already exists for the founder", "Design equivalent, governed workflows for the team", "Set a review rhythm for AI-augmented work"],
    expectedOutcome: "AI leverage compounds across the organization, always with human judgment leading.",
    evidenceLevel: "proprietary",
    sourceType: "harmony-methodology",
    businessModels: "all",
    industries: "all",
    businessConcepts: ["human-zone-of-genius", "delegation"],
    relatedExecutives: ["innovation", "people-culture"],
    relatedAdvisors: [],
    relatedAcademyItems: ["insight-ai-fundamentals"],
    relatedDeliverables: [],
    relatedOperatingSegments: ["ai-augmentation-hour"],
    relatedKnowledgeObjects: ["methodology-ai-augmentation-hour"],
    relatedPractices: ["growth-ai-workflow-adoption", "future-workplace-human-sustainability-standard"],
    status: "architecture",
    installationObjective: "Documented, governed AI-human collaboration for more than one team member, reviewed on a set rhythm.",
    requiredDecisions: ["Which founder-only AI workflows to design equivalent, governed versions of for the team"],
    requiredAssets: ["Documented AI governance covering the whole team"],
    requiredRoles: ["founder", "team members using AI-augmented workflows"],
    ownership: { founder: "Sets governance and reviews team AI use.", team: "Operates governed AI-augmented workflows.", ai: "Executes paired tasks under human review.", leverageClass: "automate" },
    successMetrics: ["More than one team member has a governed AI-augmented workflow"],
    failureModes: ["AI use spreads across the team without governance, so quality and judgment leadership erode"],
    contraindications: ["No AI-augmented workflow yet exists for the founder — install growth-ai-workflow-adoption first"],
    evidenceClassification: "founder-specific",
    prerequisiteCapabilityIds: ["growth-ai-workflow-adoption", "future-workplace-human-sustainability-standard"],
  },
]

const READINESS_CAPABILITY_BY_ID = new Map<string, ReadinessCapability>(READINESS_CAPABILITIES.map((c) => [c.id, c]))

export function getReadinessCapability(id: string): ReadinessCapability | undefined {
  return READINESS_CAPABILITY_BY_ID.get(id)
}

/** All Readiness Capabilities™ belonging to a given domain, in registry order. */
export function getReadinessCapabilitiesByDomain(domain: ReadinessDomainId): ReadinessCapability[] {
  return READINESS_CAPABILITIES.filter((c) => c.readinessDomain === domain)
}

/** All Readiness Capabilities™ to install DURING a given Business Stage™. */
export function getReadinessCapabilitiesForStage(stage: BusinessStage): ReadinessCapability[] {
  return READINESS_CAPABILITIES.filter((c) => c.businessStages.includes(stage))
}
