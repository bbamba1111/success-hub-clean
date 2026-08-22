"use client"

/**
 * Decide My Identity & Design My Business Boundaries For Today™
 * (Tue–Thu, 9:45–10:30 AM — `daily-planning-gps` block).
 *
 * Flow:
 *  0. Founder GPS™ — Your Next Best Move™ — read-only strategic context
 *     from the canonical Founder GPS™ (`deriveNextBestMove`). Informs the
 *     founder's decision below; never auto-written as the decision itself.
 *  1. This Week's Menu — Weekly Data Review — read-only recap of this week's
 *     Business Outcome(s) and the weekly-outcomes carry-forward note.
 *  2. Decide who you're being today — a quick-pick + free-text identity
 *     statement, stored per calendar day.
 *  3. Design today's Business Boundaries™ — a short free-text boundary
 *     statement for today.
 *  4. Decide today's CEO Workday™ outcome — pick/change 1–3 of this week's
 *     outcomes to carry into today. Writes into the SAME `DailyEntry` the
 *     (future) CEO Workspace™ will read, via `updateDailyEntry`, so nothing
 *     is re-entered later and the choice can be changed any time.
 *
 * A Cherry Blossom Check-in™ appears when the block has ~5 minutes left.
 */

import { useEffect, useState } from "react"
import { Compass, Navigation, Plus } from "lucide-react"
import { getWeekKey, loadWeek, getDailyEntry, updateDailyEntry, getWlbbDayKey } from "@/lib/wlbb-week/storage"
import { getGpsRecommendation } from "@/lib/wlbb-week/gps"
import type { WlbbWeekState } from "@/lib/wlbb-week/types"
import { getDateKey, loadDailyIdentity, updateDailyIdentity } from "@/lib/daily-identity/storage"
import type { DailyIdentityRecord, IdentityCheckInStatus } from "@/lib/daily-identity/types"
import { IdentityCheckIn } from "@/components/daily-identity/identity-check-in"
import { OpportunityFocusPicker } from "@/components/daily-identity/opportunity-focus-picker"
import { useHarmonyContextOptional } from "@/components/harmony-context/harmony-context-provider"
import { buildGpsContextFromSnapshot, deriveNextBestMove } from "@/lib/founder-gps/next-best-move-engine"

const IDENTITY_QUICK_PICKS = [
  "A calm, decisive CEO",
  "A present parent and partner",
  "A founder who protects her energy",
  "Someone who finishes what she starts",
  "A leader others can rely on today",
]

const MAX_OUTCOMES = 3

/** Shows the Cherry Blossom Check-in™ once 5 minutes or fewer remain in the segment. */
function isEndingSoon(segmentRemaining?: string): boolean {
  if (!segmentRemaining) return false
  const match = segmentRemaining.match(/(\d+)/)
  if (!match) return false
  return Number.parseInt(match[1], 10) <= 5
}

interface DecideIdentitySpaceProps {
  /** Human label for time left in the segment, e.g. "4m left" — passed through from BusinessDayBlock. */
  segmentRemaining?: string
}

export function DecideIdentitySpace({ segmentRemaining }: DecideIdentitySpaceProps) {
  const [week, setWeek] = useState<WlbbWeekState | null>(null)
  const [record, setRecord] = useState<DailyIdentityRecord | null>(null)
  const [customIdentity, setCustomIdentity] = useState("")

  // Founder GPS™ — Your Next Best Move™ (Phase 7) — read-only strategic
  // context, sourced from the same canonical engine and Harmony Context
  // Engine™ snapshot as My Blueprint™'s section 07. `useHarmonyContextOptional`
  // never throws, so this degrades to nothing if ever rendered outside
  // <HarmonyProvider> — no new recommendation logic is introduced here, and
  // this never writes to `segment_intentions` / `segment_declarations` /
  // `segment_completions`; it only informs the founder's own decision below.
  const harmony = useHarmonyContextOptional()
  const nextBestMove =
    harmony?.snapshot.ready
      ? deriveNextBestMove(buildGpsContextFromSnapshot(harmony.snapshot), {
          founderDestination: harmony.founderDestination,
          esaResults: harmony.snapshot.business.esaResults,
        })
      : null

  useEffect(() => {
    setWeek(loadWeek(getWeekKey()))
    setRecord(loadDailyIdentity(getDateKey()))
  }, [])

  if (!week || !record) {
    return <div className="px-1 py-2 font-sans text-sm text-[#6B5860]">Loading…</div>
  }

  const dayKey = getWlbbDayKey()
  const today = dayKey ? getDailyEntry(week, dayKey) : undefined
  const gpsRecommendation = getGpsRecommendation(week.business.outcomes, today)
  const hasOutcomes = week.business.outcomes.length > 0

  function setIdentity(statement: string) {
    if (!record) return
    setRecord(updateDailyIdentity(record.dateKey, { identityStatement: statement }))
  }

  function setBoundary(statement: string) {
    if (!record) return
    setRecord(updateDailyIdentity(record.dateKey, { boundaryStatement: statement }))
  }

  function toggleOutcome(outcomeId: string) {
    if (!record || !dayKey || !week) return
    const current = record.ceoOutcomeIds
    const next = current.includes(outcomeId)
      ? current.filter((id) => id !== outcomeId)
      : current.length >= MAX_OUTCOMES
        ? current
        : [...current, outcomeId]
    setRecord(updateDailyIdentity(record.dateKey, { ceoOutcomeIds: next }))
    setWeek(updateDailyEntry(week, dayKey, { selectedOutcomeIds: next }))
  }

  function handleCheckIn(status: IdentityCheckInStatus) {
    if (!record) return
    setRecord(updateDailyIdentity(record.dateKey, { checkIn: { status, recordedAt: new Date().toISOString() } }))
  }

  return (
    <div className="space-y-6">
      {/* ── 0. Where do I need to focus today? (opportunity picker) ──────── */}
      <OpportunityFocusPicker />

      {/* ── Founder GPS™ — Your Next Best Move™ (read-only context) ──────── */}
      {nextBestMove && (
        <div className="rounded-3xl border border-[#C13B6B]/25 bg-[#FBF1F5] px-6 py-5 sm:px-7 sm:py-6">
          <div className="mb-2 flex items-center gap-2">
            <Navigation className="h-4 w-4 text-[#C13B6B]" aria-hidden />
            <p className="font-montserrat text-[10px] font-bold uppercase tracking-[0.18em] text-[#C13B6B]">
              Founder GPS™ — Your Next Best Move™
            </p>
          </div>
          <p className="font-sans text-sm leading-relaxed text-[#3A2E33] font-semibold">{nextBestMove.nextTurn}</p>
          {nextBestMove.reason && (
            <p className="mt-1.5 font-sans text-xs leading-relaxed text-[#6B5860]">{nextBestMove.reason}</p>
          )}
          <p className="mt-3 font-sans text-xs italic text-[#6B5860]/80">
            Context to consider — is this what you&apos;re choosing to focus on today?
          </p>
        </div>
      )}

      {/* ── 1. This Week's Menu — Weekly Data Review ─────────────────────── */}
      <div className="rounded-3xl border border-[#7FB069]/25 bg-[#F7FBF4] px-6 py-5 sm:px-7 sm:py-6">
        <div className="mb-2 flex items-center gap-2">
          <Compass className="h-4 w-4 text-[#5A7A45]" aria-hidden />
          <p className="font-montserrat text-[10px] font-bold uppercase tracking-[0.18em] text-[#5A7A45]">
            This Week's Menu — Weekly Data Review
          </p>
        </div>
        <p className="font-sans text-sm leading-relaxed text-[#3A2E33]">{gpsRecommendation}</p>
        {hasOutcomes && (
          <ul className="mt-3 flex flex-wrap gap-2">
            {week.business.outcomes.map((outcome) => (
              <li
                key={outcome.id}
                className="inline-flex items-center rounded-full bg-white px-3 py-1 font-sans text-xs text-[#3A2E33] shadow-sm"
              >
                {outcome.text}
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* ── 2. Decide who you're being today ─────────────────────────────── */}
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
                    ? "border-[#7FB069] bg-[#7FB069] text-white"
                    : "border-[#7FB069]/30 bg-[#F7FBF4] text-[#3A2E33] hover:bg-[#7FB069]/10"
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
            className="min-w-[10rem] flex-1 rounded-full border border-[#E8DFE2] bg-white px-4 py-2 font-sans text-sm text-[#2E1F27] placeholder:text-[#6B5860]/50 focus:outline-none focus:ring-2 focus:ring-[#7FB069]/30"
          />
        </div>
      </div>

      {/* ── 3. Design today's Business Boundaries™ ───────────────────────── */}
      <div className="rounded-3xl border border-[#E8DFE2] bg-white shadow-sm px-6 py-5 sm:px-7 sm:py-6 space-y-3">
        <div>
          <p className="font-montserrat text-[10px] font-bold uppercase tracking-[0.18em] text-[#6B5860]/60">
            Design Today's Business Boundaries™
          </p>
          <p className="mt-1 font-sans text-sm text-[#6B5860]">
            What will today include — and what won&apos;t it? Name the boundary that protects your identity above.
          </p>
        </div>
        <textarea
          value={record.boundaryStatement}
          onChange={(e) => setBoundary(e.target.value)}
          placeholder="e.g. No client calls after 3pm. I leave my desk for lunch. I say no to new requests today."
          rows={3}
          className="w-full rounded-2xl border border-[#E8DFE2] bg-white px-4 py-3 font-sans text-sm text-[#2E1F27] placeholder:text-[#6B5860]/50 focus:outline-none focus:ring-2 focus:ring-[#7FB069]/30"
        />
      </div>

      {/* ── 4. Decide today's CEO Workday™ outcome ────────────────────────── */}
      <div className="rounded-3xl border border-[#E8DFE2] bg-white shadow-sm px-6 py-5 sm:px-7 sm:py-6 space-y-4">
        <div>
          <p className="font-montserrat text-[10px] font-bold uppercase tracking-[0.18em] text-[#6B5860]/60">
            Decide Today's CEO Workday™ Outcome
          </p>
          <p className="mt-1 font-sans text-sm text-[#6B5860]">
            {hasOutcomes
              ? `Choose up to ${MAX_OUTCOMES} of this week's outcomes to work on today. You can change your mind any time — life happens.`
              : "You haven't set this week's Business Outcomes yet — start with Monday's Debrief™ to choose 1–3."}
          </p>
        </div>
        {hasOutcomes && (
          <div className="flex flex-wrap gap-2">
            {week.business.outcomes.map((outcome) => {
              const selected = record.ceoOutcomeIds.includes(outcome.id)
              return (
                <button
                  key={outcome.id}
                  type="button"
                  aria-pressed={selected}
                  onClick={() => toggleOutcome(outcome.id)}
                  className={`inline-flex items-center gap-1.5 rounded-full border px-4 py-2 font-sans text-sm transition-colors ${
                    selected
                      ? "border-[#E26C73] bg-[#E26C73] text-white"
                      : "border-[#E26C73]/30 bg-white text-[#3A2E33] hover:bg-[#E26C73]/10"
                  }`}
                >
                  {selected ? <Plus className="h-3.5 w-3.5 rotate-45" aria-hidden /> : <Plus className="h-3.5 w-3.5" aria-hidden />}
                  {outcome.text}
                </button>
              )
            })}
          </div>
        )}
        {record.ceoOutcomeIds.length > 0 && (
          <p className="font-sans text-xs text-[#6B5860]">
            Saved to today's CEO Workday™ — pick this back up after lunch, or change it here anytime.
          </p>
        )}
      </div>

      {/* ── Cherry Blossom Check-in™ — ~5 minutes before the block ends ──── */}
      {isEndingSoon(segmentRemaining) && (
        <IdentityCheckIn onRecord={handleCheckIn} recorded={record.checkIn?.status} />
      )}
    </div>
  )
}
