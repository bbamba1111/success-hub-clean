"use client"

/**
 * MY 3 PRIORITY FOCUS AREAS™ — carried over from the Reality Check™
 * ---------------------------------------------------------------------------
 * Replaces the full Reality Check review at the top of Decide & Design™. It
 * brings over ONLY the 1–3 Priority Focus Areas™ the founder surfaced in their
 * most recent Work-Life Balance Reality Check™ (Thursday/Sunday), so they can
 * anchor the week's redesign and feed the 4-Hour CEO Workday Declaration™.
 *
 * It is not a retake and not a second report — just the focus areas, brought
 * forward.
 */

import { useEffect, useState } from "react"
import { Target } from "lucide-react"
import { getLatestBoundaryReport } from "@/lib/boundary-report/actions"
import type { BoundaryReportData } from "@/lib/boundary-report/types"

export function PriorityFocusAreas() {
  const [report, setReport] = useState<BoundaryReportData | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let active = true
    getLatestBoundaryReport()
      .then((res) => {
        if (active) setReport(res?.data ?? null)
      })
      .catch(() => {
        if (active) setReport(null)
      })
      .finally(() => {
        if (active) setLoading(false)
      })
    return () => {
      active = false
    }
  }, [])

  const areas = report?.priorityAreas ?? []

  return (
    <div className="rounded-3xl border border-[#C0545A]/20 bg-[#FDF8F5] shadow-sm px-6 py-6 sm:px-8 sm:py-7 space-y-4">
      <div className="flex items-center gap-2">
        <Target className="h-4 w-4 text-[#C0545A]" aria-hidden />
        <p className="font-montserrat text-base font-bold uppercase tracking-[0.18em] text-[#C0545A]">
          My 3 Priority Focus Areas™
        </p>
      </div>

      {loading ? (
        <p className="font-sans text-sm text-[#6B5860]">Loading your Priority Focus Areas™…</p>
      ) : areas.length > 0 ? (
        <>
          <p className="font-sans text-sm text-[#3A2E33] leading-relaxed text-pretty">
            Carried over from your last Work-Life Balance Reality Check™. Let these anchor the week you redesign below —
            they also feed your CEO Workday Declaration™.
          </p>
          <ul className="flex flex-wrap gap-2">
            {areas.map((a) => (
              <li
                key={a.key}
                className="inline-flex items-center gap-1.5 rounded-full border border-[#C0545A]/25 bg-white px-4 py-2 font-sans text-sm font-semibold text-[#3A2E33]"
              >
                {a.label}
                <span className="text-[#C0545A]">{Math.round(a.score)}</span>
              </li>
            ))}
          </ul>
        </>
      ) : (
        <div className="space-y-3">
          <p className="font-sans text-sm text-[#3A2E33] leading-relaxed text-pretty">
            You haven&apos;t completed a Work-Life Balance Reality Check™ yet. Take it on Thursday or Sunday, and your 3
            Priority Focus Areas™ will appear here to anchor your week.
          </p>
          <a
            href="/reality-check"
            className="inline-flex w-fit items-center rounded-full bg-[#C0545A] px-5 py-2.5 font-sans text-sm font-semibold text-white hover:opacity-90"
          >
            Take My Reality Check™
          </a>
        </div>
      )}
    </div>
  )
}
