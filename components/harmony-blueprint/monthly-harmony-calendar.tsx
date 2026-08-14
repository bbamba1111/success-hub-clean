"use client"

/**
 * MonthlyHarmonyCalendar — the Work-Life Harmony Blueprint™'s "at a glance"
 * calendar-month view.
 *
 * Shows every "Week of…" card for the current calendar month (Life Score™,
 * Business Score™, Harmony Score™) so a founder can review the whole month
 * in one place. The instant a week's Monday falls outside the current
 * calendar month, it automatically moves into the Archive tab — this is a
 * pure date comparison against `weekKey`, never a manual action, so the
 * current month always starts clean the moment a new month begins.
 */

import { useEffect, useMemo, useState } from "react"
import { format, isSameMonth, parseISO } from "date-fns"
import { Archive, Calendar } from "lucide-react"
import { getWeeklyHarmonyHistory, type WeeklyHarmonyRecord } from "@/lib/harmony-blueprint/weekly-history"

function harmonyColor(score: number): string {
  if (score >= 70) return "#5B835F"
  if (score >= 45) return "#E8A84E"
  return "#E26C73"
}

function MiniScore({ label, score, color }: { label: string; score: number | null; color: string }) {
  return (
    <div className="flex flex-col items-center gap-1 min-w-[64px]">
      {score !== null ? (
        <span className="font-sans text-lg font-bold tabular-nums" style={{ color }}>
          {score}
        </span>
      ) : (
        <span className="font-sans text-lg font-bold text-brand-ink-soft/30">—</span>
      )}
      <span className="font-sans text-[10px] font-semibold uppercase tracking-wider text-brand-ink-soft text-center">
        {label}
      </span>
    </div>
  )
}

function WeekCard({ record }: { record: WeeklyHarmonyRecord }) {
  const weekOf = format(parseISO(record.weekKey), "MMMM d, yyyy")
  const hColor = record.harmonyScore !== null ? harmonyColor(record.harmonyScore) : "#6B5860"
  return (
    <div className="rounded-2xl border border-brand-blush bg-white px-5 py-4 flex items-center justify-between gap-4">
      <div className="min-w-0">
        <p className="font-montserrat text-[10px] font-bold uppercase tracking-[0.16em] text-brand-coral">
          Week of
        </p>
        <p className="font-sans text-sm font-semibold text-brand-ink truncate">{weekOf}</p>
      </div>
      <div className="flex items-center gap-4 shrink-0">
        <MiniScore label="Life" score={record.lifeScore} color="#E26C73" />
        <MiniScore label="Harmony" score={record.harmonyScore} color={hColor} />
        <MiniScore label="Business" score={record.bizScore} color="#5B835F" />
      </div>
    </div>
  )
}

export function MonthlyHarmonyCalendar() {
  const [history, setHistory] = useState<WeeklyHarmonyRecord[] | null>(null)
  const [tab, setTab] = useState<"month" | "archive">("month")

  useEffect(() => {
    let mounted = true
    getWeeklyHarmonyHistory().then((records) => {
      if (mounted) setHistory(records)
    })
    return () => {
      mounted = false
    }
  }, [])

  const now = useMemo(() => new Date(), [])
  const thisMonth = useMemo(
    () => (history ?? []).filter((r) => isSameMonth(parseISO(r.weekKey), now)),
    [history, now],
  )
  const archived = useMemo(
    () => (history ?? []).filter((r) => !isSameMonth(parseISO(r.weekKey), now)),
    [history, now],
  )

  if (history === null) {
    return (
      <div className="rounded-2xl border border-dashed border-brand-blush py-6 text-center">
        <p className="font-sans text-xs text-brand-ink-soft">Loading this month&apos;s weeks&hellip;</p>
      </div>
    )
  }

  if (history.length === 0) {
    return (
      <div className="rounded-2xl border border-dashed border-brand-blush py-8 text-center">
        <p className="font-sans text-sm text-brand-ink-soft">
          Your weekly scores will appear here month by month as you complete more weekly Reality
          Checks™ — reviewable at a glance, then archived automatically once a new month begins.
        </p>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {/* Tabs */}
      <div className="flex items-center gap-2">
        <button
          type="button"
          onClick={() => setTab("month")}
          aria-pressed={tab === "month"}
          className={`inline-flex items-center gap-1.5 rounded-full px-4 py-1.5 font-sans text-xs font-semibold transition-colors ${
            tab === "month"
              ? "bg-brand-ink text-white"
              : "border border-brand-blush bg-white text-brand-ink-soft hover:bg-brand-cream"
          }`}
        >
          <Calendar className="h-3.5 w-3.5" aria-hidden />
          {format(now, "MMMM yyyy")}
        </button>
        <button
          type="button"
          onClick={() => setTab("archive")}
          aria-pressed={tab === "archive"}
          disabled={archived.length === 0}
          className={`inline-flex items-center gap-1.5 rounded-full px-4 py-1.5 font-sans text-xs font-semibold transition-colors disabled:cursor-not-allowed disabled:opacity-40 ${
            tab === "archive"
              ? "bg-brand-ink text-white"
              : "border border-brand-blush bg-white text-brand-ink-soft hover:bg-brand-cream"
          }`}
        >
          <Archive className="h-3.5 w-3.5" aria-hidden />
          Archive {archived.length > 0 ? `(${archived.length})` : ""}
        </button>
      </div>

      {/* Weeks */}
      {tab === "month" ? (
        thisMonth.length > 0 ? (
          <div className="space-y-2.5">
            {thisMonth.map((record) => (
              <WeekCard key={record.weekKey} record={record} />
            ))}
          </div>
        ) : (
          <div className="rounded-2xl border border-dashed border-brand-blush py-6 text-center">
            <p className="font-sans text-xs text-brand-ink-soft">
              No weeks scored yet this month — complete this week&apos;s Reality Check™ to begin.
            </p>
          </div>
        )
      ) : (
        <div className="space-y-2.5">
          {archived.map((record) => (
            <WeekCard key={record.weekKey} record={record} />
          ))}
        </div>
      )}
    </div>
  )
}
