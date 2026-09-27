"use client"

/**
 * Tour Control™ — Barbara's demonstration surface inside the Developer
 * Toolbar. Its ONE job is to open a segment as a read-only guided preview
 * (a "tour") so she can walk a founder through the Work-Life Balance Business
 * Day™ before Monday, then close the tour when she's done.
 *
 * The governing safeguard (Tour Control note):
 *   AUTOMATION controls LIVE access. BARBARA controls TOUR access.
 *   Neither one overrides the other.
 *
 * So this panel exposes exactly two founder-facing modes per segment —
 * LOCKED (automatic / clock-governed) and TOUR (read-only preview). It does
 * NOT expose a "go live" button: only the scheduled opening time can put a
 * segment into LIVE execution for a paying founder. When the clock currently
 * has a segment live, that's shown as a read-only LIVE badge. Every action
 * writes an invisible audit row via the server actions; members never see
 * this panel.
 */

import { useState, useTransition } from "react"
import { Lock, Eye, RotateCcw, Radio } from "lucide-react"
import { SCHEDULE } from "@/operating-engine"
import { useOperatingEngine } from "@/components/operating-engine-provider"
import { GATED_SEGMENT_IDS, resolveSegmentAccess } from "@/lib/access-control/segment-access"
import {
  tourSegment,
  tourAllSegments,
  lockSegment,
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
  const { tourIds } = useSegmentOverrides()
  const experience = useOperatingEngine()
  const [pending, startTransition] = useTransition()
  const [busyId, setBusyId] = useState<string | null>(null)

  // What the CLOCK grants for a segment right now (ignoring admin bypass and
  // any override) — i.e. whether automation currently has it LIVE for a paying
  // founder. Barbara can't change this; she can only tour a non-live segment.
  const clockLiveFor = (segmentId: string): boolean => {
    if (!experience) return false
    const clock = resolveSegmentAccess({
      segmentId,
      dayOfWeek: experience.time.dayOfWeek,
      minutesSinceMidnight: experience.time.minutesSinceMidnight,
      isAdmin: false,
      override: null,
    })
    return !clock.locked
  }

  const clockLabelFor = (segmentId: string): string | null => {
    if (!experience) return null
    const clock = resolveSegmentAccess({
      segmentId,
      dayOfWeek: experience.time.dayOfWeek,
      minutesSinceMidnight: experience.time.minutesSinceMidnight,
      isAdmin: false,
      override: null,
    })
    if (!clock.locked) return "Live now"
    if (clock.reason === "not-today") return "Not today"
    if (clock.reason === "closed-for-day") return "Closed for today · 5:00 PM"
    return `Opens ${clock.unlockAtLabel}`
  }

  const run = (id: string | null, fn: () => Promise<AccessControlResult>) => {
    setBusyId(id ?? "__all__")
    startTransition(async () => {
      await fn()
      await refreshSegmentOverrides()
      setBusyId(null)
    })
  }

  const anyTouring = tourIds.size > 0

  return (
    <div className="space-y-2.5">
      <div className="flex items-center justify-between">
        <p className="text-[11px] font-semibold uppercase tracking-wide text-slate-400">Tour Control™</p>
        {anyTouring && (
          <span className="rounded-full bg-sky-500/20 px-2 py-0.5 text-[10px] font-semibold text-sky-300">
            {tourIds.size} on tour
          </span>
        )}
      </div>

      <p className="text-[11px] leading-relaxed text-slate-500">
        Open a segment as a read-only <span className="font-semibold text-slate-300">tour preview</span> to demonstrate
        it before Monday. Tour is never live execution — only the scheduled opening time puts a segment{" "}
        <span className="font-semibold text-slate-300">live</span> for a founder.
      </p>

      {/* Bulk controls */}
      <div className="flex gap-1.5">
        <button
          type="button"
          disabled={pending}
          onClick={() => run(null, tourAllSegments)}
          className={cn(
            "flex flex-1 items-center justify-center gap-1.5 rounded-md px-2 py-1.5 text-[11px] font-semibold transition-colors",
            "bg-sky-600 text-white hover:bg-sky-500 disabled:opacity-50",
          )}
        >
          <Eye className="h-3.5 w-3.5" />
          {busyId === "__all__" && pending ? "Working…" : "Tour all"}
        </button>
        <button
          type="button"
          disabled={pending || !anyTouring}
          onClick={() => run(null, returnToAutomatic)}
          className={cn(
            "flex flex-1 items-center justify-center gap-1.5 rounded-md px-2 py-1.5 text-[11px] font-semibold transition-colors",
            "bg-slate-800 text-slate-200 hover:bg-slate-700 disabled:opacity-40",
          )}
        >
          <RotateCcw className="h-3.5 w-3.5" />
          End all tours
        </button>
      </div>

      {/* Per-segment Locked / Tour toggle */}
      <ul className="space-y-1">
        {GATED_SEGMENTS.map((seg) => {
          const isTouring = tourIds.has(seg.id)
          const isBusy = busyId === seg.id && pending
          const isLive = clockLiveFor(seg.id)
          const clockLabel = clockLabelFor(seg.id)

          return (
            <li
              key={seg.id}
              className={cn(
                "flex items-center justify-between gap-2 rounded-md px-2 py-1.5",
                isTouring ? "bg-sky-500/15" : "bg-slate-800",
              )}
            >
              <span className="flex min-w-0 flex-col">
                <span className="truncate text-xs text-slate-200">{seg.title}</span>
                <span className="flex items-center gap-1 text-[10px] font-medium">
                  {isLive ? (
                    <span className="inline-flex items-center gap-1 text-emerald-300">
                      <Radio className="h-2.5 w-2.5" /> Live now · automatic
                    </span>
                  ) : (
                    <span className={cn(isTouring ? "text-sky-300/80" : "text-slate-500")}>
                      {isTouring ? `Tour preview · was ${clockLabel?.toLowerCase()}` : clockLabel}
                    </span>
                  )}
                </span>
              </span>

              {/* When the clock already has it live, there is nothing for
                  Barbara to do — automation owns live access. Otherwise she
                  can flip between Auto (locked) and Tour. */}
              {isLive ? (
                <span className="shrink-0 rounded px-1.5 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-emerald-300/70">
                  Auto
                </span>
              ) : (
                <div className="flex shrink-0 items-center gap-0.5 rounded-md bg-slate-900/60 p-0.5">
                  <button
                    type="button"
                    disabled={pending}
                    onClick={() => run(seg.id, () => lockSegment(seg.id))}
                    className={cn(
                      "flex items-center gap-1 rounded px-1.5 py-1 text-[10px] font-semibold uppercase tracking-wide transition-colors disabled:opacity-50",
                      !isTouring ? "bg-slate-700 text-slate-100" : "text-slate-400 hover:text-slate-200",
                    )}
                    aria-pressed={!isTouring}
                  >
                    <Lock className="h-3 w-3" /> Auto
                  </button>
                  <button
                    type="button"
                    disabled={pending}
                    onClick={() => run(seg.id, () => tourSegment(seg.id))}
                    className={cn(
                      "flex items-center gap-1 rounded px-1.5 py-1 text-[10px] font-semibold uppercase tracking-wide transition-colors disabled:opacity-50",
                      isTouring ? "bg-sky-600 text-white" : "text-slate-400 hover:text-slate-200",
                    )}
                    aria-pressed={isTouring}
                  >
                    {isBusy ? "…" : (<><Eye className="h-3 w-3" /> Tour</>)}
                  </button>
                </div>
              )}
            </li>
          )
        })}
      </ul>
    </div>
  )
}
