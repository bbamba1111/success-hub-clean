"use client"

/**
 * Entrepreneur Gap Assessment™ — completed onboarding summary.
 * ---------------------------------------------------------------------------
 * Shown instead of the raw "What is getting in your way?" picker once the
 * founder has already recorded their onboarding signals. Lists every
 * `direct_ega` signal on file; "Edit Selections" re-opens the picker with
 * these pre-checked so the founder can add or remove without starting over.
 */

import { Pencil } from "lucide-react"
import { DIRECT_EGA_PROBLEM_STATEMENTS } from "@/lib/ega/direct-ega-catalog"

export function EgaOnboardingSummary({
  selectedIds,
  onEdit,
}: {
  selectedIds: string[]
  onEdit: () => void
}) {
  const selected = DIRECT_EGA_PROBLEM_STATEMENTS.filter((p) => selectedIds.includes(p.id))

  return (
    <div className="rounded-lg border border-border bg-card px-6 py-8 shadow-sm sm:px-8 sm:py-10">
      <div className="mb-5 flex items-center justify-between">
        <span className="ds-eyebrow">Entrepreneur Gap Assessment™</span>
        <button
          type="button"
          onClick={onEdit}
          className="inline-flex items-center gap-1.5 font-sans text-sm font-medium text-brand-green transition-colors hover:text-brand-green-dark"
        >
          <Pencil className="h-3.5 w-3.5" aria-hidden />
          Edit Selections
        </button>
      </div>
      <h2 className="mb-2 text-balance font-display text-xl font-medium leading-snug text-brand-ink">
        What&apos;s getting in your way
      </h2>
      <p className="mb-5 font-sans text-sm leading-relaxed text-muted-foreground">
        {selected.length > 0
          ? "You've already flagged these — Harmony Lane™ is watching for them as you get started."
          : "You completed this step without flagging anything specific. Click Edit Selections any time to add what's true right now."}
      </p>
      {selected.length > 0 && (
        <div className="flex flex-col gap-2">
          {selected.map((problem) => (
            <div key={problem.id} className="rounded-lg border border-border bg-muted/50 px-4 py-3.5">
              <span className="font-sans text-sm font-medium text-brand-ink">{problem.statement}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
