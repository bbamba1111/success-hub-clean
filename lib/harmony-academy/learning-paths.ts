/**
 * Harmony Business Academy™ — Learning Paths™ (Phase 5.7)
 * ---------------------------------------------------------------------------
 * Learning Paths™ are OUTCOME-BASED journeys — not playlists of courses. Each
 * path is named for the real business outcome a founder wants ("Launch Your
 * Business™", "Hire Your First Employee™"), and sequences the subjects that
 * lead there. Every path ends in EXECUTION, not just understanding.
 *
 * Architecture only: paths reference subjects/steps as labels and, where an
 * architectural Academy item already exists, its id — so a future phase can
 * attach full lessons WITHOUT a redesign. No progress tracking this phase.
 */

import type { BusinessStage } from "@/lib/business-stage/business-stage"
import type { CollegeId } from "@/lib/harmony-academy/academy-registry"

export type LearningPathStatus = "architecture"

export interface LearningPathStep {
  /** The subject/step name (e.g. "Business Formation"). */
  title: string
  /** The Academy item id that will fulfill this step, when one exists yet. */
  academyItemId?: string
}

export interface LearningPath {
  /** Stable identifier — safe for routing, storage, and cross-references. */
  id: string
  /** Outcome-based name (e.g. "Launch Your Business™"). */
  title: string
  /** The real business outcome this path produces. */
  outcome: string
  /** A short, calm description of the journey. */
  description: string
  /** The College this path primarily draws from. */
  primaryCollege: CollegeId
  /** Business Stages™ this path is most relevant to (emphasis, not restriction). */
  businessStages: BusinessStage[]
  /** The ordered steps of the journey. */
  steps: LearningPathStep[]
  status: LearningPathStatus
}

export const LEARNING_PATHS: LearningPath[] = [
  {
    id: "launch-your-business",
    title: "Launch Your Business™",
    outcome: "A legally formed business with pricing, credit, and a first client.",
    description:
      "The complete first mile — from formation to your first paying client, without skipping the foundations that protect you.",
    primaryCollege: "entrepreneurship",
    businessStages: ["launch"],
    steps: [
      { title: "Business Formation" },
      { title: "Pricing", academyItemId: "insight-pricing-fundamentals" },
      { title: "Business Credit", academyItemId: "insight-building-business-credit" },
      { title: "Marketing", academyItemId: "insight-becoming-a-voice" },
      { title: "First Client" },
      { title: "Work-Life Balance Business Day™", academyItemId: "insight-human-sustainability-basics" },
    ],
    status: "architecture",
  },
  {
    id: "hire-your-first-employee",
    title: "Hire Your First Employee™",
    outcome: "A well-designed first role, hired and onboarded without overwhelm.",
    description:
      "Move from doing everything yourself to leading a team — designing the role, hiring well, and delegating with confidence.",
    primaryCollege: "business",
    businessStages: ["growth", "scale"],
    steps: [
      { title: "Job Design", academyItemId: "insight-delegation" },
      { title: "Interviewing" },
      { title: "Delegation", academyItemId: "insight-delegation" },
      { title: "Onboarding" },
      { title: "Human Sustainability™", academyItemId: "insight-human-sustainability-basics" },
      { title: "Legal Basics" },
    ],
    status: "architecture",
  },
  {
    id: "become-a-thought-leader",
    title: "Become a Thought Leader™",
    outcome: "A recognized voice with a platform that generates trust and pipeline.",
    description:
      "Build authority that compounds — publishing, speaking, and media that turn expertise into influence.",
    primaryCollege: "influence",
    businessStages: ["growth", "scale", "legacy"],
    steps: [
      { title: "Publishing" },
      { title: "Speaking" },
      { title: "Podcasting" },
      { title: "PR", academyItemId: "insight-becoming-a-voice" },
      { title: "Personal Brand" },
    ],
    status: "architecture",
  },
  {
    id: "implement-ai",
    title: "Implement AI™",
    outcome: "A governed, working AI workflow that gives the founder real leverage.",
    description:
      "Adopt AI with judgment — from fundamentals to a governed workflow and your first AI Executive Team™ member.",
    primaryCollege: "ai",
    businessStages: ["growth", "scale"],
    steps: [
      { title: "AI Fundamentals", academyItemId: "insight-ai-fundamentals" },
      { title: "AI Prompting" },
      { title: "AI Workflows" },
      { title: "AI Governance" },
      { title: "AI Executive Team™" },
    ],
    status: "architecture",
  },
]

export function getLearningPath(id: string): LearningPath | undefined {
  return LEARNING_PATHS.find((p) => p.id === id)
}
