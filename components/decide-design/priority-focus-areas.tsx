"use client"

/**
 * MY 3 PRIORITY FOCUS AREAS™ — at the top of Decide & Design™.
 *
 * Shows the priorities chosen in the latest Weekly 7-Day Work-Life Balance
 * Audit™; if none have been chosen yet, falls back to the full Work-Life
 * Balance Reality Check™. The source and date are always shown.
 */

import { RotateCcw, Target } from "lucide-react"
import { useCurrentPriorityFocus } from "@/lib/boundary-report/use-current-priority-focus"
import { formatAuditDate } from "@/components/weekly-audit/weekly-results"

export function PriorityFocusAreas() {
  const { data: focus, isLoading } = useCurrentPriorityFocus()
  const areas = focus?.priorityAreas ?? []

  return (
    <div
      id="priority-focus-areas"
      className="scroll-mt-24 rounded-3xl border border-brand-sage-medium/30 bg-brand-sage-light/60 shadow-sm px-6 py-6 sm:px-8 sm:py-7 space-y-4"
    >
      <div className="flex items-center gap-2">
        <Target className="h-4 w-4 text-brand-tan-dark" aria-hidden />
        <p className="font-montserrat text-base font-bold uppercase tracking-[0.18em] text-brand-sage-dark">
          My 3 Priority Focus Areas™
        </p>
      </div>

      {isLoading ? (
        <p className="font-sans text-sm text-[#6B5860]">Loading your Priority Focus Areas™…</p>
      ) : focus && areas.length > 0 ? (
        <>
          <p className="font-sans text-sm text-[#3A2E33] leading-relaxed text-pretty">
            {focus.source === "weekly_7_day"
              ? `From your Weekly 7-Day Work-Life Balance Audit™, completed ${formatAuditDate(focus.date)}.`
              : `From your Work-Life Balance Reality Check™, completed ${formatAuditDate(focus.date)}. Retake your audit to update them for this week.`}
          </p>
          <ul className="flex flex-wrap gap-2">
            {areas.map((a) => (
              <li
                key={a.key}
                className="inline-flex items-center gap-1.5 rounded-full border border-brand-tan/40 bg-white px-4 py-2 font-sans text-sm font-semibold text-[#3A2E33]"
              >
                {a.label}
                <span className="text-brand-tan-dark">{Math.round(a.score)}</span>
              </li>
            ))}
          </ul>
          <div className="flex flex-wrap items-center gap-x-5 gap-y-2">
            {focus.source === "weekly_7_day" && (
              <a
                href="/focus-areas"
                className="inline-flex w-fit font-sans text-sm font-semibold text-brand-sage-dark underline-offset-4 hover:underline"
              >
                Revise My Priority Focus Areas™
              </a>
            )}
            <a
              href="/audit"
              className="inline-flex w-fit items-center gap-1.5 font-sans text-sm font-semibold text-brand-tan-dark underline-offset-4 hover:underline"
            >
              <RotateCcw className="h-3.5 w-3.5" aria-hidden />
              Retake Audit
            </a>
          </div>
        </>
      ) : (
        <div className="space-y-3">
          <p className="font-sans text-sm text-[#3A2E33] leading-relaxed text-pretty">
            You haven&apos;t chosen Priority Focus Areas™ yet. Take your Weekly 7-Day Work-Life Balance Audit™ on Monday,
            and the one to three areas you choose will appear here to anchor your week.
          </p>
          <a
            href="/audit"
            className="inline-flex w-fit items-center rounded-full bg-brand-sage-dark px-5 py-2.5 font-sans text-sm font-semibold text-white hover:opacity-90"
          >
            Take My 7-Day Audit™
          </a>
        </div>
      )}
    </div>
  )
}
