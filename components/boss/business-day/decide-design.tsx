"use client"

import { useState } from "react"
import { AlertTriangle, CheckCircle2, Plus } from "lucide-react"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { useBoss } from "@/lib/boss/store"
import { authorityFor, canProceed } from "@/lib/boss/reducer"
import { FOUNDER_CAPACITY_MINS, FUNCTIONS, isClosed } from "@/lib/boss/constants"
import { formatDuration, formatStamp } from "@/lib/boss/clock"
import type { DayPhase } from "@/lib/boss/clock"
import { FunctionBadge, Panel, StatusBadge, EmptyState } from "../primitives"
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
  return [
    { ok: state.day.outcomes.length > 0, label: "At least one intended outcome is defined", detail: `${state.day.outcomes.length} outcomes` },
    { ok: open.every((w) => w.assigneeId), label: "Every planned task has a resource", detail: open.filter((w) => !w.assigneeId).map((w) => w.id).join(", ") || "All assigned" },
    {
      ok: open.every((w) => !w.assigneeId || canProceed(authorityFor(state, w.assigneeId, w)) || authorityFor(state, w.assigneeId, w).status === "external"),
      label: "Every assignment has authority in place",
      detail:
        open
          .filter((w) => w.assigneeId && authorityFor(state, w.assigneeId, w).status === "not_authorized")
          .map((w) => w.id)
          .join(", ") || "All authorized",
    },
    { ok: open.every((w) => w.outcome.trim()), label: "Every task states its desired outcome", detail: open.filter((w) => !w.outcome.trim()).map((w) => w.id).join(", ") || "All defined" },
    {
      ok: totalMins <= FOUNDER_CAPACITY_MINS,
      label: "Founder work fits inside the four-hour CEO Workday",
      detail: `${formatDuration(totalMins)} of ${formatDuration(FOUNDER_CAPACITY_MINS)}`,
    },
  ]
}

export function DecideDesignView({ handlers, phase, onEnterWorkday }: { handlers: WorkCardHandlers; phase: DayPhase; onEnterWorkday: () => void }) {
  const { state, dispatch } = useBoss()
  const { plan, planAll, founderMins, oversightMins } = usePlan()
  const [reviewOpen, setReviewOpen] = useState(false)
  const total = founderMins + oversightMins
  const backlog = state.work.filter((w) => !w.inTodayPlan && !isClosed(w.status) && w.parentId === null)
  const checks = planChecks(state, planAll, total)
  const byFn = FUNCTIONS.map((f) => ({ ...f, count: plan.filter((w) => w.fn === f.id && !isClosed(w.status)).length }))
  const confirmed = !!state.day.planConfirmedAt

  return (
    <div className="flex flex-col gap-6">
      <div
        className={cn(
          "flex flex-col gap-4 rounded-xl border p-5 md:flex-row md:items-center md:justify-between",
          confirmed ? "border-brand-green/40 bg-brand-sage-light/60" : "border-border bg-card",
        )}
      >
        <div className="flex flex-col gap-1">
          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-brand-green-dark">Decide & Design My Business Day™</p>
          <p className="text-pretty text-sm leading-relaxed text-brand-ink">
            {confirmed
              ? `Plan confirmed at ${formatStamp(state.day.planConfirmedAt!)} ET. You can still change anything — before or during the CEO Workday.`
              : "Plan, prioritize, assign, and confirm the intended business work before the 1:00 PM ET CEO Workday."}
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Button variant={confirmed ? "outline" : "default"} onClick={() => setReviewOpen(true)}>
            {confirmed ? "Review plan again" : "Review & confirm plan"}
          </Button>
          {phase === "workday" && (
            <Button variant={confirmed ? "default" : "outline"} onClick={onEnterWorkday}>
              Go to CEO Workday
            </Button>
          )}
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="flex flex-col gap-6 lg:col-span-2">
          <OutcomesEditor />

          <Panel
            title={`Planned business tasks (${plan.filter((w) => !isClosed(w.status)).length})`}
            description="Order sets priority. Hover a task to move it up or down."
            action={
              <Button size="sm" onClick={() => handlers.onEdit({ mode: "create", inPlan: true })}>
                <Plus className="h-4 w-4" aria-hidden />
                Add task
              </Button>
            }
          >
            {plan.length === 0 ? (
              <EmptyState title="No tasks planned" description="Add a task or pull one in from the Work Queue below." />
            ) : (
              <div className="flex flex-col gap-3 pl-2">
                {plan.map((w, i) => (
                  <WorkItemCard key={w.id} item={w} position={i + 1} total={plan.length} handlers={handlers} />
                ))}
              </div>
            )}
          </Panel>

          <Panel title={`From the Work Queue (${backlog.length})`} description="Open work not yet in today's plan.">
            {backlog.length === 0 ? (
              <EmptyState title="Work Queue is clear" />
            ) : (
              <ul className="flex flex-col divide-y divide-border">
                {backlog.map((w) => (
                  <li key={w.id} className="flex flex-wrap items-center gap-3 py-2.5">
                    <span className="font-mono text-[11px] text-muted-foreground">{w.id}</span>
                    <FunctionBadge fn={w.fn} />
                    <span className="min-w-0 flex-1 truncate text-sm text-brand-ink">{w.title}</span>
                    <StatusBadge status={w.status} />
                    <button
                      onClick={() => dispatch({ type: "PLAN", id: w.id, include: true })}
                      className="rounded-md border border-border px-2.5 py-1 text-xs font-medium hover:bg-muted"
                    >
                      Add to plan
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </Panel>
        </div>

        <div className="flex flex-col gap-6">
          <Panel title="Founder capacity" description="Not divided into fixed blocks. You decide how to use the four hours.">
            <div className="flex flex-col gap-3">
              <div className="flex items-baseline justify-between">
                <span className="font-display text-3xl font-semibold text-brand-ink">{formatDuration(total)}</span>
                <span className="text-xs text-muted-foreground">of {formatDuration(FOUNDER_CAPACITY_MINS)}</span>
              </div>
              <div className="h-2 overflow-hidden rounded-full bg-muted" role="progressbar" aria-valuenow={total} aria-valuemax={FOUNDER_CAPACITY_MINS} aria-label="Founder time planned">
                <div
                  className={cn("h-full rounded-full", total > FOUNDER_CAPACITY_MINS ? "bg-brand-coral" : "bg-brand-green")}
                  style={{ width: `${Math.min(100, (total / FOUNDER_CAPACITY_MINS) * 100)}%` }}
                />
              </div>
              <dl className="flex flex-col gap-1 text-xs">
                <div className="flex justify-between">
                  <dt className="text-muted-foreground">Founder-owned work</dt>
                  <dd className="font-medium">{formatDuration(founderMins)}</dd>
                </div>
                <div className="flex justify-between">
                  <dt className="text-muted-foreground">Reviews & oversight of delegated work</dt>
                  <dd className="font-medium">{formatDuration(oversightMins)}</dd>
                </div>
              </dl>
              {total > FOUNDER_CAPACITY_MINS && (
                <p className="text-xs leading-relaxed text-brand-coral-dark">
                  The plan exceeds the CEO Workday. Delegate, defer, or remove work rather than extending into Time Freedom™.
                </p>
              )}
            </div>
          </Panel>

          <Panel title="Five-function view">
            <ul className="flex flex-col gap-2">
              {byFn.map((f) => (
                <li key={f.id} className="flex items-center justify-between gap-2 text-sm">
                  <span className="text-brand-ink">{f.label}</span>
                  <span className="font-semibold tabular-nums">{f.count}</span>
                </li>
              ))}
            </ul>
          </Panel>

          <Panel title="Plan readiness">
            <ul className="flex flex-col gap-2.5">
              {checks.map((c) => (
                <li key={c.label} className="flex gap-2 text-xs leading-relaxed">
                  {c.ok ? (
                    <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-brand-green" aria-label="Ready" />
                  ) : (
                    <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0 text-brand-coral" aria-label="Needs attention" />
                  )}
                  <span>
                    <span className="block text-brand-ink">{c.label}</span>
                    <span className="text-muted-foreground">{c.detail}</span>
                  </span>
                </li>
              ))}
            </ul>
          </Panel>
        </div>
      </div>

      <Dialog open={reviewOpen} onOpenChange={setReviewOpen}>
        <DialogContent className="max-h-[90vh] max-w-xl overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="font-display text-2xl">Review the proposed plan</DialogTitle>
            <DialogDescription>
              Confirming sets the plan for the CEO Workday. It does not lock it — you can change it at any time.
            </DialogDescription>
          </DialogHeader>
          <div className="flex flex-col gap-4">
            <div>
              <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">Outcomes</p>
              <ul className="flex list-disc flex-col gap-1 pl-5 text-sm">
                {state.day.outcomes.map((o) => (
                  <li key={o.id}>{o.text}</li>
                ))}
              </ul>
            </div>
            <div>
              <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">Tasks in priority order</p>
              <ol className="flex list-decimal flex-col gap-1 pl-5 text-sm">
                {plan
                  .filter((w) => !isClosed(w.status))
                  .map((w) => (
                    <li key={w.id}>
                      {w.title} <span className="text-xs text-muted-foreground">· {w.id}</span>
                    </li>
                  ))}
              </ol>
            </div>
            <ul className="flex flex-col gap-1.5 rounded-lg bg-muted/60 p-3 text-xs">
              {checks.map((c) => (
                <li key={c.label} className={c.ok ? "text-brand-green-dark" : "text-brand-coral-dark"}>
                  {c.ok ? "Ready" : "Attention"} · {c.label} ({c.detail})
                </li>
              ))}
            </ul>
          </div>
          <DialogFooter className="gap-2">
            <Button variant="outline" onClick={() => setReviewOpen(false)}>
              Keep editing
            </Button>
            <Button
              onClick={() => {
                dispatch({ type: "CONFIRM_PLAN" })
                setReviewOpen(false)
              }}
            >
              {checks.every((c) => c.ok) ? "Confirm plan" : "Confirm with open items"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
