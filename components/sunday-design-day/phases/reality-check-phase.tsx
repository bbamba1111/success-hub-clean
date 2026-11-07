"use client"

import { Check, CalendarClock } from "lucide-react"
import { useSdd } from "@/components/sunday-design-day/sdd-state"
import { ReflectField, PhaseHeading } from "@/components/sunday-design-day/sdd-ui"
import {
  WEEKLY_REVIEW_FIELDS,
  FOCUS_AREA_OPTIONS,
  MAX_FOCUS_AREAS,
  TWENTY_EIGHT_DAY_REVIEW_ITEMS,
} from "@/components/sunday-design-day/sdd-config"

export function RealityCheckPhase({ readOnly = false }: { readOnly?: boolean }) {
  const { state, dispatch } = useSdd()
  const { weekly, focusAreas } = state.data
  const atLimit = focusAreas.length >= MAX_FOCUS_AREAS

  return (
    <div className="space-y-8">
      {/* Weekly Review™ */}
      <section className="space-y-5">
        <PhaseHeading note="A gentle reflection on the week that's ending.">Weekly Review™</PhaseHeading>
        <div className="grid gap-5 sm:grid-cols-2">
          {WEEKLY_REVIEW_FIELDS.map((field) => (
            <div key={field.id} className={field.id === "declaration" ? "sm:col-span-2" : ""}>
              <ReflectField
                label={field.label}
                prompt={field.prompt}
                placeholder={field.placeholder}
                value={weekly[field.id]}
                onChange={(v) => dispatch({ type: "UPDATE_WEEKLY", field: field.id, value: v })}
                readOnly={readOnly}
                rows={field.id === "declaration" ? 2 : 3}
              />
            </div>
          ))}
        </div>
      </section>

      {/* Priority Focus Areas™ */}
      <section className="space-y-4 border-t border-black/[0.06] pt-7">
        <PhaseHeading note={`Choose the few areas that deserve your focused energy this week (up to ${MAX_FOCUS_AREAS}).`}>
          Select 1–3 Priority Focus Areas™
        </PhaseHeading>
        <p className="text-sm font-medium text-brand-green-dark">{focusAreas.length} selected</p>
        <div className="flex flex-wrap gap-2">
          {FOCUS_AREA_OPTIONS.map((area) => {
            const selected = focusAreas.includes(area.id)
            const disabled = readOnly || (!selected && atLimit)
            return (
              <button
                key={area.id}
                type="button"
                disabled={disabled}
                onClick={() => dispatch({ type: "TOGGLE_FOCUS_AREA", id: area.id })}
                aria-pressed={selected}
                className={`inline-flex items-center gap-1.5 rounded-full border px-3.5 py-2 text-sm font-medium transition-colors ${
                  selected
                    ? "border-brand-green bg-brand-green/10 text-brand-green-dark"
                    : disabled
                      ? "cursor-not-allowed border-border text-brand-ink-soft/50"
                      : "border-border text-brand-ink-soft hover:border-brand-green/50 hover:text-brand-ink"
                }`}
              >
                {selected && <Check className="h-3.5 w-3.5" aria-hidden />}
                {area.label}
              </button>
            )
          })}
        </div>
      </section>

      {/* 28-Day Operating System Review™ — inactive placeholder */}
      <section className="border-t border-black/[0.06] pt-7">
        <div className="flex items-center gap-2">
          <CalendarClock className="ds-icon-sm text-brand-ink-soft" aria-hidden />
          <PhaseHeading>28-Day Operating System Review™</PhaseHeading>
        </div>
        <p className="mt-1 text-sm leading-relaxed text-brand-ink-soft">
          A deeper review that opens on every fourth Sunday, anchored to your first installed week.
        </p>
        <div className="mt-4 grid gap-4 sm:grid-cols-2">
          {TWENTY_EIGHT_DAY_REVIEW_ITEMS.map((item) => (
            <div key={item.title} className="harmony-surface flex flex-col p-5 opacity-75">
              <div className="flex items-start justify-between gap-2">
                <h4 className="font-display text-base font-semibold text-brand-ink text-pretty">{item.title}</h4>
                <span className="ds-badge-neutral shrink-0">Every 4th Sunday</span>
              </div>
              <p className="mt-2 text-sm leading-relaxed text-brand-ink-soft">{item.description}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  )
}
