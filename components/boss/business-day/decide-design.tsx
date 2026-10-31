"use client"

import { useState } from "react"
import { AlertTriangle, ArrowLeft, ArrowRight, CheckCircle2, Plus } from "lucide-react"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { useBoss } from "@/lib/boss/store"
import { authorityFor, canProceed } from "@/lib/boss/reducer"
import { FOUNDER_CAPACITY_MINS, FUNCTIONS, isClosed } from "@/lib/boss/constants"
import { formatDuration, formatStamp } from "@/lib/boss/clock"
import type { DayPhase } from "@/lib/boss/clock"
import { EmptyState, MoreDetails, Panel, StatusBadge, bigButton } from "../primitives"
import { WorkItemCard, type WorkCardHandlers } from "./work-item-card"
import { OutcomesEditor } from "./outcomes-editor"

export function usePlan() {
  const { state } = useBoss()
  const plan = state.work.filter((w) => w.inTodayPlan && w.parentId === null).sort((a, b) => a.rank - b.rank)
  const planAll = state.work.filter((w) => w.inTodayPlan)
  const open = plan.filter((w) => !isClosed(w.status))
  const founderMins = planAll
    .filter((w) => w.assigneeId === "R-FOUNDER" && !isClosed(w.status))
    .reduce((s, w) => s + w.effortMins, 0)
  const oversightMins = planAll
    .filter((w) => w.assigneeId !== "R-FOUNDER" && !isClosed(w.status))
    .reduce((s, w) => s + w.effortMins, 0)
  return { plan, planAll, open, founderMins, oversightMins }
}

function planChecks(state: ReturnType<typeof useBoss>["state"], items: ReturnType<typeof usePlan>["planAll"], totalMins: number) {
  const open = items.filter((w) => !isClosed(w.status))
  const titles = (list: typeof open) => list.map((w) => w.title).join(", ")
  const unassigned = open.filter((w) => !w.assigneeId)
  const notAllowed = open.filter((w) => w.assigneeId && authorityFor(state, w.assigneeId, w).status === "not_authorized")
  const noOutcome = open.filter((w) => !w.outcome.trim())
  return [
    { ok: state.day.outcomes.length > 0, label: "You have at least one goal.", detail: "Go back to Decide and add a goal." },
    { ok: unassigned.length === 0, label: "Every task has someone to do it.", detail: `No one yet: ${titles(unassigned)}` },
    {
      ok: open.every((w) => !w.assigneeId || canProceed(authorityFor(state, w.assigneeId, w)) || authorityFor(state, w.assigneeId, w).status === "external"),
      label: "Everyone is allowed to do their task.",
      detail: `Needs your OK: ${titles(notAllowed)}`,
    },
    { ok: noOutcome.length === 0, label: "Every task says what done looks like.", detail: `Missing: ${titles(noOutcome)}` },
    {
      ok: totalMins <= FOUNDER_CAPACITY_MINS,
      label: "Your work fits in 4 hours.",
      detail: `You planned ${formatDuration(totalMins)}.`,
    },
  ]
}

export function DecideDesignView({
  step,
  handlers,
  phase,
  onNext,
  onBack,
  onEnterWorkday,
}: {
  step: "decide" | "design"
  handlers: WorkCardHandlers
  phase: DayPhase
  onNext: () => void
  onBack: () => void
  onEnterWorkday: () => void
}) {
  const { state, dispatch } = useBoss()
  const { plan, planAll, founderMins, oversightMins } = usePlan()
  const [reviewOpen, setReviewOpen] = useState(false)
  const total = founderMins + oversightMins
  const backlog = state.work.filter((w) => !w.inTodayPlan && !isClosed(w.status) && w.parentId === null)
  const checks = planChecks(state, planAll, total)
  const openPlan = plan.filter((w) => !isClosed(w.status))
  const byFn = FUNCTIONS.map((f) => ({ ...f, count: openPlan.filter((w) => w.fn === f.id).length }))
  const confirmed = !!state.day.planConfirmedAt
  const allReady = checks.every((c) => c.ok)

  if (step === "decide") {
    return (
      <div className="flex flex-col gap-8">
        <StepIntro title="Step 1: Decide" text="Think about today. What matters most?" />
        <OutcomesEditor />
        <div>
          <Button className={bigButton} onClick={onNext} disabled={state.day.outcomes.length === 0}>
            Next: plan the tasks
            <ArrowRight className="h-5 w-5" aria-hidden />
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-8">
      <StepIntro
        title="Step 2: Design"
        text={
          confirmed
            ? `You said yes to this plan at ${formatStamp(state.day.planConfirmedAt!)}. You can still change it.`
            : "Pick the tasks for today. Put the most important task first."
        }
      />

      <Panel
        title={`Today's tasks (${openPlan.length})`}
        description="Tap Change on a task to move it up or down."
        action={
          <Button className={bigButton} variant="outline" onClick={() => handlers.onEdit({ mode: "create", inPlan: true })}>
            <Plus className="h-5 w-5" aria-hidden />
            Add a task
          </Button>
        }
      >
        {plan.length === 0 ? (
          <EmptyState title="No tasks yet" description="Add a task. Or pick one you saved before." />
        ) : (
          <div className="flex flex-col gap-4">
            {plan.map((w, i) => (
              <WorkItemCard key={w.id} item={w} position={i + 1} total={plan.length} handlers={handlers} />
            ))}
          </div>
        )}
      </Panel>

      <TimeLine total={total} />

      <div className="flex flex-wrap gap-3">
        <Button className={bigButton} variant="outline" onClick={onBack}>
          <ArrowLeft className="h-5 w-5" aria-hidden />
          Back
        </Button>
        {phase === "workday" && confirmed ? (
          <Button className={bigButton} onClick={onEnterWorkday}>
            Go to work time
            <ArrowRight className="h-5 w-5" aria-hidden />
          </Button>
        ) : (
          <Button className={bigButton} onClick={() => setReviewOpen(true)}>
            {confirmed ? "Look at my plan again" : "Say yes to my plan"}
          </Button>
        )}
      </div>

      <div className="flex flex-col gap-4">
        <MoreDetails summary={`Add work you saved before (${backlog.length})`}>
          {backlog.length === 0 ? (
            <EmptyState title="Nothing saved" />
          ) : (
            <ul className="flex flex-col">
              {backlog.map((w) => (
                <li key={w.id} className="flex flex-wrap items-center gap-4 border-b border-border py-4 last:border-0">
                  <span className="min-w-0 flex-1 text-lg text-brand-ink">{w.title}</span>
                  <StatusBadge status={w.status} />
                  <button
                    onClick={() => dispatch({ type: "PLAN", id: w.id, include: true })}
                    className="inline-flex h-11 items-center gap-2 rounded-xl border border-brand-green/40 px-4 text-base font-semibold text-brand-green-dark hover:bg-brand-sage-light"
                  >
                    <Plus className="h-5 w-5" aria-hidden />
                    Add to today
                  </button>
                </li>
              ))}
            </ul>
          )}
        </MoreDetails>

        <MoreDetails summary={allReady ? "Check my plan · all good" : "Check my plan · some things need you"}>
          <CheckList checks={checks} />
          <div className="flex flex-col gap-3">
            <p className="text-base font-semibold text-brand-ink">Tasks in each part of your business</p>
            <ul className="flex flex-col gap-2">
              {byFn.map((f) => (
                <li key={f.id} className="flex items-center justify-between gap-3 text-base">
                  <span className="text-brand-ink">{f.label}</span>
                  <span className="font-semibold tabular-nums">{f.count}</span>
                </li>
              ))}
            </ul>
          </div>
        </MoreDetails>
      </div>

      <Dialog open={reviewOpen} onOpenChange={setReviewOpen}>
        <DialogContent className="max-h-[90vh] max-w-xl overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="font-display text-3xl">Is this your plan?</DialogTitle>
            <DialogDescription className="text-base leading-relaxed">
              Saying yes sets your plan for work time. You can still change it later.
            </DialogDescription>
          </DialogHeader>
          <div className="flex flex-col gap-6">
            <div className="flex flex-col gap-2">
              <p className="text-lg font-semibold text-brand-ink">Your goals</p>
              <ul className="flex list-disc flex-col gap-1.5 pl-6 text-base">
                {state.day.outcomes.map((o) => (
                  <li key={o.id}>{o.text}</li>
                ))}
              </ul>
            </div>
            <div className="flex flex-col gap-2">
              <p className="text-lg font-semibold text-brand-ink">Your tasks, in order</p>
              <ol className="flex list-decimal flex-col gap-1.5 pl-6 text-base">
                {openPlan.map((w) => (
                  <li key={w.id}>{w.title}</li>
                ))}
              </ol>
            </div>
            <CheckList checks={checks} />
          </div>
          <DialogFooter className="gap-3">
            <Button className={bigButton} variant="outline" onClick={() => setReviewOpen(false)}>
              Keep working on it
            </Button>
            <Button
              className={bigButton}
              onClick={() => {
                dispatch({ type: "CONFIRM_PLAN" })
                setReviewOpen(false)
              }}
            >
              {allReady ? "Yes, this is my plan" : "Yes, I will fix the rest later"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}

export function StepIntro({ title, text }: { title: string; text: string }) {
  return (
    <div className="flex flex-col gap-2">
      <h2 className="font-display text-3xl font-semibold text-brand-ink">{title}</h2>
      <p className="text-pretty text-lg leading-relaxed text-brand-ink-soft">{text}</p>
    </div>
  )
}

function TimeLine({ total }: { total: number }) {
  const over = total > FOUNDER_CAPACITY_MINS
  return (
    <div className="flex flex-col gap-3 rounded-2xl bg-card p-6">
      <p className="text-lg text-brand-ink">
        You planned <span className="font-semibold">{formatDuration(total)}</span> of your <span className="font-semibold">4 hours</span>.
      </p>
      <div
        className="h-3 overflow-hidden rounded-full bg-muted"
        role="progressbar"
        aria-valuenow={total}
        aria-valuemax={FOUNDER_CAPACITY_MINS}
        aria-label="Your time planned"
      >
        <div className={cn("h-full rounded-full", over ? "bg-brand-coral" : "bg-brand-green")} style={{ width: `${Math.min(100, (total / FOUNDER_CAPACITY_MINS) * 100)}%` }} />
      </div>
      {over && (
        <p className="text-base leading-relaxed text-brand-coral-dark">
          This is too much for one day. Give a task to someone else, or save it for later. Do not work into your free time.
        </p>
      )}
    </div>
  )
}

function CheckList({ checks }: { checks: { ok: boolean; label: string; detail: string }[] }) {
  return (
    <ul className="flex flex-col gap-3">
      {checks.map((c) => (
        <li key={c.label} className="flex gap-3 text-base leading-relaxed">
          {c.ok ? (
            <CheckCircle2 className="mt-0.5 h-6 w-6 shrink-0 text-brand-green" aria-label="Good" />
          ) : (
            <AlertTriangle className="mt-0.5 h-6 w-6 shrink-0 text-brand-coral" aria-label="Needs you" />
          )}
          <span className="flex flex-col">
            <span className="text-brand-ink">{c.label}</span>
            {!c.ok && <span className="text-brand-coral-dark">{c.detail}</span>}
          </span>
        </li>
      ))}
    </ul>
  )
}
