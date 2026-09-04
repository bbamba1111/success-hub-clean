"use client"

/**
 * This Week's Three Priorities™ — inside the live CEO Workday™.
 *
 * Read-only mirror of the three Weekly Priorities™ the founder chose in
 * Decide & Design™ (Supabase `weekly_commitments`, via the shared SWR hook,
 * so it updates the moment "Save My Week" lands). Nothing here is GPS-authored
 * and nothing is a task list — these are the three conditions the founder is
 * operating under this week, kept in view while she works.
 */

import Link from "next/link"
import { ArrowRight, Compass } from "lucide-react"

import { useWeeklyCommitments } from "@/lib/weekly-commitments/use-weekly-commitments"
import type { WeeklyCommitments } from "@/lib/weekly-commitments/types"

const STATUS_LABEL: Record<string, string> = {
  "not-planned": "Not yet planned",
  "not-started": "Not started",
  planned: "Planned",
  "in-progress": "In progress",
  experienced: "Experienced",
  delegated: "Delegated",
  completed: "Completed",
  implemented: "In place",
  "needs-adjustment": "Needs adjustment",
  deferred: "Deferred",
  changed: "Changed",
  "no-longer-needed": "No longer needed",
}

const DONE = new Set(["experienced", "delegated", "completed", "implemented"])

function pick(c: WeeklyCommitments) {
  return [
    {
      key: "life",
      label: "Weekly Life Priority™",
      lead: "I am protecting",
      value: c.lifePriority,
      intention: c.lifeIntention,
      status: c.lifeStatus,
    },
    {
      key: "delegation",
      label: "Weekly Delegation Priority™",
      lead: "I am moving off my plate",
      value: c.delegationPriority,
      intention: c.delegationIntention,
      status: c.delegationStatus,
    },
    {
      key: "rule",
      label: "Weekly Operating Rule Priority™",
      lead: "I am changing how work operates",
      value: c.operatingRule,
      intention: c.operatingRuleIntention,
      status: c.operatingRuleStatus,
    },
  ]
}

export function WeeklyPrioritiesPanel() {
  const { commitments, isLoading } = useWeeklyCommitments()
  if (isLoading && !commitments.id) return null

  const rows = pick(commitments)
  const chosen = rows.filter((r) => r.value)

  return (
    <section
      aria-labelledby="weekly-priorities-heading"
      className="rounded-3xl border border-[#8DAE72]/30 bg-[#F4F7F0] px-6 py-7 sm:px-8 space-y-5"
    >
      <div className="flex items-center gap-2.5">
        <Compass className="h-5 w-5 text-[#5A7A45]" aria-hidden />
        <p
          id="weekly-priorities-heading"
          className="font-montserrat text-xs font-bold uppercase tracking-[0.18em] text-[#5A7A45]"
        >
          This Week&apos;s Three Priorities™
        </p>
      </div>

      {chosen.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-[#8DAE72]/40 bg-white px-6 py-6 flex flex-col gap-3 items-start">
          <p className="font-sans text-sm leading-relaxed text-[#6B5860] text-pretty">
            Your three weekly priorities haven&apos;t been chosen yet. Decide them in Decide &amp; Design and they
            will appear here for the rest of the week.
          </p>
          <Link
            href="/?openSpace=debrief"
            className="inline-flex items-center gap-1.5 font-sans text-sm font-bold text-[#5A7A45] hover:underline"
          >
            Open Decide &amp; Design
            <ArrowRight className="h-4 w-4" aria-hidden />
          </Link>
        </div>
      ) : (
        <ul className="grid gap-3 md:grid-cols-3">
          {rows.map((r) => (
            <li key={r.key} className="rounded-2xl border border-[#E8DFE2] bg-white px-5 py-5 flex flex-col gap-3">
              <div className="flex items-start justify-between gap-2">
                <p className="font-montserrat text-[10px] font-bold uppercase tracking-[0.16em] text-[#6B5860]">
                  {r.label}
                </p>
                {r.value && (
                  <span
                    className={
                      "shrink-0 inline-flex items-center rounded-full px-2.5 py-1 font-montserrat text-[9px] font-bold uppercase tracking-[0.12em] whitespace-nowrap " +
                      (DONE.has(r.status) ? "bg-[#8DAE72]/20 text-[#5A7A45]" : "bg-[#F4F7F0] text-[#6B5860]")
                    }
                  >
                    {STATUS_LABEL[r.status] ?? r.status}
                  </span>
                )}
              </div>

              {r.value ? (
                <>
                  <p className="font-display text-lg font-semibold leading-snug text-[#2E1F27] text-pretty">
                    {r.value}
                  </p>
                  {r.intention && (
                    <p className="font-sans text-sm leading-relaxed text-[#3A2E33] text-pretty">{r.intention}</p>
                  )}
                </>
              ) : (
                <p className="font-sans text-sm leading-relaxed text-[#6B5860]">
                  <span className="font-semibold">{r.lead}:</span> still to choose in Decide &amp; Design.
                </p>
              )}
            </li>
          ))}
        </ul>
      )}
    </section>
  )
}
