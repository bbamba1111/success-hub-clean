"use client"

/**
 * Decide Who You're Being Today™
 * (Tue–Thu, 9:45–10:30 AM — `daily-planning-gps` block).
 *
 * Flow:
 *  1. Decide who you're being today — a quick-pick + free-text identity
 *     statement, stored per calendar day.
 *
 * The Cherry Blossom Check-in™ for this loop lives on `TodaysMoveCard`
 * (Phase 8) — gated by the EXECUTION segment's own remaining time, not this
 * decision block's. A decision hasn't been executed yet, so there is
 * nothing to check in on here.
 */

import { useEffect, useState } from "react"
import { getWeekKey, loadWeek } from "@/lib/wlbb-week/storage"
import type { WlbbWeekState } from "@/lib/wlbb-week/types"
import { getDateKey, loadDailyIdentity, updateDailyIdentity } from "@/lib/daily-identity/storage"
import type { DailyIdentityRecord } from "@/lib/daily-identity/types"

const IDENTITY_QUICK_PICKS = [
  "A calm, decisive CEO",
  "A present parent and partner",
  "A founder who protects her energy",
  "Someone who finishes what she starts",
  "A leader others can rely on today",
]

export function DecideIdentitySpace() {
  const [week, setWeek] = useState<WlbbWeekState | null>(null)
  const [record, setRecord] = useState<DailyIdentityRecord | null>(null)
  const [customIdentity, setCustomIdentity] = useState("")

  useEffect(() => {
    setWeek(loadWeek(getWeekKey()))
    setRecord(loadDailyIdentity(getDateKey()))
  }, [])

  if (!week || !record) {
    return <div className="px-1 py-2 font-sans text-sm text-[#6B5860]">Loading…</div>
  }

  function setIdentity(statement: string) {
    if (!record) return
    setRecord(updateDailyIdentity(record.dateKey, { identityStatement: statement }))
  }

  return (
    <div className="space-y-6">
      {/* ── Decide who you're being today ────────────────────────────────── */}
      <div className="rounded-3xl border border-[#E8DFE2] bg-white shadow-sm px-6 py-5 sm:px-7 sm:py-6 space-y-4">
        <div>
          <p className="font-montserrat text-[10px] font-bold uppercase tracking-[0.18em] text-[#6B5860]/60">
            Decide Who You&apos;re Being Today
          </p>
          <p className="mt-1 font-sans text-sm text-[#6B5860]">
            Your identity for today drives your decisions before your circumstances do.
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          {IDENTITY_QUICK_PICKS.map((label) => {
            const selected = record.identityStatement === label
            return (
              <button
                key={label}
                type="button"
                aria-pressed={selected}
                onClick={() => setIdentity(label)}
                className={`inline-flex items-center gap-1.5 rounded-full border px-4 py-2 font-sans text-sm transition-colors ${
                  selected
                    ? "border-[#8DAE72] bg-[#8DAE72] text-white"
                    : "border-[#E5E5E5] bg-white text-[#2E1F27] hover:bg-[#F4F7F0]"
                }`}
              >
                {label}
              </button>
            )
          })}
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <input
            type="text"
            value={
              IDENTITY_QUICK_PICKS.includes(record.identityStatement) ? customIdentity : record.identityStatement
            }
            onChange={(e) => setCustomIdentity(e.target.value)}
            onBlur={() => customIdentity.trim() && setIdentity(customIdentity.trim())}
            placeholder="Or write your own identity statement…"
            className="min-w-[10rem] flex-1 rounded-full border border-[#E8DFE2] bg-white px-4 py-2 font-sans text-sm text-[#2E1F27] placeholder:text-[#6B5860]/50 focus:outline-none focus:ring-2 focus:ring-[#8DAE72]/30"
          />
        </div>
      </div>
    </div>
  )
}
