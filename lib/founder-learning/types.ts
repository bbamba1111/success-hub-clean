/**
 * Founder Learning Profile™ — types (Phase 10.1)
 * ---------------------------------------------------------------------------
 * Captures the founder's Executive Communication Level™ and the topics they
 * want to learn via Harmony Lane's Learn Before You Launch™ curriculum.
 *
 * This is separate from BusinessContextProfile so the learning layer can
 * evolve independently (e.g. lesson completion tracking, curriculum expansion)
 * without touching the broader business intelligence type.
 */

export type CommunicationLevel =
  | "foundation"
  | "developing"
  | "professional"
  | "executive"
  | "executive-mba"

export interface CommunicationLevelDef {
  id: CommunicationLevel
  label: string
  description: string
}

export const COMMUNICATION_LEVELS: CommunicationLevelDef[] = [
  {
    id: "foundation",
    label: "Foundation™",
    description: "I am new to business ownership and want clear, simple explanations.",
  },
  {
    id: "developing",
    label: "Developing™",
    description: "I have some experience and understand basic business concepts.",
  },
  {
    id: "professional",
    label: "Professional™",
    description: "I have been in business a few years and understand most business concepts.",
  },
  {
    id: "executive",
    label: "Executive™",
    description:
      "I have significant experience and prefer executive-level language and strategic frameworks.",
  },
  {
    id: "executive-mba",
    label: "Executive MBA™",
    description:
      "I have an MBA or equivalent depth and prefer advanced frameworks, research-backed language, and first-principles thinking.",
  },
]

export const LEARNING_TOPIC_OPTIONS: string[] = [
  "Business Credit & Funding",
  "Business Banking & Financial Systems",
  "Bookkeeping & Accounting Basics",
  "Wealth Building & Investing",
  "Capital Strategy & Raising Funds",
  "Sales Systems & Revenue Generation",
  "Marketing & Brand Building",
  "Contracts & Legal Foundations",
  "Business Structures & Entity Formation",
  "Operations & Systems",
  "Leadership & Team Building",
  "Pricing Strategy",
  "Exit Planning & Business Valuation",
  "AI Integration & Automation",
  "Work-Life Harmony™ Practices",
]

export interface FounderLearningProfile {
  /** ISO timestamp when saved. */
  completedAt: string

  /** How the founder prefers business concepts to be explained. */
  communicationLevel: CommunicationLevel

  /** Topics the founder selected interest in. */
  learningInterests: string[]

  /**
   * Specific items queued from "Learn Before You Launch™" selections
   * throughout the Business Context Profile™ wizard.
   */
  learningQueue: string[]

  /** Completed lesson IDs (populated as the curriculum is built out). */
  completedLessons: string[]
}
