/**
 * Business Comprehension™ — Registry & Foundation (Phase 5.6)
 * ---------------------------------------------------------------------------
 * The SINGLE SOURCE OF TRUTH for the Harmony Lane™ Operating System's
 * Business Comprehension™ concept.
 *
 * Business Comprehension™ is a COMMUNICATION PREFERENCE — it is NOT an
 * assessment, a test, an education level, or a measure of intelligence or
 * experience. It lets Harmony Lane™ explain the SAME business concept at
 * different levels of complexity while preserving the SAME underlying
 * recommendation.
 *
 *   Guiding principle: adapt the EXPLANATION, never the PRINCIPLE.
 *   The recommendation never changes. The communication does.
 *
 * Business Comprehension™ is INDEPENDENT of Business Stage™: where a founder is
 * in their journey (Stage) is a separate question from how they prefer business
 * concepts to be explained (Comprehension). A first-year founder may prefer
 * Executive Strategy™; a seasoned operator may prefer Simple & Clear™.
 *
 * This module is intentionally data-only. NO adaptive AI behavior, prompt
 * generation, or automatic detection is implemented this phase. Every registry
 * (Executives, Advisors, Deliverables, Academy) and Cherry Blossom™ plug into
 * these definitions WITHOUT a redesign.
 */

/**
 * The five Communication Styles™. Stable ids — safe for storage and future
 * logic. The internal values are intentionally plain (not brand names) so they
 * remain stable even if brand naming evolves.
 */
export type CommunicationStyle =
  | "foundation"
  | "small_business"
  | "business_owner"
  | "executive"
  | "boardroom"

/**
 * Every style, in ascending order of business-vocabulary complexity. This order
 * is for consistent DISPLAY only — styles are preferences, NOT rankings, and no
 * style is "better" than another.
 */
export const ALL_COMMUNICATION_STYLES: CommunicationStyle[] = [
  "foundation",
  "small_business",
  "business_owner",
  "executive",
  "boardroom",
]

export interface CommunicationStyleDefinition {
  /** Stable identifier — safe for routing, storage, and future logic. */
  id: CommunicationStyle
  /** Brand name (e.g. "Simple & Clear™"). */
  name: string
  /** A short, calm positioning line for cards and summaries. */
  tagline: string
  /** A fuller description of how this style communicates. */
  description: string
  /** The defining characteristics of this style (UX card + future prompts). */
  characteristics: string[]
  /**
   * The kind of examples this style favors. An architecture hook for a future
   * adaptive phase — no logic reads this yet.
   */
  preferredExamples: string
  /**
   * The vocabulary register this style uses. An architecture hook for a future
   * adaptive phase — no logic reads this yet.
   */
  preferredVocabulary: string
}

/**
 * COMMUNICATION_STYLES — the five ways Harmony Lane™ can explain the same
 * business concept. Preferences, not rankings: a founder chooses the style that
 * helps them understand and apply concepts most effectively.
 */
export const COMMUNICATION_STYLES: CommunicationStyleDefinition[] = [
  {
    id: "foundation",
    name: "Simple & Clear™",
    tagline: "Plain language, everyday examples, no jargon.",
    description:
      "Concepts explained in plain, everyday language with step-by-step clarity and real-life examples. Business jargon is kept to an absolute minimum.",
    characteristics: [
      "Plain language",
      "Everyday vocabulary",
      "Step-by-step explanations",
      "Real-life examples",
      "Minimal business jargon",
    ],
    preferredExamples: "Everyday, relatable situations from daily life.",
    preferredVocabulary: "Plain, conversational language anyone can follow.",
  },
  {
    id: "small_business",
    name: "Practical Business™",
    tagline: "Beginner business language that's action-oriented.",
    description:
      "Practical, action-oriented explanations using beginner business terminology and simple frameworks a founder can apply right away.",
    characteristics: [
      "Beginner business language",
      "Practical terminology",
      "Simple frameworks",
      "Action-oriented",
    ],
    preferredExamples: "Practical small-business scenarios and quick wins.",
    preferredVocabulary: "Approachable business terms, defined as they appear.",
  },
  {
    id: "business_owner",
    name: "Business Builder™",
    tagline: "Intermediate concepts, metrics, and systems.",
    description:
      "Intermediate business concepts with an operational lens — metrics, systems thinking, and the trade-offs behind decisions.",
    characteristics: [
      "Intermediate business concepts",
      "Metrics",
      "Operational thinking",
      "Systems",
    ],
    preferredExamples: "Operational examples with metrics and systems.",
    preferredVocabulary: "Standard business vocabulary and common metrics.",
  },
  {
    id: "executive",
    name: "Executive Strategy™",
    tagline: "Executive vocabulary and strategic thinking.",
    description:
      "Strategic explanations using executive vocabulary, financial terminology, and leadership concepts — framed the way a C-suite leader would think about them.",
    characteristics: [
      "Executive vocabulary",
      "Strategic thinking",
      "Financial terminology",
      "Leadership concepts",
    ],
    preferredExamples: "Strategic scenarios framed for decision-makers.",
    preferredVocabulary: "Executive and financial terminology.",
  },
  {
    id: "boardroom",
    name: "Boardroom & Enterprise™",
    tagline: "Governance, capital, and enterprise strategy.",
    description:
      "Advanced executive discussion covering governance, capital allocation, organizational design, and enterprise strategy.",
    characteristics: [
      "Governance",
      "Capital allocation",
      "Organizational design",
      "Enterprise strategy",
      "Advanced executive discussion",
    ],
    preferredExamples: "Enterprise and governance-level scenarios.",
    preferredVocabulary: "Advanced enterprise, capital, and governance language.",
  },
]

/**
 * The default style for a founder who hasn't chosen one. Business Builder™ is a
 * balanced, broadly-applicable middle — the founder is always free to change it.
 */
export const DEFAULT_COMMUNICATION_STYLE: CommunicationStyle = "business_owner"

/** The reassurance message that MUST accompany every Business Comprehension™ surface. */
export const COMPREHENSION_REASSURANCE =
  "This setting changes how Harmony Lane™ explains business concepts. It does not measure your intelligence, education, or experience."

/** Look up a style definition by id. Falls back to the default style. */
export function getCommunicationStyle(
  id: CommunicationStyle | string | null | undefined,
): CommunicationStyleDefinition {
  return (
    COMMUNICATION_STYLES.find((s) => s.id === id) ??
    COMMUNICATION_STYLES.find((s) => s.id === DEFAULT_COMMUNICATION_STYLE) ??
    COMMUNICATION_STYLES[0]
  )
}

/** Type guard for a valid Communication Style™ id. */
export function isCommunicationStyle(value: unknown): value is CommunicationStyle {
  return typeof value === "string" && ALL_COMMUNICATION_STYLES.includes(value as CommunicationStyle)
}
