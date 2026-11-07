/**
 * Phase 1: Decide → Embody — the Time & Space Boundary™ segments a founder
 * can forward an opportunity-originated decision to. Single source of truth
 * shared by the Decide UI (segment picker) and the declaration API route
 * (prompt building). Mirrors operating-engine/config/space-labels.ts's
 * SPACE_LABEL for this subset — Monday-only and GPS-window blocks
 * (monday-flex, monday-reality-check, monday-debrief, daily-planning-gps,
 * digital-detox) are intentionally excluded; those aren't places a founder's
 * chosen action gets executed.
 */

export interface SegmentOption {
  id: string
  /** Founder-facing display name, used in both the picker and generated text. */
  label: string
  /** Light keywords used to suggest a default segment from the founder's own words. */
  keywords: string[]
}

export const SEGMENT_OPTIONS: SegmentOption[] = [
  { id: "early-access", label: "Flex Time & Preparation™", keywords: ["prepare", "plan", "organize", "early"] },
  { id: "morning-given", label: "Morning GIV•EN™ Routine", keywords: ["morning", "gratitude", "vision", "meditate"] },
  {
    id: "movement-window",
    label: "30-Minute Movement Window™",
    keywords: ["walk", "move", "exercise", "workout", "stretch", "run"],
  },
  { id: "lunch-break", label: "Extended Healthy Hybrid Lunch™", keywords: ["lunch", "eat", "meal", "nourish"] },
  { id: "ceo-workday", label: "4-Hour Focused CEO Workday™", keywords: ["work", "focus", "deep work", "project"] },
  { id: "time-freedom", label: "Time Freedom™ window", keywords: ["family", "present", "rest", "personal"] },
  { id: "power-down", label: "Power Down™ evening routine", keywords: ["sleep", "wind down", "evening", "bedtime"] },
]

export const SEGMENT_DISPLAY_NAMES: Record<string, string> = Object.fromEntries(
  SEGMENT_OPTIONS.map((s) => [s.id, s.label]),
)

/** Light keyword match against the founder's own chosen-action text; falls back to the first option. */
export function suggestSegmentId(actionText: string): string {
  const lower = actionText.toLowerCase()
  const match = SEGMENT_OPTIONS.find((option) => option.keywords.some((kw) => lower.includes(kw)))
  return match?.id ?? SEGMENT_OPTIONS[0].id
}
