"use client"

import { useState } from "react"
import { ArrowRight, Moon, Pencil, Plus, Zap } from "lucide-react"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { useBoss } from "@/lib/boss/store"
import { FUNCTIONS, isClosed, WORKDAY_END, WORKDAY_START } from "@/lib/boss/constants"
import { formatDuration, formatMinutes, formatStamp, type ClockReading } from "@/lib/boss/clock"
import type { BusinessFunction, Priority, WorkItem } from "@/lib/boss/types"
import { EmptyState, MoreDetails, bigButton, fieldClass, labelClass } from "../primitives"
import { WorkItemCard, type WorkCardHandlers } from "./work-item-card"
import { OutcomesEditor } from "./outcomes-editor"
import { ChangeLogPanel, CoordinatorFeed, DecisionsPanel, NoticesPanel, founderDecisionItems } from "./workday-panels"
import { StepIntro, usePlan } from "./decide-design"

type Lane = "active" | "decisions" | "waiting" | "remaining" | "completed"

const LANES: { id: Lane; label: string; match: (w: WorkItem, decisions: Set<string>) => boolean }[] = [
  { id: "remaining", label: "Not started", match: (w) => ["captured", "defined", "planned", "authorized", "assigned"].includes(w.status) },
  { id: "active", label: "Doing now", match: (w) => w.status === "in_progress" },
  { id: "decisions", label: "Needs you", match: (w, d) => d.has(w.id) },
  { id: "waiting", label: "Stuck or waiting", match: (w) => ["blocked", "awaiting_external", "on_hold"].includes(w.status) },
  { id: "completed", label: "Done", match: (w) => isClosed(w.status) },
]

function WorkdayClock({ clock }: { clock: ClockReading }) {
  const elapsed = Math.min(Math.max(clock.minutes - WORKDAY_START, 0), WORKDAY_END - WORKDAY_START)
  const remaining = WORKDAY_END - WORKDAY_START - elapsed
  return (
    <div className="flex flex-col gap-3">
      <div className="flex flex-wrap items-end justify-between gap-2">
        <p className="font-display text-5xl font-semibold tabular-nums text-brand-ink">{formatMinutes(clock.minutes)}</p>
        <p className="text-lg text-brand-ink-soft">
          <span className="font-semibold text-brand-ink">{formatDuration(remaining)}</span> left. Work ends at 5:00 PM.
        </p>
      </div>
      <div className="h-3 overflow-hidden rounded-full bg-muted" role="progressbar" aria-label="Work time used" aria-valuenow={elapsed} aria-valuemax={240}>
        <div className="h-full rounded-full bg-brand-green" style={{ width: `${(elapsed / 240) * 100}%` }} />
      </div>
    </div>
  )
}

export function CeoWorkdayView({
  mode,
  handlers,
  clock,
  onCloseout,
  onReviewPlan,
  onChange,
  onDone,
}: {
  mode: "do" | "change"
  handlers: WorkCardHandlers
  clock: ClockReading
  onCloseout: () => void
  onReviewPlan: () => void
  onChange: () => void
  onDone: () => void
}) {
  const { state, dispatch } = useBoss()
  const { plan } = usePlan()
  const [lane, setLane] = useState<Lane>("remaining")
  const [captureOpen, setCaptureOpen] = useState(false)
  const decisions = new Set(founderDecisionItems(plan).map((w) => w.id))
  const counts = Object.fromEntries(LANES.map((l) => [l.id, plan.filter((w) => l.match(w, decisions)).length])) as Record<Lane, number>
  const laneMeta = LANES.find((l) => l.id === lane)!
  const laneItems = plan.filter((w) => laneMeta.match(w, decisions))
  const openPlan = plan.filter((w) => !isClosed(w.status))

  if (!state.day.workdayStartedAt) {
    return (
      <div className="flex flex-col gap-6 rounded-2xl bg-card p-8 md:p-12">
        <StepIntro
          title="Step 3: Do"
          text={
            state.day.planConfirmedAt
              ? `Your plan is ready. You said yes to it at ${formatStamp(state.day.planConfirmedAt)}.`
              : "You have not said yes to your plan yet. You can look at it first. Or you can start now."
          }
        />
        <p className="text-lg text-brand-ink">
          You have <span className="font-semibold">{state.day.outcomes.length} goals</span> and{" "}
          <span className="font-semibold">{openPlan.length} tasks</span> today.
        </p>
        <div className="flex flex-wrap gap-3">
          <Button className={bigButton} onClick={() => dispatch({ type: "START_WORKDAY" })}>
            Start work time
            <ArrowRight className="h-5 w-5" aria-hidden />
          </Button>
          <Button className={bigButton} variant="outline" onClick={onReviewPlan}>
            Look at my plan
          </Button>
        </div>
      </div>
    )
  }

  if (mode === "change") {
    return (
      <div className="flex flex-col gap-8">
        <StepIntro title="Step 4: Change" text="Plans change. That is OK. Find the task. Tap Change. Pick what to do." />
        <div className="flex flex-wrap gap-3">
          <Button className={bigButton} onClick={() => setCaptureOpen(true)}>
            <Zap className="h-5 w-5" aria-hidden />
            Something new came up
          </Button>
          <Button className={bigButton} variant="outline" onClick={() => handlers.onEdit({ mode: "create", inPlan: true })}>
            <Plus className="h-5 w-5" aria-hidden />
            Add a task
          </Button>
        </div>
        <section aria-label="Tasks you can change" className="flex flex-col gap-4">
          {openPlan.length === 0 ? (
            <EmptyState title="All tasks are done" />
          ) : (
            openPlan.map((w, i) => <WorkItemCard key={w.id} item={w} position={i + 1} total={openPlan.length} handlers={handlers} />)
          )}
        </section>
        <OutcomesEditor checkable />
        <div>
          <Button className={bigButton} variant="outline" onClick={onDone}>
            I am done changing
          </Button>
        </div>
        <MoreDetails summary="See all changes today">
          <ChangeLogPanel />
        </MoreDetails>
        <CaptureDialog open={captureOpen} onClose={() => setCaptureOpen(false)} />
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-8">
      <StepIntro title="Step 3: Do" text="Work on one task at a time. Tap the green button to move it forward." />
      <div className="rounded-2xl bg-card p-6 md:p-8">
        <WorkdayClock clock={clock} />
      </div>

      <NoticesPanel />
      {decisions.size > 0 && <DecisionsPanel />}

      <div role="tablist" aria-label="Show tasks" className="flex flex-wrap gap-2">
        {LANES.map((l) => (
          <button
            key={l.id}
            role="tab"
            aria-selected={lane === l.id}
            onClick={() => setLane(l.id)}
            className={cn(
              "inline-flex h-12 items-center gap-2 rounded-full border px-5 text-base font-medium transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-ring",
              lane === l.id ? "border-brand-green bg-brand-green text-primary-foreground" : "border-border bg-card text-brand-ink hover:bg-muted",
            )}
          >
            {l.label}
            <span
              className={cn(
                "rounded-full px-2 text-sm tabular-nums",
                lane === l.id ? "bg-primary-foreground/20" : l.id === "decisions" && counts[l.id] > 0 ? "bg-brand-blush text-brand-coral-dark" : "bg-muted",
              )}
            >
              {counts[l.id]}
            </span>
          </button>
        ))}
      </div>

      <section aria-label={laneMeta.label} className="flex flex-col gap-4">
        {laneItems.length === 0 ? (
          <EmptyState title={`No tasks in "${laneMeta.label}"`} />
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

      <div className="flex flex-wrap gap-3">
        <Button className={bigButton} variant="outline" onClick={onChange}>
          <Pencil className="h-5 w-5" aria-hidden />
          Change my plan
        </Button>
        <Button className={bigButton} variant="outline" onClick={onCloseout}>
          <Moon className="h-5 w-5" aria-hidden />
          Close my day
        </Button>
      </div>

      <div className="flex flex-col gap-4">
        <MoreDetails summary="My goals for today">
          <OutcomesEditor checkable />
        </MoreDetails>
        <MoreDetails summary="What my AI helper is doing">
          <CoordinatorFeed phase={clock.phase} />
        </MoreDetails>
        <MoreDetails summary="See all changes today">
          <ChangeLogPanel />
        </MoreDetails>
      </div>
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
          <DialogTitle className="font-display text-3xl">Something new came up</DialogTitle>
          <DialogDescription className="text-base leading-relaxed">Write it down now. You can decide what to do with it next.</DialogDescription>
        </DialogHeader>
        <div className="flex flex-col gap-5">
          <label className="flex flex-col gap-2">
            <span className={labelClass}>What happened?</span>
            <input className={fieldClass} value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Example: A client asked for a new price" autoFocus />
          </label>
          <label className="flex flex-col gap-2">
            <span className={labelClass}>Which part of your business is it?</span>
            <select className={fieldClass} value={fn} onChange={(e) => setFn(e.target.value as BusinessFunction)}>
              {FUNCTIONS.map((f) => (
                <option key={f.id} value={f.id}>
                  {f.label}
                </option>
              ))}
            </select>
          </label>
          <label className="flex flex-col gap-2">
            <span className={labelClass}>How important is it?</span>
            <select className={fieldClass} value={priority} onChange={(e) => setPriority(e.target.value as Priority)}>
              <option value="critical">Must do</option>
              <option value="high">High</option>
              <option value="medium">Medium</option>
              <option value="low">Low</option>
            </select>
          </label>
          <label className="flex items-center gap-3 text-base">
            <input type="checkbox" checked={inPlan} onChange={(e) => setInPlan(e.target.checked)} className="h-6 w-6 accent-[hsl(var(--primary))]" />
            {"Add it to today's plan"}
          </label>
        </div>
        <DialogFooter className="gap-3">
          <Button className={bigButton} variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button className={bigButton} onClick={submit} disabled={!title.trim()}>
            Save it
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
