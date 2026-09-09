"use client"

/**
 * Handoff Education™ panel (Phase 12)
 * ---------------------------------------------------------------------------
 * Shown only for the 5 external/capacity Build Paths™ (delegate, hire,
 * outsource, buy, partner) — from `deriveHandoffEducation()`.
 */

import { UserCheck } from "lucide-react"

import type { HandoffEducation } from "@/lib/founder-guidance/types"

const NOT_DETERMINED = "Not yet determined"

function Field({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl border border-brand-blush/60 bg-brand-cream/60 px-3.5 py-2.5">
      <p className="font-sans text-[10px] font-bold uppercase tracking-[0.14em] text-brand-ink-soft/80 mb-0.5">{label}</p>
      <p className={`font-sans text-sm font-semibold leading-snug text-pretty ${value === NOT_DETERMINED ? "italic text-brand-ink-soft/70" : "text-brand-ink"}`}>
        {value}
      </p>
    </div>
  )
}

export function HandoffEducationPanel({ education }: { education: HandoffEducation }) {
  return (
    <div className="rounded-2xl border border-brand-blush/60 bg-white px-5 py-5 sm:px-6 sm:py-6">
      <div className="flex items-center gap-2.5 mb-4">
        <UserCheck className="h-4 w-4 text-[#C13B6B]" aria-hidden />
        <h3 className="font-sans text-sm font-semibold text-brand-ink">Handoff Education™</h3>
      </div>
      <div className="grid grid-cols-1 gap-2.5 sm:grid-cols-2 mb-4">
        <Field label="Role / Type" value={education.roleOrType} />
        <Field label="Budget Estimate" value={education.budgetEstimate} />
        <Field label="Timeline Estimate" value={education.timelineEstimate} />
        <Field label="Handoff Done When" value={education.handoffDefinitionOfDone} />
      </div>
      {education.scopeItems.length > 0 && (
        <div className="rounded-xl border border-brand-blush/60 bg-brand-cream/40 px-4 py-3 mb-3">
          <p className="font-sans text-[10px] font-bold uppercase tracking-[0.14em] text-brand-ink-soft/80 mb-1.5">What Gets Handed Off</p>
          <ul className="space-y-1">
            {education.scopeItems.map((item, i) => (
              <li key={i} className="font-sans text-sm text-brand-ink">
                {item}
              </li>
            ))}
          </ul>
        </div>
      )}
      {education.founderRetains.length > 0 && (
        <div className="rounded-xl border border-brand-blush/60 bg-brand-cream/40 px-4 py-3">
          <p className="font-sans text-[10px] font-bold uppercase tracking-[0.14em] text-brand-ink-soft/80 mb-1.5">You Retain</p>
          <ul className="space-y-1">
            {education.founderRetains.map((item, i) => (
              <li key={i} className="font-sans text-sm text-brand-ink">
                {item}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  )
}
