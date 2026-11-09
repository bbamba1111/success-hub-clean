"use client"

import { useEffect, useState } from "react"
import { Check } from "lucide-react"
import { cn } from "@/lib/utils"
import { useBoss } from "@/lib/boss/store"
import { BUSINESS_DAY_SEQUENCE, isClosed } from "@/lib/boss/constants"
import { formatDate, nextBusinessDate, type DayPhase } from "@/lib/boss/clock"
import { MoreDetails, PageHeader, WordsToKnow } from "../primitives"
import { ReassignDialog, TaskEditorDialog, type EditorTarget } from "../task-dialogs"
import { DecideDesignView } from "./decide-design"
import { CeoWorkdayView } from "./ceo-workday"
import { CloseoutView } from "./closeout"
import type { WorkCardHandlers } from "./work-item-card"

export type Step = "decide" | "design" | "do" | "change" | "close"

const defaultStep = (phase: DayPhase): Step => (phase === "planning" ? "decide" : phase === "workday" ? "do" : "close")

const WORDS: [string, string][] = [
  ["Decide & Design My Business Day™", "Your morning plan. You pick your goals and the tasks for today."],
  ["4-Hour Focused CEO Workday™", "Your work time. Monday to Thursday, 1:00 to 5:00 PM Eastern. You do the plan here."],
  ["Time Freedom™", "Your free time after 5:00 PM. Work stops so you can live your life."],
  ["AI Operations Coordinator", "Your AI helper. It sorts and moves work forward. It only does what you allow."],
  ["Business Work Queue", "The list of all your work, not just today's."],
  ["Authority", "Permission. It means who is allowed to do a task."],
]

export function MyBusinessDay() {
  const { state, clock } = useBoss()
  const [step, setStep] = useState<Step>(() => defaultStep(clock.phase))
  const [editor, setEditor] = useState<EditorTarget>(null)
  const [reassignId, setReassignId] = useState<string | null>(null)
  const handlers: WorkCardHandlers = { onEdit: setEditor, onReassign: setReassignId }

  useEffect(() => setStep(defaultStep(clock.phase)), [clock.phase])

  const closed = !!state.day.closedOutAt
  const working = clock.phase === "workday" && !closed
  const steps: { id: Step; label: string; sub: string; enabled: boolean }[] = [
    { id: "decide", label: "Decide", sub: "Pick your goals", enabled: !closed },
    { id: "design", label: "Design", sub: "Plan the tasks", enabled: !closed },
    { id: "do", label: "Do", sub: "Do the work", enabled: working },
    { id: "change", label: "Change", sub: "Fix the plan", enabled: working },
    { id: "close", label: "Close", sub: "End your day", enabled: clock.phase !== "planning" },
  ]
  const currentIndex = steps.findIndex((s) => s.id === step)

  if (clock.phase === "protected_weekend") {
    return (
      <>
        <PageHeader eyebrow="My Business Day" title="It is your weekend." />
        <ProtectedTime />
      </>
    )
  }

  return (
    <>
      <PageHeader eyebrow="My Business Day" title={formatDate(state.day.date)} description="Follow the steps. Do one step at a time." />

      <nav aria-label="Steps for your business day">
        <ol className="grid grid-cols-5 gap-2">
          {steps.map((s, i) => {
            const active = s.id === step
            const done = i < currentIndex
            return (
              <li key={s.id}>
                <button
                  disabled={!s.enabled}
                  onClick={() => setStep(s.id)}
                  aria-current={active ? "step" : undefined}
                  className={cn(
                    "flex w-full flex-col items-center gap-2 rounded-2xl px-2 py-4 text-center transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-40",
                    active ? "bg-brand-green text-primary-foreground" : "bg-card hover:bg-muted",
                  )}
                >
                  <span
                    className={cn(
                      "flex h-10 w-10 items-center justify-center rounded-full text-lg font-semibold",
                      active ? "bg-primary-foreground text-brand-green-dark" : done ? "bg-brand-sage-light text-brand-green-dark" : "bg-muted text-brand-ink",
                    )}
                  >
                    {done ? <Check className="h-5 w-5" aria-label="Done" /> : i + 1}
                  </span>
                  <span className="text-lg font-semibold leading-tight">{s.label}</span>
                  <span className={cn("hidden text-sm sm:block", active ? "text-primary-foreground/85" : "text-muted-foreground")}>{s.sub}</span>
                </button>
              </li>
            )
          })}
        </ol>
      </nav>

      {(step === "decide" || step === "design") && (
        <DecideDesignView
          step={step}
          handlers={handlers}
          phase={clock.phase}
          onNext={() => setStep("design")}
          onBack={() => setStep("decide")}
          onEnterWorkday={() => setStep("do")}
        />
      )}
      {(step === "do" || step === "change") && (
        <CeoWorkdayView
          mode={step}
          handlers={handlers}
          clock={clock}
          onCloseout={() => setStep("close")}
          onReviewPlan={() => setStep("design")}
          onChange={() => setStep("change")}
          onDone={() => setStep("do")}
        />
      )}
      {step === "close" && <CloseoutView onBack={working ? () => setStep("do") : undefined} />}

      <div className="flex flex-col gap-4">
        <MoreDetails summary="See your whole day">
          <ol className="flex flex-col gap-3">
            {BUSINESS_DAY_SEQUENCE.map((s) => (
              <li key={s.name} className="flex flex-wrap items-baseline justify-between gap-2 border-b border-border pb-3 last:border-0">
                <span className="text-base font-medium text-brand-ink">{s.name}</span>
                <span className="text-base text-muted-foreground">{s.time}</span>
              </li>
            ))}
          </ol>
        </MoreDetails>
        <WordsToKnow words={WORDS} />
      </div>

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
    <div className="flex flex-col gap-6 rounded-2xl bg-card p-8 md:p-12">
      <p className="text-lg font-semibold text-brand-coral-dark">Thursday 5:00 PM to Sunday 10:00 PM</p>
      <h2 className="text-balance font-display text-4xl font-semibold text-brand-ink">Rest. Work is done for now.</h2>
      <p className="max-w-2xl text-pretty text-lg leading-relaxed text-brand-ink-soft">
        {waiting} tasks will wait for {formatDate(next)}. Your AI helper is resting too. No work moves while you are away.
      </p>
      <div>
        <button
          onClick={() => dispatch({ type: "SET_CLOCK", mode: "workday" })}
          className="text-lg font-medium text-brand-green-dark underline underline-offset-4"
        >
          Practice: try work time
        </button>
      </div>
    </div>
  )
}
