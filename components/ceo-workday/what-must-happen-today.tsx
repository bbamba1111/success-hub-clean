"use client"

/**
 * WHAT MUST HAPPEN TODAY™ — the founder's own four-hour work plan for the
 * protected CEO Workday™.
 *
 * This is NOT a weekly priority system, NOT an assignment system, and NOT
 * GPS-owned. The founder decides what must happen during each of their four
 * protected hours. There is no item cap, no requirement that the work come
 * from the weekly priorities / BBA / GPS, and an hourly statement never
 * automatically becomes a Business Building Assignment.
 *
 * Each hour is a collapsible container (reusing CollapsibleSubSection):
 *   what must happen this hour? → Create My Work Affirmation™ → Copy.
 * Each hour maps to its existing 5-Minute Check-In™, which reads the same
 * statement from the shared hourly-work store.
 */

import { useEffect, useRef, useState } from "react"
import { Check, Copy, Sparkles } from "lucide-react"
import { CollapsibleSubSection } from "@/components/collapsible-sub-section"
import { HOUR_BLOCKS, type HourBlockIndex } from "@/lib/ceo-workday/hour-blocks"
import { useHourlyWork } from "@/lib/ceo-workday/use-hourly-work"

type PerHour<T> = Record<HourBlockIndex, T>

function emptyStrings(): PerHour<string> {
  return { 1: "", 2: "", 3: "", 4: "" }
}
function emptyBools(): PerHour<boolean> {
  return { 1: false, 2: false, 3: false, 4: false }
}

export function WhatMustHappenToday() {
  const { hours, hydrated, setWork, setAffirmation } = useHourlyWork()

  // Local controlled drafts so typing never jumps the caret when the store
  // broadcasts a change. Seeded once from the persisted plan after hydration.
  const [drafts, setDrafts] = useState<PerHour<string>>(emptyStrings)
  const seeded = useRef(false)
  useEffect(() => {
    if (hydrated && !seeded.current) {
      setDrafts({ 1: hours[1].work, 2: hours[2].work, 3: hours[3].work, 4: hours[4].work })
      seeded.current = true
    }
  }, [hydrated, hours])

  const [busy, setBusy] = useState<PerHour<boolean>>(emptyBools)
  const [errors, setErrors] = useState<PerHour<string | null>>({ 1: null, 2: null, 3: null, 4: null })
  const [copied, setCopied] = useState<HourBlockIndex | null>(null)

  function onWorkChange(index: HourBlockIndex, value: string) {
    setDrafts((d) => ({ ...d, [index]: value }))
    setWork(index, value)
  }

  async function createAffirmation(index: HourBlockIndex) {
    const work = drafts[index].trim()
    if (!work) {
      setErrors((e) => ({ ...e, [index]: "Write what must happen this hour first." }))
      return
    }
    setErrors((e) => ({ ...e, [index]: null }))
    setBusy((b) => ({ ...b, [index]: true }))
    // Make sure the latest text is persisted before we transform it.
    setWork(index, work)
    try {
      const res = await fetch("/api/ceo-workday/work-affirmation", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ work }),
      })
      const data = (await res.json()) as { affirmation?: string; error?: string }
      if (!res.ok || !data.affirmation) {
        setErrors((e) => ({ ...e, [index]: data.error ?? "Could not create your affirmation." }))
        return
      }
      setAffirmation(index, data.affirmation)
    } catch {
      setErrors((e) => ({ ...e, [index]: "Could not create your affirmation. Please try again." }))
    } finally {
      setBusy((b) => ({ ...b, [index]: false }))
    }
  }

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
      <header className="mb-5">
        <p className="font-montserrat text-base font-bold uppercase tracking-[0.18em] text-[#5B835F]">
          What Must Happen Today™
        </p>
        <p className="mt-2 font-sans text-sm leading-relaxed text-[#3A2E33]">
          You decide what must happen during each of your four protected CEO hours. Bring your real business work — one
          focus can span several hours, and nothing here becomes an assignment. Create a short affirmation for each
          hour and copy it into the live session chat.
        </p>
      </header>

      <div className="flex flex-col gap-3">
        {HOUR_BLOCKS.map((block) => {
          const index = block.index
          const entry = hours[index]
          const affirmation = entry.affirmation
          const inputId = `wmht-hour-${index}`
          return (
            <CollapsibleSubSection key={index} title={`Hour ${index} · ${block.label}`}>
              <div className="flex flex-col gap-4">
                <div className="flex flex-col gap-2">
                  <label htmlFor={inputId} className="font-sans text-sm font-semibold text-[#2E1F27]">
                    What must happen during this hour?
                  </label>
                  <textarea
                    id={inputId}
                    value={drafts[index]}
                    onChange={(e) => onWorkChange(index, e.target.value)}
                    rows={3}
                    placeholder="e.g. Finish the client proposal."
                    className="w-full resize-y rounded-2xl border border-[#CBB7BE]/60 bg-white px-4 py-3 font-sans text-sm leading-relaxed text-[#2E1F27] placeholder:text-[#9C8A91] focus:outline-none focus:ring-2 focus:ring-[#7FB069]/40"
                  />
                </div>

                <div className="flex flex-wrap items-center gap-3">
                  <button
                    type="button"
                    onClick={() => createAffirmation(index)}
                    disabled={busy[index]}
                    className="inline-flex items-center gap-2 rounded-full bg-[#5F8F47] px-5 py-2.5 font-sans text-sm font-bold text-white transition-colors hover:bg-[#548039] disabled:opacity-50"
                  >
                    <Sparkles className="h-4 w-4" aria-hidden />
                    {busy[index]
                      ? "Creating…"
                      : affirmation
                        ? "Recreate My Work Affirmation"
                        : "Create My Work Affirmation"}
                  </button>
                </div>

                {errors[index] && <p className="font-sans text-xs text-[#C0545A]">{errors[index]}</p>}

                {affirmation && (
                  <div className="rounded-2xl border border-[#7FB069]/40 bg-white px-5 py-4">
                    <p className="font-montserrat text-[10px] font-bold uppercase tracking-[0.18em] text-[#5B835F]">
                      My Work Affirmation™
                    </p>
                    <p className="mt-2 font-serif text-base italic leading-relaxed text-[#2E1F27] text-pretty">
                      {affirmation}
                    </p>
                    <div className="mt-3 flex items-center gap-3">
                      <button
                        type="button"
                        onClick={() => copyAffirmation(index)}
                        className="inline-flex items-center gap-1.5 rounded-full border border-[#7FB069]/50 bg-[#F3F8ED] px-3.5 py-1.5 font-sans text-xs font-semibold text-[#3A6B2E] transition-colors hover:bg-[#E7F1DD]"
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
                      <span className="font-sans text-xs text-[#6B5860]">Paste it into the live session chat.</span>
                    </div>
                  </div>
                )}
              </div>
            </CollapsibleSubSection>
          )
        })}
      </div>

      <p className="mt-4 font-sans text-xs italic leading-relaxed text-[#6B5860]">
        Each hour connects to its own 5-Minute Check-In™ below, where you&apos;ll capture what actually happened.
      </p>
    </section>
  )
}
