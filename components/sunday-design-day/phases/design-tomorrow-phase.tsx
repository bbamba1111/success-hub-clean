"use client"

import { useState } from "react"
import { Check, ChevronDown, Info } from "lucide-react"
import { useSdd } from "@/components/sunday-design-day/sdd-state"
import { GuidanceNote, ReflectField } from "@/components/sunday-design-day/sdd-ui"
import { DESIGN_SEGMENTS, type SegmentCard } from "@/components/sunday-design-day/sdd-config"

export function DesignTomorrowPhase({ readOnly = false }: { readOnly?: boolean }) {
  return (
    <div className="space-y-4">
      {DESIGN_SEGMENTS.map((segment, i) => (
        <SegmentDesigner key={segment.id} segment={segment} defaultOpen={i === 0} readOnly={readOnly} />
      ))}
    </div>
  )
}

function SegmentDesigner({
  segment,
  defaultOpen,
  readOnly,
}: {
  segment: SegmentCard
  defaultOpen: boolean
  readOnly: boolean
}) {
  const { state, dispatch } = useSdd()
  const [open, setOpen] = useState(defaultOpen)
  const design = state.data.segments[segment.id] ?? { rule: "", planner: "", nonNegotiable: "", committed: false }
  const isCeo = Boolean(segment.ceoSections)
  const hasRule = Boolean(design.rule.trim())

  return (
    <section className={`harmony-panel overflow-hidden ${isCeo ? "ring-1 ring-brand-green/20" : ""}`}>
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        aria-expanded={open}
        className="flex w-full items-center justify-between gap-4 px-5 py-4 text-left sm:px-6"
      >
        <span className="flex items-center gap-3">
          <span
            className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-xs font-semibold ${
              design.committed
                ? "bg-brand-green text-white"
                : hasRule
                  ? "border-2 border-brand-green text-brand-green-dark"
                  : "border border-border text-brand-ink-soft"
            }`}
          >
            {design.committed ? <Check className="h-3.5 w-3.5" aria-hidden /> : ""}
          </span>
          <span className="font-display text-base font-semibold tracking-tight text-brand-ink sm:text-lg">
            {segment.title}
          </span>
        </span>
        <ChevronDown
          className={`ds-icon shrink-0 text-brand-ink-soft transition-transform ${open ? "rotate-180" : ""}`}
          aria-hidden
        />
      </button>

      {open && (
        <div className="space-y-5 border-t border-black/[0.06] px-5 pb-6 pt-5 sm:px-6">
          <GuidanceNote>{segment.guidance}</GuidanceNote>

          <ReflectField
            label="Operating Rule™"
            prompt={segment.rulePrompt}
            placeholder="One clear rule you'll operate by…"
            value={design.rule}
            onChange={(v) => dispatch({ type: "SET_SEGMENT", segmentId: segment.id, key: "rule", value: v })}
            readOnly={readOnly}
            rows={2}
          />

          <ReflectField
            label="Planner™"
            prompt={segment.plannerPrompt}
            placeholder="Design this segment in advance…"
            value={design.planner}
            onChange={(v) => dispatch({ type: "SET_SEGMENT", segmentId: segment.id, key: "planner", value: v })}
            readOnly={readOnly}
            rows={2}
          />

          <ReflectField
            label="Daily Non-Negotiable™"
            prompt={segment.nonNegotiablePrompt}
            placeholder={segment.defaultNonNegotiable}
            value={design.nonNegotiable ?? ""}
            onChange={(v) => dispatch({ type: "SET_SEGMENT", segmentId: segment.id, key: "nonNegotiable", value: v })}
            readOnly={readOnly}
            rows={2}
          />

          {segment.ceoSections && <CeoSections readOnly={readOnly} sections={segment.ceoSections} />}

          {!readOnly && (
            <div className="flex items-center justify-end">
              <button
                type="button"
                onClick={() => dispatch({ type: "TOGGLE_SEGMENT_COMMIT", segmentId: segment.id })}
                disabled={!hasRule}
                className={`inline-flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-semibold transition-colors ${
                  design.committed
                    ? "bg-brand-green/12 text-brand-green-dark"
                    : hasRule
                      ? "bg-brand-green text-white hover:bg-brand-green/90"
                      : "cursor-not-allowed bg-muted text-brand-ink-soft/60"
                }`}
              >
                <Check className="ds-icon-sm" aria-hidden />
                {design.committed ? "Committed" : "Commit this segment"}
              </button>
            </div>
          )}
        </div>
      )}
    </section>
  )
}

function CeoSections({
  sections,
  readOnly,
}: {
  sections: NonNullable<SegmentCard["ceoSections"]>
  readOnly: boolean
}) {
  const { state, dispatch } = useSdd()
  return (
    <div className="rounded-xl border border-brand-green/20 bg-brand-green/[0.04] p-4 sm:p-5">
      <p className="ds-eyebrow text-brand-green-dark/80">CEO Workday Blocks™</p>
      <ol className="mt-4 space-y-4">
        {sections.map((section, i) => (
          <li key={section.id} className="flex gap-3">
            <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-brand-green/12 text-xs font-semibold text-brand-green-dark">
              {i + 1}
            </span>
            <div className="flex-1">
              <p className="font-display text-sm font-semibold text-brand-ink">{section.title}</p>
              <p className="mt-0.5 text-sm leading-relaxed text-brand-ink-soft">{section.description}</p>
              {section.informational ? (
                <p className="mt-2 inline-flex items-center gap-1.5 rounded-md bg-muted px-2.5 py-1 text-xs font-medium text-brand-ink-soft">
                  <Info className="h-3.5 w-3.5" aria-hidden />
                  Recommendations coming soon
                </p>
              ) : (
                <textarea
                  value={state.data.ceo[section.id] ?? ""}
                  onChange={(e) => dispatch({ type: "SET_CEO", sectionId: section.id, value: e.target.value })}
                  readOnly={readOnly}
                  rows={2}
                  aria-label={section.title}
                  placeholder={`Design your ${section.title}…`}
                  className="mt-2 w-full resize-y rounded-lg border border-black/[0.08] bg-card px-3 py-2 text-sm leading-relaxed text-brand-ink placeholder:text-brand-ink-soft/50 focus:border-brand-green focus:outline-none focus:ring-2 focus:ring-brand-green/20"
                />
              )}
            </div>
          </li>
        ))}
      </ol>
    </div>
  )
}
