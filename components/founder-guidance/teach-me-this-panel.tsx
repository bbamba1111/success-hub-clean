"use client"

/**
 * Teach Me This™ panel (Phase 12)
 * ---------------------------------------------------------------------------
 * Collapsible list of business concept + level-appropriate explanation.
 * Every explanation is a passthrough of the EXISTING Business Concepts™
 * registry (`getConceptExplanation`) — no new content is generated.
 */

import { useState } from "react"
import { BookOpen, ChevronDown } from "lucide-react"

import type { ConceptTeaching } from "@/lib/founder-guidance/types"

export function TeachMeThisPanel({ concepts, defaultOpen = false }: { concepts: ConceptTeaching[]; defaultOpen?: boolean }) {
  const [open, setOpen] = useState(defaultOpen)
  if (concepts.length === 0) return null

  return (
    <div className="rounded-2xl border border-brand-blush/60 bg-white overflow-hidden">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        className="flex w-full items-center justify-between gap-3 px-5 py-4 text-left"
      >
        <span className="flex items-center gap-2.5">
          <BookOpen className="h-4 w-4 text-[#C13B6B]" aria-hidden />
          <span className="font-sans text-sm font-semibold text-brand-ink">Teach Me This™</span>
        </span>
        <ChevronDown className={`h-4 w-4 shrink-0 text-brand-ink-soft transition-transform ${open ? "rotate-180" : ""}`} aria-hidden />
      </button>
      {open && (
        <div className="space-y-3 border-t border-brand-blush/60 bg-brand-cream/40 px-5 py-4">
          {concepts.map((c) => (
            <div key={c.conceptId} className="border-b border-brand-blush/50 pb-3 last:border-0 last:pb-0">
              <p className="font-sans text-xs font-bold text-brand-ink">{c.term}</p>
              {c.status === "unknown" ? (
                <p className="mt-1 font-sans text-sm italic leading-relaxed text-brand-ink-soft/70">
                  No explanation available yet for this concept.
                </p>
              ) : (
                <p className="mt-1 font-sans text-sm leading-relaxed text-brand-ink-soft text-pretty">{c.explanation}</p>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
