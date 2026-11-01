"use client"

/**
 * Work surface for "Choose and build my Weekly / Monthly Boundary Focus™" items.
 * Instead of the Business Asset™ template picker, the founder gets the real
 * boundary tools: elect the boundary, build its operating rule, communicate it.
 */

import { useState } from "react"
import { Check, Lock, MessageSquareShare } from "lucide-react"

import type { BoundaryWorkKind } from "@/lib/ceo-workday/boundary-work"
import { useWeeklyBoundaryFocus } from "@/lib/weekly-boundary-focus/use-weekly-boundary-focus"
import { useMonthlyBoundaryFocus } from "@/lib/monthly-boundary-focus/use-monthly-boundary-focus"
import { BoundaryFocusPanel } from "@/components/ceo-workday/boundary-focus-panel"
import { MonthlyBoundaryFocusPanel } from "@/components/ceo-workday/monthly-boundary-focus-panel"
import { MonthlyBoundaryFocus } from "@/components/decide-design/monthly-boundary-focus"
import { CommunicateDelegateDialog } from "@/components/communications/communicate-delegate-dialog"

export function BoundaryWorkSurface({
  kind,
  expectedEvidence,
  completed,
  workItemId,
  planId,
  onComplete,
}: {
  kind: BoundaryWorkKind
  expectedEvidence?: string | null
  completed: boolean
  workItemId?: string | null
  planId?: string | null
  onComplete: () => void
}) {
  const weekly = useWeeklyBoundaryFocus()
  const monthly = useMonthlyBoundaryFocus()
  const [communicateOpen, setCommunicateOpen] = useState(false)
  const [confirming, setConfirming] = useState(false)

  const weeklyText = weekly.focus.boundaryText?.trim() || ""
  const monthlyChosen = Boolean(monthly.focus?.boundaryText?.trim())

  return (
    <div className="mt-3 flex flex-col gap-4 rounded-2xl border border-[#E8DFE2] bg-[#FAF8F5] px-4 py-4 sm:px-5">
      <div>
        <p className="font-montserrat text-[16.5px] font-bold uppercase tracking-[0.16em] text-[#5A7A45]">
          {kind === "weekly" ? "Your Weekly Boundary Focus™ tools" : "Your Monthly Business Boundary Focus™ tools"}
        </p>
        <p className="mt-1 font-sans text-[16.5px] leading-relaxed text-[#3A2E33] text-pretty">
          Elect your boundary, build the operating rule that protects it, then communicate it to the people it affects.
        </p>
        {expectedEvidence && (
          <p className="mt-1 font-sans text-base text-[#6B5860]">
            Done when: <span className="text-[#3A2E33]">{expectedEvidence}</span>
          </p>
        )}
      </div>

      {kind === "weekly" ? (
        <>
          <BoundaryFocusPanel />
          {weeklyText && (
            <button
              type="button"
              onClick={() => setCommunicateOpen(true)}
              className="flex flex-col items-start gap-1 rounded-2xl border border-[#7FB069]/30 bg-white px-5 py-4 text-left shadow-sm transition-shadow hover:shadow-md"
            >
              <span className="inline-flex items-center gap-2 font-sans text-[16.5px] font-bold text-[#2E1F27]">
                <MessageSquareShare className="h-4 w-4 text-[#5A7A45]" aria-hidden /> Communicate It™
              </span>
              <span className="font-sans text-base leading-relaxed text-[#6B5860]">
                Tell the people affected by this boundary what changes and when.
              </span>
            </button>
          )}
          <CommunicateDelegateDialog
            open={communicateOpen}
            onOpenChange={setCommunicateOpen}
            sourceContext="ceo-workday"
            commitmentType="operating-rule"
            initialType="boundary"
            commitmentText={weeklyText}
            initialSubjectText={weeklyText}
            initialTiming="This week"
            workItemId={workItemId}
            planId={planId}
          />
        </>
      ) : !monthly.entitled ? (
        <p className="inline-flex items-center gap-2 rounded-2xl border border-dashed border-[#E8DFE2] bg-white px-4 py-3 font-sans text-base text-[#6B5860]">
          <Lock className="h-4 w-4 shrink-0" aria-hidden /> The Monthly Boundary Focus™ is included with Monthly
          Membership.
        </p>
      ) : monthlyChosen ? (
        <MonthlyBoundaryFocusPanel />
      ) : (
        <MonthlyBoundaryFocus report={null} />
      )}

      {!completed && (
        <div className="flex flex-wrap items-center gap-2">
          {!confirming ? (
            <button
              type="button"
              onClick={() => setConfirming(true)}
              className="inline-flex items-center gap-1.5 rounded-full border border-[#5A7A45] px-3.5 py-1.5 font-sans text-base font-bold text-[#5A7A45] hover:bg-[#5A7A45]/5"
            >
              <Check className="h-3 w-3" aria-hidden /> My boundary is built — mark complete
            </button>
          ) : (
            <>
              <span className="font-sans text-base text-[#6B5860]">Confirm your boundary rule is in place?</span>
              <button
                type="button"
                onClick={onComplete}
                className="rounded-full bg-[#5A7A45] px-3.5 py-1.5 font-sans text-base font-bold text-white hover:opacity-90"
              >
                Yes, complete
              </button>
              <button
                type="button"
                onClick={() => setConfirming(false)}
                className="font-sans text-base font-semibold text-[#6B5860] underline underline-offset-2"
              >
                Not yet
              </button>
            </>
          )}
        </div>
      )}
    </div>
  )
}
