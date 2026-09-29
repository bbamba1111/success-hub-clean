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
import { isSegmentCheckInOpen, segmentCheckinLabel } from "@/lib/daily-plan/segment-checkin-timing"
import { SleepTrackerMorningCard } from "@/components/guided-moments/sleep-tracker-morning-card"

/**
 * Flex Time™ is the "early-access" segment (7:00–9:00 AM). Its check-in time
 * is derived from that segment's actual end — end − 5 min — via the shared
 * timing rule, NOT a hard-coded 8:55. If the segment's end ever changes, the
 * check-in follows automatically.
 */
const FLEX_TIME_CHECKIN_LABEL = segmentCheckinLabel("early-access")

/**
 * Borrowing rule for anything left outstanding at the 8:55 check-in.
 *
 * Per the Flex Time™ operating rule: the Extended Healthy Hybrid Lunch™ is the
 * ONLY segment Flex Time™ may borrow from (up to 1 hour), on every day. Morning
 * GIV•EN™ is protected and never borrowed, and neither is Movement™, Reality
 * Check™, Decide & Design™, the Transition Break™, the CEO Workday™, Time
 * Freedom™, or Power Down & Unplug™. The only alternative to borrowing from
 * lunch is to defer the outstanding item to tomorrow's Flex Time™.
 */
function getResolutionOptions(_now: Date): ResolutionOption[] {
  return [
    { id: "healthy-hybrid-lunch", label: "Extended Healthy Hybrid Lunch™ — up to 1 hour", kind: "borrow" },
    { id: "defer", label: "Leave it for today — defer to tomorrow's Flex Time™", kind: "defer" },
  ]
}

/** Open once the local clock reaches Flex Time's end − 5 min, derived from the schedule. */
function isCheckInAvailable(now: Date): boolean {
  return isSegmentCheckInOpen("early-access", now)
}

const FLEX_TIME_MOMENTS: MomentConfig[] = [
  {
    id: "making-time-for",
    question: "What are you making time for this morning?",
    helperText: "Select all that apply.",
    multiSelect: true,
    allowOther: true,
    otherPrompt: "What else are you making time for?",
    summaryLabel: "You are making time for:",
    standoutTitle: "What You Intended",
    confirmation:
      "Great choices. You're intentionally making room for what needs your attention this morning while protecting the rhythm of the day ahead.",
    onContinue: (chosen) => {
      const record = saveLocalDay(getDayKey(), { intended: chosen })
      void syncFlexTimeDay(record)
    },
    options: [
      { id: "important-personal-appointment", label: "Important personal appointment" },
      { id: "medical-appointment", label: "Medical appointment" },
      { id: "family-responsibility", label: "Family responsibility" },
      { id: "school-drop-off", label: "School drop-off" },
      { id: "personal-errand", label: "Personal errand" },
      { id: "networking-meeting", label: "Networking meeting" },
      { id: "business-meeting", label: "Business meeting" },
      { id: "breakfast-meeting", label: "Breakfast meeting" },
      { id: "prepare-workspace", label: "Prepare my workspace" },
      { id: "extra-sleep", label: "Extra sleep / recovery" },
      { id: "other", label: "Other" },
    ],
  },
  {
    kind: "checkin",
    id: "check-in",
    sourceMomentId: "making-time-for",
    question: "Which of these did you make time for?",
    helperText: "Select everything you completed — Cherry Blossom will help with the rest.",
    summaryLabel: `${FLEX_TIME_CHECKIN_LABEL} Check-In`,
    standoutTitle: "What You Completed",
    availableAt: isCheckInAvailable,
    lockedNote: `Check-in opens at ${FLEX_TIME_CHECKIN_LABEL} — five minutes before Flex Time™ wraps up.`,
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
    <>
      {/* Outstanding "From last night" Sleep Tracker™ completion — renders only
          when there's a pending intention whose morning has arrived. Sits above
          the morning Moments without interrupting Morning GIV•EN™. */}
      <SleepTrackerMorningCard />
      <GuidedMoments
        moments={FLEX_TIME_MOMENTS}
        summaryTitle="Today's Flex Time™"
        summaryLeadIn="You're making time for:"
        summaryConfirmation="Beautiful. You've intentionally created room for the responsibilities and experiences that matter this morning while keeping your CEO Workday™ protected."
        copy={{ label: "Copy My Morning Plan", buildText: buildCopyText }}
        confirmationHoldMs={8000}
      />
    </>
  )
}

export default FlexTimeGuidedMoments
