import type { AlignmentChoice } from "@/lib/boundary-report/types"

/**
 * Work-Life Balance Alignment™ — the final three-question section of the
 * Reality Check. It measures willingness and implementation readiness; it
 * does not gate access to the Boundary Report™.
 */

export interface AlignmentQuestion {
  id: string
  title: string
  question: string
}

export const ALIGNMENT_QUESTIONS: AlignmentQuestion[] = [
  {
    id: "healthier-daily-rhythm",
    title: "A Healthier Daily Rhythm",
    question:
      "Are you willing to establish a healthier daily rhythm for yourself and your business?",
  },
  {
    id: "protect-what-matters",
    title: "Protect What Matters",
    question:
      "Are you willing to establish and honor boundaries that protect your time, energy, relationships, and well-being?",
  },
  {
    id: "experience-business-week",
    title: "Implementation Readiness",
    question:
      "Are you ready to experience the Work-Life Balance Business Week™ and practice these changes inside your business?",
  },
]

/** Responses for the first two willingness questions. */
export const ALIGNMENT_CHOICES: { value: AlignmentChoice; label: string }[] = [
  { value: "willing", label: "Yes, I'm Willing" },
  { value: "unsure", label: "I'm Not Sure Yet" },
]

/** The final readiness question deliberately preserves all four levels of intent. */
export const ALIGNMENT_READINESS_CHOICES: { value: AlignmentChoice; label: string }[] = [
  { value: "ready", label: "Yes, I'm ready" },
  { value: "interested", label: "I'm interested, but I have questions" },
  { value: "unsure", label: "I'm not sure yet" },
  { value: "not_at_this_time", label: "Not at this time" },
]

export function formatAlignmentChoice(choice: AlignmentChoice): string {
  switch (choice) {
    case "willing":
      return "Yes, I'm Willing"
    case "ready":
      return "Yes, I'm ready"
    case "interested":
      return "I'm interested, but I have questions"
    case "not_at_this_time":
      return "Not at this time"
    case "unsure":
    default:
      return "I'm Not Sure Yet"
  }
}

/**
 * Map an older in-progress draft into the three-question structure without
 * discarding its existing answers. A grouped answer is marked willing only
 * when every recorded legacy answer in that group was willing.
 */
export function normalizeAlignmentChoices(
  raw: Record<string, AlignmentChoice> | null | undefined,
  legacyFinal?: AlignmentChoice,
): Record<string, AlignmentChoice> {
  const source = raw ?? {}
  const ids = ALIGNMENT_QUESTIONS.map((q) => q.id)
  const hasCurrentAnswers = ids.some((id) => source[id] !== undefined)
  if (hasCurrentAnswers) {
    return Object.fromEntries(ids.flatMap((id) => source[id] ? [[id, source[id]]] : []))
  }

  const consolidate = (legacyIds: string[]): AlignmentChoice | undefined => {
    const answers = legacyIds.map((id) => source[id]).filter(Boolean)
    if (answers.length === 0) return undefined
    return answers.every((answer) => answer === "willing") ? "willing" : "unsure"
  }

  const migrated: Record<string, AlignmentChoice> = {}
  const rhythm = consolidate([
    "enter-workweek",
    "start-intentionally",
    "protect-body",
    "protect-nourishment",
    "contain-work",
  ])
  const boundaries = consolidate([
    "let-life-have-space",
    "end-workday",
    "disconnect",
    "redesign-workweek",
    "honor-boundaries",
  ])
  if (rhythm) migrated["healthier-daily-rhythm"] = rhythm
  if (boundaries) migrated["protect-what-matters"] = boundaries

  const oldReadiness = source["ready-to-experience"] ?? legacyFinal
  if (oldReadiness) migrated["experience-business-week"] = oldReadiness === "willing" ? "ready" : "unsure"
  return migrated
}

/**
 * Tour of the actual Work-Life Balance Business Day™ — shown after Alignment.
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
