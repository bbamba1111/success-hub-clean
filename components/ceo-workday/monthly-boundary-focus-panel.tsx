"use client"

import { useState } from "react"
import { CalendarRange, Hammer, MessageSquareShare, ShieldCheck } from "lucide-react"

import { useMonthlyBoundaryFocus } from "@/lib/monthly-boundary-focus/use-monthly-boundary-focus"
import { useHumanSos } from "@/lib/human-sos/use-human-sos"
import { BoundaryBuilderDialog } from "@/components/boundary-builder/boundary-builder-dialog"
import { CommunicateDelegateDialog } from "@/components/communications/communicate-delegate-dialog"

const dateFormat = new Intl.DateTimeFormat("en-US", { month: "short", day: "numeric", year: "numeric" })

function formatDate(iso: string | null) {
  return iso ? dateFormat.format(new Date(iso)) : null
}

/**
 * Builder records are keyed per cycle (`monthly-c1`, `monthly-c2`, …) so each
 * 30-day cycle keeps its own rule and history and never collides with the
 * weekly `YYYY-Www` keys.
 */
export function monthlyBuilderKey(cycleKey: string) {
  return `monthly-${cycleKey}`
}

function OperatingRuleBlock({
  builderKey,
  boundaryText,
  fallbackDescription,
  onBuild,
}: {
  builderKey: string
  boundaryText: string
  fallbackDescription: string | null
  onBuild: () => void
}) {
  // Shares the Builder's SWR key, so saving in the Builder updates this card instantly.
  const { sos } = useHumanSos(builderKey, boundaryText)
  const rule = sos.operatingRuleText?.trim()

  if (rule) {
    return (
      <div className="mt-1 flex flex-col gap-1.5 rounded-2xl border border-[#7FB069]/30 bg-background px-5 py-4">
        <span className="font-montserrat text-[10px] font-bold uppercase tracking-[0.16em] text-[#5A7A45]">
          My Operating Rule — follow this all cycle
        </span>
        <p className="font-sans text-base leading-relaxed text-[#2E1F27] text-pretty">{rule}</p>
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-2">
      {fallbackDescription && (
        <p className="font-sans text-sm leading-relaxed text-[#3A2E33] text-pretty">{fallbackDescription}</p>
      )}
      <p className="font-sans text-xs leading-relaxed text-[#6B5860]">
        You haven&apos;t set your operating rule yet.{" "}
        <button type="button" onClick={onBuild} className="font-semibold text-[#5A7A45] underline underline-offset-2">
          Build it in Business Boundary Builder™
        </button>{" "}
        and it will appear here for you to follow.
      </p>
    </div>
  )
}

export function MonthlyBoundaryFocusPanel() {
  const { focus, entitled, isLoading, cycleKey, cycleStart, cycleEnd } = useMonthlyBoundaryFocus()
  const [builderOpen, setBuilderOpen] = useState(false)
  const [communicateOpen, setCommunicateOpen] = useState(false)

  if (isLoading || !entitled || !cycleKey) return null

  const start = formatDate(cycleStart)
  const end = formatDate(cycleEnd)

  if (!focus) {
    return (
      <section
        aria-labelledby="monthly-boundary-heading"
        className="flex flex-col gap-3 rounded-3xl border border-[#7FB069]/30 bg-[#F3F8ED] px-6 py-6 sm:px-8"
      >
        <p
          id="monthly-boundary-heading"
          className="inline-flex items-center gap-2 font-montserrat text-xs font-bold uppercase tracking-[0.18em] text-[#5A7A45]"
        >
          <ShieldCheck className="h-4 w-4" aria-hidden /> My Monthly Boundary Focus™
        </p>
        <p className="font-sans text-sm leading-relaxed text-[#3A2E33] text-pretty">
          You haven&apos;t elected this cycle&apos;s boundary yet. Choose it in Monthly Business Boundary Focus™ and
          it will stay here for the full 30 days{start && end ? ` (${start} – ${end})` : ""}.
        </p>
      </section>
    )
  }

  const builderKey = monthlyBuilderKey(cycleKey)

  return (
    <section
      aria-labelledby="monthly-boundary-heading"
      className="flex flex-col gap-5 rounded-3xl border border-[#7FB069]/30 bg-[#F3F8ED] px-6 py-6 shadow-sm transition-shadow duration-700 hover:shadow-[0_24px_50px_-12px_rgba(28,22,26,0.35)] sm:px-8"
    >
      <div className="flex flex-wrap items-center justify-between gap-3">
        <p
          id="monthly-boundary-heading"
          className="inline-flex items-center gap-2 font-montserrat text-xs font-bold uppercase tracking-[0.18em] text-[#5A7A45]"
        >
          <ShieldCheck className="h-4 w-4" aria-hidden /> My Monthly Boundary Focus™
        </p>
        <span className="inline-flex items-center gap-1.5 rounded-full bg-[#5A7A45] px-3 py-1 font-montserrat text-[10px] font-bold uppercase tracking-[0.16em] text-white">
          Active this cycle
        </span>
      </div>

      <div className="flex flex-col gap-2">
        <h2 className="font-serif text-2xl font-semibold text-[#2E1F27] text-balance sm:text-3xl">
          {focus.boundaryText}
        </h2>
        <OperatingRuleBlock
          builderKey={builderKey}
          boundaryText={focus.boundaryText}
          fallbackDescription={focus.ruleDescription}
          onBuild={() => setBuilderOpen(true)}
        />
        {start && end && (
          <p className="inline-flex items-center gap-2 font-sans text-xs text-[#6B5860]">
            <CalendarRange className="h-3.5 w-3.5" aria-hidden />
            30-day cycle: {start} – {end}
          </p>
        )}
      </div>

      <div className="grid gap-3 sm:grid-cols-2">
        <button
          type="button"
          onClick={() => setBuilderOpen(true)}
          className="flex flex-col items-start gap-1 rounded-2xl border border-[#7FB069]/30 bg-background px-5 py-4 text-left shadow-sm transition-shadow duration-500 hover:shadow-[0_18px_36px_-14px_rgba(28,22,26,0.35)]"
        >
          <span className="inline-flex items-center gap-2 font-sans text-sm font-bold text-[#2E1F27]">
            <Hammer className="h-4 w-4 text-[#5A7A45]" aria-hidden /> Business Boundary Builder™
          </span>
          <span className="font-sans text-xs leading-relaxed text-[#6B5860]">
            Build, review, and refine the operating rule for this boundary.
          </span>
        </button>
        <button
          type="button"
          onClick={() => setCommunicateOpen(true)}
          className="flex flex-col items-start gap-1 rounded-2xl border border-[#7FB069]/30 bg-background px-5 py-4 text-left shadow-sm transition-shadow duration-500 hover:shadow-[0_18px_36px_-14px_rgba(28,22,26,0.35)]"
        >
          <span className="inline-flex items-center gap-2 font-sans text-sm font-bold text-[#2E1F27]">
            <MessageSquareShare className="h-4 w-4 text-[#5A7A45]" aria-hidden /> Communicate It™
          </span>
          <span className="font-sans text-xs leading-relaxed text-[#6B5860]">
            Tell the people affected by this boundary what changes and when.
          </span>
        </button>
      </div>

      <BoundaryBuilderDialog
        open={builderOpen}
        onOpenChange={setBuilderOpen}
        weekKey={builderKey}
        boundaryFocusText={focus.boundaryText}
        boundaryOptionId={focus.optionId}
      />
      <CommunicateDelegateDialog
        open={communicateOpen}
        onOpenChange={setCommunicateOpen}
        sourceContext="ceo-workday"
        commitmentId={null}
        commitmentType="operating-rule"
        initialType="boundary"
        commitmentText={focus.boundaryText}
        initialSubjectText={focus.ruleDescription ?? focus.boundaryText}
        initialTiming={end ? `Through ${end}` : "This membership cycle"}
      />
    </section>
  )
}
