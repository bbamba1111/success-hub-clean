"use client"

/**
 * CEO Workday™ closeout / proof of work — available starting 4:55 PM, same
 * time-gating convention as `ceo-workday-checkins.tsx`. Shows only the
 * outcome-type field implied by today's actual `deriveWorkdayOutcomeType()`
 * result (from the SAME Founder GPS™ move already computed by
 * `FounderGpsWorkspace`) plus a free-text "What changed today?" and
 * optional "Next step" — never all 9 outcome types at once. On save, shows
 * a static closure banner styled like `PowerDownReleaseCard`'s "11:00 PM —
 * UNPLUG™".
 */

import { useEffect, useState } from "react"
import { getDateKey, loadTodaysPlan, updateTodaysPlan } from "@/lib/daily-plan/storage"
import type { TodaysPlanRecord, WorkdayProof } from "@/lib/daily-plan/types"
import { useHarmonyContextOptional } from "@/components/harmony-context/harmony-context-provider"
import { buildGpsContextFromSnapshot, deriveNextBestMove } from "@/lib/founder-gps/next-best-move-engine"
import { getActiveBuildStatusByCapabilityId } from "@/lib/build-record/build-record-store"
import { deriveWorkdayOutcomeType } from "@/lib/daily-plan/workday-outcome"

const OUTCOME_FIELD: Record<string, { key: keyof WorkdayProof; label: string }> = {
  "build-a-capability": { key: "capabilityBuilt", label: "What capability did you build?" },
  "create-an-asset": { key: "assetCreated", label: "What asset did you create?" },
  "delegate-ownership": { key: "delegated", label: "What did you delegate, and to whom?" },
  "create-an-operating-rule": { key: "operatingRuleCreated", label: "What operating rule did you create?" },
  "automate-work": { key: "operatingRuleCreated", label: "What did you automate?" },
}

/** True once the local clock has passed 4:55 PM today. */
function isAvailable(now: Date): boolean {
  const target = new Date(now)
  target.setHours(16, 55, 0, 0)
  return now.getTime() >= target.getTime()
}

export function CeoWorkdayProof() {
  const harmony = useHarmonyContextOptional()
  const snapshot = harmony?.snapshot
  const founderDestination = harmony?.founderDestination

  const nextBestMove =
    snapshot?.ready
      ? deriveNextBestMove(buildGpsContextFromSnapshot(snapshot), {
          founderDestination,
          esaResults: snapshot.business.esaResults,
          operatingHistory: snapshot.intelligence.operatingHistory,
          capabilityBuildStatusById: getActiveBuildStatusByCapabilityId(),
        })
      : null
  const workdayOutcome = nextBestMove ? deriveWorkdayOutcomeType(nextBestMove) : null

  const [plan, setPlan] = useState<TodaysPlanRecord | null>(null)
  const [whatChanged, setWhatChanged] = useState("")
  const [outcomeFieldValue, setOutcomeFieldValue] = useState("")
  const [nextStep, setNextStep] = useState("")
  const [, forceTick] = useState(0)

  useEffect(() => {
    setPlan(loadTodaysPlan(getDateKey()))
  }, [])

  useEffect(() => {
    const interval = setInterval(() => forceTick((n) => n + 1), 30_000)
    return () => clearInterval(interval)
  }, [])

  if (!plan) return null

  const now = new Date()
  const available = isAvailable(now)
  const alreadyRecorded = plan.ceoWorkdayProof

  if (!available && !alreadyRecorded) {
    return (
      <div className="rounded-3xl border border-dashed border-[#E8DFE2] px-6 py-5 text-center">
        <p className="font-sans text-xs text-[#6B5860]">Closeout opens at 4:55 PM.</p>
      </div>
    )
  }

  if (alreadyRecorded) {
    return (
      <div className="px-1 space-y-3">
        <div className="rounded-2xl border border-[#E8DFE2] bg-white px-5 py-4">
          <p className="font-montserrat text-[10px] font-bold uppercase tracking-[0.16em] text-[#6B5860] mb-1.5">
            What Changed Today
          </p>
          <p className="font-sans text-sm text-[#2E1F27] text-pretty">{alreadyRecorded.whatChanged}</p>
          {alreadyRecorded.nextStep && (
            <p className="mt-2 font-sans text-xs text-[#6B5860]">
              <span className="font-semibold">Next step: </span>
              {alreadyRecorded.nextStep}
            </p>
          )}
        </div>
        <ClosureBanner />
      </div>
    )
  }

  const outcomeField = workdayOutcome ? OUTCOME_FIELD[workdayOutcome.type] : undefined

  function handleSave() {
    if (!whatChanged.trim()) return
    const proof: WorkdayProof = {
      outcomeType: workdayOutcome?.type ?? "create-an-operating-rule",
      whatChanged: whatChanged.trim(),
      nextStep: nextStep.trim() || undefined,
      ...(outcomeField ? { [outcomeField.key]: outcomeFieldValue.trim() || undefined } : {}),
      recordedAt: new Date().toISOString(),
    }
    setPlan(updateTodaysPlan({ ceoWorkdayProof: proof }, plan!.dateKey))
  }

  return (
    <div className="rounded-3xl border border-[#C13B6B]/25 bg-[#FBF1F5] px-6 py-5 sm:px-7 sm:py-6 space-y-4">
      <p className="font-montserrat text-[10px] font-bold uppercase tracking-[0.18em] text-[#C13B6B]">
        Close Out Today&apos;s Build
      </p>

      {workdayOutcome && (
        <span className="inline-flex items-center rounded-full bg-[#C13B6B]/10 px-3 py-1 font-montserrat text-[10px] font-bold uppercase tracking-[0.14em] text-[#C13B6B]">
          {workdayOutcome.label}
        </span>
      )}

      <div className="space-y-3">
        <div>
          <label htmlFor="what-changed" className="mb-1.5 block font-sans text-sm font-semibold text-[#2E1F27]">
            What changed today?
          </label>
          <textarea
            id="what-changed"
            value={whatChanged}
            onChange={(e) => setWhatChanged(e.target.value)}
            rows={2}
            placeholder="In plain words, what's different now than at 1 PM?"
            className="w-full resize-none rounded-2xl border border-[#E8DFE2] px-4 py-3 font-sans text-sm text-[#2E1F27] outline-none focus:border-[#C13B6B]/50"
          />
        </div>

        {outcomeField && (
          <div>
            <label htmlFor="outcome-field" className="mb-1.5 block font-sans text-sm font-semibold text-[#2E1F27]">
              {outcomeField.label}
            </label>
            <input
              id="outcome-field"
              type="text"
              value={outcomeFieldValue}
              onChange={(e) => setOutcomeFieldValue(e.target.value)}
              className="w-full rounded-full border border-[#E8DFE2] px-4 py-2.5 font-sans text-sm text-[#2E1F27] outline-none focus:border-[#C13B6B]/50"
            />
          </div>
        )}

        <div>
          <label htmlFor="next-step" className="mb-1.5 block font-sans text-sm font-semibold text-[#2E1F27]">
            Next step <span className="font-normal text-[#6B5860]">(optional)</span>
          </label>
          <input
            id="next-step"
            type="text"
            value={nextStep}
            onChange={(e) => setNextStep(e.target.value)}
            className="w-full rounded-full border border-[#E8DFE2] px-4 py-2.5 font-sans text-sm text-[#2E1F27] outline-none focus:border-[#C13B6B]/50"
          />
        </div>

        <button
          type="button"
          onClick={handleSave}
          disabled={!whatChanged.trim()}
          className="rounded-full bg-[#C13B6B] px-5 py-2.5 font-sans text-xs font-bold text-white transition-opacity hover:opacity-90 disabled:opacity-40"
        >
          Save & Close Out
        </button>
      </div>
    </div>
  )
}

/** Static closure banner, styled like `PowerDownReleaseCard`'s UNPLUG™ banner. */
function ClosureBanner() {
  return (
    <div className="rounded-2xl bg-[#2E2F3A] px-5 py-4 text-center">
      <p className="font-montserrat text-[11px] font-bold uppercase tracking-[0.2em] text-white">
        5:00 PM — WORK COMPLETE
      </p>
      <p className="mt-1 font-sans text-xs text-white/70">Time Freedom™ begins.</p>
    </div>
  )
}
