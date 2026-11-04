"use client"

/**
 * CEO Workday™ ↔ AI workforce. Every plan item is carried by a `boss_jobs`
 * row; this reads those jobs and lets the founder say who does each piece:
 * herself, Cherry Blossom™, or one executive. Decisions and approvals are
 * never made here — they stay on the Phase 4 job board.
 */

import useSWR from "swr"
import { useState } from "react"
import { ArrowUpRight, CheckCircle2, Hourglass, Inbox, Users } from "lucide-react"
import { loadWorkdayJobs, setJobAssignee, type WorkdayJobView } from "@/app/actions/boss-jobs"
import { EXECUTIVES, assigneeName, labelFor, JOB_STATUSES, type AssigneeType } from "@/lib/boss/jobs/definitions"
import { CEO_FUNCTION_LABEL, type CeoBusinessFunction, type CeoPlanItem } from "@/lib/ceo-workday/plan-types"

export const WORKDAY_FUNCTIONS: CeoBusinessFunction[] = [
  "client-attraction",
  "sales-conversion",
  "delivery",
  "operations",
  "operations-design",
  "trust-experiences",
  "own-work",
]

const SUGGESTED_EXECUTIVE: Partial<Record<CeoBusinessFunction, string>> = {
  "client-attraction": "marketing-brand",
  "sales-conversion": "sales",
  delivery: "client-success",
  operations: "operations",
  "operations-design": "operations",
  "trust-experiences": "growth",
  "own-work": "strategy",
}

const DECISIONS_PATH = "/boss/queue"

export function useWorkdayJobs(items: CeoPlanItem[]) {
  const ids = items.map((i) => i.jobId).filter((id): id is string => !!id).sort()
  const { data, mutate } = useSWR(ids.length ? ["workday-jobs", ...ids] : null, () => loadWorkdayJobs(ids), {
    refreshInterval: 30_000,
  })
  const byId = new Map((data ?? []).map((j) => [j.id, j]))
  return { jobsById: byId, refreshJobs: mutate }
}

function needsFounder(job: WorkdayJobView) {
  return !job.stopped && (job.status === "waiting_for_you" || job.status === "needs_help" || !!job.pendingApproval)
}

/* ── Function switcher ───────────────────────────────────────────────────── */

export function FunctionSwitcher({
  items,
  value,
  onChange,
}: {
  items: CeoPlanItem[]
  value: CeoBusinessFunction | "all"
  onChange: (v: CeoBusinessFunction | "all") => void
}) {
  const count = (f: CeoBusinessFunction) => items.filter((i) => i.businessFunction === f).length
  const chip = (active: boolean) =>
    `inline-flex items-center gap-1.5 rounded-full border px-3 py-1.5 font-sans text-sm font-semibold transition-colors ${
      active ? "border-[#5A7A45] bg-[#5A7A45] text-white" : "border-[#E8DFE2] bg-white text-[#3A2E33] hover:border-[#5A7A45]/60"
    }`
  return (
    <nav aria-label="Business functions" className="flex flex-col gap-2">
      <p className="font-montserrat text-[13px] font-bold uppercase tracking-[0.16em] text-[#6B5860]">Pick a business area</p>
      <div className="flex flex-wrap gap-2">
        <button type="button" aria-pressed={value === "all"} onClick={() => onChange("all")} className={chip(value === "all")}>
          All work <span className="opacity-70">{items.length}</span>
        </button>
        {WORKDAY_FUNCTIONS.map((f) => (
          <button key={f} type="button" aria-pressed={value === f} onClick={() => onChange(f)} className={chip(value === f)}>
            {CEO_FUNCTION_LABEL[f]} <span className="opacity-70">{count(f)}</span>
          </button>
        ))}
      </div>
    </nav>
  )
}

/* ── Today's workforce summary ───────────────────────────────────────────── */

export function WorkforceSummary({ items, jobsById }: { items: CeoPlanItem[]; jobsById: Map<string, WorkdayJobView> }) {
  const linked = items.map((i) => ({ item: i, job: i.jobId ? jobsById.get(i.jobId) : undefined }))
  const withWorkforce = linked.filter(({ job }) => job && job.assigneeType !== "founder" && job.status !== "done" && !job.stopped)
  const waiting = linked.filter(({ job }) => job && needsFounder(job))
  const done = linked.filter(({ item, job }) => item.status === "completed" || job?.status === "done")

  return (
    <section aria-labelledby="workforce-today" className="rounded-3xl border border-[#E8DFE2] bg-white px-5 py-5 sm:px-6">
      <h3 id="workforce-today" className="font-montserrat text-[14px] font-bold uppercase tracking-[0.18em] text-[#5A7A45]">
        Your team today
      </h3>
      <div className="mt-3 grid gap-3 sm:grid-cols-3">
        <SummaryColumn
          icon={<Users className="h-4 w-4" aria-hidden />}
          title="Being worked on for you"
          empty="Nothing given to Cherry Blossom™ or an executive yet."
          rows={withWorkforce.map(({ item, job }) => ({
            id: item.id,
            title: item.title,
            sub: `${assigneeName(job!.assigneeType, job!.assigneeExecutiveId, null, [])} · ${labelFor(JOB_STATUSES, job!.status)}`,
          }))}
        />
        <SummaryColumn
          icon={<Inbox className="h-4 w-4" aria-hidden />}
          title="Needs your decision"
          empty="No decisions or approvals waiting."
          rows={waiting.map(({ item, job }) => ({
            id: item.id,
            title: item.title,
            sub: job!.pendingApproval ? `Approve: ${job!.pendingApproval}` : job!.waitingQuestion ?? "Needs your help",
          }))}
          action={waiting.length > 0 ? { href: DECISIONS_PATH, label: "Decide now" } : undefined}
        />
        <SummaryColumn
          icon={<CheckCircle2 className="h-4 w-4" aria-hidden />}
          title="Finished today"
          empty="Finished work shows up here."
          rows={done.map(({ item, job }) => ({
            id: item.id,
            title: item.title,
            sub: job?.whatsReady ?? item.expectedEvidence ?? "Done",
          }))}
        />
      </div>
    </section>
  )
}

function SummaryColumn({
  icon,
  title,
  empty,
  rows,
  action,
}: {
  icon: React.ReactNode
  title: string
  empty: string
  rows: Array<{ id: string; title: string; sub: string }>
  action?: { href: string; label: string }
}) {
  return (
    <div className="flex flex-col gap-2 rounded-2xl bg-[#FAF8F5] px-4 py-3">
      <p className="flex items-center gap-2 font-sans text-sm font-bold text-[#2E1F27]">
        <span className="text-[#5A7A45]">{icon}</span>
        {title}
        <span className="ml-auto rounded-full bg-white px-2 py-0.5 text-[13px] text-[#6B5860]">{rows.length}</span>
      </p>
      {rows.length === 0 ? (
        <p className="font-sans text-sm leading-relaxed text-[#6B5860]">{empty}</p>
      ) : (
        <ul className="flex flex-col gap-1.5">
          {rows.slice(0, 5).map((r) => (
            <li key={r.id} className="font-sans text-sm leading-snug">
              <span className="font-semibold text-[#2E1F27]">{r.title}</span>
              <span className="block text-[#6B5860] line-clamp-2">{r.sub}</span>
            </li>
          ))}
        </ul>
      )}
      {action && (
        <a href={action.href} className="mt-auto inline-flex items-center gap-1 font-sans text-sm font-bold text-[#C0545A] hover:underline">
          {action.label} <ArrowUpRight className="h-3.5 w-3.5" aria-hidden />
        </a>
      )}
    </div>
  )
}

/* ── Per-assignment: who's doing it, progress, results ───────────────────── */

type AssigneeChoice = "founder" | "cherry" | `exec:${string}`

function choiceOf(job: WorkdayJobView): AssigneeChoice {
  if (job.assigneeType === "executive" && job.assigneeExecutiveId) return `exec:${job.assigneeExecutiveId}`
  return job.assigneeType === "cherry" ? "cherry" : "founder"
}

export function ItemWorkforceRow({
  item,
  job,
  onChanged,
}: {
  item: CeoPlanItem
  job: WorkdayJobView | undefined
  onChanged: () => void
}) {
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)
  if (!item.jobId) return null
  if (!job) {
    return <p className="mt-2 font-sans text-sm text-[#6B5860]">Loading who is doing this…</p>
  }
  const suggested = SUGGESTED_EXECUTIVE[item.businessFunction]

  async function change(value: AssigneeChoice) {
    setSaving(true)
    setError(null)
    const input: { type: AssigneeType; executiveId?: string } = value.startsWith("exec:")
      ? { type: "executive", executiveId: value.slice(5) }
      : { type: value as "founder" | "cherry" }
    const res = await setJobAssignee(job!.id, input)
    setSaving(false)
    if (!res.ok) setError(res.error)
    onChanged()
  }

  const finished = job.status === "done"
  return (
    <div className="mt-3 flex flex-col gap-2 rounded-xl border border-[#E8DFE2] bg-[#FAF8F5] px-3 py-2.5">
      <div className="flex flex-wrap items-center gap-2">
        <label className="flex items-center gap-2">
          <span className="font-sans text-sm font-semibold text-[#6B5860]">Who does this?</span>
          <select
            value={choiceOf(job)}
            disabled={saving || finished || job.stopped}
            onChange={(e) => void change(e.target.value as AssigneeChoice)}
            className="rounded-lg border border-[#E8DFE2] bg-white px-2 py-1 font-sans text-sm font-bold text-[#2E1F27] focus:outline-none focus:ring-2 focus:ring-[#8DAE72]/30 disabled:opacity-60"
          >
            <option value="founder">Me</option>
            <option value="cherry">Cherry Blossom™ (she picks the right executive)</option>
            {EXECUTIVES.map((e) => (
              <option key={e.id} value={`exec:${e.id}`}>
                {e.name}
                {e.id === suggested ? " (best fit)" : ""}
              </option>
            ))}
          </select>
        </label>
        <span className="ml-auto inline-flex items-center gap-1 rounded-full bg-white px-2.5 py-0.5 font-sans text-sm font-semibold text-[#3A2E33]">
          {job.paused ? "Paused" : job.stopped ? "Stopped" : labelFor(JOB_STATUSES, job.status)}
        </span>
      </div>

      {job.blockedBy > 0 && !finished && (
        <p className="flex items-center gap-1.5 font-sans text-sm text-[#6B5860]">
          <Hourglass className="h-3.5 w-3.5" aria-hidden />
          Waiting on {job.blockedBy === 1 ? "one piece of work" : `${job.blockedBy} pieces of work`} to finish first.
        </p>
      )}
      {job.whatsReady && (
        <p className="font-sans text-sm leading-relaxed text-[#3A2E33]">
          <span className="font-bold text-[#5A7A45]">What&apos;s ready:</span> {job.whatsReady}
        </p>
      )}
      {needsFounder(job) && (
        <a
          href={DECISIONS_PATH}
          className="inline-flex w-fit items-center gap-1 rounded-full bg-[#C0545A] px-3 py-1 font-sans text-sm font-bold text-white hover:opacity-90"
        >
          {job.pendingApproval ? "Approval needed — review it" : "Your answer is needed"}
          <ArrowUpRight className="h-3.5 w-3.5" aria-hidden />
        </a>
      )}
      {error && (
        <p role="alert" className="font-sans text-sm text-[#C0545A]">
          {error}
        </p>
      )}
    </div>
  )
}
