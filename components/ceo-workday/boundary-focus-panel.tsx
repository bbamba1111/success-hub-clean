"use client"

/**
 * This Week's Boundary Focus™ — inside the 4-Hour Focused CEO Workday™.
 *
 * The founder has exactly ONE Weekly Work-Life Balance Boundary Focus™ to
 * operationalize this week (separate from their unlimited Life Priorities™ and
 * the three Weekly CEO Priorities™). This section lets the founder CHOOSE or
 * CHANGE that single boundary right here (the same choices offered in Decide &
 * Design™), then opens the Weekly Work-Life Balance Boundary Builder™ to turn
 * it into a Human SOS™. It is a NEW section — it does not replace the three CEO
 * priority boxes.
 */

import { useState } from "react"
import { ArrowRight, Check, Plus, ShieldCheck } from "lucide-react"

import { useWeeklyBoundaryFocus } from "@/lib/weekly-boundary-focus/use-weekly-boundary-focus"
import { useHumanSos } from "@/lib/human-sos/use-human-sos"
import { BOUNDARY_OPTIONS } from "@/lib/weekly-boundary-focus/catalog"
import { BoundaryBuilderDialog } from "@/components/boundary-builder/boundary-builder-dialog"

export function BoundaryFocusPanel() {
  const { focus, save, isLoading } = useWeeklyBoundaryFocus()
  const boundaryText = focus.boundaryText?.trim() || ""
  const { sos } = useHumanSos(focus.weekKey, boundaryText)
  const [open, setOpen] = useState(false)

  // Chooser state — the founder can pick or change the boundary right here.
  const [choosing, setChoosing] = useState(false)
  const [customMode, setCustomMode] = useState(false)
  const [customDraft, setCustomDraft] = useState("")

  function chooseBoundary(text: string, optionId: string) {
    const value = text.trim()
    if (!value) return
    void save({ boundaryText: value, optionId, sourceContext: null, status: "chosen" })
    setChoosing(false)
    setCustomMode(false)
    setCustomDraft("")
  }

  const headingRow = (
    <div className="flex items-center gap-2.5">
      <ShieldCheck className="h-5 w-5 text-[#5A7A45]" aria-hidden />
      <p
        id="boundary-focus-heading"
        className="font-montserrat text-xs font-bold uppercase tracking-[0.18em] text-[#5A7A45]"
      >
        This Week&apos;s Boundary Focus™
      </p>
    </div>
  )

  const chooser = (
    <div className="space-y-3">
      <p className="font-sans text-sm leading-relaxed text-[#6B5860] text-pretty">
        Choose the one Work-Life Balance Boundary Focus™ you&apos;ll build into the business and live this week. You can
        also set or change it in Decide &amp; Design™.
      </p>
      <div className="space-y-2">
        {BOUNDARY_OPTIONS.map((o) => {
          const active = focus.optionId === o.id && boundaryText === o.label
          return (
            <button
              key={o.id}
              type="button"
              onClick={() => chooseBoundary(o.label, o.id)}
              className={
                "flex w-full flex-col items-start rounded-2xl border px-4 py-3 text-left transition-colors " +
                (active ? "border-[#5A7A45] bg-[#F3F8ED]" : "border-[#E8DFE2] bg-white hover:bg-black/[0.03]")
              }
            >
              <span className="font-sans text-sm font-semibold text-[#2E1F27]">{o.label}</span>
              <span className="font-sans text-xs text-[#6B5860]">{o.helper}</span>
            </button>
          )
        })}
      </div>

      {customMode ? (
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center pt-1">
          <input
            type="text"
            value={customDraft}
            onChange={(e) => setCustomDraft(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.nativeEvent.isComposing && e.keyCode !== 229)
                chooseBoundary(customDraft, "custom")
            }}
            placeholder="Name the boundary in your own words…"
            aria-label="Create my own boundary"
            className="flex-1 rounded-xl border border-[#E8DFE2] bg-white px-3.5 py-2.5 font-sans text-sm text-[#2E1F27] placeholder:text-[#6B5860]/60 focus:outline-none focus:ring-2 focus:ring-[#8DAE72]/30"
          />
          <button
            type="button"
            onClick={() => chooseBoundary(customDraft, "custom")}
            disabled={!customDraft.trim()}
            className="rounded-full bg-[#5A7A45] px-5 py-2.5 font-sans text-sm font-semibold text-white hover:opacity-90 disabled:opacity-40"
          >
            Use this
          </button>
        </div>
      ) : (
        <div className="flex flex-wrap items-center gap-2 pt-1">
          <button
            type="button"
            onClick={() => setCustomMode(true)}
            className="inline-flex items-center gap-1.5 rounded-full border border-[#E8DFE2] bg-white px-5 py-2.5 font-sans text-sm font-semibold text-[#3A2E33] hover:bg-black/[0.03]"
          >
            <Plus className="h-4 w-4" aria-hidden /> Create my own
          </button>
          {boundaryText && (
            <button
              type="button"
              onClick={() => {
                setChoosing(false)
                setCustomMode(false)
              }}
              className="font-sans text-sm text-[#6B5860] hover:text-[#2E1F27]"
            >
              Cancel
            </button>
          )}
        </div>
      )}
    </div>
  )

  // Loading the persisted weekly record — don't flash the chooser as if
  // nothing was selected before we know whether a boundary exists.
  if (isLoading && !boundaryText && !choosing) {
    return (
      <section
        aria-labelledby="boundary-focus-heading"
        className="rounded-3xl border border-[#8DAE72]/30 bg-[#F4F7F0] px-6 py-7 sm:px-8 space-y-4"
      >
        {headingRow}
        <div className="h-5 w-2/3 animate-pulse rounded-full bg-[#8DAE72]/20" />
        <div className="h-5 w-1/3 animate-pulse rounded-full bg-[#8DAE72]/20" />
      </section>
    )
  }

  // No boundary chosen yet, or the founder is actively choosing a different one.
  if (!boundaryText || choosing) {
    return (
      <section
        aria-labelledby="boundary-focus-heading"
        className="rounded-3xl border border-[#8DAE72]/30 bg-[#F4F7F0] px-6 py-7 sm:px-8 space-y-4"
      >
        {headingRow}
        {chooser}
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
        {headingRow}
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
        <div className="flex flex-wrap items-center gap-3">
          <button
            type="button"
            onClick={() => setOpen(true)}
            className="inline-flex items-center gap-2 rounded-full bg-[#5A7A45] px-6 py-3 font-montserrat text-xs font-bold uppercase tracking-[0.14em] text-white transition-opacity hover:opacity-90"
          >
            {sos.id && status === "building" ? "Continue Building My Human SOS™" : "Build My Human SOS™"}
            <ArrowRight className="h-4 w-4" aria-hidden />
          </button>
          <button
            type="button"
            onClick={() => {
              setChoosing(true)
              setCustomMode(false)
            }}
            className="inline-flex items-center gap-1.5 font-sans text-sm font-semibold text-[#5A7A45] hover:underline"
          >
            <Check className="h-4 w-4" aria-hidden />
            Change this week&apos;s boundary
          </button>
        </div>
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
