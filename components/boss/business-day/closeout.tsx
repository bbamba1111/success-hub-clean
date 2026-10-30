"use client"

import { useState } from "react"
import { Moon } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useBoss } from "@/lib/boss/store"
import { resourceName, type CloseoutChoice } from "@/lib/boss/reducer"
import { isClosed } from "@/lib/boss/constants"
import { formatDate, formatStamp, nextBusinessDate, weekdayOf } from "@/lib/boss/clock"
import { EmptyState, FunctionBadge, Panel, StatusBadge, fieldClass } from "../primitives"

export function CloseoutView({ onBack }: { onBack?: () => void }) {
  const { state, dispatch } = useBoss()
  const plan = state.work.filter((w) => w.inTodayPlan)
  const unfinished = plan.filter((w) => !isClosed(w.status))
  const completed = plan.filter((w) => w.status === "completed")
  const nextDate = nextBusinessDate(state.day.date)
  const weekendAhead = weekdayOf(state.day.date) === 4
  const [choices, setChoices] = useState<Record<string, CloseoutChoice>>(() =>
    Object.fromEntries(unfinished.map((w) => [w.id, w.priority === "low" ? "queue" : "carry"])),
  )
  const [notes, setNotes] = useState("")
  const last = state.pastDays[0]

  if (state.day.closedOutAt && last) {
    return (
      <div className="flex flex-col gap-6 rounded-xl border border-border bg-card p-6 md:p-10">
        <Moon className="h-6 w-6 text-brand-coral" aria-hidden />
        <div className="flex flex-col gap-2">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-brand-coral-dark">Business day closed · {formatStamp(state.day.closedOutAt)} ET</p>
          <h2 className="text-balance font-display text-3xl font-semibold text-brand-ink md:text-4xl">
            {weekendAhead ? "Your protected three-day weekend has begun." : "Time Freedom™ has begun."}
          </h2>
          <p className="max-w-2xl text-pretty text-sm leading-relaxed text-muted-foreground">
            Progress is recorded and unfinished work is waiting for {formatDate(nextDate)}. The Coordinator is paused. Nothing continues on
            your behalf in protected personal time.
          </p>
        </div>
        <dl className="grid gap-4 sm:grid-cols-4">
          {[
            ["Completed", last.completed.length],
            ["Carried forward", last.carried.length],
            ["Returned to queue", last.returned.length],
            ["Cancelled", last.cancelled.length],
          ].map(([l, v]) => (
            <div key={l} className="flex flex-col gap-1 rounded-lg bg-muted/60 p-4">
              <dd className="font-display text-3xl font-semibold text-brand-ink">{v}</dd>
              <dt className="text-xs text-muted-foreground">{l}</dt>
            </div>
          ))}
        </dl>
        <div>
          <Button variant="outline" onClick={() => dispatch({ type: "START_NEXT_DAY" })}>
            Roll over to {formatDate(nextDate, { weekday: "long", month: "short", day: "numeric" })}
          </Button>
          <p className="mt-2 text-xs text-muted-foreground">
            Prototype step: rolls the business date forward. No work starts until that day&apos;s CEO Workday.
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-2 rounded-xl border border-brand-coral/30 bg-card p-5 md:p-6">
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-brand-coral-dark">5:00 PM ET · Business-day closeout</p>
        <h2 className="font-display text-2xl font-semibold text-brand-ink md:text-3xl">Record the day and set down the work.</h2>
        <p className="max-w-3xl text-pretty text-sm leading-relaxed text-muted-foreground">
          Decide what happens to each unfinished item. Carried work is scheduled for {formatDate(nextDate)} — it does not continue tonight.
          {weekendAhead && " Tomorrow begins the protected three-day weekend through Sunday 10:00 PM."}
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="flex flex-col gap-6 lg:col-span-2">
          <Panel title={`Unfinished work (${unfinished.length})`} description="In-progress work pauses and resumes at the next CEO Workday.">
            {unfinished.length === 0 ? (
              <EmptyState title="Everything planned is complete" />
            ) : (
              <ul className="flex flex-col divide-y divide-border">
                {unfinished.map((w) => (
                  <li key={w.id} className="flex flex-col gap-2 py-3 sm:flex-row sm:items-center">
                    <div className="flex min-w-0 flex-1 flex-col gap-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="font-mono text-[11px] text-muted-foreground">{w.id}</span>
                        <FunctionBadge fn={w.fn} />
                        <StatusBadge status={w.status} />
                      </div>
                      <p className="truncate text-sm font-medium text-brand-ink">{w.title}</p>
                      <p className="text-xs text-muted-foreground">{resourceName(state, w.assigneeId)}</p>
                    </div>
                    <select
                      value={choices[w.id] ?? "carry"}
                      onChange={(e) => setChoices((c) => ({ ...c, [w.id]: e.target.value as CloseoutChoice }))}
                      className={`${fieldClass} sm:w-56`}
                      aria-label={`Closeout decision for ${w.id}`}
                    >
                      <option value="carry">Carry forward to next business day</option>
                      <option value="queue">Return to Work Queue</option>
                      <option value="cancel">Cancel</option>
                    </select>
                  </li>
                ))}
              </ul>
            )}
          </Panel>
        </div>

        <div className="flex flex-col gap-6">
          <Panel title="Outcomes">
            <ul className="flex flex-col gap-2 text-sm">
              {state.day.outcomes.map((o) => (
                <li key={o.id} className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={o.done}
                    onChange={(e) => dispatch({ type: "OUTCOME_UPDATE", id: o.id, patch: { done: e.target.checked } })}
                    className="h-4 w-4 accent-[hsl(var(--primary))]"
                    aria-label={`Achieved: ${o.text}`}
                  />
                  <span className={o.done ? "text-muted-foreground line-through" : "text-brand-ink"}>{o.text}</span>
                </li>
              ))}
            </ul>
          </Panel>
          <Panel title={`Completed today (${completed.length})`}>
            <ul className="flex flex-col gap-1 text-xs">
              {completed.map((w) => (
                <li key={w.id} className="text-brand-ink">
                  <span className="font-mono text-muted-foreground">{w.id}</span> · {w.title}
                </li>
              ))}
            </ul>
          </Panel>
          <Panel title="Closeout note">
            <textarea rows={3} className={fieldClass} value={notes} onChange={(e) => setNotes(e.target.value)} placeholder="Anything to remember for the next Decide & Design?" />
          </Panel>
          <div className="flex flex-wrap gap-2">
            <Button onClick={() => dispatch({ type: "CLOSEOUT", choices, notes })}>Close the business day</Button>
            {onBack && (
              <Button variant="outline" onClick={onBack}>
                Back to workspace
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
