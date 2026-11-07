import type { AlignmentChoice } from "@/lib/boundary-report/types"

/**
 * Work-Life Balance Alignment™ — Step 5 of the Reality Check.
 *
 * This replaces the old "Life Boundary Discovery" step. It is a WILLINGNESS
 * exercise, not a scored assessment: the founder is asked, one question at a
 * time, whether they are willing to operate differently this week. Every
 * response ("Yes, I'm Willing" / "I'm Not Sure Yet") is stored. "I'm Not Sure
 * Yet" never disqualifies — the tour that follows is what informs the decision.
 */

export interface AlignmentQuestion {
  id: string
  /** Short section label, e.g. "Start Intentionally". */
  title: string
  question: string
}

export const ALIGNMENT_QUESTIONS: AlignmentQuestion[] = [
  {
    id: "healthier-daily-rhythm",
    title: "A Healthier Daily Rhythm",
    question:
      "Would you be willing to adopt a healthier daily rhythm that makes room for your well-being while allowing you to lead and operate your business effectively?",
  },
  {
    id: "protect-what-matters",
    title: "Protect What Matters",
    question:
      "Would you be willing to establish and honor boundaries that protect your time, energy, relationships, and overall well-being—even when business demands compete for them?",
  },
  {
    id: "experience-business-week",
    title: "Ready to Experience the Business Week?",
    question:
      "Are you willing to experience the Work-Life Balance Business Week™ and practice a different way of working and living?",
  },
]

export const ALIGNMENT_CHOICES: { value: AlignmentChoice; label: string }[] = [
  { value: "willing", label: "Yes, I'm Willing" },
  { value: "unsure", label: "I'm Not Sure Yet" },
]

/**
 * Tour of the actual Work-Life Balance Business Day™ — shown after Alignment.
 * These are the existing operating modules (times mirror the canonical
 * schedule), revealed one at a time so the founder can experience the
 * architecture before their final decision. No separate public replica.
 */
export interface TourModule {
  name: string
  window: string
  description: string
}

export const TOUR_MODULES: TourModule[] = [
  {
    name: "Flex Time™",
    window: "7:00–9:00 AM",
    description: "Open space before the workday — yours to use for life, not business reaction.",
  },
  {
    name: "Morning GIV•EN™",
    window: "10:15–11:00 AM",
    description: "A grounding start that sets intention before business activity begins.",
  },
  {
    name: "Movement Window™",
    window: "11:00–11:30 AM",
    description: "A protected thirty minutes to move your body inside the workday.",
  },
  {
    name: "Extended Healthy Hybrid Lunch™",
    window: "11:30 AM–1:00 PM",
    description: "Real nourishment and a genuine break — not a working lunch.",
  },
  {
    name: "4-Hour Focused CEO Workday™",
    window: "1:00–5:00 PM",
    description: "Your concentrated CEO work, contained so it can't expand across the whole day.",
  },
  {
    name: "Time Freedom™",
    window: "5:00 PM onward",
    description: "Life gets the evening — protected from being automatically given back to the business.",
  },
  {
    name: "Power Down™",
    window: "10:00–11:00 PM",
    description: "A deliberate close to the day so unfinished work doesn't follow you into the night.",
  },
  {
    name: "Unplug™",
    window: "11:00 PM–7:00 AM",
    description: "Disconnected from business communication and digital demands until the next morning.",
  },
]
