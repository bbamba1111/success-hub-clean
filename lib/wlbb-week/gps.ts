import type { BusinessOutcome, DailyEntry, WlbbDayKey } from "./types"

/**
 * The Weekly WLBB GPS™ — a small, deterministic "next best move" helper.
 * This is intentionally NOT the AI-powered `lib/founder-gps/` architecture
 * (that system is disconnected/architecture-only). This is a pure,
 * explainable function scoped to this week's chosen outcomes: no AI calls,
 * no external state.
 *
 * Priority order:
 *  1. An outcome carried forward from a prior day and still not completed.
 *  2. An outcome selected for today but not yet completed.
 *  3. An outcome not yet started this week at all.
 *  4. Everything selected is done — protect the win.
 *  5. No outcomes chosen yet — point back to the Debrief™.
 */
export function getGpsRecommendation(outcomes: BusinessOutcome[], today: DailyEntry | undefined): string {
  if (outcomes.length === 0) {
    return "You haven't set this week's Business Outcomes yet — start with the Monday Debrief™ to choose 1–3."
  }

  const completedIds = new Set(today?.completedOutcomeIds ?? [])
  const carriedForward = outcomes.filter(
    (o) => today?.carriedForwardOutcomeIds.includes(o.id) && !completedIds.has(o.id),
  )
  if (carriedForward.length > 0) {
    return `Pick this back up: "${carriedForward[0].text}" carried forward — it's still your highest-leverage move today.`
  }

  const selectedTodayNotDone = outcomes.filter(
    (o) => today?.selectedOutcomeIds.includes(o.id) && !completedIds.has(o.id),
  )
  if (selectedTodayNotDone.length > 0) {
    return `Stay with it: "${selectedTodayNotDone[0].text}" is selected for today and not yet complete.`
  }

  const notStarted = outcomes.filter((o) => o.status === "not-started")
  if (notStarted.length > 0) {
    return `Next best move: start "${notStarted[0].text}" — it's on this week's WLBB Menu and hasn't been touched yet.`
  }

  const allDone = outcomes.every((o) => o.status === "completed")
  if (allDone) {
    return "Everything on this week's WLBB Menu is complete — protect what you finished and use today's CEO Workday for Deep Work™."
  }

  return "Review this week's WLBB Menu and choose what deserves your CEO Workday today."
}

/** Which outcomes should silently carry forward into `day` because they were selected but not completed on a prior day. */
export function computeCarryForward(
  outcomes: BusinessOutcome[],
  daily: Partial<Record<WlbbDayKey, DailyEntry>>,
  priorDays: WlbbDayKey[],
): string[] {
  const completed = new Set<string>()
  const selected = new Set<string>()
  for (const day of priorDays) {
    const entry = daily[day]
    if (!entry) continue
    entry.completedOutcomeIds.forEach((id) => completed.add(id))
    entry.selectedOutcomeIds.forEach((id) => selected.add(id))
  }
  return outcomes
    .filter((o) => selected.has(o.id) && !completed.has(o.id))
    .map((o) => o.id)
}
