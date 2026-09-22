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
    id: "enter-workweek",
    title: "Enter the Workweek Differently",
    question:
      "Would you be willing to redesign how you enter your workweek rather than beginning Monday by immediately reacting to your business?",
  },
  {
    id: "start-intentionally",
    title: "Start Intentionally",
    question: "Would you be willing to begin your workday with Morning GIV•EN™ before moving into business activity?",
  },
  {
    id: "protect-body",
    title: "Protect Your Body",
    question: "Would you be willing to protect the 30-Minute Movement Window™ as part of your workday?",
  },
  {
    id: "protect-nourishment",
    title: "Protect Nourishment",
    question:
      "Would you be willing to protect the Extended Healthy Hybrid Lunch™ rather than allowing work to consume that time?",
  },
  {
    id: "contain-work",
    title: "Contain the Work",
    question:
      "Would you be willing to bring your actual CEO work into the 4-Hour Focused CEO Workday™ rather than allowing focused work to expand across the day?",
  },
  {
    id: "let-life-have-space",
    title: "Let Life Have Space",
    question:
      "Would you be willing to protect Time Freedom™ for the parts of life that matter to you without automatically giving that time back to your business?",
  },
  {
    id: "end-workday",
    title: "End the Workday",
    question:
      "Would you be willing to Power Down™ rather than continuing to carry unfinished work into your evening?",
  },
  {
    id: "disconnect",
    title: "Disconnect",
    question: "Would you be willing to Unplug™ from business communication and digital demands at the designated time?",
  },
  {
    id: "redesign-workweek",
    title: "Redesign the Workweek",
    question:
      "Would you be willing to experience a 4-Day Workweek™ with a 3-Day Weekend™ rather than assuming every business week requires five days of work?",
  },
  {
    id: "honor-boundaries",
    title: "Honor the Boundaries",
    question:
      "Would you be willing to let these boundaries remain boundaries—even when your business tries to pull you beyond them?",
  },
]

export const ALIGNMENT_FINAL: AlignmentQuestion = {
  id: "ready-to-experience",
  title: "Ready to Experience It?",
  question: "Are you willing to experience a Work-Life Balance Business Week™ built around these boundaries?",
}

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
