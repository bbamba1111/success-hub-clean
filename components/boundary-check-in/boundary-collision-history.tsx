"use client"

/**
 * Read-only history of saved Boundary Check-In™ records, grouped by date then
 * segment. When `boundaryOptionId`/`boundaryText` are given, only records
 * associated with that boundary are shown; records with no association are
 * kept as-is (never re-attributed).
 */

import { COLLISION_SOURCE_LABEL } from "@/lib/boundary-check-ins/collisions"
import { formatCheckInDate, useBoundaryCheckIns } from "@/lib/boundary-check-ins/use-boundary-check-ins"
import type { ActivityStatus, BoundaryCheckIn } from "@/lib/boundary-check-ins/server"

const ACTIVITY_LABEL: Record<ActivityStatus, string> = {
  completed: "Completed",
  partial: "Partially completed",
  not_completed: "Not completed",
  no_activity: "No specific activity planned",
}

interface Props {
  boundaryOptionId?: string | null
  boundaryText?: string | null
  /** Show the boundary label on each record (Blueprint shows all boundaries). */
  showBoundary?: boolean
  emptyMessage?: string
}

function matchesBoundary(c: BoundaryCheckIn, optionId?: string | null, text?: string | null) {
  if (optionId && optionId !== "custom" && c.boundaryOptionId) return c.boundaryOptionId === optionId
  if (text && c.boundaryText) return c.boundaryText.trim().toLowerCase() === text.trim().toLowerCase()
  return false
}

export function BoundaryCollisionHistory({ boundaryOptionId, boundaryText, showBoundary, emptyMessage }: Props) {
  const { checkIns, isLoading } = useBoundaryCheckIns()
  const filtered =
    boundaryOptionId || boundaryText ? checkIns.filter((c) => matchesBoundary(c, boundaryOptionId, boundaryText)) : checkIns

  if (isLoading && checkIns.length === 0) {
    return <p className="font-sans text-sm text-[#6B5860]">Loading your check-ins…</p>
  }
  if (filtered.length === 0) {
    return (
      <p className="font-sans text-sm leading-relaxed text-[#6B5860]">
        {emptyMessage ?? "No Boundary Check-Ins™ saved yet. They appear here after you answer one at the end of a segment."}
      </p>
    )
  }

  const recurring = new Map<string, { label: string; count: number }>()
  for (const c of filtered) {
    for (const col of c.collisions) {
      if (col.id === "nothing-collided") continue
      const key = `${col.source}:${col.id}`
      const entry = recurring.get(key) ?? { label: col.label, count: 0 }
      entry.count += 1
      recurring.set(key, entry)
    }
  }
  const repeated = Array.from(recurring.values()).filter((r) => r.count > 1).sort((a, b) => b.count - a.count)

  const byDate = new Map<string, BoundaryCheckIn[]>()
  for (const c of filtered) byDate.set(c.checkInDate, [...(byDate.get(c.checkInDate) ?? []), c])

  return (
    <div className="flex flex-col gap-5">
      {repeated.length > 0 && (
        <div className="rounded-2xl border border-[#E26C73]/20 bg-[#FDF6F0] px-5 py-4">
          <p className="mb-2 font-montserrat text-[10px] font-bold uppercase tracking-[0.14em] text-[#C0545A]">
            Showing up more than once
          </p>
          <ul className="flex flex-wrap gap-2">
            {repeated.map((r) => (
              <li key={r.label} className="rounded-full border border-[#E26C73]/25 bg-white px-3 py-1 font-sans text-xs text-[#3A2E33]">
                {r.label} <span className="text-[#6B5860]">· {r.count} times</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      <ol className="flex flex-col gap-4">
        {Array.from(byDate.entries()).map(([date, records]: [string, BoundaryCheckIn[]]) => (
          <li key={date} className="flex flex-col gap-2">
            <p className="font-sans text-xs font-semibold uppercase tracking-[0.12em] text-[#6B5860]">{formatCheckInDate(date)}</p>
            <ul className="flex flex-col gap-2">
              {records.map((c) => (
                <li key={c.id} className="rounded-2xl border border-[#E8DFE2] bg-white px-4 py-3">
                  <div className="flex flex-wrap items-baseline justify-between gap-2">
                    <p className="font-sans text-sm font-semibold text-[#2E1F27]">{c.segmentLabel ?? c.segmentId}</p>
                    <span className={`font-sans text-xs font-semibold ${c.collided ? "text-[#C0545A]" : "text-[#5A7A45]"}`}>
                      {c.collided ? "Something collided" : "Nothing collided"}
                    </span>
                  </div>
                  {c.activityStatus && (
                    <p className="mt-1 font-sans text-xs text-[#5C4F55]">
                      Activity: {ACTIVITY_LABEL[c.activityStatus]}
                    </p>
                  )}
                  {showBoundary && (
                    <p className="mt-1 font-sans text-xs text-[#6B5860]">
                      Boundary: {c.boundaryText ?? "No boundary was set for this week"}
                    </p>
                  )}
                  {c.collisions.length > 0 && (
                    <ul className="mt-2 flex flex-wrap gap-1.5">
                      {c.collisions.map((col) => (
                        <li
                          key={`${col.source}:${col.id}`}
                          title={COLLISION_SOURCE_LABEL[col.source]}
                          className="rounded-full bg-[#F4F7F0] px-2.5 py-0.5 font-sans text-xs text-[#3A2E33]"
                        >
                          {col.label}
                        </li>
                      ))}
                    </ul>
                  )}
                  {c.note && (
                    <p className="mt-2 font-sans text-sm leading-relaxed text-[#5C4F55]">
                      <span className="font-semibold">Next time: </span>
                      {c.note}
                    </p>
                  )}
                </li>
              ))}
            </ul>
          </li>
        ))}
      </ol>
    </div>
  )
}
