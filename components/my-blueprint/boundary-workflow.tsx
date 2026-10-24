"use client"

import { useState } from "react"
import { Check, Circle, Link2, Link2Off } from "lucide-react"
import { useMonthlyBoundaryFocus } from "@/lib/monthly-boundary-focus/use-monthly-boundary-focus"
import { formatCheckInDate, useBoundaryCheckIns } from "@/lib/boundary-check-ins/use-boundary-check-ins"
import { addDaysKey, isoToDateKey, isLinkedTo, workflowWeek } from "@/lib/boundary-check-ins/linked"
import { MonthlyBoundaryFocusPanel } from "@/components/ceo-workday/monthly-boundary-focus-panel"
import { CollisionGlossaryHistory } from "@/components/boundary-check-in/collision-glossary-history"
import type { MonthlyMilestone } from "@/app/actions/monthly-boundary-focus"

const dateFmt = new Intl.DateTimeFormat("en-US", { month: "short", day: "numeric", year: "numeric" })
const fmt = (iso: string | null) => (iso ? dateFmt.format(new Date(iso)) : null)

const label = "font-montserrat text-[11px] font-bold uppercase tracking-[0.16em] text-[#6B5860]"

function useWorkflow() {
  const monthly = useMonthlyBoundaryFocus()
  const { checkIns } = useBoundaryCheckIns()
  const startKey = isoToDateKey(monthly.cycleStart)
  const week1Count = startKey
    ? checkIns.filter((c) => c.checkInDate >= startKey && c.checkInDate <= addDaysKey(startKey, 6)).length
    : 0
  return { ...monthly, checkIns, week: workflowWeek(monthly.cycleStart), week1Count }
}

/** A — 30-Day Boundary Workflow Tracker */
export function BoundaryWorkflowTracker() {
  const { focus, week, week1Count, cycleStart, cycleEnd, entitled, isLoading } = useWorkflow()
  if (isLoading) return <p className="font-sans text-sm text-[#6B5860]">Loading your cycle…</p>
  if (!entitled || !cycleStart) {
    return (
      <p className="font-sans text-sm leading-relaxed text-[#6B5860]">
        Your 30-day boundary workflow appears here once your membership cycle begins.
      </p>
    )
  }

  const steps: { week: 1 | 2 | 3 | 4; title: string; done: boolean; detail: string }[] = [
    {
      week: 1,
      title: "Observe My Collisions",
      done: week1Count > 0,
      detail: week1Count > 0 ? `${week1Count} check-in${week1Count === 1 ? "" : "s"} recorded` : "No check-ins yet",
    },
    {
      week: 2,
      title: "Select My Boundary",
      done: !!focus,
      detail: focus ? focus.boundaryText : "Not selected yet",
    },
    { week: 2, title: "Create My Operating Rule", done: !!focus?.ruleCreatedAt, detail: fmt(focus?.ruleCreatedAt ?? null) ?? "Not marked yet" },
    {
      week: 3,
      title: "Communicate My Rule",
      done: !!focus?.ruleCommunicatedAt,
      detail: fmt(focus?.ruleCommunicatedAt ?? null) ?? "Not marked yet",
    },
    { week: 3, title: "Test My Rule", done: !!focus?.testingStartedAt, detail: fmt(focus?.testingStartedAt ?? null) ?? "Not marked yet" },
    {
      week: 4,
      title: "Review and Refine",
      done: !!focus?.reviewCompletedAt,
      detail: fmt(focus?.reviewCompletedAt ?? null) ?? "Not marked yet",
    },
  ]

  return (
    <div className="flex flex-col gap-4">
      <p className="font-sans text-sm text-[#5C4F55]">
        {fmt(cycleStart)} – {fmt(cycleEnd)}
        {week && <span className="font-semibold text-[#2E1F27]"> · You are in Week {week}</span>}
      </p>
      <ol className="flex flex-col gap-2">
        {steps.map((s) => {
          const current = week === s.week && !s.done
          return (
            <li
              key={s.title}
              className={`flex items-start gap-3 rounded-2xl border px-4 py-3 ${
                current ? "border-[#5B835F] bg-[#F3F8ED]" : "border-[#E8DFE2] bg-white"
              }`}
            >
              {s.done ? (
                <Check className="mt-0.5 h-5 w-5 shrink-0 text-[#5B835F]" aria-label="Complete" />
              ) : (
                <Circle className="mt-0.5 h-5 w-5 shrink-0 text-[#C9BCC1]" aria-label="Not complete" />
              )}
              <div className="flex flex-col">
                <span className={label}>Week {s.week}</span>
                <span className="font-sans text-base font-semibold text-[#2E1F27]">{s.title}</span>
                <span className="font-sans text-sm text-[#6B5860]">{s.detail}</span>
              </div>
            </li>
          )
        })}
      </ol>
    </div>
  )
}

const MILESTONES: { id: MonthlyMilestone; key: "ruleCreatedAt" | "ruleCommunicatedAt" | "testingStartedAt"; title: string }[] = [
  { id: "rule_created", key: "ruleCreatedAt", title: "I created my operating rule" },
  { id: "rule_communicated", key: "ruleCommunicatedAt", title: "I communicated my rule" },
  { id: "testing_started", key: "testingStartedAt", title: "I started testing my rule" },
]

/** B — My Monthly Boundary Focus summary + milestones */
export function MonthlyFocusSummary() {
  const { focus, setMilestone, entitled } = useWorkflow()
  const [busy, setBusy] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)

  async function toggle(id: MonthlyMilestone, done: boolean) {
    setBusy(id)
    setError(null)
    const res = await setMilestone(id, done)
    if (!res.ok) setError(res.error)
    setBusy(null)
  }

  return (
    <div className="flex flex-col gap-5">
      <MonthlyBoundaryFocusPanel />
      {entitled && focus && (
        <div className="flex flex-col gap-2">
          <p className={label}>Implementation milestones</p>
          <ul className="flex flex-col gap-2">
            {MILESTONES.map((m) => {
              const at = focus[m.key]
              return (
                <li key={m.id}>
                  <button
                    type="button"
                    aria-pressed={!!at}
                    disabled={busy === m.id}
                    onClick={() => toggle(m.id, !at)}
                    className="flex w-full items-center justify-between gap-3 rounded-2xl border border-[#E8DFE2] bg-white px-4 py-3 text-left transition-colors hover:bg-black/[0.02] disabled:opacity-60"
                  >
                    <span className="inline-flex items-center gap-2 font-sans text-sm font-semibold text-[#2E1F27]">
                      {at ? (
                        <Check className="h-4 w-4 text-[#5B835F]" aria-hidden />
                      ) : (
                        <Circle className="h-4 w-4 text-[#C9BCC1]" aria-hidden />
                      )}
                      {m.title}
                    </span>
                    <span className="font-sans text-sm text-[#6B5860]">{at ? fmt(at) : "Mark done"}</span>
                  </button>
                </li>
              )
            })}
          </ul>
          {error && (
            <p role="alert" className="font-sans text-sm text-[#C0545A]">
              {error}
            </p>
          )}
        </div>
      )}
    </div>
  )
}

/** C — Collision history with explicit, member-made links to this cycle's boundary */
export function CollisionHistoryWithLinks() {
  const { focus, checkIns, cycleStart } = useWorkflow()
  const { setLink } = useBoundaryCheckIns()
  const [busy, setBusy] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)
  const collided = checkIns.filter((c) => c.collided)

  async function toggle(id: string, linked: boolean) {
    setBusy(id)
    setError(null)
    const res = await setLink(id, linked)
    if (!res.ok) setError(res.error)
    setBusy(null)
  }

  return (
    <div className="flex flex-col gap-8">
      <CollisionGlossaryHistory cycleStart={cycleStart} />

      {focus && collided.length > 0 && (
        <div className="flex flex-col gap-3">
          <p className={label}>Link a collision to “{focus.boundaryText}”</p>
          <p className="font-sans text-sm leading-relaxed text-[#6B5860]">
            Only check-ins you link here appear under this boundary. Nothing is linked automatically.
          </p>
          <ul className="flex flex-col gap-2">
            {collided.map((c) => {
              const linked = isLinkedTo(c, focus.optionId, focus.boundaryText)
              return (
                <li
                  key={c.id}
                  className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-[#E8DFE2] bg-white px-4 py-3"
                >
                  <div className="flex flex-col">
                    <span className="font-sans text-sm font-semibold text-[#2E1F27]">
                      {formatCheckInDate(c.checkInDate)} · {c.segmentLabel ?? c.segmentId}
                    </span>
                    <span className="font-sans text-sm text-[#6B5860]">
                      {c.collisions.map((x) => x.label).join(", ")}
                    </span>
                  </div>
                  <button
                    type="button"
                    aria-pressed={linked}
                    disabled={busy === c.id}
                    onClick={() => toggle(c.id, !linked)}
                    className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1.5 font-sans text-sm font-semibold transition-colors disabled:opacity-60 ${
                      linked
                        ? "border-[#5B835F] bg-[#5B835F] text-white"
                        : "border-[#5B835F]/40 text-[#5B835F] hover:bg-[#F3F8ED]"
                    }`}
                  >
                    {linked ? <Link2Off className="h-4 w-4" aria-hidden /> : <Link2 className="h-4 w-4" aria-hidden />}
                    {linked ? "Unlink" : "Link to my boundary"}
                  </button>
                </li>
              )
            })}
          </ul>
          {error && (
            <p role="alert" className="font-sans text-sm text-[#C0545A]">
              {error}
            </p>
          )}
        </div>
      )}
    </div>
  )
}

/** D — Monthly Boundary Review & History */
export function MonthlyReviewAndHistory() {
  const { focus, history, saveReview, setMilestone, entitled } = useWorkflow()
  const [draft, setDraft] = useState<string | null>(null)
  const [status, setStatus] = useState<string | null>(null)
  const value = draft ?? focus?.reviewNotes ?? ""

  async function save(markComplete: boolean) {
    setStatus(null)
    const res = await saveReview(value)
    if (!res.ok) return setStatus(res.error)
    if (markComplete && !focus?.reviewCompletedAt) {
      const done = await setMilestone("review_completed", true)
      if (!done.ok) return setStatus(done.error)
    }
    setDraft(null)
    setStatus(markComplete ? "Review saved and marked complete." : "Review saved.")
  }

  return (
    <div className="flex flex-col gap-6">
      {entitled && focus ? (
        <div className="flex flex-col gap-2">
          <label htmlFor="monthly-review" className={label}>
            This cycle&apos;s review
          </label>
          <textarea
            id="monthly-review"
            rows={4}
            maxLength={4000}
            value={value}
            onChange={(e) => setDraft(e.target.value)}
            placeholder="What worked, what still collided, and what you'll refine next cycle."
            className="w-full rounded-2xl border border-[#E8DFE2] bg-white px-4 py-3 font-sans text-base leading-relaxed text-[#2E1F27] focus:outline-none focus:ring-2 focus:ring-[#5B835F]/40"
          />
          <div className="flex flex-wrap items-center gap-3">
            <button
              type="button"
              onClick={() => save(false)}
              className="rounded-full border border-[#5B835F]/40 px-4 py-2 font-sans text-sm font-semibold text-[#5B835F] hover:bg-[#F3F8ED]"
            >
              Save review
            </button>
            {!focus.reviewCompletedAt && (
              <button
                type="button"
                onClick={() => save(true)}
                className="rounded-full bg-[#5B835F] px-4 py-2 font-sans text-sm font-semibold text-white hover:bg-[#4C7050]"
              >
                Save and mark review complete
              </button>
            )}
            {focus.reviewCompletedAt && (
              <span className="font-sans text-sm text-[#5B835F]">Completed {fmt(focus.reviewCompletedAt)}</span>
            )}
          </div>
          {status && (
            <p role="status" className="font-sans text-sm text-[#6B5860]">
              {status}
            </p>
          )}
        </div>
      ) : (
        <p className="font-sans text-sm text-[#6B5860]">Select this cycle&apos;s boundary to record a review.</p>
      )}

      <div className="flex flex-col gap-2">
        <p className={label}>Previous cycles</p>
        {history.length === 0 ? (
          <p className="font-sans text-sm text-[#6B5860]">No previous cycles yet.</p>
        ) : (
          <ul className="flex flex-col gap-2">
            {history.map((h) => (
              <li key={h.cycleKey} className="rounded-2xl border border-[#E8DFE2] bg-white px-4 py-3">
                <p className="font-sans text-sm text-[#6B5860]">
                  {fmt(h.cycleStart)} – {fmt(h.cycleEnd)}
                </p>
                <p className="font-sans text-base font-semibold text-[#2E1F27]">{h.boundaryText}</p>
                {h.reviewNotes && (
                  <p className="mt-1 font-sans text-sm leading-relaxed text-[#5C4F55] whitespace-pre-line">{h.reviewNotes}</p>
                )}
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  )
}
