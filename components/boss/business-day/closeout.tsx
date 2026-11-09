"use client"

import { useState } from "react"
import { Moon } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useBoss } from "@/lib/boss/store"
import { resourceName, type CloseoutChoice } from "@/lib/boss/reducer"
import { isClosed } from "@/lib/boss/constants"
import { formatDate, formatStamp, nextBusinessDate, weekdayOf } from "@/lib/boss/clock"
import { EmptyState, MoreDetails, Panel, bigButton, fieldClass, labelClass } from "../primitives"
import { StepIntro } from "./decide-design"

export function CloseoutView({ onBack }: { onBack?: () => void }) {
  const { state, dispatch } = useBoss()
  const plan = state.work.filter((w) => w.inTodayPlan)
  const unfinished = plan.filter((w) => !isClosed(w.status))
  const completed = plan.filter((w) => w.status === "completed")
  const nextDate = nextBusinessDate(state.day.date)
  const nextLabel = formatDate(nextDate, { weekday: "long", month: "long", day: "numeric" })
  const weekendAhead = weekdayOf(state.day.date) === 4
  const [choices, setChoices] = useState<Record<string, CloseoutChoice>>(() =>
    Object.fromEntries(unfinished.map((w) => [w.id, w.priority === "low" ? "queue" : "carry"])),
  )
  const [notes, setNotes] = useState("")
  const last = state.pastDays[0]

  if (state.day.closedOutAt && last) {
    return (
      <div className="flex flex-col gap-6 rounded-2xl bg-card p-8 md:p-12">
        <Moon className="h-8 w-8 text-brand-coral" aria-hidden />
        <p className="text-lg font-semibold text-brand-coral-dark">You closed your day at {formatStamp(state.day.closedOutAt)}.</p>
        <h2 className="text-balance font-display text-4xl font-semibold text-brand-ink">
          {weekendAhead ? "Your 3-day weekend starts now." : "Your free time starts now."}
        </h2>
        <p className="max-w-2xl text-pretty text-lg leading-relaxed text-brand-ink-soft">
          We saved your day. Tasks that are not done will wait for {nextLabel}. Your AI helper is resting. No work happens tonight.
        </p>
        <ul className="flex flex-col gap-2 text-lg text-brand-ink">
          <li>{last.completed.length} tasks done</li>
          <li>{last.carried.length} tasks moved to next work day</li>
          <li>{last.returned.length} tasks saved for later</li>
          <li>{last.cancelled.length} tasks stopped</li>
        </ul>
        <div className="flex flex-col gap-2">
          <div>
            <Button className={bigButton} variant="outline" onClick={() => dispatch({ type: "START_NEXT_DAY" })}>
              Practice: go to {nextLabel}
            </Button>
          </div>
          <p className="text-base text-muted-foreground">This moves the practice date ahead. No work starts until work time.</p>
        </div>
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-8">
      <StepIntro
        title="Step 5: Close"
        text={`It is time to end your work day. Pick what happens to each task that is not done. Nothing keeps going tonight.${
          weekendAhead ? " Your 3-day weekend starts after this." : ""
        }`}
      />

      <Panel title={`Tasks not done (${unfinished.length})`} description="Pick one choice for each task.">
        {unfinished.length === 0 ? (
          <EmptyState title="Every task is done. Great job." />
        ) : (
          <ul className="flex flex-col">
            {unfinished.map((w) => (
              <li key={w.id} className="flex flex-col gap-3 border-b border-border py-5 first:pt-0 last:border-0 last:pb-0">
                <div className="flex flex-col gap-1">
                  <p className="text-lg font-semibold text-brand-ink">{w.title}</p>
                  <p className="text-base text-muted-foreground">Who: {resourceName(state, w.assigneeId)}</p>
                </div>
                <select
                  value={choices[w.id] ?? "carry"}
                  onChange={(e) => setChoices((c) => ({ ...c, [w.id]: e.target.value as CloseoutChoice }))}
                  className={`${fieldClass} sm:max-w-sm`}
                  aria-label={`What happens to ${w.title}`}
                >
                  <option value="carry">Do it next work day</option>
                  <option value="queue">Save it for later</option>
                  <option value="cancel">Stop it</option>
                </select>
              </li>
            ))}
          </ul>
        )}
      </Panel>

      <Panel title="Did you meet your goals?" description="Check each goal you finished.">
        <ul className="flex flex-col gap-3">
          {state.day.outcomes.map((o) => (
            <li key={o.id}>
              <label className="flex items-center gap-3 text-lg">
                <input
                  type="checkbox"
                  checked={o.done}
                  onChange={(e) => dispatch({ type: "OUTCOME_UPDATE", id: o.id, patch: { done: e.target.checked } })}
                  className="h-6 w-6 shrink-0 accent-[hsl(var(--primary))]"
                />
                <span className={o.done ? "text-muted-foreground line-through" : "text-brand-ink"}>{o.text}</span>
              </label>
            </li>
          ))}
        </ul>
      </Panel>

      <label className="flex flex-col gap-2">
        <span className={labelClass}>Anything to remember for next time? (You can skip this.)</span>
        <textarea rows={3} className={fieldClass} value={notes} onChange={(e) => setNotes(e.target.value)} />
      </label>

      <div className="flex flex-wrap gap-3">
        <Button className={bigButton} onClick={() => dispatch({ type: "CLOSEOUT", choices, notes })}>
          <Moon className="h-5 w-5" aria-hidden />
          Close my day
        </Button>
        {onBack && (
          <Button className={bigButton} variant="outline" onClick={onBack}>
            Go back to work
          </Button>
        )}
      </div>

      <MoreDetails summary={`Tasks you finished today (${completed.length})`}>
        {completed.length === 0 ? (
          <p className="text-base text-muted-foreground">None yet.</p>
        ) : (
          <ul className="flex list-disc flex-col gap-2 pl-6 text-base text-brand-ink">
            {completed.map((w) => (
              <li key={w.id}>{w.title}</li>
            ))}
          </ul>
        )}
      </MoreDetails>
    </div>
  )
}
