"use client"

/**
 * The Collision Glossary™ used as a history selector. Every category reuses the
 * existing taxonomy; items the member actually recorded are separated from
 * reference-only items, and the records themselves are read from the single
 * saved Boundary Check-In™ history (never duplicated).
 */

import { useMemo, useState } from "react"
import { COLLISION_GROUPS, type CollisionSource } from "@/lib/boundary-check-ins/collisions"
import { formatCheckInDate, useBoundaryCheckIns } from "@/lib/boundary-check-ins/use-boundary-check-ins"
import { addDaysKey, isoToDateKey } from "@/lib/boundary-check-ins/linked"
import type { BoundaryCheckIn } from "@/lib/boundary-check-ins/server"

type Period = "all" | "cycle" | "week1"

type Occurrence = { checkIn: BoundaryCheckIn }

export function CollisionGlossaryHistory({ cycleStart }: { cycleStart?: string | null }) {
  const { checkIns, isLoading } = useBoundaryCheckIns()
  const startKey = isoToDateKey(cycleStart)
  const [period, setPeriod] = useState<Period>("all")

  const inPeriod = useMemo(() => {
    if (!startKey || period === "all") return checkIns
    const endKey = period === "week1" ? addDaysKey(startKey, 6) : addDaysKey(startKey, 29)
    return checkIns.filter((c) => c.checkInDate >= startKey && c.checkInDate <= endKey)
  }, [checkIns, period, startKey])

  const recorded = useMemo(() => {
    const map = new Map<string, Occurrence[]>()
    for (const c of inPeriod) {
      for (const col of c.collisions) {
        const key = `${col.source}:${col.id}`
        map.set(key, [...(map.get(key) ?? []), { checkIn: c }])
      }
    }
    return map
  }, [inPeriod])

  const periods: { id: Period; label: string }[] = [
    { id: "all", label: "All recorded" },
    ...(startKey
      ? ([
          { id: "cycle", label: "This cycle" },
          { id: "week1", label: "Week 1 observation" },
        ] as const)
      : []),
  ]

  return (
    <div className="flex flex-col gap-6">
      {periods.length > 1 && (
        <div role="group" aria-label="History period" className="flex flex-wrap gap-2">
          {periods.map((p) => (
            <button
              key={p.id}
              type="button"
              aria-pressed={period === p.id}
              onClick={() => setPeriod(p.id)}
              className={`rounded-full border px-4 py-1.5 font-sans text-sm font-semibold transition-colors ${
                period === p.id
                  ? "border-[#5B835F] bg-[#5B835F] text-white"
                  : "border-[#E8DFE2] bg-white text-[#3A2E33] hover:bg-black/[0.03]"
              }`}
            >
              {p.label}
            </button>
          ))}
        </div>
      )}

      {isLoading && checkIns.length === 0 ? (
        <p className="font-sans text-sm text-[#6B5860]">Loading your check-ins…</p>
      ) : inPeriod.length === 0 ? (
        <p className="font-sans text-sm leading-relaxed text-[#6B5860]">
          No Boundary Check-Ins™ recorded for this period yet. The glossary below is for reference only.
        </p>
      ) : null}

      {COLLISION_GROUPS.map((g) => (
        <CategoryBlock key={g.source} source={g.source} title={g.title} options={g.options} recorded={recorded} />
      ))}
    </div>
  )
}

function CategoryBlock({
  source,
  title,
  options,
  recorded,
}: {
  source: CollisionSource
  title: string
  options: { id: string; label: string; hint: string }[]
  recorded: Map<string, Occurrence[]>
}) {
  const mine = options.filter((o) => recorded.has(`${source}:${o.id}`))
  const reference = options.filter((o) => !recorded.has(`${source}:${o.id}`))

  return (
    <section aria-label={title} className="flex flex-col gap-3">
      <h4 className="font-montserrat text-[13px] font-bold uppercase tracking-[0.16em] text-[#2E1F27]">{title}</h4>

      {mine.length > 0 ? (
        <div className="flex flex-col gap-2">
          <p className="font-sans text-xs font-bold uppercase tracking-[0.12em] text-[#C0545A]">Recorded in my history</p>
          <ul className="flex flex-col gap-2">
            {mine.map((o) => {
              const occ = recorded.get(`${source}:${o.id}`) ?? []
              return (
                <li key={o.id} className="rounded-2xl border border-[#E26C73]/25 bg-[#FDF6F0] px-4 py-3">
                  <p className="font-sans text-sm font-semibold text-[#2E1F27]">
                    {o.label}{" "}
                    <span className="font-normal text-[#6B5860]">
                      · {occ.length} time{occ.length === 1 ? "" : "s"}
                    </span>
                  </p>
                  <ul className="mt-1.5 flex flex-col gap-1">
                    {occ.map(({ checkIn: c }) => (
                      <li key={c.id} className="font-sans text-sm leading-relaxed text-[#5C4F55]">
                        {formatCheckInDate(c.checkInDate)} · {c.segmentLabel ?? c.segmentId}
                        {c.note && <span className="block text-[#6B5860]">Note: {c.note}</span>}
                      </li>
                    ))}
                  </ul>
                </li>
              )
            })}
          </ul>
        </div>
      ) : (
        <p className="font-sans text-sm text-[#6B5860]">Nothing recorded in this category for this period.</p>
      )}

      {reference.length > 0 && (
        <details className="group/ref">
          <summary className="cursor-pointer list-none font-sans text-sm font-semibold text-[#5B835F] [&::-webkit-details-marker]:hidden">
            <span className="group-open/ref:hidden">Show reference-only items ({reference.length})</span>
            <span className="hidden group-open/ref:inline">Hide reference-only items</span>
          </summary>
          <p className="mt-2 font-sans text-xs text-[#6B5860]">Glossary reference — not recorded in your history.</p>
          <ul className="mt-1.5 flex flex-col gap-1.5">
            {reference.map((o) => (
              <li key={o.id} className="font-sans text-[15px] leading-relaxed text-[#6B5860]">
                <span className="font-semibold text-[#3A2E33]">{o.label}</span> — {o.hint}
              </li>
            ))}
          </ul>
        </details>
      )}
    </section>
  )
}
