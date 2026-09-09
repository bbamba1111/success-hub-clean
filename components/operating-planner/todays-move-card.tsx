"use client"

/**
 * Phase 1: Execute → Check. Shown just before `OperatingPlanner` inside any
 * Time & Space Boundary™ segment that has a `PLANNER_CONFIG` entry, ONLY when
 * today's Decide flow (`OpportunityFocusPicker`) already produced a
 * declaration for THIS segment. If none exists, renders nothing — the
 * OperatingPlanner behaves exactly as it does today for founders who skipped
 * Decide's opportunity step. The founder never re-enters the decision here.
 */

import { useEffect, useState } from "react"
import { ChevronDown, Copy, Check } from "lucide-react"
import { IdentityCheckIn } from "@/components/daily-identity/identity-check-in"
import type { IdentityCheckInStatus } from "@/lib/daily-identity/types"

interface TodaysMoveCardProps {
  segmentId: string
  /** Human label for time left in the segment, e.g. "4m left" — passed through from BusinessDayBlock. */
  segmentRemaining?: string
}

interface TodaysDeclaration {
  intentionId: string
  declaration: string
  whyItMatters: string | null
}

/** Maps the founder-facing 4-state check-in to the 3-state value the existing reflection prompts expect. */
function mapCheckInToCompletionStatus(status: IdentityCheckInStatus): "honored" | "modified" | "not-completed" {
  switch (status) {
    case "done":
      return "honored"
    case "partial":
    case "changed":
      return "modified"
    case "not-yet":
      return "not-completed"
  }
}

function isEndingSoon(segmentRemaining?: string): boolean {
  if (!segmentRemaining) return false
  const match = segmentRemaining.match(/(\d+)/)
  if (!match) return false
  return Number.parseInt(match[1], 10) <= 5
}

export function TodaysMoveCard({ segmentId, segmentRemaining }: TodaysMoveCardProps) {
  const [loaded, setLoaded] = useState(false)
  const [todaysMove, setTodaysMove] = useState<TodaysDeclaration | null>(null)
  const [showWhy, setShowWhy] = useState(false)
  const [copied, setCopied] = useState(false)
  const [checkInStatus, setCheckInStatus] = useState<IdentityCheckInStatus | undefined>(undefined)

  useEffect(() => {
    let cancelled = false

    async function load() {
      try {
        const [intentionRes, completionRes] = await Promise.all([
          fetch(`/api/identity/intention?segment_id=${encodeURIComponent(segmentId)}`),
          fetch(`/api/identity/completion?segment_id=${encodeURIComponent(segmentId)}&limit=5`),
        ])

        if (cancelled) return

        if (intentionRes.ok) {
          const { intentions } = await intentionRes.json()
          const today = intentions?.[0]
          const declarations = today?.segment_declarations
          const latestDeclaration = Array.isArray(declarations) ? declarations[declarations.length - 1] : undefined
          if (today && latestDeclaration?.declaration) {
            setTodaysMove({
              intentionId: today.id,
              declaration: latestDeclaration.declaration,
              whyItMatters: latestDeclaration.why_it_matters ?? null,
            })
          }
        }

        if (completionRes.ok) {
          const { completions } = await completionRes.json()
          const todayKey = new Date().toISOString().split("T")[0]
          const todaysCompletion = completions?.find((c: { segment_date: string }) => c.segment_date === todayKey)
          if (todaysCompletion?.founder_check_in_status) {
            setCheckInStatus(todaysCompletion.founder_check_in_status as IdentityCheckInStatus)
          }
        }
      } catch (error) {
        console.error("[v0] TodaysMoveCard load failed:", error)
      } finally {
        if (!cancelled) setLoaded(true)
      }
    }

    load()
    return () => {
      cancelled = true
    }
  }, [segmentId])

  async function handleCheckIn(status: IdentityCheckInStatus) {
    setCheckInStatus(status)
    if (!todaysMove) return

    try {
      await fetch("/api/identity/completion", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          intention_id: todaysMove.intentionId,
          segment_id: segmentId,
          completion_status: mapCheckInToCompletionStatus(status),
          founder_check_in_status: status,
        }),
      })
    } catch (error) {
      console.error("[v0] TodaysMoveCard check-in save failed:", error)
    }
  }

  function handleCopy() {
    if (!todaysMove) return
    navigator.clipboard.writeText(todaysMove.declaration).then(() => {
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    })
  }

  if (!loaded || !todaysMove) return null

  return (
    <div className="px-7 py-6 space-y-4">
      <div className="rounded-3xl border border-[#7FB069]/25 bg-[#F7FBF4] px-6 py-5 sm:px-7 sm:py-6 space-y-3">
        <p className="font-montserrat text-[10px] font-bold uppercase tracking-[0.18em] text-[#5A7A45]">Your Move</p>
        <p className="font-sans text-sm leading-relaxed text-[#2E1F27]">{todaysMove.declaration}</p>

        {todaysMove.whyItMatters && (
          <div>
            <button
              type="button"
              aria-expanded={showWhy}
              onClick={() => setShowWhy((v) => !v)}
              className="flex items-center gap-1.5 font-montserrat text-[10px] font-bold uppercase tracking-[0.14em] text-[#5A7A45]/80 hover:text-[#5A7A45]"
            >
              <ChevronDown className={`h-3 w-3 transition-transform duration-200 ${showWhy ? "rotate-180" : ""}`} aria-hidden />
              Why This Matters
            </button>
            {showWhy && (
              <p className="mt-2 font-sans text-sm leading-relaxed text-[#6B5860]">{todaysMove.whyItMatters}</p>
            )}
          </div>
        )}

        <button
          type="button"
          onClick={handleCopy}
          className="inline-flex items-center gap-1.5 rounded-full border border-[#7FB069]/30 bg-white px-4 py-2 font-sans text-xs font-semibold text-[#3A2E33] transition-colors hover:bg-[#7FB069]/10"
        >
          {copied ? <Check className="h-3.5 w-3.5" aria-hidden /> : <Copy className="h-3.5 w-3.5" aria-hidden />}
          {copied ? "Copied" : "Copy & Share"}
        </button>
      </div>

      {isEndingSoon(segmentRemaining) && (
        <IdentityCheckIn
          onRecord={handleCheckIn}
          recorded={checkInStatus}
          changedAction={{ label: "Adjust in Decide & Design", href: "/?openSpace=daily-planning-gps" }}
        />
      )}
    </div>
  )
}
