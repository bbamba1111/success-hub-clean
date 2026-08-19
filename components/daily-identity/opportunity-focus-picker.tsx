"use client"

/**
 * "Where do I need to focus today?" — Phase 1 Decide → Embody → Educate.
 *
 * Normalizes Weekly Reality Check™ (Supabase) + Work-Life Balance Audit™
 * (localStorage) + Entrepreneur Success Assessment™ (localStorage) opportunity
 * signals behind ONE interface (`getFounderOpportunitySignals`), lets the
 * founder pick one area ≤60% and decide their own action, then generates the
 * identity-based embodiment statement + why-it-matters via the existing
 * Supabase-backed `/api/identity/intention` + `/api/identity/declaration`
 * routes. The resulting decision travels automatically to the chosen Time &
 * Space Boundary™ segment — `TodaysMoveCard` reads it from there. Nothing
 * here is required to use the rest of Decide below it.
 */

import { useEffect, useState } from "react"
import { Sparkles, Target } from "lucide-react"
import {
  getFounderOpportunitySignals,
  filterOpportunities,
  type OpportunitySignal,
} from "@/lib/founder-opportunities/opportunity-signals"
import { SEGMENT_OPTIONS, suggestSegmentId } from "@/lib/founder-opportunities/segment-options"

type LoadState = "loading" | "ready"
type SaveState = "idle" | "saving" | "declaring" | "done" | "error"

const EMPTY_STATE_COPY: Record<OpportunitySignal["source"], string> = {
  reality_check: "Complete this week's Weekly Reality Check™ to identify your current Life opportunities.",
  audit: "Complete your Work-Life Balance Audit™ to identify your current Life opportunities.",
  esa: "Complete your Entrepreneur Success Assessment™ to identify your current Business opportunities.",
}

export function OpportunityFocusPicker() {
  const [loadState, setLoadState] = useState<LoadState>("loading")
  const [opportunities, setOpportunities] = useState<OpportunitySignal[]>([])
  const [availability, setAvailability] = useState<{ reality_check: boolean; audit: boolean; esa: boolean }>({
    reality_check: false,
    audit: false,
    esa: false,
  })
  const [selected, setSelected] = useState<OpportunitySignal | null>(null)
  const [actionText, setActionText] = useState("")
  const [segmentId, setSegmentId] = useState(SEGMENT_OPTIONS[0].id)
  const [suggestedSegment, setSuggestedSegment] = useState(false)
  const [saveState, setSaveState] = useState<SaveState>("idle")
  const [declaration, setDeclaration] = useState("")
  const [whyItMatters, setWhyItMatters] = useState("")

  useEffect(() => {
    getFounderOpportunitySignals()
      .then((result) => {
        setOpportunities(filterOpportunities(result.signals))
        setAvailability(result.availability)
        setLoadState("ready")
      })
      .catch(() => setLoadState("ready"))
  }, [])

  function handlePick(signal: OpportunitySignal) {
    setSelected(signal)
    setSaveState("idle")
    setDeclaration("")
    setWhyItMatters("")
    if (!suggestedSegment) {
      setSegmentId(suggestSegmentId(signal.label))
    }
  }

  function handleActionTextChange(value: string) {
    setActionText(value)
    if (!suggestedSegment && value.trim().length > 6) {
      setSegmentId(suggestSegmentId(value))
      setSuggestedSegment(true)
    }
  }

  async function handleSetFocus() {
    if (!selected || !actionText.trim()) return

    setSaveState("saving")
    setDeclaration("")
    setWhyItMatters("")

    try {
      const intentionRes = await fetch("/api/identity/intention", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          segment_id: segmentId,
          intention_notes: actionText.trim(),
          opportunity_source: selected.source,
          opportunity_area: selected.label,
          opportunity_score: selected.score,
        }),
      })

      if (!intentionRes.ok) throw new Error("Failed to save today's decision")
      const { intention } = await intentionRes.json()

      setSaveState("declaring")

      const declarationRes = await fetch("/api/identity/declaration", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          intention_id: intention.id,
          segment_id: segmentId,
          intention_notes: actionText.trim(),
          opportunity_area: selected.label,
        }),
      })

      if (!declarationRes.ok || !declarationRes.body) throw new Error("Failed to generate declaration")

      const reader = declarationRes.body.getReader()
      const decoder = new TextDecoder()
      let full = ""
      // eslint-disable-next-line no-constant-condition
      while (true) {
        const { done, value } = await reader.read()
        if (done) break
        full += decoder.decode(value, { stream: true })
        const [before, after] = full.split("\n\n---WHY---\n\n")
        setDeclaration(before)
        if (after !== undefined) setWhyItMatters(after)
      }

      setSaveState("done")
    } catch (error) {
      console.error("[v0] OpportunityFocusPicker save failed:", error)
      setSaveState("error")
    }
  }

  if (loadState === "loading") {
    return <div className="px-1 py-2 font-sans text-sm text-[#6B5860]">Loading today&apos;s opportunities…</div>
  }

  const hasAnyData = availability.reality_check || availability.audit || availability.esa
  const missingSources = (Object.keys(availability) as Array<keyof typeof availability>).filter(
    (key) => !availability[key],
  )

  return (
    <div className="rounded-3xl border border-[#E26C73]/25 bg-[#FFF7F5] px-6 py-5 sm:px-7 sm:py-6 space-y-4">
      <div className="flex items-center gap-2">
        <Target className="h-4 w-4 text-[#C4515A]" aria-hidden />
        <p className="font-montserrat text-[10px] font-bold uppercase tracking-[0.18em] text-[#C4515A]">
          Where Do I Need To Focus Today?
        </p>
      </div>

      {!hasAnyData && (
        <div className="space-y-1.5">
          {missingSources.map((source) => (
            <p key={source} className="font-sans text-sm text-[#6B5860]">
              {EMPTY_STATE_COPY[source]}
            </p>
          ))}
        </div>
      )}

      {hasAnyData && opportunities.length === 0 && (
        <p className="font-sans text-sm text-[#6B5860]">
          Nothing at or below 60% right now — no forced focus today. You&apos;re free to move on below.
        </p>
      )}

      {opportunities.length > 0 && !selected && (
        <div className="space-y-3">
          <p className="font-sans text-sm text-[#6B5860]">
            These areas are at or below 60% right now. Choose one if you&apos;d like today to move it forward — this
            is entirely your call.
          </p>
          <div className="flex flex-wrap gap-2">
            {opportunities.map((signal) => (
              <button
                key={`${signal.source}-${signal.area}`}
                type="button"
                onClick={() => handlePick(signal)}
                className="inline-flex items-center gap-1.5 rounded-full border border-[#E26C73]/30 bg-white px-4 py-2 font-sans text-sm text-[#3A2E33] transition-colors hover:bg-[#E26C73]/10"
              >
                {signal.label} — {signal.score}%
              </button>
            ))}
          </div>
          {missingSources.length > 0 && (
            <div className="space-y-1">
              {missingSources.map((source) => (
                <p key={source} className="font-sans text-xs text-[#6B5860]/70">
                  {EMPTY_STATE_COPY[source]}
                </p>
              ))}
            </div>
          )}
        </div>
      )}

      {selected && saveState !== "done" && (
        <div className="space-y-3">
          <div className="flex flex-wrap items-center gap-2">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-[#E26C73] px-4 py-2 font-sans text-sm text-white">
              {selected.label} — {selected.score}%
            </span>
            <button
              type="button"
              onClick={() => {
                setSelected(null)
                setSuggestedSegment(false)
              }}
              className="font-sans text-xs text-[#6B5860] underline hover:text-[#3A2E33]"
            >
              Choose a different area
            </button>
          </div>

          <div>
            <label htmlFor="opportunity-action" className="font-sans text-sm text-[#6B5860]">
              What will you do about it today?
            </label>
            <textarea
              id="opportunity-action"
              value={actionText}
              onChange={(e) => handleActionTextChange(e.target.value)}
              placeholder="e.g. I will walk for 15 minutes during my Movement Window™."
              rows={2}
              className="mt-1.5 w-full rounded-2xl border border-[#E8DFE2] bg-white px-4 py-3 font-sans text-sm text-[#2E1F27] placeholder:text-[#6B5860]/50 focus:outline-none focus:ring-2 focus:ring-[#E26C73]/30"
            />
          </div>

          <div>
            <label htmlFor="opportunity-segment" className="font-sans text-sm text-[#6B5860]">
              Which part of today will this happen during?
            </label>
            <select
              id="opportunity-segment"
              value={segmentId}
              onChange={(e) => {
                setSegmentId(e.target.value)
                setSuggestedSegment(true)
              }}
              className="mt-1.5 w-full rounded-2xl border border-[#E8DFE2] bg-white px-4 py-3 font-sans text-sm text-[#2E1F27] focus:outline-none focus:ring-2 focus:ring-[#E26C73]/30"
            >
              {SEGMENT_OPTIONS.map((option) => (
                <option key={option.id} value={option.id}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>

          <button
            type="button"
            onClick={handleSetFocus}
            disabled={!actionText.trim() || saveState === "saving" || saveState === "declaring"}
            className="inline-flex items-center gap-1.5 rounded-full bg-[#E26C73] px-5 py-2.5 font-sans text-sm font-semibold text-white transition-colors hover:bg-[#C4515A] disabled:cursor-not-allowed disabled:opacity-50"
          >
            <Sparkles className="h-3.5 w-3.5" aria-hidden />
            {saveState === "saving" && "Saving…"}
            {saveState === "declaring" && "Writing your declaration…"}
            {(saveState === "idle" || saveState === "error") && "Set My Focus"}
          </button>

          {saveState === "error" && (
            <p className="font-sans text-xs text-[#C4515A]">
              Something went wrong saving that — please try again.
            </p>
          )}
        </div>
      )}

      {saveState === "done" && selected && (
        <div className="space-y-2 rounded-2xl border border-[#E26C73]/20 bg-white px-5 py-4">
          <p className="font-montserrat text-[10px] font-bold uppercase tracking-[0.18em] text-[#C4515A]">
            Your Move
          </p>
          <p className="font-sans text-sm leading-relaxed text-[#2E1F27]">{declaration}</p>
          {whyItMatters && (
            <div className="pt-1">
              <p className="font-montserrat text-[10px] font-bold uppercase tracking-[0.14em] text-[#6B5860]/60">
                Why This Matters
              </p>
              <p className="mt-1 font-sans text-sm leading-relaxed text-[#6B5860]">{whyItMatters}</p>
            </div>
          )}
          <p className="pt-1 font-sans text-xs text-[#6B5860]">
            This will meet you during your {SEGMENT_OPTIONS.find((s) => s.id === segmentId)?.label} today — no need
            to enter it again.
          </p>
        </div>
      )}
    </div>
  )
}
