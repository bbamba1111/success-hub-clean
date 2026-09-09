"use client"

/**
 * Work-Life Balance Access Control™ — Barbara's manual-unlock surface inside
 * the Developer Toolbar. Lets an admin force any time-gated segment open ahead
 * of schedule, unlock everything at once, or return the whole day to automatic
 * (clock-governed) access. Every action writes an invisible audit row via the
 * server actions; members never see this panel.
 */

import { useState, useTransition } from "react"
import { Lock, Unlock, LockOpen, RotateCcw } from "lucide-react"
import { SCHEDULE } from "@/operating-engine"
import { useOperatingEngine } from "@/components/operating-engine-provider"
import { GATED_SEGMENT_IDS, resolveSegmentAccess } from "@/lib/access-control/segment-access"
import {
  unlockSegment,
  lockSegment,
  unlockAllSegments,
  returnToAutomatic,
  type AccessControlResult,
} from "@/lib/access-control/actions"
import {
  useSegmentOverrides,
  refreshSegmentOverrides,
} from "@/lib/access-control/use-segment-overrides"
import { cn } from "@/lib/utils"

// Gated segments in schedule order, with their display titles.
const GATED_SEGMENTS = SCHEDULE.filter((b) => GATED_SEGMENT_IDS.has(b.id)).map((b) => ({
  id: b.id,
  title: b.shortTitle,
}))

export function AccessControlPanel() {
  const { unlockedIds } = useSegmentOverrides()
  const experience = useOperatingEngine()
  const [pending, startTransition] = useTransition()
  const [busyId, setBusyId] = useState<string | null>(null)

  // What the CLOCK says for a segment right now (ignoring admin bypass and any
  // override), so Barbara can see which segments are actually locked for
  // members at this moment and choose to override them.
  const clockStatusFor = (segmentId: string) => {
    if (!experience) return null
    return resolveSegmentAccess({
      segmentId,
      dayOfWeek: experience.time.dayOfWeek,
      minutesSinceMidnight: experience.time.minutesSinceMidnight,
      isAdmin: false,
      override: null,
    })
  }

  const run = (id: string | null, fn: () => Promise<AccessControlResult>) => {
    setBusyId(id ?? "__all__")
    startTransition(async () => {
      await fn()
      await refreshSegmentOverrides()
      setBusyId(null)
    })
  }

  const anyUnlocked = unlockedIds.size > 0

  return (
    <div className="space-y-2.5">
      <div className="flex items-center justify-between">
        <p className="text-[11px] font-semibold uppercase tracking-wide text-slate-400">
          Work-Life Balance Access Control™
        </p>
        {anyUnlocked && (
          <span className="rounded-full bg-amber-500/20 px-2 py-0.5 text-[10px] font-semibold text-amber-300">
            {unlockedIds.size} unlocked
          </span>
        )}
      </div>

      <p className="text-[11px] leading-relaxed text-slate-500">
        Manually open a segment ahead of its scheduled time. Unlocked segments bypass the clock for every member
        until you return them to automatic.
      </p>

      {/* Bulk controls */}
      <div className="flex gap-1.5">
        <button
          type="button"
          disabled={pending}
          onClick={() => run(null, unlockAllSegments)}
          className={cn(
            "flex flex-1 items-center justify-center gap-1.5 rounded-md px-2 py-1.5 text-[11px] font-semibold transition-colors",
            "bg-emerald-600 text-white hover:bg-emerald-500 disabled:opacity-50",
          )}
        >
          <LockOpen className="h-3.5 w-3.5" />
          {busyId === "__all__" && pending ? "Working…" : "Unlock all"}
        </button>
        <button
          type="button"
          disabled={pending || !anyUnlocked}
          onClick={() => run(null, returnToAutomatic)}
          className={cn(
            "flex flex-1 items-center justify-center gap-1.5 rounded-md px-2 py-1.5 text-[11px] font-semibold transition-colors",
            "bg-slate-800 text-slate-200 hover:bg-slate-700 disabled:opacity-40",
          )}
        >
          <RotateCcw className="h-3.5 w-3.5" />
          Return to automatic
        </button>
      </div>

      {/* Per-segment toggles */}
      <ul className="space-y-1">
        {GATED_SEGMENTS.map((seg) => {
          const isUnlocked = unlockedIds.has(seg.id)
          const isBusy = busyId === seg.id && pending
          const clock = clockStatusFor(seg.id)
          // What members experience right now on the clock (before override).
          const clockLabel = !clock
            ? null
            : clock.reason === "not-today"
              ? "Not today"
              : clock.reason === "closed-for-day"
                ? "Closed for today · 5:00 PM"
                : clock.locked
                  ? `Locked · opens ${clock.unlockAtLabel}`
                  : "Open now"
          return (
            <li key={seg.id}>
              <button
                type="button"
                disabled={pending}
                onClick={() =>
                  run(seg.id, () => (isUnlocked ? lockSegment(seg.id) : unlockSegment(seg.id)))
                }
                className={cn(
                  "flex w-full items-center justify-between gap-2 rounded-md px-2 py-1.5 text-left text-xs transition-colors disabled:opacity-50",
                  isUnlocked
                    ? "bg-emerald-500/15 text-emerald-200 hover:bg-emerald-500/25"
                    : "bg-slate-800 text-slate-300 hover:bg-slate-700",
                )}
              >
                <span className="flex min-w-0 flex-col">
                  <span className="truncate">{seg.title}</span>
                  {clockLabel && (
                    <span
                      className={cn(
                        "text-[10px] font-medium normal-case tracking-normal",
                        isUnlocked
                          ? "text-emerald-300/70"
                          : clock?.locked
                            ? "text-amber-400/80"
                            : "text-slate-500",
                      )}
                    >
                      {isUnlocked ? `Override active · was ${clockLabel.toLowerCase()}` : clockLabel}
                    </span>
                  )}
                </span>
                <span className="flex shrink-0 items-center gap-1 text-[10px] font-semibold uppercase tracking-wide">
                  {isBusy ? (
                    "…"
                  ) : isUnlocked ? (
                    <>
                      <Unlock className="h-3 w-3" /> Unlocked
                    </>
                  ) : (
                    <>
                      <Lock className="h-3 w-3" /> Auto
                    </>
                  )}
                </span>
              </button>
            </li>
          )
        })}
      </ul>
    </div>
  )
}
