"use client"

/**
 * In-Place Results Review™ — a lightweight expand/collapse panel used by
 * My Blueprint™ to show the FULL Work-Life Balance Audit™ / Entrepreneur
 * Success Assessment™ results inline, instead of sending the founder to a
 * separate page just to see everything they already scored. Retaking the
 * assessment still requires the real assessment flow, so that link is kept
 * separately — this component only expands the read of already-computed
 * results already sitting in `AuditData` / `EsaResults`.
 */

import { useState } from "react"
import { ChevronDown } from "lucide-react"

interface ResultRow {
  key: string
  label: string
  percentage: number
}

export function InPlaceResultsReview({
  rows,
  accent,
  collapsedCount = 4,
}: {
  rows: ResultRow[]
  accent: string
  collapsedCount?: number
}) {
  const [expanded, setExpanded] = useState(false)

  if (rows.length <= collapsedCount) return null

  const hidden = rows.slice(collapsedCount)

  return (
    <div>
      {expanded && (
        <div className="grid grid-cols-1 gap-2 pt-2">
          {hidden.map((r) => (
            <div key={r.key} className="flex items-center justify-between font-sans text-sm text-brand-ink">
              <span className="text-brand-ink-soft">{r.label}</span>
              <span className="font-semibold">{r.percentage} / 100</span>
            </div>
          ))}
        </div>
      )}
      <button
        type="button"
        onClick={() => setExpanded((v) => !v)}
        className="mt-2 inline-flex items-center gap-1 font-sans text-xs font-semibold hover:underline"
        style={{ color: accent }}
        aria-expanded={expanded}
      >
        {expanded ? "Show fewer results" : `Show all ${rows.length} results`}
        <ChevronDown className={`h-3.5 w-3.5 transition-transform duration-200 ${expanded ? "rotate-180" : ""}`} aria-hidden />
      </button>
    </div>
  )
}
