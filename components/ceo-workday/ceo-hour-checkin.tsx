"use client"

/**
 * CEO Workday™ — Hourly 5-Minute Check-In™
 * ---------------------------------------------------------------------------
 * OUTCOME + EVIDENCE + NEXT DECISION for one hour block.
 *
 * Shows the plan items that were live in that hour (not completed/removed
 * before it began). Each item gets its OWN status — a founder may complete
 * one and leave another in progress. Anything not completed asks
 * "WHAT SHOULD HAPPEN NEXT?" Persisted via saveHourCheckin (Supabase), and
 * the same item's state is updated in place — never a new item.
 */

import { useMemo, useState } from "react"
import { Check } from "lucide-react"
import { Button } from "@/components/ui/button"

import type { HourBlock } from "@/lib/ceo-workday/hour-blocks"
import {
  CEO_ITEM_STATUS_LABEL,
  CEO_NEXT_ACTION_LABEL,
  type CeoNextAction,
  type CeoPlanItem,
  type CeoPlanItemStatus,
} from "@/lib/ceo-workday/plan-types"
import { saveHourCheckin, type HourCheckinItemOutcome } from "@/lib/ceo-workday/plan-server"
import { updateWorkItemStatus } from "@/lib/ceo-workday/todays-work-store"

const STATUS_OPTIONS: CeoPlanItemStatus[] = ["completed", "in-progress", "deferred", "delegated", "eliminated", "blocked", "other"]
const NEXT_OPTIONS: CeoNextAction[] = ["continue-next-hour", "move-segment", "later", "delegate", "eliminate", "need-help", "other"]

const STATUS_STYLE: Record<CeoPlanItemStatus, string> = {
  planned: "",
  completed: "border-[#7FB069] bg-[#7FB069]/10 text-[#3A6B3E]",
  "in-progress": "border-amber-400 bg-amber-50 text-amber-700",
  deferred: "border-[#E8DFE2] bg-[#F4F1EC] text-[#6B5860]",
  delegated: "border-[#5B835F]/40 bg-[#5B835F]/10 text-[#3A6B3E]",
  eliminated: "border-[#E8DFE2] bg-white text-[#6B5860] line-through",
  blocked: "border-[#E26C73] bg-[#E26C73]/10 text-[#C0545A]",
  other: "border-[#3A2E33] bg-[#3A2E33]/5 text-[#2E1F27]",
}

/** Maps plan status → local Today's Work™ queue status (mirror). */
const TO_QUEUE_STATUS: Record<CeoPlanItemStatus, "not-started" | "in-progress" | "completed" | "blocked" | "deferred"> = {
  planned: "not-started",
  completed: "completed",
  "in-progress": "in-progress",
  deferred: "deferred",
  delegated: "deferred",
  eliminated: "deferred",
  blocked: "blocked",
  other: "in-progress",
}

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
    () => items.filter((i) => i.founderDecision !== "remove" && !["completed", "eliminated"].includes(i.status)),
    [items],
  )
  const [status, setStatus] = useState<Record<string, CeoPlanItemStatus>>({})
  const [next, setNext] = useState<Record<string, CeoNextAction>>({})
  const [blocker, setBlocker] = useState<Record<string, string>>({})
  const [reflection, setReflection] = useState("")
  const [saving, setSaving] = useState(false)

  const complete = live.every((i) => {
    const s = status[i.id]
    if (!s) return false
    if (s === "completed" || s === "eliminated") return true
    return !!next[i.id]
  })

  async function handleSave() {
    if (!complete || saving) return
    setSaving(true)
    const outcomes: HourCheckinItemOutcome[] = live.map((i) => ({
      itemId: i.id,
      actualStatus: status[i.id],
      nextAction: status[i.id] === "completed" || status[i.id] === "eliminated" ? null : next[i.id],
      blocker: blocker[i.id]?.trim() || null,
    }))
    await saveHourCheckin({ planId, hourBlock: block.index, scheduledAt, openedAt, reflection: reflection.trim() || null, outcomes })
    // Mirror into the local queue so TodaysWorkQueue reflects reality.
    live.forEach((i) => {
      if (i.localWorkItemId) updateWorkItemStatus(i.localWorkItemId, TO_QUEUE_STATUS[status[i.id]])
    })
    setSaving(false)
    onSaved(outcomes)
  }

  return (
    <div className="rounded-3xl border-2 border-[#E26C73]/30 bg-[#FDF8F5] px-6 py-6 sm:px-7 space-y-5">
      <div>
        <p className="font-montserrat text-[10px] font-bold uppercase tracking-[0.18em] text-[#C0545A]">
          5-Minute Check-In™ · {block.label} PM
        </p>
        <h4 className="mt-1 font-sans text-xl font-bold text-[#2E1F27]">What happened this hour?</h4>
        <p className="mt-1 font-sans text-sm text-[#6B5860]">
          Each piece of work gets its own outcome. Anything not finished gets a next decision.
        </p>
      </div>

      {live.length === 0 ? (
        <p className="rounded-2xl border border-dashed border-[#E8DFE2] bg-white px-4 py-4 font-sans text-sm text-[#6B5860]">
          Everything designed for today is already complete or eliminated. Save to close this hour.
        </p>
      ) : (
        <div className="space-y-4">
          {live.map((item) => {
            const s = status[item.id]
            const needsNext = s && s !== "completed" && s !== "eliminated"
            return (
              <div key={item.id} className="space-y-3 rounded-2xl border border-[#E8DFE2] bg-white p-4">
                <div className="flex items-start justify-between gap-3">
                  <p className="font-sans text-sm font-bold text-[#2E1F27]">{item.title}</p>
                  <span className="shrink-0 font-sans text-xs text-[#6B5860]">planned {item.estimatedMinutes} min</span>
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {STATUS_OPTIONS.map((opt) => (
                    <button
                      key={opt}
                      type="button"
                      aria-pressed={s === opt}
                      onClick={() => setStatus((p) => ({ ...p, [item.id]: opt }))}
                      className={`rounded-full border px-2.5 py-1 font-sans text-xs transition-colors ${
                        s === opt ? STATUS_STYLE[opt] + " font-semibold" : "border-[#E8DFE2] bg-white text-[#6B5860] hover:bg-black/[0.03]"
                      }`}
                    >
                      {CEO_ITEM_STATUS_LABEL[opt]}
                    </button>
                  ))}
                </div>
                {needsNext && (
                  <div className="space-y-2 border-t border-[#E8DFE2] pt-3">
                    <p className="font-montserrat text-[9px] font-bold uppercase tracking-[0.16em] text-[#6B5860]/70">
                      What should happen next?
                    </p>
                    <div className="flex flex-wrap gap-1.5">
                      {NEXT_OPTIONS.filter((n) => !(isFinal && n === "continue-next-hour")).map((n) => (
                        <button
                          key={n}
                          type="button"
                          aria-pressed={next[item.id] === n}
                          onClick={() => setNext((p) => ({ ...p, [item.id]: n }))}
                          className={`rounded-full border px-2.5 py-1 font-sans text-xs transition-colors ${
                            next[item.id] === n
                              ? "border-[#3A2E33] bg-[#3A2E33] text-white"
                              : "border-[#E8DFE2] bg-white text-[#6B5860] hover:bg-black/[0.03]"
                          }`}
                        >
                          {CEO_NEXT_ACTION_LABEL[n]}
                        </button>
                      ))}
                    </div>
                    {(s === "blocked" || next[item.id] === "need-help" || next[item.id] === "other") && (
                      <input
                        type="text"
                        value={blocker[item.id] ?? ""}
                        onChange={(e) => setBlocker((p) => ({ ...p, [item.id]: e.target.value }))}
                        placeholder="What is in the way? (optional)"
                        className="w-full rounded-lg border border-[#E8DFE2] bg-white px-3 py-2 font-sans text-sm text-[#2E1F27] placeholder:text-[#6B5860]/50 focus:outline-none focus:ring-2 focus:ring-[#E26C73]/30"
                      />
                    )}
                  </div>
                )}
              </div>
            )
          })}
        </div>
      )}

      <div>
        <label htmlFor={`refl-${block.index}`} className="font-montserrat text-[9px] font-bold uppercase tracking-[0.16em] text-[#6B5860]/70">
          One line for future-you (optional)
        </label>
        <input
          id={`refl-${block.index}`}
          type="text"
          value={reflection}
          onChange={(e) => setReflection(e.target.value)}
          placeholder="What did this hour teach you?"
          className="mt-1 w-full rounded-lg border border-[#E8DFE2] bg-white px-3 py-2 font-sans text-sm text-[#2E1F27] placeholder:text-[#6B5860]/50 focus:outline-none focus:ring-2 focus:ring-[#E26C73]/30"
        />
      </div>

      <Button
        onClick={handleSave}
        disabled={!complete || saving}
        className="w-full bg-[#E26C73] py-5 text-base font-semibold text-white hover:bg-[#c04d54] disabled:opacity-40"
      >
        <Check className="mr-2 h-4 w-4" />
        {saving ? "Saving…" : isFinal ? "Save & Close My CEO Workday™" : "Save & Continue to the Next Hour"}
      </Button>
    </div>
  )
}
