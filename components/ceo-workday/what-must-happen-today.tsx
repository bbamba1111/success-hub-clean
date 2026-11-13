"use client"

/**
 * WHAT MUST HAPPEN TODAY™ — the founder's four-hour work plan for the
 * protected CEO Workday™.
 *
 * Each hour is a collapsible container (reusing CollapsibleSubSection) that
 * shows only the CEO assignments planned for that hour, with their execution
 * controls. Planning new work happens in the established CEO Workday design
 * flow, and contextual AI help lives inside the BO$$ experience — neither is
 * repeated inside every hour.
 *
 * A previously saved Work Affirmation™ for the hour is still shown so the
 * founder can copy it into the live session chat.
 */

import { useState, type ReactNode } from "react"
import { Check, Copy, Plus } from "lucide-react"
import { CollapsibleSubSection } from "@/components/collapsible-sub-section"
import { HOUR_BLOCKS, type HourBlockIndex } from "@/lib/ceo-workday/hour-blocks"
import { useHourlyWork } from "@/lib/ceo-workday/use-hourly-work"
import type { CeoPlanItem } from "@/lib/ceo-workday/plan-types"

export function WhatMustHappenToday({
  itemsByHour,
  renderItem,
  plannedMinutes,
  onAddTask,
}: {
  /** Designed CEO work grouped into each protected hour. */
  itemsByHour?: Partial<Record<HourBlockIndex, CeoPlanItem[]>>
  /** Renders a single work piece with its execution controls (owned by the live plan). */
  renderItem?: (item: CeoPlanItem) => ReactNode
  plannedMinutes?: number
  onAddTask?: (hour: HourBlockIndex, title: string, outcome: string) => Promise<void>
} = {}) {
  const { hours } = useHourlyWork()
  const [copied, setCopied] = useState<HourBlockIndex | null>(null)
  const [addingHour, setAddingHour] = useState<HourBlockIndex | null>(null)
  const [newTitle, setNewTitle] = useState("")
  const [newOutcome, setNewOutcome] = useState("")
  const [savingTask, setSavingTask] = useState(false)

  async function copyAffirmation(index: HourBlockIndex) {
    const text = hours[index].affirmation
    if (!text) return
    try {
      await navigator.clipboard.writeText(text)
      setCopied(index)
      setTimeout(() => setCopied((c) => (c === index ? null : c)), 2000)
    } catch {
      // Clipboard can be blocked; fail quietly rather than interrupting the founder.
    }
  }

  return (
    <section className="rounded-3xl border border-[#7FB069]/30 bg-[#F3F8ED] px-6 py-6 shadow-sm sm:px-8 sm:py-7">
      <header className="mb-5 flex flex-wrap items-start justify-between gap-2">
        <div className="min-w-0">
          <p className="font-montserrat text-base font-bold uppercase tracking-[0.18em] text-[#5B835F]">
            What Must Happen Today™
          </p>
          <p className="mt-2 font-sans text-sm leading-relaxed text-[#3A2E33]">
            Each protected hour holds the CEO work you designed. Open an hour to start, continue, edit, move, or
            complete that work.
          </p>
        </div>
        {typeof plannedMinutes === "number" && (
          <span className="shrink-0 rounded-full bg-white px-3 py-1 font-sans text-base font-semibold text-[#5B835F]">
            {plannedMinutes} / 240 min planned
          </span>
        )}
      </header>

      <div className="flex flex-col gap-3">
        {HOUR_BLOCKS.map((block) => {
          const index = block.index
          const affirmation = hours[index].affirmation
          const hourItems = itemsByHour?.[index] ?? []
          return (
            <CollapsibleSubSection key={index} title={`Hour ${index} · ${block.label}`}>
              <div className="flex flex-col gap-4">
                {affirmation && (
                  <div className="rounded-2xl border border-[#7FB069]/40 bg-white px-5 py-4">
                    <p className="font-montserrat text-[14px] font-bold uppercase tracking-[0.18em] text-[#5B835F]">
                      My Work Affirmation™
                    </p>
                    <p className="mt-2 font-serif text-base italic leading-relaxed text-[#2E1F27] text-pretty">
                      {affirmation}
                    </p>
                    <div className="mt-3 flex flex-wrap items-center gap-3">
                      <button
                        type="button"
                        onClick={() => copyAffirmation(index)}
                        className="inline-flex items-center gap-1.5 rounded-full border border-[#7FB069]/50 bg-[#F3F8ED] px-3.5 py-1.5 font-sans text-base font-semibold text-[#3A6B2E] transition-colors hover:bg-[#E7F1DD]"
                      >
                        {copied === index ? (
                          <>
                            <Check className="h-3.5 w-3.5" aria-hidden /> Copied.
                          </>
                        ) : (
                          <>
                            <Copy className="h-3.5 w-3.5" aria-hidden /> Copy
                          </>
                        )}
                      </button>
                      <span className="font-sans text-base text-[#6B5860]">Paste it into the live session chat.</span>
                    </div>
                  </div>
                )}

                {renderItem && hourItems.length > 0 && (
                  <div className="flex flex-col gap-2">
                    <p className="font-montserrat text-[14px] font-bold uppercase tracking-[0.18em] text-[#5B835F]">
                      Your CEO work this hour
                    </p>
                    <ol className="flex flex-col gap-2">
                      {hourItems.map((item) => (
                        <li key={item.id}>{renderItem(item)}</li>
                      ))}
                    </ol>
                  </div>
                )}
                {hourItems.length === 0 && (
                  <p className="font-sans text-base leading-relaxed text-[#6B5860]">
                    No work is planned for this hour yet. You can add a task here or move one in from another hour.
                  </p>
                )}
                {onAddTask && (
                  <div className="rounded-xl border border-dashed border-[#7FB069]/60 bg-white p-3">
                    {addingHour === index ? (
                      <form
                        className="space-y-2"
                        onSubmit={async (event) => {
                          event.preventDefault()
                          if (!newTitle.trim() || !newOutcome.trim()) return
                          setSavingTask(true)
                          await onAddTask(index, newTitle.trim(), newOutcome.trim())
                          setSavingTask(false)
                          setNewTitle("")
                          setNewOutcome("")
                          setAddingHour(null)
                        }}
                      >
                        <label className="block font-sans text-sm font-semibold text-[#3A2E33]">
                          What else would you like to work on?
                          <input value={newTitle} onChange={(e) => setNewTitle(e.target.value)} maxLength={200} required className="mt-1 w-full rounded-lg border border-[#E8DFE2] px-3 py-2 font-sans text-base" placeholder="Name the task" />
                        </label>
                        <label className="block font-sans text-sm font-semibold text-[#3A2E33]">
                          What will be true when it is done?
                          <textarea value={newOutcome} onChange={(e) => setNewOutcome(e.target.value)} maxLength={1200} required rows={2} className="mt-1 w-full rounded-lg border border-[#E8DFE2] px-3 py-2 font-sans text-base" placeholder="Expected outcome" />
                        </label>
                        <div className="flex gap-2">
                          <button disabled={savingTask || !newTitle.trim() || !newOutcome.trim()} className="rounded-full bg-[#5A7A45] px-4 py-2 font-sans text-sm font-bold text-white disabled:opacity-50" type="submit">{savingTask ? "Saving…" : "Save task to this hour"}</button>
                          <button type="button" onClick={() => { setAddingHour(null); setNewTitle(""); setNewOutcome("") }} className="rounded-full border px-4 py-2 font-sans text-sm">Cancel</button>
                        </div>
                      </form>
                    ) : (
                      <button type="button" onClick={() => setAddingHour(index)} className="inline-flex items-center gap-2 font-sans text-sm font-semibold text-[#5A7A45]">
                        <Plus className="h-4 w-4" aria-hidden /> Add another task to this hour
                      </button>
                    )}
                  </div>
                )}
              </div>
            </CollapsibleSubSection>
          )
        })}
      </div>

      <p className="mt-4 font-sans text-base italic leading-relaxed text-[#6B5860]">
        Each hour connects to its own 5-Minute Check-In™ below, where you&apos;ll capture what actually happened.
      </p>
    </section>
  )
}
