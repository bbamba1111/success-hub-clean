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

import type { CheckInMomentConfig, MomentConfig, ResolutionOption } from "@/components/guided-moments/guided-moments"
import { GuidedMoments } from "@/components/guided-moments/guided-moments"
import { getDayKey, saveLocalDay, syncFlexTimeDay } from "@/utils/flex-time-storage"

/**
 * Day-aware borrowing rule for anything left outstanding at the 8:55 check-in:
 *   - Monday: Morning GIV•EN™ is compressed to 45 min (9:45–10:30, after the
 *     Reality Check), so it's never offered. Only Healthy Hybrid Lunch™ or defer.
 *   - Tuesday–Friday: both Morning GIV•EN™ and Healthy Hybrid Lunch™ are
 *     eligible, plus defer.
 */
function getResolutionOptions(now: Date): ResolutionOption[] {
  const isMonday = now.getDay() === 1
  const options: ResolutionOption[] = []
  if (!isMonday) {
    options.push({ id: "morning-given", label: "Morning GIV•EN™", kind: "borrow" })
  }
  options.push({ id: "healthy-hybrid-lunch", label: "Extended Healthy Hybrid Lunch™", kind: "borrow" })
  options.push({ id: "defer", label: "Leave it for today — defer to tomorrow's Flex Time™", kind: "defer" })
  return options
}

/** True at/after 8:55 AM local time (5 minutes before Flex Time's 9:00 AM end). */
function isCheckInAvailable(now: Date): boolean {
  return now.getHours() > 8 || (now.getHours() === 8 && now.getMinutes() >= 55)
}

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
    onContinue: (chosen) => {
      const record = saveLocalDay(getDayKey(), { intended: chosen })
      void syncFlexTimeDay(record)
    },
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
  {
    kind: "checkin",
    id: "check-in",
    sourceMomentId: "making-time-for",
    question: "Which of these did you make time for?",
    helperText: "Select everything you completed — Cherry Blossom will help with the rest.",
    summaryLabel: "8:55 Check-In",
    availableAt: isCheckInAvailable,
    lockedNote: "Check-in opens at 8:55 AM — five minutes before Flex Time™ wraps up.",
    confirmationComplete:
      "Wonderful — you made time for everything you set out to this morning. That's exactly what Flex Time™ is for.",
    confirmationOutstanding:
      "Life happens, and that's exactly why Flex Time™ exists. Let's find a good home for what's still outstanding.",
    getResolutionOptions,
    confirmationResolved: (choice) =>
      choice.kind === "borrow"
        ? `Perfect — you're borrowing time from ${choice.label} to finish up. Your day stays intact.`
        : "That's the whole point of Flex Time™ — you're choosing to let it go today and pick it up again tomorrow.",
    onResolved: ({ completed, outstanding, resolution, resolutionChoice }) => {
      const dayKey = getDayKey()
      const record = saveLocalDay(dayKey, {
        completed,
        outstanding,
        resolution,
        borrowedFrom: resolutionChoice?.kind === "borrow" ? (resolutionChoice.id as "morning-given" | "healthy-hybrid-lunch") : null,
        borrowedItems: resolutionChoice?.kind === "borrow" ? outstanding : [],
        deferredItems: resolutionChoice?.kind === "defer" ? outstanding : [],
        checkedInAt: new Date().toISOString(),
      })
      void syncFlexTimeDay(record)
    },
  } satisfies CheckInMomentConfig,
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
