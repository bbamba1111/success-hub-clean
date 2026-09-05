/**
 * Harmony Business Academy™ — Competency Framework™ (Phase 5.7)
 * ---------------------------------------------------------------------------
 * Competencies represent demonstrated CAPABILITY — what a founder can actually
 * DO — not a grade, score, or level. This is the architecture only.
 *
 * Explicitly OUT OF SCOPE this phase (future phases own these):
 *   - No scoring, no percentages, no pass/fail
 *   - No progress tracking or dashboards
 *   - No gamification, streaks, or points
 *   - No badges awarded (only a reserved future badge slot)
 *   - No assessments delivered (only a reserved future assessment slot)
 *
 * Competencies connect the Academy's learning to real execution: each maps to
 * the Academy items that develop it. Assessment and recognition arrive later
 * WITHOUT requiring a redesign.
 */

export type CompetencyStatus = "architecture"

export interface Competency {
  /** Stable identifier — safe for routing, storage, and cross-references. */
  competencyId: string
  /** Brand name (e.g. "Delegation™"). */
  title: string
  /** What demonstrated capability this represents. */
  description: string
  /** Academy item ids that develop this competency. */
  relatedLessons: string[]
  /** Reserved: a future Assessment™ that demonstrates this capability. Not built. */
  futureAssessment: string | null
  /** Reserved: a future recognition badge. Not awarded this phase. */
  futureBadge: string | null
  status: CompetencyStatus
}

export const COMPETENCIES: Competency[] = [
  {
    competencyId: "delegation",
    title: "Delegation™",
    description: "Handing off outcomes — not just tasks — so the business grows beyond the founder's own hours.",
    relatedLessons: ["insight-delegation"],
    futureAssessment: null,
    futureBadge: null,
    status: "architecture",
  },
  {
    competencyId: "pricing",
    title: "Pricing™",
    description: "Setting prices that reflect the value created and keep the business healthy.",
    relatedLessons: ["insight-pricing-fundamentals", "insight-understanding-margin"],
    futureAssessment: null,
    futureBadge: null,
    status: "architecture",
  },
  {
    competencyId: "marketing",
    title: "Marketing™",
    description: "Reaching the right people with a message that earns attention and trust.",
    relatedLessons: ["insight-becoming-a-voice"],
    futureAssessment: null,
    futureBadge: null,
    status: "architecture",
  },
  {
    competencyId: "leadership",
    title: "Leadership™",
    description: "Guiding people and yourself with clarity, steadiness, and care.",
    relatedLessons: ["insight-human-sustainability-basics"],
    futureAssessment: null,
    futureBadge: null,
    status: "architecture",
  },
  {
    competencyId: "business-credit",
    title: "Business Credit™",
    description: "Establishing and protecting the business's capital readiness and financial standing.",
    relatedLessons: ["insight-building-business-credit"],
    futureAssessment: null,
    futureBadge: null,
    status: "architecture",
  },
  {
    competencyId: "executive-decision-making",
    title: "Executive Decision Making™",
    description: "Making sound, timely decisions with incomplete information and clear trade-offs.",
    relatedLessons: [
      "insight-delegation",
      "insight-understanding-margin",
      "insight-designing-meetings",
      "insight-ai-fundamentals",
    ],
    futureAssessment: null,
    futureBadge: null,
    status: "architecture",
  },
  {
    competencyId: "human-sustainability",
    title: "Human Sustainability™",
    description: "Protecting the founder's energy and balance so success is sustainable, not depleting.",
    relatedLessons: ["insight-human-sustainability-basics"],
    futureAssessment: null,
    futureBadge: null,
    status: "architecture",
  },
  {
    competencyId: "ai-fundamentals",
    title: "AI Fundamentals™",
    description: "Adopting AI with judgment — real leverage, governed risk, and a founder still in control.",
    relatedLessons: ["insight-ai-fundamentals"],
    futureAssessment: null,
    futureBadge: null,
    status: "architecture",
  },
  {
    competencyId: "communication",
    title: "Communication™",
    description: "Being understood — in meetings, in writing, and in the market.",
    relatedLessons: ["insight-designing-meetings", "insight-becoming-a-voice"],
    futureAssessment: null,
    futureBadge: null,
    status: "architecture",
  },
  {
    competencyId: "strategic-planning",
    title: "Strategic Planning™",
    description: "Choosing where to focus and sequencing the work that moves the business forward.",
    relatedLessons: ["insight-pricing-fundamentals", "insight-building-business-credit"],
    futureAssessment: null,
    futureBadge: null,
    status: "architecture",
  },
]

export function getCompetency(id: string): Competency | undefined {
  return COMPETENCIES.find((c) => c.competencyId === id)
}
