/**
 * ReviewArchive™ — Phase 14.0
 * Filterable list of past reviews.
 */

import { useState } from "react"
import type { WeeklyReview, MonthlyReview, QuarterlyReview } from "@/lib/executive-reviews/types"

type ArchiveItem =
  | { kind: "weekly"; review: WeeklyReview }
  | { kind: "monthly"; review: MonthlyReview }
  | { kind: "quarterly"; review: QuarterlyReview }

const KIND_LABELS: Record<string, string> = {
  all: "All Reviews",
  weekly: "Weekly",
  monthly: "Monthly",
  quarterly: "Quarterly",
}

const KIND_COLORS: Record<string, string> = {
  weekly:    "bg-brand-green/10 text-brand-green",
  monthly:   "bg-[#C8874A]/10 text-[#C8874A]",
  quarterly: "bg-[#4A8C8C]/10 text-[#4A8C8C]",
}

export function ReviewArchive({
  weekly,
  monthly,
  quarterly,
  onSelect,
}: {
  weekly: WeeklyReview[]
  monthly: MonthlyReview[]
  quarterly: QuarterlyReview[]
  onSelect: (item: ArchiveItem) => void
}) {
  const [filter, setFilter] = useState<"all" | "weekly" | "monthly" | "quarterly">("all")

  const items: ArchiveItem[] = [
    ...weekly.map((r): ArchiveItem => ({ kind: "weekly", review: r })),
    ...monthly.map((r): ArchiveItem => ({ kind: "monthly", review: r })),
    ...quarterly.map((r): ArchiveItem => ({ kind: "quarterly", review: r })),
  ].sort((a, b) =>
    b.review.period.generatedAt.localeCompare(a.review.period.generatedAt),
  )

  const filtered = filter === "all" ? items : items.filter((i) => i.kind === filter)

  return (
    <div className="space-y-4">
      {/* Filter chips */}
      <div className="flex flex-wrap gap-2" role="group" aria-label="Filter reviews">
        {(["all", "weekly", "monthly", "quarterly"] as const).map((k) => (
          <button
            key={k}
            onClick={() => setFilter(k)}
            className={`rounded-full px-3 py-1.5 font-montserrat text-xs font-semibold transition-colors ${
              filter === k
                ? "bg-brand-green text-white"
                : "bg-card border border-black/[0.07] text-brand-ink-soft hover:text-brand-ink"
            }`}
          >
            {KIND_LABELS[k]}
          </button>
        ))}
      </div>

      {filtered.length === 0 && (
        <div className="rounded-xl border border-black/[0.07] bg-card p-8 text-center">
          <p className="font-montserrat text-sm text-brand-ink-soft">
            No {filter === "all" ? "" : KIND_LABELS[filter] + " "}reviews saved yet.
          </p>
          <p className="mt-1 font-montserrat text-xs text-brand-ink-soft">
            Generate your first review using the tab above.
          </p>
        </div>
      )}

      <ul className="space-y-2">
        {filtered.map((item) => (
          <li key={item.review.id}>
            <button
              onClick={() => onSelect(item)}
              className="flex w-full items-center justify-between gap-3 rounded-xl border border-black/[0.07] bg-card px-4 py-3 text-left transition-colors hover:border-brand-green/30 hover:bg-brand-green/5"
            >
              <div className="flex items-center gap-3">
                <span
                  className={`rounded-full px-2 py-0.5 font-montserrat text-[10px] font-bold uppercase tracking-wide ${KIND_COLORS[item.kind]}`}
                >
                  {item.kind}
                </span>
                <span className="font-montserrat text-sm font-semibold text-brand-ink">
                  {item.review.period.label}
                </span>
              </div>
              <div className="flex items-center gap-3">
                <span className="font-montserrat text-xs text-brand-ink-soft">
                  Score: <strong className="text-brand-ink">{item.review.harmonyScore.value}</strong>
                </span>
                <span className="font-montserrat text-xs text-brand-ink-soft">
                  {new Date(item.review.period.generatedAt).toLocaleDateString("en-US", {
                    month: "short",
                    day: "numeric",
                  })}
                </span>
              </div>
            </button>
          </li>
        ))}
      </ul>
    </div>
  )
}
