"use client"

/**
 * WeeklyMenu™ — the Tuesday–Thursday daily view of this week's Weekly WLBB
 * Menu, rendered inline inside the CEO Workspace™ (`ceo-workday` accordion).
 * Monday sees the full Debrief™ flow instead (`components/debrief-space.tsx`).
 *
 * Lets the founder: select which outcome(s) they're working on today, mark
 * complete, carry forward, defer, or add a new outcome mid-week. Reads/writes
 * through the same `lib/wlbb-week` module as the Debrief™, so it's the same
 * weekly record — not a separate system.
 */

import { useEffect, useMemo, useState } from "react"
import { CheckCircle2, Circle, Compass, CornerDownRight, Plus, X } from "lucide-react"
import { BUSINESS_AREAS, getAreaById } from "@/lib/wlbb-week/catalog"
import {
  getWeekKey,
  loadWeek,
  setOutcomes,
  updateDailyEntry,
  getDailyEntry,
} from "@/lib/wlbb-week/storage"
import { computeCarryForward, getGpsRecommendation } from "@/lib/wlbb-week/gps"
import type { BusinessOutcome, WlbbDayKey, WlbbWeekState } from "@/lib/wlbb-week/types"

const DAY_ORDER: WlbbDayKey[] = ["monday", "tuesday", "wednesday", "thursday"]

function priorDays(day: WlbbDayKey): WlbbDayKey[] {
  const index = DAY_ORDER.indexOf(day)
  return DAY_ORDER.slice(0, index)
}

export function WeeklyMenu({ day }: { day: WlbbDayKey }) {
  const [week, setWeek] = useState<WlbbWeekState | null>(null)
  const [addingOutcome, setAddingOutcome] = useState(false)
  const [addAreaId, setAddAreaId] = useState<string | null>(null)

  useEffect(() => {
    const loaded = loadWeek(getWeekKey())
    // Reconcile carry-forward on load: anything selected-but-not-completed on a prior day
    // silently carries into today's entry (no action needed from the founder).
    const carriedIds = computeCarryForward(loaded.business.outcomes, loaded.daily, priorDays(day))
    const today = getDailyEntry(loaded, day)
    if (carriedIds.length > 0 && carriedIds.some((id) => !today.carriedForwardOutcomeIds.includes(id))) {
      const merged = updateDailyEntry(loaded, day, {
        carriedForwardOutcomeIds: Array.from(new Set([...today.carriedForwardOutcomeIds, ...carriedIds])),
      })
      setWeek(merged)
    } else {
      setWeek(loaded)
    }
  }, [day])

  const today = useMemo(() => (week ? getDailyEntry(week, day) : null), [week, day])

  const gpsRecommendation = useMemo(() => {
    if (!week || !today) return null
    return getGpsRecommendation(week.business.outcomes, today)
  }, [week, today])

  if (!week || !today) {
    return null
  }

  function toggleSelectedToday(outcomeId: string) {
    if (!week) return
    const selected = today!.selectedOutcomeIds.includes(outcomeId)
      ? today!.selectedOutcomeIds.filter((id) => id !== outcomeId)
      : [...today!.selectedOutcomeIds, outcomeId]
    setWeek(updateDailyEntry(week, day, { selectedOutcomeIds: selected }))
  }

  function markComplete(outcomeId: string) {
    if (!week) return
    const completed = today!.completedOutcomeIds.includes(outcomeId)
      ? today!.completedOutcomeIds.filter((id) => id !== outcomeId)
      : [...today!.completedOutcomeIds, outcomeId]
    let next = updateDailyEntry(week, day, {
      completedOutcomeIds: completed,
      carriedForwardOutcomeIds: today!.carriedForwardOutcomeIds.filter((id) => id !== outcomeId),
    })
    const outcomes = next.business.outcomes.map((o) =>
      o.id === outcomeId
        ? {
            ...o,
            status: completed.includes(outcomeId) ? ("completed" as const) : ("not-started" as const),
            completedOn: completed.includes(outcomeId) ? new Date().toISOString() : undefined,
          }
        : o,
    )
    next = setOutcomes(next, outcomes)
    setWeek(next)
  }

  function deferOutcome(outcomeId: string) {
    if (!week) return
    const outcomes = week.business.outcomes.map((o) =>
      o.id === outcomeId ? { ...o, status: "deferred" as const } : o,
    )
    setWeek(setOutcomes(week, outcomes))
  }

  function addOutcome(catalogOutcomeId: string) {
    if (!week || !addAreaId) return
    const area = getAreaById(addAreaId)
    const catalogOutcome = area?.outcomes.find((o) => o.id === catalogOutcomeId)
    if (!area || !catalogOutcome) return
    const alreadyOnMenu = week.business.outcomes.some((o) => o.id === catalogOutcomeId)
    if (alreadyOnMenu) return
    const newOutcome: BusinessOutcome = {
      id: catalogOutcome.id,
      areaId: area.id,
      areaName: area.name,
      text: catalogOutcome.text,
      operatingBehaviors: [],
      primaryExecutiveIds: catalogOutcome.primaryExecutiveIds,
      supportingExecutiveIds: catalogOutcome.supportingExecutiveIds,
      status: "not-started",
      scheduledDay: day,
      addedOn: new Date().toISOString(),
    }
    setWeek(setOutcomes(week, [...week.business.outcomes, newOutcome]))
    setAddingOutcome(false)
    setAddAreaId(null)
  }

  const dayLabel = day.charAt(0).toUpperCase() + day.slice(1)

  return (
    <div className="mb-8 rounded-2xl border border-brand-green/20 bg-brand-green/[0.04] px-6 py-6 sm:px-8">
      <div className="flex items-center justify-between gap-3">
        <div>
          <p className="ds-eyebrow text-brand-green-dark/70">This Week&apos;s Weekly WLBB Menu™</p>
          <p className="mt-1 font-sans text-sm text-brand-ink-soft/80">{dayLabel} — pick up where the week left off.</p>
        </div>
        <Compass className="h-5 w-5 shrink-0 text-brand-green" aria-hidden />
      </div>

      {week.business.outcomes.length === 0 ? (
        <p className="mt-4 font-sans text-sm text-brand-ink-soft/70">
          No outcomes set for this week yet — visit Monday&apos;s Debrief™ to build your menu.
        </p>
      ) : (
        <ul className="mt-4 space-y-2">
          {week.business.outcomes.map((outcome) => {
            const isSelected = today.selectedOutcomeIds.includes(outcome.id)
            const isCompleted = today.completedOutcomeIds.includes(outcome.id)
            const isCarried = today.carriedForwardOutcomeIds.includes(outcome.id) && !isCompleted
            return (
              <li
                key={outcome.id}
                className={`flex flex-wrap items-center justify-between gap-3 rounded-xl border bg-white px-4 py-3 ${
                  isCompleted ? "border-brand-green/30" : "border-black/[0.06]"
                }`}
              >
                <button
                  type="button"
                  onClick={() => toggleSelectedToday(outcome.id)}
                  className="flex min-w-0 flex-1 items-start gap-2.5 text-left"
                >
                  {isCompleted ? (
                    <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-brand-green" aria-hidden />
                  ) : (
                    <Circle
                      className={`mt-0.5 h-4 w-4 shrink-0 ${isSelected ? "text-brand-green" : "text-brand-ink-soft/40"}`}
                      aria-hidden
                    />
                  )}
                  <span className={`font-sans text-sm ${isCompleted ? "text-brand-ink-soft/60 line-through" : "text-brand-ink"}`}>
                    {outcome.text}
                    {isCarried && (
                      <span className="ml-2 inline-flex items-center gap-1 rounded-full bg-[#E26C73]/10 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-[#C0545A]">
                        <CornerDownRight className="h-2.5 w-2.5" aria-hidden />
                        Carried forward
                      </span>
                    )}
                  </span>
                </button>
                <div className="flex shrink-0 items-center gap-2">
                  <button
                    type="button"
                    onClick={() => markComplete(outcome.id)}
                    className="rounded-full border border-brand-green/30 px-3 py-1 font-sans text-xs font-semibold text-brand-green-dark transition-colors hover:bg-brand-green/10"
                  >
                    {isCompleted ? "Completed" : "Mark Complete"}
                  </button>
                  {!isCompleted && (
                    <button
                      type="button"
                      onClick={() => deferOutcome(outcome.id)}
                      className="rounded-full border border-black/10 px-3 py-1 font-sans text-xs text-brand-ink-soft/70 transition-colors hover:bg-black/[0.03]"
                    >
                      Defer
                    </button>
                  )}
                </div>
              </li>
            )
          })}
        </ul>
      )}

      {gpsRecommendation && (
        <div className="mt-4 rounded-xl border border-brand-green/20 bg-white px-4 py-3">
          <p className="font-sans text-[11px] font-semibold uppercase tracking-[0.12em] text-brand-green-dark">
            Weekly WLBB GPS™
          </p>
          <p className="mt-1 font-sans text-sm leading-relaxed text-brand-ink">{gpsRecommendation}</p>
        </div>
      )}

      <div className="mt-4">
        {!addingOutcome ? (
          <button
            type="button"
            onClick={() => setAddingOutcome(true)}
            className="inline-flex items-center gap-1.5 font-sans text-sm font-semibold text-brand-green-dark hover:underline"
          >
            <Plus className="h-3.5 w-3.5" aria-hidden />
            Add an outcome mid-week
          </button>
        ) : (
          <div className="space-y-3 rounded-xl border border-black/[0.06] bg-white p-4">
            <div className="flex items-center justify-between">
              <p className="font-sans text-xs font-semibold uppercase tracking-wide text-brand-ink-soft/70">
                Add an outcome
              </p>
              <button
                type="button"
                onClick={() => {
                  setAddingOutcome(false)
                  setAddAreaId(null)
                }}
                aria-label="Cancel"
                className="text-brand-ink-soft/50 hover:text-brand-ink"
              >
                <X className="h-4 w-4" aria-hidden />
              </button>
            </div>
            <div className="flex flex-wrap gap-2">
              {BUSINESS_AREAS.map((area) => (
                <button
                  key={area.id}
                  type="button"
                  onClick={() => setAddAreaId(area.id)}
                  aria-pressed={addAreaId === area.id}
                  className={`rounded-full px-3 py-1.5 font-sans text-xs transition-colors ${
                    addAreaId === area.id
                      ? "bg-brand-green text-white"
                      : "border border-brand-green/25 bg-brand-green/5 text-brand-ink"
                  }`}
                >
                  {area.name}
                </button>
              ))}
            </div>
            {addAreaId && (
              <div className="grid gap-1.5 sm:grid-cols-2">
                {getAreaById(addAreaId)
                  ?.outcomes.filter((o) => !week.business.outcomes.some((existing) => existing.id === o.id))
                  .map((outcome) => (
                    <button
                      key={outcome.id}
                      type="button"
                      onClick={() => addOutcome(outcome.id)}
                      className="rounded-lg border border-black/[0.06] bg-white px-3 py-2 text-left font-sans text-xs text-brand-ink hover:border-brand-green/40"
                    >
                      {outcome.text}
                    </button>
                  ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
