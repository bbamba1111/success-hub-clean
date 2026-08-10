/**
 * Entrepreneur Success Assessment™ — Canonical Registry (Phase 6.0)
 * ---------------------------------------------------------------------------
 * The SINGLE SOURCE OF TRUTH for the Entrepreneur Success Assessment™.
 *
 * Architecture rules:
 *   - This file is DATA-ONLY. No rendering, no scoring, no recommendation logic.
 *   - Every id is stable — safe for routing, Supabase storage, and analytics.
 *   - Every object cross-references its peers by id only — data is NEVER
 *     duplicated between registries.
 *   - The registry is designed to grow (add pillars, practices, questions)
 *     WITHOUT requiring architectural redesign.
 *   - Business-model-specific content is NEVER hardcoded — it arrives via
 *     context adaptation in future phases.
 *
 * Built to serve any founder — from a child with a lemonade stand, to a solo
 * coach, to a local restaurant owner, to the founder of a billion-dollar
 * company — using the same universal operating principles, adapted through
 * context rather than hardcoded workflows.
 */

import { ALL_BUSINESS_STAGES } from "@/lib/business-stage/business-stage"
import { ALL_COMMUNICATION_STYLES } from "@/lib/business-comprehension/business-comprehension"
import { SUPPORTED_LANGUAGES } from "@/lib/i18n/language"
import type {
  OperatingPillar,
  OperatingPractice,
  AssessmentQuestion,
  BusinessModel,
  BusinessPerformanceMetric,
  GpsOutcomeDefinition,
} from "./types"

/** Convenience constant: all language codes without drift. */
const ALL_LANGUAGES = SUPPORTED_LANGUAGES.map((l) => l.code)

/* ===========================================================================
 * Founder GPS™ — Three Permanent Outcomes
 * ======================================================================== */

export const GPS_OUTCOMES: GpsOutcomeDefinition[] = [
  {
    id: "honor-non-negotiables",
    name: "Honor Life's Non-Negotiables™",
    tagline: "Protect what matters most so business never takes life's place.",
    description:
      "Every recommendation Founder GPS™ makes is filtered first through this outcome. Sleep, health, family, relationships, movement, nutrition, Time Freedom™, and recovery are not rewards for finishing work — they are the foundation that makes excellent work possible.",
    examples: [
      "Sleep (7–9 hours, protected)",
      "Physical movement (daily)",
      "Nutrition (intentional, not reactive)",
      "Family time (scheduled, not leftover)",
      "Relationships (invested in)",
      "Time Freedom™ (5 PM evenings + 3-day weekends)",
      "Recovery (sabbath, travel, rest)",
    ],
  },
  {
    id: "build-compounding-assets",
    name: "Build Compounding Business Assets™",
    tagline: "Create things that work while you rest.",
    description:
      "Instead of completing tasks, Harmony Lane™ guides founders to create assets — outputs that generate value long after the founder stops working on them. A signature talk, a referral system, or an AI workflow is worth more than any single client call completed.",
    examples: [
      "Signature Talks™",
      "Evergreen Webinars™",
      "Referral Systems™",
      "Partnership Systems™",
      "Sales Systems™",
      "Hiring Systems™",
      "SOPs™",
      "AI Workflows™",
      "Books™",
      "Intellectual Property™",
      "Templates™",
      "Frameworks™",
    ],
  },
  {
    id: "reduce-execution-friction",
    name: "Reduce Execution Friction™",
    tagline: "How can next week become easier than this week?",
    description:
      "Every recommendation asks: how does this make the next execution cycle easier? Delegation, automation, AI, templates, checklists, decision frameworks, and standard operating procedures are not optional overhead — they are the compounding return on operating intelligence.",
    examples: [
      "Business Operating Rules™",
      "Delegation systems",
      "Automation workflows",
      "AI assistants",
      "Decision frameworks",
      "SOPs",
      "Checklists",
      "Templates",
    ],
  },
]

/* ===========================================================================
 * Operating Pillars™
 * ---------------------------------------------------------------------------
 * Eight permanent pillars. Every founder operates in all eight — what changes
 * is emphasis, not presence. Pillar order reflects the natural business-build arc.
 * ======================================================================== */

export const OPERATING_PILLARS: OperatingPillar[] = [
  {
    id: "strategic-foundation",
    name: "Strategic Foundation™",
    tagline: "The clarity that makes every other decision easier.",
    description:
      "The documented thinking behind the business — vision, mission, positioning, offer architecture, and decision frameworks. Without this foundation every decision is harder and slower than it needs to be.",
    excellenceStatement:
      "A founder with a strong Strategic Foundation™ makes decisions confidently, rarely revisits settled questions, and can communicate their unique value in one sentence.",
    owningExecutives: ["strategy"],
    primaryStages: ["launch", "growth", "scale", "legacy"],
    status: "active",
  },
  {
    id: "revenue-engine",
    name: "Revenue Engine™",
    tagline: "The system that creates predictable income.",
    description:
      "The marketing and sales practices that generate consistent, predictable revenue — without requiring the founder to reinvent the wheel each month. Visibility, lead generation, and conversion working as a repeatable system.",
    excellenceStatement:
      "A founder with a strong Revenue Engine™ knows exactly where their next client will come from and has systems working while they sleep.",
    owningExecutives: ["marketing-brand", "sales"],
    primaryStages: ["launch", "growth", "scale", "legacy"],
    status: "active",
  },
  {
    id: "operations-systems",
    name: "Operations & Systems™",
    tagline: "The infrastructure that creates capacity.",
    description:
      "The SOPs, delegation systems, automation workflows, and AI integrations that turn the founder's heroics into repeatable, scalable systems. Operations excellence is the primary lever for growth without burnout.",
    excellenceStatement:
      "A founder with strong Operations & Systems™ can step away for a week and the business keeps running — because the systems carry the repeatable work.",
    owningExecutives: ["operations", "innovation"],
    primaryStages: ["growth", "scale", "legacy"],
    status: "active",
  },
  {
    id: "financial-intelligence",
    name: "Financial Intelligence™",
    tagline: "The numbers that keep the business healthy.",
    description:
      "The financial practices that keep the business solvent, profitable, and growing — pricing discipline, cash flow awareness, margin management, and regular financial review rhythms.",
    excellenceStatement:
      "A founder with strong Financial Intelligence™ reviews their numbers on a rhythm, prices confidently, and never discovers a cash problem by accident.",
    owningExecutives: ["finance"],
    primaryStages: ["launch", "growth", "scale", "legacy"],
    status: "active",
  },
  {
    id: "people-leadership",
    name: "People & Leadership™",
    tagline: "The human infrastructure that scales the vision.",
    description:
      "The hiring, team development, culture, and leadership practices that build a healthy founder-led organization — grounded in Human Sustainability™ so growth never comes at the cost of the people doing the work.",
    excellenceStatement:
      "A founder with strong People & Leadership™ has a team that is clear, motivated, and capable — and the founder has the capacity to lead rather than just manage.",
    owningExecutives: ["people-culture"],
    primaryStages: ["growth", "scale", "legacy"],
    status: "active",
  },
  {
    id: "client-excellence",
    name: "Client Excellence™",
    tagline: "The experience that earns loyalty and referrals.",
    description:
      "The client journey, onboarding, delivery, retention, and community practices that create remarkable experiences — not just satisfied customers, but raving advocates who refer and return.",
    excellenceStatement:
      "A founder with strong Client Excellence™ has clients who feel genuinely cared for, achieve real outcomes, and bring others along — creating a self-sustaining growth flywheel.",
    owningExecutives: ["client-success"],
    primaryStages: ["launch", "growth", "scale", "legacy"],
    status: "active",
  },
  {
    id: "growth-innovation",
    name: "Growth & Innovation™",
    tagline: "The capability that creates the next chapter.",
    description:
      "The leadership development, thought leadership, AI adoption, and strategic innovation practices that ensure the founder and business keep evolving — not just executing what already works.",
    excellenceStatement:
      "A founder with strong Growth & Innovation™ is consistently expanding their thinking, capabilities, and influence — and using technology responsibly to multiply their impact.",
    owningExecutives: ["growth", "innovation"],
    primaryStages: ["scale", "legacy"],
    status: "active",
  },
  {
    id: "human-sustainability",
    name: "Human Sustainability™",
    tagline: "The foundation that makes everything else possible.",
    description:
      "The personal operating practices — sleep, movement, nutrition, boundaries, recovery — that sustain the founder's health, judgment, and relationships. Without this pillar, every other pillar eventually collapses.",
    excellenceStatement:
      "A founder with strong Human Sustainability™ treats their own wellbeing as a non-negotiable business strategy — and experiences more capacity, clearer thinking, and deeper relationships as a result.",
    owningExecutives: ["people-culture"],
    primaryStages: ["launch", "growth", "scale", "legacy"],
    status: "active",
  },
]

/** O(1) lookup by id. */
const PILLAR_BY_ID = new Map(OPERATING_PILLARS.map((p) => [p.id, p]))
export function getOperatingPillar(id: string) {
  return PILLAR_BY_ID.get(id as never)
}

/* ===========================================================================
 * Operating Practices™
 * ---------------------------------------------------------------------------
 * Each practice belongs to one pillar and is assessed by one question. The
 * registry is designed to grow — add a practice by adding one object here and
 * one question below. No other files need changing.
 * ======================================================================== */

export const OPERATING_PRACTICES: OperatingPractice[] = [
  /* ── Strategic Foundation™ ────────────────────────────────────────────── */
  {
    id: "offer-clarity",
    name: "Offer Clarity™",
    pillarId: "strategic-foundation",
    tagline: "You know what you sell and why clients buy it.",
    description: "A clearly defined, compelling offer the founder can articulate in one sentence.",
    idealState: "Clients say yes quickly because the offer is clear, specific, and obviously valuable.",
    gapCost: "Sales conversations feel like convincing rather than confirming; revenue is inconsistent.",
    relatedExecutives: ["strategy", "marketing-brand"],
    relatedAdvisors: [],
    relatedAcademyItems: [],
    relatedDeliverables: ["offer-framework"],
    gpsAlignment: ["build-compounding-assets", "reduce-execution-friction"],
    primaryStages: ALL_BUSINESS_STAGES,
    communicationStyles: ALL_COMMUNICATION_STYLES,
    supportedLanguages: ALL_LANGUAGES,
    status: "active",
  },
  {
    id: "vision-direction",
    name: "Vision & Direction™",
    pillarId: "strategic-foundation",
    tagline: "You know where the business is going and why.",
    description: "A documented vision that guides decisions and inspires the team.",
    idealState: "Every major decision is filtered through the vision — fewer second-guesses, more momentum.",
    gapCost: "Decisions are reactive; it's hard to say no to opportunities that don't fit.",
    relatedExecutives: ["strategy"],
    relatedAdvisors: [],
    relatedAcademyItems: [],
    relatedDeliverables: ["strategic-plan"],
    gpsAlignment: ["build-compounding-assets"],
    primaryStages: ALL_BUSINESS_STAGES,
    communicationStyles: ALL_COMMUNICATION_STYLES,
    supportedLanguages: ALL_LANGUAGES,
    status: "active",
  },
  {
    id: "operating-rules",
    name: "Operating Rules™",
    pillarId: "strategic-foundation",
    tagline: "Your business runs by design, not by default.",
    description: "Documented rules that govern how the business operates — protecting founder capacity and standards.",
    idealState: "The founder rarely has to make the same decision twice because the rules already decided.",
    gapCost: "Energy leaks into re-deciding settled questions; inconsistency creeps into delivery and culture.",
    relatedExecutives: ["operations", "strategy"],
    relatedAdvisors: [],
    relatedAcademyItems: [],
    relatedDeliverables: ["meeting-rules"],
    gpsAlignment: ["reduce-execution-friction", "honor-non-negotiables"],
    primaryStages: ALL_BUSINESS_STAGES,
    communicationStyles: ALL_COMMUNICATION_STYLES,
    supportedLanguages: ALL_LANGUAGES,
    status: "active",
  },
  /* ── Revenue Engine™ ─────────────────────────────────────────────────── */
  {
    id: "marketing-consistency",
    name: "Marketing Consistency™",
    pillarId: "revenue-engine",
    tagline: "Ideal clients hear from you every week.",
    description: "A consistent marketing rhythm that keeps the founder visible to their ideal clients.",
    idealState: "Inbound leads arrive regularly because the founder shows up consistently, not just at launch time.",
    gapCost: "Revenue comes in feast-or-famine cycles driven by how recently the founder was visible.",
    relatedExecutives: ["marketing-brand"],
    relatedAdvisors: [],
    relatedAcademyItems: [],
    relatedDeliverables: ["content-calendar"],
    gpsAlignment: ["build-compounding-assets"],
    primaryStages: ALL_BUSINESS_STAGES,
    communicationStyles: ALL_COMMUNICATION_STYLES,
    supportedLanguages: ALL_LANGUAGES,
    status: "active",
  },
  {
    id: "sales-process",
    name: "Sales Process™",
    pillarId: "revenue-engine",
    tagline: "You have a repeatable way to convert interest into revenue.",
    description: "A defined, documented sales process the founder can follow and eventually delegate.",
    idealState: "Sales conversations feel natural and consistent; conversion rates are predictable.",
    gapCost: "Every sales conversation is improvised; closing is exhausting and inconsistent.",
    relatedExecutives: ["sales"],
    relatedAdvisors: [],
    relatedAcademyItems: [],
    relatedDeliverables: ["sales-script", "proposal"],
    gpsAlignment: ["build-compounding-assets", "reduce-execution-friction"],
    primaryStages: ALL_BUSINESS_STAGES,
    communicationStyles: ALL_COMMUNICATION_STYLES,
    supportedLanguages: ALL_LANGUAGES,
    status: "active",
  },
  {
    id: "pricing-confidence",
    name: "Pricing Confidence™",
    pillarId: "revenue-engine",
    tagline: "Your prices reflect your value.",
    description: "Pricing set with intention — based on value delivered, not what feels safe or what competitors charge.",
    idealState: "The founder states their price without apologizing and clients pay without significant resistance.",
    gapCost: "Underpricing leads to overwork; the founder resents clients they undercharged.",
    relatedExecutives: ["finance", "strategy"],
    relatedAdvisors: [],
    relatedAcademyItems: ["insight-pricing-fundamentals"],
    relatedDeliverables: ["pricing-strategy"],
    gpsAlignment: ["build-compounding-assets"],
    primaryStages: ALL_BUSINESS_STAGES,
    communicationStyles: ALL_COMMUNICATION_STYLES,
    supportedLanguages: ALL_LANGUAGES,
    status: "active",
  },
  /* ── Operations & Systems™ ────────────────────────────────────────────── */
  {
    id: "delegation-practice",
    name: "Delegation Practice™",
    pillarId: "operations-systems",
    tagline: "You regularly hand off work that doesn't require you.",
    description: "Active, consistent delegation of repeatable and non-genius tasks to others or to automation.",
    idealState: "The founder spends the majority of their work time in their Human Zone of Genius™.",
    gapCost: "The founder is the bottleneck; growth is capped by personal capacity.",
    relatedExecutives: ["operations", "people-culture"],
    relatedAdvisors: [],
    relatedAcademyItems: ["insight-delegation"],
    relatedDeliverables: ["delegation-matrix", "job-description"],
    gpsAlignment: ["reduce-execution-friction", "honor-non-negotiables"],
    primaryStages: ALL_BUSINESS_STAGES,
    communicationStyles: ALL_COMMUNICATION_STYLES,
    supportedLanguages: ALL_LANGUAGES,
    status: "active",
  },
  {
    id: "sop-documentation",
    name: "SOP Documentation™",
    pillarId: "operations-systems",
    tagline: "Repeatable work is documented so anyone can do it.",
    description: "Standard operating procedures that capture how recurring work is done — enabling delegation and consistency.",
    idealState: "New team members and AI tools can execute documented processes without the founder's involvement.",
    gapCost: "Everything depends on the founder's memory; errors increase as the team grows.",
    relatedExecutives: ["operations"],
    relatedAdvisors: [],
    relatedAcademyItems: [],
    relatedDeliverables: ["sop"],
    gpsAlignment: ["reduce-execution-friction", "build-compounding-assets"],
    primaryStages: ["growth", "scale", "legacy"],
    communicationStyles: ALL_COMMUNICATION_STYLES,
    supportedLanguages: ALL_LANGUAGES,
    status: "active",
  },
  {
    id: "ai-integration",
    name: "AI Integration™",
    pillarId: "operations-systems",
    tagline: "AI is working in your business, not just in your curiosity.",
    description: "Active use of AI tools to reduce execution friction — content, admin, research, or client-facing processes.",
    idealState: "The founder has identified their highest-leverage AI use cases and uses them consistently.",
    gapCost: "The founder works harder than necessary on tasks AI could handle, while competitors gain leverage.",
    relatedExecutives: ["innovation", "operations"],
    relatedAdvisors: [],
    relatedAcademyItems: [],
    relatedDeliverables: ["ai-workflow", "prompt-library"],
    gpsAlignment: ["reduce-execution-friction", "build-compounding-assets"],
    primaryStages: ALL_BUSINESS_STAGES,
    communicationStyles: ALL_COMMUNICATION_STYLES,
    supportedLanguages: ALL_LANGUAGES,
    status: "active",
  },
  /* ── Financial Intelligence™ ─────────────────────────────────────────── */
  {
    id: "financial-review-rhythm",
    name: "Financial Review Rhythm™",
    pillarId: "financial-intelligence",
    tagline: "You review your numbers on a consistent schedule.",
    description: "A regular, scheduled review of the business's key financial metrics.",
    idealState: "The founder is never surprised by a cash problem because numbers are reviewed before they become crises.",
    gapCost: "Financial surprises cause reactive decisions; problems compound in the silence between reviews.",
    relatedExecutives: ["finance"],
    relatedAdvisors: ["tax"],
    relatedAcademyItems: ["insight-understanding-margin"],
    relatedDeliverables: ["annual-budget", "financial-dashboard"],
    gpsAlignment: ["build-compounding-assets", "reduce-execution-friction"],
    primaryStages: ALL_BUSINESS_STAGES,
    communicationStyles: ALL_COMMUNICATION_STYLES,
    supportedLanguages: ALL_LANGUAGES,
    status: "active",
  },
  {
    id: "cash-flow-awareness",
    name: "Cash Flow Awareness™",
    pillarId: "financial-intelligence",
    tagline: "You know what's coming in, what's going out, and when.",
    description: "Active awareness of the business's cash position — not just profitability, but timing and runway.",
    idealState: "The founder can project 90 days ahead and make decisions with financial confidence.",
    gapCost: "Panic decisions get made based on last month's bank balance rather than informed projection.",
    relatedExecutives: ["finance"],
    relatedAdvisors: ["tax"],
    relatedAcademyItems: [],
    relatedDeliverables: ["forecast"],
    gpsAlignment: ["build-compounding-assets"],
    primaryStages: ALL_BUSINESS_STAGES,
    communicationStyles: ALL_COMMUNICATION_STYLES,
    supportedLanguages: ALL_LANGUAGES,
    status: "active",
  },
  /* ── People & Leadership™ ─────────────────────────────────────────────── */
  {
    id: "hiring-practice",
    name: "Hiring Practice™",
    pillarId: "people-leadership",
    tagline: "You hire intentionally when you're ready.",
    description: "A defined, intentional hiring process — rooted in role clarity, not desperation.",
    idealState: "Hires are made from a position of readiness, with clear role definitions and onboarding processes.",
    gapCost: "Reactive hiring leads to wrong-fit team members; re-hiring is expensive in time, money, and morale.",
    relatedExecutives: ["people-culture"],
    relatedAdvisors: ["legal"],
    relatedAcademyItems: [],
    relatedDeliverables: ["job-description", "hiring-plan"],
    gpsAlignment: ["build-compounding-assets", "reduce-execution-friction"],
    primaryStages: ["growth", "scale", "legacy"],
    communicationStyles: ALL_COMMUNICATION_STYLES,
    supportedLanguages: ALL_LANGUAGES,
    status: "active",
  },
  {
    id: "leadership-development",
    name: "Leadership Development™",
    pillarId: "people-leadership",
    tagline: "You invest in becoming a better leader.",
    description: "Consistent, intentional investment in the founder's own leadership growth — not just business skills.",
    idealState: "The founder communicates with clarity, handles conflict with confidence, and inspires through action.",
    gapCost: "The business eventually outgrows the founder's leadership capacity, creating a ceiling on growth.",
    relatedExecutives: ["growth", "people-culture"],
    relatedAdvisors: [],
    relatedAcademyItems: [],
    relatedDeliverables: ["leadership-plan"],
    gpsAlignment: ["build-compounding-assets"],
    primaryStages: ALL_BUSINESS_STAGES,
    communicationStyles: ALL_COMMUNICATION_STYLES,
    supportedLanguages: ALL_LANGUAGES,
    status: "active",
  },
  /* ── Client Excellence™ ──────────────────────────────────────────────── */
  {
    id: "client-onboarding",
    name: "Client Onboarding™",
    pillarId: "client-excellence",
    tagline: "Every new client knows exactly what to expect.",
    description: "A consistent, documented onboarding process that sets new clients up for early success.",
    idealState: "Every client feels welcomed, clear on next steps, and confident in their decision within 24 hours.",
    gapCost: "New clients feel confused or underwhelmed in the first days — and doubt rarely reverses.",
    relatedExecutives: ["client-success"],
    relatedAdvisors: [],
    relatedAcademyItems: [],
    relatedDeliverables: ["welcome-packet", "onboarding-checklist"],
    gpsAlignment: ["build-compounding-assets", "reduce-execution-friction"],
    primaryStages: ALL_BUSINESS_STAGES,
    communicationStyles: ALL_COMMUNICATION_STYLES,
    supportedLanguages: ALL_LANGUAGES,
    status: "active",
  },
  {
    id: "retention-referral",
    name: "Retention & Referral™",
    pillarId: "client-excellence",
    tagline: "Clients stay and bring others.",
    description: "Proactive practices that retain existing clients and generate referrals — the most sustainable growth engine.",
    idealState: "A meaningful percentage of new clients arrive through referrals from delighted existing clients.",
    gapCost: "Client acquisition costs remain high; the founder works to replace clients rather than grow them.",
    relatedExecutives: ["client-success", "sales"],
    relatedAdvisors: [],
    relatedAcademyItems: [],
    relatedDeliverables: ["feedback-survey", "client-journey"],
    gpsAlignment: ["build-compounding-assets"],
    primaryStages: ALL_BUSINESS_STAGES,
    communicationStyles: ALL_COMMUNICATION_STYLES,
    supportedLanguages: ALL_LANGUAGES,
    status: "active",
  },
  /* ── Growth & Innovation™ ─────────────────────────────────────────────── */
  {
    id: "thought-leadership",
    name: "Thought Leadership™",
    pillarId: "growth-innovation",
    tagline: "Your expertise reaches further than your client roster.",
    description: "Publishing, speaking, or creating assets that grow the founder's influence beyond direct client work.",
    idealState: "Ideal clients find the founder through their published ideas before they need to search.",
    gapCost: "The founder's influence stays invisible; growth depends entirely on active outreach.",
    relatedExecutives: ["growth", "marketing-brand"],
    relatedAdvisors: [],
    relatedAcademyItems: [],
    relatedDeliverables: ["book-outline", "signature-talk", "thought-leadership-roadmap"],
    gpsAlignment: ["build-compounding-assets"],
    primaryStages: ["growth", "scale", "legacy"],
    communicationStyles: ALL_COMMUNICATION_STYLES,
    supportedLanguages: ALL_LANGUAGES,
    status: "active",
  },
  {
    id: "continuous-learning",
    name: "Continuous Learning™",
    pillarId: "growth-innovation",
    tagline: "You invest in learning that becomes execution.",
    description: "Regular investment in acquiring knowledge and skills that immediately apply to the business.",
    idealState: "Every learning investment leads to a tangible improvement in the business within 30 days.",
    gapCost: "The founder keeps acquiring knowledge without applying it — expensive education without ROI.",
    relatedExecutives: ["growth"],
    relatedAdvisors: [],
    relatedAcademyItems: [],
    relatedDeliverables: ["course-outline"],
    gpsAlignment: ["build-compounding-assets"],
    primaryStages: ALL_BUSINESS_STAGES,
    communicationStyles: ALL_COMMUNICATION_STYLES,
    supportedLanguages: ALL_LANGUAGES,
    status: "active",
  },
  /* ── Human Sustainability™ ────────────────────────────────────────────── */
  {
    id: "protected-recovery",
    name: "Protected Recovery™",
    pillarId: "human-sustainability",
    tagline: "Rest is designed into the operating system, not squeezed out.",
    description: "Intentional, non-negotiable recovery practices — evenings, weekends, and vacations — protected by design.",
    idealState: "The founder enters each work week genuinely rested, not just less tired than the week before.",
    gapCost: "Cumulative fatigue degrades judgment, patience, creativity, and physical health — slowly, then suddenly.",
    relatedExecutives: ["people-culture"],
    relatedAdvisors: [],
    relatedAcademyItems: ["insight-human-sustainability-basics"],
    relatedDeliverables: [],
    gpsAlignment: ["honor-non-negotiables"],
    primaryStages: ALL_BUSINESS_STAGES,
    communicationStyles: ALL_COMMUNICATION_STYLES,
    supportedLanguages: ALL_LANGUAGES,
    status: "active",
  },
  {
    id: "daily-non-negotiables",
    name: "Daily Non-Negotiables™",
    pillarId: "human-sustainability",
    tagline: "Your personal operating minimums are documented and honored.",
    description: "A defined set of daily personal practices the founder protects regardless of business pressure.",
    idealState: "Even during high-pressure weeks, the founder's personal foundation stays intact.",
    gapCost: "Business pressure consistently displaces the founder's health, sleep, and relationships — compounding silently.",
    relatedExecutives: ["people-culture"],
    relatedAdvisors: [],
    relatedAcademyItems: ["insight-human-sustainability-basics"],
    relatedDeliverables: [],
    gpsAlignment: ["honor-non-negotiables", "reduce-execution-friction"],
    primaryStages: ALL_BUSINESS_STAGES,
    communicationStyles: ALL_COMMUNICATION_STYLES,
    supportedLanguages: ALL_LANGUAGES,
    status: "active",
  },
  {
    id: "boundary-practice",
    name: "Boundary Practice™",
    pillarId: "human-sustainability",
    tagline: "Work has a start time and an end time.",
    description: "Clear, honored boundaries between work and personal life — protecting family, relationships, and recovery.",
    idealState: "The founder is fully present at work during work hours and fully present in life outside them.",
    gapCost: "Work bleeds into every hour; relationships suffer; the founder is physically present but mentally elsewhere.",
    relatedExecutives: ["people-culture"],
    relatedAdvisors: [],
    relatedAcademyItems: [],
    relatedDeliverables: [],
    gpsAlignment: ["honor-non-negotiables"],
    primaryStages: ALL_BUSINESS_STAGES,
    communicationStyles: ALL_COMMUNICATION_STYLES,
    supportedLanguages: ALL_LANGUAGES,
    status: "active",
  },
]

/** O(1) lookup by id. */
const PRACTICE_BY_ID = new Map(OPERATING_PRACTICES.map((p) => [p.id, p]))
export function getOperatingPractice(id: string) {
  return PRACTICE_BY_ID.get(id)
}

/** All practices belonging to a given pillar. */
export function getPracticesForPillar(pillarId: string) {
  return OPERATING_PRACTICES.filter((p) => p.pillarId === pillarId)
}

/* ===========================================================================
 * Assessment Questions™
 * ---------------------------------------------------------------------------
 * One question per practice. Always past-tense, 7-day window, same 5-point
 * scale as the Work-Life Balance Audit™. Adding a new practice requires only
 * adding one question below — no other files change.
 * ======================================================================== */

export const ASSESSMENT_QUESTIONS: AssessmentQuestion[] = [
  /* ── Strategic Foundation™ ────────────────────────────────────────────── */
  {
    id: "q-offer-clarity",
    practiceId: "offer-clarity",
    pillarId: "strategic-foundation",
    question:
      "In the past 7 days, how often have you been able to describe your primary offer clearly and confidently in one sentence to a potential client?",
    coachingContext:
      "Offer clarity is the foundation of consistent revenue. When you can articulate what you do and for whom in one sentence, closing becomes confirming.",
    order: 1,
    status: "active",
  },
  {
    id: "q-vision-direction",
    practiceId: "vision-direction",
    pillarId: "strategic-foundation",
    question:
      "In the past 7 days, how often have you used a documented vision or long-term direction to guide your business decisions?",
    coachingContext:
      "A documented vision acts as a permanent decision filter — it says yes and no on your behalf so you don't have to keep re-deciding.",
    order: 2,
    status: "active",
  },
  {
    id: "q-operating-rules",
    practiceId: "operating-rules",
    pillarId: "strategic-foundation",
    question:
      "In the past 7 days, how often have your documented Business Operating Rules™ guided how your business actually operated?",
    coachingContext:
      "Operating Rules™ turn your best thinking into standing decisions. Every time a rule handles a situation, it frees your energy for higher-leverage work.",
    order: 3,
    status: "active",
  },
  /* ── Revenue Engine™ ─────────────────────────────────────────────────── */
  {
    id: "q-marketing-consistency",
    practiceId: "marketing-consistency",
    pillarId: "revenue-engine",
    question:
      "In the past 7 days, how often have you shown up consistently in front of your ideal clients through content, outreach, or visibility activities?",
    coachingContext:
      "Consistency compounds. Ideal clients decide to work with founders they've seen over time — not necessarily the most talented, but the most consistently present.",
    order: 1,
    status: "active",
  },
  {
    id: "q-sales-process",
    practiceId: "sales-process",
    pillarId: "revenue-engine",
    question:
      "In the past 7 days, how often have you followed a defined, repeatable process when converting interested prospects into paying clients?",
    coachingContext:
      "A repeatable sales process protects both the founder and the client — it ensures quality, consistency, and eventually, the ability to delegate.",
    order: 2,
    status: "active",
  },
  {
    id: "q-pricing-confidence",
    practiceId: "pricing-confidence",
    pillarId: "revenue-engine",
    question:
      "In the past 7 days, how often have you stated your prices confidently, without discounting or apologizing for your rates?",
    coachingContext:
      "Pricing confidence is a skill. It comes from knowing your value and trusting your offer — and it affects both revenue and the quality of clients you attract.",
    order: 3,
    status: "active",
  },
  /* ── Operations & Systems™ ────────────────────────────────────────────── */
  {
    id: "q-delegation-practice",
    practiceId: "delegation-practice",
    pillarId: "operations-systems",
    question:
      "In the past 7 days, how often have you delegated or automated work that did not require your personal expertise or decision-making?",
    coachingContext:
      "Delegation is not just about saving time — it is about protecting the quality of your thinking for the work only you can do.",
    order: 1,
    status: "active",
  },
  {
    id: "q-sop-documentation",
    practiceId: "sop-documentation",
    pillarId: "operations-systems",
    question:
      "In the past 7 days, how often have you documented a recurring process or workflow so it could be followed without your direct involvement?",
    order: 2,
    status: "active",
  },
  {
    id: "q-ai-integration",
    practiceId: "ai-integration",
    pillarId: "operations-systems",
    question:
      "In the past 7 days, how often have you used AI tools to meaningfully reduce the time or effort required for a regular business task?",
    coachingContext:
      "AI adoption is not about technology — it is about creating leverage. Even one well-integrated AI workflow can reclaim hours every week.",
    order: 3,
    status: "active",
  },
  /* ── Financial Intelligence™ ─────────────────────────────────────────── */
  {
    id: "q-financial-review-rhythm",
    practiceId: "financial-review-rhythm",
    pillarId: "financial-intelligence",
    question:
      "In the past 7 days, how often have you reviewed your key financial metrics — revenue, expenses, and cash position — on a scheduled basis?",
    coachingContext:
      "Financial reviews are not accounting — they are strategic. Knowing your numbers before problems arrive is the difference between a decision and a crisis.",
    order: 1,
    status: "active",
  },
  {
    id: "q-cash-flow-awareness",
    practiceId: "cash-flow-awareness",
    pillarId: "financial-intelligence",
    question:
      "In the past 7 days, how often have you had a clear understanding of your business's cash flow — what is coming in, what is going out, and when?",
    order: 2,
    status: "active",
  },
  /* ── People & Leadership™ ─────────────────────────────────────────────── */
  {
    id: "q-hiring-practice",
    practiceId: "hiring-practice",
    pillarId: "people-leadership",
    question:
      "In the past 7 days, how often have you made or advanced intentional decisions about who on your team (human or AI) handles what work?",
    coachingContext:
      "Team design is not just for founders with staff — it begins the moment you decide that some work should be done by someone or something other than you.",
    order: 1,
    status: "active",
  },
  {
    id: "q-leadership-development",
    practiceId: "leadership-development",
    pillarId: "people-leadership",
    question:
      "In the past 7 days, how often have you intentionally invested in developing your leadership capabilities — communication, culture, conflict, or vision?",
    order: 2,
    status: "active",
  },
  /* ── Client Excellence™ ──────────────────────────────────────────────── */
  {
    id: "q-client-onboarding",
    practiceId: "client-onboarding",
    pillarId: "client-excellence",
    question:
      "In the past 7 days, how often have you onboarded new clients through a consistent, documented process that set them up for early success?",
    order: 1,
    status: "active",
  },
  {
    id: "q-retention-referral",
    practiceId: "retention-referral",
    pillarId: "client-excellence",
    question:
      "In the past 7 days, how often have you taken intentional action to strengthen client relationships, improve retention, or generate referrals?",
    coachingContext:
      "Retention and referrals are the highest-ROI marketing strategy available to a founder. Every invested relationship compounds over time.",
    order: 2,
    status: "active",
  },
  /* ── Growth & Innovation™ ─────────────────────────────────────────────── */
  {
    id: "q-thought-leadership",
    practiceId: "thought-leadership",
    pillarId: "growth-innovation",
    question:
      "In the past 7 days, how often have you published, spoken, or created content that demonstrated your expertise to an audience beyond your existing clients?",
    order: 1,
    status: "active",
  },
  {
    id: "q-continuous-learning",
    practiceId: "continuous-learning",
    pillarId: "growth-innovation",
    question:
      "In the past 7 days, how often have you applied something you recently learned directly to improving or building your business?",
    coachingContext:
      "Learning that does not lead to execution is entertainment. The measure of good learning is what changed in the business afterward.",
    order: 2,
    status: "active",
  },
  /* ── Human Sustainability™ ────────────────────────────────────────────── */
  {
    id: "q-protected-recovery",
    practiceId: "protected-recovery",
    pillarId: "human-sustainability",
    question:
      "In the past 7 days, how often have you protected intentional recovery time — evenings, weekends, or days off — from business work?",
    coachingContext:
      "Recovery is not a reward for finishing work. It is the system that makes high-quality work possible in the first place.",
    order: 1,
    status: "active",
  },
  {
    id: "q-daily-non-negotiables",
    practiceId: "daily-non-negotiables",
    pillarId: "human-sustainability",
    question:
      "In the past 7 days, how often have you honored your personal Daily Non-Negotiables™ — sleep, movement, nutrition, and personal boundaries?",
    order: 2,
    status: "active",
  },
  {
    id: "q-boundary-practice",
    practiceId: "boundary-practice",
    pillarId: "human-sustainability",
    question:
      "In the past 7 days, how often have you honored clear boundaries between work time and personal time — ending work at the designed time and not resuming?",
    coachingContext:
      "Boundaries are not about discipline — they are about design. When work has a scheduled end, the founder can be fully present on both sides of the line.",
    order: 3,
    status: "active",
  },
]

/** O(1) lookup by id. */
const QUESTION_BY_ID = new Map(ASSESSMENT_QUESTIONS.map((q) => [q.id, q]))
export function getAssessmentQuestion(id: string) {
  return QUESTION_BY_ID.get(id)
}

/** All questions for a given pillar, sorted by display order. */
export function getQuestionsForPillar(pillarId: string) {
  return ASSESSMENT_QUESTIONS.filter((q) => q.pillarId === pillarId).sort((a, b) => a.order - b.order)
}

/* ===========================================================================
 * Business Models™
 * ======================================================================== */

export const BUSINESS_MODELS: BusinessModel[] = [
  { id: "coaching", name: "Coaching", description: "One-on-one or group coaching services.", status: "architecture" },
  { id: "consulting", name: "Consulting", description: "Expertise-based advisory services.", status: "architecture" },
  { id: "agency", name: "Agency", description: "Done-for-you services with a team.", status: "architecture" },
  { id: "saas", name: "SaaS", description: "Software as a service product.", status: "architecture" },
  { id: "professional-services", name: "Professional Services", description: "Licensed professional practice (law, accounting, etc.).", status: "architecture" },
  { id: "local-business", name: "Local Business", description: "Location-based business serving a geographic community.", status: "architecture" },
  { id: "healthcare", name: "Healthcare", description: "Medical or wellness practice.", status: "architecture" },
  { id: "restaurant", name: "Restaurant", description: "Food and beverage service business.", status: "architecture" },
  { id: "retail", name: "Retail", description: "Physical or e-commerce product sales.", status: "architecture" },
  { id: "trades", name: "Trades", description: "Skilled trades (plumbing, electrical, HVAC, etc.).", status: "architecture" },
  { id: "construction", name: "Construction", description: "Construction and contracting.", status: "architecture" },
  { id: "manufacturing", name: "Manufacturing", description: "Physical product manufacturing.", status: "architecture" },
  { id: "nonprofit", name: "Nonprofit", description: "Mission-driven nonprofit organization.", status: "architecture" },
  { id: "membership", name: "Membership", description: "Recurring subscription or membership community.", status: "architecture" },
  { id: "creator", name: "Creator", description: "Content creator, influencer, or personal brand.", status: "architecture" },
  { id: "education", name: "Education", description: "Courses, programs, or educational institution.", status: "architecture" },
  { id: "marketplace", name: "Marketplace", description: "Platform connecting buyers and sellers.", status: "architecture" },
  { id: "franchise", name: "Franchise", description: "Franchised business model.", status: "architecture" },
  { id: "custom", name: "Custom", description: "A unique or hybrid business model.", status: "architecture" },
]

const BUSINESS_MODEL_BY_ID = new Map(BUSINESS_MODELS.map((m) => [m.id, m]))
export function getBusinessModel(id: string) {
  return BUSINESS_MODEL_BY_ID.get(id as never)
}

/* ===========================================================================
 * Business Performance™ Metrics
 * ======================================================================== */

export const BUSINESS_PERFORMANCE_METRICS: BusinessPerformanceMetric[] = [
  { id: "revenue", name: "Revenue", description: "Total income before expenses.", indicatorType: "lagging", status: "architecture" },
  { id: "profitability", name: "Profitability", description: "Revenue minus all expenses.", indicatorType: "lagging", status: "architecture" },
  { id: "margin", name: "Margin", description: "Percentage of revenue retained as profit.", indicatorType: "lagging", status: "architecture" },
  { id: "cash-flow", name: "Cash Flow", description: "Timing and movement of cash in and out.", indicatorType: "both", status: "architecture" },
  { id: "runway", name: "Runway", description: "How many months the business can operate without new revenue.", indicatorType: "leading", status: "architecture" },
  { id: "roi", name: "ROI", description: "Return on investment for key expenses.", indicatorType: "lagging", status: "architecture" },
  { id: "capacity", name: "Capacity", description: "Available founder and team bandwidth.", indicatorType: "leading", status: "architecture" },
  { id: "delegation-percentage", name: "Delegation %", description: "Percentage of work handled without the founder.", indicatorType: "leading", status: "architecture" },
  { id: "ai-adoption", name: "AI Adoption", description: "Percentage of repeatable tasks with AI integration.", indicatorType: "leading", status: "architecture" },
  { id: "customer-retention", name: "Customer Retention", description: "Percentage of clients who return or renew.", indicatorType: "lagging", status: "architecture" },
  { id: "customer-lifetime-value", name: "Customer LTV", description: "Total revenue generated by a typical client relationship.", indicatorType: "lagging", status: "architecture" },
  { id: "customer-acquisition-cost", name: "CAC", description: "Cost to acquire one new client.", indicatorType: "both", status: "architecture" },
  { id: "pipeline-value", name: "Pipeline Value", description: "Total potential revenue in active sales conversations.", indicatorType: "leading", status: "architecture" },
  { id: "team-capacity", name: "Team Capacity", description: "Available bandwidth across the full team.", indicatorType: "leading", status: "architecture" },
]
