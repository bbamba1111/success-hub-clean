"use client"

/**
 * EGA Weekly Check™ — embeddable Step 3 of the Weekly Work-Life Balance Reality Check™
 * ---------------------------------------------------------------------------
 * Reuses the exact same Screen 1 "What is getting in your way?" catalog
 * (lib/ega/direct-ega-catalog.ts) as the onboarding Entrepreneur Gap
 * Assessment™ (components/ega/ega-page-client.tsx), but as a lightweight
 * *recurring* weekly capture rather than a one-time baseline.
 *
 * Every Monday, the founder re-selects what's getting in their way *this
 * week*. Selections are saved as EgaEntry rows with `source:
 * "weekly_reality_check"` (a distinct EgaSource from the onboarding
 * `"direct_ega"` — see lib/ega/types.ts) so this component never reads,
 * writes, or otherwise touches the one-time onboarding gate
 * (lib/ega/ega-signal-store.ts) or its `direct_ega` entries.
 *
 * "This week" is computed the same way components/reflection-space.tsx
 * computes it — Monday 00:00 of the current week — so re-opening this step
 * later in the same week continues editing this week's selections, and a
 * new Monday starts fresh automatically without any explicit reset logic.
 */

import { useEffect, useMemo, useRef, useState } from "react"
import { Check, Loader2 } from "lucide-react"
import { DIRECT_EGA_PROBLEM_STATEMENTS } from "@/lib/ega/direct-ega-catalog"
import { createEgaEntry, deleteEgaEntry, getEgaEntries } from "@/lib/ega/ega-storage"
import type { EgaEntry } from "@/lib/ega/types"

/** Monday 00:00 of the current week — mirrors reflection-space.tsx's getWeekKey() boundary. */
function getWeekStart(date = new Date()): Date {
  const d = new Date(date)
  const diff = (d.getDay() + 6) % 7
  d.setDate(d.getDate() - diff)
  d.setHours(0, 0, 0, 0)
  return d
}

interface EgaWeeklyCheckProps {
  /** Called once the founder confirms their selection, with this week's selected problem ids. */
  onComplete: (selectedIds: string[]) => void
}

export function EgaWeeklyCheck({ onComplete }: EgaWeeklyCheckProps) {
  const [selectedIds, setSelectedIds] = useState<string[]>([])
  const [hydrating, setHydrating] = useState(true)
  const [saving, setSaving] = useState(false)
  // This week's existing weekly_reality_check entries, keyed by sourceRef (problem id) -> entry id,
  // so saving reconciles additions/removals instead of creating duplicate rows on every save.
  const existingRef = useRef<Map<string, string>>(new Map())

  useEffect(() => {
    let cancelled = false
    const weekStart = getWeekStart().getTime()
    getEgaEntries().then((entries) => {
      if (cancelled) return
      const thisWeek = entries.filter(
        (e): e is EgaEntry & { sourceRef: string } =>
          e.source === "weekly_reality_check" &&
          Boolean(e.sourceRef) &&
          new Date(e.createdAt).getTime() >= weekStart,
      )
      existingRef.current = new Map(thisWeek.map((e) => [e.sourceRef, e.id]))
      setSelectedIds(thisWeek.map((e) => e.sourceRef))
      setHydrating(false)
    })
    return () => {
      cancelled = true
    }
  }, [])

  const selectedProblems = useMemo(
    () => DIRECT_EGA_PROBLEM_STATEMENTS.filter((p) => selectedIds.includes(p.id)),
    [selectedIds],
  )

  const toggle = (id: string) => {
    setSelectedIds((prev) => (prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]))
  }

  const handleContinue = async () => {
    setSaving(true)
    const existing = existingRef.current
    const toCreate = selectedProblems.filter((p) => !existing.has(p.id))
    const toDeleteIds = Array.from(existing.entries())
      .filter(([sourceRef]) => !selectedIds.includes(sourceRef))
      .map(([, id]) => id)

    await Promise.all([
      ...toCreate.map((problem) =>
        createEgaEntry({
          source: "weekly_reality_check",
          sourceRef: problem.id,
          signal: problem.statement,
          status: "open",
        }),
      ),
      ...toDeleteIds.map((id) => deleteEgaEntry(id)),
    ])

    setSaving(false)
    onComplete(selectedIds)
  }

  if (hydrating) {
    return (
      <div className="flex items-center justify-center rounded-2xl border border-[#E8DFE2] bg-[#FAF8F9] px-6 py-10">
        <Loader2 className="h-5 w-5 animate-spin text-[#6B5860]" aria-hidden />
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-2">
        {DIRECT_EGA_PROBLEM_STATEMENTS.map((problem) => {
          const isSelected = selectedIds.includes(problem.id)
          return (
            <button
              key={problem.id}
              type="button"
              onClick={() => toggle(problem.id)}
              aria-pressed={isSelected}
              className={`flex items-center gap-3 rounded-xl border px-4 py-3.5 text-left transition-colors ${
                isSelected
                  ? "border-[#7FB069]/50 bg-[#F7FBF4]"
                  : "border-[#E8DFE2] bg-white hover:border-[#7FB069]/30 hover:bg-[#FAF8F9]"
              }`}
            >
              <span
                className={`flex h-4 w-4 shrink-0 items-center justify-center rounded border-2 ${
                  isSelected ? "border-[#7FB069] bg-[#7FB069]" : "border-[#DDD5D8]"
                }`}
                aria-hidden
              >
                {isSelected && <Check className="h-2.5 w-2.5 text-white" strokeWidth={3} />}
              </span>
              <span className="font-sans text-sm font-medium text-[#2E1F27]">{problem.statement}</span>
            </button>
          )
        })}
      </div>

      <button
        type="button"
        onClick={handleContinue}
        disabled={saving}
        className="inline-flex items-center justify-center gap-2 rounded-xl border border-[#7FB069]/40 bg-white px-6 py-3 font-sans text-sm font-semibold text-[#5B835F] transition-colors hover:bg-[#7FB069]/10 disabled:opacity-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#7FB069]"
      >
        {saving ? (
          <Loader2 className="h-4 w-4 animate-spin" aria-hidden />
        ) : (
          <Check className="h-4 w-4 text-[#7FB069]/50" aria-hidden />
        )}
        {selectedIds.length === 0 ? "Nothing Is Getting In My Way This Week" : "Save What's Getting In My Way This Week"}
      </button>
    </div>
  )
}
