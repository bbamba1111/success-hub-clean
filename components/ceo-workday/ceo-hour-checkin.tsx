"use client"

/**
 * CEO Workday™ — Hourly 5-Minute Check-In™
 * ---------------------------------------------------------------------------
 * Every piece of live work ends the hour with exactly ONE of three outcomes:
 *
 *   1. Complete            — the outcome exists and is recorded.
 *   2. Continue Next Hour  — carried into the next hourly block (55-min capacity).
 *   3. Save for Later      — progress is preserved and the work resurfaces as
 *                            unscheduled work at the next planning session.
 *
 * Saved work is never auto-scheduled. The same item is updated in place —
 * never duplicated — so history, dependencies and progress survive.
 */

import { useMemo, useState } from "react"
import { ArrowRight, Bookmark, Check } from "lucide-react"
import { Button } from "@/components/ui/button"

import type { HourBlock } from "@/lib/ceo-workday/hour-blocks"
import type { CeoHourOutcome, CeoNextAction, CeoPlanItem, CeoPlanItemStatus } from "@/lib/ceo-workday/plan-types"
import { saveHourCheckin, type HourCheckinItemOutcome } from "@/lib/ceo-workday/plan-server"
import { updateWorkItemStatus } from "@/lib/ceo-workday/todays-work-store"
import { useHourlyWork } from "@/lib/ceo-workday/use-hourly-work"

const HOUR_CAPACITY_MINUTES = 55

const OUTCOMES: Array<{
  id: CeoHourOutcome
  label: string
  hint: string
  icon: typeof Check
  status: CeoPlanItemStatus
  next: CeoNextAction | null
  queue: "completed" | "in-progress" | "saved-for-later"
}> = [
  {
    id: "complete",
    label: "Complete",
    hint: "The outcome exists. Record it.",
    icon: Check,
    status: "completed",
    next: null,
    queue: "completed",
  },
  {
    id: "continue-next-hour",
    label: "Continue next hour",
    hint: "Carry it into the next hour block.",
    icon: ArrowRight,
    status: "in-progress",
    next: "continue-next-hour",
    queue: "in-progress",
  },
  {
    id: "save-for-later",
    label: "Save for later",
    hint: "Keep all progress. It returns at your next planning session — you choose when.",
    icon: Bookmark,
    status: "saved-for-later",
    next: "save-for-later",
    queue: "saved-for-later",
  },
]

interface Props {
  planId: string
  block: HourBlock
  scheduledAt: string
  openedAt: string
  items: CeoPlanItem[]
  isFinal: boolean
  onSaved: (outcomes: HourCheckinItemOutcome[]) => void
}

export function CeoHourCheckin({ planId, block, scheduledAt, openedAt, items, isFinal, onSaved }: Props) {
  const live = useMemo(
    () =>
      items.filter(
        (i) => i.founderDecision !== "remove" && !["completed", "eliminated", "saved-for-later", "delegated"].includes(i.status),
      ),
    [items],
  )
  const { hours } = useHourlyWork()
  const planned = hours[block.index]
  const [choice, setChoice] = useState<Record<string, CeoHourOutcome>>({})
  const [reflection, setReflection] = useState("")
  const [saving, setSaving] = useState(false)

  const options = OUTCOMES.filter((o) => !(isFinal && o.id === "continue-next-hour"))
  const continuingMinutes = live
    .filter((i) => choice[i.id] === "continue-next-hour")
    .reduce((s, i) => s + Math.max(0, i.estimatedMinutes || 0), 0)
  const overCapacity = continuingMinutes > HOUR_CAPACITY_MINUTES
  const ready = live.every((i) => !!choice[i.id]) && !overCapacity

  async function handleSave() {
    if (!ready || saving) return
    setSaving(true)
    const outcomes: HourCheckinItemOutcome[] = live.map((i) => {
      const o = OUTCOMES.find((x) => x.id === choice[i.id])!
      return { itemId: i.id, actualStatus: o.status, nextAction: o.next, blocker: null }
    })
    await saveHourCheckin({ planId, hourBlock: block.index, scheduledAt, openedAt, reflection: reflection.trim() || null, outcomes })
    live.forEach((i) => {
      const o = OUTCOMES.find((x) => x.id === choice[i.id])!
      if (i.localWorkItemId) updateWorkItemStatus(i.localWorkItemId, o.queue)
    })
    setSaving(false)
    onSaved(outcomes)
  }

  return (
    <div className="flex flex-col gap-5 rounded-3xl border-2 border-[#E26C73]/30 bg-[#FDF8F5] px-6 py-6 sm:px-7">
      <div>
        <p className="font-montserrat text-[14px] font-bold uppercase tracking-[0.18em] text-[#C0545A]">
          5-Minute Check-In™ · {block.label} PM
        </p>
        <h4 className="mt-1 font-sans text-xl font-bold text-[#2E1F27]">How did this hour end?</h4>
        <p className="mt-1 font-sans text-sm leading-relaxed text-[#6B5860]">
          Choose one outcome for each piece of work: Complete, Continue next hour, or Save for later.
        </p>
      </div>

      {planned.work.trim() && (
        <div className="rounded-2xl border border-[#7FB069]/30 bg-[#F3F8ED] px-4 py-3">
          <p className="font-montserrat text-[13px] font-bold uppercase tracking-[0.16em] text-[#5B835F]">
            What you planned to work on this hour
          </p>
          <p className="mt-1 font-sans text-sm leading-relaxed text-[#2E1F27] text-pretty">{planned.work}</p>
          {planned.affirmation && (
            <p className="mt-2 font-serif text-sm italic leading-relaxed text-[#5A7A45] text-pretty">{planned.affirmation}</p>
          )}
        </div>
      )}

      {live.length === 0 ? (
        <p className="rounded-2xl border border-dashed border-[#E8DFE2] bg-white px-4 py-4 font-sans text-sm text-[#6B5860]">
          Nothing is still open for this hour. Save to close it.
        </p>
      ) : (
        <ul className="flex flex-col gap-4">
          {live.map((item) => {
            const picked = choice[item.id]
            const pickedHint = options.find((o) => o.id === picked)?.hint
            return (
              <li key={item.id} className="flex flex-col gap-3 rounded-2xl border border-[#E8DFE2] bg-white p-4">
                <div className="flex items-start justify-between gap-3">
                  <p className="font-sans text-sm font-bold text-[#2E1F27]">{item.title}</p>
                  <span className="shrink-0 font-sans text-sm text-[#6B5860]">{item.estimatedMinutes} min</span>
                </div>
                <div role="radiogroup" aria-label={`Outcome for ${item.title}`} className="grid gap-2 sm:grid-cols-3">
                  {options.map((o) => {
                    const Icon = o.icon
                    const active = picked === o.id
                    return (
                      <button
                        key={o.id}
                        type="button"
                        role="radio"
                        aria-checked={active}
                        onClick={() => setChoice((p) => ({ ...p, [item.id]: o.id }))}
                        className={`flex items-center justify-center gap-2 rounded-xl border px-3 py-2.5 font-sans text-sm font-semibold transition-colors ${
                          active
                            ? "border-[#5B835F] bg-[#5B835F] text-white"
                            : "border-[#E8DFE2] bg-white text-[#3A2E33] hover:border-[#5B835F]/50"
                        }`}
                      >
                        <Icon className="h-4 w-4" aria-hidden="true" />
                        {o.label}
                      </button>
                    )
                  })}
                </div>
                {pickedHint && <p className="font-sans text-sm leading-relaxed text-[#6B5860]">{pickedHint}</p>}
              </li>
            )
          })}
        </ul>
      )}

      {continuingMinutes > 0 && (
        <p
          role={overCapacity ? "alert" : undefined}
          className={`rounded-xl px-4 py-3 font-sans text-sm leading-relaxed ${
            overCapacity ? "bg-[#E26C73]/10 text-[#C0545A]" : "bg-[#F3F8ED] text-[#3A6B3E]"
          }`}
        >
          {overCapacity
            ? `${continuingMinutes} min won't fit in next hour's ${HOUR_CAPACITY_MINUTES} min of work. Save something for later.`
            : `${continuingMinutes} of ${HOUR_CAPACITY_MINUTES} min booked into the next hour.`}
        </p>
      )}

      <div>
        <label
          htmlFor={`refl-${block.index}`}
          className="font-montserrat text-[13px] font-bold uppercase tracking-[0.16em] text-[#6B5860]/70"
        >
          Where you left off (optional)
        </label>
        <input
          id={`refl-${block.index}`}
          type="text"
          value={reflection}
          onChange={(e) => setReflection(e.target.value)}
          placeholder="A line for future-you"
          className="mt-1 w-full rounded-lg border border-[#E8DFE2] bg-white px-3 py-2 font-sans text-sm text-[#2E1F27] placeholder:text-[#6B5860]/50 focus:outline-none focus:ring-2 focus:ring-[#E26C73]/30"
        />
      </div>

      <Button
        onClick={handleSave}
        disabled={!ready || saving}
        className="w-full bg-[#E26C73] py-5 text-base font-semibold text-white hover:bg-[#c04d54] disabled:opacity-40"
      >
        <Check className="mr-2 h-4 w-4" />
        {saving ? "Saving…" : isFinal ? "Save & Close My CEO Workday™" : "Save & Continue to the Next Hour"}
      </Button>
    </div>
  )
}
