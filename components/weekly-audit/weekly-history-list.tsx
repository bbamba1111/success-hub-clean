import Link from "next/link"
import { listWeeklyHistory } from "@/lib/boundary-report/weekly-actions"
import { formatAuditDate, formatPeriod } from "@/components/weekly-audit/weekly-results"

export async function WeeklyHistoryList() {
  const history = await listWeeklyHistory()
  if (history.length === 0) return null

  return (
    <section aria-labelledby="weekly-history-title" className="mt-8 flex flex-col gap-3">
      <h2 id="weekly-history-title" className="font-playfair text-2xl font-bold text-brand-ink">
        Weekly 7-Day Audit History
      </h2>
      <p className="font-sans text-sm text-brand-ink-soft text-pretty">
        Each Monday audit is saved as its own record. Your 30-day baseline above is never changed.
      </p>
      <ul className="flex flex-col gap-2">
        {history.map((h) => (
          <li key={h.id}>
            <Link
              href={`/my-report/weekly/${h.id}`}
              className="flex items-center justify-between gap-3 rounded-2xl border border-brand-sage-light bg-white px-5 py-3.5 transition-colors hover:border-brand-tan-dark/50"
            >
              <span className="flex flex-col">
                <span className="font-sans text-sm font-semibold text-brand-ink">
                  {formatPeriod(h.periodStart, h.periodEnd)}
                </span>
                <span className="font-sans text-xs text-brand-ink-soft">
                  Completed {formatAuditDate(h.completedAt)}
                  {h.priorityLabels.length > 0 ? ` · ${h.priorityLabels.join(", ")}` : ""}
                </span>
              </span>
              <span className="font-sans text-lg font-bold tabular-nums text-brand-ink">{h.overall}</span>
            </Link>
          </li>
        ))}
      </ul>
    </section>
  )
}
