/**
 * Harmony Business Academy™ — Academy Registry (Phase 5.7)
 * ---------------------------------------------------------------------------
 * The SINGLE SOURCE OF TRUTH for the Executive Education Layer™ of the Harmony
 * Lane™ Operating System.
 *
 * Harmony Business Academy™ is NOT a Learning Management System (LMS), a course
 * catalog, or a video library. It is the educational layer of the ecosystem:
 * the right knowledge, at the right time, in the founder's communication style,
 * delivered so they can immediately EXECUTE the work in front of them.
 *
 * Guiding principle — every learning experience answers three questions:
 *   1. What should the founder understand?
 *   2. What should the founder be able to DO afterward?
 *   3. What real business OUTCOME should result?
 * If learning does not lead to execution, it does not belong in the Academy.
 *
 * This module is intentionally data-only and architecture-only. There are NO
 * lessons, videos, quizzes, adaptive behavior, or recommendation logic this
 * phase. Every Academy item already declares the Harmony Context™ signals
 * (Business Stage™, Business Comprehension™, Preferred Language™, Executive™ /
 * Advisor™ owners, related Deliverables™, Operating Segments™) that future
 * phases plug into WITHOUT a redesign. Concept definitions are NEVER duplicated
 * here — they always reference lib/business-concepts/business-concepts-registry.
 */

import { ALL_BUSINESS_STAGES, type BusinessStage } from "@/lib/business-stage/business-stage"
import { ALL_COMMUNICATION_STYLES, type CommunicationStyle } from "@/lib/business-comprehension/business-comprehension"
import { SUPPORTED_LANGUAGES, type LanguageCode } from "@/lib/i18n/language"

/** All Preferred Language™ codes — derived so the two never drift. */
export const ALL_LANGUAGE_CODES: LanguageCode[] = SUPPORTED_LANGUAGES.map((l) => l.code)

/** Lifecycle of every Academy object this phase. */
export type AcademyStatus = "architecture"

/* ===========================================================================
 * The Five Colleges™
 * ---------------------------------------------------------------------------
 * The Academy is organized into five Colleges, each OWNED by an executive from
 * the Executive Leadership Team™ (referenced by id — never duplicated).
 * ======================================================================== */

export type CollegeId = "business" | "human-sustainability" | "ai" | "entrepreneurship" | "influence"

export interface College {
  /** Stable identifier — safe for routing, storage, and cross-references. */
  id: CollegeId
  /** Brand name (e.g. "College of Business™"). */
  name: string
  /** A short, calm positioning line. */
  tagline: string
  /** A fuller description of what this College develops in a founder. */
  description: string
  /** Executive Leadership Team™ id that owns this College. */
  executiveOwnerId: string
  /** The subject areas taught within this College. */
  subjects: string[]
  status: AcademyStatus
}

export const COLLEGES: College[] = [
  {
    id: "business",
    name: "College of Business™",
    tagline: "The fundamentals that make a business work.",
    description:
      "How a business actually creates and captures value — models, strategy, positioning, pricing, marketing, sales, operations, and finance. The core executive literacy every founder builds on.",
    executiveOwnerId: "strategy",
    subjects: [
      "Business Models",
      "Strategy",
      "Positioning",
      "Pricing",
      "Marketing",
      "Sales",
      "Operations",
      "Finance",
    ],
    status: "architecture",
  },
  {
    id: "human-sustainability",
    name: "College of Human Sustainability™",
    tagline: "Building a business that sustains the human building it.",
    description:
      "Leadership that protects energy and balance — Human Sustainability™, work-life balance, emotional intelligence, energy management, communication, and founder wellness. Success that does not cost the founder themselves.",
    executiveOwnerId: "people-culture",
    subjects: [
      "Work-Life Balance",
      "Human Sustainability™",
      "Leadership",
      "Emotional Intelligence",
      "Energy Management",
      "Communication",
      "Founder Wellness",
    ],
    status: "architecture",
  },
  {
    id: "ai",
    name: "College of AI™",
    tagline: "Running your business with an AI-native mindset.",
    description:
      "Practical, governed AI for founders — fundamentals, prompt engineering, workflows, automation, governance, and orchestrating an AI Executive Team™. Leverage without losing judgment.",
    executiveOwnerId: "innovation",
    subjects: [
      "AI Fundamentals",
      "Prompt Engineering",
      "AI Workflows",
      "AI Automation",
      "AI Governance",
      "AI Executive Team™",
    ],
    status: "architecture",
  },
  {
    id: "entrepreneurship",
    name: "College of Entrepreneurship™",
    tagline: "From first idea to lasting legacy.",
    description:
      "The founder's journey end to end — launch, growth, scale, and legacy — plus the practical scaffolding of business credit, funding, legal basics, taxes, and business formation.",
    executiveOwnerId: "growth",
    subjects: [
      "Launch",
      "Growth",
      "Scale",
      "Legacy",
      "Business Credit",
      "Funding",
      "Legal Basics",
      "Taxes",
      "Business Formation",
    ],
    status: "architecture",
  },
  {
    id: "influence",
    name: "College of Influence™",
    tagline: "Becoming a voice your market trusts.",
    description:
      "Building authority and reach — speaking, publishing, podcasting, personal brand, PR, media, video, and storytelling. Influence that compounds into pipeline and legacy.",
    executiveOwnerId: "marketing-brand",
    subjects: [
      "Speaking",
      "Publishing",
      "Podcasting",
      "Personal Brand",
      "PR",
      "Media",
      "Video",
      "Storytelling",
    ],
    status: "architecture",
  },
]

export function getCollege(id: CollegeId): College | undefined {
  return COLLEGES.find((c) => c.id === id)
}

/* ===========================================================================
 * Learning Object Types™
 * ---------------------------------------------------------------------------
 * The forms a future learning object may take. No content this phase — this
 * reserves the vocabulary so future authoring plugs in without a redesign.
 * ======================================================================== */

export type LearningObjectType =
  | "executive-insight"
  | "business-concept"
  | "framework"
  | "playbook"
  | "case-study"
  | "checklist"
  | "workbook"
  | "quick-lesson"
  | "video"
  | "audio"
  | "interactive-exercise"
  | "assessment"
  | "reflection"

export interface LearningObjectTypeDefinition {
  id: LearningObjectType
  name: string
  description: string
}

export const LEARNING_OBJECT_TYPES: LearningObjectTypeDefinition[] = [
  {
    id: "executive-insight",
    name: "Executive Insight™",
    description: "Short-form learning (3–12 min) that prepares a founder to execute today's work.",
  },
  {
    id: "business-concept",
    name: "Business Concept™",
    description: "A core concept explained from the canonical Business Concepts™ registry.",
  },
  { id: "framework", name: "Framework™", description: "A reusable mental model for making a class of decisions." },
  { id: "playbook", name: "Playbook™", description: "A step-by-step approach to a recurring business situation." },
  { id: "case-study", name: "Case Study™", description: "A real-world example that illustrates a principle in action." },
  { id: "checklist", name: "Checklist™", description: "A concise, do-this-now list to execute without missing steps." },
  { id: "workbook", name: "Workbook™", description: "A guided exercise that turns understanding into a working artifact." },
  { id: "quick-lesson", name: "Quick Lesson™", description: "A focused micro-lesson on a single idea." },
  { id: "video", name: "Video™", description: "A visual lesson (future media phase)." },
  { id: "audio", name: "Audio™", description: "An audio lesson for learning on the move (future media phase)." },
  {
    id: "interactive-exercise",
    name: "Interactive Exercise™",
    description: "A hands-on activity that builds a demonstrated capability.",
  },
  { id: "assessment", name: "Assessment™", description: "A future check of demonstrated capability — never a grade." },
  { id: "reflection", name: "Reflection™", description: "A prompt to internalize a lesson and connect it to the founder's business." },
]

/**
 * Executive Insights™ are the Academy's signature short-form learning. Purpose:
 * prepare the founder to execute today's work. Durations are intentionally
 * small and fixed.
 */
export const EXECUTIVE_INSIGHT_DURATIONS = [3, 5, 8, 12] as const
export type ExecutiveInsightDuration = (typeof EXECUTIVE_INSIGHT_DURATIONS)[number]

/* ===========================================================================
 * Academy Items™
 * ---------------------------------------------------------------------------
 * The atomic unit of the Academy. Each item declares every Harmony Context™
 * signal it can adapt to. No content is authored this phase — these are
 * architectural entries that prove the model and seed the five Colleges.
 * ======================================================================== */

export interface AcademyItem {
  /** Stable identifier — safe for routing, storage, and cross-references. */
  id: string
  /** The item's title (e.g. "How Great Companies Delegate"). */
  title: string
  /** The College this item belongs to. */
  category: CollegeId
  /** One-line description for cards and summaries. */
  description: string
  /** Executive Leadership Team™ id that owns this item. */
  executiveOwner: string
  /** Professional Advisory Network™ id, when an advisor co-owns it (else null). */
  advisorOwner: string | null
  /** Business Concepts™ ids referenced — NEVER redefined here. */
  businessConcepts: string[]
  /** Business Stages™ this item serves (all, unless intentionally scoped). */
  businessStages: BusinessStage[]
  /** Communication Styles™ this item can be expressed in (all — adapt HOW, not WHAT). */
  communicationStyles: CommunicationStyle[]
  /** Preferred Languages™ this item can be delivered in (architecture hook). */
  supportedLanguages: LanguageCode[]
  /** Human-readable estimated duration (e.g. "5 min"). */
  estimatedDuration: string
  /** What the founder will understand — the knowledge goal. */
  learningObjectives: string[]
  /** Competency™ ids this item develops. */
  competencies: string[]
  /** Deliverable™ ids this item helps the founder produce (execution outcome). */
  relatedDeliverables: string[]
  /** Operating Segment™ labels where this learning naturally applies. */
  relatedOperatingSegments: string[]
  /** Academy item ids recommended before this one. */
  prerequisites: string[]
  /** Academy item ids recommended after this one. */
  recommendedNextLessons: string[]
  /** The form this item will take when authored. */
  futureLessonType: LearningObjectType
  status: AcademyStatus
}

/**
 * ACADEMY_ITEMS — architectural Executive Insight™ entries seeding each College.
 * These demonstrate the full contextual model; no lesson content is authored.
 */
export const ACADEMY_ITEMS: AcademyItem[] = [
  {
    id: "insight-delegation",
    title: "How Great Companies Delegate",
    category: "business",
    description:
      "Why high-performing companies design the role and the outcome before they hand off the work — and how to delegate without losing quality or control.",
    executiveOwner: "operations",
    advisorOwner: null,
    businessConcepts: ["delegation", "human-zone-of-genius"],
    businessStages: ALL_BUSINESS_STAGES,
    communicationStyles: ALL_COMMUNICATION_STYLES,
    supportedLanguages: ALL_LANGUAGE_CODES,
    estimatedDuration: "8 min",
    learningObjectives: [
      "Understand what to delegate first and why",
      "Design an outcome before assigning the work",
      "Delegate ownership, not just tasks",
    ],
    competencies: ["delegation", "executive-decision-making"],
    relatedDeliverables: ["job-description"],
    relatedOperatingSegments: ["CEO Workday", "Team & Operations"],
    prerequisites: [],
    recommendedNextLessons: ["insight-designing-meetings"],
    futureLessonType: "executive-insight",
    status: "architecture",
  },
  {
    id: "insight-pricing-fundamentals",
    title: "Pricing Fundamentals",
    category: "business",
    description:
      "The founder's first principles of pricing — value, cost, and confidence — so your prices reflect the outcome you create, not your nerves.",
    executiveOwner: "finance",
    advisorOwner: null,
    businessConcepts: ["margin", "gross-profit"],
    businessStages: ALL_BUSINESS_STAGES,
    communicationStyles: ALL_COMMUNICATION_STYLES,
    supportedLanguages: ALL_LANGUAGE_CODES,
    estimatedDuration: "12 min",
    learningObjectives: [
      "Separate price from cost from value",
      "Understand how margin funds the business",
      "Set a price you can defend with confidence",
    ],
    competencies: ["pricing", "strategic-planning"],
    relatedDeliverables: ["annual-budget"],
    relatedOperatingSegments: ["CEO Workday", "Finance"],
    prerequisites: ["insight-understanding-margin"],
    recommendedNextLessons: [],
    futureLessonType: "executive-insight",
    status: "architecture",
  },
  {
    id: "insight-understanding-margin",
    title: "Understanding Margin",
    category: "business",
    description:
      "What margin really is, why it is the truest signal of a healthy offer, and how to read it without a finance background.",
    executiveOwner: "finance",
    advisorOwner: null,
    businessConcepts: ["margin", "gross-profit", "cash-flow"],
    businessStages: ALL_BUSINESS_STAGES,
    communicationStyles: ALL_COMMUNICATION_STYLES,
    supportedLanguages: ALL_LANGUAGE_CODES,
    estimatedDuration: "5 min",
    learningObjectives: [
      "Define margin in plain terms",
      "Tell healthy margin from thin margin",
      "Know which offers fund the business",
    ],
    competencies: ["pricing", "executive-decision-making"],
    relatedDeliverables: ["annual-budget"],
    relatedOperatingSegments: ["Finance"],
    prerequisites: [],
    recommendedNextLessons: ["insight-pricing-fundamentals"],
    futureLessonType: "business-concept",
    status: "architecture",
  },
  {
    id: "insight-designing-meetings",
    title: "Designing Better Meetings",
    category: "business",
    description:
      "How to design meetings that produce decisions — agendas, roles, and rules that protect everyone's time and energy.",
    executiveOwner: "operations",
    advisorOwner: null,
    businessConcepts: ["operating-rule", "sop"],
    businessStages: ALL_BUSINESS_STAGES,
    communicationStyles: ALL_COMMUNICATION_STYLES,
    supportedLanguages: ALL_LANGUAGE_CODES,
    estimatedDuration: "5 min",
    learningObjectives: [
      "Decide whether a meeting is even needed",
      "Design an agenda around a decision",
      "Set meeting rules that stick",
    ],
    competencies: ["communication", "executive-decision-making"],
    relatedDeliverables: ["meeting-rules"],
    relatedOperatingSegments: ["Team & Operations"],
    prerequisites: [],
    recommendedNextLessons: [],
    futureLessonType: "playbook",
    status: "architecture",
  },
  {
    id: "insight-building-business-credit",
    title: "Building Business Credit",
    category: "entrepreneurship",
    description:
      "How business credit is established and why it protects the founder — separating personal risk from business capital readiness.",
    executiveOwner: "growth",
    advisorOwner: "business-credit",
    businessConcepts: ["business-credit", "cash-flow"],
    businessStages: ALL_BUSINESS_STAGES,
    communicationStyles: ALL_COMMUNICATION_STYLES,
    supportedLanguages: ALL_LANGUAGE_CODES,
    estimatedDuration: "8 min",
    learningObjectives: [
      "Understand what business credit is and is not",
      "Know the first steps to establish it",
      "See how credit supports capital readiness",
    ],
    competencies: ["business-credit", "strategic-planning"],
    relatedDeliverables: [],
    relatedOperatingSegments: ["Finance", "CEO Workday"],
    prerequisites: [],
    recommendedNextLessons: [],
    futureLessonType: "executive-insight",
    status: "architecture",
  },
  {
    id: "insight-human-sustainability-basics",
    title: "Human Sustainability™ Basics",
    category: "human-sustainability",
    description:
      "The founder is the most important asset in the business. Learn the basics of protecting energy, attention, and balance so success is sustainable.",
    executiveOwner: "people-culture",
    advisorOwner: null,
    businessConcepts: ["human-zone-of-genius", "capacity-planning"],
    businessStages: ALL_BUSINESS_STAGES,
    communicationStyles: ALL_COMMUNICATION_STYLES,
    supportedLanguages: ALL_LANGUAGE_CODES,
    estimatedDuration: "5 min",
    learningObjectives: [
      "Understand Human Sustainability™ as a business strategy",
      "Recognize the early signals of depletion",
      "Protect energy with simple Operating Rules™",
    ],
    competencies: ["human-sustainability", "leadership"],
    relatedDeliverables: [],
    relatedOperatingSegments: ["Work-Life Balance Business Day™", "CEO Workday"],
    prerequisites: [],
    recommendedNextLessons: ["insight-delegation"],
    futureLessonType: "reflection",
    status: "architecture",
  },
  {
    id: "insight-ai-fundamentals",
    title: "AI Fundamentals for Founders",
    category: "ai",
    description:
      "What AI can and cannot do for a founder-led business, and how to adopt it with judgment and governance instead of hype.",
    executiveOwner: "innovation",
    advisorOwner: null,
    businessConcepts: ["capacity-planning"],
    businessStages: ALL_BUSINESS_STAGES,
    communicationStyles: ALL_COMMUNICATION_STYLES,
    supportedLanguages: ALL_LANGUAGE_CODES,
    estimatedDuration: "12 min",
    learningObjectives: [
      "Understand where AI creates real leverage",
      "Know the limits and risks to govern",
      "Identify a first safe workflow to automate",
    ],
    competencies: ["ai-fundamentals", "executive-decision-making"],
    relatedDeliverables: [],
    relatedOperatingSegments: ["CEO Workday", "Team & Operations"],
    prerequisites: [],
    recommendedNextLessons: [],
    futureLessonType: "framework",
    status: "architecture",
  },
  {
    id: "insight-becoming-a-voice",
    title: "Becoming a Voice Your Market Trusts",
    category: "influence",
    description:
      "The foundations of influence — clarity, consistency, and a story worth following — so authority compounds into pipeline and legacy.",
    executiveOwner: "marketing-brand",
    advisorOwner: null,
    businessConcepts: ["customer-lifetime-value"],
    businessStages: ALL_BUSINESS_STAGES,
    communicationStyles: ALL_COMMUNICATION_STYLES,
    supportedLanguages: ALL_LANGUAGE_CODES,
    estimatedDuration: "8 min",
    learningObjectives: [
      "Define the audience you want to influence",
      "Find a message worth repeating",
      "Choose one channel to build authority",
    ],
    competencies: ["communication", "marketing"],
    relatedDeliverables: ["press-release"],
    relatedOperatingSegments: ["Marketing & Brand"],
    prerequisites: [],
    recommendedNextLessons: [],
    futureLessonType: "case-study",
    status: "architecture",
  },
]

export function getAcademyItem(id: string): AcademyItem | undefined {
  return ACADEMY_ITEMS.find((i) => i.id === id)
}

/** All Academy items within a College. */
export function getAcademyItemsByCollege(collegeId: CollegeId): AcademyItem[] {
  return ACADEMY_ITEMS.filter((i) => i.category === collegeId)
}

/** The Executive Insights™ subset (short-form, execution-prep learning). */
export const EXECUTIVE_INSIGHTS: AcademyItem[] = ACADEMY_ITEMS.filter(
  (i) => i.futureLessonType === "executive-insight",
)
