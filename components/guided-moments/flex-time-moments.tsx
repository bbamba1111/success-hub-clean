"use client"

/**
 * Flex Time & Preparation™ — the first segment built on the Guided Moments™
 * pattern. Replaces the old chip-picker / "I am committed to…" / Intention
 * Declaration™ workflow with a single guided question:
 *
 *   "What are you making time for this morning?"
 *
 * Members simply tell Cherry Blossom™ what they're making room for — no
 * planner, no declaration to draft.
 */

import type { MomentConfig } from "@/components/guided-moments/guided-moments"
import { GuidedMoments } from "@/components/guided-moments/guided-moments"

const FLEX_TIME_MOMENTS: MomentConfig[] = [
  {
    id: "making-time-for",
    question: "What are you making time for this morning?",
    helperText: "Select all that apply.",
    multiSelect: true,
    allowOther: true,
    otherPrompt: "What else are you making time for?",
    summaryLabel: "What I'm Making Time For",
    confirmation:
      "Great choices. You're intentionally making room for what needs your attention this morning while protecting the rhythm of the day ahead.",
    options: [
      { id: "morning-routine", label: "Morning routine" },
      { id: "extra-sleep", label: "Extra sleep / recovery" },
      { id: "family-responsibilities", label: "Family responsibilities" },
      { id: "school-drop-off", label: "School drop-off" },
      { id: "medical-appointment", label: "Medical appointment" },
      { id: "networking-breakfast", label: "Networking breakfast" },
      { id: "personal-errands", label: "Personal errands" },
      { id: "prepare-workspace", label: "Prepare my workspace" },
      { id: "quiet-reflection", label: "Quiet reflection" },
      { id: "other", label: "Other" },
    ],
  },
]

function buildCopyText(selectionsByMoment: Record<string, string[]>): string {
  const chosen = (selectionsByMoment["making-time-for"] ?? []).map((v) =>
    v.startsWith("Other:") ? v.slice("Other:".length).trim() : v.toLowerCase(),
  )
  if (chosen.length === 0) return ""
  const list =
    chosen.length === 1
      ? chosen[0]
      : chosen.length === 2
        ? `${chosen[0]} and ${chosen[1]}`
        : `${chosen.slice(0, -1).join(", ")}, and ${chosen[chosen.length - 1]}`
  return `I'm using Flex Time™ this morning for ${list} before the day begins.`
}

export function FlexTimeGuidedMoments() {
  return (
    <GuidedMoments
      moments={FLEX_TIME_MOMENTS}
      summaryTitle="Today's Flex Time™"
      summaryLeadIn="You're making time for:"
      summaryConfirmation="Beautiful. You've intentionally created room for the responsibilities and experiences that matter this morning while keeping your CEO Workday™ protected."
      copy={{ label: "Copy My Morning Plan", buildText: buildCopyText }}
    />
  )
}

export default FlexTimeGuidedMoments
