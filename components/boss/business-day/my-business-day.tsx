"use client"

import { useEffect, useState } from "react"
import { cn } from "@/lib/utils"
import { useBoss } from "@/lib/boss/store"
import { BUSINESS_DAY_SEQUENCE, isClosed } from "@/lib/boss/constants"
import { formatDate, nextBusinessDate, type DayPhase } from "@/lib/boss/clock"
import { PageHeader } from "../primitives"
import { ReassignDialog, TaskEditorDialog, type EditorTarget } from "../task-dialogs"
import { DecideDesignView } from "./decide-design"
import { CeoWorkdayView } from "./ceo-workday"
import { CloseoutView } from "./closeout"
import type { WorkCardHandlers } from "./work-item-card"

type Stage = "design" | "workday" | "closeout"

const defaultStage = (phase: DayPhase): Stage => (phase === "planning" ? "design" : phase === "workday" ? "workday" : "closeout")

const SEQUENCE_INDEX: Record<DayPhase, number> = { planning: 2, workday: 6, after_hours: 7, protected_weekend: -1 }

export function MyBusinessDay() {
  const { state, clock } = useBoss()
  const [stage, setStage] = useState<Stage>(() => defaultStage(clock.phase))
  const [editor, setEditor] = useState<EditorTarget>(null)
  const [reassignId, setReassignId] = useState<string | null>(null)
  const handlers: WorkCardHandlers = { onEdit: setEditor, onReassign: setReassignId }

  useEffect(() => setStage(defaultStage(clock.phase)), [clock.phase])

  const protectedTime = clock.phase === "protected_weekend"
  const stages: { id: Stage; label: string; sub: string; enabled: boolean }[] = [
    { id: "design", label: "Decide & Design My Business Day™", sub: "Plan before 1:00 PM ET", enabled: !state.day.closedOutAt },
    { id: "workday", label: "4-Hour Focused CEO Workday™", sub: "Mon–Thu · 1:00–5:00 PM ET", enabled: clock.phase === "workday" && !state.day.closedOutAt },
    { id: "closeout", label: "Business-day closeout", sub: "5:00 PM ET", enabled: clock.phase !== "planning" },
  ]

  return (
    <>
      <PageHeader
        eyebrow="My Business Day"
        title={protectedTime ? "Protected personal time" : formatDate(state.day.date)}
        description="Decide & Design establishes the plan. The CEO Workday lets you adapt and execute it. You remain in control throughout."
      />

      <ol aria-label="Work-Life Balance Business Day™" className="flex gap-2 overflow-x-auto pb-1">
        {BUSINESS_DAY_SEQUENCE.map((s, i) => (
          <li
            key={s.name}
            className={cn(
              "flex min-w-36 shrink-0 flex-col gap-0.5 rounded-md border px-3 py-2",
              i === SEQUENCE_INDEX[clock.phase] ? "border-brand-green bg-brand-sage-light" : "border-border bg-card",
              i === 6 && i !== SEQUENCE_INDEX[clock.phase] && "border-brand-green/40",
            )}
          >
            <span className="text-[11px] font-semibold leading-snug text-brand-ink">{s.name}</span>
            <span className="text-[11px] text-muted-foreground">{s.time}</span>
          </li>
        ))}
      </ol>

      {protectedTime ? (
        <ProtectedTime />
      ) : (
        <>
          <div role="tablist" aria-label="Business day stages" className="grid gap-2 md:grid-cols-3">
            {stages.map((s, i) => (
              <button
                key={s.id}
                role="tab"
                aria-selected={stage === s.id}
                disabled={!s.enabled}
                onClick={() => setStage(s.id)}
                className={cn(
                  "flex items-center gap-3 rounded-lg border px-4 py-3 text-left transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50",
                  stage === s.id ? "border-brand-ink bg-brand-ink text-primary-foreground" : "border-border bg-card hover:bg-muted/60",
                )}
              >
                <span
                  className={cn(
                    "flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-xs font-semibold",
                    stage === s.id ? "bg-primary-foreground text-brand-ink" : "bg-muted text-brand-ink-soft",
                  )}
                >
                  {String.fromCharCode(65 + i)}
                </span>
                <span className="flex flex-col">
                  <span className="text-sm font-semibold leading-snug">{s.label}</span>
                  <span className={cn("text-xs", stage === s.id ? "text-primary-foreground/75" : "text-muted-foreground")}>{s.sub}</span>
                </span>
              </button>
            ))}
          </div>

          {stage === "design" && <DecideDesignView handlers={handlers} phase={clock.phase} onEnterWorkday={() => setStage("workday")} />}
          {stage === "workday" && (
            <CeoWorkdayView handlers={handlers} clock={clock} onCloseout={() => setStage("closeout")} onReviewPlan={() => setStage("design")} />
          )}
          {stage === "closeout" && <CloseoutView onBack={clock.phase === "workday" && !state.day.closedOutAt ? () => setStage("workday") : undefined} />}
        </>
      )}

      <TaskEditorDialog target={editor} onClose={() => setEditor(null)} />
      <ReassignDialog workId={reassignId} onClose={() => setReassignId(null)} />
    </>
  )
}

function ProtectedTime() {
  const { state, dispatch } = useBoss()
  const next = state.day.closedOutAt ? nextBusinessDate(state.day.date) : state.day.date
  const waiting = state.work.filter((w) => !isClosed(w.status) && (w.plannedForDate === next || w.inTodayPlan)).length
  return (
    <div className="flex flex-col gap-6 rounded-xl border border-border bg-card p-6 md:p-10">
      <div className="flex flex-col gap-2">
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-brand-coral-dark">Thursday 5:00 PM – Sunday 10:00 PM</p>
        <h2 className="text-balance font-display text-3xl font-semibold text-brand-ink md:text-4xl">Your protected three-day weekend.</h2>
        <p className="max-w-2xl text-pretty text-sm leading-relaxed text-muted-foreground">
          The business is designed to operate within its boundaries. {waiting} items are waiting for {formatDate(next)}. The Coordinator is
          paused and no work is assigned or advanced on your behalf.
        </p>
      </div>
      <div>
        <button
          onClick={() => dispatch({ type: "SET_CLOCK", mode: "workday" })}
          className="text-sm font-medium text-brand-green-dark underline-offset-4 hover:underline"
        >
          Preview the CEO Workday (prototype clock)
        </button>
      </div>
    </div>
  )
}
