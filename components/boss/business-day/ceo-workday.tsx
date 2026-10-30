"use client"

import { useState } from "react"
import { Plus, Zap } from "lucide-react"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { useBoss } from "@/lib/boss/store"
import { FUNCTIONS, isClosed, WORKDAY_END, WORKDAY_START } from "@/lib/boss/constants"
import { formatDuration, formatMinutes, formatStamp, type ClockReading } from "@/lib/boss/clock"
import type { BusinessFunction, Priority, WorkItem } from "@/lib/boss/types"
import { EmptyState, fieldClass, labelClass } from "../primitives"
import { WorkItemCard, type WorkCardHandlers } from "./work-item-card"
import { OutcomesEditor } from "./outcomes-editor"
import { ChangeLogPanel, CoordinatorFeed, DecisionsPanel, NoticesPanel, founderDecisionItems } from "./workday-panels"
import { usePlan } from "./decide-design"

type Lane = "active" | "decisions" | "waiting" | "remaining" | "completed"

const LANES: { id: Lane; label: string; match: (w: WorkItem, decisions: Set<string>) => boolean }[] = [
  { id: "active", label: "In progress", match: (w) => w.status === "in_progress" },
  { id: "decisions", label: "Needs my decision", match: (w, d) => d.has(w.id) },
  { id: "waiting", label: "Blocked & waiting", match: (w) => ["blocked", "awaiting_external", "on_hold"].includes(w.status) },
  { id: "remaining", label: "Remaining", match: (w) => ["captured", "defined", "planned", "authorized", "assigned"].includes(w.status) },
  { id: "completed", label: "Completed", match: (w) => isClosed(w.status) },
]

function WorkdayClock({ clock }: { clock: ClockReading }) {
  const elapsed = Math.min(Math.max(clock.minutes - WORKDAY_START, 0), WORKDAY_END - WORKDAY_START)
  const remaining = WORKDAY_END - WORKDAY_START - elapsed
  return (
    <div className="flex flex-col gap-3">
      <div className="flex flex-wrap items-end justify-between gap-2">
        <p className="font-display text-4xl font-semibold tabular-nums text-brand-ink">{formatMinutes(clock.minutes)}</p>
        <p className="text-sm text-muted-foreground">
          <span className="font-semibold text-brand-ink">{formatDuration(remaining)}</span> remaining · ends 5:00 PM ET
        </p>
      </div>
      <div className="relative h-2 overflow-hidden rounded-full bg-muted" role="progressbar" aria-label="CEO Workday elapsed" aria-valuenow={elapsed} aria-valuemax={240}>
        <div className="h-full rounded-full bg-brand-green" style={{ width: `${(elapsed / 240) * 100}%` }} />
      </div>
      <div className="flex justify-between text-[11px] text-muted-foreground">
        <span>1:00 PM</span>
        <span>2:00</span>
        <span>3:00</span>
        <span>4:00</span>
        <span>5:00 PM</span>
      </div>
    </div>
  )
}

export function CeoWorkdayView({
  handlers,
  clock,
  onCloseout,
  onReviewPlan,
}: {
  handlers: WorkCardHandlers
  clock: ClockReading
  onCloseout: () => void
  onReviewPlan: () => void
}) {
  const { state, dispatch } = useBoss()
  const { plan } = usePlan()
  const [lane, setLane] = useState<Lane>("active")
  const [captureOpen, setCaptureOpen] = useState(false)
  const decisions = new Set(founderDecisionItems(plan).map((w) => w.id))
  const counts = Object.fromEntries(LANES.map((l) => [l.id, plan.filter((w) => l.match(w, decisions)).length])) as Record<Lane, number>
  const laneItems = plan.filter((w) => LANES.find((l) => l.id === lane)!.match(w, decisions))
  const openPlan = plan.filter((w) => !isClosed(w.status))

  if (!state.day.workdayStartedAt) {
    return (
      <div className="flex flex-col gap-6 rounded-xl border border-brand-green/40 bg-card p-6 md:p-10">
        <div className="flex flex-col gap-2">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-brand-green-dark">4-Hour Focused CEO Workday™ · 1:00–5:00 PM ET</p>
          <h2 className="text-balance font-display text-3xl font-semibold text-brand-ink md:text-4xl">Your business day is ready to run.</h2>
          <p className="max-w-2xl text-pretty text-sm leading-relaxed text-muted-foreground">
            {state.day.planConfirmedAt
              ? `You confirmed this plan at ${formatStamp(state.day.planConfirmedAt)} ET. Enter the workspace to execute, adapt, and decide.`
              : "The plan has not been confirmed in Decide & Design. You can review it first, or enter now and adjust as you go."}
          </p>
        </div>
        <div className="grid gap-4 sm:grid-cols-3">
          <Summary label="Planned outcomes" value={state.day.outcomes.length} />
          <Summary label="Planned tasks" value={openPlan.length} />
          <Summary label="Decisions waiting" value={decisions.size} />
        </div>
        <div className="flex flex-wrap gap-2">
          <Button size="lg" onClick={() => dispatch({ type: "START_WORKDAY" })}>
            Enter the CEO Workday
          </Button>
          <Button size="lg" variant="outline" onClick={onReviewPlan}>
            Review plan in Decide & Design
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-6 rounded-xl border border-border bg-card p-5 md:p-6">
        <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
          <div className="flex flex-col gap-1">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-brand-green-dark">CEO Workday Execution Workspace</p>
            <p className="text-sm text-muted-foreground">
              {state.day.planConfirmedAt ? "Executing the confirmed plan" : "Plan not formally confirmed"} · the plan adapts as you do
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            <Button size="sm" onClick={() => handlers.onEdit({ mode: "create", inPlan: true })}>
              <Plus className="h-4 w-4" aria-hidden />
              Add task
            </Button>
            <Button size="sm" variant="outline" onClick={() => setCaptureOpen(true)}>
              <Zap className="h-4 w-4" aria-hidden />
              New business development
            </Button>
            <Button size="sm" variant="outline" onClick={onCloseout}>
              Close out the day
            </Button>
          </div>
        </div>
        <WorkdayClock clock={clock} />
      </div>

      <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_380px]">
        <div className="flex min-w-0 flex-col gap-6">
          <div role="tablist" aria-label="Workday lanes" className="grid grid-cols-2 gap-2 sm:grid-cols-5">
            {LANES.map((l) => (
              <button
                key={l.id}
                role="tab"
                aria-selected={lane === l.id}
                onClick={() => setLane(l.id)}
                className={cn(
                  "flex flex-col items-start gap-1 rounded-lg border px-3 py-2.5 text-left transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-ring",
                  lane === l.id ? "border-brand-green bg-brand-sage-light/70" : "border-border bg-card hover:bg-muted/60",
                )}
              >
                <span className={cn("font-display text-2xl font-semibold tabular-nums", l.id === "decisions" && counts[l.id] > 0 ? "text-brand-coral-dark" : "text-brand-ink")}>
                  {counts[l.id]}
                </span>
                <span className="text-xs text-muted-foreground">{l.label}</span>
              </button>
            ))}
          </div>

          <section aria-label={LANES.find((l) => l.id === lane)!.label} className="flex flex-col gap-3 pl-2">
            {laneItems.length === 0 ? (
              <EmptyState title={`Nothing in "${LANES.find((l) => l.id === lane)!.label}"`} />
            ) : (
              laneItems.map((w) => (
                <WorkItemCard
                  key={w.id}
                  item={w}
                  position={openPlan.findIndex((p) => p.id === w.id) + 1 || undefined}
                  total={openPlan.length}
                  handlers={handlers}
                  allowReorder={lane !== "completed"}
                />
              ))
            )}
          </section>

          <OutcomesEditor checkable />
          <ChangeLogPanel />
        </div>

        <aside className="flex flex-col gap-6">
          <NoticesPanel />
          <DecisionsPanel />
          <CoordinatorFeed phase={clock.phase} />
        </aside>
      </div>

      <CaptureDialog open={captureOpen} onClose={() => setCaptureOpen(false)} />
    </div>
  )
}

function Summary({ label, value }: { label: string; value: number }) {
  return (
    <div className="flex flex-col gap-1 rounded-lg bg-muted/60 p-4">
      <span className="font-display text-3xl font-semibold text-brand-ink">{value}</span>
      <span className="text-xs text-muted-foreground">{label}</span>
    </div>
  )
}

function CaptureDialog({ open, onClose }: { open: boolean; onClose: () => void }) {
  const { state, dispatch } = useBoss()
  const [title, setTitle] = useState("")
  const [fn, setFn] = useState<BusinessFunction>("sales")
  const [priority, setPriority] = useState<Priority>("high")
  const [inPlan, setInPlan] = useState(true)

  function submit() {
    if (!title.trim()) return
    dispatch({ type: "ADD_WORK", draft: { title: title.trim(), fn, priority, inTodayPlan: inPlan, status: "captured", assigneeId: "R-FOUNDER", dueDate: state.day.date } })
    dispatch({
      type: "COORDINATOR_NOTE",
      kind: "note",
      summary: `New development captured: "${title.trim()}" · classified as ${FUNCTIONS.find((f) => f.id === fn)?.label}. Assigned to founder until delegated.`,
    })
    setTitle("")
    onClose()
  }

  return (
    <Dialog open={open} onOpenChange={(o) => !o && onClose()}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle className="font-display text-2xl">Respond to a new development</DialogTitle>
          <DialogDescription>Capture what just happened. You can define, delegate, or defer it next.</DialogDescription>
        </DialogHeader>
        <div className="flex flex-col gap-4">
          <label className="flex flex-col gap-1.5">
            <span className={labelClass}>What happened?</span>
            <input className={fieldClass} value={title} onChange={(e) => setTitle(e.target.value)} placeholder="e.g. Corbin Health asked for a revised scope" autoFocus />
          </label>
          <div className="grid gap-4 sm:grid-cols-2">
            <label className="flex flex-col gap-1.5">
              <span className={labelClass}>Business function</span>
              <select className={fieldClass} value={fn} onChange={(e) => setFn(e.target.value as BusinessFunction)}>
                {FUNCTIONS.map((f) => (
                  <option key={f.id} value={f.id}>
                    {f.label}
                  </option>
                ))}
              </select>
            </label>
            <label className="flex flex-col gap-1.5">
              <span className={labelClass}>Priority</span>
              <select className={fieldClass} value={priority} onChange={(e) => setPriority(e.target.value as Priority)}>
                <option value="critical">Critical</option>
                <option value="high">High</option>
                <option value="medium">Medium</option>
                <option value="low">Low</option>
              </select>
            </label>
          </div>
          <label className="flex items-center gap-2 text-sm">
            <input type="checkbox" checked={inPlan} onChange={(e) => setInPlan(e.target.checked)} className="accent-[hsl(var(--primary))]" />
            {"Add to today's plan (otherwise it goes to the Work Queue)"}
          </label>
        </div>
        <DialogFooter className="gap-2">
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={submit} disabled={!title.trim()}>
            Capture
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
