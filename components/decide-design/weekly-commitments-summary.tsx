"use client"

/**
 * THIS WEEK'S WORK-LIFE BALANCE COMMITMENTS™
 * ---------------------------------------------------------------------------
 * Replaces the old CEO Workday DESIGN form inside "Design My Work-Life Balance
 * Business Day™" and is reused Monday–Thursday for visibility. A simple summary
 * of the three priorities with a lightweight status each — not a task board.
 *
 * The live GPS CEO Workday™ (FounderGpsWorkspace) is where real business work
 * happens and is deliberately not referenced from here.
 */

import { useWeeklyCommitments } from "@/lib/weekly-commitments/use-weekly-commitments"
import {
  DELEGATION_STATUS_LABEL,
  LIFE_STATUS_LABEL,
  LIFE_WINDOW_LABEL,
  OPERATING_RULE_STATUS_LABEL,
  type DelegationStatus,
  type LifePriorityStatus,
  type OperatingRuleStatus,
} from "@/lib/weekly-commitments/types"

function StatusSelect<T extends string>({
  id,
  value,
  labels,
  onChange,
}: {
  id: string
  value: T
  labels: Record<T, string>
  onChange: (v: T) => void
}) {
  return (
    <select
      id={id}
      value={value}
      onChange={(e) => onChange(e.target.value as T)}
      className="rounded-full border border-[#E8DFE2] bg-white px-3 py-1.5 font-sans text-xs font-semibold text-[#3A2E33] focus:outline-none focus:ring-2 focus:ring-[#8DAE72]/30"
    >
      {(Object.keys(labels) as T[]).map((k) => (
        <option key={k} value={k}>
          {labels[k]}
        </option>
      ))}
    </select>
  )
}

function Row({
  title,
  value,
  meta,
  control,
}: {
  title: string
  value: string | null
  meta?: string
  control: React.ReactNode
}) {
  return (
    <div className="rounded-2xl border border-[#E8DFE2] bg-white px-5 py-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
      <div className="min-w-0">
        <p className="font-montserrat text-[10px] font-bold uppercase tracking-[0.18em] text-[#6B5860]/60">{title}</p>
        <p className="mt-1 font-sans text-sm font-semibold text-[#2E1F27]">
          {value ?? <span className="font-normal text-[#6B5860]">Not chosen yet</span>}
        </p>
        {meta && <p className="mt-0.5 font-sans text-xs text-[#6B5860]">{meta}</p>}
      </div>
      {value && <div className="shrink-0">{control}</div>}
    </div>
  )
}

export function WeeklyCommitmentsSummary({ showHeading = true }: { showHeading?: boolean }) {
  const { commitments: c, setStatus } = useWeeklyCommitments()

  return (
    <div className="space-y-4">
      {showHeading && (
        <div>
          <p className="font-montserrat text-sm font-bold uppercase tracking-[0.18em] text-[#5B835F]">
            This Week&apos;s Work-Life Balance Commitments™
          </p>
        </div>
      )}

      <div className="space-y-2.5">
        <Row
          title="Weekly Life Priority™"
          value={c.lifePriority}
          meta={c.lifeWindows.length ? c.lifeWindows.map((w) => LIFE_WINDOW_LABEL[w]).join(" · ") : undefined}
          control={
            <StatusSelect<LifePriorityStatus>
              id="life-status"
              value={c.lifeStatus}
              labels={LIFE_STATUS_LABEL}
              onChange={(v) => void setStatus({ lifeStatus: v })}
            />
          }
        />
        <Row
          title="Weekly Delegation Priority™"
          value={c.delegationPriority}
          control={
            <StatusSelect<DelegationStatus>
              id="delegation-status"
              value={c.delegationStatus}
              labels={DELEGATION_STATUS_LABEL}
              onChange={(v) => void setStatus({ delegationStatus: v })}
            />
          }
        />
        <Row
          title="Weekly Operating Rule Priority™"
          value={c.operatingRule}
          control={
            <StatusSelect<OperatingRuleStatus>
              id="operating-rule-status"
              value={c.operatingRuleStatus}
              labels={OPERATING_RULE_STATUS_LABEL}
              onChange={(v) => void setStatus({ operatingRuleStatus: v })}
            />
          }
        />
      </div>

      <p className="font-sans text-sm text-[#3A2E33] leading-relaxed text-pretty">
        These are the three changes you are carrying into the week. Your protected CEO Workday™ remains the place where
        you do your real business work.
      </p>
    </div>
  )
}
