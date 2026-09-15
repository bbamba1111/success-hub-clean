"use client"

/**
 * Executive Timeline™ — Phase 10.5
 * ---------------------------------------------------------------------------
 * Vertical timeline grouped by month. Reads pre-derived TimelineEntry[].
 */

import type { TimelineEntry, TimelineEntryType } from "@/lib/harmony-memory/types"
import {
  Briefcase,
  BookOpen,
  CheckCircle2,
  Star,
  TrendingUp,
  Calendar,
} from "lucide-react"

// ─── Icon map ─────────────────────────────────────────────────────────────────

const ENTRY_ICONS: Record<TimelineEntryType, React.ComponentType<{ className?: string }>> = {
  "gps-completion": CheckCircle2,
  "briefing-mastered": BookOpen,
  "asset-created": Briefcase,
  "milestone-earned": Star,
  "life-event": Calendar,
  "business-change": TrendingUp,
  "executive-win": TrendingUp,
}

const ENTRY_COLORS: Record<TimelineEntryType, string> = {
  "gps-completion": "#2E7D32",
  "briefing-mastered": "#1565C0",
  "asset-created": "#6A1B9A",
  "milestone-earned": "#C9A96E",
  "life-event": "#AD1457",
  "business-change": "#00695C",
  "executive-win": "#0277BD",
}

// ─── Month grouping ───────────────────────────────────────────────────────────

function formatMonthGroup(isoDate: string): string {
  const d = new Date(isoDate + "T00:00:00")
  return d.toLocaleString("en-US", { month: "long", year: "numeric" })
}

function groupByMonth(entries: TimelineEntry[]): Map<string, TimelineEntry[]> {
  const map = new Map<string, TimelineEntry[]>()
  for (const entry of entries) {
    const key = formatMonthGroup(entry.date)
    const arr = map.get(key) ?? []
    arr.push(entry)
    map.set(key, arr)
  }
  return map
}

// ─── Sub-components ───────────────────────────────────────────────────────────

function TimelineEntryRow({ entry }: { entry: TimelineEntry }) {
  const Icon = ENTRY_ICONS[entry.type] ?? CheckCircle2
  const color = ENTRY_COLORS[entry.type] ?? "#2E7D32"
  const displayDate = new Date(entry.date + "T00:00:00").toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
  })

  return (
    <div className="flex gap-4">
      {/* Pip */}
      <div className="relative flex flex-col items-center">
        <div
          className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full"
          style={{ background: `${color}18` }}
          aria-hidden
        >
          <span style={{ color }} aria-hidden>
            <Icon className="h-3.5 w-3.5" />
          </span>
        </div>
        <div className="mt-1 w-px flex-1 bg-black/[0.07]" aria-hidden />
      </div>

      {/* Content */}
      <div className="pb-5 pt-0.5">
        <div className="flex flex-wrap items-center gap-2">
          <p className="font-montserrat text-[13px] font-semibold text-brand-ink leading-tight">
            {entry.title}
          </p>
          {entry.badge && (
            <span
              className="rounded-full px-2 py-0.5 font-montserrat text-[10px] font-semibold uppercase tracking-wide"
              style={{ background: `${color}18`, color }}
            >
              {entry.badge}
            </span>
          )}
        </div>
        <p className="mt-0.5 text-xs text-brand-ink-soft leading-relaxed">{entry.summary}</p>
        <p className="mt-1 font-montserrat text-[11px] text-brand-ink-soft/60">{displayDate}</p>
      </div>
    </div>
  )
}

// ─── Main component ───────────────────────────────────────────────────────────

interface ExecutiveTimelineProps {
  entries: TimelineEntry[]
}

export function ExecutiveTimeline({ entries }: ExecutiveTimelineProps) {
  if (entries.length === 0) {
    return (
      <div className="rounded-xl border border-dashed border-black/[0.07] px-6 py-10 text-center">
        <Calendar className="mx-auto mb-3 h-8 w-8 text-brand-ink-soft/30" aria-hidden />
        <p className="font-montserrat text-sm font-medium text-brand-ink-soft">
          Your Executive Timeline™ begins when you take your first action.
        </p>
        <p className="mt-1 text-xs text-brand-ink-soft/60">
          GPS completions, assets created, and briefings mastered will all appear here.
        </p>
      </div>
    )
  }

  const grouped = groupByMonth(entries)

  return (
    <div className="space-y-6">
      {Array.from(grouped.entries()).map(([month, monthEntries]) => (
        <div key={month}>
          <p className="mb-3 font-montserrat text-[11px] font-semibold uppercase tracking-widest text-brand-ink-soft/50">
            {month}
          </p>
          <div>
            {monthEntries.map((entry) => (
              <TimelineEntryRow key={entry.id} entry={entry} />
            ))}
          </div>
        </div>
      ))}
    </div>
  )
}
