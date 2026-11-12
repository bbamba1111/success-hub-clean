"use client"

import { useEffect, useState } from "react"
import { getRealityChecksHistory } from "@/utils/reality-check-storage"
import { CATEGORY_LABELS } from "@/utils/life-value-categories"

type WeeklyAuditRecord = Awaited<ReturnType<typeof getRealityChecksHistory>>[number]

function formatWeek(weekKey: string): string {
  const date = new Date(`${weekKey}T12:00:00`)
  return `Week of ${date.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}`
}

/**
 * Read-only archive for the optional weekly Work-Life Balance Audit™.
 * Reads the existing reality_checks history; it creates no new records.
 */
export function WeeklyAuditHistory() {
  const [history, setHistory] = useState<WeeklyAuditRecord[]>([])
  const [loaded, setLoaded] = useState(false)

  useEffect(() => {
    let active = true
    getRealityChecksHistory()
      .then((records) => {
        if (active) setHistory(records)
      })
      .catch(() => {
        if (active) setHistory([])
      })
      .finally(() => {
        if (active) setLoaded(true)
      })
    return () => {
      active = false
    }
  }, [])

  if (!loaded || history.length === 0) return null

  return (
    <details className="mt-5 rounded-2xl border border-brand-blush/60 bg-brand-cream/60 px-4 py-3">
      <summary className="cursor-pointer font-sans text-sm font-semibold text-brand-ink">
        Weekly Work-Life Balance Audit history ({history.length})
      </summary>
      <ul className="mt-3 flex flex-col gap-2">
        {history.map((record) => {
          const priorities = (record.selected_priority_areas ?? []).map(
            (key) => CATEGORY_LABELS[key] ?? key,
          )
          return (
            <li
              key={record.week_key}
              className="flex flex-wrap items-center justify-between gap-2 border-t border-brand-blush/60 pt-2"
            >
              <div className="min-w-0">
                <p className="font-sans text-sm font-medium text-brand-ink">{formatWeek(record.week_key)}</p>
                {priorities.length > 0 && (
                  <p className="font-sans text-xs text-brand-ink-soft">{priorities.join(" · ")}</p>
                )}
              </div>
              <span className="font-sans text-sm font-semibold tabular-nums text-brand-ink">
                {record.overall_score ?? "—"} / 100
              </span>
            </li>
          )
        })}
      </ul>
    </details>
  )
}
