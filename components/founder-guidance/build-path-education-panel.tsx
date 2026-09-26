"use client"

/**
 * Build Path Education™ panel (Phase 12)
 * ---------------------------------------------------------------------------
 * The 9-field explanation of what the currently selected Build Path™ means
 * in practice — from `deriveBuildPathEducation()`.
 */

import { Signpost } from "lucide-react"

import type { BuildPathEducation } from "@/lib/founder-guidance/types"

function Row({ label, value, unknown = false }: { label: string; value: string; unknown?: boolean }) {
  return (
    <div className="border-b border-brand-blush/50 pb-3 last:border-0 last:pb-0">
      <p className="font-sans text-xs font-bold text-brand-ink">{label}</p>
      <p className={`mt-1 font-sans text-sm leading-relaxed text-pretty ${unknown ? "italic text-brand-ink-soft/70" : "text-brand-ink-soft"}`}>
        {value}
      </p>
    </div>
  )
}

export function BuildPathEducationPanel({ education }: { education: BuildPathEducation }) {
  return (
    <div className="rounded-2xl border border-brand-blush/60 bg-white px-5 py-5 sm:px-6 sm:py-6">
      <div className="flex items-center gap-2.5 mb-4">
        <Signpost className="h-4 w-4 text-[#C13B6B]" aria-hidden />
        <h3 className="font-sans text-sm font-semibold text-brand-ink">Understanding "{education.label}"</h3>
      </div>
      <div className="space-y-3">
        <Row label="What This Means" value={education.whatItMeans} />
        <Row label="When It Fits Best" value={education.whenItFitsBest} />
        <Row label="When To Avoid It" value={education.whenToAvoid} />
        <Row label="Founder Input Needed" value={education.founderInputNeeded} />
        <Row label="Time Commitment" value={education.timeCommitment.value} unknown={education.timeCommitment.status === "unknown"} />
        <Row label="Cost Implication" value={education.costImplication.value} unknown={education.costImplication.status === "unknown"} />
        <Row label="Risk Level" value={education.riskLevel} />
        <Row label="How To Start" value={education.howToStart} />
      </div>
    </div>
  )
}
