"use client"

/**
 * Founder Understanding Level™ picker (Phase 12)
 * ---------------------------------------------------------------------------
 * A compact 5-pill row — mirrors `BusinessComprehensionCard`'s selector at a
 * smaller scale. Reads/writes through `lib/founder-guidance/understanding-level`,
 * which is a thin alias over the EXISTING Business Comprehension™ store — no
 * new preference, no new storage key.
 */

import { useEffect, useState } from "react"
import { Check } from "lucide-react"

import {
  ALL_UNDERSTANDING_LEVELS,
  UNDERSTANDING_LEVEL_DEFINITIONS,
  UNDERSTANDING_LEVEL_EVENT,
  UNDERSTANDING_LEVEL_REASSURANCE,
  getUnderstandingLevel,
  setUnderstandingLevel,
  type UnderstandingLevelId,
} from "@/lib/founder-guidance/understanding-level"

export function UnderstandingLevelPicker() {
  const [level, setLevel] = useState<UnderstandingLevelId>("founder")
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setLevel(getUnderstandingLevel())
    setMounted(true)
    const onChange = () => setLevel(getUnderstandingLevel())
    window.addEventListener(UNDERSTANDING_LEVEL_EVENT, onChange)
    return () => window.removeEventListener(UNDERSTANDING_LEVEL_EVENT, onChange)
  }, [])

  function choose(next: UnderstandingLevelId) {
    setLevel(next)
    setUnderstandingLevel(next)
  }

  return (
    <div className="rounded-2xl border border-brand-blush/60 bg-white px-4 py-3.5 sm:px-5">
      <p className="font-sans text-[10px] font-bold uppercase tracking-[0.18em] text-brand-ink-soft/80 mb-2">
        Your Understanding Level™
      </p>
      <div className="flex flex-wrap gap-1.5" role="group" aria-label="Founder Understanding Level™">
        {ALL_UNDERSTANDING_LEVELS.map((id) => {
          const def = UNDERSTANDING_LEVEL_DEFINITIONS.find((d) => d.id === id)!
          const active = mounted && id === level
          return (
            <button
              key={id}
              type="button"
              onClick={() => choose(id)}
              aria-pressed={active}
              title={def.tagline}
              className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1.5 font-sans text-xs font-semibold transition-colors ${
                active
                  ? "border-[#C13B6B] bg-[#C13B6B]/[0.08] text-[#C13B6B]"
                  : "border-brand-blush/70 bg-brand-cream/40 text-brand-ink-soft hover:border-[#C13B6B]/40"
              }`}
            >
              {active && <Check className="h-3 w-3" aria-hidden />}
              {def.name}
            </button>
          )
        })}
      </div>
      <p className="mt-2.5 font-sans text-[11px] leading-relaxed text-brand-ink-soft/80 text-pretty">
        {UNDERSTANDING_LEVEL_REASSURANCE}
      </p>
    </div>
  )
}
