"use client"

/**
 * This Week's Boundary Focus™ — inside the 4-Hour Focused CEO Workday™.
 *
 * The founder has exactly ONE Weekly Work-Life Balance Boundary Focus™ to
 * operationalize this week (separate from their unlimited Life Priorities™ and
 * the three Weekly CEO Priorities™). This section displays that single
 * boundary and opens the Weekly Work-Life Balance Boundary Builder™ to turn it
 * into a Human SOS™. It is a NEW section — it does not replace the three CEO
 * priority boxes.
 */

import { useState } from "react"
import { ArrowRight, ShieldCheck } from "lucide-react"

import { useWeeklyBoundaryFocus } from "@/lib/weekly-boundary-focus/use-weekly-boundary-focus"
import { useHumanSos } from "@/lib/human-sos/use-human-sos"
import { BoundaryBuilderDialog } from "@/components/boundary-builder/boundary-builder-dialog"

export function BoundaryFocusPanel() {
  const { focus } = useWeeklyBoundaryFocus()
  const boundaryText = focus.boundaryText?.trim() || ""
  const { sos } = useHumanSos(focus.weekKey, boundaryText)
  const [open, setOpen] = useState(false)

  // No boundary chosen yet — the founder chooses it in Decide & Design.
  if (!boundaryText) {
    return (
      <section
        aria-labelledby="boundary-focus-heading"
        className="rounded-3xl border border-[#8DAE72]/30 bg-[#F4F7F0] px-6 py-7 sm:px-8 space-y-3"
      >
        <div className="flex items-center gap-2.5">
          <ShieldCheck className="h-5 w-5 text-[#5A7A45]" aria-hidden />
          <p
            id="boundary-focus-heading"
            className="font-montserrat text-xs font-bold uppercase tracking-[0.18em] text-[#5A7A45]"
          >
            This Week&apos;s Boundary Focus™
          </p>
        </div>
        <p className="font-sans text-sm leading-relaxed text-[#6B5860] text-pretty">
          You haven&apos;t chosen this week&apos;s single Work-Life Balance Boundary Focus™ yet. Choose it in Decide
          &amp; Design™ and it will appear here to build into a Human SOS™.
        </p>
      </section>
    )
  }

  const status = sos.status
  const isActive = status === "active"
  const statusLabel =
    status === "active"
      ? "Human SOS™ Active"
      : status === "ready"
        ? "Ready to Adopt"
        : status === "building" && sos.id
          ? "Building"
          : "Not Built"

  return (
    <section
      aria-labelledby="boundary-focus-heading"
      className={
        "rounded-3xl border px-6 py-7 sm:px-8 space-y-5 " +
        (isActive ? "border-[#7FB069]/50 bg-white" : "border-[#8DAE72]/30 bg-[#F4F7F0]")
      }
    >
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-2.5">
          <ShieldCheck className="h-5 w-5 text-[#5A7A45]" aria-hidden />
          <p
            id="boundary-focus-heading"
            className="font-montserrat text-xs font-bold uppercase tracking-[0.18em] text-[#5A7A45]"
          >
            This Week&apos;s Boundary Focus™
          </p>
        </div>
        <span
          className={
            "shrink-0 inline-flex items-center rounded-full px-3 py-1 font-montserrat text-[10px] font-bold uppercase tracking-[0.12em] " +
            (isActive ? "bg-[#8DAE72]/20 text-[#5A7A45]" : "bg-white text-[#6B5860]")
          }
        >
          {statusLabel}
        </span>
      </div>

      <p className="font-display text-2xl font-semibold leading-snug text-[#2E1F27] text-pretty">{boundaryText}</p>

      {isActive ? (
        <div className="space-y-2">
          <p className="font-sans text-sm leading-relaxed text-[#3A2E33] text-pretty">
            This boundary is now a Human Sustainability Operating Standard™. Live it this week — the following
            Monday&apos;s Reality Check™ will evaluate how it held.
          </p>
          <button
            type="button"
            onClick={() => setOpen(true)}
            className="inline-flex items-center gap-1.5 font-sans text-sm font-bold text-[#5A7A45] hover:underline"
          >
            View my Human SOS™
            <ArrowRight className="h-4 w-4" aria-hidden />
          </button>
        </div>
      ) : (
        <button
          type="button"
          onClick={() => setOpen(true)}
          className="inline-flex items-center gap-2 rounded-full bg-[#5A7A45] px-6 py-3 font-montserrat text-xs font-bold uppercase tracking-[0.14em] text-white transition-opacity hover:opacity-90"
        >
          {sos.id && status === "building" ? "Continue Building My Human SOS™" : "Build My Human SOS™"}
          <ArrowRight className="h-4 w-4" aria-hidden />
        </button>
      )}

      <BoundaryBuilderDialog
        open={open}
        onOpenChange={setOpen}
        weekKey={focus.weekKey}
        boundaryFocusText={boundaryText}
        boundaryOptionId={focus.optionId}
      />
    </section>
  )
}
