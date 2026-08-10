"use client"

/**
 * My Flex Time™ History — a collapsed-by-default accordion that shows a
 * record of how the member has been making room for what matters, day by
 * day. Rendered directly below the Flex Time & Preparation™ Guided Moments™
 * experience. Today never appears here — it's still live above.
 */

import { useState } from "react"
import { ChevronDown, History } from "lucide-react"
import { getDayKey, getFlexTimeHistory, type BorrowSource, type FlexTimeDayRecord } from "@/utils/flex-time-storage"

const BORROW_LABEL: Record<BorrowSource, string> = {
  "morning-given": "Morning GIV•EN™",
  "healthy-hybrid-lunch": "Extended Healthy Hybrid Lunch™",
}

function formatDayHeading(dayKey: string): string {
  // dayKey is a local YYYY-MM-DD; parse as local (not UTC) to avoid off-by-one dates.
  const [year, month, day] = dayKey.split("-").map(Number)
  const date = new Date(year, (month ?? 1) - 1, day ?? 1)
  return date.toLocaleDateString(undefined, { weekday: "long", month: "long", day: "numeric" })
}

function statusLine(record: FlexTimeDayRecord): string {
  if (record.resolution === "borrowed" && record.borrowedFrom) {
    return `🌿 Flex Time™ borrowed from ${BORROW_LABEL[record.borrowedFrom]}`
  }
  if (record.resolution === "deferred") {
    return "Deferred to tomorrow's Flex Time™"
  }
  if (record.resolution === "complete") {
    return "Completed ✓"
  }
  return "In progress"
}

function DayCard({ record }: { record: FlexTimeDayRecord }) {
  return (
    <div className="rounded-xl border border-brand-blush bg-white px-5 py-4">
      <p className="font-sans text-sm font-bold text-brand-ink">{formatDayHeading(record.dayKey)}</p>

      {record.intended.length > 0 && (
        <div className="mt-2">
          <p className="font-sans text-xs font-semibold uppercase tracking-[0.1em] text-brand-ink-soft/70">
            I Intended To
          </p>
          <ul className="mt-1 space-y-0.5">
            {record.intended.map((item) => (
              <li key={item} className="font-sans text-sm text-brand-ink-soft">
                ✓ {item}
              </li>
            ))}
          </ul>
        </div>
      )}

      {record.completed.length > 0 && record.completed.length < record.intended.length && (
        <div className="mt-2">
          <p className="font-sans text-xs font-semibold uppercase tracking-[0.1em] text-brand-green-dark/70">
            I Completed
          </p>
          <ul className="mt-1 space-y-0.5">
            {record.completed.map((item) => (
              <li key={item} className="font-sans text-sm text-brand-ink-soft">
                ✓ {item}
              </li>
            ))}
          </ul>
        </div>
      )}

      {record.outstanding.length > 0 && (
        <div className="mt-2">
          <p className="font-sans text-xs font-semibold uppercase tracking-[0.1em] text-brand-coral/80">
            Still Outstanding
          </p>
          <ul className="mt-1 space-y-0.5">
            {record.outstanding.map((item) => (
              <li key={item} className="font-sans text-sm text-brand-ink-soft">
                ○ {item}
              </li>
            ))}
          </ul>
        </div>
      )}

      {record.resolution && record.resolution !== "complete" && (
        <div className="mt-2">
          <p className="font-sans text-xs font-semibold uppercase tracking-[0.1em] text-brand-ink-soft/70">
            My Decision
          </p>
          <p className="mt-1 font-sans text-sm text-brand-ink-soft">
            {record.resolution === "borrowed" && record.borrowedFrom
              ? `Borrowed time from ${BORROW_LABEL[record.borrowedFrom]}`
              : "Deferred to tomorrow's Flex Time™"}
          </p>
        </div>
      )}

      <p className="mt-3 font-sans text-xs font-semibold text-brand-ink">{statusLine(record)}</p>
    </div>
  )
}

export function FlexTimeHistory() {
  const [isOpen, setIsOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const [loaded, setLoaded] = useState(false)
  const [records, setRecords] = useState<FlexTimeDayRecord[]>([])

  async function handleToggle() {
    const next = !isOpen
    setIsOpen(next)
    if (next && !loaded) {
      setLoading(true)
      try {
        const today = getDayKey()
        const all = await getFlexTimeHistory()
        setRecords(all.filter((r) => r.dayKey !== today))
      } finally {
        setLoading(false)
        setLoaded(true)
      }
    }
  }

  return (
    <div className="mb-6 rounded-2xl border border-brand-blush bg-brand-cream/50 overflow-hidden">
      <button
        type="button"
        onClick={handleToggle}
        className="flex w-full items-center justify-between px-5 py-4 text-left hover:bg-brand-cream/70 transition-colors"
        aria-expanded={isOpen}
      >
        <span>
          <span className="flex items-center gap-2 font-sans text-sm font-bold text-brand-ink">
            <History className="h-4 w-4 text-brand-coral" aria-hidden />
            My Flex Time™ History
          </span>
          <span className="mt-0.5 block font-sans text-xs text-brand-ink-soft">
            A record of how you&apos;ve been making room for what matters.
          </span>
        </span>
        <ChevronDown
          className={`h-4 w-4 shrink-0 text-brand-ink-soft/60 transition-transform duration-200 ${isOpen ? "rotate-180" : ""}`}
          aria-hidden
        />
      </button>

      {isOpen && (
        <div className="space-y-3 border-t border-brand-blush px-5 py-5">
          {loading && <p className="font-sans text-sm text-brand-ink-soft">Loading your history...</p>}
          {!loading && records.length === 0 && (
            <p className="font-sans text-sm text-brand-ink-soft">
              Your Flex Time™ history will appear here after your first check-in.
            </p>
          )}
          {!loading && records.map((record) => <DayCard key={record.dayKey} record={record} />)}
        </div>
      )}
    </div>
  )
}

export default FlexTimeHistory
